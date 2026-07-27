const test = require("node:test");
const assert = require("node:assert/strict");

const {
  estimatedMinRuntimeMs,
  MAX_GAME_SPEED,
  ABSOLUTE_FLOOR_MS
} = require("../netlify/functions/run-pacing");

// Endless on stage 6 spawns 11 + 2*(n-1) enemies per wave, plus splitter
// fragments. This mirrors the kill totals a real run reaches.
function endlessKillsThroughWave(wave) {
  let total = 0;
  for (let n = 1; n <= wave; n++) total += 11 + 2 * (n - 1);
  return Math.round(total * 1.15);
}

test("never demands more than a short floor for a run that ended immediately", () => {
  assert.equal(estimatedMinRuntimeMs(1, 0), ABSOLUTE_FLOOR_MS);
  assert.equal(estimatedMinRuntimeMs(2, 3), ABSOLUTE_FLOOR_MS);
});

test("waves and kills are not double counted", () => {
  // 10 waves and 240 kills: the old floor summed both (120s + 60s = 180s).
  // The kills happen during the waves, so the wave estimate alone governs.
  assert.equal(estimatedMinRuntimeMs(10, 240), Math.floor(10 * 12_000 / MAX_GAME_SPEED));
});

test("a wave-30 endless run at x3 speed is accepted", () => {
  const kills = endlessKillsThroughWave(30);
  const required = estimatedMinRuntimeMs(30, kills);
  // 30 waves at x3 is roughly 7 real seconds of combat per wave plus build
  // time between waves — call it 5 minutes of wall clock.
  const realisticElapsedMs = 5 * 60 * 1000;
  assert.ok(
    required <= realisticElapsedMs,
    `wave 30 / ${kills} kills required ${(required / 60000).toFixed(1)} min`
  );
});

test("a wave-50 endless run at x3 speed is accepted", () => {
  const kills = endlessKillsThroughWave(50);
  const required = estimatedMinRuntimeMs(50, kills);
  assert.ok(
    required <= 12 * 60 * 1000,
    `wave 50 / ${kills} kills required ${(required / 60000).toFixed(1)} min`
  );
});

test("still rejects an impossible claim", () => {
  // A script posting wave 400 seconds after start-run.
  const required = estimatedMinRuntimeMs(400, 20_000);
  assert.ok(required > 20 * 60 * 1000);
  assert.ok(30_000 < required);
});

test("scales linearly with the fastest selectable speed", () => {
  assert.equal(estimatedMinRuntimeMs(100, 0), Math.floor(100 * 12_000 / MAX_GAME_SPEED));
});
