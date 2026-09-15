package com.prestige.transfer.exception;

import com.prestige.transfer.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.MDC;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class) ResponseEntity<ErrorResponse> api(ApiException ex) { return response(ex.getStatus(), ex.getCode(), ex.getMessage()); }
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class}) ResponseEntity<ErrorResponse> invalid(Exception ex) { return response(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "Request validation failed."); }
    @ExceptionHandler(CannotAcquireLockException.class) ResponseEntity<ErrorResponse> lock(CannotAcquireLockException ex) { return response(HttpStatus.LOCKED, "LOCK_CONFLICT", "The account is currently busy. Please retry."); }
    @ExceptionHandler(Exception.class) ResponseEntity<ErrorResponse> unexpected(Exception ex, HttpServletRequest request) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "TRANSFER_PROCESSING_ERROR", "The transfer could not be processed.");
    }
    private ResponseEntity<ErrorResponse> response(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(new ErrorResponse(Instant.now(), status.value(), code, message, MDC.get("traceId")));
    }
}
