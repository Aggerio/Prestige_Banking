package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
/**
 * Carries account write data between API boundaries and domain services.
 * Validation annotations protect the service from incomplete or malformed command input.
 */
public class AccountCommand {

    private String accountNumber;
    private Long customerId;
    private Long bankId;
    private String accountType;
    private String ifscCode;
    private BigDecimal transferLimit;
    private BigDecimal minimumBalance;
}
