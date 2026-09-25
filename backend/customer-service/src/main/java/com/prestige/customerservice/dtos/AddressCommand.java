package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
/**
 * Carries address data for customer-domain write operations.
 * This command object isolates transport validation from persistence relationships.
 */
public class AddressCommand {

    private Long customerId;
    private String streetName;
    private String city;
    private String state;
    private String pinCode;
}
