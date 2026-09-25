package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.CustomerQuery;

/**
 * Defines retrieval of the authenticated customer's profile data.
 * The service contract keeps controller code independent of persistence mappings.
 */
public interface CustomerServiceManager {

    CustomerQuery getMyCustomer(Long customerId);
}
