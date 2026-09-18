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

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;

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
    private final ChatModel model;
    private final StreamingChatModel streamingModel;
    private final Executor streamingExecutor;
    private final KnowledgeRetrievalService retrieval;
    private final ChatConversationRepository conversations;
    private final ChatMessageRepository messages;

    public ChatService(ChatModel model, StreamingChatModel streamingModel,
                       @Qualifier("chatbotStreamingExecutor") Executor streamingExecutor,
                       KnowledgeRetrievalService retrieval, ChatConversationRepository conversations, ChatMessageRepository messages) {
        this.model = model; this.streamingModel = streamingModel; this.streamingExecutor = streamingExecutor;
        this.retrieval = retrieval; this.conversations = conversations; this.messages = messages;
    }

    @Transactional
    public ChatResponse ask(String question, String conversationId, Long customerId) {
        ChatConversation conversation = conversation(conversationId, customerId);
        List<KnowledgeArticle> context = retrieval.retrieve(question, customerId != null);
        String prompt = SYSTEM_INSTRUCTIONS + "\n\nKnowledge context:\n" + contextText(context)
                + "\n\nCustomer question:\n" + question;
        String answer;
        try {
            answer = model.chat(prompt);
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

    public SseEmitter askStream(String question, String conversationId) {
        ChatConversation conversation = conversation(conversationId, null);
        List<KnowledgeArticle> context = retrieval.retrieve(question, false);
        String prompt = SYSTEM_INSTRUCTIONS + "\n\nKnowledge context:\n" + contextText(context)
                + "\n\nCustomer question:\n" + question;
        SseEmitter emitter = new SseEmitter(0L);

        CompletableFuture.runAsync(() -> stream(prompt, question, conversation, context, emitter), streamingExecutor);
        return emitter;
    }

    private void stream(String prompt, String question, ChatConversation conversation,
                        List<KnowledgeArticle> context, SseEmitter emitter) {
        StringBuilder answer = new StringBuilder();
        try {
            emitter.send(SseEmitter.event().name("metadata").data(Map.of(
                    "conversationId", conversation.getId(),
                    "sources", context.stream().map(KnowledgeArticle::getTitle).toList())));
            streamingModel.chat(prompt, new StreamingChatResponseHandler() {
                @Override
                public void onPartialResponse(String token) {
                    answer.append(token);
                    try {
                        emitter.send(SseEmitter.event().name("token").data(token));
                    } catch (Exception exception) {
                        throw new RuntimeException(exception);
                    }
                }

                @Override
                public void onCompleteResponse(dev.langchain4j.model.chat.response.ChatResponse response) {
                    saveCompletedConversation(question, answer.toString(), conversation);
                    try {
                        emitter.send(SseEmitter.event().name("complete").data(Map.of("conversationId", conversation.getId())));
                        emitter.complete();
                    } catch (Exception exception) {
                        emitter.completeWithError(exception);
                    }
                }

                @Override
                public void onError(Throwable error) {
                    try {
                        emitter.send(SseEmitter.event().name("error").data(Map.of(
                                "message", "The banking assistant is temporarily unavailable. Please try again shortly.")));
                    } catch (Exception ignored) {
                        // The client may have disconnected before the error could be sent.
                    }
                    emitter.complete();
                }
            });
        } catch (Exception error) {
            emitter.completeWithError(error);
        }
    }

    private void saveCompletedConversation(String question, String answer, ChatConversation conversation) {
        Instant now = Instant.now();
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "USER", question, now));
        messages.save(new ChatMessage(UUID.randomUUID().toString(), conversation.getId(), "ASSISTANT", answer, now));
        conversation.touch(now);
        conversations.save(conversation);
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
