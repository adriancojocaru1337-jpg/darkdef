const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    const [endlessRows, storyRows] = await Promise.all([
      sql`
        select player_name, score_total, bonus_score, wave_reached, kills, created_at
        from leaderboard_scores
        where mode = 'endless'
        order by bonus_score desc, wave_reached desc, score_total desc, created_at asc
        limit 10
      `,
      sql`
        select player_name, score_total, bonus_score, wave_reached, kills, created_at
        from leaderboard_scores
        where mode = 'campaign'
        order by wave_reached desc, score_total desc, bonus_score desc, created_at asc
        limit 10
      `
    ]);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ endless: endlessRows, story: storyRows })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load leaderboards" })
    };
  }
};
