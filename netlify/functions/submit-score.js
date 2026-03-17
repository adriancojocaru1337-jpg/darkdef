const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

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

    if (scoreTotal < 0 || bonus < 0 || waveReached < 1 || scoreTotal > 5000000 || bonus > 5000000 || killsCount < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Rejected score" }) };
    }

    await sql`
      insert into leaderboard_scores
      (player_name, score_total, bonus_score, wave_reached, kills, mode)
      values
      (${playerName}, ${scoreTotal}, ${bonus}, ${waveReached}, ${killsCount}, 'endless')
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to save score" })
    };
  }
};