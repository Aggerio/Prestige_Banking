package com.prestige.chatbot.repository;

import com.prestige.chatbot.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> { }
