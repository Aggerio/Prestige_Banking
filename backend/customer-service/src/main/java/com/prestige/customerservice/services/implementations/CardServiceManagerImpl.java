package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Card;
import com.prestige.customerservice.dao.repositories.AccountRepository;
import com.prestige.customerservice.dao.repositories.CardRepository;
import com.prestige.customerservice.dtos.CardQuery;
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
            result = cards.findAllByAccount_Customer_CustomerIdOrderByCardIdAsc(customerId);
        } else {
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

    private CardQuery toQuery(Card card) {
        var account = card.getAccount();
        return new CardQuery(card.getCardId(), card.getMaskedPan(), card.getCardType().name(),
                card.getCardholderName(), card.getExpiryMonth(), card.getExpiryYear(), card.getCardStatus().name(),
                account.getAccountNumber(), account.getAccountType().name(), account.getAvailableBalance());
    }
}
