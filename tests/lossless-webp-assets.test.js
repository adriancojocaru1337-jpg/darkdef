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

function assertWebP(relativePath) {
  const buffer = fs.readFileSync(path.join(root, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", relativePath);
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", relativePath);
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "VP8L", `${relativePath} must use lossless encoding`);
}

test("all 58 audited runtime images have lossless WebP replacements", () => {
  const assets = [
    "assets/ui/world-map.webp",
    ...listFiles("assets/enemies", ".webp").map((name) => `assets/enemies/${name}`),
    ...listFiles("assets/enemies/animated", ".webp").map((name) => `assets/enemies/animated/${name}`),
    ...listFiles("assets/towers", ".webp").map((name) => `assets/towers/${name}`),
    ...listFiles("assets/guide", ".webp").map((name) => `assets/guide/${name}`)
  ];

  assert.equal(assets.length, 58);
  for (const asset of assets) assertWebP(asset);
});

test("the game and public pages load the optimized WebP runtime artwork", () => {
  assert.match(game, /assets\/enemies\/animated\/\$\{type\}_\$\{view\}_walk\.webp/);
  assert.match(game, /assets\/enemies\/animated\/boss\$\{stage\}_\$\{view\}_walk\.webp/);
  assert.match(game, /assets\/towers\/archer\.webp/);
  assert.doesNotMatch(game, /assets\/(?:enemies|towers)\/[^"'`]+\.png/);
  assert.match(index, /assets\/ui\/world-map\.webp/);
  assert.doesNotMatch(index, /assets\/(?:ui\/world-map|towers\/[^"]+)\.png/);
  assert.match(guide, /assets\/guide\/mob_normal\.webp/);
  assert.doesNotMatch(guide, /assets\/(?:guide|towers)\/[^"]+\.png/);
});
