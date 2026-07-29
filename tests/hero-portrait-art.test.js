const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const portraitPath = path.join(ROOT, "assets", "ui", "varyn-portrait.webp");

test("Varyn has a generated lossless runtime portrait and preserved source master", () => {
  assert.ok(fs.existsSync(portraitPath), "runtime hero portrait is missing");
  assert.ok(fs.existsSync(path.join(ROOT, "source-art", "hero", "varyn-portrait-source.webp")));
  assert.ok(fs.existsSync(path.join(ROOT, "tools", "build-hero-art.py")));

  const portrait = fs.readFileSync(portraitPath);
  assert.equal(portrait.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(portrait.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(portrait.subarray(12, 16).toString("ascii"), "VP8L");
});

test("the hero portrait is integrated in both the battle HUD and Skill Tree", () => {
  assert.equal((index.match(/assets\/ui\/varyn-portrait\.webp/g) || []).length, 2);
  assert.match(index, /class="hero-skills-portrait"[\s\S]*?varyn-portrait\.webp/);
  assert.match(index, /class="hero-portrait"[\s\S]*?varyn-portrait\.webp/);
  assert.doesNotMatch(index, /class="hero-portrait"[^>]*>\s*&#9876;/);
});

test("hero artwork remains readable, responsive and compatible with custom names", () => {
  assert.match(css, /\.hero-portrait img\{[\s\S]*?object-fit:cover/);
  assert.match(css, /\.hero-skills-portrait\{[\s\S]*?clip-path:polygon/);
  assert.match(css, /@media \(max-width:430px\)\{[\s\S]*?\.hero-skills-portrait/);
  assert.match(index, /id="heroSkillIdentityName">Varyn<\/span>/);
  assert.match(game, /heroSkillIdentityName\.textContent = getHeroName\(\)/);
});
