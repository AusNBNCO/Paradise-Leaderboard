import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { game, player, map, meters, video_url } = req.body;
    await pool.query(
      `INSERT INTO clips (game, player, map, meters, video_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [game, player, map, meters, video_url]
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
