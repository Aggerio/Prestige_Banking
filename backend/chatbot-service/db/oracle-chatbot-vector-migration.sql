-- Oracle AI Vector Search setup for chatbot-service on Windows.
-- chatbot-service itself generates 384-dimension vectors with its embedded Java ONNX runtime.
-- Do NOT use VECTOR_EMBEDDING or DBMS_VECTOR.LOAD_ONNX_MODEL on Windows.

ALTER TABLE chatbot_knowledge_article ADD (embedding VECTOR(384, FLOAT32));

CREATE VECTOR INDEX ix_chatbot_article_embedding
    ON chatbot_knowledge_article (embedding)
    ORGANIZATION INMEMORY NEIGHBOR GRAPH
    DISTANCE COSINE
    WITH TARGET ACCURACY 95;

-- After this script, start chatbot-service with
-- RAG_REINDEX_ON_STARTUP=true once. The chatbot service fills this column.
