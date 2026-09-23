package com.prestige.authentication.controller;

import com.prestige.authentication.config.RefreshProperties;
import com.prestige.authentication.dto.*;
import com.prestige.authentication.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;
    private final RefreshProperties props;

    public AuthController(AuthService a, RefreshProperties p) {
        auth = a;
        props = p;
    }

    @PostMapping("/login")
    ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest r) {
        return token(auth.login(r));
    }

    @PostMapping("/refresh")
    ResponseEntity<TokenResponse> refresh(@CookieValue(name = "PBS_REFRESH", required = false) String value) {
        return token(auth.rotate(value));
    }

    @PostMapping("/logout")
    ResponseEntity<MessageResponse> logout(@AuthenticationPrincipal Jwt jwt, @CookieValue(name = "PBS_REFRESH", required = false) String value) {
        auth.logout(Long.valueOf(jwt.getSubject()), value);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, clearCookie()).body(new MessageResponse("Logged out"));
    }

    @PutMapping("/passwords/login")
    ResponseEntity<MessageResponse> loginPassword(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody LoginPasswordRequest r) {
        auth.changeLogin(Long.valueOf(jwt.getSubject()), r);
        return ResponseEntity.ok(new MessageResponse("Login password changed. Please sign in again."));
    }

    @PutMapping("/passwords/transaction")
    ResponseEntity<MessageResponse> transactionPassword(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody TransactionPasswordRequest r) {
        auth.changeTransaction(Long.valueOf(jwt.getSubject()), r);
        return ResponseEntity.ok(new MessageResponse("Transaction password changed."));
    }

    @PostMapping("/passwords/transaction/verify")
    ResponseEntity<VerificationResponse> verifyTransactionPassword(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody TransactionPasswordVerificationRequest r) {
        auth.verifyTransactionPassword(Long.valueOf(jwt.getSubject()), r);
        return ResponseEntity.ok(new VerificationResponse(true));
    }

    //change .secure(true) when using browser
    private ResponseEntity<TokenResponse> token(AuthService.TokenAndRefresh r) {
        ResponseCookie c = ResponseCookie.from(props.cookieName(), r.refreshToken()).httpOnly(true).secure(false).sameSite("Strict").path("/api/v1/auth").maxAge(props.ttl()).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, c.toString()).body(r.token());
    }

    //change .secure(true) when using browser
    private String clearCookie() {
        return ResponseCookie.from(props.cookieName(), "").httpOnly(true).secure(false).sameSite("Strict").path("/api/v1/auth").maxAge(0).build().toString();
    }
}
