
const { neon } = require("@netlify/neon");
const crypto = require("crypto");
const { getSessionUser, syncUserProfileStats } = require("./auth-utils");

const sql = neon();
const SECRET = process.env.RUN_TOKEN_SECRET || process.env.LEADERBOARD_SECRET || "dark-defense-dev-secret";

const MEMORY_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MEMORY_RATE_LIMIT_MAX_REQUESTS = 20;
const memoryRateLimitCache = new Map();

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

function getClientIp(event) {
  const forwarded = event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"] || "";
  return String(forwarded).split(",")[0].trim() || "unknown";
}

function getOrigin(event) {
  return String(event.headers?.origin || event.headers?.Origin || event.headers?.referer || event.headers?.Referer || "").trim();
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return origin.startsWith("https://darkdefense.netlify.app") || origin.startsWith("http://localhost");
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function sanitizeName(name) {
  return String(name || "")
    .replace(/[^a-zA-Z0-9 _\-.]/g, "")
    .trim()
    .slice(0, 20);
}

function memoryRateLimited(ip) {
  const now = Date.now();
  const recent = (memoryRateLimitCache.get(ip) || []).filter((ts) => now - ts < MEMORY_RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  memoryRateLimitCache.set(ip, recent);
  return recent.length > MEMORY_RATE_LIMIT_MAX_REQUESTS;
}

function signRunToken(runId, expiresAt) {
  return crypto.createHmac("sha256", SECRET).update(`${runId}.${expiresAt}`).digest("hex");
}

function safeFloor(value) {
  return Math.floor(Number(value));
}

function baseScoreForKills(kills) {
  return kills * 70;
}

function estimatedMinRuntimeMs(wave, kills) {
  return Math.max(25_000, wave * 12_000 + kills * 250);
}

function computeMaxBonus(wave, kills) {
  return 500 + wave * 220 + kills * 35;
}

function computeMaxScore(mode, wave, kills, bonus) {
  if (mode === "campaign") {
    return 2500 + wave * 4000 + kills * 260 + bonus;
  }
  return 1200 + wave * 1800 + kills * 260 + bonus;
}

async function logSubmissionAttempt({
  ipHash,
  playerName,
  runId,
  accepted,
  rejectionReason,
  payload
}) {
  try {
    await sql`
      insert into score_submissions
      (run_id, ip_hash, player_name, accepted, rejection_reason, score_total, bonus_score, wave_reached, kills)
      values
      (${runId || null}, ${ipHash}, ${playerName || null}, ${accepted}, ${rejectionReason || null}, ${payload.scoreTotal ?? null}, ${payload.bonus ?? null}, ${payload.waveReached ?? null}, ${payload.killsCount ?? null})
    `;
  } catch (_) {}
}

async function reject({ statusCode, error, ipHash, playerName, runId, payload, suspicious = false, runDbId = null }) {
  if (suspicious && ipHash) {
    try {
      await sql`
        insert into blocked_ips (ip_hash, blocked_until, reason)
        values (${ipHash}, now() + interval '30 minutes', ${error})
        on conflict (ip_hash)
        do update set blocked_until = greatest(blocked_ips.blocked_until, excluded.blocked_until), reason = excluded.reason, updated_at = now()
      `;
    } catch (_) {}
  }

  if (runDbId) {
    try {
      await sql`
        update game_runs
        set status = 'rejected', rejection_reason = ${error}, submitted_at = now(), updated_at = now()
        where id = ${runDbId}
      `;
    } catch (_) {}
  }

  await logSubmissionAttempt({
    ipHash,
    playerName,
    runId,
    accepted: false,
    rejectionReason: error,
    payload
  });

  return json(statusCode, { error });
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const ip = getClientIp(event);
  const ipHash = sha256(ip);
  const origin = getOrigin(event);
  const userAgent = String(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || "");
  const uaHash = sha256(userAgent);

  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  if (memoryRateLimited(ip)) {
    return json(429, { error: "Too many submissions" });
  }

  let playerName = "";
  let runId = null;
  let payload = {};
  let sessionUser = null;

  try {
    sessionUser = await getSessionUser(event).catch(() => null);
    const rawBody = String(event.body || "");
    if (!rawBody || rawBody.length > 1600) {
      return json(400, { error: "Invalid payload size" });
    }

    const body = JSON.parse(rawBody);
    const scoreTotal = safeFloor(body.score);
    const bonus = safeFloor(body.bonusScore);
    const waveReached = safeFloor(body.wave);
    const killsCount = safeFloor(body.kills || 0);
    const elapsedMs = safeFloor(body.elapsedMs || 0);
    const clientStartedAt = safeFloor(body.clientStartedAt || 0);

    runId = String(body.runId || "").trim();
    const runToken = String(body.runToken || "").trim();
    playerName = sanitizeName(body.name);
    payload = { scoreTotal, bonus, waveReached, killsCount };

    if (!playerName || playerName.length < 2) {
      return reject({ statusCode: 400, error: "Invalid player name", ipHash, playerName, runId, payload });
    }

    if (!runId || !runToken) {
      return reject({ statusCode: 400, error: "Missing run token", ipHash, playerName, runId, payload, suspicious: true });
    }

    if (![scoreTotal, bonus, waveReached, killsCount, elapsedMs].every(Number.isFinite)) {
      return reject({ statusCode: 400, error: "Invalid payload", ipHash, playerName, runId, payload });
    }

    if (scoreTotal < 0 || bonus < 0 || waveReached < 1 || killsCount < 0 || elapsedMs < 0) {
      return reject({ statusCode: 400, error: "Rejected score", ipHash, playerName, runId, payload, suspicious: true });
    }

    if (scoreTotal > 5_000_000 || bonus > 5_000_000 || waveReached > 5_000 || killsCount > 50_000 || elapsedMs > 1000 * 60 * 60 * 12) {
      return reject({ statusCode: 400, error: "Rejected score", ipHash, playerName, runId, payload, suspicious: true });
    }

    const blocked = await sql`
      select id
      from blocked_ips
      where ip_hash = ${ipHash}
        and blocked_until > now()
      limit 1
    `;

    if (blocked.length) {
      return reject({ statusCode: 429, error: "IP temporarily blocked", ipHash, playerName, runId, payload });
    }

    const recentIpAttempts = await sql`
      select count(*)::int as attempts
      from score_submissions
      where ip_hash = ${ipHash}
        and created_at > now() - interval '15 minutes'
    `;

    if ((recentIpAttempts?.[0]?.attempts || 0) >= 20) {
      return reject({ statusCode: 429, error: "Too many recent score attempts", ipHash, playerName, runId, payload });
    }

    const recentNameAttempts = await sql`
      select count(*)::int as attempts
      from score_submissions
      where player_name = ${playerName}
        and created_at > now() - interval '10 minutes'
    `;

    if ((recentNameAttempts?.[0]?.attempts || 0) >= 8) {
      return reject({ statusCode: 429, error: "Too many recent submissions for this name", ipHash, playerName, runId, payload });
    }

    const runRows = await sql`
      select id, run_id, mode, token_expires_at, token_signature, ip_hash, user_agent_hash, status, started_at
      from game_runs
      where run_id = ${runId}
      limit 1
    `;

    const run = runRows[0];
    if (!run) {
      return reject({ statusCode: 400, error: "Unknown run", ipHash, playerName, runId, payload, suspicious: true });
    }

    const runDbId = run.id;
    const expiresAtMs = new Date(run.token_expires_at).getTime();
    const expectedToken = signRunToken(run.run_id, expiresAtMs);

    if (!["active", "completed"].includes(run.status)) {
      return reject({ statusCode: 409, error: "Run already used", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    if (!["endless", "campaign"].includes(run.mode)) {
      return reject({ statusCode: 400, error: "Unsupported run mode", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    const fingerprintMismatch = run.ip_hash !== ipHash || run.user_agent_hash !== uaHash;
    if (fingerprintMismatch) {
      console.warn("Run fingerprint mismatch", { runId, playerName, origin, ipChanged: run.ip_hash !== ipHash, userAgentChanged: run.user_agent_hash !== uaHash });
    }

    if (run.token_signature !== expectedToken || runToken !== expectedToken) {
      return reject({ statusCode: 403, error: "Invalid run token", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    if (Date.now() > expiresAtMs) {
      return reject({ statusCode: 410, error: "Run token expired", ipHash, playerName, runId, payload, runDbId });
    }

    if (killsCount < waveReached - 1) {
      return reject({ statusCode: 400, error: "Impossible kill count", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    const maxBonus = computeMaxBonus(waveReached, killsCount);
    const maxScore = computeMaxScore(run.mode, waveReached, killsCount, bonus);
    if (bonus > maxBonus || scoreTotal > maxScore) {
      return reject({ statusCode: 400, error: "Suspicious score rejected", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    const minimumScoreFloor = Math.max(0, baseScoreForKills(killsCount) + bonus);
    if (scoreTotal < minimumScoreFloor * 0.4) {
      return reject({ statusCode: 400, error: "Inconsistent score payload", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    const runStartedAtMs = new Date(run.started_at).getTime();
    const serverElapsedMs = Date.now() - runStartedAtMs;
    const minRuntimeMs = estimatedMinRuntimeMs(waveReached, killsCount);
    if (serverElapsedMs < minRuntimeMs || (elapsedMs && elapsedMs + 5000 < minRuntimeMs)) {
      return reject({ statusCode: 400, error: "Run completed too quickly", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    if (clientStartedAt && Math.abs(clientStartedAt - runStartedAtMs) > 120000) {
      return reject({ statusCode: 400, error: "Run timing mismatch", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }
    try {
      await sql`
        update game_runs
        set status = 'submitted', submitted_at = now(), player_name = ${playerName}, score_total = ${scoreTotal}, bonus_score = ${bonus}, wave_reached = ${waveReached}, kills = ${killsCount}, updated_at = now()
        where id = ${runDbId}
          and status in ('active', 'completed')
      `;

      await sql`
        insert into leaderboard_scores
        (player_name, score_total, bonus_score, wave_reached, kills, mode, run_id, ip_hash, user_id)
        values
        (${playerName}, ${scoreTotal}, ${bonus}, ${waveReached}, ${killsCount}, ${run.mode}, ${runId}, ${ipHash}, ${sessionUser?.user_id || null})
      `;

      if (sessionUser?.user_id) {
        await syncUserProfileStats(sessionUser.user_id).catch(() => null);
      }

      await logSubmissionAttempt({
        ipHash,
        playerName,
        runId,
        accepted: true,
        rejectionReason: null,
        payload
      });
    } catch (txError) {
      if (String(txError?.message || '').toLowerCase().includes('duplicate')) {
        return reject({ statusCode: 409, error: 'Run already submitted', ipHash, playerName, runId, payload, suspicious: true, runDbId });
      }
      throw txError;
    }

    return json(200, { ok: true });
  } catch (error) {
    await logSubmissionAttempt({
      ipHash,
      playerName,
      runId,
      accepted: false,
      rejectionReason: "Failed to save score",
      payload
    });
    return json(500, { error: "Failed to save score" });
  }
};
