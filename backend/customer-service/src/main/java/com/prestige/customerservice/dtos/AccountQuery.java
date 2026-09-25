package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
/**
 * Represents the account information safe to return from customer-facing APIs.
 * It keeps API response shape separate from the JPA account entity.
 */
public class AccountQuery {

    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private BigDecimal transferLimit;
    private BigDecimal minimumBalance;
    private String status;
}
