
const crypto = require("crypto");
const {
  sql,
  json,
  getSessionUser,
  getClientIp,
  getOrigin,
  isAllowedOrigin,
  sha256
} = require("./auth-utils");
const { getProfileContribution } = require("./score-profile");
const { estimatedMinRuntimeMs } = require("./run-pacing");

const SECRET = process.env.RUN_TOKEN_SECRET || process.env.LEADERBOARD_SECRET || "dark-defense-dev-secret";

const MEMORY_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
/* Endless banks a checkpoint every 5 waves and Story checkpoints at the Act I
   boundary, so a single honest session legitimately makes many more calls than
   the original 20. */
const MEMORY_RATE_LIMIT_MAX_REQUESTS = 60;
const IP_ACCEPTED_LIMIT = 40;
const NAME_ACCEPTED_LIMIT = 24;
const BLOCK_MINUTES = 10;
const memoryRateLimitCache = new Map();

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

/* The old handler collapsed every database failure into "Failed to save score".
   A missing unique index on leaderboard_scores.run_id therefore looked exactly
   like a network blip for weeks, and score_submissions recorded nothing useful.
   Keep the player-facing string generic, but persist the driver's own message so
   one query on score_submissions names the real fault. */
function dbDetail(error) {
  const code = error?.code ? `${error.code} ` : "";
  const message = String(error?.message || error || "unknown error");
  return `${code}${message}`.slice(0, 180);
}

function isMissingConflictTarget(error) {
  return error?.code === "42P10"
    || /no unique or exclusion constraint/i.test(String(error?.message || ""));
}

function safeFloor(value) {
  return Math.floor(Number(value));
}

function baseScoreForKills(kills) {
  return kills * 70;
}


function computeMaxBonus(wave, kills) {
  return 500 + wave * 220 + kills * 35;
}

function computeMaxScore(mode, wave, kills, bonus) {
  if (mode === "campaign") {
    return 2500 + wave * 4000 + kills * 260 + bonus;
  }
  // endless and daily share the survival loop and its scoring shape
  return 1200 + wave * 1800 + kills * 260 + bonus;
}

