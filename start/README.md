# Local service launcher

Open a Command Prompt in the repository root and run:

```cmd
start\start-all.cmd
```

The default launcher starts Eureka, authentication, customer, transfer, public-info, API Gateway, and frontend in separate windows. It expects a locally running Oracle instance compatible with the connection settings in each service. Chatbot is intentionally excluded from the default local workflow.

After startup, run the integrated smoke test:

```cmd
start\test-all.cmd
```

The test checks Gateway routing, JWT protection, and Eureka registration for every service in the default stack. Stop the stack with `start\stop-all.cmd`.
