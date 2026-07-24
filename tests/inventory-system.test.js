const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/systems/reward-inbox.js");
require("../js/systems/inventory-system.js");

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function item(instanceId, power = 10) {
  return {
    instanceId,
    definitionId: "warden_blade",
    name: "Warden Blade",
    slot: "weapon",
    power,
    coreStat: { id: "hero_damage_flat", value: 5 },
    affixes: []
  };
}

function bundle(bundleId, items) {
  return { bundleId, sourceId: `boss:${bundleId}`, items };
}

function harness() {
  const store = DarkDefense.createProfileStore({ storage: new MemoryStorage() });
  const inbox = DarkDefense.createRewardInbox({ profileStore: store });
  const inventory = DarkDefense.createInventorySystem({ profileStore: store });
  return { store, inbox, inventory };
}

test("claims a reward bundle atomically into persistent inventory", () => {
  const { store, inbox, inventory } = harness();
  inbox.enqueue(bundle("rwd_one", [item("itm_one", 21)]));

  const result = inventory.claimBundle("rwd_one");

  assert.equal(result.accepted, true);
  assert.equal(inventory.getStatus().count, 1);
  assert.equal(inventory.getItem("itm_one").power, 21);
  assert.deepEqual(store.getSnapshot().rewards.unclaimed, []);
});

test("full inventory leaves the complete reward bundle untouched", () => {
  const { store, inbox, inventory } = harness();
  store.update((profile) => {
    profile.inventory.capacity = 1;
    profile.inventory.items = [item("itm_existing")];
    return profile;
  });
  inbox.enqueue(bundle("rwd_waiting", [item("itm_waiting")]));

  const result = inventory.claimBundle("rwd_waiting");

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "capacity");
  assert.equal(inventory.getStatus().count, 1);
  assert.equal(store.getSnapshot().rewards.unclaimed.length, 1);
});

test("claim all is all-or-nothing and rejects duplicate item ids", () => {
  const { store, inbox, inventory } = harness();
  inbox.enqueue(bundle("rwd_a", [item("itm_same")]));
  inbox.enqueue(bundle("rwd_b", [item("itm_same")]));

  const result = inventory.claimAll();

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "duplicate_item");
  assert.equal(inventory.getStatus().count, 0);
  assert.equal(store.getSnapshot().rewards.unclaimed.length, 2);
});

test("inventory sorting never exposes mutable profile data", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("itm_low", 5), item("itm_high", 50)];
    return profile;
  });

  const listed = inventory.list("power_desc");
  listed[0].power = 0;

  assert.deepEqual(inventory.list("power_desc").map((entry) => entry.instanceId), ["itm_high", "itm_low"]);
  assert.equal(inventory.getItem("itm_high").power, 50);
});
