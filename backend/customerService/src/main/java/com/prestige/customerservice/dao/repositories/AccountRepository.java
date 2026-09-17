package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Long> {
    Optional<Object> findByCustomer_CustomerId(Long customerId);
}
