package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.AccountQuery;
import com.prestige.customerservice.services.abstractions.AccountServiceManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountServiceManager accountServiceManager;

    public AccountController(
            AccountServiceManager accountServiceManager
    ) {
        this.accountServiceManager = accountServiceManager;
    }

    @GetMapping("/me")
    public AccountQuery getMyAccount(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long customerId = Long.valueOf(jwt.getSubject());
        return accountServiceManager.getMyAccount(customerId);
    }
}