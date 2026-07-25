const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    let rows;
    try {
      rows = await sql`
        select
          coalesce(u.username, pl.player_name) as player_name,
          pl.power,
          pl.equipment_power,
          pl.skill_points,
          pl.updated_at,
          u.username as profile_username,
          p.crest_id as profile_crest_id
        from power_leaderboard pl
        left join users u on u.id = pl.user_id
        left join user_profiles p on p.user_id = pl.user_id
        order by pl.power desc, pl.updated_at asc
        limit 10
      `;
    } catch (_) {
      rows = await sql`
        select
          coalesce(u.username, pl.player_name) as player_name,
          pl.power,
          pl.equipment_power,
          pl.skill_points,
          pl.updated_at,
          u.username as profile_username,
          null::text as profile_crest_id
        from power_leaderboard pl
        left join users u on u.id = pl.user_id
        order by pl.power desc, pl.updated_at asc
        limit 10
      `;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ power: rows })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load power leaderboard" })
    };
  }
};
