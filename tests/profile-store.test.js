const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");

class MemoryStorage {
  constructor(seed = {}) {
    this.values = new Map(Object.entries(seed));
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test("creates a complete versioned RPG profile and imports legacy progress", () => {
  const storage = new MemoryStorage({
    sdcPlayerName: "Adrian",
    sdcBestScore: "4200",
    sdcFurthestStage: "4",
    sdcEndlessUnlocked: "1"
  });
  const store = DarkDefense.createProfileStore({ storage });
  const profile = store.getSnapshot();

  assert.equal(profile.schemaVersion, 4);
  assert.equal(profile.player.displayName, "Adrian");
  assert.equal(profile.progress.bestScore, 4200);
  assert.equal(profile.progress.furthestStage, 4);
  assert.equal(profile.progress.endlessUnlocked, true);
  assert.equal(profile.heroes.roster.varyn.level, 1);
  assert.deepEqual(profile.inventory.items, []);
  assert.equal(profile.guild.mode, "single_player");
  assert.ok(storage.getItem("darkDefense.profile"));
});

test("backs up corrupt profile data and recovers with defaults", () => {
  const storage = new MemoryStorage({
    "darkDefense.profile": "{broken json"
  });
  const originalWarn = console.warn;
  console.warn = () => {};
  let store;
  try {
    store = DarkDefense.createProfileStore({ storage });
  } finally {
    console.warn = originalWarn;
  }

  assert.equal(store.getHero("varyn").level, 1);
  assert.equal(storage.getItem("darkDefense.profile.corrupt"), "{broken json");
  assert.doesNotThrow(() => JSON.parse(storage.getItem("darkDefense.profile")));
});

test("updates hero progression without exposing mutable internal state", () => {
  const storage = new MemoryStorage();
  const store = DarkDefense.createProfileStore({ storage });
  const snapshot = store.getSnapshot();
  snapshot.heroes.roster.varyn.level = 19;

  assert.equal(store.getHero("varyn").level, 1);
  assert.equal(store.updateHero("varyn", { level: 3, xp: 22, totalXp: 202 }), true);
  assert.deepEqual(
    {
      level: store.getHero("varyn").level,
      xp: store.getHero("varyn").xp,
      totalXp: store.getHero("varyn").totalXp
    },
    { level: 3, xp: 22, totalXp: 202 }
  );
});

test("upgrades legacy profiles and sanitizes reward collections", () => {
  const storage = new MemoryStorage({
    "darkDefense.profile": JSON.stringify({
      schemaVersion: 1,
      inventory: { capacity: 9999, items: "invalid" },
      equipment: {
        heroes: {
          varyn: { weapon: "itm_weapon", invalid_slot: "itm_bad", armor: 42 },
          broken: "invalid"
        }
      },
      skillTrees: {
        heroes: {
          varyn: { ranks: { ashen_edge: 2, invalid_zero: 0, invalid_text: "bad" } },
          broken: "invalid"
        },
        towers: "invalid"
      },
      rewards: { pityCounters: "invalid", unclaimed: [{ bundleId: "rwd_old", items: [] }, null] },
      migration: { legacyImported: true }
    })
  });
  const store = DarkDefense.createProfileStore({ storage });
  const profile = store.getSnapshot();

  assert.equal(profile.schemaVersion, 4);
  assert.equal(profile.inventory.capacity, 500);
  assert.deepEqual(profile.inventory.items, []);
  assert.deepEqual(profile.rewards.pityCounters, {});
  assert.equal(profile.rewards.unclaimed.length, 1);
  assert.equal(profile.rewards.unclaimed[0].bundleId, "rwd_old");
  assert.deepEqual(profile.equipment.heroes, { varyn: { weapon: "itm_weapon" } });
  assert.deepEqual(profile.skillTrees.heroes, { varyn: { ranks: { ashen_edge: 2 } } });
  assert.deepEqual(profile.skillTrees.towers, {});
  assert.equal(JSON.parse(storage.getItem("darkDefense.profile")).schemaVersion, 4);
});

test("replaces the local cache with an exact sanitized Cloud Save revision", () => {
  const storage = new MemoryStorage();
  const events = DarkDefense.createEventBus();
  const changes = [];
  events.on("profile:changed", (payload) => changes.push(payload));
  const store = DarkDefense.createProfileStore({ storage, events });
  const cloudProfile = DarkDefense.createDefaultProfile(1000);
  cloudProfile.revision = 27;
  cloudProfile.updatedAt = 2000;
  cloudProfile.inventory.items = [{
    instanceId: "itm_cloud",
    definitionId: "warden_blade",
    slot: "weapon"
  }];

  assert.equal(store.replace(cloudProfile, "cloud:adopted"), true);
  assert.equal(store.getSnapshot().revision, 27);
  assert.equal(store.getSnapshot().inventory.items[0].instanceId, "itm_cloud");
  assert.equal(JSON.parse(storage.getItem("darkDefense.profile")).revision, 27);
  assert.equal(changes.at(-1).reason, "cloud:adopted");
});
