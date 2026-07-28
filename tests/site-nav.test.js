const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html"));

function renderNavigation(location) {
  let renderedShell = null;
  const document = {
    body: {
      prepend(element) {
        renderedShell = element;
      }
    },
    createElement() {
      return {
        className: "",
        innerHTML: "",
        setAttribute() {}
      };
    },
    querySelector() {
      return null;
    }
  };

  vm.runInNewContext(
    fs.readFileSync(path.join(root, "site-nav.js"), "utf8"),
    { document, window: { location } }
  );

  return renderedShell?.innerHTML || "";
}

test("every public HTML page loads the shared navigation", () => {
  assert.ok(htmlFiles.length > 0);

  for (const fileName of htmlFiles) {
    const source = fs.readFileSync(path.join(root, fileName), "utf8");
    assert.match(source, /<script src="site-nav\.js\?v=[0-9a-f]{10}" defer><\/script>/, fileName);
    assert.doesNotMatch(source, /<script src="\/site-nav\.js/, fileName);
    assert.match(source, /style\.css\?v=[0-9a-f]{10}/, fileName);
  }
});

test("the primary menu exposes the same five destinations and uses Rankings", () => {
  const source = fs.readFileSync(path.join(root, "site-nav.js"), "utf8");
  const destinationCount = (source.match(/href: "/g) || []).length;

  assert.equal(destinationCount, 5);
  assert.match(source, /label: "Rankings"/);
  assert.doesNotMatch(source, /label: "Leaderboards?"/i);
  assert.match(source, /image: "\/assets\/ui\/navigation\/nav-rankings\.webp"/);
  assert.match(source, /window\.location\.protocol === "file:"/);
  assert.match(source, /href === "\/" \? "index\.html"/);
  assert.match(source, /heroActions\.append\(navigation\)/);
  assert.doesNotMatch(source, /site-nav-brand/);
});

test("legacy page buttons no longer call the Rankings page Leaderboards", () => {
  const visibleLegacyLabel = />\s*(?:View\s+)?Leaderboards?\s*</i;

  for (const fileName of htmlFiles) {
    const source = fs.readFileSync(path.join(root, fileName), "utf8");
    assert.doesNotMatch(source, visibleLegacyLabel, fileName);
  }
});

test("the menu uses portable links when an extracted HTML file is opened directly", () => {
  const markup = renderNavigation({
    protocol: "file:",
    pathname: "/C:/Games/Ashen Bastion/leaderboards.html"
  });

  assert.match(markup, /href="index\.html"/);
  assert.match(markup, /class="site-nav-link is-current" href="leaderboards\.html" aria-current="page"/);
  assert.doesNotMatch(markup, /href="\/leaderboards\.html"/);
});

test("the menu keeps root-relative links when served by Netlify", () => {
  const markup = renderNavigation({
    protocol: "https:",
    pathname: "/guide.html"
  });

  assert.match(markup, /href="\/"/);
  assert.match(markup, /class="site-nav-link is-current" href="\/guide\.html" aria-current="page"/);
  assert.match(markup, /href="\/leaderboards\.html"/);
});

test("the home hero keeps Play Now separate from four shared graphical links", () => {
  const markup = renderNavigation({
    protocol: "file:",
    pathname: "/C:/Games/Ashen Bastion/index.html"
  });
  const linkCount = (markup.match(/class="site-nav-link(?:\s|")/g) || []).length;

  assert.equal(linkCount, 4);
  assert.doesNotMatch(markup, />\s*Play\s*</);
  assert.match(markup, />\s*Command Table\s*</);
  assert.match(markup, />\s*Rankings\s*</);
});

test("all deployed navigation emblems are compact square transparent WebP assets", () => {
  const iconNames = [
    "nav-play.webp",
    "nav-command-table.webp",
    "nav-guide.webp",
    "nav-rankings.webp",
    "nav-account.webp"
  ];

  for (const iconName of iconNames) {
    const buffer = fs.readFileSync(path.join(root, "assets", "ui", "navigation", iconName));
    assert.equal(buffer.subarray(0, 4).toString("ascii"), "RIFF", iconName);
    assert.equal(buffer.subarray(8, 12).toString("ascii"), "WEBP", iconName);
    assert.equal(buffer.subarray(12, 16).toString("ascii"), "VP8X", iconName);
    assert.equal(buffer.readUInt8(20) & 0x10, 0x10, `${iconName} must preserve transparency`);
    assert.equal(buffer.readUIntLE(24, 3) + 1, 128, iconName);
    assert.equal(buffer.readUIntLE(27, 3) + 1, 128, iconName);
    assert.ok(buffer.length < 15_000, `${iconName} should stay below 15 KB`);
  }
});

test("legacy bottom navigation strips are removed from every page", () => {
  const legacyBottomNavigation = /<nav class="(?:pg-strip|gd-strip|rk-strip|ct-nav)/;

  for (const fileName of htmlFiles) {
    const source = fs.readFileSync(path.join(root, fileName), "utf8");
    assert.doesNotMatch(source, legacyBottomNavigation, fileName);
    assert.doesNotMatch(source, /<h2 class="ct-card-title">Quarters<\/h2>/, fileName);
  }

  const profileSource = fs.readFileSync(path.join(root, "profile.html"), "utf8");
  assert.equal((profileSource.match(/class="profile-actions"/g) || []).length, 1);
  assert.match(profileSource, /Sign in or create account/);
});
