package com.prestige.chatbot.service;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;
import ai.onnxruntime.extensions.OrtxPackage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/** Runs the local all-MiniLM-L12-v2 ONNX text pipeline inside this JVM. */
@Component
public class LocalOnnxEmbeddingService implements AutoCloseable {
    private final OrtEnvironment environment;
    private final OrtSession session;
    private final String inputName;

    public LocalOnnxEmbeddingService(@Value("${chatbot.rag.embedding-model-path}") String modelPath) {
        try {
            Path path = Path.of(modelPath);
            if (!Files.isRegularFile(path)) throw new IllegalArgumentException("ONNX model was not found: " + path);
            environment = OrtEnvironment.getEnvironment();
            OrtSession.SessionOptions options = new OrtSession.SessionOptions();
            options.registerCustomOpLibrary(OrtxPackage.getLibraryPath());
            session = environment.createSession(path.toString(), options);
            inputName = session.getInputNames().iterator().next();
        } catch (Exception error) {
            throw new IllegalStateException("Could not load the local ONNX embedding model", error);
        }
    }

    public String embedAsOracleVector(String text) {
        try (OnnxTensor input = OnnxTensor.createTensor(environment, new String[] { text }, new long[] { 1 });
             OrtSession.Result result = session.run(Map.of(inputName, input))) {
            float[] vector = extractVector(result.get(0).getValue());
            if (vector.length != 384) throw new IllegalStateException("Expected a 384-dimension ONNX embedding");
            StringBuilder oracleVector = new StringBuilder("[");
            for (int index = 0; index < vector.length; index++) {
                if (index > 0) oracleVector.append(',');
                oracleVector.append(vector[index]);
            }
            return oracleVector.append(']').toString();
        } catch (OrtException error) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "The local ONNX embedding runtime is unavailable.");
        }
    }

    private float[] extractVector(Object raw) {
        if (raw instanceof float[] vector) return vector;
        if (raw instanceof float[][] batch && batch.length == 1) return batch[0];
        throw new IllegalStateException("Unexpected ONNX embedding output type: " + raw.getClass().getName());
    }

    @Override
    public void close() throws OrtException {
        session.close();
    }
}
