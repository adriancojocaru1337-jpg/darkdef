const { json, getSessionUser, sql } = require("./auth-utils");
const {
  sanitizeTalents,
  sanitizeTotalEarned,
  sanitizeSpentCrystals,
  talentsSpent,
  mergeMeta
} = require("./ley-shared");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    let body = {};
    try {
      body = JSON.parse(String(event.body || "{}"));
    } catch (_) {
      return json(400, { error: "Invalid payload." });
    }

    const incoming = {
      totalEarned: sanitizeTotalEarned(body.totalEarned),
      spentCrystals: sanitizeSpentCrystals(body.spentCrystals),
      talents: sanitizeTalents(body.talents)
    };

    // A payload whose owned talents cost more than everything ever earned is impossible.
    if (talentsSpent(incoming.talents) + incoming.spentCrystals > incoming.totalEarned) {
      return json(400, { error: "Inconsistent Ley progression payload." });
    }

    const rows = await sql`
      select total_earned, spent_crystals, talents
      from player_ley_meta
      where user_id = ${session.user_id}
      limit 1
    `;

    const current = rows.length
      ? {
          totalEarned: sanitizeTotalEarned(rows[0].total_earned),
          spentCrystals: sanitizeSpentCrystals(rows[0].spent_crystals),
          talents: sanitizeTalents(rows[0].talents)
        }
      : { totalEarned: 0, spentCrystals: 0, talents: {} };

    const merged = mergeMeta(current, incoming);
    if (talentsSpent(merged.talents) + merged.spentCrystals > merged.totalEarned) {
      return json(409, { error: "Ley progression conflicts with previously recorded spending." });
    }
    const mergedTalentCost = talentsSpent(merged.talents);

    const saved = await sql`
      insert into player_ley_meta (user_id, total_earned, spent_crystals, talents, updated_at)
      values (${session.user_id}, ${merged.totalEarned}, ${merged.spentCrystals}, ${JSON.stringify(merged.talents)}::jsonb, now())
      on conflict (user_id)
      do update set
        total_earned = greatest(player_ley_meta.total_earned, excluded.total_earned),
        spent_crystals = greatest(player_ley_meta.spent_crystals, excluded.spent_crystals),
        talents = ${JSON.stringify(merged.talents)}::jsonb,
        updated_at = now()
      where greatest(player_ley_meta.total_earned, excluded.total_earned)
        >= greatest(player_ley_meta.spent_crystals, excluded.spent_crystals) + ${mergedTalentCost}
      returning total_earned, spent_crystals, talents
    `;
    if (!saved.length) {
      return json(409, { error: "Ley progression conflicts with a concurrent Crystal purchase." });
    }
    const persisted = saved[0];

    return json(200, {
      ok: true,
      totalEarned: sanitizeTotalEarned(persisted.total_earned),
      spentCrystals: sanitizeSpentCrystals(persisted.spent_crystals),
      talents: sanitizeTalents(persisted.talents)
    });
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("player_ley_meta")) {
      return json(503, { error: "Ley meta storage is not ready yet. Run setup_ley_meta.sql first." });
    }
    return json(500, { error: "Failed to save Ley progression." });
  }
};
