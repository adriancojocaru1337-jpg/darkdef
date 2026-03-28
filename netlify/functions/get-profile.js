const { sql, json, sanitizeUsername, getSessionUser } = require("./auth-utils");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method Not Allowed" });
  }

  const requestedUsername = sanitizeUsername(event.queryStringParameters?.username || "");
  if (!requestedUsername) {
    return json(400, { error: "Username is required." });
  }

  try {
    const session = await getSessionUser(event).catch(() => null);
    let users;
    try {
      users = await sql`
        select
          u.id,
          u.username,
          u.email,
          u.created_at,
          p.best_endless_score,
          p.best_story_stage,
          p.total_kills,
          p.total_runs,
          p.crest_id
        from users u
        left join user_profiles p on p.user_id = u.id
        where lower(u.username) = lower(${requestedUsername})
        limit 1
      `;
    } catch (_) {
      users = await sql`
        select
          u.id,
          u.username,
          u.email,
          u.created_at,
          p.best_endless_score,
          p.best_story_stage,
          p.total_kills,
          p.total_runs,
          null::text as crest_id
        from users u
        left join user_profiles p on p.user_id = u.id
        where lower(u.username) = lower(${requestedUsername})
        limit 1
      `;
    }

    const user = users[0];
    if (!user) {
      return json(404, { error: "Profile not found." });
    }

    const isOwner = !!session && String(session.username || "").toLowerCase() === String(user.username || "").toLowerCase();
    let recentRuns;
    let aggregatedStatsRows;

    try {
      recentRuns = isOwner
        ? await sql`
            select
              mode,
              score_total,
              bonus_score,
              wave_reached,
              kills,
              coalesce(submitted_at, updated_at, started_at) as created_at
            from game_runs
            where status in ('completed', 'submitted')
              and (user_id = ${user.id} or lower(player_name) = lower(${user.username}))
            order by coalesce(submitted_at, updated_at, started_at) desc
            limit 20
          `
        : await sql`
            select
              mode,
              score_total,
              bonus_score,
              wave_reached,
              kills,
              coalesce(submitted_at, updated_at, started_at) as created_at
            from game_runs
            where status in ('completed', 'submitted')
              and lower(player_name) = lower(${user.username})
            order by coalesce(submitted_at, updated_at, started_at) desc
            limit 8
          `;

      aggregatedStatsRows = isOwner
        ? await sql`
            select
              coalesce(max(case when mode = 'endless' then bonus_score end), 0)::int as best_endless_score,
              coalesce(max(case when mode = 'campaign' then wave_reached end), 1)::int as best_story_stage,
              coalesce(sum(kills), 0)::int as total_kills,
              coalesce(count(*), 0)::int as total_runs
            from game_runs
            where status in ('completed', 'submitted')
              and (user_id = ${user.id} or lower(player_name) = lower(${user.username}))
          `
        : await sql`
            select
              coalesce(max(case when mode = 'endless' then bonus_score end), 0)::int as best_endless_score,
              coalesce(max(case when mode = 'campaign' then wave_reached end), 1)::int as best_story_stage,
              coalesce(sum(kills), 0)::int as total_kills,
              coalesce(count(*), 0)::int as total_runs
            from game_runs
            where status in ('completed', 'submitted')
              and lower(player_name) = lower(${user.username})
          `;
    } catch (_) {
      recentRuns = isOwner
        ? await sql`
            select
              mode,
              score_total,
              bonus_score,
              wave_reached,
              kills,
              coalesce(submitted_at, updated_at, started_at) as created_at
            from game_runs
            where status in ('completed', 'submitted')
              and lower(player_name) = lower(${user.username})
            order by coalesce(submitted_at, updated_at, started_at) desc
            limit 20
          `
        : await sql`
            select
              mode,
              score_total,
              bonus_score,
              wave_reached,
              kills,
              coalesce(submitted_at, updated_at, started_at) as created_at
            from game_runs
            where lower(player_name) = lower(${user.username})
              and status in ('completed', 'submitted')
            order by coalesce(submitted_at, updated_at, started_at) desc
            limit 8
          `;

      aggregatedStatsRows = isOwner
        ? await sql`
            select
              coalesce(max(case when mode = 'endless' then bonus_score end), 0)::int as best_endless_score,
              coalesce(max(case when mode = 'campaign' then wave_reached end), 1)::int as best_story_stage,
              coalesce(sum(kills), 0)::int as total_kills,
              coalesce(count(*), 0)::int as total_runs
            from game_runs
            where status in ('completed', 'submitted')
              and lower(player_name) = lower(${user.username})
          `
        : await sql`
            select
              coalesce(max(case when mode = 'endless' then bonus_score end), 0)::int as best_endless_score,
              coalesce(max(case when mode = 'campaign' then wave_reached end), 1)::int as best_story_stage,
              coalesce(sum(kills), 0)::int as total_kills,
              coalesce(count(*), 0)::int as total_runs
            from game_runs
            where lower(player_name) = lower(${user.username})
              and status in ('completed', 'submitted')
          `;
    }

    const aggregatedStats = aggregatedStatsRows[0] || {};
    const bestEndlessScore = Math.max(
      Number(user.best_endless_score || 0),
      Number(aggregatedStats.best_endless_score || 0)
    );
    const bestStoryStage = Math.max(
      Number(user.best_story_stage || 1),
      Number(aggregatedStats.best_story_stage || 1)
    );
    const totalKills = Math.max(
      Number(user.total_kills || 0),
      Number(aggregatedStats.total_kills || 0)
    );
    const totalRuns = Math.max(
      Number(user.total_runs || 0),
      Number(aggregatedStats.total_runs || 0)
    );

    return json(200, {
      profile: {
        username: user.username,
        email: isOwner ? user.email : null,
        createdAt: user.created_at,
        isOwner,
        crestId: user.crest_id || null,
        stats: {
          bestEndlessScore,
          bestStoryStage,
          totalKills,
          totalRuns
        },
        recentRuns: recentRuns || []
      }
    });
  } catch (error) {
    return json(500, { error: "Failed to load profile." });
  }
};
