// backend/src/models/tournamentModel.js
import { query } from "../services/db.js";
import { randomUUID } from "crypto";

export async function listTournaments() {
    const res = await query(
        "SELECT id, name, description, location, starts_at, created_at FROM tournaments ORDER BY created_at DESC"
    );
    return res.rows;
}

export async function createTournament({ name, description, location, starts_at }) {
    const id = randomUUID();
    const res = await query(
        `INSERT INTO tournaments (id, name, description, location, starts_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [id, description, location, starts_at ? new Date(starts_at) : null]
    );
    return res.rows[0];
}
