package com.prestige.customerservice.dao.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prestige.customerservice.dao.entities.Account;

public interface AccountRepository extends JpaRepository<Account,String> {
    Optional<Object> findByCustomer_CustomerId(Long customerId);
}
