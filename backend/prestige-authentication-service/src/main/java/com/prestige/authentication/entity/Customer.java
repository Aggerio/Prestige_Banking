package com.prestige.authentication.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "login_password_hash")
    private String loginPasswordHash;
    @Column
    private String status;

    public Long getCustomerId() {
        return customerId;
    }

    public String getLoginPasswordHash() {
        return loginPasswordHash;
    }

    public void setLoginPasswordHash(String value) {
        loginPasswordHash = value;
    }

    public String getStatus() {
        return status;
    }
}
