const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const game = read("game.js");
const submitScore = read("netlify/functions/submit-score.js");
const boards = read("netlify/functions/get-leaderboards.js");
const page = read("leaderboards.html");

test("Story submits at act boundaries instead of exhausting the limit every stage", () => {
  const grant = game.slice(
    game.indexOf("function grantCampaignStageClear"),
    game.indexOf("function transitionToCampaignStage")
  );
  assert.match(grant, /options\.runComplete === true \|\| clearedStage === ACT_ONE_FINAL_STAGE/);
  assert.equal((grant.match(/submitStoryLeaderboardScore\(/g) || []).length, 1);
});

test("Act I is a campaign checkpoint and Act II closes the same run", () => {
  assert.match(submitScore, /const isCampaignCheckpoint = body\.runComplete === false && run\.mode === "campaign"/);
  assert.match(submitScore, /const isCheckpoint = isEndlessCheckpoint \|\| isCampaignCheckpoint/);
  const submit = game.match(/async function submitStoryLeaderboardScore\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(submit, /if\(runComplete\)\{[\s\S]*?retireLeaderboardRun\(submittedRunId, "campaign"\)/);
  assert.match(submit, /Story progress saved/);
});

test("campaign transitions preserve the token and x3 wall-clock start time", () => {
  const transition = game.match(/function transitionToCampaignStage\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(transition, /if\(!hasValidLeaderboardRun\("campaign"\) && !leaderboardRunPromise\)/);
  const startWave = game.match(/function startWave\([\s\S]*?\n  ensureAudio\(\);/)?.[0] || "";
  assert.match(startWave, /!hasValidLeaderboardRun\(currentLeaderboardMode\(\)\)/);
  assert.match(submitScore, /estimatedMinRuntimeMs\(waveReached, killsCount\)/);
});

test("only endless checkpoints use the 45-second write throttle", () => {
  const throttle = submitScore.slice(
    submitScore.indexOf("// Without a counter column"),
    submitScore.indexOf("const committed")
  );
  assert.match(throttle, /if \(isEndlessCheckpoint\)/);
  assert.doesNotMatch(throttle, /if \(isCheckpoint\)/);
});

test("signed-in players receive their global Story rank outside the Top 10", () => {
  assert.match(boards, /getSessionUser\(event\)/);
  assert.match(boards, /global_rank/);
  assert.match(boards, /JSON\.stringify\(\{ endless: endlessRows, story: storyRows, own \}\)/);
  assert.match(page, /own\.story \|\| null/);
  assert.match(page, /rk-personal-divider/);
  assert.match(page, /Your rank/);
});
