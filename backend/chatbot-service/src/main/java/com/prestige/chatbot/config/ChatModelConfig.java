package com.prestige.chatbot.config;

import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class ChatModelConfig {

    @Bean
    RestClient groqRestClient(@Value("${chatbot.groq.base-url}") String baseUrl,
            @Value("${chatbot.groq.timeout}") Duration timeout) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(timeout);
        requestFactory.setReadTimeout(timeout);
        return RestClient.builder().baseUrl(baseUrl).requestFactory(requestFactory).build();
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
