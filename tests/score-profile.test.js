const test = require("node:test");
const assert = require("node:assert/strict");

const { getProfileContribution } = require("../netlify/functions/score-profile");

test("intermediate campaign submissions update depth without double-counting a run", () => {
  assert.deepEqual(getProfileContribution({
    mode: "campaign",
    waveReached: 3,
    killsCount: 180,
    bonus: 400,
    runComplete: false
  }), {
    bestEndlessScore: 0,
    bestStoryStage: 3,
    lifetimeKills: 0,
    lifetimeRuns: 0
  });
});

test("completed runs contribute lifetime kills exactly once", () => {
  assert.deepEqual(getProfileContribution({
    mode: "campaign",
    waveReached: 4,
    killsCount: 240,
    bonus: 500,
    runComplete: true
  }), {
    bestEndlessScore: 0,
    bestStoryStage: 4,
    lifetimeKills: 240,
    lifetimeRuns: 1
  });

  assert.deepEqual(getProfileContribution({
    mode: "endless",
    waveReached: 12,
    killsCount: 320,
    bonus: 900,
    runComplete: undefined
  }), {
    bestEndlessScore: 900,
    bestStoryStage: 1,
    lifetimeKills: 320,
    lifetimeRuns: 1
  });
});
