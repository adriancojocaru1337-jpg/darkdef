const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/run-rng.js");

test("same seed produces the same gameplay sequence", () => {
  const first = DarkDefense.createRunRng("daily:2026-07-24");
  const second = DarkDefense.createRunRng("daily:2026-07-24");

  const firstSequence = Array.from({ length: 8 }, () => first.next());
  const secondSequence = Array.from({ length: 8 }, () => second.next());

  assert.deepEqual(firstSequence, secondSequence);
});

test("snapshot continues from the exact next draw", () => {
  const rng = DarkDefense.createRunRng("campaign:test");
  rng.next();
  rng.int(2, 9);
  const snapshot = rng.getSnapshot();
  const expected = [rng.next(), rng.next(), rng.int(1, 20)];
  const restored = DarkDefense.createRunRng(snapshot);

  assert.deepEqual([restored.next(), restored.next(), restored.int(1, 20)], expected);
  assert.equal(restored.seed, "campaign:test");
});

test("deterministic shuffle does not mutate the source array", () => {
  const source = ["a", "b", "c", "d", "e"];
  const one = DarkDefense.createRunRng("loot").shuffle(source);
  const two = DarkDefense.createRunRng("loot").shuffle(source);

  assert.deepEqual(one, two);
  assert.deepEqual(source, ["a", "b", "c", "d", "e"]);
});
