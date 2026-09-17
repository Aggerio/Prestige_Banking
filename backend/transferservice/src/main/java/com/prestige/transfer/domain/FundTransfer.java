package com.prestige.transfer.domain;

import com.prestige.transfer.domain.enums.TransferStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "fund_transfer",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_transfer_idempotency",
                columnNames = {"source_account_number", "idempotency_key"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FundTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    private Long transferId;

    @Column(name = "idempotency_key", nullable = false)
    private String idempotencyKey;

    @Column(name = "source_account_number", nullable = false)
    private String sourceAccountNumber;

    @Column(name = "destination_account_number", nullable = false)
    private String destinationAccountNumber;

    @Column(name = "destination_name", nullable = false)
    private String destinationName;

    @Column(name = "destination_ifsc_code", nullable = false)
    private String destinationIfscCode;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "reference_number", nullable = false, unique = true)
    private String referenceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferStatus status;

    @Column(name = "request_hash", nullable = false, length = 64)
    private String requestHash;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public FundTransfer(
            String key,
            String source,
            String destination,
            String name,
            String ifsc,
            BigDecimal amount,
            String reference,
            String hash,
            LocalDateTime now
    ) {
        this.idempotencyKey = key;
        this.sourceAccountNumber = source;
        this.destinationAccountNumber = destination;
        this.destinationName = name;
        this.destinationIfscCode = ifsc;
        this.amount = amount;
        this.referenceNumber = reference;
        this.requestHash = hash;
        this.createdAt = now;
        this.completedAt = now;
        this.status = TransferStatus.COMPLETED;
    }
}