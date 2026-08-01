const DEFAULT_APP_BASE_URL = "https://ashenbastion.com";
// The site moved to its own domain; the old Netlify subdomain and the www host
// stay allow-listed so links, bookmarks and in-flight sessions keep working.
const LEGACY_APP_BASE_URLS = [
  "https://www.ashenbastion.com",
  "https://darkdefense.netlify.app"
];
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function toUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch (_) {
    return null;
  }
}

function configuredAppUrls(env = process.env) {
  return [
    env.APP_BASE_URL,
    env.URL,
    env.DEPLOY_PRIME_URL,
    DEFAULT_APP_BASE_URL,
    ...LEGACY_APP_BASE_URLS
  ].map(toUrl).filter(Boolean);
}

function isAllowedOrigin(value, env = process.env) {
  if (!value) return true;
  const candidate = toUrl(value);
  if (!candidate) return false;

  const allowedOrigins = new Set(configuredAppUrls(env).map((url) => url.origin));
  if (allowedOrigins.has(candidate.origin)) return true;

  return candidate.protocol === "http:" && LOCAL_HOSTS.has(candidate.hostname);
}

function getPasswordResetBaseUrl(env = process.env) {
  const configured = toUrl(env.APP_BASE_URL) || toUrl(env.URL) || toUrl(DEFAULT_APP_BASE_URL);
  const pathname = configured.pathname.replace(/\/+$/, "");
  return `${configured.origin}${pathname}`;
}

module.exports = {
  DEFAULT_APP_BASE_URL,
  LEGACY_APP_BASE_URLS,
  isAllowedOrigin,
  getPasswordResetBaseUrl
};
