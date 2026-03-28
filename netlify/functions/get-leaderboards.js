const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    const [endlessRows, storyRows] = await Promise.all([
      sql`
        select
          ls.player_name,
          ls.score_total,
          ls.bonus_score,
          ls.wave_reached,
          ls.kills,
          ls.created_at,
          u.username as profile_username
        from leaderboard_scores ls
        left join users u on lower(u.username) = lower(ls.player_name)
        where ls.mode = 'endless'
        order by ls.bonus_score desc, ls.wave_reached desc, ls.score_total desc, ls.created_at asc
        limit 10
      `,
      sql`
        select
          ls.player_name,
          ls.score_total,
          ls.bonus_score,
          ls.wave_reached,
          ls.kills,
          ls.created_at,
          u.username as profile_username
        from leaderboard_scores ls
        left join users u on lower(u.username) = lower(ls.player_name)
        where ls.mode = 'campaign'
        order by ls.wave_reached desc, ls.score_total desc, ls.bonus_score desc, ls.created_at asc
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
