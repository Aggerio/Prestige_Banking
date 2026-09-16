package com.prestige.authentication.controller;

import com.nimbusds.jose.jwk.*;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
public class JwksController {
    private final RSAKey key;

    public JwksController(RSAKey key) {
        this.key = key;
    }

    @GetMapping("/.well-known/jwks.json")
    Map<String, Object> jwks() {
        return new JWKSet(key.toPublicJWK()).toJSONObject();
    }
}
