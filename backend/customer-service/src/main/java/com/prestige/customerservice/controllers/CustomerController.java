package com.prestige.customerservice.controllers;

import com.prestige.customerservice.dtos.CustomerQuery;
import com.prestige.customerservice.services.abstractions.CustomerServiceManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
            @RequestHeader("X-Customer-Id") Long customerId
    ) {
        return customerServiceManager.getMyCustomer(customerId);
    }
}