const { neon } = require("@netlify/neon");
const { getSessionUser } = require("./auth-utils");

const sql = neon();

async function getOwnRankedRow(userId, mode) {
  if (!userId) return null;
  const rows = mode === "endless"
    ? await sql`
        with candidates as (
          select
            ls.user_id,
            coalesce(u.username, ls.player_name) as player_name,
            ls.score_total, ls.bonus_score, ls.wave_reached, ls.kills, ls.created_at,
            u.username as profile_username,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.bonus_score desc, ls.wave_reached desc, ls.score_total desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'endless'
        ), ranked as (
          select *, row_number() over (
            order by bonus_score desc, wave_reached desc, score_total desc, created_at asc
          )::int as global_rank
          from candidates
          where player_rank = 1
        )
        select player_name, score_total, bonus_score, wave_reached, kills, created_at,
               profile_username, null::text as profile_crest_id, global_rank
        from ranked
        where user_id = ${userId}
        limit 1
      `
    : await sql`
        with candidates as (
          select
            ls.user_id,
            coalesce(u.username, ls.player_name) as player_name,
            ls.score_total, ls.bonus_score, ls.wave_reached, ls.kills, ls.created_at,
            u.username as profile_username,
            row_number() over (
              partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
              order by ls.wave_reached desc, ls.score_total desc, ls.bonus_score desc, ls.created_at asc
            ) as player_rank
          from leaderboard_scores ls
          left join users u on u.id = ls.user_id
          where ls.mode = 'campaign'
        ), ranked as (
          select *, row_number() over (
            order by wave_reached desc, score_total desc, bonus_score desc, created_at asc
          )::int as global_rank
          from candidates
          where player_rank = 1
        )
        select player_name, score_total, bonus_score, wave_reached, kills, created_at,
               profile_username, null::text as profile_crest_id, global_rank
        from ranked
        where user_id = ${userId}
        limit 1
      `;
  return rows[0] || null;
}

exports.handler = async function handler(event) {
  try {
    const sessionUser = await getSessionUser(event).catch(() => null);
    let endlessRows;
    let storyRows;
    try {
      [endlessRows, storyRows] = await Promise.all([
        sql`
          with ranked as (
            select
              coalesce(u.username, ls.player_name) as player_name,
              ls.score_total,
              ls.bonus_score,
              ls.wave_reached,
              ls.kills,
              ls.created_at,
              u.username as profile_username,
              p.crest_id as profile_crest_id,
              row_number() over (
                partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
                order by ls.bonus_score desc, ls.wave_reached desc, ls.score_total desc, ls.created_at asc
              ) as player_rank
            from leaderboard_scores ls
            left join users u on u.id = ls.user_id
            left join user_profiles p on p.user_id = u.id
            where ls.mode = 'endless'
          )
          select player_name, score_total, bonus_score, wave_reached, kills, created_at,
                 profile_username, profile_crest_id
          from ranked
          where player_rank = 1
          order by bonus_score desc, wave_reached desc, score_total desc, created_at asc
          limit 10
        `,
        sql`
          with ranked as (
            select
              coalesce(u.username, ls.player_name) as player_name,
              ls.score_total,
              ls.bonus_score,
              ls.wave_reached,
              ls.kills,
              ls.created_at,
              u.username as profile_username,
              p.crest_id as profile_crest_id,
              row_number() over (
                partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
                order by ls.wave_reached desc, ls.score_total desc, ls.bonus_score desc, ls.created_at asc
              ) as player_rank
            from leaderboard_scores ls
            left join users u on u.id = ls.user_id
            left join user_profiles p on p.user_id = u.id
            where ls.mode = 'campaign'
          )
          select player_name, score_total, bonus_score, wave_reached, kills, created_at,
                 profile_username, profile_crest_id
          from ranked
          where player_rank = 1
          order by wave_reached desc, score_total desc, bonus_score desc, created_at asc
          limit 10
        `
      ]);
    } catch (_) {
      [endlessRows, storyRows] = await Promise.all([
        sql`
          with ranked as (
            select
              coalesce(u.username, ls.player_name) as player_name,
              ls.score_total,
              ls.bonus_score,
              ls.wave_reached,
              ls.kills,
              ls.created_at,
              u.username as profile_username,
              null::text as profile_crest_id,
              row_number() over (
                partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
                order by ls.bonus_score desc, ls.wave_reached desc, ls.score_total desc, ls.created_at asc
              ) as player_rank
            from leaderboard_scores ls
            left join users u on u.id = ls.user_id
            where ls.mode = 'endless'
          )
          select player_name, score_total, bonus_score, wave_reached, kills, created_at,
                 profile_username, profile_crest_id
          from ranked
          where player_rank = 1
          order by bonus_score desc, wave_reached desc, score_total desc, created_at asc
          limit 10
        `,
        sql`
          with ranked as (
            select
              coalesce(u.username, ls.player_name) as player_name,
              ls.score_total,
              ls.bonus_score,
              ls.wave_reached,
              ls.kills,
              ls.created_at,
              u.username as profile_username,
              null::text as profile_crest_id,
              row_number() over (
                partition by coalesce('u:' || ls.user_id::text, 'g:' || lower(ls.player_name))
                order by ls.wave_reached desc, ls.score_total desc, ls.bonus_score desc, ls.created_at asc
              ) as player_rank
            from leaderboard_scores ls
            left join users u on u.id = ls.user_id
            where ls.mode = 'campaign'
          )
          select player_name, score_total, bonus_score, wave_reached, kills, created_at,
                 profile_username, profile_crest_id
          from ranked
          where player_rank = 1
          order by wave_reached desc, score_total desc, bonus_score desc, created_at asc
          limit 10
        `
      ]);
    }

    let own = { endless: null, story: null };
    if (sessionUser?.user_id) {
      try {
        const [ownEndless, ownStory] = await Promise.all([
          getOwnRankedRow(sessionUser.user_id, "endless"),
          getOwnRankedRow(sessionUser.user_id, "campaign")
        ]);
        own = { endless: ownEndless, story: ownStory };
      } catch (_) {
        // Personal rank is additive. A migration/query failure must never hide
        // the public Top 10 boards that already loaded successfully.
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ endless: endlessRows, story: storyRows, own })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load leaderboards" })
    };
  }
};
