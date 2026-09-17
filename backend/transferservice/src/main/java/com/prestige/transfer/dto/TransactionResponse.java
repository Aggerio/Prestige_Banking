package com.prestige.transfer.dto;

import com.prestige.transfer.domain.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        String referenceNumber,
        TransactionType transactionType,
        BigDecimal amount,
        LocalDateTime transactionAt,
        String remarks
) {
}