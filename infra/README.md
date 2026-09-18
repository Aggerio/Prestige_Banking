# Local full-stack startup

From the repository root, run:

```powershell
.\start-services.ps1
```

This builds and starts Oracle Free, Ollama, Eureka, authentication, customer, transfer, public-info, chatbot, API Gateway, and the frontend. The first run is slower because Docker downloads the Oracle image and Ollama models.

Local entry points are `http://localhost:5173` (frontend), `http://localhost:8080` (Gateway), and `http://localhost:8761` (Eureka).

Use `docker compose logs --follow` to follow startup logs and `.\stop-services.ps1` to stop the stack. `docker compose down -v` also removes the local Oracle and Ollama data volumes.

The Compose stack is for local development only. It sets Hibernate to `update` so a disposable Oracle volume can create the existing service tables. Use managed schema migrations and externally supplied secrets in Kubernetes or production.
