// src/services/articleJob.js
import cron from "node-cron";
import { generateArticleWithAI } from "./aiClient.js";
import { saveArticle } from "../models/articleModel.js";

export function startArticleJob() {
    cron.schedule("0 3 * * *", async () => {  // 03:00 UTC, por exemplo
        try {
            const article = await generateArticleWithAI();
            await saveArticle(article);
            console.log("Daily article generated");
        } catch (err) {
            console.error("Failed to generate article", err);
        }
    });
}
