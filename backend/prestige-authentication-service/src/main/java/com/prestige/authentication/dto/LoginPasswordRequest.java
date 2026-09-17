package com.prestige.authentication.dto;

import jakarta.validation.constraints.*;

public record LoginPasswordRequest(@NotBlank String currentPassword,
                                   @NotBlank String newPassword,
                                   @NotBlank String confirmPassword) {
}
