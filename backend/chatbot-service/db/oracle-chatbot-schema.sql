-- Run once against the same Oracle schema used by the backend, before starting chatbot-service.
CREATE TABLE chatbot_knowledge_article (
    article_id VARCHAR2(36) PRIMARY KEY,
    phase VARCHAR2(30) NOT NULL,
    title VARCHAR2(250) NOT NULL,
    body CLOB NOT NULL,
    source_ref VARCHAR2(500),
    active CHAR(1) DEFAULT 'Y' NOT NULL CHECK (active IN ('Y', 'N')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE TABLE chatbot_conversation (
    conversation_id VARCHAR2(36) PRIMARY KEY,
    customer_id NUMBER(19),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE TABLE chatbot_message (
    message_id VARCHAR2(36) PRIMARY KEY,
    conversation_id VARCHAR2(36) NOT NULL REFERENCES chatbot_conversation(conversation_id),
    role VARCHAR2(12) NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
    content CLOB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX ix_chatbot_message_conversation ON chatbot_message(conversation_id, created_at);
CREATE INDEX ix_chatbot_article_active ON chatbot_knowledge_article(active, phase);
