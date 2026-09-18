package com.prestige.chatbot.repository;

import com.prestige.chatbot.domain.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, String> { }
