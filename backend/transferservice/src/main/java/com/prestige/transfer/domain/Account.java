package com.prestige.transfer.domain;

import com.prestige.transfer.domain.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "account") @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
    @Id @Column(name = "account_number", length = 25) private String accountNumber;
    @Column(name = "customer_id", nullable = false) private Long customerId;
    @Column(name = "bank_id", nullable = false) private Long bankId;
    @Column(name = "account_type", nullable = false, length = 20) private String accountType;
    @Column(name = "ifsc_code", nullable = false, length = 20) private String ifscCode;
    @Column(name = "transaction_password_hash", nullable = false, length = 255) private String transactionPasswordHash;
    @Column(name = "transfer_limit", nullable = false, precision = 15, scale = 2) private BigDecimal transferLimit;
    @Column(name = "minimum_balance", nullable = false, precision = 15, scale = 2) private BigDecimal minimumBalance;
    @Column(name = "available_balance", nullable = false, precision = 15, scale = 2) private BigDecimal availableBalance;
    @Enumerated(EnumType.STRING) @Column(name = "account_status", nullable = false) private AccountStatus accountStatus;
    public void debit(BigDecimal amount) { availableBalance = availableBalance.subtract(amount); }
    public void credit(BigDecimal amount) { availableBalance = availableBalance.add(amount); }
}
