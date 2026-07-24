(function bootstrapHeroSkillContent(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  const skill = (definition) => Object.freeze({
    ...definition,
    prerequisites: Object.freeze([...(definition.prerequisites || [])]),
    modifiers: Object.freeze({ ...(definition.modifiers || {}) })
  });

  DarkDefense.HERO_SKILL_DEFINITIONS = Object.freeze({
    ashen_edge: skill({
      id: "ashen_edge",
      branchId: "blade",
      name: "Ashen Edge",
      icon: "⚔",
      maxRank: 3,
      description: "+4% hero damage per rank.",
      modifiers: { hero_damage_pct: 0.04 }
    }),
    relentless: skill({
      id: "relentless",
      branchId: "blade",
      name: "Relentless",
      icon: "✦",
      maxRank: 2,
      description: "+5% attack speed per rank.",
      prerequisites: [{ id: "ashen_edge", rank: 2 }],
      modifiers: { hero_attack_speed_pct: 0.05 }
    }),
    kingsbane_training: skill({
      id: "kingsbane_training",
      branchId: "blade",
      name: "Kingsbane Training",
      icon: "♛",
      maxRank: 2,
      description: "+8% damage against bosses per rank.",
      prerequisites: [{ id: "relentless", rank: 2 }],
      modifiers: { boss_damage_pct: 0.08 }
    }),
    rift_mastery: skill({
      id: "rift_mastery",
      branchId: "rift",
      name: "Rift Mastery",
      icon: "◈",
      maxRank: 3,
      description: "+6% Rift Pulse damage per rank.",
      modifiers: { ability_damage_pct: 0.06 }
    }),
    focused_casting: skill({
      id: "focused_casting",
      branchId: "rift",
      name: "Focused Casting",
      icon: "⌛",
      maxRank: 2,
      description: "+4% cooldown reduction per rank.",
      prerequisites: [{ id: "rift_mastery", rank: 2 }],
      modifiers: { cooldown_reduction_pct: 0.04 }
    }),
    void_resonance: skill({
      id: "void_resonance",
      branchId: "rift",
      name: "Void Resonance",
      icon: "✹",
      maxRank: 1,
      description: "+12% Rift Pulse damage.",
      prerequisites: [{ id: "focused_casting", rank: 2 }],
      modifiers: { ability_damage_pct: 0.12 }
    }),
    iron_vigor: skill({
      id: "iron_vigor",
      branchId: "bastion",
      name: "Iron Vigor",
      icon: "♥",
      maxRank: 3,
      description: "+5% maximum HP per rank.",
      modifiers: { hero_max_hp_pct: 0.05 }
    }),
    pathstrider: skill({
      id: "pathstrider",
      branchId: "bastion",
      name: "Pathstrider",
      icon: "➶",
      maxRank: 1,
      description: "+12% movement speed.",
      prerequisites: [{ id: "iron_vigor", rank: 2 }],
      modifiers: { hero_move_speed_pct: 0.12 }
    }),
    undying_oath: skill({
      id: "undying_oath",
      branchId: "bastion",
      name: "Undying Oath",
      icon: "☥",
      maxRank: 2,
      description: "+8% respawn speed per rank.",
      prerequisites: [{ id: "pathstrider", rank: 1 }],
      modifiers: { respawn_speed_pct: 0.08 }
    })
  });

  DarkDefense.HERO_SKILL_BRANCHES = Object.freeze([
    Object.freeze({
      id: "blade",
      name: "Warden's Blade",
      icon: "⚔",
      color: "#f59e0b",
      description: "Basic attacks and boss execution.",
      skillIds: Object.freeze(["ashen_edge", "relentless", "kingsbane_training"])
    }),
    Object.freeze({
      id: "rift",
      name: "Riftcaller",
      icon: "◈",
      color: "#a78bfa",
      description: "Rift Pulse damage and casting tempo.",
      skillIds: Object.freeze(["rift_mastery", "focused_casting", "void_resonance"])
    }),
    Object.freeze({
      id: "bastion",
      name: "Last Bastion",
      icon: "🛡",
      color: "#34d399",
      description: "Durability, movement and recovery.",
      skillIds: Object.freeze(["iron_vigor", "pathstrider", "undying_oath"])
    })
  ]);
})(typeof window !== "undefined" ? window : globalThis);
