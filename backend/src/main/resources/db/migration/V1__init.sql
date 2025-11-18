CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET TIME ZONE 'UTC';

CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT NOT NULL,
    media_url VARCHAR(512),
    interaction_type VARCHAR(32) NOT NULL DEFAULT 'NONE',
    interaction_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(64),
    updated_by VARCHAR(64),
    CONSTRAINT chk_timeline_interaction_type CHECK (interaction_type IN ('NONE', 'QUIZ', 'PHOTO_GUESS'))
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option SMALLINT NOT NULL,
    explanation TEXT,
    reward_media_url VARCHAR(512),
    difficulty VARCHAR(16) NOT NULL DEFAULT 'EASY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(64),
    updated_by VARCHAR(64),
    CONSTRAINT chk_quiz_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    message_shown TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(64),
    updated_by VARCHAR(64)
);

CREATE TABLE dream_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    target_date DATE,
    status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
    extra_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(64),
    updated_by VARCHAR(64),
    CONSTRAINT chk_plan_status CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'DONE'))
);

CREATE INDEX idx_timeline_event_date ON timeline_events(event_date);
CREATE INDEX idx_timeline_interaction_type ON timeline_events(interaction_type);
CREATE INDEX idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX idx_dream_plans_status ON dream_plans(status);
