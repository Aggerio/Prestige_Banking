package com.prestige.authentication.controller;

import java.time.Instant;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(SecurityException.class)
    ResponseEntity<ErrorBody> security(SecurityException e) {
        return error(HttpStatus.UNAUTHORIZED, "Invalid credentials or session");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorBody> badRequest(IllegalArgumentException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    private ResponseEntity<ErrorBody> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ErrorBody(Instant.now(), status.value(), message));
    }

    record ErrorBody(Instant timestamp, int status, String message) {
    }
}
