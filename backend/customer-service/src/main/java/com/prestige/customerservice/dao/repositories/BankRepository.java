package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Supplies persistence operations for bank and branch reference data.
 * Standard JpaRepository methods are sufficient because no custom query is required here.
 */
public interface BankRepository extends JpaRepository<Bank,Long> {
}
