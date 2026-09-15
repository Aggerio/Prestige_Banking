package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class AccountCommand {

    private String accountNumber;
    private Long customerId;
    private Long bankId;
    private String accountType;
    private String ifscCode;
    private BigDecimal transferLimit;
    private BigDecimal minimumBalance;
}