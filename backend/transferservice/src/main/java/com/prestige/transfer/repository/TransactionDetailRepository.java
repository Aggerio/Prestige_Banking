package com.prestige.transfer.repository;
import com.prestige.transfer.domain.TransactionDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.prestige.transfer.domain.enums.TransactionType;
import java.time.LocalDateTime;
public interface TransactionDetailRepository extends JpaRepository<TransactionDetail, Long> {
    Page<TransactionDetail> findByAccountNumberOrderByTransactionAtDesc(String accountNumber, Pageable pageable);

    @Query("""
            select t from TransactionDetail t
            where t.accountNumber = :accountNumber
              and (:transactionType is null or t.transactionType = :transactionType)
              and (:from is null or t.transactionAt >= :from)
              and (:to is null or t.transactionAt <= :to)
            order by t.transactionAt desc
            """)
    Page<TransactionDetail> findActivity(
            @Param("accountNumber") String accountNumber,
            @Param("transactionType") TransactionType transactionType,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    java.util.List<TransactionDetail> findByAccountNumberAndTransactionAtGreaterThanEqualOrderByTransactionAtAsc(
            String accountNumber, LocalDateTime from);
}
