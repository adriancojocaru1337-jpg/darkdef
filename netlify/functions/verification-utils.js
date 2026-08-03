const crypto = require("crypto");
const { sql, sha256, hashIp, getClientIp } = require("./auth-utils");
const { getPasswordResetBaseUrl } = require("./request-security");
const { sendMail, emailLayout } = require("./mailer");

const VERIFY_TTL_MINUTES = 60 * 24; // 24 hours

// Set REQUIRE_EMAIL_VERIFICATION=true in Netlify to block sign-in until the
// address is confirmed. Left false, verification is informational only:
// players keep the current one-step registration and simply see a reminder.
function verificationRequired() {
  return String(process.env.REQUIRE_EMAIL_VERIFICATION || "").trim().toLowerCase() === "true";
}

async function issueVerification({ userId, email, username, event }) {
  const ipHash = hashIp(getClientIp(event));

  await sql`
    update email_verifications
    set used = true
    where user_id = ${userId}
      and used = false
  `;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);
  const verifyLink = `${getPasswordResetBaseUrl()}/verify-email.html?token=${encodeURIComponent(rawToken)}`;

  await sql`
    insert into email_verifications (user_id, email, token_hash, expires_at, used, ip_hash)
    values (
      ${userId},
      ${email},
      ${tokenHash},
      now() + interval '24 hours',
      false,
      ${ipHash}
    )
  `;

  await sendMail({
    to: email,
    subject: "Confirm your Ashen Bastion email",
    html: emailLayout({
      title: "Confirm your email",
      intro: `Welcome to Ashen Bastion, <strong>${username}</strong>. Confirm this address so you can always recover your account.`,
      ctaLabel: "Confirm my email",
      ctaLink: verifyLink,
      ttlMinutes: VERIFY_TTL_MINUTES,
      footer: "If you did not create this account, you can ignore this email."
    })
  });

  return { verifyLink };
}

module.exports = {
  VERIFY_TTL_MINUTES,
  verificationRequired,
  issueVerification
};
