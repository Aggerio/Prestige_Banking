package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.CustomerQuery;
import com.prestige.customerservice.services.abstractions.CustomerServiceManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerServiceManager customerServiceManager;

    public CustomerController(
            CustomerServiceManager customerServiceManager
    ) {
        this.customerServiceManager = customerServiceManager;
    }

    @GetMapping("/me")
    public CustomerQuery getMyCustomer(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long customerId = Long.valueOf(jwt.getSubject());
        return customerServiceManager.getMyCustomer(customerId);
    }
}