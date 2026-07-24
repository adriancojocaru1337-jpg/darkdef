const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/systems/hero-system.js");

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }
}

function createHarness(enemies = [], options = {}) {
  const profileStore = DarkDefense.createProfileStore({ storage: new MemoryStorage() });
  const damageEvents = [];
  const messages = [];
  const hero = DarkDefense.createHeroSystem({
    profileStore,
    statPipeline: options.statPipeline,
    getEnemies: () => enemies,
    getPathPosition: (progress) => ({ x: progress * 1000, y: 100 }),
    dealDamage: (enemy, damage, source) => {
      enemy.hp -= damage;
      damageEvents.push({ enemyId: enemy.id, damage, source: source.source });
      return damage;
    },
    onMessage: (message) => messages.push(message)
  });
  return { hero, profileStore, damageEvents, messages };
}

test("auto-attacks enemies in range and blocks one non-boss enemy", () => {
  const enemies = [{ id: 7, type: "normal", hp: 200, maxHp: 200, progress: 0.68 }];
  const { hero, damageEvents } = createHarness(enemies);

  hero.update(0.1, { active: true, paused: false, difficulty: 1 });

  assert.equal(enemies[0].blockedByHeroId, "varyn");
  assert.equal(damageEvents.length, 1);
  assert.equal(damageEvents[0].source, "basic");
  assert.ok(enemies[0].hp < 200);
});

test("commands snap to the road and move the hero toward the guard point", () => {
  const { hero } = createHarness([]);
  hero.update(0.01, { active: true, paused: false, difficulty: 1 });

  assert.equal(hero.toggleCommandMode(), true);
  assert.equal(hero.commandToWorld(200, 104), true);
  const target = hero.getRunState().targetProgress;
  hero.update(1, { active: true, paused: false, difficulty: 1 });

  assert.ok(Math.abs(target - 0.2) < 0.01);
  assert.ok(hero.getRunState().progress < 0.68);
});

test("Rift Pulse damages only nearby enemies and starts its cooldown", () => {
  const enemies = [
    { id: 1, type: "normal", hp: 300, maxHp: 300, progress: 0.7 },
    { id: 2, type: "normal", hp: 300, maxHp: 300, progress: 0.9 }
  ];
  const { hero, damageEvents } = createHarness(enemies);
  hero.update(0.01, { active: true, paused: false, difficulty: 1 });
  damageEvents.length = 0;

  assert.equal(hero.activateAbility(), true);
  assert.deepEqual(damageEvents.map((event) => event.enemyId), [1]);
  assert.equal(hero.getRunState().abilityCooldown, 24);
  assert.equal(hero.activateAbility(), false);
});

test("experience persists and supports multiple hero levels", () => {
  const { hero, profileStore } = createHarness([]);

  const result = hero.addExperience(240, "test");
  const progression = profileStore.getHero("varyn");

  assert.equal(result.levelsGained, 2);
  assert.equal(progression.level, 3);
  assert.equal(progression.xp, 5);
  assert.equal(progression.totalXp, 240);
});

test("falls in melee and respawns automatically", () => {
  const enemies = [{ id: 9, type: "tank", hp: 10000, maxHp: 10000, progress: 0.68 }];
  const { hero } = createHarness(enemies);

  hero.update(5, { active: true, paused: false, difficulty: 3 });
  assert.equal(hero.isAlive(), false);
  assert.equal(hero.getRunState().respawnTimer, 12);
  assert.equal(enemies[0].blockedByHeroId, undefined);

  hero.update(12.1, { active: true, paused: false, difficulty: 3 });
  assert.equal(hero.isAlive(), true);
  assert.equal(hero.getRunState().hp, hero.getStats().maxHp);
});

test("run snapshots restore tactical hero state", () => {
  const { hero } = createHarness([]);
  hero.update(0.01, { active: true, paused: false, difficulty: 1 });
  hero.toggleCommandMode();
  hero.commandToWorld(350, 100);
  hero.update(0.5, { active: true, paused: false, difficulty: 1 });
  const snapshot = hero.serializeRunState();

  hero.resetForStage();
  hero.restoreRunState(snapshot);

  assert.equal(hero.getRunState().targetProgress, snapshot.targetProgress);
  assert.equal(hero.getRunState().progress, snapshot.progress);
});

test("equipment stat pipeline affects combat and hero limits", () => {
  const enemies = [{ id: 11, type: "boss", hp: 500, maxHp: 500, progress: 0.68 }];
  const statPipeline = {
    apply(base) {
      return {
        ...base,
        maxHp: base.maxHp + 40,
        damage: base.damage + 10,
        abilityCooldown: 18,
        respawnSeconds: 9,
        bossDamageMultiplier: 1.5,
        equipmentPower: 80
      };
    }
  };
  const { hero, damageEvents } = createHarness(enemies, { statPipeline });

  hero.update(0.1, { active: true, paused: false, difficulty: 1 });

  assert.equal(hero.getStats().maxHp, 270);
  assert.equal(hero.getStats().equipmentPower, 80);
  assert.equal(damageEvents[0].damage, 54);
});
