package com.prestige.transfer.repository;
import com.prestige.transfer.domain.TransactionDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TransactionDetailRepository extends JpaRepository<TransactionDetail, Long> {
    Page<TransactionDetail> findByAccountNumberOrderByTransactionAtDesc(String accountNumber, Pageable pageable);
}
