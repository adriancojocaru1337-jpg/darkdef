const crypto = require("crypto");
const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  getSessionUser,
  verifyPassword,
  normalizeEmail,
  validateEmail,
  memoryRateLimited,
  getClientIp,
  hashIp,
  sha256
} = require("./auth-utils");
const { getPasswordResetBaseUrl } = require("./request-security");
const { sendMail, emailLayout } = require("./mailer");

const CHANGE_TTL_MINUTES = 30;
const GENERIC_MESSAGE =
  "If that address can be used, a confirmation link has been sent to it. Open the link from the new inbox to finish the change.";

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  if (memoryRateLimited("change-email:" + getClientIp(event), 6, 30 * 60 * 1000)) {
    return json(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const password = String(body.password || "");
    const newEmail = normalizeEmail(body.newEmail || body.email || "");

    if (!password) {
      return json(400, { error: "Your current password is required." });
    }
    if (!validateEmail(newEmail)) {
      return json(400, { error: "Please enter a valid email address." });
    }

    const rows = await sql`
      select id, email, username, password_hash
      from users
      where id = ${session.user_id}
      limit 1
    `;
    const user = rows[0];
    if (!user) {
      return json(401, { error: "Authentication required." });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return json(401, { error: "Password is incorrect." });
    }

    if (normalizeEmail(user.email) === newEmail) {
      return json(400, { error: "That is already your account email." });
    }

    const ipHash = hashIp(getClientIp(event));

    // Address already registered: answer generically so this endpoint cannot
    // be used to probe which emails have accounts.
    const taken = await sql`
      select id from users where email = ${newEmail} limit 1
    `;
    if (taken.length) {
      return json(200, { ok: true, message: GENERIC_MESSAGE });
    }

    await sql`
      update email_change_requests
      set used = true
      where user_id = ${user.id}
        and used = false
    `;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const confirmLink = `${getPasswordResetBaseUrl()}/confirm-email.html?token=${encodeURIComponent(rawToken)}`;

    await sql`
      insert into email_change_requests (user_id, new_email, token_hash, expires_at, used, ip_hash)
      values (
        ${user.id},
        ${newEmail},
        ${tokenHash},
        now() + interval '30 minutes',
        false,
        ${ipHash}
      )
    `;

    await sendMail({
      to: newEmail,
      subject: "Confirm your new Ashen Bastion email",
      html: emailLayout({
        title: "Confirm your new email",
        intro: `A request was made to move the Ashen Bastion account <strong>${user.username}</strong> to this address.`,
        ctaLabel: "Confirm this email",
        ctaLink: confirmLink,
        ttlMinutes: CHANGE_TTL_MINUTES,
        footer: "If you did not request this, you can ignore this email. The account email stays unchanged until the link is opened."
      })
    });

    return json(200, { ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("change-email failed", {
      message: error?.message || String(error)
    });
    if (String(error?.message || "").toLowerCase().includes("email_change_requests")) {
      return json(503, { error: "Email change storage is not ready yet. Apply the latest database migration first." });
    }
    return json(500, { error: "Failed to start the email change." });
  }
};
