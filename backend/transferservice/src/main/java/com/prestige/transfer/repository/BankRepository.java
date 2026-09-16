package com.prestige.transfer.repository;
import com.prestige.transfer.domain.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
public interface BankRepository extends JpaRepository<Bank, Long> { }
