-- Run after the replay scenario: sqlplus system/root@localhost:1521/freepdb1 @stress/verify-transfer.sql REFERENCE
-- Expected: one COMPLETED header and exactly one DEBIT plus one CREDIT row.
DEFINE reference_number = '&1'
SELECT reference_number, status, COUNT(*) AS header_count FROM fund_transfer WHERE reference_number = '&reference_number' GROUP BY reference_number, status;
SELECT transaction_type, COUNT(*) AS ledger_rows FROM transaction_details WHERE reference_number = '&reference_number' GROUP BY transaction_type ORDER BY transaction_type;
