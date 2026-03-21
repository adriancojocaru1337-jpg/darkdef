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
const crypto = require("crypto");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESET_TTL_MINUTES = 30;
const GENERIC_MESSAGE = "If an account exists for that email, a password reset link has been sent.";

function getBaseUrl(event) {
  const configured = String(process.env.APP_BASE_URL || "").trim();
  if (configured) return configured.replace(/\/$/, "");
  const origin = getOrigin(event);
  if (origin) return origin.replace(/\/$/, "");
  return "https://darkdefense.netlify.app";
}

async function sendResetEmail({ email, resetLink }) {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Dark Defense <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your Dark Defense password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;padding:24px;max-width:640px;margin:0 auto;">
          <h1 style="margin:0 0 16px;font-size:28px;color:#0f172a;">Reset your password</h1>
          <p style="margin:0 0 16px;">We received a request to reset the password for your Dark Defense account.</p>
          <p style="margin:0 0 24px;">This link stays valid for <strong>${RESET_TTL_MINUTES} minutes</strong>.</p>
          <p style="margin:0 0 24px;">
            <a href="${resetLink}" style="display:inline-block;padding:14px 20px;border-radius:12px;background:#0ea5e9;color:#ffffff;text-decoration:none;font-weight:700;">Choose a new password</a>
          </p>
          <p style="margin:0 0 12px;">If the button does not open, use this link:</p>
          <p style="margin:0 0 24px;word-break:break-all;">${resetLink}</p>
          <p style="margin:0;color:#475569;">If you did not request this, you can ignore this email.</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${response.status} ${text}`);
  }
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
    const resetLink = `${getBaseUrl(event)}/reset-password.html?token=${encodeURIComponent(rawToken)}`;

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
      hasResendKey: Boolean(RESEND_API_KEY),
      hasBaseUrl: Boolean(String(process.env.APP_BASE_URL || "").trim())
    });
    return json(500, { error: "Failed to start password reset." });
  }
};
