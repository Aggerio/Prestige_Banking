package com.prestige.customerservice.exception;

/**
 * Signals that an account cannot be found within the requested customer scope.
 * The global exception handler translates this domain condition into an API response.
 */
public class AccountNotFoundException extends RuntimeException {

    public AccountNotFoundException(String message) {
        super(message);
    }
}
