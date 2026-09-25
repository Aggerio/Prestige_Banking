package com.prestige.chatbot.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chatbot_conversation")
public class ChatConversation {

    @Id
    @Column(name = "conversation_id", length = 36)
    private String id;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "last_message_at", nullable = false)
    private Instant lastMessageAt;

    protected ChatConversation() {
    }

    public ChatConversation(String id, Long customerId, Instant now) {
        this.id = id;
        this.customerId = customerId;
        this.createdAt = now;
        this.lastMessageAt = now;
    }

    public String getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void touch(Instant now) {
        lastMessageAt = now;
    }
}
