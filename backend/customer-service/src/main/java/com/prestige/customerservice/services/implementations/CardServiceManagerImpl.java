package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Card;
import com.prestige.customerservice.dao.repositories.AccountRepository;
import com.prestige.customerservice.dao.repositories.CardRepository;
import com.prestige.customerservice.dtos.CardQuery;
import com.prestige.customerservice.dtos.CardNumberQuery;
import com.prestige.customerservice.dtos.CardNumberRevealRequest;
import com.prestige.customerservice.dtos.CardStatusRequest;
import com.prestige.customerservice.services.abstractions.CardServiceManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
/**
 * Implements card access and state changes while enforcing account ownership.
 * Sensitive card-number reveal requests additionally require transaction-password verification.
 */
public class CardServiceManagerImpl implements CardServiceManager {
    private final CardRepository cards;
    private final AccountRepository accounts;
    private final PasswordEncoder passwordEncoder;

    public CardServiceManagerImpl(CardRepository cards, AccountRepository accounts, PasswordEncoder passwordEncoder) {
        this.cards = cards;
        this.accounts = accounts;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<CardQuery> getMyCards(Long customerId, String accountNumber) {
        List<Card> result;
        if (accountNumber == null || accountNumber.isBlank()) {
            // Without a filter, return cards from all accounts owned by this customer.
            result = cards.findAllByAccount_Customer_CustomerIdOrderByCardIdAsc(customerId);
        } else {
            // Check ownership before querying by account number to prevent cross-customer access.
            boolean owned = accounts.findAllByCustomer_CustomerIdOrderByAccountCreatedAtAsc(customerId).stream()
                    .anyMatch(account -> account.getAccountNumber().equals(accountNumber));
            if (!owned) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not owned by customer");
            }
            result = cards.findAllByAccount_Customer_CustomerIdAndAccount_AccountNumberOrderByCardIdAsc(customerId, accountNumber);
        }
        return result.stream().map(this::toQuery).toList();
    }

    @Override
    @Transactional
    public CardQuery changeStatus(Long customerId, Long cardId, CardStatusRequest request) {
        Card card = cards.findByCardIdAndAccount_Customer_CustomerId(cardId, customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));
        if (!passwordEncoder.matches(request.transactionPassword(), card.getAccount().getTransactionPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid transaction password");
        }
        if (card.getCardStatus() == Card.CardStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Expired cards cannot be changed");
        }

        Card.CardStatus status;
        try {
            status = Card.CardStatus.valueOf(request.status().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be ACTIVE or BLOCKED");
        }
        if (status == Card.CardStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expired cards cannot be reactivated");
        }
        card.changeStatus(status);
        return toQuery(cards.save(card));
    }

    @Override
    public CardNumberQuery revealCardNumber(Long customerId, Long cardId, CardNumberRevealRequest request) {
        Card card = cards.findByCardIdAndAccount_Customer_CustomerId(cardId, customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));
        if (!passwordEncoder.matches(request.transactionPassword(), card.getAccount().getTransactionPasswordHash())) {
            // Transaction passwords protect card-management operations separately from login.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid transaction password");
        }
        return new CardNumberQuery(card.getUnmaskedPan());
    }

    private CardQuery toQuery(Card card) {
        var account = card.getAccount();
        return new CardQuery(card.getCardId(), card.getMaskedPan(), card.getCardType().name(),
                card.getCardholderName(), card.getExpiryMonth(), card.getExpiryYear(), card.getCardStatus().name(),
                account.getAccountNumber(), account.getAccountType().name(), account.getAvailableBalance());
    }
}
