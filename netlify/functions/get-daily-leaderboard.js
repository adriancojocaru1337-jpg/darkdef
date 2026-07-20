
const { neon } = require("@netlify/neon");

const sql = neon();
const DAILY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function serverTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

exports.handler = async function handler(event) {
  try {
    const requested = String(event.queryStringParameters?.day || "").trim();
    const day = DAILY_KEY_RE.test(requested) ? requested : serverTodayKey();

    // Daily runs are ranked by how far you survived, then by bonus score.
    const rows = await sql`
      select distinct on (lower(ls.player_name))
        ls.player_name,
        ls.bonus_score,
        ls.wave_reached,
        ls.kills,
        ls.created_at
      from leaderboard_scores ls
      where ls.mode = 'daily'
        and ls.daily_key = ${day}
      order by lower(ls.player_name), ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
    `;

    const top = rows
      .sort((a, b) =>
        (b.wave_reached - a.wave_reached) ||
        (b.bonus_score - a.bonus_score) ||
        (new Date(a.created_at) - new Date(b.created_at)))
      .slice(0, 10);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(top)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load daily leaderboard" })
    };
  }
};
