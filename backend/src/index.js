// backend/src/index.js
import express from "express";
import cors from "cors";
import cron from "node-cron";

import { articlesRouter } from "./routes/articles.js";
import { tournamentsRouter } from "./routes/tournaments.js";
import { aiRouter } from "./routes/ai.js";
import { runDailyArticleJob } from "./services/articleJob.js";
import { initDb } from "./db/init.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Cron – 1x por dia às 03:00
cron.schedule("0 3 * * *", () => {
    runDailyArticleJob().catch((err) => {
        console.error("Erro ao rodar job diário de artigo:", err);
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend My-World's-Pokemon is running",
    });
});

app.use("/articles", articlesRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/ai", aiRouter);

// Garante schema antes de subir o servidor
await initDb();

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
