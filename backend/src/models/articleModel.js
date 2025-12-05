// backend/src/models/articleModel.js
import { query } from "../services/db.js";
import { randomUUID } from "crypto";

// Lista todos os artigos
export async function listArticles() {
    const res = await query(
        `SELECT id, title, slug, excerpt, content, category,
            status, featured, generation, created_at
       FROM articles
   ORDER BY created_at DESC`
    );
    return res.rows;
}

// Busca um artigo por ID
export async function getArticle(id) {
    const res = await query(
        `SELECT id, title, slug, excerpt, content, category,
            status, featured, generation, created_at
       FROM articles
      WHERE id = $1`,
        [id]
    );
    return res.rows[0] || null;
}

// Cria um novo artigo
export async function createArticle({
    title,
    slug,
    excerpt,
    content,
    category,
    status,
    featured,
    generation,
}) {
    const id = randomUUID();

    const res = await query(
        `INSERT INTO articles
       (id, title, slug, excerpt, content, category, status, featured, generation)
     VALUES ($1,  $2,    $3,   $4,      $5,      $6,      $7,      $8,       $9)
  RETURNING id, title, slug, excerpt, content, category,
            status, featured, generation, created_at`,
        [
            id,
            title,
            slug,
            excerpt || "",
            content,
            category || null,
            status || "rascunho",
            featured ?? false,
            generation || "geral",
        ]
    );

    return res.rows[0];
}

// Atualiza um artigo existente
export async function updateArticle(
    id,
    { title, slug, excerpt, content, category, status, featured, generation }
) {
    const res = await query(
        `UPDATE articles
        SET title      = $2,
            slug       = $3,
            excerpt    = $4,
            content    = $5,
            category   = $6,
            status     = $7,
            featured   = $8,
            generation = $9
      WHERE id = $1
  RETURNING id, title, slug, excerpt, content, category,
            status, featured, generation, created_at`,
        [
            id,
            title,
            slug,
            excerpt || "",
            content,
            category || null,
            status || "rascunho",
            featured ?? false,
            generation || "geral",
        ]
    );
    return res.rows[0] || null;
}

// Remove um artigo
export async function deleteArticle(id) {
    await query("DELETE FROM articles WHERE id = $1", [id]);
    return true;
}
