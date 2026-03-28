(function () {
  const body = document.body;
  if (!body) return;
  const isHomePage = window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
  if (isHomePage) return;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function renderGuestBar() {
    const crest = window.DarkDefenseCrest?.markup("Guest", "dd-crest-sm") || "";
    return `
      <div class="global-account-bar">
        <div class="global-account-bar-inner">
          <div class="global-account-brand">
            <a href="/">Dark Defense</a>
          </div>
          <div class="global-account-status">
            <a class="global-account-pill" href="/account.html">
              ${crest}
              <span class="global-account-kicker">Player</span>
              <strong>Guest</strong>
            </a>
            <div class="global-account-links">
              <a href="/account.html" class="btn btn-secondary">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderUserBar(user) {
    const username = escapeHtml(user?.username || "Player");
    const crest = window.DarkDefenseCrest?.markup(user?.username || "Player", "dd-crest-sm", user?.crestId || null) || "";
    return `
      <div class="global-account-bar">
        <div class="global-account-bar-inner">
          <div class="global-account-brand">
            <a href="/">Dark Defense</a>
          </div>
          <div class="global-account-status">
            <a class="global-account-pill" href="/profile.html">
              ${crest}
              <span class="global-account-kicker">Player</span>
              <strong>${username}</strong>
            </a>
            <div class="global-account-links">
              <a href="/profile.html" class="btn btn-secondary">Profile</a>
              <a href="/account.html" class="btn btn-secondary">Account</a>
              <button type="button" class="btn btn-secondary global-account-logout" id="globalAccountLogoutBtn">Logout</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function mountAccountBar() {
    let markup = renderGuestBar();
    try {
      const response = await fetch("/.netlify/functions/me", {
        credentials: "include",
        cache: "no-store"
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.authenticated && data?.user) {
          markup = renderUserBar(data.user);
        }
      }
    } catch (_) {}

    body.insertAdjacentHTML("afterbegin", markup);

    const logoutBtn = document.getElementById("globalAccountLogoutBtn");
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      try {
        const response = await fetch("/.netlify/functions/logout", {
          method: "POST",
          credentials: "include"
        });
        if (!response.ok) {
          logoutBtn.disabled = false;
          return;
        }
        window.location.reload();
      } catch (_) {
        logoutBtn.disabled = false;
      }
    });
  }

  mountAccountBar();
})();
