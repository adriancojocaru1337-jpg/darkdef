const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isAllowedOrigin,
  getPasswordResetBaseUrl
} = require("../netlify/functions/request-security");

test("origin validation requires an exact configured origin", () => {
  assert.equal(isAllowedOrigin("https://darkdefense.netlify.app", {}), true);
  assert.equal(isAllowedOrigin("https://darkdefense.netlify.app/account.html", {}), true);
  assert.equal(isAllowedOrigin("https://darkdefense.netlify.app.attacker.example", {}), false);
  assert.equal(isAllowedOrigin("https://darkdefense.netlify.app@attacker.example", {}), false);
});

test("local development origins allow only exact loopback hosts", () => {
  assert.equal(isAllowedOrigin("http://localhost:8765", {}), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:3000", {}), true);
  assert.equal(isAllowedOrigin("http://localhost.attacker.example", {}), false);
});

test("password reset base URL comes only from trusted environment", () => {
  assert.equal(
    getPasswordResetBaseUrl({ APP_BASE_URL: "https://play.ashen.example/game/" }),
    "https://play.ashen.example/game"
  );
  assert.equal(getPasswordResetBaseUrl({}), "https://darkdefense.netlify.app");
});
