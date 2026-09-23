package com.prestige.chatbot.service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import com.prestige.chatbot.domain.KnowledgeArticle;

@Service
public class KnowledgeRetrievalService {
    private final NamedParameterJdbcTemplate jdbc;
    private final LocalOnnxEmbeddingService embeddings;
    private final int maxResults;
    private final double maxDistance;

    public KnowledgeRetrievalService(
            NamedParameterJdbcTemplate jdbc,
            LocalOnnxEmbeddingService embeddings,
            @Value("${chatbot.rag.max-results}") int maxResults,
            @Value("${chatbot.rag.max-distance}") double maxDistance) {
        this.jdbc = jdbc;
        this.embeddings = embeddings;
        this.maxResults = maxResults;
        this.maxDistance = maxDistance;
    }

    public List<KnowledgeArticle> retrieve(String question) {
        Set<String> phases = Set.of("PHASE_1_PUBLIC", "PHASE_2_HELP");
        String queryVector = embeddings.embedAsOracleVector(question);

        String sql = """
                SELECT article_id,
                       phase,
                       title,
                       body,
                       source_ref,
                       active,
                       created_at,
                       VECTOR_DISTANCE(embedding, TO_VECTOR(:queryVector), COSINE) AS distance
                FROM chatbot_knowledge_article
                WHERE active = 'Y'
                  AND phase IN (:phases)
                  AND embedding IS NOT NULL
                ORDER BY distance
                FETCH FIRST :limit ROWS ONLY
                """;

        return jdbc.query(
                        sql,
                        new MapSqlParameterSource()
                                .addValue("phases", phases)
                                .addValue("queryVector", queryVector)
                                .addValue("limit", maxResults),
                        (rs, row) -> new ScoredArticle(mapArticle(rs), rs.getDouble("distance")))
                .stream()
                .filter(match -> match.distance() <= maxDistance)
                .map(ScoredArticle::article)
                .toList();
    }

    private KnowledgeArticle mapArticle(ResultSet rs) throws SQLException {
        return KnowledgeArticle.fromDatabase(
                rs.getString("article_id"),
                rs.getString("phase"),
                rs.getString("title"),
                rs.getString("body"),
                rs.getString("source_ref"),
                rs.getString("active"),
                rs.getTimestamp("created_at").toInstant());
    }

    private record ScoredArticle(KnowledgeArticle article, double distance) {
    }
}