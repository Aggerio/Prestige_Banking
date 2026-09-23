package com.prestige.authentication.dto;

import jakarta.validation.constraints.NotBlank;

public record TransactionPasswordVerificationRequest(
        @NotBlank String accountNumber,
        @NotBlank String transactionPassword) {
}
