// backend/src/routes/articles.js
import { Router } from "express";
import { query } from "../services/db.js";

export const articlesRouter = Router();

// -----------------------------
// Helper para normalizar payload do frontend
// -----------------------------
function normalizeArticlePayload(body) {
    const {
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description,
    } = body;

    if (!title || !content) {
        throw new Error("title e content são obrigatórios");
    }

    const safeSlug =
        slug ||
        title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    return {
        title,
        slug: safeSlug,
        excerpt: excerpt || "",
        content,
        cover_image: cover_image || "",
        category: category || "noticias",
        tags: Array.isArray(tags) ? tags : [],
        status: status || "rascunho",
        featured: Boolean(featured),
        generation: generation || "geral",
        meta_description: meta_description || "",
    };
}

// -----------------------------
// GET /articles -> lista (com filtros opcionais)
// -----------------------------
articlesRouter.get("/", async (req, res) => {
    try {
        const { status, category, generation, featured, limit } = req.query;

        const where = [];
        const params = [];

        if (status) {
            params.push(status);
            where.push(`status = $${params.length}`);
        }
        if (category) {
            params.push(category);
            where.push(`category = $${params.length}`);
        }
        if (generation) {
            params.push(generation);
            where.push(`generation = $${params.length}`);
        }
        if (featured === "true") {
            where.push(`featured = TRUE`);
        }
        if (featured === "false") {
            where.push(`featured = FALSE`);
        }

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const limitSql =
            limit && !Number.isNaN(Number(limit)) ? `LIMIT ${Number(limit)}` : "";

        const sql = `
      SELECT
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description,
        views,
        created_at,
        updated_at
      FROM articles
      ${whereSql}
      ORDER BY created_at DESC
      ${limitSql}
    `;

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao listar artigos:", err);
        res.status(500).json({ error: "Erro ao listar artigos" });
    }
});

// -----------------------------
// GET /articles/:id -> um artigo (incrementa views)
// -----------------------------
articlesRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            `
      UPDATE articles
      SET
        views = COALESCE(views, 0) + 1,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description,
        views,
        created_at,
        updated_at
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Artigo não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao buscar artigo:", err);
        res.status(500).json({ error: "Erro ao buscar artigo" });
    }
});

// -----------------------------
// POST /articles -> cria um artigo
// -----------------------------
articlesRouter.post("/", async (req, res) => {
    try {
        const data = normalizeArticlePayload(req.body);

        const result = await query(
            `
      INSERT INTO articles (
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description,
        views,
        created_at,
        updated_at
      `,
            [
                data.title,
                data.slug,
                data.excerpt,
                data.content,
                data.cover_image,
                data.category,
                data.tags,
                data.status,
                data.featured,
                data.generation,
                data.meta_description,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao criar artigo:", err);
        res.status(400).json({ error: err.message || "Erro ao criar artigo" });
    }
});

// -----------------------------
// PUT /articles/:id -> atualiza artigo
// -----------------------------
articlesRouter.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const data = normalizeArticlePayload(req.body);

        const result = await query(
            `
      UPDATE articles
      SET
        title = $1,
        slug = $2,
        excerpt = $3,
        content = $4,
        cover_image = $5,
        category = $6,
        tags = $7,
        status = $8,
        featured = $9,
        generation = $10,
        meta_description = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category,
        tags,
        status,
        featured,
        generation,
        meta_description,
        views,
        created_at,
        updated_at
      `,
            [
                data.title,
                data.slug,
                data.excerpt,
                data.content,
                data.cover_image,
                data.category,
                data.tags,
                data.status,
                data.featured,
                data.generation,
                data.meta_description,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Artigo não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro ao atualizar artigo:", err);
        res.status(400).json({ error: err.message || "Erro ao atualizar artigo" });
    }
});

// -----------------------------
// DELETE /articles/:id -> exclui artigo
// -----------------------------
articlesRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(`DELETE FROM articles WHERE id = $1`, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Artigo não encontrado" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Erro ao apagar artigo:", err);
        res.status(500).json({ error: "Erro ao apagar artigo" });
    }
});
