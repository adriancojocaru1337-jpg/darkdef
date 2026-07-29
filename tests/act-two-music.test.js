const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(ROOT, "game.js"), "utf8");

test("every Act II stage has its own MP3 soundtrack", () => {
  for(let stage = 7; stage <= 12; stage += 1) {
    const relativePath = `assets2/music/stage_${stage}.mp3`;
    const fullPath = path.join(ROOT, relativePath);
    assert.ok(fs.existsSync(fullPath), `${relativePath} is missing`);
    const audio = fs.readFileSync(fullPath);
    assert.ok(audio.length > 1_000_000, `${relativePath} is unexpectedly small`);
    assert.equal(audio.subarray(0, 3).toString("ascii"), "ID3", `${relativePath} is not an ID3 MP3`);
    assert.match(
      game,
      new RegExp(`${stage}: "${relativePath.replaceAll("/", "\\/")}"`),
      `Stage ${stage} soundtrack is not registered`
    );
  }
});

test("Act II maps select their matching soundtrack ids", () => {
  for(let stage = 7; stage <= 12; stage += 1) {
    const stageBlock = game.match(
      new RegExp(`${stage}: \\{ name:[\\s\\S]*?(?=\\n  ${stage + 1}: \\{|\\n\\};)`)
    )?.[0] || "";
    assert.match(stageBlock, new RegExp(`musicStage:${stage}`));
  }
});

test("the asset split remains within the 99-item limit after adding music", () => {
  function countItems(directory) {
    return fs.readdirSync(directory, { withFileTypes:true }).reduce((total, entry) => (
      total + 1 + (entry.isDirectory() ? countItems(path.join(directory, entry.name)) : 0)
    ), 0);
  }

  for(const folder of ["assets", "assets2"]) {
    const itemCount = countItems(path.join(ROOT, folder));
    assert.ok(itemCount <= 99, `${folder} contains ${itemCount} recursive items; maximum is 99`);
  }
});
