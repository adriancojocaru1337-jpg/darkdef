const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const skipped = new Set([".git", "node_modules"]);
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (entry.isFile() && [".js", ".cjs"].includes(path.extname(entry.name))) files.push(fullPath);
  }
}

collect(root);
for (const file of files.sort()) {
  const checked = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (checked.status !== 0) {
    process.stderr.write(checked.stderr || checked.stdout || `Syntax check failed: ${file}\n`);
    process.exit(checked.status || 1);
  }
}

process.stdout.write(`Checked ${files.length} JavaScript files.\n`);
