package com.prestige.authentication.repository;

import com.prestige.authentication.entity.Account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByAccountNumberAndCustomerId(String number, Long customerId);
}
