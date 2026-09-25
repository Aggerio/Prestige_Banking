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
/**
 * Represents the authenticated customer's profile data returned by the API.
 * It composes customer, bank, and address details without exposing JPA entities directly.
 */
public class CustomerQuery {

    private Long customerId;
    private String customerName;
    private Integer age;
    private String status;

    private BankQuery bank;
    private AddressQuery address;
}
