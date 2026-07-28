const { neon } = require("@netlify/neon");

const sql = neon();

/* Endless is ranked by how deep you got, with bonus as the tiebreaker.
   It used to be the other way round, which meant a wave-10 run that happened to
   roll a Wealth aura outranked someone who survived to wave 50 — the board was
   measuring luck rather than depth. This reshuffles the historical endless
   board; the stored rows themselves are untouched. */

exports.handler = async function handler(event) {
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
              order by ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
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
        order by wave_reached desc, bonus_score desc, created_at asc
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
              order by ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'endless'
        )
        select player_name, bonus_score, wave_reached, created_at,
               profile_username, profile_crest_id
        from ranked
        where player_rank = 1
        order by wave_reached desc, bonus_score desc, created_at asc
        limit 10
      `;
    }

    /* Placement for one player, so a run outside the top 10 still gets visible
       confirmation that it counted. Without it a submitted run looks identical
       to a lost one — which is exactly how a working board reads as broken. */
    let you = null;
    let total = 0;
    const requested = String(event?.queryStringParameters?.player || "").trim();

    try {
      const placement = await sql`
        with ranked as (
          select
            coalesce(u.username, ls.player_name) as player_name,
            ls.bonus_score,
            ls.wave_reached,
            ls.created_at,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'endless'
        ),
        best as (
          select
            player_name,
            bonus_score,
            wave_reached,
            rank() over (order by wave_reached desc, bonus_score desc, created_at asc) as place,
            count(*) over () as total
          from ranked
          where player_rank = 1
        )
        select place, total, player_name, bonus_score, wave_reached
        from best
        where lower(player_name) = lower(${requested})
        limit 1
      `;

      const totals = await sql`
        with ranked as (
          select
            coalesce(u.username, ls.player_name) as player_name,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.wave_reached desc, ls.bonus_score desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'endless'
        )
        select count(*)::int as total from ranked where player_rank = 1
      `;
      total = Number(totals?.[0]?.total) || 0;

      if (requested !== "" && placement.length) {
        you = {
          place: Number(placement[0].place),
          total,
          playerName: placement[0].player_name,
          bonusScore: Number(placement[0].bonus_score) || 0,
          waveReached: Number(placement[0].wave_reached) || 0
        };
      }
    } catch (_) {
      // Placement is a nicety; never fail the board over it.
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ rows, you, total })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load leaderboard" })
    };
  }
};
