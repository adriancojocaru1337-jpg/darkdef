const { json, getSessionUser } = require("./auth-utils");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { authenticated: false });
    }

    return json(200, {
      authenticated: true,
      user: {
        id: session.user_id,
        username: session.username,
        email: session.email,
        createdAt: session.created_at,
        crestId: session.crest_id || null,
        stats: {
          bestEndlessScore: session.best_endless_score || 0,
          bestStoryStage: session.best_story_stage || 1,
          totalKills: session.total_kills || 0,
          totalRuns: session.total_runs || 0
        }
      }
    });
  } catch (error) {
    return json(500, { error: "Failed to load session." });
  }
};
