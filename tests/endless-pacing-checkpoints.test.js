const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const game = read("game.js");
const index = read("index.html");
const styles = read("style.css");
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

test("the Endless endpoint keeps its full board while the homepage renders only its champion", () => {
  assert.doesNotMatch(bonusBoard, /limit 5\b/);
  assert.match(bonusBoard, /limit 10/);
  const homepageBanner = game.match(
    /async function loadBonusLeaderboard\(\)[\s\S]*?async function submitStoryLeaderboardScore/
  )?.[0] || "";
  assert.match(homepageBanner, /const champion = rows\[0\]/);
  assert.match(homepageBanner, /<div class="leaderboard-rank">👑<\/div>/);
  assert.doesNotMatch(homepageBanner, /rows\.map\(/);
  assert.doesNotMatch(homepageBanner, /leaderboard-row-you/);
  assert.match(index, /<h3>Endless Champion<\/h3>/);
  assert.doesNotMatch(index, /Endless<br\s*\/?>Champion/);
  assert.match(styles, /\.hero-actions-leaderboard\{[\s\S]*?width:min\(100%, 332px\);[\s\S]*?align-self:center/);
  assert.match(styles, /\.hero-champion-card\{[\s\S]*?height:auto;[\s\S]*?padding:11px 15px 13px/);
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

/* v0.9.9 — ranking metric, own placement, and boot token litter. */

test("endless ranks by depth, with bonus only as the tiebreaker", () => {
  const board = read("netlify/functions/get-bonus-leaderboard.js");
  // Every ORDER BY over the board must lead with wave_reached.
  const orderings = board.match(/order by [^\n`]*(?:desc|asc)/g) || [];
  assert.ok(orderings.length >= 3, "expected the board and placement orderings");
  for (const ordering of orderings) {
    if (!/wave_reached|bonus_score/.test(ordering)) continue;
    assert.match(
      ordering,
      /order by (?:ls\.)?wave_reached desc, (?:ls\.)?bonus_score desc/,
      `bonus still outranks depth in: ${ordering}`
    );
  }
});

test("the board reports the caller's own placement", () => {
  const board = read("netlify/functions/get-bonus-leaderboard.js");
  assert.match(board, /queryStringParameters\?\.player/);
  assert.match(board, /rank\(\) over \(order by wave_reached desc/);
  assert.match(board, /JSON\.stringify\(\{ rows, you, total \}\)/);
});

test("the client survives both the old array and the new object shape", () => {
  const client = read("game.js");
  assert.match(client, /Array\.isArray\(payload\) \? payload : \(payload\?\.rows \|\| \[\]\)/);
});

test("no run token is minted at page load", () => {
  const client = read("game.js");
  // The boot sequence must not prewarm; startWave() covers it instead.
  const boot = client.slice(client.indexOf("loadPanelUserSession();"));
  const bootTail = boot.slice(0, 600);
  assert.doesNotMatch(bootTail, /prewarmLeaderboardRun\("campaign"\);/);
  assert.match(client, /if\(!leaderboardRun\.runId && !leaderboardRunPromise\) prewarmLeaderboardRun\(\);/);
});
