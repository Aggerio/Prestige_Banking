INSERT ALL
  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000001', 'PHASE_2_HELP',
   'Account help and account information',
   'For account help, a signed-in customer can use the banking application to view accounts that belong to that customer. The chatbot can explain available banking features but cannot access an account balance, account activity, or account ownership details.',
   'customer-service: GET /api/v1/accounts', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000002', 'PHASE_2_HELP',
   'Viewing account details',
   'Authenticated customers can use the accounts area of the banking application to view their own account details. The service returns only accounts owned by the signed-in customer. The chatbot cannot display account details or identify an account owner.',
   'customer-service: GET /api/v1/accounts', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000003', 'PHASE_2_HELP',
   'Viewing transaction history',
   'A signed-in customer can review transaction history for an account they own through the banking application. Transaction history is available through the protected account transactions service. The chatbot cannot retrieve live transactions.',
   'transfer-service: GET /api/v1/accounts/{accountNumber}/transactions', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000004', 'PHASE_2_HELP',
   'Transfer requirements',
   'Creating a transfer requires a signed-in customer, a source account owned by that customer, recipient details, an amount, and a transaction password. The application also uses an Idempotency-Key to protect against accidental duplicate requests.',
   'transfer-service: POST /api/v1/transfers', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000005', 'PHASE_2_HELP',
   'Transfer idempotency key',
   'An Idempotency-Key identifies one transfer submission. Retrying the same request with the same key helps prevent duplicate transfers after a network or application interruption. The chatbot cannot submit, retry, approve, or cancel a transfer.',
   'transfer-service: POST /api/v1/transfers', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000006', 'PHASE_2_HELP',
   'Checking transfer status',
   'A customer can check the status of a transfer using its reference number in the authenticated banking application. The chatbot cannot access live transfer records or confirm the status of a specific transfer.',
   'transfer-service: GET /api/v1/transfers/{referenceNumber}', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000007', 'PHASE_2_HELP',
   'Transfer failure questions',
   'The reason for a specific transfer failure requires live transfer status and failure information. If those details are not available in the authenticated banking application, use the approved bank support channel. The chatbot must not guess the cause.',
   'transfer-service support guidance', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000008', 'PHASE_2_HELP',
   'Transfer security',
   'Never share a transaction password, OTP, card PIN, login password, refresh token, or full account number in chat. The chatbot does not need these values and cannot make a transfer for a customer.',
   'bank security guidance', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000009', 'PHASE_2_HELP',
   'Transaction password verification',
   'A transaction password is used by protected banking workflows that require transaction verification. A customer should enter it only in the approved banking application, never in chat or a message.',
   'authentication-service transaction-password verification', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000010', 'PHASE_2_HELP',
   'Card information',
   'Authenticated customers can view cards associated with their banking profile in the banking application. The chatbot cannot reveal a card number, CVV, PIN, or other sensitive card data.',
   'customer-service: GET /api/v1/cards', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000011', 'PHASE_2_HELP',
   'Blocking or changing card status',
   'Card status changes are protected actions in the banking application. A customer must use the approved card-management workflow and transaction-password verification. The chatbot cannot block, unblock, or change a card.',
   'customer-service: PATCH /api/v1/cards/{cardId}/status', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000012', 'PHASE_2_HELP',
   'Login password safety',
   'Use the normal banking login flow to sign in. Never disclose a login password, OTP, card PIN, refresh token, or full account number through the chatbot. If account credentials may be exposed, use the approved bank support channel promptly.',
   'authentication-service security guidance', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000013', 'PHASE_2_HELP',
   'Changing a login password',
   'A signed-in customer can change a login password through the protected password-management workflow. After a successful login-password change, existing sessions are revoked and the customer must sign in again.',
   'authentication-service: PUT /api/v1/auth/passwords/login', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000014', 'PHASE_2_HELP',
   'Changing a transaction password',
   'A signed-in customer can change a transaction password for an account they own through the protected password-management workflow. The current transaction password is required by that workflow. Do not provide it to the chatbot.',
   'authentication-service: PUT /api/v1/auth/passwords/transaction', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000015', 'PHASE_2_HELP',
   'Session expiry and sign in again',
   'Access tokens are short-lived. If an authenticated request is rejected because the access token has expired, the banking application attempts to refresh the session securely. If the refresh session is unavailable, expired, or revoked, the customer must sign in again.',
   'authentication-service session policy', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000016', 'PHASE_2_HELP',
   'Unexpected account activity',
   'If a customer notices unexpected account activity or an unfamiliar transfer, the customer should review the protected account and transfer information in the banking application and contact the approved bank support channel promptly. The chatbot cannot investigate a live account.',
   'bank security guidance', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000017', 'PHASE_1_PUBLIC',
   'Public banking information',
   'Prestige Banking publishes public information through the website and public-information pages, including the home page, active offers, About Us, Contact Us, and investor information. Use those pages for current public details.',
   'public-info service: /api/v1/public/home', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000018', 'PHASE_1_PUBLIC',
   'Current offers and contact details',
   'Offers and public contact details can change. For current information, use the public-information pages in the banking application. The chatbot must not invent offers, fees, eligibility criteria, phone numbers, or email addresses.',
   'public-info service', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000019', 'PHASE_2_HELP',
   'What the banking assistant can do',
   'The banking assistant can explain approved banking information and guide a customer to the relevant banking service. It cannot access balances, live transactions, account details, transfer records, passwords, OTPs, card PINs, or full account numbers.',
   'chatbot-service policy', 'Y', SYSTIMESTAMP, NULL)

  INTO chatbot_knowledge_article VALUES
  ('b2000000-0000-0000-0000-000000000020', 'PHASE_2_HELP',
   'When to contact bank support',
   'Use the approved bank support channel for account-specific investigation, suspected fraud, an unexpected transfer, a failed protected workflow, or a problem that cannot be resolved in the banking application. The chatbot cannot determine account-specific outcomes without approved live data.',
   'bank support guidance', 'Y', SYSTIMESTAMP, NULL)
SELECT 1 FROM dual;

COMMIT;