package com.prestige.customerservice.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({
        "bankId",
        "bankName",
        "ifscCode",
        "branchName"
})
public class BankQuery {

    private Long bankId;
    private String bankName;
    private String ifscCode;
    private String branchName;
}