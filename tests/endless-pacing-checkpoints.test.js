const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const game = read("game.js");
const submitScore = read("netlify/functions/submit-score.js");
const bonusBoard = read("netlify/functions/get-bonus-leaderboard.js");

/* Endless used to submit from exactly one place — the game-over branch. A run
   that ended any other way (closed tab, refresh, player just stopping) left the
   token 'active' and the score was never recorded. With runs regularly passing
   40 minutes that was the normal outcome, not the edge case. */

test("endless banks progress during the run, not only on death", () => {
  assert.match(game, /function maybeCheckpointEndlessRun\(\)/);
  // Hooked into the wave-cleared path, not just game over.
  const waveCleared = game.slice(game.indexOf("runStateMachine.send(\"WAVE_CLEARED\""));
  assert.match(waveCleared.slice(0, 1200), /maybeCheckpointEndlessRun\(\);/);
});

test("a checkpoint keeps the run token instead of retiring it", () => {
  const fn = game.match(/async function submitBonusLeaderboardScore\([\s\S]*?\n\}/)[0];
  // retireLeaderboardRun must be reachable only on the completed branch.
  const retireIndex = fn.indexOf("retireLeaderboardRun");
  const branchIndex = fn.indexOf("if(runComplete){");
  assert.ok(branchIndex !== -1, "missing runComplete branch");
  assert.ok(retireIndex > branchIndex, "token is retired before the runComplete check");
});

test("checkpoints never fire on wave 1, which the server rejects", () => {
  const fn = game.match(/function maybeCheckpointEndlessRun\([\s\S]*?\n\}/)[0];
  assert.match(fn, /if\(stageWave < 2\) return;/);
});

test("a daily run never checkpoints to the endless board", () => {
  const fn = game.match(/function maybeCheckpointEndlessRun\([\s\S]*?\n\}/)[0];
  assert.match(fn, /dailyChallengeActive/);
  const submit = game.match(/async function submitBonusLeaderboardScore\([\s\S]*?\n\}/)[0];
  assert.match(submit, /if\(dailyChallengeActive\) return;/);
});

test("the server keeps a checkpointed run active and upserts its row", () => {
  assert.match(submitScore, /const isCheckpoint = body\.runComplete === false && run\.mode === "endless"/);
  assert.match(submitScore, /status = \$\{isCheckpoint \? "active" : "submitted"\}/);
  // One row per run, updated in place — not a new row per checkpoint.
  assert.match(submitScore, /on conflict \(run_id\) do update set/);
});

test("checkpoints are rate limited so a run can't spam the endpoint", () => {
  assert.match(submitScore, /Checkpoint too soon/);
  assert.match(submitScore, /sinceLastMs < 45_000/);
});

test("the endless board returns and renders more than one entry", () => {
  assert.doesNotMatch(bonusBoard, /limit 5\b/);
  assert.match(bonusBoard, /limit 10/);
  // The client used to render rows.slice(0,1) — only the record holder.
  assert.doesNotMatch(game, /bonusLeaderboardList\.innerHTML = rows\.slice\(0,1\)/);
});

/* Endless added two enemies per wave forever at a fixed 0.68s spawn interval,
   so run length grew quadratically: wave 100 was ~125 minutes of spawning. */

test("the spawn interval tapers in endless", () => {
  assert.match(game, /function spawnIntervalForWave\(/);
  assert.match(game, /if\(spawnTimer>=spawnIntervalForWave\(\)\)/);
});

test("campaign and daily keep the original spawn pacing", () => {
  const fn = game.match(/function spawnIntervalForWave\([\s\S]*?\n\}/)[0];
  assert.match(fn, /if\(currentMode !== "endless" \|\| dailyChallengeActive\) return SPAWN_INTERVAL_BASE;/);
});

test("the taper is monotonic and bounded", () => {
  const base = Number(game.match(/SPAWN_INTERVAL_BASE = ([\d.]+)/)[1]);
  const floor = Number(game.match(/SPAWN_INTERVAL_FLOOR = ([\d.]+)/)[1]);
  const first = Number(game.match(/SPAWN_TAPER_FIRST_WAVE = (\d+)/)[1]);
  const last = Number(game.match(/SPAWN_TAPER_LAST_WAVE = (\d+)/)[1]);
  assert.ok(floor < base, "floor must be faster than the base interval");
  assert.ok(first < last, "taper window must be non-empty");

  const interval = (w) => {
    if (w <= first) return base;
    return base + (floor - base) * Math.min(1, (w - first) / (last - first));
  };
  let previous = Infinity;
  for (let w = 1; w <= 120; w++) {
    const value = interval(w);
    assert.ok(value <= previous + 1e-9, `interval increased at wave ${w}`);
    assert.ok(value >= floor - 1e-9, `interval fell below the floor at wave ${w}`);
    previous = value;
  }
  assert.equal(interval(1), base);
  assert.equal(interval(last + 50), floor);
});
