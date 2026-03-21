const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  validatePassword,
  hashPassword,
  sha256
} = require("./auth-utils");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  try {
    const body = JSON.parse(String(event.body || "{}"));
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token) {
      return json(400, { error: "Reset token is required." });
    }
    if (!validatePassword(password)) {
      return json(400, { error: "Password must be between 8 and 72 characters." });
    }

    const tokenHash = sha256(token);
    const rows = await sql`
      select id, user_id, expires_at, used
      from password_resets
      where token_hash = ${tokenHash}
      limit 1
    `;
    const resetRow = rows[0];
    if (!resetRow || resetRow.used || new Date(resetRow.expires_at).getTime() <= Date.now()) {
      return json(400, { error: "This reset link is invalid or has expired." });
    }

    const passwordHash = await hashPassword(password);

    await sql`
      update users
      set password_hash = ${passwordHash}
      where id = ${resetRow.user_id}
    `;
    await sql`
      update password_resets
      set used = true
      where id = ${resetRow.id}
    `;
    await sql`
      delete from user_sessions
      where user_id = ${resetRow.user_id}
    `;

    return json(200, { ok: true, message: "Password updated. You can sign in now." });
  } catch (error) {
    return json(500, { error: "Failed to reset password." });
  }
};
