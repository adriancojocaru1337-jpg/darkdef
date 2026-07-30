"use strict";

const { json, getSessionUser, sql } = require("./auth-utils");
const { sanitizeGameState, sanitizeRevision } = require("./game-state-shared");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const rows = await sql`
      select state, revision, updated_at
      from player_game_state
      where user_id = ${session.user_id}
      limit 1
    `;
    if (!rows.length) {
      return json(200, { ok: true, state: null, revision: 0, updatedAt: null });
    }

    return json(200, {
      ok: true,
      state: sanitizeGameState(rows[0].state),
      revision: sanitizeRevision(rows[0].revision),
      updatedAt: rows[0].updated_at || null
    });
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("player_game_state")) {
      return json(503, {
        error: "Cloud Save storage is not ready yet. Run setup_game_state.sql first."
      });
    }
    return json(500, { error: "Failed to load Cloud Save." });
  }
};
