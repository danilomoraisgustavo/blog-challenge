// frontend/src/api/client.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function handle(res) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}

/**
 * Opcional: helper para montar querystring se você quiser usar filtros
 * no futuro (ex.: /articles?status=publicado&category=guias&limit=6)
 */
function buildQuery(params = {}) {
    const entries = Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
    );
    if (entries.length === 0) return "";
    const search = new URLSearchParams();
    for (const [key, value] of entries) {
        search.set(key, String(value));
    }
    return `?${search.toString()}`;
}

export const api = {
    // =========================
    // ARTIGOS (BLOG)
    // =========================

    /**
     * Lista artigos.
     * Aceita filtros opcionais: { status, category, generation, featured, limit }
     * Ex.: api.listArticles({ status: "publicado", limit: 6 })
     */
    listArticles(params) {
        const qs = buildQuery(params);
        return fetch(`${API_URL}/articles${qs}`).then(handle);
    },

    /**
     * Busca 1 artigo por ID (já incrementa views no backend).
     */
    getArticle(id) {
        return fetch(`${API_URL}/articles/${id}`).then(handle);
    },

    // Alias opcional, se você quiser usar getArticleById em algumas telas
    getArticleById(id) {
        return this.getArticle(id);
    },

    createArticle(data) {
        return fetch(`${API_URL}/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handle);
    },

    updateArticle(id, data) {
        return fetch(`${API_URL}/articles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handle);
    },

    deleteArticle(id) {
        return fetch(`${API_URL}/articles/${id}`, {
            method: "DELETE",
        }).then(handle);
    },

    // =========================
    // TORNEIOS
    // =========================

    listTournaments(params) {
        const qs = buildQuery(params);
        return fetch(`${API_URL}/tournaments${qs}`).then(handle);
    },

    getTournament(id) {
        return fetch(`${API_URL}/tournaments/${id}`).then(handle);
    },

    createTournament(data) {
        return fetch(`${API_URL}/tournaments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handle);
    },

    updateTournament(id, data) {
        return fetch(`${API_URL}/tournaments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handle);
    },

    deleteTournament(id) {
        return fetch(`${API_URL}/tournaments/${id}`, {
            method: "DELETE",
        }).then(handle);
    },

    generateContentWithAI(payload) {
        return fetch(`${API_URL}/ai/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then(handle);
    },
};
