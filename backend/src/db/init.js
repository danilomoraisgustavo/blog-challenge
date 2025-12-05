// backend/src/db/init.js
import { query } from "../services/db.js";

export async function initDb() {
  // Extensão para UUID (se não existir, ignora erro)
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await query(`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      category TEXT NOT NULL DEFAULT 'noticias',
      tags TEXT[] NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'rascunho', -- rascunho | publicado | agendado
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      generation TEXT NOT NULL DEFAULT 'geral',
      meta_description TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("✅ Database initialized (articles table ready)");
}
