package com.prestige.customerservice.dtos;

import java.math.BigDecimal;

public record CardQuery(
        Long cardId,
        String maskedPan,
        String unmaskedPan,
        String cardType,
        String cardholderName,
        int expiryMonth,
        int expiryYear,
        String status,
        String accountNumber,
        String accountType,
        BigDecimal availableBalance) {
}
