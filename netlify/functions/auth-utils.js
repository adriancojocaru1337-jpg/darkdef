const crypto = require("crypto");
const { neon } = require("@netlify/neon");

const sql = neon();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = "dd_session";
const IS_PROD = process.env.NODE_ENV === "production";

function json(statusCode, payload, extra = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(extra.headers || {})
    },
    body: JSON.stringify(payload)
  };
}

function getOrigin(event) {
  return String(
    event.headers?.origin ||
    event.headers?.Origin ||
    event.headers?.referer ||
    event.headers?.Referer ||
    ""
  ).trim();
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return origin.startsWith("https://darkdefense.netlify.app") || origin.startsWith("http://localhost");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase().slice(0, 190);
}

function sanitizeUsername(username) {
  return String(username || "")
    .replace(/[^a-zA-Z0-9 _\-.]/g, "")
    .trim()
    .slice(0, 20);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const value = String(password || "");
  return value.length >= 8 && value.length <= 72;
}

function hashIp(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function getClientIp(event) {
  const forwarded = event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"] || "";
  return String(forwarded).split(",")[0].trim() || "unknown";
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(String(password), salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    try {
      const [scheme, saltHex, keyHex] = String(storedHash || "").split("$");
      if (scheme !== "scrypt" || !saltHex || !keyHex) return resolve(false);
      crypto.scrypt(String(password), Buffer.from(saltHex, "hex"), 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
        if (err) return reject(err);
        const actual = Buffer.from(keyHex, "hex");
        if (actual.length !== derivedKey.length) return resolve(false);
        resolve(crypto.timingSafeEqual(actual, derivedKey));
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function buildSessionCookie(token, expiresAtMs) {
  const pieces = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${new Date(expiresAtMs).toUTCString()}`
  ];
  if (IS_PROD) pieces.push("Secure");
  return pieces.join("; ");
}

function clearSessionCookie() {
  const pieces = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ];
  if (IS_PROD) pieces.push("Secure");
  return pieces.join("; ");
}

function parseCookies(event) {
  const cookieHeader = String(event.headers?.cookie || event.headers?.Cookie || "");
  return cookieHeader.split(";").reduce((acc, part) => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

async function createSession({ userId, event }) {
  const rawToken = createSessionToken();
  const tokenHash = sha256(rawToken);
  const expiresAtMs = Date.now() + SESSION_TTL_MS;
  const ipHash = hashIp(getClientIp(event));
  const userAgentHash = sha256(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || "");

  await sql`
    insert into user_sessions (user_id, token_hash, expires_at, ip_hash, user_agent_hash)
    values (${userId}, ${tokenHash}, to_timestamp(${expiresAtMs} / 1000.0), ${ipHash}, ${userAgentHash})
  `;

  return {
    rawToken,
    expiresAtMs,
    cookie: buildSessionCookie(rawToken, expiresAtMs)
  };
}

async function getSessionUser(event) {
  const cookies = parseCookies(event);
  const rawToken = cookies[COOKIE_NAME];
  if (!rawToken) return null;
  const tokenHash = sha256(rawToken);
  const rows = await sql`
    select s.id as session_id, s.user_id, s.expires_at, u.username, u.email, u.created_at,
           p.best_endless_score, p.best_story_stage, p.total_kills, p.total_runs, p.crest_id
    from user_sessions s
    join users u on u.id = s.user_id
    left join user_profiles p on p.user_id = u.id
    where s.token_hash = ${tokenHash}
      and s.expires_at > now()
    limit 1
  `;
  return rows[0] || null;
}

async function deleteSession(event) {
  const cookies = parseCookies(event);
  const rawToken = cookies[COOKIE_NAME];
  if (!rawToken) return;
  const tokenHash = sha256(rawToken);
  await sql`delete from user_sessions where token_hash = ${tokenHash}`;
}

module.exports = {
  sql,
  json,
  getOrigin,
  isAllowedOrigin,
  normalizeEmail,
  sanitizeUsername,
  validateEmail,
  validatePassword,
  hashPassword,
  verifyPassword,
  createSession,
  getSessionUser,
  deleteSession,
  clearSessionCookie,
  COOKIE_NAME,
  sha256,
  hashIp,
  getClientIp
};
