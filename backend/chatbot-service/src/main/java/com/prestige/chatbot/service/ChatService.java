package com.prestige.chatbot.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.prestige.chatbot.domain.ChatConversation;
import com.prestige.chatbot.domain.ChatMessage;
import com.prestige.chatbot.domain.KnowledgeArticle;
import com.prestige.chatbot.dto.ChatResponse;
import com.prestige.chatbot.repository.ChatConversationRepository;
import com.prestige.chatbot.repository.ChatMessageRepository;


@Service
public class ChatService {
    private static final String SYSTEM_INSTRUCTIONS = """
            You are the Prestige Banking support assistant. Answer only from the supplied knowledge context.
            Treat the knowledge context as the only source of banking facts. Never use outside knowledge or guess.
            If the context does not state an answer, say exactly that you cannot determine it from the available information and direct the user to bank support.
            A question about why a specific transfer failed requires live transfer status and failure details. Unless those details are explicitly in the context, say you cannot determine the reason for that transfer.
            Never invent banking policies, balances, transfer status, fees, eligibility, contact details, or offers.
            You cannot make transfers, change account details, reveal sensitive data, or ask for passwords, OTPs, card PINs, or full account numbers.
            Keep answers concise and professional. Give answers in complete sentences. Do not claim that an article says something it does not say.
            """;
    private final GroqChatClient groq;
    private final KnowledgeRetrievalService retrieval;
    private final ChatConversationRepository conversations;
    private final ChatMessageRepository messages;
    private final Executor streamingExecutor;

    public ChatService(GroqChatClient groq,
                       KnowledgeRetrievalService retrieval,
                       ChatConversationRepository conversations,
                       ChatMessageRepository messages,
                       @Qualifier("chatbotStreamingExecutor") Executor streamingExecutor) {
        this.groq = groq;
        this.retrieval = retrieval;
        this.conversations = conversations;
        this.messages = messages;
        this.streamingExecutor = streamingExecutor;
    }

    @Transactional
    public ChatResponse ask(String question, String conversationId, Long customerId) {
        ChatConversation conversation = conversation(conversationId, customerId);
        List<KnowledgeArticle> context = retrieval.retrieve(question);
        String answer;
        try {
            answer = groq.complete(SYSTEM_INSTRUCTIONS, "Knowledge context:\n" + contextText(context) + "\n\nCustomer question:\n" + question);
        } catch (RuntimeException error) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "The banking assistant is temporarily unavailable. Please try again shortly.");
        }
        Instant now = Instant.now();
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "USER", question, now));
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "ASSISTANT", answer, now));
        conversation.touch(now);
        return new ChatResponse(conversation.getId(), answer, context.stream().map(KnowledgeArticle::getTitle).toList());
    }

    /**
     * Streams Groq's SSE deltas to the caller as they arrive.  The client receives
     * a metadata event first, zero or more token events, then a complete or error event.
     */
    public SseEmitter askStream(String question, String conversationId, Long customerId) {
        ChatConversation conversation = conversation(conversationId, customerId);
        List<KnowledgeArticle> context = retrieval.retrieve(question);
        List<String> sources = context.stream().map(KnowledgeArticle::getTitle).toList();
        SseEmitter emitter = new SseEmitter(0L);

        CompletableFuture.runAsync(() -> streamAnswer(emitter, conversation, question, context, sources), streamingExecutor);
        return emitter;
    }

    private void streamAnswer(SseEmitter emitter, ChatConversation conversation, String question,
                              List<KnowledgeArticle> context, List<String> sources) {
        StringBuilder answer = new StringBuilder();
        try {
            emitter.send(SseEmitter.event().name("metadata")
                    .data(Map.of("conversationId", conversation.getId(), "sources", sources)));
            groq.stream(SYSTEM_INSTRUCTIONS,
                    "Knowledge context:\n" + contextText(context) + "\n\nCustomer question:\n" + question,
                    delta -> {
                        answer.append(delta);
                        try {
                            emitter.send(SseEmitter.event().name("token").data(delta));
                        } catch (Exception sendFailure) {
                            throw new StreamingClientDisconnectedException(sendFailure);
                        }
                    });
            saveCompletedConversation(conversation, question, answer.toString());
            emitter.send(SseEmitter.event().name("complete")
                    .data(Map.of("conversationId", conversation.getId(), "sources", sources)));
            emitter.complete();
        } catch (StreamingClientDisconnectedException ignored) {
            emitter.complete();
        } catch (Exception error) {
            try {
                emitter.send(SseEmitter.event().name("error")
                        .data(Map.of("message", "The banking assistant is temporarily unavailable. Please try again shortly.")));
            } catch (Exception ignored) {
                // The HTTP client may already have disconnected.
            }
            emitter.complete();
        }
    }

    private void saveCompletedConversation(ChatConversation conversation, String question, String answer) {
        Instant now = Instant.now();
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "USER", question, now));
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "ASSISTANT", answer, now));
        conversation.touch(now);
        conversations.save(conversation);
    }

    private static final class StreamingClientDisconnectedException extends RuntimeException {
        private StreamingClientDisconnectedException(Exception cause) {
            super(cause);
        }
    }

    private ChatConversation conversation(String id, Long customerId) {
        if (id == null || id.isBlank()) {
            ChatConversation created = new ChatConversation(UUID.randomUUID().toString(), customerId, Instant.now());
            return conversations.save(created);
        }
        ChatConversation existing = conversations.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation was not found."));
        if (!Objects.equals(existing.getCustomerId(), customerId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Conversation does not belong to this customer.");
        return existing;
    }

    private String contextText(List<KnowledgeArticle> articles) {
        if (articles.isEmpty()) return "No relevant approved knowledge was retrieved.";
        return articles.stream().map(article -> "[" + article.getTitle() + "]\n" + article.getBody())
                .reduce("", (left, right) -> left + "\n\n" + right);
    }
}
