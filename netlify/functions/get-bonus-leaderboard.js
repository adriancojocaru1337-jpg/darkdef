const { neon } = require("@netlify/neon");

const sql = neon();

exports.handler = async function handler() {
  try {
    let rows;
    try {
      rows = await sql`
        with ranked as (
          select
            coalesce(u.username, ls.player_name) as player_name,
            ls.bonus_score,
            ls.wave_reached,
            ls.created_at,
            u.username as profile_username,
            p.crest_id as profile_crest_id,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.bonus_score desc, ls.wave_reached desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          left join user_profiles p on p.user_id = u.id
          where ls.mode = 'endless'
        )
        select player_name, bonus_score, wave_reached, created_at,
               profile_username, profile_crest_id
        from ranked
        where player_rank = 1
        order by bonus_score desc, wave_reached desc, created_at asc
        limit 10
      `;
    } catch (_) {
      rows = await sql`
        with ranked as (
          select
            coalesce(u.username, ls.player_name) as player_name,
            ls.bonus_score,
            ls.wave_reached,
            ls.created_at,
            u.username as profile_username,
            null::text as profile_crest_id,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.bonus_score desc, ls.wave_reached desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'endless'
        )
        select player_name, bonus_score, wave_reached, created_at,
               profile_username, profile_crest_id
        from ranked
        where player_rank = 1
        order by bonus_score desc, wave_reached desc, created_at asc
        limit 10
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
