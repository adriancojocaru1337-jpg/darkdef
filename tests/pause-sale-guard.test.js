const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("the tower sell control is disabled and explained while paused", () => {
  assert.match(game, /towerSellBtn\.disabled\s*=\s*isPaused/);
  assert.match(game, /Resume the game before selling towers\./);
  assert.match(index, /id="towerSellBtn"/);
});

test("the sell action itself rejects attempts made while paused", () => {
  const sellAction = game.match(/function sellSelectedUnit\(\)\{([\s\S]*?)\n\}/);
  assert.ok(sellAction, "sellSelectedUnit should exist");
  assert.match(sellAction[1], /if\(isPaused\)\{\s*setMessage\("You cannot sell towers while paused\. Resume first\."\);\s*return;\s*\}/);
  assert.ok(
    sellAction[1].indexOf("if(isPaused)") < sellAction[1].indexOf("money += refund"),
    "the pause guard must run before any refund is applied"
  );
});
