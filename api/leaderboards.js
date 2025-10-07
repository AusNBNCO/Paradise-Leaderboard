import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const game = req.query.game || "bo1";
    const { rows } = await pool.query(
      `SELECT * FROM clips WHERE game=$1 ORDER BY meters DESC LIMIT 3`,
      [game]
    );
    return res.status(200).json(rows);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
