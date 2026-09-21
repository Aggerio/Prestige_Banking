package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Card;
import com.prestige.customerservice.dao.repositories.AccountRepository;
import com.prestige.customerservice.dao.repositories.CardRepository;
import com.prestige.customerservice.dtos.CardQuery;
import com.prestige.customerservice.services.abstractions.CardServiceManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CardServiceManagerImpl implements CardServiceManager {
    private final CardRepository cards;
    private final AccountRepository accounts;

    public CardServiceManagerImpl(CardRepository cards, AccountRepository accounts) {
        this.cards = cards;
        this.accounts = accounts;
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

    private CardQuery toQuery(Card card) {
        var account = card.getAccount();
        return new CardQuery(card.getCardId(), card.getMaskedPan(), card.getCardType().name(),
                card.getCardholderName(), card.getExpiryMonth(), card.getExpiryYear(), card.getCardStatus().name(),
                account.getAccountNumber(), account.getAccountType().name(), account.getAvailableBalance());
    }
}
