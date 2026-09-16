package com.prestige.authentication.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "account")
public class Account {
    @Id
    @Column(name = "account_number")
    private String accountNumber;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "transaction_password_hash")
    private String transactionPasswordHash;

    public Long getCustomerId() {
        return customerId;
    }

    public String getTransactionPasswordHash() {
        return transactionPasswordHash;
    }

    public void setTransactionPasswordHash(String value) {
        transactionPasswordHash = value;
    }
}
