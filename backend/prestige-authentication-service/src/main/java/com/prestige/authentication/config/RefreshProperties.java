package com.prestige.authentication.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.refresh-token")
public record RefreshProperties(Duration ttl, String pepper, String cookieName) {
}
