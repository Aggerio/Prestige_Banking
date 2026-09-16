package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.AccountQuery;
import com.prestige.customerservice.services.abstractions.AccountServiceManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
            @RequestHeader("X-Customer-Id") Long customerId
    ) {
        return accountServiceManager.getMyAccount(customerId);
    }
}