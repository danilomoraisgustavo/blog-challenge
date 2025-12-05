import express from "express";
import cors from "cors";
import { articlesRouter } from "./routes/articles.js";
import { tournamentsRouter } from "./routes/tournaments.js";
import { aiRouter } from "./routes/ai.js";
import cron from "node-cron";
import { runDailyArticleJob } from "./services/articleJob.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

cron.schedule("0 3 * * *", () => {
    runDailyArticleJob().catch((err) => {
        console.error("Erro ao rodar job diário de artigo:", err);
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Backend My-World's-Pokemon is running" });
});

app.use("/articles", articlesRouter);
app.use("/tournaments", tournamentsRouter);
app.use("/ai", aiRouter);

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
