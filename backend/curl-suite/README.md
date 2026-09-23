# Prestige backend curl suite

Run the read-only, end-to-end suite from Command Prompt:

```cmd
backend\curl-suite\run-gateway-safe.cmd
```

It covers every non-mutating controller endpoint through the API gateway, obtains a customer `103` JWT from the authentication service, retains its refresh cookie only in `%TEMP%`, and then calls the protected endpoints. It also checks the authentication service's JWKS endpoint directly. Customer `103` is Rohan Mehta, with account `PBS1000003`.

`run-state-changing.cmd` contains the remaining controller endpoints: transfer creation, notification read, password changes, and logout. It is opt-in (`set RUN_MUTATIONS=YES`) because those calls permanently alter local database/session state. Its transfer payload uses `RohanTxnPassword` and sends `1.00` to Ananya Iyer's seeded account `PBS1000004`.

`run-direct-health.cmd` checks all eight running services directly. The gateway (`8080`) and authentication service (`8083`) are expected to return 401 for `/actuator/health` under their current security rules; the remaining service health endpoints should return 200.

The transaction `movement` query parameter uses the public values `DEPOSIT` and `WITHDRAWAL`; it does not accept the persistence enum values `CREDIT` and `DEBIT`.

The safe runner reports chatbot `500` responses as `XFAIL` rather than a suite failure when no LLM dependency is configured. This is visible in its summary and remains a deployment issue, not a successful chatbot test. An idle notification SSE stream is expected to time out without a response body, so that condition is asserted separately.

The checked-in gateway rule permits `POST /api/v1/chat/public`, but no controller declares that route. The suite correctly tests the actual `/api/v1/chat` and `/api/v1/chat/stream` endpoints instead. If those return 404 both through the gateway and directly on port `8085`, the running chatbot process is not serving the controller source in this checkout.
