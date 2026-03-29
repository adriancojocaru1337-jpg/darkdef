(function () {
  const PRESETS = {
    "ember-shield": { label: "Ember Shield", symbol: "E", hue: 18, hueAlt: 42, assetPath: "/assets/crests/ember-shield.webp" },
    "moon-sigil": { label: "Moon Sigil", symbol: "M", hue: 226, hueAlt: 264, assetPath: "/assets/crests/moon-sigil.webp" },
    "forest-warden": { label: "Forest Warden", symbol: "F", hue: 124, hueAlt: 156, assetPath: "/assets/crests/forest-warden.webp" },
    "storm-mark": { label: "Storm Mark", symbol: "S", hue: 198, hueAlt: 228, assetPath: "/assets/crests/storm-mark.webp" },
    "royal-flare": { label: "Royal Flare", symbol: "R", hue: 332, hueAlt: 18, assetPath: "/assets/crests/royal-flare.webp" },
    "void-bloom": { label: "Void Bloom", symbol: "V", hue: 280, hueAlt: 318, assetPath: "/assets/crests/void-bloom.webp" },
    "iron-oath": { label: "Iron Oath", symbol: "I", hue: 206, hueAlt: 30, assetPath: "/assets/crests/iron-oath.webp" },
    "sunforged": { label: "Sunforged", symbol: "U", hue: 42, hueAlt: 66, assetPath: "/assets/crests/sunforged.webp" }
  };

  function hashName(value) {
    const text = String(value || "guest").trim().toLowerCase() || "guest";
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getInitials(value) {
    const parts = String(value || "Guest").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "G";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }

  function build(value, presetId) {
    const safeValue = String(value || "Guest").trim() || "Guest";
    const preset = PRESETS[presetId] || null;
    if (preset) {
      const style = `--crest-hue:${preset.hue};--crest-hue-alt:${preset.hueAlt};`;
      return { initials: preset.symbol, style, label: safeValue, presetId, presetLabel: preset.label, assetPath: preset.assetPath || null };
    }

    const hash = hashName(safeValue);
    const hue = hash % 360;
    const hueAlt = (hue + 42) % 360;
    const initials = getInitials(safeValue);
    const style = `--crest-hue:${hue};--crest-hue-alt:${hueAlt};`;
    return { initials, style, label: safeValue, presetId: null, presetLabel: "Generated Crest", assetPath: null };
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function getImageHints(className) {
    const classes = String(className || "");
    if (classes.includes("dd-crest-lg")) {
      return { size: 84, loading: "eager", fetchpriority: "high" };
    }
    if (classes.includes("dd-crest-sm")) {
      return { size: 34, loading: "lazy", fetchpriority: "low" };
    }
    return { size: 42, loading: "eager", fetchpriority: "auto" };
  }

  function markup(value, className = "", presetId = null) {
    const crest = build(value, presetId);
    const extraClass = className ? ` ${className}` : "";
    if (crest.assetPath) {
      const hints = getImageHints(className);
      return `<span class="dd-crest${extraClass} dd-crest-image-wrap" style="${crest.style}" aria-hidden="true"><img class="dd-crest-image" src="${escapeHtml(crest.assetPath)}" alt="" width="${hints.size}" height="${hints.size}" loading="${hints.loading}" decoding="async" fetchpriority="${hints.fetchpriority}" /></span>`;
    }
    return `<span class="dd-crest${extraClass}" style="${crest.style}" aria-hidden="true"><span>${escapeHtml(crest.initials)}</span></span>`;
  }

  window.DarkDefenseCrest = {
    build,
    markup,
    presets: PRESETS,
    presetList: Object.entries(PRESETS).map(([id, data]) => ({ id, ...data }))
  };
})();
