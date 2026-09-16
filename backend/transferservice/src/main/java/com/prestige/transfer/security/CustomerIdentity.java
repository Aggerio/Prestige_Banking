package com.prestige.transfer.security;

import com.prestige.transfer.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
public final class CustomerIdentity {
    private CustomerIdentity() { }
    public static Long from(Jwt jwt) {
        Object claim = jwt.getClaim("customer_id");
        try { return claim instanceof Number n ? n.longValue() : Long.valueOf(String.valueOf(claim)); }
        catch (RuntimeException ex) { throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", "Authentication token has no valid customer identity."); }
    }
}
