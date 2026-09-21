# Local service launcher

Open a Command Prompt in the repository root and run:

```cmd
start\start-tabs.cmd
```

The default launcher opens Eureka, authentication, customer, transfer, public-info, API Gateway, and frontend as tabs in a single `Prestige Services` Windows Terminal window. The frontend runs at `http://localhost:3000`. It expects a locally running Oracle instance compatible with the connection settings in each service. Chatbot is intentionally excluded from the default local workflow. Stop the stack with `start\stop-all.cmd`, or close that terminal window.

After startup, run the integrated smoke test:

```cmd
start\test-all.cmd
```

The test checks Gateway routing, JWT protection, and Eureka registration for every service in the default stack. Stop the stack with `start\stop-all.cmd`.
