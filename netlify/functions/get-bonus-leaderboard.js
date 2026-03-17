const { neon } = require("@netlify/neon");
const sql = neon();

exports.handler = async function handler() {
  try {
    const rows = await sql`
      select player_name, bonus_score, wave_reached, created_at
      from leaderboard_scores
      where mode = 'endless'
      order by bonus_score desc, wave_reached desc, created_at asc
      limit 5
    `;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(rows)
    };
  } catch {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load leaderboard" })
    };
  }
};