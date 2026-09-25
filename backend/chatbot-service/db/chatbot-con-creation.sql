CREATE USER chatbot_app IDENTIFIED BY "chatbot_app@Password";
GRANT DB_DEVELOPER_ROLE TO chatbot_app;
-- GRANT CREATE MINING MODEL TO chatbot_app;

ALTER USER chatbot_app QUOTA 500M ON USERS;