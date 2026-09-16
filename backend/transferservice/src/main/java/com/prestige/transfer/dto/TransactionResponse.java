package com.prestige.transfer.dto;
import com.prestige.transfer.domain.enums.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
public record TransactionResponse(String referenceNumber, TransactionType transactionType, BigDecimal amount, Instant transactionAt, String remarks) { }
