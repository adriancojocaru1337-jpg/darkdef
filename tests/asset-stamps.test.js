const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const ASSET_REF = /(?:src|href)="([^"?]+\.(?:js|css))\?v=([^"]*)"/g;

function htmlFiles() {
  return fs.readdirSync(ROOT).filter((f) => f.endsWith(".html")).sort();
}

function hashOf(assetPath) {
  const full = path.join(ROOT, assetPath);
  if (!fs.existsSync(full)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex").slice(0, 10);
}

function allRefs() {
  const refs = [];
  for (const file of htmlFiles()) {
    const source = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const [, assetPath, stamp] of source.matchAll(ASSET_REF)) {
      refs.push({ file, assetPath, stamp });
    }
  }
  return refs;
}

/* Cache-busters used to be hand-incremented and pinned in three test files.
   Forgetting the bump shipped nothing to anyone holding a cached copy, and the
   symptom — "my fix isn't live" — is indistinguishable from a broken deploy.
   All 17 modules under js/ also shared one stamp, so editing any of them
   shipped to nobody. */

test("every cache-buster matches the file it points at", () => {
  const stale = [];
  for (const { file, assetPath, stamp } of allRefs()) {
    const expected = hashOf(assetPath);
    assert.ok(expected !== null, `${file} references a file that does not exist: ${assetPath}`);
    if (stamp !== expected) stale.push(`${file}: ${assetPath} is ?v=${stamp}, expected ${expected}`);
  }
  assert.deepEqual(stale, [], `stale cache-busters — run: npm run stamp\n${stale.join("\n")}`);
});

test("no two different files share a stamp", () => {
  // js/ modules were all pinned to r93 together, which is how one of them could
  // change without anyone receiving it.
  const byStamp = new Map();
  for (const { assetPath, stamp } of allRefs()) {
    if (!byStamp.has(stamp)) byStamp.set(stamp, new Set());
    byStamp.get(stamp).add(assetPath);
  }
  for (const [stamp, paths] of byStamp) {
    assert.equal(
      paths.size,
      1,
      `stamp ${stamp} is shared by ${[...paths].join(", ")} — a change to one ships nothing`
    );
  }
});

test("stamps are content hashes, not hand-written revisions", () => {
  for (const { file, assetPath, stamp } of allRefs()) {
    assert.match(stamp, /^[0-9a-f]{10}$/, `${file} -> ${assetPath} uses a manual stamp: ${stamp}`);
  }
});

test("the stamper's --check mode agrees", () => {
  // Guards the script itself: if it stops detecting drift, the tests above
  // would still pass while deploys silently ship stale assets.
  execFileSync("node", [path.join(ROOT, "tools", "stamp-assets.cjs"), "--check"], { cwd: ROOT });
});

test("the stamper is wired into the deploy, not just an npm script", () => {
  // A script you have to remember to run is the problem we started with.
  const netlifyConfig = fs.readFileSync(path.join(ROOT, "netlify.toml"), "utf8");
  assert.match(netlifyConfig, /stamp-assets/);
});

test("schema and tooling files are not publicly downloadable", () => {
  // Netlify publishes the repo root: without these rules every setup_*.sql is
  // fetchable, which hands out the full anti-cheat schema.
  const redirects = fs.readFileSync(path.join(ROOT, "_redirects"), "utf8");
  for (const blocked of ["/setup_*.sql", "/tools/*", "/tests/*", "/package.json"]) {
    assert.ok(
      redirects.includes(blocked),
      `${blocked} is served publicly — add it to _redirects`
    );
  }
  // Every rule must actually return 404, not just redirect somewhere readable.
  for (const line of redirects.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    assert.match(line, /\s404\s*$/, `rule does not 404: ${line}`);
  }
});
