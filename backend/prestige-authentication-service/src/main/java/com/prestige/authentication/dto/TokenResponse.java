package com.prestige.authentication.dto;

public record TokenResponse(String accessToken, String tokenType, long expiresIn) {
}
