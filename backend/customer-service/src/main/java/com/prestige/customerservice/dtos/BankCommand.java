package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
/**
 * Carries bank and branch reference data for write-oriented workflows.
 * The command model is intentionally separate from the persisted Bank entity.
 */
public class BankCommand {

    private String bankName;
    private String ifscCode;
    private String branchName;
}
