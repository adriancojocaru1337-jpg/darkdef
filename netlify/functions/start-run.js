
const { neon } = require("@netlify/neon");
const crypto = require("crypto");
const { getSessionUser } = require("./auth-utils");

const sql = neon();
const RUN_TTL_MS = 6 * 60 * 60 * 1000;
const SECRET = process.env.RUN_TOKEN_SECRET || process.env.LEADERBOARD_SECRET || "dark-defense-dev-secret";

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function sanitizeMode(mode) {
  return mode === "endless" ? "endless" : "campaign";
}

function getOrigin(event) {
  return String(event.headers?.origin || event.headers?.Origin || event.headers?.referer || event.headers?.Referer || "").trim();
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return origin.startsWith("https://darkdefense.netlify.app") || origin.startsWith("http://localhost");
}

function getClientIp(event) {
  const forwarded = event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"] || "";
  return String(forwarded).split(",")[0].trim() || "unknown";
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function signRunToken(runId, expiresAt) {
  return crypto.createHmac("sha256", SECRET).update(`${runId}.${expiresAt}`).digest("hex");
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
    const sessionUser = await getSessionUser(event).catch(() => null);
    const body = JSON.parse(String(event.body || "{}"));
    const mode = sanitizeMode(body.mode);
    const now = Date.now();
    const expiresAt = now + RUN_TTL_MS;
    const runId = crypto.randomBytes(16).toString("hex");
    const runToken = signRunToken(runId, expiresAt);
    const ipHash = sha256(getClientIp(event));
    const uaHash = sha256(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || "");

    try {
      await sql`
        insert into game_runs
        (run_id, mode, token_expires_at, token_signature, ip_hash, user_agent_hash, origin_host, status, user_id)
        values
        (${runId}, ${mode}, to_timestamp(${expiresAt} / 1000.0), ${runToken}, ${ipHash}, ${uaHash}, ${origin || null}, 'active', ${sessionUser?.user_id || null})
      `;
    } catch (_) {
      await sql`
        insert into game_runs
        (run_id, mode, token_expires_at, token_signature, ip_hash, user_agent_hash, origin_host, status)
        values
        (${runId}, ${mode}, to_timestamp(${expiresAt} / 1000.0), ${runToken}, ${ipHash}, ${uaHash}, ${origin || null}, 'active')
      `;
    }

    return json(200, {
      ok: true,
      runId,
      runToken,
      expiresAt,
      mode
    });
  } catch (error) {
    return json(500, { error: "Failed to create run token" });
  }
};
