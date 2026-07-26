(function () {
  "use strict";

  const destinations = [
    {
      href: "/",
      label: "Play",
      caption: "Battlefield",
      image: "/assets/ui/navigation/nav-play.webp",
      pages: ["index.html"]
    },
    {
      href: "/command-table.html",
      label: "Command Table",
      caption: "War Room",
      image: "/assets/ui/navigation/nav-command-table.webp",
      pages: ["command-table.html"]
    },
    {
      href: "/guide.html",
      label: "Guide",
      caption: "Field Manual",
      image: "/assets/ui/navigation/nav-guide.webp",
      pages: [
        "guide.html",
        "how-to-play.html",
        "best-tower-defense-browser-game-strategy.html",
        "about.html"
      ]
    },
    {
      href: "/leaderboards.html",
      label: "Rankings",
      caption: "Hall of Fame",
      image: "/assets/ui/navigation/nav-rankings.webp",
      pages: ["leaderboards.html"]
    },
    {
      href: "/account.html",
      label: "Account",
      caption: "Your Profile",
      image: "/assets/ui/navigation/nav-account.webp",
      pages: ["account.html", "profile.html", "reset-password.html"]
    }
  ];

  const isLocalFile = window.location.protocol === "file:";
  const currentPath = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
  const currentFile = currentPath.split("/").filter(Boolean).pop() || "index.html";
  const resolveHref = (href) => {
    if (!isLocalFile) return href;
    return href === "/" ? "index.html" : href.replace(/^\//, "");
  };
  const isHomePage = currentFile === "index.html";
  const visibleDestinations = isHomePage
    ? destinations.filter((destination) => destination.label !== "Play")
    : destinations;
  const navigation = document.createElement("nav");
  navigation.className = `site-nav-inline ${isHomePage ? "site-nav-inline--hero" : "site-nav-inline--page"}`;
  navigation.setAttribute("data-site-navigation", "");
  navigation.setAttribute("aria-label", "Primary navigation");

  const links = visibleDestinations.map((destination) => {
    const isCurrent = destination.pages.includes(currentFile);
    const currentAttribute = isCurrent ? ' aria-current="page"' : "";
    const currentClass = isCurrent ? " is-current" : "";
    const href = resolveHref(destination.href);
    const image = resolveHref(destination.image);

    return `
      <a class="site-nav-link${currentClass}" href="${href}"${currentAttribute}>
        <span class="site-nav-icon" aria-hidden="true">
          <img src="${image}" alt="" width="128" height="128" decoding="async" />
        </span>
        <span class="site-nav-copy">
          <strong>${destination.label}</strong>
          <small>${destination.caption}</small>
        </span>
      </a>`;
  }).join("");

  navigation.innerHTML = `<div class="site-nav-links">${links}</div>`;

  const heroActions = document.querySelector(".hero-cta-row");
  const bannerActions = document.querySelector(
    ".pg-banner-actions, .gd-banner-actions, .rk-banner-actions, .ct-actions"
  );
  const main = document.querySelector("main");

  if (heroActions) {
    heroActions.append(navigation);
  } else if (bannerActions) {
    bannerActions.insertAdjacentElement("afterend", navigation);
  } else if (main) {
    main.prepend(navigation);
  } else {
    document.body.prepend(navigation);
  }
})();
