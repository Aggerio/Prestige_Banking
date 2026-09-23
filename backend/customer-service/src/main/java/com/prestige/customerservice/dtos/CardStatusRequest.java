package com.prestige.customerservice.dtos;

import jakarta.validation.constraints.NotBlank;

public record CardStatusRequest(
        @NotBlank String status,
        @NotBlank String transactionPassword) {
}
