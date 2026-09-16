package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.AccountQuery;

public interface AccountServiceManager {

    AccountQuery getMyAccount(Long customerId);
}