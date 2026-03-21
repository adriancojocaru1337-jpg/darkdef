const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  normalizeEmail,
  sanitizeUsername,
  validateEmail,
  validatePassword,
  hashPassword,
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
    const email = normalizeEmail(body.email);
    const username = sanitizeUsername(body.username);
    const password = String(body.password || "");

    if (!validateEmail(email)) {
      return json(400, { error: "Please enter a valid email address." });
    }
    if (username.length < 3) {
      return json(400, { error: "Username must have at least 3 characters." });
    }
    if (!validatePassword(password)) {
      return json(400, { error: "Password must be between 8 and 72 characters." });
    }

    const existing = await sql`
      select id, email, username
      from users
      where email = ${email} or lower(username) = lower(${username})
      limit 1
    `;
    if (existing.length) {
      const sameEmail = String(existing[0].email || "").toLowerCase() === email;
      return json(409, {
        error: sameEmail ? "An account with this email already exists." : "This username is already taken."
      });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await sql`
      insert into users (email, username, password_hash, last_login_at)
      values (${email}, ${username}, ${passwordHash}, now())
      returning id, email, username, created_at
    `;
    const user = inserted[0];

    await sql`
      insert into user_profiles (user_id)
      values (${user.id})
      on conflict (user_id) do nothing
    `;

    const session = await createSession({ userId: user.id, event });

    return json(
      201,
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
    return json(500, { error: "Failed to create account." });
  }
};
