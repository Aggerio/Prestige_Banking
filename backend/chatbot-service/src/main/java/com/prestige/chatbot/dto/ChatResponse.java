package com.prestige.chatbot.dto;

import java.util.List;

public record ChatResponse(String conversationId, String answer, List<String> sources) { }
