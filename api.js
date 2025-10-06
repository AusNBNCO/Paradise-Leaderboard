// api.js
import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // important for Railway SSL
});

// 📊 GET leaderboard
app.get("/api/leaderboards", async (req, res) => {
  const game = req.query.game || "bo1";
  const { rows } = await pool.query(
    `SELECT * FROM clips WHERE game=$1 ORDER BY meters DESC LIMIT 3`,
    [game]
  );
  res.json(rows);
});

// 📥 POST new clip
app.post("/api/submit", async (req, res) => {
  const { game, player, map, meters, video_url } = req.body;
  await pool.query(
    `INSERT INTO clips (game, player, map, meters, video_url)
     VALUES ($1, $2, $3, $4, $5)`,
    [game, player, map, meters, video_url]
  );
  res.json({ ok: true });
});

// For Vercel compatibility
export default app;
