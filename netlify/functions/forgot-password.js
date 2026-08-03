const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  normalizeEmail,
  validateEmail,
  hashIp,
  getClientIp,
  sha256
} = require("./auth-utils");
const { getPasswordResetBaseUrl } = require("./request-security");
const { sendMail, emailLayout, hasApiKey } = require("./mailer");
const crypto = require("crypto");

const RESET_TTL_MINUTES = 30;
const GENERIC_MESSAGE = "If an account exists for that email, a password reset link has been sent.";

async function sendResetEmail({ email, resetLink }) {
  await sendMail({
    to: email,
    subject: "Reset your Ashen Bastion password",
    html: emailLayout({
      title: "Reset your password",
      intro: "We received a request to reset the password for your Ashen Bastion account.",
      ctaLabel: "Choose a new password",
      ctaLink: resetLink,
      ttlMinutes: RESET_TTL_MINUTES,
      footer: "If you did not request this, you can ignore this email."
    })
  });
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  try {
    let body = {};
    try {
      body = JSON.parse(String(event.body || "{}"));
    } catch {
      body = {};
    }

    const email = normalizeEmail(body.email);

    if (!validateEmail(email)) {
      return json(200, { ok: true, message: GENERIC_MESSAGE });
    }

    const ipHash = hashIp(getClientIp(event));
    const recentByIp = await sql`
      select count(*)::int as count
      from password_resets
      where ip_hash = ${ipHash}
        and created_at > now() - interval '30 minutes'
    `;
    if ((recentByIp[0]?.count || 0) >= 5) {
      return json(200, { ok: true, message: GENERIC_MESSAGE });
    }

    const users = await sql`
      select id, email
      from users
      where email = ${email}
      limit 1
    `;
    const user = users[0];

    // Nu dezvăluim dacă emailul există sau nu.
    if (!user) {
      return json(200, { ok: true, message: GENERIC_MESSAGE });
    }

    await sql`
      update password_resets
      set used = true
      where user_id = ${user.id}
        and used = false
    `;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const resetLink = `${getPasswordResetBaseUrl()}/reset-password.html?token=${encodeURIComponent(rawToken)}`;

    await sql`
      insert into password_resets (user_id, token_hash, expires_at, used, ip_hash)
      values (
        ${user.id},
        ${tokenHash},
        now() + interval '30 minutes',
        false,
        ${ipHash}
      )
    `;

    await sendResetEmail({ email: user.email, resetLink });

    return json(200, { ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("forgot-password failed", {
      message: error?.message || String(error),
      stack: error?.stack || null,
      hasResendKey: hasApiKey,
      hasBaseUrl: Boolean(String(process.env.APP_BASE_URL || "").trim())
    });
    return json(500, { error: "Failed to start password reset." });
  }
};
