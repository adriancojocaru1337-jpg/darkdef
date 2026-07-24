const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/content/hero-skill-content.js");
require("../js/systems/hero-skill-tree-system.js");

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function harness(level = 5) {
  const storage = new MemoryStorage();
  const store = DarkDefense.createProfileStore({ storage });
  store.updateHero("varyn", { level, xp: 0, totalXp: 0 });
  const skills = DarkDefense.createHeroSkillTreeSystem({
    profileStore: store,
    definitions: DarkDefense.HERO_SKILL_DEFINITIONS
  });
  return { storage, store, skills };
}

test("hero levels award one derived skill point after level one", () => {
  const { skills } = harness(6);
  const state = skills.getState();

  assert.equal(state.level, 6);
  assert.equal(state.earnedPoints, 5);
  assert.equal(state.spentPoints, 0);
  assert.equal(state.availablePoints, 5);
});

test("prerequisites block deeper nodes until required ranks are purchased", () => {
  const { skills } = harness(6);

  assert.equal(skills.canPurchase("relentless").reason, "prerequisite");
  assert.equal(skills.purchase("ashen_edge").accepted, true);
  assert.equal(skills.canPurchase("relentless").reason, "prerequisite");
  assert.equal(skills.purchase("ashen_edge").accepted, true);
  assert.equal(skills.canPurchase("relentless").accepted, true);
});

test("purchases persist, consume points and compose skill modifiers", () => {
  const { storage, skills } = harness(5);
  skills.purchase("ashen_edge");
  skills.purchase("ashen_edge");
  skills.purchase("relentless");
  skills.purchase("relentless");

  const state = skills.getState();
  assert.equal(state.availablePoints, 0);
  assert.deepEqual(skills.getModifiers(), {
    hero_damage_pct: 0.08,
    hero_attack_speed_pct: 0.1
  });
  assert.equal(skills.canPurchase("kingsbane_training").reason, "no_points");

  const restoredStore = DarkDefense.createProfileStore({ storage });
  const restored = DarkDefense.createHeroSkillTreeSystem({ profileStore: restoredStore });
  assert.equal(restored.getRank("relentless"), 2);
});

test("respec refunds every point without affecting hero progression", () => {
  const { store, skills } = harness(4);
  skills.purchase("iron_vigor");
  skills.purchase("iron_vigor");
  skills.purchase("pathstrider");

  const result = skills.respec();

  assert.equal(result.accepted, true);
  assert.equal(result.refundedPoints, 3);
  assert.equal(skills.getState().availablePoints, 3);
  assert.deepEqual(skills.getModifiers(), {});
  assert.equal(store.getHero("varyn").level, 4);
});

test("stored ranks are clamped to their content definition", () => {
  const { store, skills } = harness(10);
  store.update((profile) => {
    profile.skillTrees.heroes.varyn.ranks.ashen_edge = 99;
    return profile;
  });

  assert.equal(skills.getRank("ashen_edge"), 3);
  assert.equal(skills.getState().spentPoints, 3);
});
