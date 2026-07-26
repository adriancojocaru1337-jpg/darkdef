
const crypto = require("crypto");
const {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  getClientIp,
  hashIp,
  sha256
} = require("./auth-utils");

const RUN_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 512;
const SECRET = process.env.RUN_TOKEN_SECRET || process.env.LEADERBOARD_SECRET || "dark-defense-dev-secret";

function sanitizeMode(mode) {
  return ["endless", "daily"].includes(mode) ? mode : "campaign";
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
    const rawBody = String(event.body || "{}");
    if (rawBody.length > MAX_BODY_BYTES) {
      return json(400, { error: "Invalid payload size" });
    }
    const body = JSON.parse(rawBody);
    const mode = sanitizeMode(body.mode);
    const now = Date.now();
    const expiresAt = now + RUN_TTL_MS;
    const runId = crypto.randomBytes(16).toString("hex");
    const runToken = signRunToken(runId, expiresAt);
    const ipHash = hashIp(getClientIp(event));
    const uaHash = sha256(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || "");

    const created = await sql`
      with rate_slot as (
        insert into run_start_limits (ip_hash, window_started_at, request_count, updated_at)
        values (${ipHash}, now(), 1, now())
        on conflict (ip_hash)
        do update set
          window_started_at = case
            when run_start_limits.window_started_at <= now() - interval '10 minutes' then now()
            else run_start_limits.window_started_at
          end,
          request_count = case
            when run_start_limits.window_started_at <= now() - interval '10 minutes' then 1
            else run_start_limits.request_count + 1
          end,
          updated_at = now()
        where run_start_limits.window_started_at <= now() - interval '10 minutes'
           or run_start_limits.request_count < 30
        returning ip_hash
      ),
      created_run as (
        insert into game_runs
          (run_id, mode, token_expires_at, token_signature, ip_hash, user_agent_hash, origin_host, status)
        select
          ${runId}, ${mode}, to_timestamp(${expiresAt} / 1000.0), ${runToken},
          ${ipHash}, ${uaHash}, ${origin || null}, 'active'
        from rate_slot
        returning run_id
      )
      select run_id from created_run
    `;
    if (!created.length) {
      return json(429, { error: "Too many runs started from this connection. Try again shortly." });
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
