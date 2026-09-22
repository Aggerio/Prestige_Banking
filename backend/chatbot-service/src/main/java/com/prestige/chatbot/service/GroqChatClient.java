package com.prestige.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

/** OpenAI-compatible Groq client. Groq is used only for generation, never retrieval. */
@Component
public class GroqChatClient {
    private final RestClient client; private final ObjectMapper json; private final String apiKey; private final String model;
    public GroqChatClient(RestClient groqRestClient, ObjectMapper json,
            @Value("${chatbot.groq.api-key}") String apiKey, @Value("${chatbot.groq.chat-model}") String model) {
        this.client = groqRestClient; this.json = json; this.apiKey = apiKey; this.model = model;
    }
    public String complete(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) throw unavailable("The banking assistant is not configured.");
        try {
            String payload = json.writeValueAsString(Map.of("model", model, "temperature", 0.1,
                    "messages", List.of(Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt))));
            String response = client.post().uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey).contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(payload).retrieve().onStatus(HttpStatusCode::isError, (request, result) -> { throw unavailable("The banking assistant is temporarily unavailable."); }).body(String.class);
            JsonNode content = json.readTree(response).at("/choices/0/message/content");
            if (content.isMissingNode() || content.asText().isBlank()) throw new IllegalStateException("Empty Groq response");
            return content.asText();
        } catch (ResponseStatusException exception) { throw exception;
        } catch (Exception exception) { throw unavailable("The banking assistant is temporarily unavailable."); }
    }
    private ResponseStatusException unavailable(String message) { return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, message); }
}
