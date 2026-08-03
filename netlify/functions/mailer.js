const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Sender address. Override with the MAIL_FROM env var once your domain is
// verified in Resend, e.g. MAIL_FROM="Ashen Bastion <no-reply@ashenbastion.com>".
// The resend.dev fallback only delivers to the Resend account owner, so real
// players never receive anything until MAIL_FROM is set.
const MAIL_FROM = String(process.env.MAIL_FROM || "").trim() || "Ashen Bastion <onboarding@resend.dev>";

function isSandboxSender() {
  return MAIL_FROM.includes("resend.dev");
}

function emailLayout({ title, intro, ctaLabel, ctaLink, ttlMinutes, footer }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;padding:24px;max-width:640px;margin:0 auto;">
      <h1 style="margin:0 0 16px;font-size:28px;color:#0f172a;">${title}</h1>
      <p style="margin:0 0 16px;">${intro}</p>
      ${ttlMinutes ? `<p style="margin:0 0 24px;">This link stays valid for <strong>${ttlMinutes} minutes</strong>.</p>` : ""}
      <p style="margin:0 0 24px;">
        <a href="${ctaLink}" style="display:inline-block;padding:14px 20px;border-radius:12px;background:#0ea5e9;color:#ffffff;text-decoration:none;font-weight:700;">${ctaLabel}</a>
      </p>
      <p style="margin:0 0 12px;">If the button does not open, use this link:</p>
      <p style="margin:0 0 24px;word-break:break-all;">${ctaLink}</p>
      <p style="margin:0;color:#475569;">${footer}</p>
    </div>
  `;
}

async function sendMail({ to, subject, html }) {
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
      from: MAIL_FROM,
      to: [to],
      subject,
      html
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${response.status} ${text}`);
  }
}

module.exports = {
  MAIL_FROM,
  isSandboxSender,
  emailLayout,
  sendMail,
  hasApiKey: Boolean(RESEND_API_KEY)
};
