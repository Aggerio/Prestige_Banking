package com.prestige.chatbot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class LocalOnnxEmbeddingServiceTest {
    @Test
    void generates384DimensionVectorWhenModelIsInstalled() throws Exception {
        String path = System.getenv().getOrDefault("EMBEDDING_MODEL_PATH",
                "C:/oracle-vector-models/all_MiniLM_L12_v2.onnx");
        assumeTrue(Files.isRegularFile(Path.of(path)), "Local ONNX model is not installed on this machine");
        try (LocalOnnxEmbeddingService embeddings = new LocalOnnxEmbeddingService(path)) {
            String vector = embeddings.embedAsOracleVector("How do I keep my banking account secure?");
            assertEquals(384, vector.substring(1, vector.length() - 1).split(",").length);
        }
    }
}
