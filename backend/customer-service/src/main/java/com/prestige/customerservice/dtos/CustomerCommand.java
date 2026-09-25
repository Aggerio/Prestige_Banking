package com.prestige.customerservice.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
/**
 * Carries customer profile changes into write-oriented service workflows.
 * It is kept separate from the query DTO to prevent accidental response-field coupling.
 */
public class CustomerCommand {

    private String customerName;
    private Integer age;
}
