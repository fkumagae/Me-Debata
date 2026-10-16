-- ME DEBATA — esquema inicial para PostgreSQL
-- Execute em um banco vazio. A versão estática do app não depende deste banco.

CREATE TABLE IF NOT EXISTS wheel_categories (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wheel_items (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES wheel_categories(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (category_id, label)
);

CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    wins INTEGER NOT NULL DEFAULT 0 CHECK (wins >= 0),
    losses INTEGER NOT NULL DEFAULT 0 CHECK (losses >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rounds (
    id BIGSERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    verb TEXT NOT NULL,
    complement TEXT NOT NULL,
    player_for_id BIGINT REFERENCES players(id) ON DELETE SET NULL,
    player_against_id BIGINT REFERENCES players(id) ON DELETE SET NULL,
    winner_id BIGINT REFERENCES players(id) ON DELETE SET NULL,
    duration_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (player_for_id IS NULL OR player_against_id IS NULL OR player_for_id <> player_against_id)
);

CREATE INDEX IF NOT EXISTS idx_wheel_items_category_enabled
    ON wheel_items(category_id, enabled);
CREATE INDEX IF NOT EXISTS idx_rounds_created_at
    ON rounds(created_at DESC);
