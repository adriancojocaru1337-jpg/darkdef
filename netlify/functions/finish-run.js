const { neon } = require("@netlify/neon");
const crypto = require("crypto");
const { json, getSessionUser, sanitizeUsername, syncUserProfileStats } = require("./auth-utils");

const sql = neon();
const SECRET = process.env.RUN_TOKEN_SECRET || process.env.LEADERBOARD_SECRET || "dark-defense-dev-secret";

function signRunToken(runId, expiresAt) {
  return crypto.createHmac("sha256", SECRET).update(`${runId}.${expiresAt}`).digest("hex");
}

function safeFloor(value) {
  return Math.floor(Number(value));
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const sessionUser = await getSessionUser(event).catch(() => null);
    const body = JSON.parse(String(event.body || "{}"));

    const runId = String(body.runId || "").trim();
    const runToken = String(body.runToken || "").trim();
    const mode = body.mode === "endless" ? "endless" : "campaign";
    const playerName = sanitizeUsername(body.name || sessionUser?.username || "");
    const scoreTotal = safeFloor(body.score);
    const bonus = safeFloor(body.bonusScore);
    const waveReached = safeFloor(body.wave);
    const killsCount = safeFloor(body.kills || 0);

    if (!runId || !runToken) {
      return json(400, { error: "Missing run token." });
    }

    if (![scoreTotal, bonus, waveReached, killsCount].every(Number.isFinite)) {
      return json(400, { error: "Invalid run payload." });
    }

    if (scoreTotal < 0 || bonus < 0 || waveReached < 1 || killsCount < 0) {
      return json(400, { error: "Invalid run values." });
    }

    let runRows;
    try {
      runRows = await sql`
        select id, run_id, mode, token_expires_at, token_signature, status, user_id
        from game_runs
        where run_id = ${runId}
        limit 1
      `;
    } catch (_) {
      runRows = await sql`
        select id, run_id, mode, token_expires_at, token_signature, status, null::bigint as user_id
        from game_runs
        where run_id = ${runId}
        limit 1
      `;
    }

    const run = runRows[0];
    if (!run) {
      return json(404, { error: "Run not found." });
    }

    const expiresAtMs = new Date(run.token_expires_at).getTime();
    const expectedToken = signRunToken(run.run_id, expiresAtMs);
    if (run.token_signature !== expectedToken || runToken !== expectedToken) {
      return json(403, { error: "Invalid run token." });
    }

    if (Date.now() > expiresAtMs) {
      return json(410, { error: "Run token expired." });
    }

    if (run.mode !== mode) {
      return json(400, { error: "Run mode mismatch." });
    }

    if (run.status === "rejected") {
      return json(409, { error: "Run rejected." });
    }

    const userId = sessionUser?.user_id || run.user_id || null;
    try {
      await sql`
        update game_runs
        set
          status = case when status = 'submitted' then 'submitted' else 'completed' end,
          player_name = ${playerName || null},
          score_total = ${scoreTotal},
          bonus_score = ${bonus},
          wave_reached = ${waveReached},
          kills = ${killsCount},
          user_id = coalesce(user_id, ${userId}),
          submitted_at = coalesce(submitted_at, now()),
          updated_at = now()
        where id = ${run.id}
      `;
    } catch (_) {
      await sql`
        update game_runs
        set
          status = case when status = 'submitted' then 'submitted' else 'completed' end,
          player_name = ${playerName || null},
          score_total = ${scoreTotal},
          bonus_score = ${bonus},
          wave_reached = ${waveReached},
          kills = ${killsCount},
          submitted_at = coalesce(submitted_at, now()),
          updated_at = now()
        where id = ${run.id}
      `;
    }

    if (userId) {
      await syncUserProfileStats(userId).catch(() => null);
    }

    return json(200, {
      ok: true,
      status: run.status === "submitted" ? "submitted" : "completed"
    });
  } catch (_) {
    return json(500, { error: "Failed to finish run." });
  }
};
