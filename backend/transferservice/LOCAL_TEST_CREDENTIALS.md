# Local test credentials

These credentials exist only in the local Oracle database configured by `application.properties`. Do not use them outside local development.

| Purpose | Accounts | Password |
| --- | --- | --- |
| Transaction transfer testing | `PBS1000001` through `PBS1000005` | `password` |

Each listed account now stores a valid BCrypt hash for this password in `account.transaction_password_hash`. Existing `password_details` records with `password_type = 'TRANSACTION'` were updated to the same hash.
