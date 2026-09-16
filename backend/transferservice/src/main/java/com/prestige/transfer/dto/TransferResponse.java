package com.prestige.transfer.dto;
import com.prestige.transfer.domain.enums.TransferStatus;
import java.math.BigDecimal;
import java.time.Instant;
public record TransferResponse(Long transferId, String referenceNumber, TransferStatus status, BigDecimal amount, Instant completedAt) { }
