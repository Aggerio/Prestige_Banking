package com.prestige.transfer.repository;
import com.prestige.transfer.domain.FundTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface FundTransferRepository extends JpaRepository<FundTransfer, Long> {
    Optional<FundTransfer> findBySourceAccountNumberAndIdempotencyKey(String sourceAccountNumber, String idempotencyKey);
    Optional<FundTransfer> findByReferenceNumber(String referenceNumber);
}
