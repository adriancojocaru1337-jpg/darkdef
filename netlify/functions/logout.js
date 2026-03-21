const { json, deleteSession, clearSessionCookie } = require("./auth-utils");

exports.handler = async function handler(event) {
  if (!["POST", "DELETE"].includes(event.httpMethod)) {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    await deleteSession(event);
    return json(200, { ok: true }, { headers: { "Set-Cookie": clearSessionCookie() } });
  } catch (error) {
    return json(500, { error: "Failed to sign out." });
  }
};
