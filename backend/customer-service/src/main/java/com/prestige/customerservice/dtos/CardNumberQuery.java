package com.prestige.customerservice.dtos;

/**
 * Returns an unmasked PAN only after the protected reveal workflow succeeds.
 * Callers must treat this response as sensitive data and avoid persistent logging.
 */
public record CardNumberQuery(String unmaskedPan) {
}
