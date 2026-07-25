const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/content/reward-content.js");
require("../js/systems/reward-inbox.js");
require("../js/systems/inventory-system.js");

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function item(instanceId, power = 10, rarity = "common") {
  return {
    instanceId,
    definitionId: "warden_blade",
    name: "Warden Blade",
    slot: "weapon",
    power,
    rarity,
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

test("discard removes an item and grants no essence", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("itm_junk", 40, "common")];
    return profile;
  });

  const result = inventory.discard("itm_junk");

  assert.equal(result.accepted, true);
  assert.equal(result.reason, "discarded");
  assert.equal(inventory.getStatus().count, 0);
  assert.equal(store.getSnapshot().prestige.currency, 0);
});

test("salvage removes an item and credits essence by rarity and power", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("itm_epic", 100, "epic")];
    return profile;
  });

  const expected = DarkDefense.salvageValue(item("itm_epic", 100, "epic"));
  const result = inventory.salvage("itm_epic");

  assert.equal(result.accepted, true);
  assert.equal(result.reason, "salvaged");
  assert.equal(result.essence, expected);
  assert.ok(expected > 0);
  assert.equal(inventory.getStatus().count, 0);
  assert.equal(store.getSnapshot().prestige.currency, expected);
});

test("salvage accumulates essence across multiple items", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("a", 20, "rare"), item("b", 60, "legendary")];
    return profile;
  });

  const first = inventory.salvage("a");
  const second = inventory.salvage("b");

  assert.equal(
    store.getSnapshot().prestige.currency,
    first.essence + second.essence
  );
  assert.equal(inventory.getStatus().count, 0);
});

test("equipped items cannot be salvaged or discarded", () => {
  const { store } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("itm_worn", 30, "rare")];
    return profile;
  });
  const inventory = DarkDefense.createInventorySystem({
    profileStore: store,
    isEquipped: (id) => id === "itm_worn"
  });

  const salvaged = inventory.salvage("itm_worn");
  const discarded = inventory.discard("itm_worn");

  assert.equal(salvaged.accepted, false);
  assert.equal(salvaged.reason, "equipped");
  assert.equal(discarded.accepted, false);
  assert.equal(discarded.reason, "equipped");
  assert.equal(inventory.getStatus().count, 1);
  assert.equal(store.getSnapshot().prestige.currency, 0);
});

test("salvaging a missing item is rejected cleanly", () => {
  const { inventory } = harness();
  const result = inventory.salvage("nope");
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "not_found");
});

test("previewSalvage matches the value actually granted", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.inventory.items = [item("itm_pre", 55, "uncommon")];
    return profile;
  });
  const preview = inventory.previewSalvage("itm_pre");
  const result = inventory.salvage("itm_pre");
  assert.equal(preview, result.essence);
});

test("crafts a crystal by spending the essence threshold, reporting the crafted count", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.prestige.currency = 250;
    return profile;
  });

  const result = inventory.craftCrystal(1);

  assert.equal(result.accepted, true);
  assert.equal(result.crafted, 1);
  assert.equal(result.essenceSpent, DarkDefense.CRYSTAL_ESSENCE_COST);
  assert.equal(store.getSnapshot().prestige.currency, 250 - DarkDefense.CRYSTAL_ESSENCE_COST);
  // Crystals are NOT stored on the profile — the caller deposits them into
  // the shared Ascension wallet.
  assert.equal(store.getSnapshot().prestige.crystals, undefined);
});

test("crafting is rejected without enough essence and changes nothing", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.prestige.currency = 40;
    return profile;
  });

  const result = inventory.craftCrystal(1);

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "insufficient_essence");
  assert.equal(store.getSnapshot().prestige.currency, 40);
});

test("getCurrency reports craftable crystals and essence to next", () => {
  const { store, inventory } = harness();
  store.update((profile) => {
    profile.prestige.currency = 230;
    return profile;
  });

  const currency = inventory.getCurrency();

  assert.equal(currency.essence, 230);
  assert.equal(currency.crystalCost, DarkDefense.CRYSTAL_ESSENCE_COST);
  assert.equal(currency.craftableCrystals, 2);
  assert.equal(currency.essenceToNextCrystal, 70);
});

test("salvage feeds essence that then crafts a crystal end to end", () => {
  const { store, inventory } = harness();
  const items = [];
  for (let i = 0; i < 8; i += 1) items.push(item(`leg_${i}`, 200, "legendary"));
  store.update((profile) => {
    profile.inventory.items = items;
    return profile;
  });

  items.forEach((it) => inventory.salvage(it.instanceId));
  const beforeCraft = inventory.getCurrency();
  assert.ok(beforeCraft.craftableCrystals >= 1);

  const crafted = inventory.craftCrystal(1);
  assert.equal(crafted.accepted, true);
  assert.equal(crafted.crafted, 1);
  assert.equal(
    inventory.getCurrency().essence,
    beforeCraft.essence - DarkDefense.CRYSTAL_ESSENCE_COST
  );
});
