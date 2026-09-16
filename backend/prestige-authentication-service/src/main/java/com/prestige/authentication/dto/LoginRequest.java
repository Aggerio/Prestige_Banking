package com.prestige.authentication.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(@NotNull Long customerId,
                           @NotBlank String password) {
}
