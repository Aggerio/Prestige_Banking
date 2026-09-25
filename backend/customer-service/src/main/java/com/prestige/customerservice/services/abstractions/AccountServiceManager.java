package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.AccountQuery;
import java.util.List;

/**
 * Declares account queries available to authenticated customer workflows.
 * Implementations must return only accounts owned by the supplied customer identity.
 */
public interface AccountServiceManager {

    AccountQuery getMyAccount(Long customerId);

    List<AccountQuery> getMyAccounts(Long customerId);
}
