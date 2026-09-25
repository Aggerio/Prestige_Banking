package com.prestige.authentication.service;

import com.prestige.authentication.config.*;
import com.prestige.authentication.dto.*;
import com.prestige.authentication.entity.*;
import com.prestige.authentication.repository.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;

/** Coordinates credential checks, password changes, and token session lifecycle. */
@Service
public class AuthService {
    private final CustomerRepository customers;
    private final AccountRepository accounts;
    private final PasswordDetailRepository history;
    private final AuthSessionRepository sessions;
    private final PasswordEncoder encoder;
    private final JwtEncoder jwtEncoder;
    private final JwtProperties jwt;
    private final RefreshProperties refresh;
    private final SecureRandom random = new SecureRandom();

    public AuthService(CustomerRepository c, AccountRepository a, PasswordDetailRepository h, AuthSessionRepository s,
                       PasswordEncoder e, JwtEncoder j, JwtProperties p, RefreshProperties r) {
        customers = c;
        accounts = a;
        history = h;
        sessions = s;
        encoder = e;
        jwtEncoder = j;
        jwt = p;
        refresh = r;
    }

    @Transactional
    public TokenAndRefresh login(LoginRequest request) {
        // Inactive customers must not receive a new authenticated session.
        Customer c = customers.findById(request.customerId()).filter(x -> "ACTIVE".equals(x.getStatus()))
                .orElseThrow(() -> new SecurityException("Invalid credentials"));
        if (!encoder.matches(request.password(), c.getLoginPasswordHash()))
            throw new SecurityException("Invalid credentials");
        return newSession(c.getCustomerId(), UUID.randomUUID().toString());
    }

    @Transactional
    public TokenAndRefresh rotate(String raw) {
        if (raw == null || raw.isBlank())
            throw new SecurityException("Invalid session");
        AuthSession s = sessions.findForRefresh(hash(raw)).orElseThrow(() -> new SecurityException("Invalid session"));
        if (!s.usable()) {
            // A reused or expired refresh token invalidates every token in its family.
            sessions.revokeFamily(s.familyId(), LocalDateTime.now());
            throw new SecurityException("Invalid session");
        }
        s.revoke();
        // Keep the family identifier so later reuse can invalidate the entire chain.
        return newSession(s.customerId(), s.familyId());
    }

    @Transactional
    public void logout(Long customerId, String raw) {
        if (raw == null)
            return;
        sessions.findForRefresh(hash(raw)).ifPresent(s -> {
            if (!s.customerId().equals(customerId))
                throw new SecurityException("Forbidden");
            s.revoke();
        });
    }

    @Transactional
    public void changeLogin(Long id, LoginPasswordRequest r) {
        Customer c = customers.findById(id).orElseThrow();
        if (!encoder.matches(r.currentPassword(), c.getLoginPasswordHash()))
            throw new IllegalArgumentException("Current password is incorrect");
        validate(r.newPassword(), r.confirmPassword());
        notUsed(r.newPassword(), history.findByCustomerIdAndPasswordType(id, "LOGIN"));
        String old = c.getLoginPasswordHash(), next = encoder.encode(r.newPassword());
        c.setLoginPasswordHash(next);
        history.save(new PasswordDetail(id, null, "LOGIN", old, next));
        // Changing a login password ends existing sessions immediately.
        sessions.revokeAll(id, LocalDateTime.now());
    }

    @Transactional
    public void changeTransaction(Long id, TransactionPasswordRequest r) {
        Account a = accounts.findByAccountNumberAndCustomerId(r.accountNumber(), id)
                .orElseThrow(() -> new SecurityException("Account not owned"));
        if (!encoder.matches(r.currentPassword(), a.getTransactionPasswordHash()))
            throw new IllegalArgumentException("Current transaction password is incorrect");
        validate(r.newPassword(), r.confirmPassword());
        notUsed(r.newPassword(),
                history.findByCustomerIdAndAccountNumberAndPasswordType(id, r.accountNumber(), "TRANSACTION"));
        String old = a.getTransactionPasswordHash(), next = encoder.encode(r.newPassword());
        a.setTransactionPasswordHash(next);
        history.save(new PasswordDetail(id, r.accountNumber(), "TRANSACTION", old, next));
    }

    @Transactional(readOnly = true)
    public void verifyTransactionPassword(Long id, TransactionPasswordVerificationRequest r) {
        Account account = accounts.findByAccountNumberAndCustomerId(r.accountNumber(), id)
                .orElseThrow(() -> new SecurityException("Account not owned"));
        if (!encoder.matches(r.transactionPassword(), account.getTransactionPasswordHash()))
            throw new SecurityException("Transaction password is incorrect");
    }

    private TokenAndRefresh newSession(Long customer, String family) {
        String id = UUID.randomUUID().toString(), raw = raw();
        // Persist only a peppered token digest; the raw refresh token is returned once.
        sessions.save(new AuthSession(id, customer, hash(raw), family, LocalDateTime.now().plus(refresh.ttl())));
        Instant now = Instant.now();
        String access = jwtEncoder.encode(JwtEncoderParameters.from(JwtClaimsSet.builder().issuer(jwt.issuer())
                .subject(customer.toString()).audience(List.of(jwt.audience())).issuedAt(now).notBefore(now)
                .expiresAt(now.plus(jwt.accessTokenTtl())).id(UUID.randomUUID().toString()).claim("sid", id)
                .claim("scope", List.of("customer")).build())).getTokenValue();
        return new TokenAndRefresh(new TokenResponse(access, "Bearer", jwt.accessTokenTtl().toSeconds()), raw);
    }

    private String raw() {
        byte[] b = new byte[32];
        random.nextBytes(b);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }

    private String hash(String raw) {
        try {
            // HMAC binds stored refresh-token digests to the server-side pepper.
            Mac m = Mac.getInstance("HmacSHA256");
            m.init(new SecretKeySpec(refresh.pepper().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(m.doFinal(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }

    private void validate(String next, String confirm) {
        if (!next.equals(confirm) || !next.matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@*$]).{8,}$"))
            throw new IllegalArgumentException("Password must be 8+ characters with uppercase, number, and @, *, or $");
    }

    private void notUsed(String candidate, Iterable<PasswordDetail> rows) {
        // Password hashes are salted, so compare the candidate with each historical hash.
        for (PasswordDetail p : rows)
            if ((p.getOldPasswordHash() != null && encoder.matches(candidate, p.getOldPasswordHash()))
                    || (p.getNewPasswordHash() != null && encoder.matches(candidate, p.getNewPasswordHash())))
                throw new IllegalArgumentException("A previous password cannot be reused");
    }

    public record TokenAndRefresh(TokenResponse token, String refreshToken) {
    }
}
