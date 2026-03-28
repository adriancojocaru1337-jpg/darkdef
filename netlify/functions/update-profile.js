const { json, getSessionUser, sql } = require("./auth-utils");

const ALLOWED_CREST_IDS = new Set([
  "ember-shield",
  "moon-sigil",
  "forest-warden",
  "storm-mark",
  "royal-flare",
  "void-bloom",
  "iron-oath",
  "sunforged"
]);

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const crestId = String(body.crestId || "").trim();
    if (!ALLOWED_CREST_IDS.has(crestId)) {
      return json(400, { error: "Invalid crest selection." });
    }

    await sql`
      insert into user_profiles (user_id, crest_id, updated_at)
      values (${session.user_id}, ${crestId}, now())
      on conflict (user_id)
      do update set crest_id = ${crestId}, updated_at = now()
    `;

    return json(200, { ok: true, crestId });
  } catch (error) {
    return json(500, { error: "Failed to update profile." });
  }
};
