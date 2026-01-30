-- Schema do ZapFin para PostgreSQL
-- Execute este arquivo no banco de dados do Railway

CREATE SCHEMA IF NOT EXISTS "public";

-- Tabela de gastos
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY,
	"group_id" text NOT NULL,
	"user_id" text NOT NULL,
	"category" text NOT NULL,
	"amount" numeric NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now()
);

-- Tabela de estados do usuário
CREATE TABLE IF NOT EXISTS "user_states" (
	"id" serial PRIMARY KEY,
	"group_id" text NOT NULL,
	"user_id" text NOT NULL,
	"current_category" text,
	"last_interaction" timestamp DEFAULT now()
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS "expenses_pkey" ON "expenses" ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_states_pkey" ON "user_states" ("id");

-- Índices adicionais para melhor performance
CREATE INDEX IF NOT EXISTS "idx_expenses_group_user" ON "expenses" ("group_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_expenses_category" ON "expenses" ("category");
CREATE INDEX IF NOT EXISTS "idx_user_states_group_user" ON "user_states" ("group_id", "user_id");
