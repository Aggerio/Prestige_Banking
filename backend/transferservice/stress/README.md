# Transfer-service stress tests

Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) and start the service on port 8080. Defaults are local customer `101`, source account `PBS1000001`, and transaction password `password`.

Successful scenarios change balances and create ledger data. Run against a resettable local database and use a new `RUN_ID` every time.

## Parallel transfers

Each request has its own idempotency key; this exercises deterministic account locking and parallel balance updates.

```powershell
k6 run -e RUN_MODE=parallel -e VUS=10 -e ITERATIONS=10 -e RUN_ID=parallel-001 stress/transfer-service.k6.js
```

## Concurrent idempotency replay

Twenty callers share one idempotency key. Expect one `201`, subsequent `200` responses, and a common response reference. Use that reference with `verify-transfer.sql` to confirm one header and two ledger rows.

```powershell
k6 run -e RUN_MODE=replay -e VUS=20 -e RUN_ID=replay-001 stress/transfer-service.k6.js
```

## Transfer-limit boundary

The seeded source account has a 50,000 limit. The rejection test does not mutate balances.

```powershell
k6 run -e RUN_MODE=limit -e LIMIT_AMOUNT=50000.01 -e RUN_ID=limit-001 stress/transfer-service.k6.js
```

The maximum-success case performs a real 50,000 transfer and requires a restored seeded balance:

```powershell
k6 run -e RUN_MODE=max-success -e MAX_AMOUNT=50000.00 -e RUN_ID=max-001 stress/transfer-service.k6.js
```

## Minimum-balance rule

The seeded account cannot reach its minimum-balance rule because its transfer limit is lower than its withdrawable balance. Create a local fixture with a higher transfer limit, then supply its data:

```powershell
k6 run -e RUN_MODE=minimum-balance -e SOURCE_ACCOUNT=YOUR_SOURCE -e DESTINATION_ACCOUNT=YOUR_DESTINATION -e DESTINATION_NAME="Fixture Customer" -e DESTINATION_IFSC=YOUR_IFSC -e MIN_BALANCE_AMOUNT=YOUR_AMOUNT -e RUN_ID=min-001 stress/transfer-service.k6.js
```

There is no maximum transfer count per account in the current business rules. The effective maximum is constrained by transfer limit, minimum balance, available balance, and Oracle row locking.
