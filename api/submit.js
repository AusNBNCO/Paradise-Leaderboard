import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { game, player, map, meters, video_url } = req.body || {};
    if (!game || !player || !map || typeof meters === "undefined") {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    await pool.query(
      `INSERT INTO clips (game, player, map, meters, video_url, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [game, player, map, Number(meters), video_url || null]
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("submit error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
