// backend/src/db/init.js
import { query } from "../services/db.js";

export async function initDb() {
  // Extensão para UUID
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // ARTICLES
  await query(`
    CREATE TABLE IF NOT EXISTS public.articles (
      id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title            text        NOT NULL,
      slug             text        NOT NULL UNIQUE,
      excerpt          text,
      content          text        NOT NULL,
      cover_image      text,
      category         text        NOT NULL DEFAULT 'noticias',
      tags             text[]      NOT NULL DEFAULT '{}'::text[],
      status           text        NOT NULL DEFAULT 'rascunho',
      featured         boolean     NOT NULL DEFAULT false,
      generation       text        NOT NULL DEFAULT 'geral',
      meta_description text,
      views            integer     NOT NULL DEFAULT 0,
      created_at       timestamptz NOT NULL DEFAULT now(),
      updated_at       timestamptz NOT NULL DEFAULT now()
    );
  `);

  // TOURNAMENTS
  await query(`
    CREATE TABLE IF NOT EXISTS public.tournaments (
      id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      name             text        NOT NULL,
      description      text,
      rules            text,
      location         text,
      starts_at        timestamptz,
      cover_image      text,
      generation       text        NOT NULL DEFAULT 'geral',
      status           text        NOT NULL DEFAULT 'rascunho',
      created_at       timestamptz NOT NULL DEFAULT now(),
      updated_at       timestamptz NOT NULL DEFAULT now()
    );
  `);

  console.log("✅ Database initialized (articles, tournaments ready)");
}
