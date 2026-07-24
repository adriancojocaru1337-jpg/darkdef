const test = require("node:test");
const assert = require("node:assert/strict");

globalThis.DarkDefense = {};
require("../js/core/event-bus.js");
require("../js/core/profile-store.js");
require("../js/content/reward-content.js");
require("../js/systems/equipment-system.js");
require("../js/systems/hero-stat-pipeline.js");

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

const weapon = {
  instanceId: "itm_weapon",
  definitionId: "warden_blade",
  name: "Warden Blade",
  slot: "weapon",
  power: 40,
  coreStat: { id: "hero_damage_flat", value: 8 },
  affixes: [
    { id: "hero_damage_pct", value: 0.1 },
    { id: "boss_damage_pct", value: 0.2 }
  ],
  boundHeroId: null
};

const armor = {
  instanceId: "itm_armor",
  definitionId: "bastion_plate",
  name: "Bastion Plate",
  slot: "armor",
  power: 30,
  coreStat: { id: "hero_max_hp_flat", value: 30 },
  affixes: [{ id: "hero_max_hp_pct", value: 0.1 }],
  boundHeroId: null
};

function harness() {
  const storage = new MemoryStorage();
  const store = DarkDefense.createProfileStore({ storage });
  store.update((profile) => {
    profile.inventory.items = [weapon, armor];
    return profile;
  });
  const equipment = DarkDefense.createEquipmentSystem({
    profileStore: store,
    definitions: DarkDefense.ITEM_DEFINITIONS,
    slots: DarkDefense.EQUIPMENT_SLOTS
  });
  return { storage, store, equipment };
}

test("equips by validated slot and persists the loadout", () => {
  const { storage, equipment } = harness();

  assert.equal(equipment.equip("itm_weapon").accepted, true);
  assert.equal(equipment.getLoadout().weapon.instanceId, "itm_weapon");
  assert.equal(equipment.getLoadout().armor, null);

  const restoredStore = DarkDefense.createProfileStore({ storage });
  const restored = DarkDefense.createEquipmentSystem({ profileStore: restoredStore });
  assert.equal(restored.getEquippedIds().weapon, "itm_weapon");
  assert.equal(restoredStore.getSnapshot().inventory.items[0].boundHeroId, "varyn");
});

test("swaps equipment without deleting the replaced item", () => {
  const { store, equipment } = harness();
  store.update((profile) => {
    profile.inventory.items.push({
      ...weapon,
      instanceId: "itm_weapon_two",
      name: "Second Blade",
      power: 55
    });
    return profile;
  });

  equipment.equip("itm_weapon");
  const result = equipment.equip("itm_weapon_two");

  assert.equal(result.accepted, true);
  assert.equal(result.previousInstanceId, "itm_weapon");
  assert.equal(equipment.getLoadout().weapon.instanceId, "itm_weapon_two");
  assert.equal(store.getSnapshot().inventory.items.length, 3);
});

test("unequip only clears the slot and invalid items are rejected", () => {
  const { store, equipment } = harness();

  assert.equal(equipment.equip("missing").reason, "missing_item");
  equipment.equip("itm_armor");
  assert.equal(equipment.unequip("armor").accepted, true);
  assert.equal(equipment.getLoadout().armor, null);
  assert.ok(store.getSnapshot().inventory.items.some((item) => item.instanceId === "itm_armor"));
});

test("hero stat pipeline composes flat and percentage equipment bonuses", () => {
  const { equipment } = harness();
  equipment.equip("itm_weapon");
  equipment.equip("itm_armor");
  const pipeline = DarkDefense.createHeroStatPipeline({
    getEquippedItems: (heroId) => equipment.getEquippedItems(heroId)
  });

  const stats = pipeline.apply({
    maxHp: 230,
    damage: 26,
    range: 132,
    attackInterval: 0.78,
    moveSpeed: 0.15,
    abilityDamage: 100,
    abilityCooldown: 24,
    respawnSeconds: 12
  });

  assert.equal(stats.damage, 37.4);
  assert.equal(stats.maxHp, 286);
  assert.equal(stats.bossDamageMultiplier, 1.2);
  assert.equal(stats.equipmentPower, 70);
});

test("cooldown, attack speed and respawn reductions are capped safely", () => {
  const pipeline = DarkDefense.createHeroStatPipeline({
    getEquippedItems: () => [{
      power: 1,
      coreStat: { id: "cooldown_reduction_pct", value: 5 },
      affixes: [
        { id: "hero_attack_speed_pct", value: 5 },
        { id: "respawn_speed_pct", value: 5 }
      ]
    }]
  });
  const stats = pipeline.apply({
    maxHp: 230,
    damage: 26,
    attackInterval: 0.78,
    moveSpeed: 0.15,
    abilityDamage: 100,
    abilityCooldown: 24,
    respawnSeconds: 12
  });

  assert.equal(stats.abilityCooldown, 15.6);
  assert.equal(stats.attackInterval, 0.39);
  assert.equal(stats.respawnSeconds, 6);
});

test("skill modifiers and equipment bonuses share the same stat pipeline", () => {
  const { equipment } = harness();
  equipment.equip("itm_weapon");
  const pipeline = DarkDefense.createHeroStatPipeline({
    getEquippedItems: () => equipment.getEquippedItems(),
    getSkillModifiers: () => ({
      hero_damage_pct: 0.1,
      cooldown_reduction_pct: 0.08
    })
  });

  const stats = pipeline.apply({
    maxHp: 230,
    damage: 26,
    attackInterval: 0.78,
    moveSpeed: 0.15,
    abilityDamage: 100,
    abilityCooldown: 24,
    respawnSeconds: 12
  });

  assert.equal(stats.damage, 40.8);
  assert.equal(stats.abilityCooldown, 22.08);
  assert.equal(stats.equipmentBonuses.hero_damage_pct, 0.1);
  assert.equal(stats.skillBonuses.hero_damage_pct, 0.1);
});
