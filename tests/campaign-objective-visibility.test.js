const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");

test("the Act II objective banner stays hidden on Act I stages", () => {
  assert.match(index, /class="campaign-objective hidden" id="campaignObjective"/);
  assert.match(css, /\.campaign-objective\.hidden\s*\{\s*display:none;\s*\}/);

  const componentRule = css.indexOf(".campaign-objective{");
  const hiddenOverride = css.indexOf(".campaign-objective.hidden{");
  assert.ok(componentRule >= 0 && hiddenOverride > componentRule);

  assert.match(
    game,
    /if\(!campaignObjective \|\| !objective\)\{\s*campaignObjective\?\.classList\.add\("hidden"\)/
  );
  assert.match(game, /campaignObjective\.classList\.remove\("hidden"\)/);
});
