// backend/src/routes/ai.js
import { Router } from "express";
import { generateContentWithAI } from "../services/aiClient.js";

export const aiRouter = Router();

// POST /ai/generate
aiRouter.post("/generate", async (req, res) => {
    try {
        const { type, topic, category, generation, format } = req.body || {};

        if (!topic || !topic.trim()) {
            return res.status(400).json({ error: "topic is required" });
        }

        const result = await generateContentWithAI({
            type,
            topic,
            category,
            generation,
            format,
        });

        res.json(result);
    } catch (err) {
        console.error("Erro ao gerar conteúdo com IA:", err);
        res.status(500).json({ error: "Failed to generate content with AI" });
    }
});
