const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/content/combat-content.js");
require("../js/systems/boss-phase-system.js");

test("boss phase telegraphs before it triggers", () => {
  const telegraphs = [];
  const triggers = [];
  const system = DarkDefense.createBossPhaseSystem({
    definitions: {
      1: [{ id: "phase_a", name: "Phase A", hpBelow: 0.7, ability: "rage", intensity: 1, telegraphSeconds: 0.5 }]
    },
    onTelegraph: (_enemy, phase) => telegraphs.push(phase.id),
    onTrigger: (_enemy, phase) => triggers.push(phase.id)
  });
  const boss = { id: 1, type: "boss", bossStage: 1, hp: 60, maxHp: 100 };

  system.update(boss, 0.1);
  assert.deepEqual(telegraphs, ["phase_a"]);
  assert.deepEqual(triggers, []);
  assert.equal(system.getDisplayState(boss).pendingName, "Phase A");

  system.update(boss, 0.5);
  assert.deepEqual(triggers, ["phase_a"]);
  assert.equal(system.getDisplayState(boss).activeName, "Phase A");
});

test("large damage jumps still resolve phases in declaration order", () => {
  const triggers = [];
  const system = DarkDefense.createBossPhaseSystem({
    definitions: {
      2: [
        { id: "phase_one", name: "One", hpBelow: 0.75, ability: "rage", intensity: 1, telegraphSeconds: 0.1 },
        { id: "phase_two", name: "Two", hpBelow: 0.35, ability: "rage", intensity: 2, telegraphSeconds: 0.1 }
      ]
    },
    onTrigger: (_enemy, phase) => triggers.push(phase.id)
  });
  const boss = { id: 2, type: "boss", bossStage: 2, hp: 20, maxHp: 100 };

  system.update(boss, 0.01);
  system.update(boss, 0.1);
  system.update(boss, 0.01);
  system.update(boss, 0.1);

  assert.deepEqual(triggers, ["phase_one", "phase_two"]);
  assert.equal(system.getDisplayState(boss).activeIndex, 2);
});
