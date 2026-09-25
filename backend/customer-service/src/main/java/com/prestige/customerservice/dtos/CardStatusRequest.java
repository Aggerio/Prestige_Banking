package com.prestige.customerservice.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * Carries a requested card-status transition together with transaction verification.
 * Validation ensures status changes go through the protected card-management workflow.
 */
public record CardStatusRequest(
        @NotBlank String status,
        @NotBlank String transactionPassword) {
}
