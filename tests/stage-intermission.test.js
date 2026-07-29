const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "stage-intermission.css"), "utf8");

test("stage debrief and reserve management have a real responsive dialog", () => {
  for(const id of [
    "stageIntermissionOverlay",
    "stageDebriefPane",
    "stageDebriefRewards",
    "stageAttritionList",
    "stageReservePane",
    "stageReserveList",
    "stageIntermissionContinueBtn"
  ]) {
    assert.match(index, new RegExp(`id="${id}"`));
  }
  assert.match(index, /stage-intermission\.css/);
  assert.match(css, /\.stage-debrief-rewards/);
  assert.match(css, /\.stage-reserve-unit\.is-first/);
  assert.match(css, /@media \(max-width:760px\)/);
});

test("every campaign branch opens the intermission after one attrition pass", () => {
  for(const type of ["campaign-next-stage", "act2-start", "act2-complete"]) {
    const start = game.indexOf(`resolution.type === "${type}"`);
    assert.notEqual(start, -1, `${type} branch missing`);
    const end = game.indexOf("return;", start);
    const branch = game.slice(start, end);
    assert.match(branch, /moveUnitsToReserve\(\{ degradeLevels:1, notify:true \}\)/);
    assert.match(branch, /beginStageIntermission\(\{/);
  }
  assert.match(game, /completeStageIntermission[\s\S]*?transitionToCampaignStage\([\s\S]*?applyAttrition:false/);
});

test("intermission phase and reserve priority survive run saves", () => {
  assert.match(game, /stageIntermission: pendingStageIntermission/);
  assert.match(game, /save\.stageIntermission/);
  assert.match(game, /if\(pendingStageIntermission\)\{[\s\S]*?showStageIntermission/);
  assert.match(game, /moveReserveUnit\(reservePool, type, fromIndex, toIndex\)/);
  assert.match(game, /function takeReservedUnit[\s\S]*?reservePool\[typeKey\]\.shift\(\)/);
});

test("native fullscreen adopts the intermission overlay", () => {
  const fullscreenIds = game.match(/const FULLSCREEN_OVERLAY_IDS = \[[\s\S]*?\];/)?.[0] || "";
  assert.match(fullscreenIds, /stageIntermissionOverlay/);
});
