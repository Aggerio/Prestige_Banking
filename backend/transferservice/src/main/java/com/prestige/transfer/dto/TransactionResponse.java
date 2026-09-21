package com.prestige.transfer.dto;

import com.prestige.transfer.domain.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long transactionId,
        String referenceNumber,
        String movement,
        TransactionType transactionType,
        BigDecimal amount,
        LocalDateTime transactionAt,
        String remarks
) {
}
