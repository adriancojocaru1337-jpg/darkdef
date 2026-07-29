const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");

function assertLosslessWebP(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "VP8L");
}

test("each campaign act has an original lossless heraldic emblem", () => {
  for(const asset of ["assets/ui/act1-emblem.webp", "assets/ui/act2-emblem.webp"]) {
    assert.ok(fs.existsSync(path.join(ROOT, asset)), `${asset} is missing`);
    assertLosslessWebP(asset);
    assert.match(index, new RegExp(asset.replaceAll("/", "\\/")));
  }
});

test("act selectors use illustrated accessible button content", () => {
  assert.match(index, /id="worldMapActOneBtn"[\s\S]*?act-switch-emblem[\s\S]*?act1-emblem\.webp/);
  assert.match(index, /id="worldMapActTwoBtn"[\s\S]*?act-switch-emblem[\s\S]*?act2-emblem\.webp/);
  assert.match(index, /<strong>Act I<\/strong>/);
  assert.match(index, /<strong>Act II<\/strong>/);
  assert.match(game, /worldMapActOneBtn\?\.setAttribute\("aria-pressed"/);
  assert.match(game, /worldMapActTwoBtn\?\.setAttribute\("aria-pressed"/);
});

test("act selectors have distinct active, hover and mobile treatments", () => {
  assert.match(css, /\.worldmap-act-switch button\.active/);
  assert.match(css, /#worldMapActTwoBtn\{--act-color:/);
  assert.match(css, /\.worldmap-act-switch button:hover/);
  assert.match(css, /@media \(max-width:620px\)/);
});
