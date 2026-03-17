const { neon } = require("@netlify/neon");
const sql = neon();

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { name, score, bonusScore, wave, kills } = JSON.parse(event.body || "{}");
    const playerName = String(name || "").trim().slice(0, 20);
    const scoreTotal = Number(score);
    const bonus = Number(bonusScore);
    const waveReached = Number(wave);
    const killsCount = Number(kills || 0);
    if (!playerName || !Number.isFinite(scoreTotal) || !Number.isFinite(bonus) || !Number.isFinite(waveReached)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid payload" }) };
    }
    await sql`
      insert into leaderboard_scores
      (player_name, score_total, bonus_score, wave_reached, kills, mode)
      values
      (${playerName}, ${scoreTotal}, ${bonus}, ${waveReached}, ${killsCount}, 'endless')
    `;
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Failed to save score" }) };
  }
};