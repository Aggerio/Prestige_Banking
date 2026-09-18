package com.prestige.customerservice.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({
        "customerId",
        "customerName",
        "age",
        "status",
        "bank",
        "address"
})
public class CustomerQuery {

    private Long customerId;
    private String customerName;
    private Integer age;
    private String status;

    private BankQuery bank;
    private AddressQuery address;
}