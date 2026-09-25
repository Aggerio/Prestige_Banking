package com.prestige.customerservice.dtos;

import java.math.BigDecimal;

/**
 * Represents card data that is safe for the authenticated customer to view.
 * The PAN is masked in this projection; unmasking uses a separate protected response.
 */
public record CardQuery(
        Long cardId,
        String maskedPan,
        String cardType,
        String cardholderName,
        int expiryMonth,
        int expiryYear,
        String status,
        String accountNumber,
        String accountType,
        BigDecimal availableBalance) {
}
