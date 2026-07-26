const { json, getSessionUser, getClientIp, hashIp, memoryRateLimited, sql } = require("./auth-utils");

const SLOTS = ["weapon", "armor", "boots", "ring", "charm"];
const RARITIES = new Set(["common", "uncommon", "rare", "epic", "legendary"]);
const MAX_POWER = 500000;

const str = (v, max) => String(v == null ? "" : v).slice(0, max);
const int = (v, max) => {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
};

// Reduce whatever the client sends to a small, safe, display-only shape.
function sanitizeLoadout(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const items = {};
  const srcItems = src.items && typeof src.items === "object" ? src.items : {};
  for (const slot of SLOTS) {
    const it = srcItems[slot];
    if (!it || typeof it !== "object") { items[slot] = null; continue; }
    const rarity = RARITIES.has(it.rarity) ? it.rarity : "common";
    items[slot] = {
      name: str(it.name, 40) || "Unknown",
      rarity,
      power: int(it.power, 100000),
      icon: str(it.icon, 8)
    };
  }
  const skills = Array.isArray(src.skills)
    ? src.skills.slice(0, 24).map((s) => ({
        name: str(s && s.name, 40),
        rank: int(s && s.rank, 20)
      })).filter((s) => s.name)
    : [];
  const heroName = str(src.heroName, 18).trim();
  return { heroName: heroName || null, items, skills };
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

    const ipHash = hashIp(getClientIp(event));
    if (memoryRateLimited(`loadout:${session.user_id}`, 20, 60_000)
      || memoryRateLimited(`loadout-ip:${ipHash}`, 40, 60_000)) {
      return json(429, { error: "Too many updates. Try again shortly." });
    }

    const body = JSON.parse(String(event.body || "{}"));
    const power = int(body.power, MAX_POWER);
    const equipmentPower = int(body.equipmentPower, MAX_POWER);
    const skillPoints = int(body.skillPoints, 500);
    const loadout = sanitizeLoadout(body.loadout);

    await sql`
      insert into hero_loadouts (user_id, power, equipment_power, skill_points, loadout, updated_at)
      values (${session.user_id}, ${power}, ${equipmentPower}, ${skillPoints}, ${JSON.stringify(loadout)}::jsonb, now())
      on conflict (user_id)
      do update set
        power = ${power},
        equipment_power = ${equipmentPower},
        skill_points = ${skillPoints},
        loadout = ${JSON.stringify(loadout)}::jsonb,
        updated_at = now()
    `;

    return json(200, { ok: true });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("hero_loadouts")) {
      return json(503, { error: "Loadouts are not ready yet. Apply setup_hero_loadout.sql first." });
    }
    return json(500, { error: "Failed to submit loadout." });
  }
};
