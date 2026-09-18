package com.prestige.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(
        @NotBlank @Size(max = 2_000) String message,
        @Size(max = 36) String conversationId) { }
