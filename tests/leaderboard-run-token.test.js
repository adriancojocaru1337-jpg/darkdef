const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");

/* These guard the defect that produced daily/endless runs whose started_at and
   submitted_at were half a second apart:

   1. submit cleared `leaderboardRun` unconditionally, wiping a token a
      concurrent prewarm had just stored;
   2. nothing minted a replacement, so `ensureLeaderboardRun` created the token
      at the moment the player died;
   3. the server then rejected the run — correctly — because it had never seen
      it start. */

test("no submit path clears the run token by blind reassignment", () => {
  // The `let` declaration at the top is the initial state, not a clear.
  const blindClears = source.match(
    /(?<!let )leaderboardRun = \{ runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:"(campaign|daily|endless)" \}/g
  ) || [];
  assert.equal(
    blindClears.length,
    0,
    `found ${blindClears.length} blind clear(s): ${blindClears.join(" | ")}`
  );
});

test("all three submit paths retire their token by id", () => {
  for (const mode of ["campaign", "daily", "endless"]) {
    assert.match(source, new RegExp(`retireLeaderboardRun\\(submittedRunId, "${mode}"\\)`));
  }
  // The id has to be captured before the POST, not read back afterwards.
  const captures = source.match(/const submittedRunId = leaderboardRun\.runId;/g) || [];
  assert.equal(captures.length, 3);
});

test("retiring a token only drops the one that was submitted", () => {
  const fn = source.match(/function retireLeaderboardRun\([\s\S]*?\n\}/)[0];
  assert.match(fn, /submittedRunId && leaderboardRun\.runId !== submittedRunId\) return;/);
  assert.match(fn, /prewarmLeaderboardRun\(mode\)/);
});

test("a stale start-run response cannot overwrite a newer token", () => {
  const fn = source.match(/async function requestLeaderboardRun\([\s\S]*?\n\}/)[0];
  assert.match(fn, /const generation = \+\+leaderboardRunGeneration;/);
  assert.match(fn, /if\(generation === leaderboardRunGeneration\) leaderboardRun = minted;/);
});

test("the first wave of a run guarantees a token exists", () => {
  const fn = source.match(/function startWave\([\s\S]*?\n  ensureAudio\(\);/)[0];
  assert.match(fn, /if\(!leaderboardRun\.runId && !leaderboardRunPromise\) prewarmLeaderboardRun\(\);/);
});

test("a daily challenge reports the daily board, not endless", () => {
  const fn = source.match(/function currentLeaderboardMode\([\s\S]*?\n\}/)[0];
  // currentMode is "endless" during a daily, so dailyChallengeActive must win.
  assert.match(fn, /if\(dailyChallengeActive\) return "daily";/);
  assert.ok(fn.indexOf('"daily"') < fn.indexOf('"endless"'));
});
