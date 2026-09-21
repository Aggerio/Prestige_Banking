package com.prestige.customerservice.services.abstractions;

import com.prestige.customerservice.dtos.AccountQuery;
import java.util.List;

public interface AccountServiceManager {

    AccountQuery getMyAccount(Long customerId);

    List<AccountQuery> getMyAccounts(Long customerId);
}
