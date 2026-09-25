package com.prestige.customerservice.dao.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prestige.customerservice.dao.entities.Account;

/**
 * Persists account records and provides customer-scoped account lookups.
 * Query method names encode ownership constraints used by the service layer.
 */
public interface AccountRepository extends JpaRepository<Account,String> {
    List<Account> findAllByCustomer_CustomerIdOrderByAccountCreatedAtAsc(Long customerId);
}
