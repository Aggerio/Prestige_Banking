package com.prestige.customerservice.dtos;

import jakarta.validation.constraints.NotBlank;

public record CardNumberRevealRequest(@NotBlank String transactionPassword) {
}
