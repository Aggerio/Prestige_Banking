package com.prestige.chatbot.repository;

import com.prestige.chatbot.domain.KnowledgeArticle;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, String> {
    List<KnowledgeArticle> findByActiveOrderByTitleAsc(String active);
}
