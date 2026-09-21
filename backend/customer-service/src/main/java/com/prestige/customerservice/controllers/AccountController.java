package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.AccountQuery;
import com.prestige.customerservice.services.abstractions.AccountServiceManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        return accountServiceManager.getMyAccount(Long.valueOf(jwt.getSubject()));
    }

    @GetMapping
    public List<AccountQuery> getMyAccounts(@AuthenticationPrincipal Jwt jwt) {
        return accountServiceManager.getMyAccounts(Long.valueOf(jwt.getSubject()));
    }
}
