package com.prestige.authentication.dto;

import jakarta.validation.constraints.*;

public record TransactionPasswordRequest(@NotBlank String accountNumber,
                                         @NotBlank String currentPassword,
                                         @NotBlank String newPassword,
                                         @NotBlank String confirmPassword) {
}
