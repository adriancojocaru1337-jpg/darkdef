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
  assert.match(index, /style\.css\?v=[0-9a-f]{10}/);
  assert.match(index, /game\.js\?v=[0-9a-f]{10}/);
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

test("Endless Mode sits beside Daily Challenge and unlocks after Act I", () => {
  assert.match(
    index,
    /id="dailyChallengeBtn"[\s\S]*id="headerEndlessBtn"[\s\S]*id="panelHeaderRunStatus"/
  );
  assert.match(index, /id="headerEndlessBtn"[^>]*disabled[^>]*aria-disabled="true"/);
  assert.match(index, /id="headerEndlessState">Clear Act I</);
  assert.match(game, /function refreshHeaderEndlessUI\(\)/);
  assert.match(game, /const canEnter = endlessUnlocked && !active/);
  assert.match(
    game,
    /if\(options\.unlockEndless\)\{[\s\S]*?endlessUnlocked = true;[\s\S]*?sdcEndlessUnlocked/
  );
  assert.match(game, /headerEndlessBtn\?\.addEventListener\("click"/);
  assert.match(game, /enterEndlessModeFromUnlock\(\)/);
  assert.match(styles, /\.endless-mode-btn\s*\{/);
  assert.match(styles, /\.endless-mode-btn:disabled\s*\{/);
});
