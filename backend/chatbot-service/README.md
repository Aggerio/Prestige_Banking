# Prestige Banking Chatbot Service — Groq + Oracle Vector Search on Windows

This is a single Java service. It runs the local ONNX embedding model in-process, stores the resulting vectors in Oracle, uses Oracle for cosine RAG search, and calls Groq only to generate grounded answers.

```text
chatbot-service (Java + local ONNX model) → Oracle AI Vector Search → Groq
```

No Python installation or companion embedding service is required.

## One-time database setup

Connect as `chatbot_app` and run the scripts in this order:

```text
1. db/oracle-chatbot-schema.sql
2. db/oracle-chatbot-seed.sql
3. db/oracle-chatbot-vector-migration.sql
```

Do not run `DBMS_VECTOR.LOAD_ONNX_MODEL` or `VECTOR_EMBEDDING`; Oracle on Windows cannot execute ONNX models internally.

## Run the service

Keep the downloaded model at `C:\oracle-vector-models\all_MiniLM_L12_v2.onnx`, then populate vectors once:

```powershell
$env:DB_URL = 'jdbc:oracle:thin:@localhost:1521/FREEPDB1'
$env:DB_USERNAME = 'chatbot_app'
$env:DB_PASSWORD = 'your-password'
$env:GROQ_API_KEY = 'your-groq-key'
$env:RAG_REINDEX_ON_STARTUP = 'true'
mvn spring-boot:run
```

On this first start, the Java application loads the ONNX model once, embeds the approved knowledge articles, and saves the 384-dimension vectors in Oracle. Stop the application after the successful initial indexing.

Start normally after that:

```powershell
Remove-Item Env:RAG_REINDEX_ON_STARTUP -ErrorAction SilentlyContinue
mvn spring-boot:run
```

`EMBEDDING_MODEL_PATH` is optional; set it only if the ONNX file is elsewhere. The default is `C:/oracle-vector-models/all_MiniLM_L12_v2.onnx`.

`GROQ_CHAT_MODEL` defaults to `openai/gpt-oss-20b`. Store all secrets in environment variables or a secret store, never in source control.

## Chat API

There are exactly two chatbot endpoints, and both require an `Authorization: Bearer <JWT>` header. The `sub` claim in that JWT must be the numeric customer ID.

| Endpoint | Response | Purpose |
| --- | --- | --- |
| `POST /api/v1/chat` | JSON | Waits for the complete answer, then returns it in one response. |
| `POST /api/v1/chat/stream` | `text/event-stream` | Sends Groq response chunks immediately as Server-Sent Events. |

`POST /api/v1/chat/stream` emits a `metadata` event first, a `token` event for every Groq text delta, and then `complete`. On a service failure it emits `error`. There is no unauthenticated public-chat endpoint. Only `/actuator/health` remains public.

You can send the streaming request from Postman to verify authentication and the endpoint. Postman clients sometimes display the SSE response only after buffering it, so use the following command to confirm visibly live chunks:

```powershell
curl.exe -N -X POST http://localhost:8085/api/v1/chat/stream `
  -H "Authorization: Bearer <JWT>" `
  -H "Content-Type: application/json" `
  -H "Accept: text/event-stream" `
  -d '{"message":"What public information is available?"}'
```
