const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const guide = fs.readFileSync(path.join(ROOT, "guide.html"), "utf8");

function assertWebP(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP");
  assert.ok(["VP8 ", "VP8L"].includes(buffer.subarray(12, 16).toString("ascii")));
}

test("Guide uses every dedicated Act II boss portrait", () => {
  for(let stage = 7; stage <= 12; stage += 1) {
    const asset = `assets/ui/boss-stage${stage}.webp`;
    assert.ok(fs.existsSync(path.join(ROOT, asset)), `${asset} is missing`);
    assertWebP(asset);
    assert.match(guide, new RegExp(`src="${asset.replaceAll("/", "\\/")}"`));
  }
});

test("Act II Guide cards no longer reuse Act I boss portraits", () => {
  const actTwoSection = guide.slice(guide.indexOf('<span class="gd-boss-stage">Stage 7</span>'));
  assert.doesNotMatch(actTwoSection, /boss-stage[1-6]\.jpg/);
  assert.equal((guide.match(/class="gd-boss act-two-boss"/g) || []).length, 6);
  assert.match(guide, /\.gd-boss\.act-two-boss \.gd-boss-art img\{[\s\S]*?aspect-ratio:2\/3/);
});
