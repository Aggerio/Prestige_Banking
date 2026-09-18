-- These are safe starter articles, not final bank policy. Replace details with approved business content.
INSERT INTO chatbot_knowledge_article (article_id, phase, title, body, source_ref, active, created_at)
VALUES ('a1000000-0000-0000-0000-000000000001', 'PHASE_1_PUBLIC', 'Prestige Banking public information',
'Prestige Banking publishes public information through the website, including the home page, active offers, About Us, Contact Us, and investor information. For a current offer or contact detail, use the public information page in the banking application.',
'public-info service: /api/v1/public/home, /offers, /about-us, /contact-us, /investors', 'Y', SYSTIMESTAMP);
INSERT INTO chatbot_knowledge_article (article_id, phase, title, body, source_ref, active, created_at)
VALUES ('a1000000-0000-0000-0000-000000000002', 'PHASE_2_HELP', 'Transfer status and safe support',
'A transfer can be identified by its reference number. The banking application can show transfer status and account activity only to an authenticated customer who owns an involved account. Never share a password, transaction password, OTP, card PIN, or full account number in chat. If a transfer appears unexpected, contact bank support immediately.',
'transfer-service README and API', 'Y', SYSTIMESTAMP);
INSERT INTO chatbot_knowledge_article (article_id, phase, title, body, source_ref, active, created_at)
VALUES ('a1000000-0000-0000-0000-000000000003', 'PHASE_2_HELP', 'Making an internal transfer',
'The transfer API requires a signed-in customer, an Idempotency-Key, and a transfer request. The idempotency key protects a retried request from creating a duplicate transfer. A chatbot can explain the process but cannot create, approve, or change a transfer.',
'transfer-service README: POST /api/v1/transfers', 'Y', SYSTIMESTAMP);
INSERT INTO chatbot_knowledge_article (article_id, phase, title, body, source_ref, active, created_at)
VALUES ('a1000000-0000-0000-0000-000000000004', 'PHASE_2_HELP', 'Login and account safety',
'Use the normal banking login and refresh flow to access protected services. Do not share login passwords, transaction passwords, OTPs, card PINs, or refresh tokens. If a login or session issue continues, use the approved bank support channel.',
'authentication-service API', 'Y', SYSTIMESTAMP);
COMMIT;
