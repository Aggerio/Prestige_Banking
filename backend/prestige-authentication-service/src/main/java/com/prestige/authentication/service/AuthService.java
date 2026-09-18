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

    private static final int PASSWORD_CHANGE_HISTORY_LIMIT = 5;

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
            sessions.revokeFamily(s.familyId(), LocalDateTime.now());
            throw new SecurityException("Invalid session");
        }
        s.revoke();
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
        notUsed(
                r.newPassword(),
                history.findByCustomerIdAndPasswordTypeOrderByChangedAtDesc(id, "LOGIN")
        );
        String old = c.getLoginPasswordHash(), next = encoder.encode(r.newPassword());
        c.setLoginPasswordHash(next);
        history.save(new PasswordDetail(id, null, "LOGIN", old, next));
        retainLatest(
                history.findByCustomerIdAndPasswordTypeOrderByChangedAtDesc(id, "LOGIN")
        );
        sessions.revokeAll(id, LocalDateTime.now());
    }

    @Transactional
    public void changeTransaction(Long id, TransactionPasswordRequest r) {
        Account a = accounts.findByAccountNumberAndCustomerId(r.accountNumber(), id)
                .orElseThrow(() -> new SecurityException("Account not owned"));
        if (!encoder.matches(r.currentPassword(), a.getTransactionPasswordHash()))
            throw new IllegalArgumentException("Current transaction password is incorrect");
        validate(r.newPassword(), r.confirmPassword());
        notUsed(
                r.newPassword(),
                history.findByCustomerIdAndAccountNumberAndPasswordTypeOrderByChangedAtDesc(
                        id, r.accountNumber(), "TRANSACTION"
                )
        );
        String old = a.getTransactionPasswordHash(), next = encoder.encode(r.newPassword());
        a.setTransactionPasswordHash(next);
        history.save(new PasswordDetail(id, r.accountNumber(), "TRANSACTION", old, next));
        retainLatest(
                history.findByCustomerIdAndAccountNumberAndPasswordTypeOrderByChangedAtDesc(
                        id, r.accountNumber(), "TRANSACTION"
                )
        );
    }

    private TokenAndRefresh newSession(Long customer, String family) {
        String id = UUID.randomUUID().toString(), raw = raw();
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

    private void notUsed(String candidate, List<PasswordDetail> rows) {
        for (int index = 0; index < rows.size(); index++) {
            PasswordDetail detail = rows.get(index);

            boolean matchesOldPassword =
                    encoder.matches(candidate, detail.getOldPasswordHash());

            boolean matchesLatestNewPassword =
                    index == 0
                            && detail.getNewPasswordHash() != null
                            && encoder.matches(candidate, detail.getNewPasswordHash());

            if (matchesOldPassword || matchesLatestNewPassword) {
                throw new IllegalArgumentException(
                        "A previous password cannot be reused"
                );
            }
        }
    }

    private void retainLatest(List<PasswordDetail> rows) {
        if (rows.size() > PASSWORD_CHANGE_HISTORY_LIMIT) {
            history.deleteAll(
                    rows.subList(PASSWORD_CHANGE_HISTORY_LIMIT, rows.size())
            );
        }
    }

    public record TokenAndRefresh(TokenResponse token, String refreshToken) {
    }
}