const DAILY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeDailyKey(value) {
  const key = String(value || "").trim();
  if (!DAILY_KEY_RE.test(key)) return null;
  const parsed = new Date(`${key}T00:00:00Z`).getTime();
  if (!Number.isFinite(parsed)) return null;
  // Accept keys within ±48h of server time (client uses its local date).
  if (Math.abs(Date.now() - parsed) > 48 * 60 * 60 * 1000) return null;
  return key;
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
        values (${ipHash}, now() + interval '${BLOCK_MINUTES} minutes', ${error})
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
          and status = 'active'
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

    /* The client sends localStorage.sdcPlayerName, which drifts from the account
       name: it is set at login but survives a rename, a logout, a second account
       on the same browser, or guest play before signing in. The board renders
       coalesce(u.username, player_name), so the same person showed up under
       several names and could not find their own rows in score_submissions.

       When there is a session, the account name is authoritative — the client
       does not get a say. */
    playerName = sessionUser?.username
      ? sanitizeName(sessionUser.username)
      : sanitizeName(body.name);

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
      return reject({ statusCode: 400, error: "Rejected score", ipHash, playerName, runId, payload });
    }

    if (scoreTotal > 5_000_000 || bonus > 5_000_000 || waveReached > 5_000 || killsCount > 50_000 || elapsedMs > 1000 * 60 * 60 * 12) {
      return reject({ statusCode: 400, error: "Rejected score", ipHash, playerName, runId, payload });
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
        and accepted = true
        and created_at > now() - interval '15 minutes'
    `;

    if ((recentIpAttempts?.[0]?.attempts || 0) >= IP_ACCEPTED_LIMIT) {
      return reject({ statusCode: 429, error: "Too many recent score attempts", ipHash, playerName, runId, payload });
    }

    const recentNameAttempts = await sql`
      select count(*)::int as attempts
      from score_submissions
      where player_name = ${playerName}
        and accepted = true
        and created_at > now() - interval '10 minutes'
    `;

    if ((recentNameAttempts?.[0]?.attempts || 0) >= NAME_ACCEPTED_LIMIT) {
      return reject({ statusCode: 429, error: "Too many recent submissions for this name", ipHash, playerName, runId, payload });
    }

    const runRows = await sql`
      select id, run_id, mode, token_expires_at, token_signature, ip_hash, user_agent_hash, status, started_at, updated_at
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

    if (run.status !== "active") {
      return reject({ statusCode: 409, error: "Run already used", ipHash, playerName, runId, payload, runDbId });
    }

    if (!["endless", "campaign", "daily"].includes(run.mode)) {
      return reject({ statusCode: 400, error: "Unsupported run mode", ipHash, playerName, runId, payload, suspicious: true, runDbId });
    }

    let dailyKey = null;
    if (run.mode === "daily") {
      dailyKey = sanitizeDailyKey(body.dailyKey);
      if (!dailyKey) {
        return reject({ statusCode: 400, error: "Invalid daily key", ipHash, playerName, runId, payload, runDbId });
      }
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
      return reject({ statusCode: 400, error: "Impossible kill count", ipHash, playerName, runId, payload, runDbId });
    }

    const maxBonus = computeMaxBonus(waveReached, killsCount);
    const maxScore = computeMaxScore(run.mode, waveReached, killsCount, bonus);
    if (bonus > maxBonus || scoreTotal > maxScore) {
      return reject({ statusCode: 400, error: "Suspicious score rejected", ipHash, playerName, runId, payload, runDbId });
    }

    const minimumScoreFloor = Math.max(0, baseScoreForKills(killsCount) + bonus);
    if (scoreTotal < minimumScoreFloor * 0.4) {
      return reject({ statusCode: 400, error: "Inconsistent score payload", ipHash, playerName, runId, payload, runDbId });
    }

    const runStartedAtMs = new Date(run.started_at).getTime();
    const serverElapsedMs = Date.now() - runStartedAtMs;
    const minRuntimeMs = estimatedMinRuntimeMs(waveReached, killsCount);
    // Timing heuristics are *estimates*, not proof of cheating: pauses, tab
    // throttling, x2/x3 speed and early wave calls all move real elapsed time
    // around. Reject the submission, but never blocklist the IP for 30 minutes
    // over it — the run token and the score caps are the real anti-cheat, and a
    // false positive here used to lock the player out of every leaderboard.
    if (serverElapsedMs < minRuntimeMs || (elapsedMs && elapsedMs + 5000 < minRuntimeMs)) {
      return reject({ statusCode: 400, error: "Run completed too quickly", ipHash, playerName, runId, payload, runDbId });
    }

    if (clientStartedAt && Math.abs(clientStartedAt - runStartedAtMs) > 120000) {
      return reject({ statusCode: 400, error: "Run timing mismatch", ipHash, playerName, runId, payload, runDbId });
    }
    try {
      const sessionUserId = sessionUser?.user_id || null;
      const profile = getProfileContribution({
        mode: run.mode,
        waveReached,
        killsCount,
        bonus,
        runComplete: body.runComplete
      });
      /* Endless runs used to submit ONLY on death. A run that lasts an hour and
         ends with the player closing the tab left the token 'active' forever and
         the score was lost — the single most common way an endless score never
         reached the board.

         A checkpoint keeps the run open: the token stays 'active' so started_at
         remains the true run start (which makes the runtime floor stricter, not
         weaker), and the leaderboard row is upserted on run_id rather than
         duplicated. Only the final submission closes the run. */
      const isEndlessCheckpoint = body.runComplete === false && run.mode === "endless";
      // Story keeps one token for the whole campaign. Act I is a durable
      // checkpoint on the board; Act II updates the same run_id and closes it.
      // This prevents x2/x3 campaigns from making twelve separate submissions
      // and hitting the rate limit immediately before the Stage 12 result.
      const isCampaignCheckpoint = body.runComplete === false && run.mode === "campaign";
      const isCheckpoint = isEndlessCheckpoint || isCampaignCheckpoint;

      // Without a counter column, bound checkpoint spam by requiring a gap
      // between them. The token expires in 6h, so this caps a run's writes.
      if (isEndlessCheckpoint) {
        const sinceLastMs = Date.now() - new Date(run.updated_at || run.started_at).getTime();
        if (sinceLastMs < 45_000) {
          return reject({ statusCode: 429, error: "Checkpoint too soon", ipHash, playerName, runId, payload, runDbId });
        }
      }

      /* The run claim and the score row are one statement: either the run is
         consumed and the score lands, or neither happens.

         The user_profiles upsert used to ride along in the same CTE. That made
         a fragile, purely cosmetic write (lifetime kill counters) able to
         destroy the score itself — and it did, invisibly, for every mode. It is
         now a separate, non-fatal step. */
      let committed;
      try {
        committed = await sql`
        with claimed_run as (
          update game_runs
          set
            status = ${isCheckpoint ? "active" : "submitted"},
            submitted_at = ${isCheckpoint ? null : new Date().toISOString()},
            player_name = ${playerName},
            score_total = ${scoreTotal},
            bonus_score = ${bonus},
            wave_reached = ${waveReached},
            kills = ${killsCount},
            updated_at = now()
          where id = ${runDbId}
            and status = 'active'
          returning id
        ),
        inserted_score as (
          insert into leaderboard_scores
            (player_name, score_total, bonus_score, wave_reached, kills, mode, run_id, ip_hash, user_id, daily_key)
          select
            ${playerName}, ${scoreTotal}, ${bonus}, ${waveReached}, ${killsCount},
            ${run.mode}, ${runId}, ${ipHash}, ${sessionUserId}, ${dailyKey}
          from claimed_run
          on conflict (run_id) do update set
            score_total = excluded.score_total,
            bonus_score = excluded.bonus_score,
            wave_reached = excluded.wave_reached,
            kills = excluded.kills,
            player_name = excluded.player_name
          returning id
        )
        select
          exists(select 1 from claimed_run) as claimed,
          exists(select 1 from inserted_score) as score_inserted
      `;
      } catch (conflictError) {
        /* Self-healing path for a database whose leaderboard_scores.run_id has
           no unique index: `create table if not exists` never added one to a
           table that predates the column, so ON CONFLICT raises 42P10 and every
           submission was lost. Emulate the upsert until the migration is run. */
        if (!isMissingConflictTarget(conflictError)) throw conflictError;
        console.warn("leaderboard_scores.run_id has no unique index — run setup_v0_11_35_upsert_constraint_fix.sql");
        const claimed = await sql`
          update game_runs
          set
            status = ${isCheckpoint ? "active" : "submitted"},
            submitted_at = ${isCheckpoint ? null : new Date().toISOString()},
            player_name = ${playerName},
            score_total = ${scoreTotal},
            bonus_score = ${bonus},
            wave_reached = ${waveReached},
            kills = ${killsCount},
            updated_at = now()
          where id = ${runDbId}
            and status = 'active'
          returning id
        `;
        await sql`delete from leaderboard_scores where run_id = ${runId}`;
        const inserted = claimed.length ? await sql`
          insert into leaderboard_scores
            (player_name, score_total, bonus_score, wave_reached, kills, mode, run_id, ip_hash, user_id, daily_key)
          values
            (${playerName}, ${scoreTotal}, ${bonus}, ${waveReached}, ${killsCount},
             ${run.mode}, ${runId}, ${ipHash}, ${sessionUserId}, ${dailyKey})
          returning id
        ` : [];
        committed = [{ claimed: claimed.length > 0, score_inserted: inserted.length > 0 }];
      }

      if (!committed[0]?.claimed || !committed[0]?.score_inserted) {
        return reject({
          statusCode: 409,
          error: "Run already submitted",
          ipHash,
          playerName,
          runId,
          payload,
          runDbId
        });
      }

      /* Lifetime profile counters. Deliberately after the commit and swallowed:
         the score is already on the board and must stay there even if this
         fails. */
      if (sessionUserId) {
        try {
          await sql`
            insert into user_profiles
              (user_id, best_endless_score, best_story_stage, total_kills, total_runs, updated_at)
            values
              (${sessionUserId}::bigint, ${profile.bestEndlessScore}, ${profile.bestStoryStage},
               ${profile.lifetimeKills}, ${profile.lifetimeRuns}, now())
            on conflict (user_id)
            do update set
              best_endless_score = greatest(user_profiles.best_endless_score, excluded.best_endless_score),
              best_story_stage = greatest(user_profiles.best_story_stage, excluded.best_story_stage),
              total_kills = user_profiles.total_kills + excluded.total_kills,
              total_runs = user_profiles.total_runs + excluded.total_runs,
              updated_at = now()
          `;
        } catch (profileError) {
          console.error("user_profiles update failed (score kept)", dbDetail(profileError));
        }
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
        return reject({ statusCode: 409, error: 'Run already submitted', ipHash, playerName, runId, payload, runDbId });
      }
      /* Release the run so the player can retry instead of meeting
         "Run already used" on the next attempt. */
      try {
        await sql`
          update game_runs
          set status = 'active', submitted_at = null, updated_at = now()
          where id = ${runDbId} and status = 'submitted'
        `;
      } catch (_) {}
      console.error("submit-score commit failed", dbDetail(txError));
      return reject({
        statusCode: 500,
        error: `Failed to save score: ${dbDetail(txError)}`,
        ipHash,
        playerName,
        runId,
        payload,
        runDbId
      });
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
