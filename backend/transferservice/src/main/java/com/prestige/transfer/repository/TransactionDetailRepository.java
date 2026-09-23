package com.prestige.transfer.repository;
import com.prestige.transfer.domain.TransactionDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.prestige.transfer.domain.enums.TransactionType;
import com.prestige.transfer.domain.enums.TransferStatus;
import java.time.LocalDateTime;
public interface TransactionDetailRepository extends JpaRepository<TransactionDetail, Long> {
    Page<TransactionDetail> findByAccountNumberOrderByTransactionAtDesc(String accountNumber, Pageable pageable);
    Page<TransactionDetail> findByAccountNumberAndTransactionTypeOrderByTransactionAtDesc(
            String accountNumber, TransactionType transactionType, Pageable pageable);

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

    @Query("""
            select t from TransactionDetail t
            where t.accountNumber = :accountNumber
              and t.transactionAt >= :from
              and t.transactionAt < :to
              and exists (
                  select f.transferId from FundTransfer f
                  where f.transferId = t.transferId
                    and f.status = :status
              )
            order by t.transactionAt asc
            """)
    java.util.List<TransactionDetail> findCompletedActivity(
            @Param("accountNumber") String accountNumber,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") TransferStatus status);
}
