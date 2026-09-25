package com.prestige.customerservice.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
/**
 * Defines the stable error payload returned by the REST exception handler.
 * Separating this DTO keeps API errors independent of exception implementation details.
 */
public class ErrorResponse {

    private int status;
    private String message;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
