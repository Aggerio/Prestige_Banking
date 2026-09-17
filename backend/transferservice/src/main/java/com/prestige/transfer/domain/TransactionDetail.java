package com.prestige.transfer.domain;

import com.prestige.transfer.domain.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "transaction_details",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_transaction_transfer_type",
                columnNames = {"transfer_id", "transaction_type"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TransactionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "transfer_id", nullable = false)
    private Long transferId;

    @Column(name = "reference_number", nullable = false)
    private String referenceNumber;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "transaction_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal transactionAmount;

    @Column(name = "transaction_at", nullable = false)
    private LocalDateTime transactionAt;

    @Column(name = "bank_id", nullable = false)
    private Long bankId;

    @Column(name = "ifsc_code", nullable = false)
    private String ifscCode;

    @Column
    private String remarks;

    public TransactionDetail(
            Long transferId,
            String reference,
            Account account,
            TransactionType type,
            BigDecimal amount,
            LocalDateTime at,
            String remarks
    ) {
        this.transferId = transferId;
        this.referenceNumber = reference;
        this.accountNumber = account.getAccountNumber();
        this.transactionType = type;
        this.transactionAmount = amount;
        this.transactionAt = at;
        this.bankId = account.getBankId();
        this.ifscCode = account.getIfscCode();
        this.remarks = remarks;
    }
}