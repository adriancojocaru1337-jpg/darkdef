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
    const users = await sql`
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

    const user = users[0];
    if (!user) {
      return json(404, { error: "Profile not found." });
    }

    const isOwner = !!session && String(session.username || "").toLowerCase() === String(user.username || "").toLowerCase();
    const recentRuns = isOwner
      ? await sql`
          select mode, score_total, bonus_score, wave_reached, kills, created_at
          from leaderboard_scores
          where user_id = ${user.id}
          order by created_at desc
          limit 20
        `
      : await sql`
          select mode, score_total, bonus_score, wave_reached, kills, created_at
          from leaderboard_scores
          where lower(player_name) = lower(${user.username})
          order by created_at desc
          limit 8
        `;

    return json(200, {
      profile: {
        username: user.username,
        email: isOwner ? user.email : null,
        createdAt: user.created_at,
        isOwner,
        crestId: user.crest_id || null,
        stats: {
          bestEndlessScore: user.best_endless_score || 0,
          bestStoryStage: user.best_story_stage || 1,
          totalKills: user.total_kills || 0,
          totalRuns: user.total_runs || 0
        },
        recentRuns: recentRuns || []
      }
    });
  } catch (error) {
    return json(500, { error: "Failed to load profile." });
  }
};
