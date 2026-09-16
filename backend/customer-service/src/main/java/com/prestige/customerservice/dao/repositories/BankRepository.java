package com.prestige.customerservice.dao.repositories;

import com.prestige.customerservice.dao.entities.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank,Long> {
}
