# Local service launcher

Open a Command Prompt in the repository root and run:

```cmd
start\start-all.cmd
```

The launcher starts Eureka, authentication, customer, transfer, public-info, chatbot, API Gateway, and frontend in separate windows. It expects a locally running Oracle instance compatible with the connection settings in each service and a local Ollama instance for chatbot responses.

After startup, run the integrated smoke test:

```cmd
start\test-all.cmd
```

The test checks Gateway routing, public chatbot access, JWT protection, and Eureka registration for every backend service. Stop the stack with `start\stop-all.cmd`.
