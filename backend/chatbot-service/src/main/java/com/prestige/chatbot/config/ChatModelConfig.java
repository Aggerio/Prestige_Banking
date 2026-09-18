package com.prestige.chatbot.config;

import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;

@Configuration
public class ChatModelConfig {
    @Bean
    ChatModel chatModel(@Value("${chatbot.ollama.base-url}") String baseUrl,
                        @Value("${chatbot.ollama.chat-model}") String model,
                        @Value("${chatbot.ollama.timeout}") Duration timeout) {
        return OllamaChatModel.builder()
                .baseUrl(baseUrl)
                .modelName(model)
                .temperature(0.1)
                .timeout(timeout)
                .build();
    }

    @Bean
    StreamingChatModel streamingChatModel(@Value("${chatbot.ollama.base-url}") String baseUrl,
                                          @Value("${chatbot.ollama.chat-model}") String model,
                                          @Value("${chatbot.ollama.timeout}") Duration timeout) {
        return OllamaStreamingChatModel.builder()
                .baseUrl(baseUrl)
                .modelName(model)
                .temperature(0.1)
                .timeout(timeout)
                .build();
    }

    @Bean
    EmbeddingModel embeddingModel(@Value("${chatbot.ollama.base-url}") String baseUrl,
                                  @Value("${chatbot.ollama.embedding-model}") String model,
                                  @Value("${chatbot.ollama.timeout}") Duration timeout) {
        return OllamaEmbeddingModel.builder()
                .baseUrl(baseUrl)
                .modelName(model)
                .timeout(timeout)
                .build();
    }

    @Bean(name = "chatbotStreamingExecutor", destroyMethod = "shutdown")
    ExecutorService chatbotStreamingExecutor() {
        return Executors.newCachedThreadPool(runnable -> {
            Thread thread = new Thread(runnable, "chatbot-stream");
            thread.setDaemon(true);
            return thread;
        });
    }
}
