package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class AccountQuery {

    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private BigDecimal transferLimit;
    private BigDecimal minimumBalance;
    private String status;
}