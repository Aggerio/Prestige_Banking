package com.prestige.chatbot.controller;

import com.prestige.chatbot.dto.*;
import com.prestige.chatbot.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {
    private final ChatService chat;
    public ChatController(ChatService chat) { this.chat = chat; }

    @PostMapping("/public")
    public ChatResponse publicChat(@Valid @RequestBody ChatRequest request) {
        return chat.ask(request.message(), request.conversationId(), null);
    }

    @PostMapping
    public ChatResponse chat(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChatRequest request) {
        return chat.ask(request.message(), request.conversationId(), customerId(jwt));
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChatRequest request) {
        return chat.askStream(request.message(), request.conversationId(), customerId(jwt));
    }

    private Long customerId(Jwt jwt) {
        try {
            return Long.valueOf(jwt.getSubject());
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException("The access token has no valid customer identity.", exception);
        }
    }
}
