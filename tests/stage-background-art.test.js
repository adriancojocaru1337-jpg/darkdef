const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const builder = fs.readFileSync(path.join(root, "tools", "build-stage-backgrounds.py"), "utf8");

const stageSources = [
  "stage01-forest.webp",
  "stage02-ruins.webp",
  "stage03-graveyard.webp",
  "stage04-castle.webp",
  "stage05-catacombs.webp",
  "stage06-dark-portal.webp",
  "stage07-broken-gate.webp",
  "stage08-ashen-road.webp",
  "stage09-hollow-village.webp",
  "stage10-sunken-crossing.webp",
  "stage11-first-flame.webp",
  "stage12-field-of-dawn.webp"
];

function readWebPSize(relativePath) {
  const buffer = fs.readFileSync(path.join(root, relativePath));
  assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", relativePath);
  assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", relativePath);
  const chunk = buffer.subarray(12, 16).toString("ascii");
  if (chunk === "VP8L") {
    const packed = buffer.readUInt32LE(21);
    return {
      width: (packed & 0x3fff) + 1,
      height: ((packed >>> 14) & 0x3fff) + 1
    };
  }
  if (chunk === "VP8 ") {
    assert.equal(buffer.subarray(23, 26).toString("hex"), "9d012a", `${relativePath} has an invalid VP8 frame`);
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff
    };
  }
  if (chunk === "VP8X") {
    return {
      width: buffer.readUIntLE(24, 3) + 1,
      height: buffer.readUIntLE(27, 3) + 1
    };
  }
  assert.fail(`${relativePath} has unsupported WebP chunk ${chunk}`);
}

test("all twelve stages have dedicated master artwork and 16:9 runtime backgrounds", () => {
  assert.equal(stageSources.length, 12);

  for (let index = 0; index < stageSources.length; index += 1) {
    const stage = index + 1;
    const source = path.join(root, "source-art", "stage-backgrounds-v2", stageSources[index]);
    const runtime = `assets/terrain/ground_${stage}.webp`;
    assert.ok(fs.existsSync(source), `missing master source for Stage ${stage}`);
    assert.ok(fs.statSync(source).size > 1_000_000, `Stage ${stage} master source looks incomplete`);
    assert.deepEqual(readWebPSize(runtime), { width: 1536, height: 864 }, runtime);
  }
});

test("the battlefield selects the dedicated background for every stage", () => {
  assert.match(game, /assets\/terrain\/ground_\$\{stage\}\.webp/);
  assert.match(game, /const terrainStage = stage\.terrainStage \|\| currentStage/);
  assert.match(builder, /RUNTIME_SIZE = \(1536, 864\)/);
  for (const source of stageSources) assert.match(builder, new RegExp(source.replace(".", "\\.")));
});
