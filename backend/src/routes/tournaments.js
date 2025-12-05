// backend/src/routes/tournaments.js
import { Router } from "express";
import { listTournaments, createTournament } from "../models/tournamentModel.js";

export const tournamentsRouter = Router();

tournamentsRouter.get("/", async (req, res) => {
    try {
        const items = await listTournaments();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to list tournaments" });
    }
});

tournamentsRouter.post("/", async (req, res) => {
    try {
        const { name, description, location, starts_at } = req.body;
        if (!name) return res.status(400).json({ error: "name is required" });

        const created = await createTournament({
            name,
            description,
            location,
            starts_at,
        });

        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create tournament" });
    }
});
