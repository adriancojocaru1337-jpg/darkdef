const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    let rows;
    try {
      rows = await sql`
        select
          pl.user_id,
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
          pl.user_id,
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

    /* Hero names live in hero_loadouts.loadout->>'heroName' — submit-loadout
       already stores them, so no new column is needed. Fetched separately
       rather than joined into the queries above: hero_loadouts is optional, and
       a missing table must cost the board its hero names, not its rows. */
    try {
      const userIds = rows.map((row) => row.user_id).filter((id) => id !== null && id !== undefined);
      if (userIds.length) {
        const heroes = await sql`
          select user_id, nullif(trim(loadout->>'heroName'), '') as hero_name
          from hero_loadouts
          where user_id = any(${userIds}::bigint[])
        `;
        const byUser = new Map(heroes.map((h) => [String(h.user_id), h.hero_name]));
        for (const row of rows) {
          row.hero_name = byUser.get(String(row.user_id)) || null;
        }
      }
    } catch (_) {
      // hero_loadouts missing or unreadable: the board still ranks fine.
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
