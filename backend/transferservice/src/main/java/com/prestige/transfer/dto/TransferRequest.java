package com.prestige.transfer.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record TransferRequest(@NotBlank String sourceAccountNumber, @NotBlank String destinationAccountNumber,
                              @NotBlank String destinationAccountHolderName, @NotBlank String destinationIfscCode,
                              @NotNull @DecimalMin(value = "0.01") BigDecimal amount, @NotBlank String transactionPassword) { }
