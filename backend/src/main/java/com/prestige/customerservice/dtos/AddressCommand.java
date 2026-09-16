package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressCommand {

    private Long customerId;
    private String streetName;
    private String city;
    private String state;
    private String pinCode;
}