package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Account;
import com.prestige.customerservice.dao.repositories.AccountRepository;
import com.prestige.customerservice.dtos.AccountQuery;
import com.prestige.customerservice.exception.AccountNotFoundException;
import com.prestige.customerservice.services.abstractions.AccountServiceManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
/**
 * Loads customer-owned accounts and maps persistence entities into API query DTOs.
 * Missing accounts are converted to domain-specific exceptions before reaching controllers.
 */
public class AccountServiceManagerImpl
        implements AccountServiceManager {

    private final AccountRepository accountRepository;

    public AccountServiceManagerImpl(
            AccountRepository accountRepository
    ) {
        this.accountRepository = accountRepository;
    }

    @Override
    public AccountQuery getMyAccount(Long customerId) {
        // The first account is the customer's primary account because the repository
        // returns accounts in creation order.
        return getMyAccounts(customerId)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found for customer: " + customerId));
    }

    @Override
    public List<AccountQuery> getMyAccounts(Long customerId) {
        // The customer id comes from the validated JWT subject, so only owned accounts
        // are queried and exposed to the caller.
        return accountRepository.findAllByCustomer_CustomerIdOrderByAccountCreatedAtAsc(customerId)
                .stream()
                .map(this::toQuery)
                .toList();
    }

    private AccountQuery toQuery(Account account) {
        AccountQuery query = new AccountQuery();
        query.setAccountNumber(account.getAccountNumber());
        query.setAccountType(account.getAccountType().name());
        query.setBalance(account.getAvailableBalance());
        query.setTransferLimit(account.getTransferLimit());
        query.setMinimumBalance(account.getMinimumBalance());
        query.setStatus(account.getAccountStatus().name());
        return query;
    }
}
