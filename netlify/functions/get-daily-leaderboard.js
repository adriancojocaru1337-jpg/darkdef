
const { neon } = require("@netlify/neon");

const sql = neon();
const DAILY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function serverTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function rankAndTrim(rows) {
  return rows
    .sort((a, b) =>
      (b.wave_reached - a.wave_reached) ||
      (b.bonus_score - a.bonus_score) ||
      (new Date(a.created_at) - new Date(b.created_at)))
    .slice(0, 10);
}

exports.handler = async function handler(event) {
  try {
    const requested = String(event.queryStringParameters?.day || "").trim();
    const day = DAILY_KEY_RE.test(requested) ? requested : serverTodayKey();

    // Best run per player, ranked by deepest wave. Profile/crest joins mirror
    // get-leaderboards; the fallback query keeps the board alive if the
    // profile tables are missing.
    let rows;
    try {
      rows = await sql`
        select distinct on (lower(ls.player_name))
          ls.player_name,
          ls.score_total,
          ls.bonus_score,
          ls.wave_reached,
          ls.kills,
          ls.created_at,
          u.username as profile_username,
          p.crest_id as profile_crest_id
        from leaderboard_scores ls
        left join users u on lower(u.username) = lower(ls.player_name)
        left join user_profiles p on p.user_id = u.id
        where ls.mode = 'daily'
          and ls.daily_key = ${day}
        order by lower(ls.player_name), ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
      `;
    } catch (_) {
      rows = await sql`
        select distinct on (lower(ls.player_name))
          ls.player_name,
          ls.score_total,
          ls.bonus_score,
          ls.wave_reached,
          ls.kills,
          ls.created_at,
          null::text as profile_username,
          null::text as profile_crest_id
        from leaderboard_scores ls
        where ls.mode = 'daily'
          and ls.daily_key = ${day}
        order by lower(ls.player_name), ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
      `;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(rankAndTrim(rows))
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load daily leaderboard" })
    };
  }
};
