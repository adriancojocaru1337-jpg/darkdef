const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/run-state-machine.js");

test("normal run follows ready, wave, pause and clear transitions", () => {
  const machine = DarkDefense.createRunStateMachine();

  assert.equal(machine.send("START_RUN", { mode: "campaign" }).accepted, true);
  assert.equal(machine.getState().phase, "ready");
  assert.equal(machine.send("START_WAVE").accepted, true);
  assert.equal(machine.getState().phase, "wave");
  assert.equal(machine.send("PAUSE").accepted, true);
  assert.equal(machine.getState().previousPhase, "wave");
  assert.equal(machine.send("RESUME").accepted, true);
  assert.equal(machine.getState().phase, "wave");
  assert.equal(machine.send("WAVE_CLEARED").accepted, true);
  assert.equal(machine.getState().phase, "ready");
});

test("invalid transitions are rejected without mutating state", () => {
  const machine = DarkDefense.createRunStateMachine();
  const before = machine.getSnapshot();
  const result = machine.send("START_WAVE");

  assert.equal(result.accepted, false);
  assert.deepEqual(machine.getSnapshot(), before);
});

test("boss reward and stage transition have explicit phases", () => {
  const machine = DarkDefense.createRunStateMachine();
  machine.send("START_RUN");
  machine.send("START_WAVE");
  machine.send("REWARD_OPENED");
  assert.equal(machine.getState().phase, "reward");

  machine.send("TRANSITION_STARTED");
  assert.equal(machine.getState().phase, "transition");
  machine.send("READY");
  assert.equal(machine.getState().phase, "ready");
});

test("daily mode is explicit and survives a restored snapshot", () => {
  const first = DarkDefense.createRunStateMachine();
  first.send("START_RUN", { mode: "endless", daily: true });
  const saved = first.getSnapshot();

  const restored = DarkDefense.createRunStateMachine();
  restored.send("RESTORE", saved);
  assert.equal(restored.getState().mode, "daily");
  assert.equal(restored.getState().phase, "ready");
});

test("game over blocks combat until a new run starts", () => {
  const machine = DarkDefense.createRunStateMachine();
  machine.send("START_RUN");
  machine.send("START_WAVE");
  machine.send("GAME_OVER");

  assert.equal(machine.getState().phase, "game_over");
  assert.equal(machine.send("START_WAVE").accepted, false);
  assert.equal(machine.send("START_RUN", { mode: "endless" }).accepted, true);
  assert.equal(machine.getState().mode, "endless");
});
