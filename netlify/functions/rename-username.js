const {
  json,
  getSessionUser,
  sanitizeUsername,
  getOrigin,
  isAllowedOrigin,
  getClientIp,
  hashIp,
  memoryRateLimited,
  sql
} = require("./auth-utils");
const {
  sanitizeTalents,
  sanitizeTotalEarned,
  sanitizeSpentCrystals,
  availableCrystals
} = require("./ley-shared");

const RENAME_CRYSTAL_COST = 150;
const MAX_BODY_BYTES = 512;

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const origin = getOrigin(event);
  if (!isAllowedOrigin(origin)) {
    return json(403, { error: "Origin not allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const ipHash = hashIp(getClientIp(event));
    if (memoryRateLimited(`rename:${session.user_id}`, 3, 60_000)
      || memoryRateLimited(`rename-ip:${ipHash}`, 10, 60_000)) {
      return json(429, { error: "Too many rename attempts. Try again shortly." });
    }

    const rawBody = String(event.body || "{}");
    if (rawBody.length > MAX_BODY_BYTES) {
      return json(400, { error: "Invalid payload size." });
    }
    const body = JSON.parse(rawBody);
    const username = sanitizeUsername(body.username);
    if (username.length < 3) {
      return json(400, { error: "Username must have at least 3 characters." });
    }

    const current = await sql`
      select
        u.username,
        m.total_earned,
        m.spent_crystals,
        m.talents,
        (
          select count(*)::int
          from username_renames r
          where r.user_id = u.id
            and r.created_at > now() - interval '1 hour'
        ) as recent_renames
      from users u
      left join player_ley_meta m on m.user_id = u.id
      where u.id = ${session.user_id}
      limit 1
    `;
    const currentName = current.length ? String(current[0].username) : "";
    if (!currentName) {
      return json(404, { error: "Account not found." });
    }
    if (currentName && currentName.toLowerCase() === username.toLowerCase()) {
      return json(400, { error: "That is already your username." });
    }
    if ((current[0].recent_renames || 0) >= 5) {
      return json(429, { error: "Rename limit reached. Try again in an hour." });
    }

    const taken = await sql`
      select id from users
      where lower(username) = lower(${username}) and id <> ${session.user_id}
      limit 1
    `;
    if (taken.length) {
      return json(409, { error: "This username is already taken." });
    }

    const currentMeta = {
      totalEarned: sanitizeTotalEarned(current[0].total_earned),
      spentCrystals: sanitizeSpentCrystals(current[0].spent_crystals),
      talents: sanitizeTalents(current[0].talents)
    };
    if (availableCrystals(currentMeta) < RENAME_CRYSTAL_COST) {
      return json(402, { error: `Not enough Crystals. Rename needs ${RENAME_CRYSTAL_COST}.` });
    }

    const updated = await sql`
      with charged as (
        update player_ley_meta
        set
          spent_crystals = spent_crystals + ${RENAME_CRYSTAL_COST},
          updated_at = now()
        where user_id = ${session.user_id}
          and total_earned = ${currentMeta.totalEarned}
          and spent_crystals = ${currentMeta.spentCrystals}
          and talents = ${JSON.stringify(currentMeta.talents)}::jsonb
        returning user_id, total_earned, spent_crystals, talents
      ),
      renamed as (
        update users u
        set username = ${username}
        from charged c
        where u.id = c.user_id
        returning u.id, u.username
      ),
      recorded as (
        insert into username_renames
          (user_id, previous_username, new_username, crystal_cost)
        select id, ${currentName}, username, ${RENAME_CRYSTAL_COST}
        from renamed
        returning id
      )
      select
        r.id,
        r.username,
        c.total_earned,
        c.spent_crystals,
        c.talents,
        exists(select 1 from recorded) as recorded
      from renamed r
      join charged c on c.user_id = r.id
    `;
    if (!updated.length) {
      return json(409, { error: "Ley progression changed while renaming. Please try again." });
    }

    // Refresh the frozen name copies so any query that still reads player_name
    // directly (and the power board's own row) stays consistent immediately.
    // Best-effort: the leaderboards already resolve the current name by user_id,
    // so a failure here never blocks the rename.
    try {
      await sql`
        update leaderboard_scores set player_name = ${username}
        where user_id = ${session.user_id}
      `;
    } catch (err) {
      console.error("rename-username: leaderboard_scores backfill failed", err);
    }
    try {
      await sql`
        update power_leaderboard set player_name = ${username}
        where user_id = ${session.user_id}
      `;
    } catch (err) {
      console.error("rename-username: power_leaderboard backfill failed", err);
    }

    return json(200, {
      ok: true,
      username: updated[0].username,
      leyMeta: {
        totalEarned: sanitizeTotalEarned(updated[0].total_earned),
        spentCrystals: sanitizeSpentCrystals(updated[0].spent_crystals),
        talents: sanitizeTalents(updated[0].talents)
      }
    });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (error?.code === "23505" || message.includes("unique") || message.includes("duplicate")) {
      return json(409, { error: "This username is already taken." });
    }
    if (message.includes("spent_crystals") || message.includes("username_renames")) {
      return json(503, { error: "Rename storage is not ready. Apply setup_ley_meta.sql first." });
    }
    return json(500, { error: "Failed to update username." });
  }
};
