const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/run-rng.js");
require("../js/content/reward-content.js");
require("../js/systems/reward-generator.js");

function generate(seed, input = {}) {
  const rng = DarkDefense.createRunRng(seed);
  return DarkDefense.createRewardGenerator({ rng }).generateBossReward({
    sourceId: "boss:campaign:3:5",
    mode: "campaign",
    stage: 3,
    wave: 5,
    ...input
  });
}

function generateLowRoll(input = {}) {
  const rng = {
    seed: "forced-low",
    next: () => 0,
    weighted: () => "common",
    pick: (values) => values[0],
    shuffle: (values) => [...values],
    int: () => 0
  };
  return DarkDefense.createRewardGenerator({ rng }).generateBossReward({
    sourceId: "boss:pity:test",
    mode: "campaign",
    stage: 1,
    wave: 5,
    ...input
  });
}

test("same seed and source produce the same reward bundle", () => {
  assert.deepEqual(generate("loot-seed"), generate("loot-seed"));
});

test("boss rewards respect item eligibility and affix count", () => {
  const bundle = generate("rare-seed", { stage: 1 });
  const item = bundle.items[0];
  const definition = DarkDefense.ITEM_DEFINITIONS[item.definitionId];
  const rarity = DarkDefense.ITEM_RARITIES[item.rarity];

  assert.ok(definition.minStage <= 1);
  assert.equal(item.affixes.length, rarity.affixCount);
  assert.equal(item.sourceId, bundle.sourceId);
});

test("bundle and item ids are stable across reruns of the same source", () => {
  const first = generate("seed-a");
  const second = generate("seed-b");

  assert.equal(first.bundleId, second.bundleId);
  assert.equal(first.items[0].instanceId, second.items[0].instanceId);
});

test("later stages unlock the complete base-item pool", () => {
  const seen = new Set();
  for (let index = 0; index < 80; index += 1) {
    const bundle = generate(`stage-six-${index}`, { stage: 6 });
    seen.add(bundle.items[0].definitionId);
  }

  assert.ok(seen.has("ley_charm"));
  assert.ok(seen.has("rift_ring"));
  assert.ok(seen.has("warden_blade"));
});

test("set drops preserve their set identity in the reward item", () => {
  const rng = {
    seed: "forced-set",
    next: () => 0.5,
    weighted: () => "rare",
    pick: (values) => values[0],
    shuffle: (values) => [...values],
    int: () => 0
  };
  const definition = DarkDefense.ITEM_DEFINITIONS.artificer_maul;
  const bundle = DarkDefense.createRewardGenerator({
    rng,
    definitions: { artificer_maul: definition }
  }).generateBossReward({
    sourceId: "boss:set:test",
    mode: "campaign",
    stage: 4,
    wave: 5
  });

  assert.equal(bundle.items[0].setId, "bastion_artificer");
  assert.equal(bundle.items[0].setName, "Bastion Artificer");
  assert.equal(bundle.items[0].setColor, "#5eead4");
});

test("pity counters advance after low rarity rewards", () => {
  const bundle = generateLowRoll({ pityState: { rare: 1, epic: 2 } });

  assert.equal(bundle.items[0].rarity, "common");
  assert.deepEqual(bundle.pity.before, { rare: 1, epic: 2 });
  assert.deepEqual(bundle.pity.after, { rare: 2, epic: 3 });
  assert.equal(bundle.pity.triggered, null);
});

test("rare pity guarantees the fourth campaign drop", () => {
  const bundle = generateLowRoll({ pityState: { rare: 3, epic: 3 } });

  assert.equal(bundle.items[0].rarity, "rare");
  assert.equal(bundle.pity.triggered, "rare");
  assert.deepEqual(bundle.pity.after, { rare: 0, epic: 4 });
});

test("epic pity takes priority and resets both counters", () => {
  const bundle = generateLowRoll({ pityState: { rare: 3, epic: 9 } });

  assert.equal(bundle.items[0].rarity, "epic");
  assert.equal(bundle.pity.triggered, "epic");
  assert.deepEqual(bundle.pity.after, { rare: 0, epic: 0 });
});
