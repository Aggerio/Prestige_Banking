package com.prestige.chatbot.service;

import com.prestige.chatbot.domain.KnowledgeArticle;
import com.prestige.chatbot.repository.KnowledgeArticleRepository;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Retrieves approved Oracle knowledge with Ollama embeddings. The database remains the source of
 * truth; generated embeddings are cached in memory. Keyword search is a safe fallback if Ollama
 * embeddings are temporarily unavailable.
 */
@Service
public class KnowledgeRetrievalService {
    private static final Logger log = LoggerFactory.getLogger(KnowledgeRetrievalService.class);
    private static final Pattern WORD = Pattern.compile("[^a-z0-9]+");
    private final KnowledgeArticleRepository articles;
    private final EmbeddingModel embeddingModel;
    private final Map<String, CachedEmbedding> embeddingCache = new ConcurrentHashMap<>();

    public KnowledgeRetrievalService(KnowledgeArticleRepository articles, EmbeddingModel embeddingModel) {
        this.articles = articles;
        this.embeddingModel = embeddingModel;
    }

    public List<KnowledgeArticle> retrieve(String question, boolean authenticated) {
        Set<String> queryWords = words(question);
        Set<String> permittedPhases = authenticated
                ? Set.of("PHASE_1_PUBLIC", "PHASE_2_HELP")
                : Set.of("PHASE_1_PUBLIC", "PHASE_2_HELP");
        List<KnowledgeArticle> candidates = articles.findByActiveOrderByTitleAsc("Y").stream()
                .filter(article -> permittedPhases.contains(article.getPhase()))
                .toList();
        if (candidates.isEmpty()) return List.of();

        try {
            Embedding questionEmbedding = embeddingModel.embed(question).content();
            return candidates.stream()
                    .map(article -> Map.entry(article, semanticScore(questionEmbedding, article)))
                    .filter(entry -> entry.getValue() >= 0.35d)
                    .sorted(Map.Entry.<KnowledgeArticle, Double>comparingByValue().reversed())
                    .limit(4)
                    .map(Map.Entry::getKey)
                    .toList();
        } catch (RuntimeException error) {
            log.warn("Ollama embedding retrieval failed; using keyword fallback: {}", error.getMessage());
            return lexicalRetrieve(candidates, queryWords);
        }
    }

    private List<KnowledgeArticle> lexicalRetrieve(List<KnowledgeArticle> candidates, Set<String> queryWords) {
        return candidates.stream()
                .map(article -> Map.entry(article, score(article, queryWords)))
                .filter(entry -> entry.getValue() > 0)
                .sorted(Map.Entry.<KnowledgeArticle, Integer>comparingByValue().reversed())
                .limit(4)
                .map(Map.Entry::getKey)
                .toList();
    }

    private double semanticScore(Embedding questionEmbedding, KnowledgeArticle article) {
        String text = article.getTitle() + "\n" + article.getBody();
        String cacheKey = article.getId() + ":" + text.hashCode();
        CachedEmbedding cached = embeddingCache.compute(cacheKey, (key, current) ->
                current == null ? new CachedEmbedding(embeddingModel.embed(text).content()) : current);
        return cosine(questionEmbedding.vector(), cached.embedding().vector());
    }

    private double cosine(float[] first, float[] second) {
        double dot = 0, firstMagnitude = 0, secondMagnitude = 0;
        for (int index = 0; index < first.length; index++) {
            dot += first[index] * second[index];
            firstMagnitude += first[index] * first[index];
            secondMagnitude += second[index] * second[index];
        }
        return dot / (Math.sqrt(firstMagnitude) * Math.sqrt(secondMagnitude));
    }

    private int score(KnowledgeArticle article, Set<String> queryWords) {
        Set<String> title = words(article.getTitle());
        Set<String> body = words(article.getBody());
        return queryWords.stream().mapToInt(word -> title.contains(word) ? 4 : body.contains(word) ? 1 : 0).sum();
    }

    private Set<String> words(String text) {
        Set<String> result = new HashSet<>();
        for (String word : WORD.split(text.toLowerCase(Locale.ROOT))) if (word.length() > 2) result.add(word);
        return result;
    }

    private record CachedEmbedding(Embedding embedding) { }
}
