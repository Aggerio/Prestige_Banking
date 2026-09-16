package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.CustomerQuery;

public interface CustomerServiceManager {

    CustomerQuery getMyCustomer(Long customerId);
}