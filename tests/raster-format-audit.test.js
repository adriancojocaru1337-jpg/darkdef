const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const LEGACY = new Set([".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tif", ".tiff"]);
const ALLOWED = ["favicon.png", "og-image.png"];

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, files);
    } else if (LEGACY.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.relative(ROOT, absolute).replaceAll("\\", "/"));
    }
  }
  return files;
}

test("only browser and social compatibility images remain outside WebP", () => {
  assert.deepEqual(walk(ROOT).sort(), ALLOWED);
  for (const relativePath of ALLOWED) {
    assert.ok(fs.statSync(path.join(ROOT, relativePath)).size > 0, `${relativePath} is missing`);
  }
});

test("the migration tool documents the two compatibility exceptions", () => {
  const source = fs.readFileSync(path.join(ROOT, "tools", "convert-raster-assets-to-webp.py"), "utf8");
  assert.match(source, /Path\("favicon\.png"\)/);
  assert.match(source, /Path\("og-image\.png"\)/);
  assert.match(source, /source\.unlink\(\)/);
});
