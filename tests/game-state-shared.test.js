const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MAX_STATE_BYTES,
  sanitizeGameState,
  sanitizeRevision
} = require("../netlify/functions/game-state-shared");

function stateFixture() {
  return {
    schemaVersion: 1,
    profile: {
      schemaVersion: 4,
      revision: 7,
      createdAt: 1000,
      updatedAt: 2000,
      heroes: { roster: { varyn: { level: 8, xp: 14, totalXp: 900 } } },
      inventory: {
        capacity: 999,
        items: [{
          instanceId: "itm_cloud",
          definitionId: "warden_blade",
          slot: "weapon",
          power: 71,
          affixes: [{ id: "keen", value: 4.5 }]
        }]
      },
      equipment: { heroes: { varyn: { weapon: "itm_cloud" } } },
      skillTrees: { heroes: { varyn: { ranks: { ashen_edge: 2 } } } },
      rewards: { unclaimed: [] }
    },
    legacy: {
      bestScore: 12345,
      furthestStage: 9,
      endlessUnlocked: true,
      act2Complete: false,
      bestEndlessWave: 31,
      bestEndlessBossPairs: 3,
      bestCombo: 42,
      achievementClaims: ["first_kill", "bad claim!", "first_kill"]
    }
  };
}

test("sanitizes a complete RPG Cloud Save without dropping item detail", () => {
  const clean = sanitizeGameState(stateFixture());

  assert.equal(clean.schemaVersion, 1);
  assert.equal(clean.profile.revision, 7);
  assert.equal(clean.profile.inventory.capacity, 500);
  assert.equal(clean.profile.inventory.items[0].instanceId, "itm_cloud");
  assert.equal(clean.profile.inventory.items[0].affixes[0].value, 4.5);
  assert.equal(clean.profile.skillTrees.heroes.varyn.ranks.ashen_edge, 2);
  assert.deepEqual(clean.legacy.achievementClaims, ["first_kill"]);
  assert.equal(clean.legacy.furthestStage, 9);
});

test("rejects missing profiles and oversized Cloud Saves", () => {
  assert.throws(() => sanitizeGameState({}), /profile object/i);

  const state = stateFixture();
  state.profile.inventory.items = Array.from({ length: 500 }, (_, index) => ({
    instanceId: `itm_${index}`,
    padding: "x".repeat(1000)
  }));
  assert.throws(
    () => sanitizeGameState(state),
    (error) => error instanceof RangeError && error.code === "state_too_large"
  );
});

test("normalizes invalid server revisions", () => {
  assert.equal(sanitizeRevision(-9), 0);
  assert.equal(sanitizeRevision("12.9"), 12);
  assert.equal(sanitizeRevision("bad"), 0);
});
