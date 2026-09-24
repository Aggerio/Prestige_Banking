-- Run this once against an existing Prestige Banking database after deploying the public-info service.
-- The statements enrich the existing public site content and add further offers and investor updates.

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'Prestige Banking is built around a simple promise: make everyday banking feel clear, secure and personal. From saving for a first home to managing the moments that matter, our digital banking experience gives customers practical tools, transparent guidance and dependable support. We protect every interaction with thoughtful security while keeping your money and your goals within easy reach.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'ABOUT_PRESTIGE_BANK';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'Visit our Mumbai Head Office for in-person support, or contact our digital banking team for help with online services, account access and general enquiries. We are here to make banking simpler and safer.',
    CONTACT_EMAIL = 'support@prestigebanking.example',
    CONTACT_PHONE = '+91 22 4000 1000',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'CONTACT_MUMBAI_HEAD_OFFICE';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'A strategic partner supporting Prestige Banking’s customer-first digital banking growth and responsible expansion.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'INVESTOR_ARJUN_CAPITAL';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'A long-term investor focused on financial technology, resilient infrastructure and sustainable value creation.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'INVESTOR_BLUE_RIVER';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'Enjoy a competitive rate on eligible home loans, with simple digital application tracking and support at every step.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'OFFER_HOME_LOAN_RATE';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'Shop confidently with contactless payments, instant transaction alerts and reward points on eligible purchases.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'OFFER_DEBIT_CARD';

UPDATE SYSTEM.PUBLIC_CONTENT
SET CONTENT_BODY = 'Start saving with an account designed for everyday flexibility, secure online access and practical money management.',
    UPDATED_AT = SYSTIMESTAMP
WHERE CONTENT_KEY = 'OFFER_SAVINGS_ACCOUNT';

MERGE INTO SYSTEM.PUBLIC_CONTENT target
USING (
  SELECT 'INVESTOR_GREENSTONE' content_key FROM dual
) source
ON (target.CONTENT_KEY = source.content_key)
WHEN NOT MATCHED THEN INSERT
  (CONTENT_TYPE, CONTENT_KEY, TITLE, CONTENT_BODY, CONTACT_EMAIL, CONTACT_PHONE, DISPLAY_ORDER, IS_ACTIVE, ACTIVE_FROM, CREATED_AT, UPDATED_AT)
  VALUES
  ('INVESTOR', 'INVESTOR_GREENSTONE', 'Greenstone Growth Fund', 'A growth partner backing inclusive financial services, reliable customer experiences and long-term innovation.', 'investors@prestigebanking.example', NULL, 3, 'Y', SYSTIMESTAMP, SYSTIMESTAMP, SYSTIMESTAMP);

MERGE INTO SYSTEM.PUBLIC_CONTENT target
USING (
  SELECT 'OFFER_FIXED_DEPOSIT' content_key FROM dual
) source
ON (target.CONTENT_KEY = source.content_key)
WHEN NOT MATCHED THEN INSERT
  (CONTENT_TYPE, CONTENT_KEY, TITLE, CONTENT_BODY, CONTACT_EMAIL, CONTACT_PHONE, DISPLAY_ORDER, IS_ACTIVE, ACTIVE_FROM, CREATED_AT, UPDATED_AT)
  VALUES
  ('OFFER', 'OFFER_FIXED_DEPOSIT', 'Grow with a Prestige Fixed Deposit', 'Choose a term that suits your plans and grow your savings with a straightforward fixed deposit option.', NULL, NULL, 4, 'Y', SYSTIMESTAMP, SYSTIMESTAMP, SYSTIMESTAMP);

MERGE INTO SYSTEM.PUBLIC_CONTENT target
USING (
  SELECT 'OFFER_DIGITAL_ONBOARDING' content_key FROM dual
) source
ON (target.CONTENT_KEY = source.content_key)
WHEN NOT MATCHED THEN INSERT
  (CONTENT_TYPE, CONTENT_KEY, TITLE, CONTENT_BODY, CONTACT_EMAIL, CONTACT_PHONE, DISPLAY_ORDER, IS_ACTIVE, ACTIVE_FROM, CREATED_AT, UPDATED_AT)
  VALUES
  ('OFFER', 'OFFER_DIGITAL_ONBOARDING', 'Open your account online', 'Get started with a guided online account-opening journey and access to secure digital banking once your account is ready.', NULL, NULL, 5, 'Y', SYSTIMESTAMP, SYSTIMESTAMP, SYSTIMESTAMP);

COMMIT;
