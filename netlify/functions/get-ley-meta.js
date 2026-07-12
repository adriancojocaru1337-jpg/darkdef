const { json, getSessionUser, sql } = require("./auth-utils");
const { sanitizeTalents, sanitizeTotalEarned } = require("./ley-shared");

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
      select total_earned, talents
      from player_ley_meta
      where user_id = ${session.user_id}
      limit 1
    `;

    if (!rows.length) {
      return json(200, { ok: true, totalEarned: 0, talents: {} });
    }

    return json(200, {
      ok: true,
      totalEarned: sanitizeTotalEarned(rows[0].total_earned),
      talents: sanitizeTalents(rows[0].talents)
    });
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("player_ley_meta")) {
      return json(503, { error: "Ley meta storage is not ready yet. Run setup_ley_meta.sql first." });
    }
    return json(500, { error: "Failed to load Ley progression." });
  }
};
