package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Provides card queries that are always anchored to the owning customer/account.
 * Those query methods support authorization checks before card data is returned or changed.
 */
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findAllByAccount_Customer_CustomerIdOrderByCardIdAsc(Long customerId);
    List<Card> findAllByAccount_Customer_CustomerIdAndAccount_AccountNumberOrderByCardIdAsc(Long customerId, String accountNumber);
    Optional<Card> findByCardIdAndAccount_Customer_CustomerId(Long cardId, Long customerId);
}
