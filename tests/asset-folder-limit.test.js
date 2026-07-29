const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const MAX_ITEMS_PER_ASSET_FOLDER = 99;

function countRecursiveItems(directory) {
  return fs.readdirSync(directory, { withFileTypes:true }).reduce((total, entry) => {
    const entryPath = path.join(directory, entry.name);
    return total + 1 + (entry.isDirectory() ? countRecursiveItems(entryPath) : 0);
  }, 0);
}

test("assets and assets2 each stay below the 100-item packaging limit", () => {
  for(const folder of ["assets", "assets2"]) {
    const directory = path.join(ROOT, folder);
    assert.ok(fs.existsSync(directory), `${folder} is missing`);
    const itemCount = countRecursiveItems(directory);
    assert.ok(
      itemCount <= MAX_ITEMS_PER_ASSET_FOLDER,
      `${folder} contains ${itemCount} recursive items; maximum is ${MAX_ITEMS_PER_ASSET_FOLDER}`
    );
  }
});

test("enemy and bestiary art live only in assets2", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "assets2", "enemies")));
  assert.ok(fs.existsSync(path.join(ROOT, "assets2", "guide")));
  assert.equal(fs.existsSync(path.join(ROOT, "assets", "enemies")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "assets", "guide")), false);
});
