const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/content/combat-content.js");
require("../js/systems/enemy-behavior-system.js");

function createSystem(activations = []) {
  return DarkDefense.createEnemyBehaviorSystem({
    getPosition: (enemy) => ({ x: enemy.progress * 1000, y: 0 }),
    onActivated: (enemy, trait) => activations.push({ enemyId: enemy.id, traitId: trait.id })
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
