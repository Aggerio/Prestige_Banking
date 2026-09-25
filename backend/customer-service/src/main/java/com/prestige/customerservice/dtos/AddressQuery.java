package com.prestige.customerservice.dtos;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonPropertyOrder({
        "addressId",
        "streetName",
        "city",
        "state",
        "pinCode"
})

/**
 * Represents an address in customer profile responses.
 * It prevents callers from depending on the internal Address entity structure.
 */
public class AddressQuery {

    private Long addressId;
    private String streetName;
    private String city;
    private String state;
    private String pinCode;
}
