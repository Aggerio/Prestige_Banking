package com.prestige.authentication.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "password_details")
public class PasswordDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "password_id")
    private Long id;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "account_number")
    private String accountNumber;
    @Column(name = "password_type")
    private String passwordType;
    @Column(name = "old_password_hash")
    private String oldPasswordHash;
    @Column(name = "new_password_hash")
    private String newPasswordHash;
    @Column(name = "password_changed_at")
    private LocalDateTime changedAt;

    protected PasswordDetail() {
    }

    public PasswordDetail(Long customerId, String account, String type, String oldHash, String newHash) {
        this.customerId = customerId;
        accountNumber = account;
        passwordType = type;
        oldPasswordHash = oldHash;
        newPasswordHash = newHash;
        changedAt = LocalDateTime.now();
    }

    public String getOldPasswordHash() {
        return oldPasswordHash;
    }

    public String getNewPasswordHash() {
        return newPasswordHash;
    }
}
