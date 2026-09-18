package com.prestige.chatbot.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@Table(name = "chatbot_knowledge_article")
public class KnowledgeArticle {
    @Id @Column(name = "article_id", length = 36) private String id;
    @Column(name = "phase", nullable = false, length = 30) private String phase;
    @Column(name = "title", nullable = false, length = 250) private String title;
    @Lob @Column(name = "body", nullable = false) private String body;
    @Column(name = "source_ref", length = 500) private String sourceRef;
    @JdbcTypeCode(Types.CHAR)
    @Column(name = "active", nullable = false, length = 1) private String active = "Y";
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected KnowledgeArticle() { }
    public String getId() { return id; }
    public String getPhase() { return phase; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public String getSourceRef() { return sourceRef; }
}
