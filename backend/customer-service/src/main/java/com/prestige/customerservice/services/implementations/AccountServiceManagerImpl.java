package com.prestige.customerservice.services.implementations;

import com.prestige.customerservice.dao.entities.Account;
import com.prestige.customerservice.dao.repositories.AccountRepository;
import com.prestige.customerservice.dtos.AccountQuery;
import com.prestige.customerservice.services.abstractions.AccountServiceManager;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
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

        Account account = (Account) accountRepository
                .findByCustomer_CustomerId(customerId)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new EntityNotFoundException("Account not found"));

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