const test = require("node:test");
const assert = require("node:assert/strict");

const {
  sanitizeSpentCrystals,
  mergeMeta,
  availableCrystals
} = require("../netlify/functions/ley-shared");

test("spent Crystal totals are sanitized and monotonic across device merges", () => {
  assert.equal(sanitizeSpentCrystals(-10), 0);
  assert.equal(sanitizeSpentCrystals("175"), 175);

  const merged = mergeMeta(
    { totalEarned: 500, spentCrystals: 150, talents: { radiant_edge: 1 } },
    { totalEarned: 650, spentCrystals: 250, talents: { radiant_edge: 2 } }
  );
  assert.equal(merged.totalEarned, 650);
  assert.equal(merged.spentCrystals, 250);
  assert.equal(merged.talents.radiant_edge, 2);
});

test("available Crystals subtract both talents and consumable spending", () => {
  assert.equal(availableCrystals({
    totalEarned: 500,
    spentCrystals: 150,
    talents: { radiant_edge: 2 }
  }), 285);
});
