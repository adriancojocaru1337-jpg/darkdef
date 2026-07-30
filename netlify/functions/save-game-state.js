"use strict";

const {
  json,
  getSessionUser,
  sql,
  memoryRateLimited,
  getClientIp
} = require("./auth-utils");
const {
  MAX_STATE_BYTES,
  sanitizeGameState,
  sanitizeRevision
} = require("./game-state-shared");

function conflictPayload(row) {
  return {
    error: "Cloud Save changed on another device.",
    code: "revision_conflict",
    state: row ? sanitizeGameState(row.state) : null,
    revision: row ? sanitizeRevision(row.revision) : 0,
    updatedAt: row?.updated_at || null
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }
    const rateKey = `game-state:${session.user_id}:${getClientIp(event)}`;
    if (memoryRateLimited(rateKey, 90, 60_000)) {
      return json(429, { error: "Too many Cloud Save requests. Please wait a moment." });
    }

    const rawBody = String(event.body || "{}");
    if (Buffer.byteLength(rawBody, "utf8") > MAX_STATE_BYTES + 16 * 1024) {
      return json(413, { error: "Cloud Save payload is too large.", code: "state_too_large" });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (_) {
      return json(400, { error: "Invalid payload." });
    }

    let state;
    try {
      state = sanitizeGameState(body.state);
    } catch (error) {
      return json(error?.code === "state_too_large" ? 413 : 400, {
        error: error?.message || "Invalid Cloud Save payload.",
        code: error?.code || "invalid_state"
      });
    }
    const expectedRevision = sanitizeRevision(body.expectedRevision);
    const encodedState = JSON.stringify(state);

    let saved;
    if (expectedRevision === 0) {
      saved = await sql`
        insert into player_game_state (user_id, state, revision, created_at, updated_at)
        values (${session.user_id}, ${encodedState}::jsonb, 1, now(), now())
        on conflict (user_id) do nothing
        returning state, revision, updated_at
      `;
    } else {
      saved = await sql`
        update player_game_state
        set state = ${encodedState}::jsonb,
            revision = revision + 1,
            updated_at = now()
        where user_id = ${session.user_id}
          and revision = ${expectedRevision}
        returning state, revision, updated_at
      `;
    }

    if (!saved.length) {
      const currentRows = await sql`
        select state, revision, updated_at
        from player_game_state
        where user_id = ${session.user_id}
        limit 1
      `;
      return json(409, conflictPayload(currentRows[0] || null));
    }

    return json(200, {
      ok: true,
      state: sanitizeGameState(saved[0].state),
      revision: sanitizeRevision(saved[0].revision),
      updatedAt: saved[0].updated_at || null
    });
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("player_game_state")) {
      return json(503, {
        error: "Cloud Save storage is not ready yet. Run setup_game_state.sql first."
      });
    }
    return json(500, { error: "Failed to save Cloud Save." });
  }
};
