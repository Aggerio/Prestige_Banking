package com.prestige.chatbot.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chatbot_message")
public class ChatMessage {
    @Id @Column(name = "message_id", length = 36) private String id;
    @Column(name = "conversation_id", nullable = false, length = 36) private String conversationId;
    @Column(name = "role", nullable = false, length = 12) private String role;
    @Lob @Column(name = "content", nullable = false) private String content;
    @Column(name = "created_at", nullable = false) private Instant createdAt;
    protected ChatMessage() { }
    public ChatMessage(String id, String conversationId, String role, String content, Instant now) { this.id = id; this.conversationId = conversationId; this.role = role; this.content = content; this.createdAt = now; }
}
