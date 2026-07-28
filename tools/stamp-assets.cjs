#!/usr/bin/env node
/* Rewrites every `?v=` cache-buster in the HTML to a hash of the file it points
 * at.
 *
 * These used to be hand-incremented (game.js?v=r102, style.css?v=r12,
 * site-nav.js?v=5) and two test files pinned the value, so shipping a change
 * meant remembering to bump it in three places. Forget, and browsers keep the
 * old file — the failure looks like "my fix didn't deploy", which is the worst
 * possible thing to be debugging.
 *
 * Worse, all 17 modules under js/ shared a single stamp (r93) while game.js had
 * moved to r102: editing any one of them shipped nothing to anyone holding a
 * cached copy. Per-file hashes remove the coupling entirely.
 *
 * Usage:
 *   node tools/stamp-assets.cjs           rewrite the stamps
 *   node tools/stamp-assets.cjs --check   exit 1 if any stamp is stale
 */

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.join(__dirname, "..");
const CHECK_ONLY = process.argv.includes("--check");

// src="game.js?v=r102"  /  href="style.css?v=r12"
const ASSET_REF = /((?:src|href)=")([^"?]+\.(?:js|css))\?v=([^"]*)"/g;

function hashOf(assetPath) {
  const full = path.join(ROOT, assetPath);
  if (!fs.existsSync(full)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex").slice(0, 10);
}

function htmlFiles() {
  return fs.readdirSync(ROOT).filter((f) => f.endsWith(".html")).sort();
}

function run() {
  const stale = [];
  const missing = [];
  let rewritten = 0;
  let scanned = 0;

  for (const file of htmlFiles()) {
    const full = path.join(ROOT, file);
    const before = fs.readFileSync(full, "utf8");

    const after = before.replace(ASSET_REF, (match, prefix, assetPath, current) => {
      scanned += 1;
      const hash = hashOf(assetPath);
      if (hash === null) {
        missing.push(`${file} -> ${assetPath}`);
        return match;
      }
      if (hash !== current) stale.push(`${file}: ${assetPath} (${current} -> ${hash})`);
      return `${prefix}${assetPath}?v=${hash}"`;
    });

    if (after !== before && !CHECK_ONLY) {
      fs.writeFileSync(full, after);
      rewritten += 1;
    }
  }

  if (missing.length) {
    console.error("stamp-assets: referenced files do not exist:");
    for (const entry of missing) console.error(`  ${entry}`);
    process.exit(1);
  }

  if (CHECK_ONLY) {
    if (stale.length) {
      console.error(`stamp-assets: ${stale.length} stale stamp(s). Run: npm run stamp`);
      for (const entry of stale) console.error(`  ${entry}`);
      process.exit(1);
    }
    console.log(`stamp-assets: all ${scanned} asset stamps current.`);
    return;
  }

  console.log(
    `stamp-assets: ${scanned} references checked, ${stale.length} updated across ${rewritten} file(s).`
  );
  for (const entry of stale) console.log(`  ${entry}`);
}

run();
