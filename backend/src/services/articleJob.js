// backend/src/services/articleJob.js

import { generateContentWithAI } from "./aiClient.js";
import { createArticle } from "../models/articleModel.js";

// Mesmas categorias do frontend
const CATEGORIES = [
    "noticias",
    "guias",
    "detonados",
    "torneios",
    "curiosidades",
    "estrategias",
];

// Tópicos base por categoria (para ficar coerente)
const TOPICS_BY_CATEGORY = {
    noticias: [
        "Atualizações recentes no competitivo de Pokémon",
        "Novos eventos especiais em jogos Pokémon",
        "Mudanças importantes no meta de batalhas",
    ],
    guias: [
        "Como montar um time equilibrado em Pokémon",
        "Guia para iniciantes no competitivo Pokémon",
        "Guia de tipos e matchups em batalhas",
    ],
    detonados: [
        "Detonado da campanha principal de um jogo Pokémon",
        "Passo a passo para vencer a Elite Four",
        "Como progredir mais rápido na história",
    ],
    torneios: [
        "Como se preparar para torneios de Pokémon",
        "Formato suíço vs eliminação simples em torneios",
        "Dicas para jogar torneios locais de Pokémon",
    ],
    curiosidades: [
        "Curiosidades sobre Pokémon pouco utilizados",
        "Histórias e teorias do universo Pokémon",
        "Easter eggs escondidos em jogos Pokémon",
    ],
    estrategias: [
        "Estratégias avançadas de team building",
        "Como usar hazards de forma eficiente em batalhas",
        "Controle de ritmo e pressão em batalhas Pokémon",
    ],
};

function pickRandomTopicForCategory(category) {
    const list = TOPICS_BY_CATEGORY[category] || TOPICS_BY_CATEGORY.noticias;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
}

// Slug helpers
function slugify(text) {
    if (!text) {
        return `artigo-${Date.now()}`;
    }

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function buildUniqueSlug(baseTitle) {
    const datePart = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const randPart = Math.floor(Math.random() * 1e6); // 0..999999
    return slugify(`${baseTitle}-${datePart}-${randPart}`);
}

// Número de dias desde Unix epoch (para cálculo simples de rotação / destaque)
function getDayNumber() {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;
    return Math.floor(now / DAY_MS);
}

/**
 * Job diário:
 * - Gera 2 artigos por dia
 * - Cada um com uma categoria diferente
 * - A cada 5 dias, o primeiro artigo do dia vem como featured = true
 */
export async function runDailyArticleJob() {
    const dayNumber = getDayNumber();

    // Índice base do dia para rotacionar as categorias
    const baseIndex = (dayNumber * 2) % CATEGORIES.length;

    const todaysCategories = [
        CATEGORIES[baseIndex],
        CATEGORIES[(baseIndex + 1) % CATEGORIES.length],
    ];

    const shouldFeatureToday = dayNumber % 5 === 0;

    for (let i = 0; i < todaysCategories.length; i++) {
        const category = todaysCategories[i];
        const topic = pickRandomTopicForCategory(category);

        const aiResult = await generateContentWithAI({
            type: "post",
            topic,
            category,
            generation: "geral",
        });

        const title = aiResult.title?.trim() || `Artigo sobre ${topic}`;
        const slug = buildUniqueSlug(title);

        const isFeatured = shouldFeatureToday && i === 0; // destaque 1x a cada 5 dias

        const articlePayload = {
            title,
            slug,
            excerpt: aiResult.excerpt || "",
            content: aiResult.content || "",
            category: aiResult.category || category,
            tags: aiResult.tags || [],
            generation: aiResult.generation || "geral",
            meta_description:
                aiResult.meta_description ||
                `Artigo sobre ${topic} no universo Pokémon.`,
            status: "publicado",
            featured: isFeatured,
            cover_image: aiResult.cover_image || null,
        };

        const article = await createArticle(articlePayload);

        console.log(
            `[articleJob] Artigo diário criado: ${article.id} - ${article.title} | categoria=${article.category} | featured=${article.featured}`,
        );
    }
}
