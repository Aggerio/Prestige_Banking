package com.prestige.transfer.repository;
import com.prestige.transfer.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumberAndCustomerId(String accountNumber, Long customerId);
}
