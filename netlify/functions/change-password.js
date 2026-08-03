const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  getSessionUser,
  verifyPassword,
  hashPassword,
  validatePassword,
  memoryRateLimited,
  getClientIp
} = require("./auth-utils");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  if (memoryRateLimited("change-password:" + getClientIp(event), 8, 10 * 60 * 1000)) {
    return json(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword || !newPassword) {
      return json(400, { error: "Current and new password are required." });
    }
    if (!validatePassword(newPassword)) {
      return json(400, { error: "New password must be between 8 and 72 characters." });
    }
    if (currentPassword === newPassword) {
      return json(400, { error: "The new password must be different from the current one." });
    }

    const rows = await sql`
      select id, password_hash
      from users
      where id = ${session.user_id}
      limit 1
    `;
    const user = rows[0];
    if (!user) {
      return json(401, { error: "Authentication required." });
    }

    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) {
      return json(401, { error: "Current password is incorrect." });
    }

    const passwordHash = await hashPassword(newPassword);

    // Update the password and revoke every OTHER session, so a stolen cookie
    // elsewhere stops working while this browser stays signed in.
    const revoked = await sql`
      with updated_user as (
        update users
        set password_hash = ${passwordHash}
        where id = ${session.user_id}
        returning id
      ),
      deleted_sessions as (
        delete from user_sessions
        where user_id = ${session.user_id}
          and id <> ${session.session_id}
        returning id
      )
      select (select count(*)::int from deleted_sessions) as revoked_sessions
    `;

    // Any pending reset links are no longer meaningful.
    await sql`
      update password_resets
      set used = true
      where user_id = ${session.user_id}
        and used = false
    `;

    return json(200, {
      ok: true,
      revokedSessions: revoked[0]?.revoked_sessions || 0,
      message: "Password updated. Other devices have been signed out."
    });
  } catch (error) {
    console.error("change-password failed", {
      message: error?.message || String(error)
    });
    return json(500, { error: "Failed to change the password." });
  }
};
