const {
  json,
  getSessionUser,
  sql,
  normalizeEmail,
  sanitizeUsername,
  validateEmail,
  validatePassword,
  verifyPassword,
  hashPassword
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
    const username = sanitizeUsername(body.username || session.username);
    const email = normalizeEmail(body.email || session.email);
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword) {
      return json(400, { error: "Current password is required." });
    }

    const users = await sql`
      select id, username, email, password_hash
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

    if (username.length < 3) {
      return json(400, { error: "Username must have at least 3 characters." });
    }
    if (!validateEmail(email)) {
      return json(400, { error: "Please enter a valid email address." });
    }
    if (newPassword && !validatePassword(newPassword)) {
      return json(400, { error: "New password must be between 8 and 72 characters." });
    }

    const duplicate = await sql`
      select id, email, username
      from users
      where id <> ${session.user_id}
        and (email = ${email} or lower(username) = lower(${username}))
      limit 1
    `;
    if (duplicate.length) {
      const sameEmail = String(duplicate[0].email || "").toLowerCase() === email;
      return json(409, {
        error: sameEmail ? "An account with this email already exists." : "This username is already taken."
      });
    }

    const nextPasswordHash = newPassword ? await hashPassword(newPassword) : user.password_hash;

    const updated = await sql`
      update users
      set username = ${username},
          email = ${email},
          password_hash = ${nextPasswordHash}
      where id = ${session.user_id}
      returning id, username, email, created_at
    `;

    const savedUser = updated[0];
    return json(200, {
      ok: true,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        createdAt: savedUser.created_at
      }
    });
  } catch (_) {
    return json(500, { error: "Failed to update account." });
  }
};
