const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const guide = fs.readFileSync(path.join(root, "guide.html"), "utf8");

function listFiles(directory, extension) {
  return fs.readdirSync(path.join(root, directory))
    .filter((name) => name.endsWith(extension))
    .sort();
}

function assertWebP(relativePath, requireLossless = true) {
  const buffer = fs.readFileSync(path.join(root, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", relativePath);
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", relativePath);
  const chunk = buffer.subarray(12, 16).toString("ascii");
  assert.ok(["VP8 ", "VP8L", "VP8X"].includes(chunk), `${relativePath} has an invalid WebP payload`);
  if (requireLossless) {
    assert.equal(chunk, "VP8L", `${relativePath} must use lossless encoding`);
  }
}

test("all 102 transparency-sensitive runtime images use lossless WebP", () => {
  const assets = [
    "assets/ui/world-map.webp",
    "assets/ui/world-map-act2.webp",
    "assets/ui/act1-complete-background.webp",
    "assets/ui/act2-complete-background.webp",
    "assets/ui/act3-teaser.webp",
    "assets/ui/act1-emblem.webp",
    "assets/ui/act2-emblem.webp",
    "assets/ui/varyn-portrait.webp",
    "assets/ui/varyn-battlefield-walk.webp",
    ...listFiles("assets2/enemies", ".webp").map((name) => `assets2/enemies/${name}`),
    ...listFiles("assets2/enemies/animated", ".webp").map((name) => `assets2/enemies/animated/${name}`),
    ...listFiles("assets/towers", ".webp").map((name) => `assets/towers/${name}`),
    ...listFiles("assets2/guide", ".webp").map((name) => `assets2/guide/${name}`)
  ];

  assert.equal(assets.length, 102);
  for (const asset of assets) assertWebP(asset);
});

test("all 21 painted runtime backgrounds and portraits use compact WebP", () => {
  const assets = [
    ...Array.from({ length: 12 }, (_, index) => `assets/terrain/ground_${index + 1}.webp`),
    "assets/ui/dark-defense-defeat.webp",
    ...Array.from({ length: 6 }, (_, index) => `assets/ui/boss-stage${index + 1}.webp`),
    "assets/ui/boss-defeat-campaign.webp",
    "assets/ui/boss-defeat-endless.webp"
  ];
  assert.equal(assets.length, 21);
  for (const asset of assets) assertWebP(asset, false);
});

test("the game and public pages load the optimized WebP runtime artwork", () => {
  assert.match(game, /assets2\/enemies\/animated\/\$\{type\}_\$\{view\}_walk\.webp/);
  assert.match(game, /assets2\/enemies\/animated\/boss\$\{stage\}_\$\{view\}_walk\.webp/);
  assert.match(game, /assets\/towers\/archer\.webp/);
  assert.match(game, /assets\/terrain\/ground_\$\{stage\}\.webp/);
  assert.doesNotMatch(game, /assets2?\/(?:enemies|towers)\/[^"'`]+\.png/);
  assert.match(index, /assets\/ui\/world-map\.webp/);
  assert.doesNotMatch(index, /assets\/(?:ui\/world-map|towers\/[^"]+)\.png/);
  assert.match(game, /assets\/ui\/world-map-act2\.webp/);
  assert.doesNotMatch(game, /assets\/ui\/[^"'`]+\.jpe?g/);
  assert.doesNotMatch(index, /assets\/ui\/[^"'`]+\.jpe?g/);
  assert.match(guide, /assets2\/guide\/mob_normal\.webp/);
  assert.doesNotMatch(guide, /assets2?\/(?:guide|towers)\/[^"]+\.(?:png|jpe?g)/);
});
