const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
const completionCss = fs.readFileSync(path.join(ROOT, "completion-screen.css"), "utf8");
const builder = fs.readFileSync(path.join(ROOT, "tools", "build-completion-art.py"), "utf8");

function assertLosslessWebP(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", relativePath);
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", relativePath);
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "VP8L", relativePath);
}

test("Act III teaser ships generated master and optimized runtime art", () => {
  const runtime = "assets/ui/act3-teaser.webp";
  const source = "source-art/completion-screens/act3-teaser.webp";
  assert.ok(fs.existsSync(path.join(ROOT, runtime)));
  assert.ok(fs.existsSync(path.join(ROOT, source)));
  assertLosslessWebP(runtime);
  assertLosslessWebP(source);
  assert.match(builder, /"act3-teaser\.webp": "act3-teaser\.webp"/);
});

test("the Stage 12 finale reveals a real Act III preview action", () => {
  assert.match(game, /artwork:"assets\/ui\/act3-teaser\.webp"/);
  assert.match(game, /title:"THE CROWN OF NIGHT"/);
  assert.match(game, /subtitle:"ACT III LIES BEYOND THE VEIL · COMING SOON"/);
  assert.match(index, /id="previewActThreeBtn"/);
  assert.match(game, /previewActThreeBtn\?\.addEventListener\("click"[\s\S]*?worldMapAct = 3;[\s\S]*?openWorldMap\(\)/);
  assert.match(completionCss, /#endlessUnlockOverlay\[data-completion-mode="act2"\][\s\S]*?--completion-accent:#a78bfa/);
});

test("Act III remains a non-playable teaser and appears only after Act II", () => {
  assert.match(game, /function hasCompletedActTwo\(\)/);
  assert.doesNotMatch(index, /worldMapActThreeBtn|worldMapActThreeDivider/);
  assert.match(game, /if\(worldMapAct === 3\)\{[\s\S]*?worldmap-act3-teaser[\s\S]*?Coming Soon[\s\S]*?return;/);
  assert.match(game, /3: "assets\/ui\/act3-teaser\.webp"/);
  assert.doesNotMatch(game, /data-worldmap-stage="13"/);
  assert.match(css, /\.worldmap-act3-teaser/);
  assert.match(css, /@media \(max-width:620px\)[\s\S]*?\.worldmap-act3-teaser/);
});
