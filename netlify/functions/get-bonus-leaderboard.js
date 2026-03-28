const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    let rows;
    try {
      rows = await sql`
        select
          ls.player_name,
          ls.bonus_score,
          ls.wave_reached,
          ls.created_at,
          p.crest_id as profile_crest_id
        from leaderboard_scores ls
        left join users u on lower(u.username) = lower(ls.player_name)
        left join user_profiles p on p.user_id = u.id
        where ls.mode = 'endless'
        order by ls.bonus_score desc, ls.wave_reached desc, ls.created_at asc
        limit 5
      `;
    } catch (_) {
      rows = await sql`
        select
          ls.player_name,
          ls.bonus_score,
          ls.wave_reached,
          ls.created_at,
          null::text as profile_crest_id
        from leaderboard_scores ls
        left join users u on lower(u.username) = lower(ls.player_name)
        where ls.mode = 'endless'
        order by ls.bonus_score desc, ls.wave_reached desc, ls.created_at asc
        limit 5
      `;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load leaderboard" })
    };
  }
};
