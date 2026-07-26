const { json, getSessionUser, sanitizeUsername, sql } = require("./auth-utils");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const username = sanitizeUsername(body.username);
    if (username.length < 3) {
      return json(400, { error: "Username must have at least 3 characters." });
    }

    const current = await sql`
      select username from users where id = ${session.user_id} limit 1
    `;
    const currentName = current.length ? String(current[0].username) : "";
    if (currentName && currentName.toLowerCase() === username.toLowerCase()) {
      return json(400, { error: "That is already your username." });
    }

    const taken = await sql`
      select id from users
      where lower(username) = lower(${username}) and id <> ${session.user_id}
      limit 1
    `;
    if (taken.length) {
      return json(409, { error: "This username is already taken." });
    }

    const updated = await sql`
      update users set username = ${username}
      where id = ${session.user_id}
      returning id, username
    `;
    if (!updated.length) {
      return json(500, { error: "Failed to update username." });
    }

    // Refresh the frozen name copies so any query that still reads player_name
    // directly (and the power board's own row) stays consistent immediately.
    // Best-effort: the leaderboards already resolve the current name by user_id,
    // so a failure here never blocks the rename.
    try {
      await sql`
        update leaderboard_scores set player_name = ${username}
        where user_id = ${session.user_id}
      `;
    } catch (err) {
      console.error("rename-username: leaderboard_scores backfill failed", err);
    }
    try {
      await sql`
        update power_leaderboard set player_name = ${username}
        where user_id = ${session.user_id}
      `;
    } catch (err) {
      console.error("rename-username: power_leaderboard backfill failed", err);
    }

    return json(200, { ok: true, username: updated[0].username });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("unique") || message.includes("duplicate")) {
      return json(409, { error: "This username is already taken." });
    }
    return json(500, { error: "Failed to update username." });
  }
};
