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
    }),
    cinder_skirmisher: Object.freeze({
      id: "cinder_leap",
      name: "Cinder Skirmisher",
      short: "Leap!",
      icon: ">",
      color: "#fb923c",
      triggerHpRatio: 0.55,
      progressBoost: 0.07,
      speedMultiplier: 1.12,
      description: "Below 55% HP, leaps forward once and keeps moving faster."
    }),
    hollow_binder: Object.freeze({
      id: "tower_hex",
      name: "Hollow Binder",
      short: "Hex",
      icon: "X",
      color: "#c084fc",
      radius: 145,
      initialDelay: 4.2,
      cooldown: 7,
      duration: 2.2,
      description: "Periodically hexes a nearby tower, preventing it from attacking."
    }),
    ley_revenant: Object.freeze({
      id: "ley_ward",
      name: "Ley Revenant",
      short: "Ward",
      icon: "W",
      color: "#e879f9",
      initialShieldRatio: 0.18,
      rechargeHpRatio: 0.45,
      rechargeShieldRatio: 0.24,
      description: "Enters with a Ley ward and restores it once below 45% HP."
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
    ]),
    7: Object.freeze([
      phase("gatekeepers_guard", "Gatekeeper's Guard", 0.72, "shield", 1, "#fbbf24"),
      phase("last_command", "The Last Command", 0.32, "rage", 2, "#fb923c")
    ]),
    8: Object.freeze([
      phase("ash_flock", "Ash Flock", 0.74, "summon", 1, "#fbbf24"),
      phase("cinder_stampede", "Cinder Stampede", 0.34, "rage", 2, "#f97316")
    ]),
    9: Object.freeze([
      phase("hollow_grasp", "Hollow Grasp", 0.72, "roots", 1, "#d8b4fe"),
      phase("lost_congregation", "Lost Congregation", 0.33, "summon", 2, "#c084fc")
    ]),
    10: Object.freeze([
      phase("iron_screen", "Iron Screen", 0.70, "shield", 1, "#7dd3fc"),
      phase("forced_march", "Forced March", 0.30, "rage", 2, "#38bdf8")
    ]),
    11: Object.freeze([
      phase("ley_snare", "Ley Snare", 0.75, "roots", 1, "#e879f9"),
      phase("primordial_ward", "Primordial Ward", 0.36, "shield", 2, "#c084fc")
    ]),
    12: Object.freeze([
      phase("marshals_guard", "Marshal's Guard", 0.76, "shield", 1, "#fde68a"),
      phase("final_order", "The Final Order", 0.38, "rage", 2, "#fb7185")
    ])
  });
})(typeof window !== "undefined" ? window : globalThis);
