# Prestige Transfer Service

This service processes internal Prestige account transfers against the pre-provisioned Oracle schema. It never creates or migrates the schema.

## Required configuration

Set `ORACLE_JDBC_URL`, `ORACLE_USERNAME`, `ORACLE_PASSWORD`, `OIDC_ISSUER_URI`, `OIDC_JWK_SET_URI`, and `OIDC_AUDIENCE`. The forwarded access token must contain a numeric `customer_id` claim.

## API

- `POST /api/v1/transfers` requires `Authorization: Bearer <token>` and `Idempotency-Key`.
- `GET /api/v1/transfers/{referenceNumber}` returns a transfer only to either involved customer.
- `GET /api/v1/accounts/{accountNumber}/transactions?page=0&size=20` returns newest-first activity; size is capped at 100.

Use a test-only Oracle schema and valid BCrypt transaction-password hashes for integration tests. Configure `ORACLE_LOCK_TIMEOUT_SECONDS` to control Oracle `FOR UPDATE WAIT` behavior.
