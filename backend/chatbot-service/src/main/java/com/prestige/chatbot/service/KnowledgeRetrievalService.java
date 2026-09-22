package com.prestige.chatbot.service;

import com.prestige.chatbot.domain.KnowledgeArticle;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

/** Oracle performs vector similarity search; the local ONNX service supplies query vectors. */
@Service
public class KnowledgeRetrievalService {
    private final NamedParameterJdbcTemplate jdbc;
    private final LocalOnnxEmbeddingService embeddings;
    private final int maxResults;

    public KnowledgeRetrievalService(NamedParameterJdbcTemplate jdbc, LocalOnnxEmbeddingService embeddings,
            @Value("${chatbot.rag.max-results}") int maxResults) {
        this.jdbc = jdbc; this.embeddings = embeddings; this.maxResults = maxResults;
    }

    public List<KnowledgeArticle> retrieve(String question, boolean authenticated) {
        Set<String> phases = authenticated ? Set.of("PHASE_1_PUBLIC", "PHASE_2_HELP") : Set.of("PHASE_1_PUBLIC");
        String queryVector = embeddings.embedAsOracleVector(question);
        String sql = """
                SELECT article_id, phase, title, body, source_ref, active, created_at
                  FROM chatbot_knowledge_article
                 WHERE active = 'Y' AND phase IN (:phases) AND embedding IS NOT NULL
                 ORDER BY VECTOR_DISTANCE(embedding, TO_VECTOR(:queryVector), COSINE)
                 FETCH FIRST :limit ROWS ONLY
                """;
        return jdbc.query(sql, new MapSqlParameterSource().addValue("phases", phases)
                .addValue("queryVector", queryVector).addValue("limit", maxResults), this::mapArticle);
    }

    private KnowledgeArticle mapArticle(ResultSet rs, int row) throws SQLException {
        return KnowledgeArticle.fromDatabase(rs.getString("article_id"), rs.getString("phase"),
                rs.getString("title"), rs.getString("body"), rs.getString("source_ref"),
                rs.getString("active"), rs.getTimestamp("created_at").toInstant());
    }
}
