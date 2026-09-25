package com.prestige.customerservice.exception;

/**
 * Signals that the authenticated customer no longer has a matching profile record.
 * It avoids leaking low-level persistence details outside the service layer.
 */
public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(String message) {
        super(message);
    }
}
