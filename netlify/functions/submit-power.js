const { json, getSessionUser, getClientIp, hashIp, memoryRateLimited, sql } = require("./auth-utils");

// Plausibility ceilings. Power is computed client-side, so these only reject
// clearly impossible values — they are not a substitute for real validation.
const MAX_POWER = 500000;
const MAX_EQUIPMENT_POWER = 400000;
const MAX_SKILL_POINTS = 500;

const toInt = (value, max) => {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return null;
  if (n > max) return null;
  return n;
};

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    const session = await getSessionUser(event);
    if (!session) {
      return json(401, { error: "Authentication required." });
    }

    const ipHash = hashIp(getClientIp(event));
    if (memoryRateLimited(`power:${session.user_id}`, 20, 60_000)
      || memoryRateLimited(`power-ip:${ipHash}`, 40, 60_000)) {
      return json(429, { error: "Too many updates. Try again shortly." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const equipmentPower = toInt(body.equipmentPower, MAX_EQUIPMENT_POWER);
    const skillPoints = toInt(body.skillPoints, MAX_SKILL_POINTS);
    const power = toInt(body.power, MAX_POWER);
    if (power === null || equipmentPower === null || skillPoints === null) {
      return json(400, { error: "Invalid power payload." });
    }

    const playerName = String(session.username || "").slice(0, 40) || "Commander";

    await sql`
      insert into power_leaderboard (user_id, player_name, power, equipment_power, skill_points, updated_at)
      values (${session.user_id}, ${playerName}, ${power}, ${equipmentPower}, ${skillPoints}, now())
      on conflict (user_id)
      do update set
        player_name = ${playerName},
        power = ${power},
        equipment_power = ${equipmentPower},
        skill_points = ${skillPoints},
        updated_at = now()
    `;

    return json(200, { ok: true, power });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("power_leaderboard")) {
      return json(503, { error: "Power leaderboard is not ready yet. Apply setup_power_leaderboard.sql first." });
    }
    return json(500, { error: "Failed to submit power." });
  }
};
