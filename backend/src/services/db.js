// backend/src/services/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "myworlds",
});

export async function query(text, params) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res;
    } finally {
        client.release();
    }
}
