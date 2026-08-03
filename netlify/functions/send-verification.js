const {
  json,
  getOrigin,
  isAllowedOrigin,
  getSessionUser,
  memoryRateLimited,
  getClientIp
} = require("./auth-utils");
const { issueVerification } = require("./verification-utils");

const GENERIC_MESSAGE = "If this address still needs confirming, a new link is on its way.";

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  if (memoryRateLimited("send-verification:" + getClientIp(event), 4, 30 * 60 * 1000)) {
    return json(429, { error: "Too many requests. Try again in a few minutes." });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    if (session.email_verified) {
      return json(200, { ok: true, alreadyVerified: true, message: "This email is already confirmed." });
    }

    await issueVerification({
      userId: session.user_id,
      email: session.email,
      username: session.username,
      event
    });

    return json(200, { ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("send-verification failed", {
      message: error?.message || String(error)
    });
    if (String(error?.message || "").toLowerCase().includes("email_verifications")) {
      return json(503, { error: "Verification storage is not ready yet. Apply the latest database migration first." });
    }
    return json(500, { error: "Failed to send the confirmation email." });
  }
};
