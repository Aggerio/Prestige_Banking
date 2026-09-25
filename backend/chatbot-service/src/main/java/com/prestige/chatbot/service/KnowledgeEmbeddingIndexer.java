package com.prestige.chatbot.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.prestige.chatbot.domain.KnowledgeArticle;
import com.prestige.chatbot.repository.KnowledgeArticleRepository;

/**
 * Generates persisted article vectors after an approved knowledge import or
 * content change.
 */
@Configuration
public class KnowledgeEmbeddingIndexer {

    @Bean
    @ConditionalOnProperty(name = "chatbot.rag.reindex-on-startup", havingValue = "true")
    CommandLineRunner reindexKnowledge(KnowledgeArticleRepository articles, LocalOnnxEmbeddingService embeddings,
            NamedParameterJdbcTemplate jdbc) {
        return arguments -> articles.findByActiveOrderByTitleAsc("Y").forEach(article -> update(article, embeddings, jdbc));
    }

    private void update(KnowledgeArticle article, LocalOnnxEmbeddingService embeddings, NamedParameterJdbcTemplate jdbc) {
        String vector = embeddings.embedAsOracleVector(article.getTitle() + "\n" + article.getBody());
        jdbc.update("UPDATE chatbot_knowledge_article SET embedding = TO_VECTOR(:vector) WHERE article_id = :id",
                new MapSqlParameterSource().addValue("vector", vector).addValue("id", article.getId()));
    }
}
