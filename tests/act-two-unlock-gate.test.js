const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");

function unlockHarness(values = {}, endless = false) {
  const start = game.indexOf("function hasCompletedActOne()");
  const end = game.indexOf("// Hotspot positions on each world-map image", start);
  assert.ok(start >= 0 && end > start, "world-map unlock functions could not be extracted");
  const unlockSource = game.slice(start, end);
  const storage = new Map(Object.entries(values).map(([key, value]) => [key, String(value)]));
  const context = {
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(`
    const ACT_ONE_FINAL_STAGE = 6;
    const CAMPAIGN_FINAL_STAGE = 12;
    let endlessUnlocked = ${endless};
    ${unlockSource}
    globalThis.unlockApi = {
      hasCompletedActOne,
      highestUnlockedStage,
      isStageUnlocked,
      isStageCleared
    };
  `, context);
  return context.unlockApi;
}

test("Stage 7 stays locked until Stage 6 has completed", () => {
  const fresh = unlockHarness({ sdcFurthestStage: 1 });
  assert.equal(fresh.isStageUnlocked(1), true);
  assert.equal(fresh.isStageUnlocked(7), false);

  const atFinale = unlockHarness({ sdcFurthestStage: 6 });
  assert.equal(atFinale.isStageUnlocked(6), true);
  assert.equal(atFinale.isStageUnlocked(7), false);
  assert.equal(atFinale.isStageCleared(7), false);
});

test("the persistent Act I completion flag permanently opens Stage 7", () => {
  const completed = unlockHarness({
    sdcFurthestStage: 6,
    sdcEndlessUnlocked: 1
  });
  assert.equal(completed.hasCompletedActOne(), true);
  assert.equal(completed.highestUnlockedStage(), 7);
  assert.equal(completed.isStageUnlocked(7), true);
  assert.equal(completed.isStageUnlocked(8), false);

  const progressed = unlockHarness({
    sdcFurthestStage: 8,
    sdcEndlessUnlocked: 1
  });
  assert.equal(progressed.isStageUnlocked(8), true);
});

test("legacy Act II entry points cannot bypass the completion gate", () => {
  assert.match(
    game,
    /save\.mode !== "endless" && save\.stage > ACT_ONE_FINAL_STAGE && !hasCompletedActOne\(\)/
  );
  assert.match(
    game,
    /function playStageFromMap\(stage\)\{\s*if\(!isStageUnlocked\(stage\)\)/
  );
  assert.doesNotMatch(
    game,
    /if\(stage === 1 \|\| stage === ACT_ONE_FINAL_STAGE \+ 1\) return true/
  );
});
