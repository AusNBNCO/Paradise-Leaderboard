// Node.js Serverless Function (no Express)
import pkg from "pg";
const { Pool } = pkg;

// Reuse one pool across invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Railway requires SSL
});

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const game = (req.query.game || "bo1").toString();
    const { rows } = await pool.query(
      "SELECT game, player, map, meters, video_url FROM clips WHERE game=$1 ORDER BY meters DESC LIMIT 3",
      [game]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("leaderboards error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
