const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "completion-screen.css"), "utf8");

function assertLosslessWebP(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "VP8L");
}

test("Act I and Act II use dedicated text-free completion backgrounds", () => {
  for(const asset of [
    "assets/ui/act1-complete-background.webp",
    "assets/ui/act2-complete-background.webp"
  ]) {
    assert.ok(fs.existsSync(path.join(ROOT, asset)), `${asset} is missing`);
    assertLosslessWebP(asset);
    assert.match(game, new RegExp(asset.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(index, /assets\/ui\/endless-unlocked\.(?:jpg|webp)/);
});

test("the completion choices are real responsive controls, not image hitboxes", () => {
  for(const id of ["continueActTwoBtn", "enterEndlessBtn", "backToMenuFromEndlessBtn"]) {
    assert.match(index, new RegExp(`<button[^>]+id="${id}"`));
  }
  assert.match(index, /id="campaignCompleteTitle"/);
  assert.match(index, /id="campaignCompleteSubtitle"/);
  assert.match(css, /\.campaign-complete-actions/);
  assert.match(css, /@media \(max-width:620px\)/);
  assert.doesNotMatch(index, /artwork-hitbox/);
});

test("Act I pauses for debrief and reserve management before its choices", () => {
  const branch = game.match(
    /resolution\.type === "act2-start"[\s\S]*?return;\s*\} else if\(resolution\.type === "act2-complete"/
  )?.[0] || "";
  assert.match(branch, /moveUnitsToReserve\(\{ degradeLevels:1, notify:true \}\)/);
  assert.match(branch, /beginStageIntermission\(\{/);
  assert.match(branch, /STAGE_INTERMISSION_DESTINATIONS\.ACT_ONE_COMPLETE/);
  assert.doesNotMatch(branch, /transitionToCampaignStage\(nextStage/);
  assert.match(game, /completeStageIntermission[\s\S]*?showCampaignCompletionOverlay\("act1"/);
  assert.match(game, /continueActTwoBtn[\s\S]*?transitionToCampaignStage\([\s\S]*?applyAttrition:false/);
});

test("Act II displays its own final state and hides the Act II continuation", () => {
  assert.match(game, /showCampaignCompletionOverlay\("act2"/);
  assert.match(game, /continueActTwoBtn\?\.classList\.toggle\("hidden", campaignCompletionMode !== "act1"\)/);
  assert.match(game, /THE FIELD OF DAWN HOLDS/);
  assert.match(game, /CAMPAIGN COMPLETE/);
});

test("an unfinished completion choice survives save and resume", () => {
  assert.match(game, /campaignCompletion: campaignCompletionMode/);
  assert.match(game, /save\.campaignCompletion\?\.mode/);
  assert.match(game, /if\(campaignCompletionMode\)\{[\s\S]*?showCampaignCompletionOverlay/);
});
