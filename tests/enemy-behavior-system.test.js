const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/content/combat-content.js");
require("../js/systems/enemy-behavior-system.js");

function createSystem(activations = [], casts = []) {
  return DarkDefense.createEnemyBehaviorSystem({
    getPosition: (enemy) => ({ x: enemy.progress * 1000, y: 0 }),
    onActivated: (enemy, trait) => activations.push({ enemyId: enemy.id, traitId: trait.id }),
    onCast: (enemy, trait) => {
      casts.push({ enemyId: enemy.id, traitId: trait.id });
      return true;
    }
  });
}

test("Pack Hunters accelerate only while another fast enemy is nearby", () => {
  const system = createSystem();
  const first = { id: 1, type: "fast", hp: 50, maxHp: 50, progress: 0.2 };
  const second = { id: 2, type: "fast", hp: 50, maxHp: 50, progress: 0.25 };
  const enemies = [first, second];

  system.updateAll(enemies);
  assert.equal(first.behavior.active, true);
  assert.equal(system.getMovementMultiplier(first, 1), 1.16);

  second.progress = 0.8;
  system.updateAll(enemies);
  assert.equal(first.behavior.active, false);
  assert.equal(system.getMovementMultiplier(first, 1), 1);
});

test("Bulwark protects nearby allies without protecting itself", () => {
  const system = createSystem();
  const bulwark = { id: 1, type: "armored", hp: 100, maxHp: 100, progress: 0.4 };
  const ally = { id: 2, type: "normal", hp: 50, maxHp: 50, progress: 0.45 };
  const farAlly = { id: 3, type: "normal", hp: 50, maxHp: 50, progress: 0.8 };

  system.updateAll([bulwark, ally, farAlly]);

  assert.equal(system.getDamageTakenMultiplier(bulwark), 1);
  assert.equal(system.getDamageTakenMultiplier(ally), 0.82);
  assert.equal(system.getDamageTakenMultiplier(farAlly), 1);
});

test("Last Stand activates once, resists slows, but not hard control", () => {
  const activations = [];
  const system = createSystem(activations);
  const tank = { id: 9, type: "tank", hp: 39, maxHp: 100, progress: 0.5 };

  system.updateAll([tank]);
  system.updateAll([tank]);

  assert.equal(activations.length, 1);
  assert.equal(tank.behavior.active, true);
  assert.ok(Math.abs(system.getMovementMultiplier(tank, 0.4) - 0.936) < 0.0001);
  assert.equal(system.getMovementMultiplier(tank, 0), 0);
});

test("Cinder Skirmisher leaps once below its health threshold", () => {
  const activations = [];
  const system = createSystem(activations);
  const skirmisher = {
    id: 21,
    type: "cinder_skirmisher",
    hp: 54,
    maxHp: 100,
    progress: 0.2
  };

  system.updateAll([skirmisher]);
  assert.ok(Math.abs(skirmisher.progress - 0.27) < 0.0001);
  assert.equal(skirmisher.behavior.leaped, true);
  assert.equal(system.getMovementMultiplier(skirmisher, 1), 1.12);

  skirmisher.hp = 20;
  system.updateAll([skirmisher]);
  assert.ok(Math.abs(skirmisher.progress - 0.27) < 0.0001);
  assert.equal(activations.length, 1);
});

test("Hollow Binder hexes on a cooldown and cannot cast while frozen", () => {
  const casts = [];
  const system = createSystem([], casts);
  const binder = {
    id: 22,
    type: "hollow_binder",
    hp: 100,
    maxHp: 100,
    progress: 0.4
  };

  system.updateAll([binder], 4.1);
  assert.equal(casts.length, 0);
  system.updateAll([binder], 0.2);
  assert.equal(casts.length, 1);

  binder.freezeTimer = 2;
  system.updateAll([binder], 7.1);
  assert.equal(casts.length, 1);
  binder.freezeTimer = 0;
  system.updateAll([binder], 7.1);
  assert.equal(casts.length, 2);
});

test("Ley Revenant starts shielded and restores its ward only once", () => {
  const activations = [];
  const system = createSystem(activations);
  const revenant = {
    id: 23,
    type: "ley_revenant",
    hp: 100,
    maxHp: 100,
    progress: 0.6
  };

  system.updateAll([revenant]);
  assert.equal(revenant.shieldHp, 18);

  revenant.shieldHp = 0;
  revenant.hp = 44;
  system.updateAll([revenant]);
  assert.equal(revenant.shieldHp, 24);
  assert.equal(revenant.behavior.recharged, true);

  revenant.shieldHp = 0;
  revenant.hp = 20;
  system.updateAll([revenant]);
  assert.equal(revenant.shieldHp, 0);
  assert.equal(activations.length, 1);
});
