const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const game = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");

test("Act II bosses join Endless at wave 20", () => {
  assert.match(
    game,
    /const ENDLESS_BOSS_STAGE_IDS = Object\.freeze\(\[1,2,3,4,5,6,7,8,9,10,11,12\]\)/
  );
  assert.match(game, /const ENDLESS_BOSS_ACT_TWO_UNLOCK_WAVE = 20/);
  const eligibility = game.match(/function getEndlessBossStageIds\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(eligibility, /waveNumber >= ENDLESS_BOSS_ACT_TWO_UNLOCK_WAVE/);
  assert.match(eligibility, /ENDLESS_ACT_ONE_BOSS_STAGE_IDS/);
  assert.match(game, /const ids = \[\.\.\.getEndlessBossStageIds\(\)\]/);
});

test("Act II special mobs enter Endless progressively", () => {
  const weights = game.match(/function getEndlessActTwoSpecialWeights\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(weights, /if\(waveNumber <= 10\) return null/);
  assert.match(weights, /cinder_skirmisher:\.08/);
  assert.match(weights, /hollow_binder:waveNumber >= 21 \? \.06 : 0/);
  assert.match(weights, /ley_revenant:waveNumber >= 31 \? \.05 : 0/);

  const spawner = game.match(/function enemyTemplateForSpawn\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(spawner, /currentMode === "endless"[\s\S]*getEndlessActTwoSpecialWeights\(stageWave\)/);
});

test("Endless special weights preserve the original base-enemy mix", () => {
  const spawner = game.match(/function enemyTemplateForSpawn\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(spawner, /roll = \(roll - cursor\) \/ Math\.max\(\.0001, 1 - cursor\)/);
});
