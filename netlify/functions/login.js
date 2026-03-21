const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  normalizeEmail,
  verifyPassword,
  createSession
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
    const login = normalizeEmail(body.login || body.email || "");
    const password = String(body.password || "");

    if (!login || !password) {
      return json(400, { error: "Email or username and password are required." });
    }

    const rows = await sql`
      select id, email, username, password_hash, created_at
      from users
      where email = ${login} or lower(username) = lower(${login})
      limit 1
    `;
    const user = rows[0];
    if (!user) {
      return json(401, { error: "Invalid credentials." });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return json(401, { error: "Invalid credentials." });
    }

    await sql`
      update users
      set last_login_at = now()
      where id = ${user.id}
    `;

    const session = await createSession({ userId: user.id, event });

    return json(
      200,
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.created_at
        }
      },
      { headers: { "Set-Cookie": session.cookie } }
    );
  } catch (error) {
    return json(500, { error: "Failed to sign in." });
  }
};
