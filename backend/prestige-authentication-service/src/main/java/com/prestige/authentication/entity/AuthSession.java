package com.prestige.authentication.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "auth_session")
public class AuthSession {
    @Id
    @Column(name = "session_id")
    private String sessionId;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "refresh_token_hash")
    private String refreshTokenHash;
    @Column(name = "token_family_id")
    private String familyId;
    @Column(name = "issued_at")
    private LocalDateTime  issuedAt;
    @Column(name = "expires_at")
    private LocalDateTime  expiresAt;
    @Column(name = "revoked_at")
    private LocalDateTime  revokedAt;
    @Column(name = "last_used_at")
    private LocalDateTime  lastUsedAt;

    protected AuthSession() {
    }

    public AuthSession(String id, Long customer, String hash, String family, LocalDateTime  expiry) {
        sessionId = id;
        customerId = customer;
        refreshTokenHash = hash;
        familyId = family;
        issuedAt = LocalDateTime.now();
        lastUsedAt = issuedAt;
        expiresAt = expiry;
    }

    public Long customerId() {
        return customerId;
    }

    public String familyId() {
        return familyId;
    }

    public boolean usable() {
        return revokedAt == null && expiresAt.isAfter(LocalDateTime.now());
    }

    public void revoke() {
        revokedAt = LocalDateTime.now();
    }
}
