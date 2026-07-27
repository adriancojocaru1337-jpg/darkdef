const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "style.css"), "utf8");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");

test("the battlefield uses a three-zone War Council command bar", () => {
  assert.match(index, /class="panel-header war-council-header"/);
  assert.match(index, /id="panelHeaderRegionName"/);
  assert.match(index, /id="panelHeaderRunStatus"/);
  assert.match(index, /id="panelHeaderRunMode"/);
  assert.match(index, /id="panelHeaderRunState"/);
  assert.match(index, /id="panelHeaderRunProgress"/);
  assert.match(index, /id="panelHeaderUserValue">Sign in</);
  assert.match(index, /style\.css\?v=r12/);
  assert.match(index, /game\.js\?v=r98/);
});

test("the command bar updates live state and has responsive themed styling", () => {
  assert.match(game, /function updateBattlefieldHeader\(\)/);
  assert.match(game, /PANEL_HEADER_RUN_STATES/);
  assert.match(game, /stateLabel = "Paused"/);
  assert.match(game, /stateLabel = "Battle"/);
  assert.match(game, /stateLabel = "War Map"/);
  assert.match(game, /panelHeaderRunStatus\.classList\.add\(stateClass\)/);
  assert.match(styles, /\.war-council-header\s*\{/);
  assert.match(styles, /grid-template-columns:minmax\(410px,auto\) minmax\(180px,1fr\) auto/);
  assert.match(styles, /\.panel-header-run-status\.is-battle/);
  assert.match(styles, /@media \(max-width:900px\)\{[\s\S]*\.war-council-header/);
});
