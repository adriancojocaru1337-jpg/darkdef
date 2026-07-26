const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const styles = fs.readFileSync(path.join(root, "style.css"), "utf8");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("the resume dialog uses a layered heraldic iron-and-bronze frame", () => {
  assert.match(styles, /\.resume-card::before\s*\{/);
  assert.match(styles, /\.resume-card::after\s*\{/);
  assert.match(styles, /content:"✦"/);
  assert.match(styles, /rgba\(218,166,88,.72\)/);
  assert.match(styles, /\.resume-btn-main\{[\s\S]*#f0d18c[\s\S]*#9b6428/);
  assert.match(index, /style\.css\?v=r11/);
});

test("the canvas preparation banner uses matching forged corners and bronze ornament", () => {
  assert.match(game, /function drawPrepareCorner\(/);
  assert.match(game, /const prepareFrameGradient = ctx\.createLinearGradient/);
  assert.match(game, /drawPrepareCorner\(-w\/2 \+ 14/);
  assert.match(game, /ctx\.fillText\("✦  BUILD PHASE  ✦"/);
  assert.match(index, /game\.js\?v=r96/);
});
