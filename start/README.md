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

The test checks Gateway routing, every public-content endpoint, JWT protection, and Eureka registration for every service in the default stack. With test credentials supplied, it also verifies login plus authenticated customer, account, activity, transfer-read, and transfer-validation requests. Stop the stack with `start\stop-all.cmd`.

To also verify an authenticated customer request, set the local test password only for the current terminal session before running the smoke test:

```powershell
$env:PRESTIGE_TEST_LOGIN_PASSWORD = 'your-local-login-password'
.\start\test-all.cmd
```

The test uses customer ID `101` by default. Override it by setting `PRESTIGE_TEST_CUSTOMER_ID` in the same session.
