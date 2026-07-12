// Server-side copy of the Ley Attunement talent definitions.
// Must stay in sync with LEY_TALENT_BRANCHES in game.js (ids, maxRank, costs).
const LEY_NODES = {
  radiant_edge:       { maxRank: 3, costs: [20, 45, 90] },
  swift_current:      { maxRank: 2, costs: [60, 120] },
  farsight:           { maxRank: 1, costs: [150] },
  ley_conduit:        { maxRank: 1, costs: [100] },
  golden_veins:       { maxRank: 3, costs: [20, 40, 80] },
  warding_light:      { maxRank: 2, costs: [55, 110] },
  prosperity:         { maxRank: 2, costs: [70, 140] },
  mended_gate:        { maxRank: 1, costs: [90] },
  attuned_casting:    { maxRank: 2, costs: [40, 85] },
  second_sight:       { maxRank: 1, costs: [130] },
  crystal_harvest:    { maxRank: 2, costs: [30, 70] },
  luminous_awakening: { maxRank: 1, costs: [200] }
};

const MAX_TOTAL_EARNED = 1000000;

function sanitizeTalents(raw) {
  const clean = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return clean;
  for (const [id, value] of Object.entries(raw)) {
    const def = LEY_NODES[id];
    if (!def) continue;
    const rank = Math.max(0, Math.min(def.maxRank, parseInt(value, 10) || 0));
    if (rank > 0) clean[id] = rank;
  }
  return clean;
}

function talentsSpent(talents) {
  let spent = 0;
  for (const [id, rank] of Object.entries(talents || {})) {
    const def = LEY_NODES[id];
    if (!def) continue;
    for (let i = 0; i < Math.min(rank, def.maxRank); i += 1) spent += def.costs[i] || 0;
  }
  return spent;
}

function sanitizeTotalEarned(raw) {
  const value = parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(MAX_TOTAL_EARNED, value);
}

function mergeMeta(a, b) {
  const talents = {};
  const ids = new Set([...Object.keys(a.talents || {}), ...Object.keys(b.talents || {})]);
  for (const id of ids) {
    const def = LEY_NODES[id];
    if (!def) continue;
    const rank = Math.min(def.maxRank, Math.max(a.talents?.[id] || 0, b.talents?.[id] || 0));
    if (rank > 0) talents[id] = rank;
  }
  return {
    totalEarned: Math.min(MAX_TOTAL_EARNED, Math.max(a.totalEarned || 0, b.totalEarned || 0)),
    talents
  };
}

module.exports = { LEY_NODES, MAX_TOTAL_EARNED, sanitizeTalents, talentsSpent, sanitizeTotalEarned, mergeMeta };
