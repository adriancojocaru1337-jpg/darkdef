const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");
const heroSystemSource = fs.readFileSync(
  path.join(ROOT, "js", "systems", "hero-system.js"),
  "utf8"
);
const spritePath = path.join(ROOT, "assets", "ui", "varyn-battlefield-walk.webp");

globalThis.DarkDefense = {};
delete require.cache[require.resolve("../js/systems/hero-system.js")];
require("../js/systems/hero-system.js");

test("Varyn ships generated eight-direction walk and sword-attack art", () => {
  for(const relativePath of [
    "source-art/hero/varyn-battlefield-5view-turnaround.webp",
    "source-art/hero/varyn-battlefield-5view-alpha.webp",
    "source-art/hero/varyn-battlefield-5view-attack-v2-chroma.webp",
    "source-art/hero/varyn-battlefield-5view-attack-v2-alpha.webp",
    "tools/build-hero-sprite.py"
  ]) {
    assert.ok(fs.existsSync(path.join(ROOT, relativePath)), `${relativePath} is missing`);
  }
  assert.ok(fs.existsSync(spritePath), "runtime battlefield sprite is missing");

  const sprite = fs.readFileSync(spritePath);
  assert.equal(sprite.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(sprite.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(sprite.subarray(12, 16).toString("ascii"), "VP8L");
  assert.equal(sprite[20], 0x2f, "lossless WebP signature is missing");

  const dimensions = sprite.readUInt32LE(21);
  assert.equal((dimensions & 0x3fff) + 1, 2560);
  assert.equal(((dimensions >>> 14) & 0x3fff) + 1, 1280);
});

test("the game loads the smaller hero sheet and animates walk plus sword strikes", () => {
  assert.match(game, /heroBattlefieldSprite\.src = "assets\/ui\/varyn-battlefield-walk\.webp"/);
  assert.match(game, /spriteSheet: heroBattlefieldSprite/);
  assert.match(heroSystemSource, /HERO_WALK_FRAME_COUNT = 20/);
  assert.match(heroSystemSource, /HERO_ATTACK_FRAME_COUNT = 20/);
  assert.match(heroSystemSource, /HERO_SPRITE_ATTACK_ROW_OFFSET = 5/);
  assert.match(heroSystemSource, /frontQuarter: 1/);
  assert.match(heroSystemSource, /side: 2/);
  assert.match(heroSystemSource, /backQuarter: 3/);
  assert.match(heroSystemSource, /back: 4/);
  assert.match(heroSystemSource, /const drawSize = 46/);
  assert.match(heroSystemSource, /const walkLift = walking/);
  assert.match(heroSystemSource, /const walkDrift = walking/);
  assert.match(heroSystemSource, /const walkSway = walking/);
  assert.match(heroSystemSource, /const attackLunge = attacking/);
  assert.match(heroSystemSource, /const attackFrameIndex = attacking/);
  assert.match(heroSystemSource, /heroSpriteFacingAngle\(spriteFacing\)/);
  assert.match(heroSystemSource, /ctx\.arc\(0, 0, 19,/);
  assert.match(heroSystemSource, /ctx\.drawImage\(\s*spriteSheet,/);
  assert.match(heroSystemSource, /if \(spriteReady\)[\s\S]*?drawHeroHealthBar\(ctx, position, stats, -40\)/);
});

test("battlefield art selects all eight travel directions", () => {
  const selectFacing = DarkDefense.selectHeroSpriteFacing;
  assert.deepEqual(selectFacing(12, 1), { view: "side", flip: false });
  assert.deepEqual(selectFacing(-12, 1), { view: "side", flip: true });
  assert.deepEqual(selectFacing(1, 12), { view: "front", flip: false });
  assert.deepEqual(selectFacing(1, -12), { view: "back", flip: false });
  assert.deepEqual(selectFacing(12, 12), { view: "frontQuarter", flip: false });
  assert.deepEqual(selectFacing(-12, 12), { view: "frontQuarter", flip: true });
  assert.deepEqual(selectFacing(12, -12), { view: "backQuarter", flip: false });
  assert.deepEqual(selectFacing(-12, -12), { view: "backQuarter", flip: true });
});
