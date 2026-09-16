package com.prestige.authentication.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.jwt")
public record JwtProperties(String issuer, String audience, String keyId, String keystoreLocation,
                            String keystorePassword, String keyAlias, String keyPassword, Duration accessTokenTtl) {
}
