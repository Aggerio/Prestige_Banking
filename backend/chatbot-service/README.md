# Prestige Banking Chatbot Service

This service runs independently as a public FAQ/RAG and transfer/onboarding help API. It uses LangChain4j to call Ollama and persists its approved knowledge, conversations, and messages in its own Oracle schema.

## What is intentionally excluded

- No chatbot endpoint can create a transfer or change customer data.
- Phase 3 live account/transfer tools are not enabled yet; they require outbound service clients that forward the JWT and enforce customer ownership.
- Phase 4 staff documentation must be a separate role-restricted endpoint and knowledge collection.

## Database setup

Run `db/oracle-chatbot-schema.sql` once, then `db/oracle-chatbot-seed.sql`. The seed data is starter content only. Replace it with approved content from the public-info team and bank policy owners before production.

## Ollama setup

Install Ollama on the machine or deploy it as an internal service, then pull models selected by the environment variables:

```powershell
ollama pull minimax-m2.5
ollama pull nomic-embed-text
```

`OLLAMA_CHAT_MODEL` writes answers (for example, `gemma4:31b-cloud`).
`OLLAMA_EMBEDDING_MODEL` must be an embedding-capable model such as `nomic-embed-text`; it searches the approved RAG knowledge before the chat model answers.

Start the app with `mvn spring-boot:run`. It expects Ollama at `http://localhost:11434` and Oracle at the configured `DB_URL`.

## APIs

`POST /api/v1/chat/public` accepts `{"message":"What offers are available?"}`. `POST /api/v1/chat` is an equivalent compatibility endpoint.

`POST /api/v1/chat/stream` accepts the same body and returns Server-Sent Events: `metadata`, one or more `token` events, then `complete`.

Reuse the returned `conversationId` in later requests. The service does not register with Eureka, depend on the API gateway, or validate tokens through the auth service.

Run it directly on port `8085`; configure only its local Oracle database and Ollama endpoint through the environment variables documented in `application.yml`.
