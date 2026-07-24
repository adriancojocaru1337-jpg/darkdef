const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/systems/reward-inbox.js");

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const bundle = {
  bundleId: "rwd_test",
  sourceId: "boss:test",
  runSeed: "seed",
  items: [{ instanceId: "itm_test", definitionId: "warden_blade" }]
};

test("queues rewards persistently without exposing mutable state", () => {
  const store = DarkDefense.createProfileStore({ storage: new MemoryStorage() });
  const inbox = DarkDefense.createRewardInbox({ profileStore: store });

  assert.equal(inbox.enqueue(bundle).accepted, true);
  const listed = inbox.list();
  listed[0].items[0].definitionId = "changed";

  assert.equal(inbox.itemCount(), 1);
  assert.equal(inbox.list()[0].items[0].definitionId, "warden_blade");
});

test("duplicate bundle ids are rejected without losing the original", () => {
  const store = DarkDefense.createProfileStore({ storage: new MemoryStorage() });
  const inbox = DarkDefense.createRewardInbox({ profileStore: store });

  inbox.enqueue(bundle);
  const result = inbox.enqueue({ ...bundle, items: [{ instanceId: "itm_other" }] });

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "duplicate");
  assert.equal(inbox.list().length, 1);
  assert.equal(inbox.list()[0].items[0].instanceId, "itm_test");
});

test("pity state advances atomically only for accepted rewards", () => {
  const store = DarkDefense.createProfileStore({ storage: new MemoryStorage() });
  const inbox = DarkDefense.createRewardInbox({ profileStore: store });
  const pityBundle = {
    ...bundle,
    pity: {
      key: "boss_campaign",
      before: { rare: 0, epic: 0 },
      after: { rare: 1, epic: 1 },
      triggered: null
    }
  };

  assert.equal(inbox.enqueue(pityBundle).accepted, true);
  assert.deepEqual(inbox.getPity("boss_campaign"), { rare: 1, epic: 1 });

  const duplicate = {
    ...pityBundle,
    pity: { ...pityBundle.pity, after: { rare: 9, epic: 9 } }
  };
  assert.equal(inbox.enqueue(duplicate).accepted, false);
  assert.deepEqual(inbox.getPity("boss_campaign"), { rare: 1, epic: 1 });
});
