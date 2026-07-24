(function bootstrapCombatContent(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  DarkDefense.ENEMY_TRAITS = Object.freeze({
    fast: Object.freeze({
      id: "pack_hunter",
      name: "Pack Hunter",
      short: "Pack Haste",
      icon: ">>",
      color: "#38bdf8",
      radius: 82,
      speedMultiplier: 1.16,
      description: "Fast enemies accelerate when another fast enemy is close."
    }),
    armored: Object.freeze({
      id: "bulwark",
      name: "Bulwark",
      short: "Guard Aura",
      icon: "D",
      color: "#cbd5e1",
      radius: 96,
      allyDamageMultiplier: 0.82,
      description: "Protects nearby non-boss allies until the armored carrier falls."
    }),
    tank: Object.freeze({
      id: "last_stand",
      name: "Last Stand",
      short: "Enrage",
      icon: "!",
      color: "#fb7185",
      triggerHpRatio: 0.4,
      speedMultiplier: 1.3,
      slowFloor: 0.72,
      description: "Below 40% HP, gains speed and resists slows but not stuns or freezes."
    })
  });

  const phase = (id, name, hpBelow, ability, intensity, color) => Object.freeze({
    id,
    name,
    hpBelow,
    ability,
    intensity,
    telegraphSeconds: 1.2,
    color
  });

  DarkDefense.BOSS_PHASES = Object.freeze({
    1: Object.freeze([
      phase("root_grasp", "Root Grasp", 0.72, "roots", 1, "#86efac"),
      phase("ancient_overgrowth", "Ancient Overgrowth", 0.34, "roots", 2, "#bef264")
    ]),
    2: Object.freeze([
      phase("warden_rage", "Warden Rage", 0.7, "rage", 1, "#fca5a5"),
      phase("ruin_frenzy", "Ruin Frenzy", 0.32, "rage", 2, "#fb7185")
    ]),
    3: Object.freeze([
      phase("grave_call", "Grave Call", 0.74, "summon", 1, "#c4b5fd"),
      phase("legion_rising", "Legion Rising", 0.36, "summon", 2, "#a78bfa")
    ]),
    4: Object.freeze([
      phase("iron_bulwark", "Iron Bulwark", 0.72, "shield", 1, "#93c5fd"),
      phase("last_bastion", "Last Bastion", 0.3, "shield", 2, "#60a5fa")
    ]),
    5: Object.freeze([
      phase("devourer_hunger", "Devourer's Hunger", 0.68, "rage", 1, "#fda4af"),
      phase("blood_feast", "Blood Feast", 0.28, "rage", 2, "#fb7185")
    ]),
    6: Object.freeze([
      phase("void_shell", "Void Shell", 0.76, "shield", 1, "#c4b5fd"),
      phase("portal_breach", "Portal Breach", 0.38, "summon", 2, "#e879f9")
    ])
  });
})(typeof window !== "undefined" ? window : globalThis);
