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
    private static final String INSUFFICIENT_CONTEXT = "INSUFFICIENT_CONTEXT";

    private static final String FALLBACK_ANSWER =
            "I cannot determine that from the approved information available to me. "
                    + "Please use the banking application or the approved bank support channel.";

    private static final String SYSTEM_INSTRUCTIONS = """
            You are the Prestige Banking support assistant.

            Answer only from the supplied knowledge context. Treat the knowledge context
            as the only source of banking facts. Never use outside knowledge or guess.

            Use only facts explicitly stated in the retrieved articles.

            If the articles do not directly answer the question, output exactly:
            INSUFFICIENT_CONTEXT

            Do not provide steps, menu navigation, screen names, phone numbers, fees,
            eligibility rules, statuses, balances, or operational instructions unless
            they appear explicitly in the retrieved articles.

            Do not use general banking knowledge to fill gaps.

            A question about why a specific transfer failed requires live transfer status
            and failure details. Unless those details are explicitly in the context,
            output exactly: INSUFFICIENT_CONTEXT

            Never invent banking policies, balances, transfer status, fees, eligibility,
            contact details, or offers.

            You cannot make transfers, change account details, reveal sensitive data,
            or ask for passwords, OTPs, card PINs, or full account numbers.

            Keep answers concise and professional. Give answers in complete sentences.
            Do not claim that an article says something it does not say.
            """;

    private final GroqChatClient groq;
    private final KnowledgeRetrievalService retrieval;
    private final ChatConversationRepository conversations;
    private final ChatMessageRepository messages;
    private final Executor streamingExecutor;

    public ChatService(
            GroqChatClient groq,
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

        String answer = FALLBACK_ANSWER;

        if (!context.isEmpty()) {
            try {
                answer = groq.complete(
                        SYSTEM_INSTRUCTIONS,
                        "Knowledge context:\n"
                                + contextText(context)
                                + "\n\nCustomer question:\n"
                                + question);

                if (INSUFFICIENT_CONTEXT.equals(answer.trim())) {
                    answer = FALLBACK_ANSWER;
                }
            } catch (RuntimeException error) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "The banking assistant is temporarily unavailable. Please try again shortly.");
            }
        }

        saveCompletedConversation(conversation, question, answer);

        return new ChatResponse(
                conversation.getId(),
                answer,
                context.stream().map(KnowledgeArticle::getTitle).toList());
    }

    public SseEmitter askStream(String question, String conversationId, Long customerId) {
        ChatConversation conversation = conversation(conversationId, customerId);
        List<KnowledgeArticle> context = retrieval.retrieve(question);
        List<String> sources = context.stream().map(KnowledgeArticle::getTitle).toList();

        SseEmitter emitter = new SseEmitter(0L);

        CompletableFuture.runAsync(
                () -> streamAnswer(emitter, conversation, question, context, sources),
                streamingExecutor);

        return emitter;
    }

    private void streamAnswer(
            SseEmitter emitter,
            ChatConversation conversation,
            String question,
            List<KnowledgeArticle> context,
            List<String> sources) {

        StringBuilder answer = new StringBuilder();

        try {
            emitter.send(
                    SseEmitter.event()
                            .name("metadata")
                            .data(Map.of(
                                    "conversationId", conversation.getId(),
                                    "sources", sources)));

            if (context.isEmpty()) {
                completeWithFallback(emitter, conversation, question, sources);
                return;
            }

            StreamingSafetyGate gate = new StreamingSafetyGate(emitter, answer);

            groq.stream(
                    SYSTEM_INSTRUCTIONS,
                    "Knowledge context:\n"
                            + contextText(context)
                            + "\n\nCustomer question:\n"
                            + question,
                    gate::accept);

            if (INSUFFICIENT_CONTEXT.equals(answer.toString().trim())) {
                answer.setLength(0);
                answer.append(FALLBACK_ANSWER);
                sendToken(emitter, FALLBACK_ANSWER);
            } else {
                gate.flushPending();
            }

            saveCompletedConversation(conversation, question, answer.toString());

            emitter.send(
                    SseEmitter.event()
                            .name("complete")
                            .data(Map.of(
                                    "conversationId", conversation.getId(),
                                    "sources", sources)));

            emitter.complete();
        } catch (StreamingClientDisconnectedException ignored) {
            emitter.complete();
        } catch (Exception error) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name("error")
                                .data(Map.of(
                                        "message",
                                        "The banking assistant is temporarily unavailable. "
                                                + "Please try again shortly.")));
            } catch (Exception ignored) {
                // Browser may already have disconnected.
            }
            emitter.complete();
        }
    }

    private void completeWithFallback(
            SseEmitter emitter,
            ChatConversation conversation,
            String question,
            List<String> sources) throws Exception {

        sendToken(emitter, FALLBACK_ANSWER);
        saveCompletedConversation(conversation, question, FALLBACK_ANSWER);

        emitter.send(
                SseEmitter.event()
                        .name("complete")
                        .data(Map.of(
                                "conversationId", conversation.getId(),
                                "sources", sources)));

        emitter.complete();
    }

    private void sendToken(SseEmitter emitter, String token) {
        try {
            emitter.send(SseEmitter.event().name("token").data(token));
        } catch (Exception exception) {
            throw new StreamingClientDisconnectedException(exception);
        }
    }

    private void saveCompletedConversation(
            ChatConversation conversation,
            String question,
            String answer) {

        Instant now = Instant.now();

        messages.save(new ChatMessage(
                UUID.randomUUID().toString(),
                conversation.getId(),
                "USER",
                question,
                now));

        messages.save(new ChatMessage(
                UUID.randomUUID().toString(),
                conversation.getId(),
                "ASSISTANT",
                answer,
                now));

        conversation.touch(now);
        conversations.save(conversation);
    }

    private ChatConversation conversation(String id, Long customerId) {
        if (id == null || id.isBlank()) {
            return conversations.save(
                    new ChatConversation(
                            UUID.randomUUID().toString(),
                            customerId,
                            Instant.now()));
        }

        ChatConversation existing = conversations.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Conversation was not found."));

        if (!Objects.equals(existing.getCustomerId(), customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Conversation does not belong to this customer.");
        }

        return existing;
    }

    private String contextText(List<KnowledgeArticle> articles) {
        if (articles.isEmpty()) {
            return "No relevant approved knowledge was retrieved.";
        }

        return articles.stream()
                .map(article -> "[" + article.getTitle() + "]\n" + article.getBody())
                .reduce("", (left, right) -> left + "\n\n" + right);
    }

    private static final class StreamingClientDisconnectedException extends RuntimeException {
        private StreamingClientDisconnectedException(Exception cause) {
            super(cause);
        }
    }

    private final class StreamingSafetyGate {
        private final SseEmitter emitter;
        private final StringBuilder fullAnswer;
        private final StringBuilder pending = new StringBuilder();
        private boolean forwarding;

        private StreamingSafetyGate(SseEmitter emitter, StringBuilder fullAnswer) {
            this.emitter = emitter;
            this.fullAnswer = fullAnswer;
        }

        private void accept(String delta) {
            fullAnswer.append(delta);

            if (forwarding) {
                sendToken(emitter, delta);
                return;
            }

            pending.append(delta);

            String candidate = pending.toString().stripLeading();

            if (!INSUFFICIENT_CONTEXT.startsWith(candidate)) {
                forwarding = true;
                sendToken(emitter, pending.toString());
                pending.setLength(0);
            }
        }

        private void flushPending() {
            if (!pending.isEmpty()) {
                sendToken(emitter, pending.toString());
                pending.setLength(0);
            }
        }
    }
}