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

  if (memoryRateLimited("confirm-email:" + getClientIp(event), 12, 10 * 60 * 1000)) {
    return json(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  try {
    const body = JSON.parse(String(event.body || "{}"));
    const token = String(body.token || "").trim();
    if (!token) {
      return json(400, { error: "Confirmation token is required." });
    }

    const tokenHash = sha256(token);

    // Claim the request, move the address, and sign every device out so the
    // next sign-in happens against the new email.
    const claimed = await sql`
      with claimed_request as (
        update email_change_requests
        set used = true
        where token_hash = ${tokenHash}
          and used = false
          and expires_at > now()
        returning user_id, new_email
      ),
      updated_user as (
        update users u
        set email = r.new_email,
            email_verified = true,
            email_verified_at = now()
        from claimed_request r
        where u.id = r.user_id
          and not exists (select 1 from users x where x.email = r.new_email)
        returning u.id, u.email
      ),
      deleted_sessions as (
        delete from user_sessions s
        using claimed_request r
        where s.user_id = r.user_id
        returning s.id
      )
      select u.email
      from claimed_request r
      join updated_user u on u.id = r.user_id
    `;

    if (!claimed.length) {
      return json(400, { error: "This confirmation link is invalid, expired, or the address is already in use." });
    }

    return json(200, {
      ok: true,
      email: claimed[0].email,
      message: "Email updated. Sign in again with your new address."
    });
  } catch (error) {
    console.error("confirm-email-change failed", {
      message: error?.message || String(error)
    });
    return json(500, { error: "Failed to confirm the email change." });
  }
};
