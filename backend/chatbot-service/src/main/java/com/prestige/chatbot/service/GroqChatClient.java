package com.prestige.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Stream;
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
    private final RestClient client; private final HttpClient streamingClient; private final ObjectMapper json;
    private final String apiKey; private final String model; private final URI streamingUri;
    public GroqChatClient(RestClient groqRestClient, ObjectMapper json,
            @Value("${chatbot.groq.api-key}") String apiKey, @Value("${chatbot.groq.chat-model}") String model,
            @Value("${chatbot.groq.base-url}") String baseUrl, @Value("${chatbot.groq.timeout}") Duration timeout) {
        this.client = groqRestClient; this.json = json; this.apiKey = apiKey; this.model = model;
        this.streamingClient = HttpClient.newBuilder().connectTimeout(timeout).build();
        this.streamingUri = URI.create(baseUrl.replaceFirst("/$", "") + "/chat/completions");
    }

    /** Streams actual Groq SSE deltas to the supplied consumer; no answer buffering occurs here. */
    public void stream(String systemPrompt, String userPrompt, Consumer<String> onToken) {
        if (apiKey == null || apiKey.isBlank()) throw unavailable("The banking assistant is not configured.");
        try {
            String payload = json.writeValueAsString(Map.of("model", model, "temperature", 0.1, "stream", true,
                    "messages", List.of(Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt))));
            HttpRequest request = HttpRequest.newBuilder(streamingUri)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .header(HttpHeaders.ACCEPT, "text/event-stream")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();
            HttpResponse<Stream<String>> response = streamingClient.send(request, HttpResponse.BodyHandlers.ofLines());
            if (response.statusCode() < 200 || response.statusCode() >= 300) throw unavailable("The banking assistant is temporarily unavailable.");
            try (Stream<String> lines = response.body()) {
                lines.filter(line -> line.startsWith("data:")).forEach(line -> consumeDelta(line.substring(5).trim(), onToken));
            }
        } catch (ResponseStatusException exception) { throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw unavailable("The banking assistant stream was interrupted.");
        } catch (Exception exception) { throw unavailable("The banking assistant is temporarily unavailable."); }
    }

    private void consumeDelta(String data, Consumer<String> onToken) {
        if ("[DONE]".equals(data)) return;
        try {
            JsonNode content = json.readTree(data).at("/choices/0/delta/content");
            if (!content.isMissingNode() && !content.isNull() && !content.asText().isEmpty()) onToken.accept(content.asText());
        } catch (Exception exception) {
            throw new IllegalStateException("Invalid streaming response from Groq", exception);
        }
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
