package com.prestige.transfer.exception;
import org.springframework.http.HttpStatus;
public class IdempotencyConflictException extends ApiException { public IdempotencyConflictException() { super(HttpStatus.CONFLICT, "IDEMPOTENCY_CONFLICT", "Idempotency key was already used with a different request."); } }
