package com.prestige.customerservice.dao.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
public class Account {

    @Id
    @Column(name = "account_number", length = 25)
    private String accountNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "bank_id", nullable = false)
    private Long bankId;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    private AccountType accountType;

    @Column(name = "ifsc_code", nullable = false, length = 20)
    private String ifscCode;

    @Column(name = "transaction_password_hash", nullable = false, length = 255)
    private String transactionPasswordHash;

    @Column(name = "account_created_at", nullable = false)
    private LocalDateTime accountCreatedAt;

    @Column(name = "transfer_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal transferLimit;

    @Column(name = "minimum_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal minimumBalance;

    @Column(name = "available_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal availableBalance;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 20)
    private AccountStatus accountStatus;

    public enum AccountType {
        SAVINGS,
        CURRENT,
        SALARY
    }

    public enum AccountStatus {
        ACTIVE,
        INACTIVE,
        FROZEN
    }
}