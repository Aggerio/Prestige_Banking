package com.prestige.customerservice.dao.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prestige.customerservice.dao.entities.Account;

public interface AccountRepository extends JpaRepository<Account,String> {
    List<Account> findAllByCustomer_CustomerIdOrderByAccountCreatedAtAsc(Long customerId);
}
