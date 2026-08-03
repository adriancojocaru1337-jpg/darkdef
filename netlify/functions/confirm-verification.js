const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  memoryRateLimited,
  getClientIp,
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

  if (memoryRateLimited("confirm-verification:" + getClientIp(event), 12, 10 * 60 * 1000)) {
    return json(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  try {
    const body = JSON.parse(String(event.body || "{}"));
    const token = String(body.token || "").trim();
    if (!token) {
      return json(400, { error: "Confirmation token is required." });
    }

    const tokenHash = sha256(token);

    // Only mark the account verified if the address on the token still matches
    // the account's current email — otherwise an old link could confirm an
    // address the player has since moved away from.
    const claimed = await sql`
      with claimed_token as (
        update email_verifications
        set used = true
        where token_hash = ${tokenHash}
          and used = false
          and expires_at > now()
        returning user_id, email
      ),
      verified_user as (
        update users u
        set email_verified = true,
            email_verified_at = now()
        from claimed_token t
        where u.id = t.user_id
          and u.email = t.email
        returning u.id, u.email, u.username
      )
      select u.email, u.username
      from claimed_token t
      join verified_user u on u.id = t.user_id
    `;

    if (!claimed.length) {
      return json(400, { error: "This confirmation link is invalid, expired, or no longer matches your account email." });
    }

    return json(200, {
      ok: true,
      email: claimed[0].email,
      username: claimed[0].username,
      message: "Email confirmed. Your account is fully set up."
    });
  } catch (error) {
    console.error("confirm-verification failed", {
      message: error?.message || String(error)
    });
    return json(500, { error: "Failed to confirm the email." });
  }
};
