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

// ======================
// CRON – 1 artigo a cada 8 horas
// Horários (America/Sao_Paulo): 00h, 08h, 16h, 00h...
// ======================
cron.schedule(
    "0 */8 * * *",
    () => {
        console.log("⏱ Job de artigo (a cada 8 horas) disparado...");
        runDailyArticleJob().catch((err) => {
            console.error("Erro no job de 8 horas:", err);
        });
    },
    {
        scheduled: true,
        timezone: "America/Sao_Paulo",
    },
);

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
