const {
  json,
  getSessionUser,
  sql,
  verifyPassword,
  clearSessionCookie
} = require("./auth-utils");

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
    const currentPassword = String(body.currentPassword || "");
    const confirmation = String(body.confirmation || "").trim();

    if (!currentPassword) {
      return json(400, { error: "Current password is required." });
    }
    if (confirmation !== "DELETE") {
      return json(400, { error: 'Type DELETE to confirm permanent account removal.' });
    }

    const users = await sql`
      select id, username, password_hash
      from users
      where id = ${session.user_id}
      limit 1
    `;
    const user = users[0];
    if (!user) {
      return json(404, { error: "Account not found." });
    }

    const validPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!validPassword) {
      return json(401, { error: "Current password is incorrect." });
    }

    const username = String(user.username || "").trim();

    await sql`
      delete from leaderboard_scores
      where user_id = ${user.id}
         or lower(player_name) = lower(${username})
    `;

    await sql`
      delete from game_runs
      where user_id = ${user.id}
         or lower(player_name) = lower(${username})
    `;

    await sql`
      delete from users
      where id = ${user.id}
    `;

    return json(
      200,
      { ok: true, message: "Account deleted permanently." },
      { headers: { "Set-Cookie": clearSessionCookie() } }
    );
  } catch (_) {
    return json(500, { error: "Failed to delete account." });
  }
};
