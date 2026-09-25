package com.prestige.customerservice.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * Requests a sensitive card-number reveal using transaction-password verification.
 * The password is accepted only for validation and must never be echoed in responses or logs.
 */
public record CardNumberRevealRequest(@NotBlank String transactionPassword) {
}
