(function bootstrapEnemyBehaviorSystem(global) {
  "use strict";

  const DarkDefense = global.DarkDefense = global.DarkDefense || {};

  function createEnemyBehaviorSystem(options = {}) {
    const definitions = options.definitions || DarkDefense.ENEMY_TRAITS || {};
    const getPosition = options.getPosition || ((enemy) => ({ x: enemy.progress || 0, y: 0 }));
    const events = options.events || DarkDefense.events || null;
    const onActivated = options.onActivated || (() => {});

    function initialize(enemy) {
      if (!enemy || enemy.behavior) return enemy;
      const trait = definitions[enemy.type];
      enemy.behavior = {
        traitId: trait?.id || null,
        active: trait?.id === "bulwark",
        activatedOnce: false,
        speedMultiplier: 1,
        slowFloor: 0,
        protectedByBulwark: false
      };
      return enemy;
    }

    function distanceBetween(first, second) {
      const a = getPosition(first);
      const b = getPosition(second);
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function announceOnce(enemy, trait) {
      if (enemy.behavior.activatedOnce) return;
      enemy.behavior.activatedOnce = true;
      onActivated(enemy, trait);
      events?.emit("enemy:behavior-activated", {
        enemyId: enemy.id,
        enemyType: enemy.type,
        traitId: trait.id
      });
    }

    function updateAll(enemies) {
      if (!Array.isArray(enemies)) return;
      enemies.forEach((enemy) => {
        initialize(enemy);
        enemy.behavior.protectedByBulwark = false;
        enemy.behavior.speedMultiplier = 1;
      });

      for (const enemy of enemies) {
        if (!enemy || enemy.hp <= 0) continue;
        const trait = definitions[enemy.type];
        if (!trait) continue;

        if (trait.id === "pack_hunter") {
          const hasPack = enemies.some((ally) => (
            ally !== enemy
            && ally.hp > 0
            && ally.type === "fast"
            && distanceBetween(enemy, ally) <= trait.radius
          ));
          enemy.behavior.active = hasPack;
          enemy.behavior.speedMultiplier = hasPack ? trait.speedMultiplier : 1;
          if (hasPack) announceOnce(enemy, trait);
        }

        if (trait.id === "last_stand") {
          const active = enemy.hp / Math.max(1, enemy.maxHp) <= trait.triggerHpRatio;
          enemy.behavior.active = active;
          enemy.behavior.speedMultiplier = active ? trait.speedMultiplier : 1;
          enemy.behavior.slowFloor = active ? trait.slowFloor : 0;
          if (active) announceOnce(enemy, trait);
        }

        if (trait.id === "bulwark") {
          enemy.behavior.active = true;
          announceOnce(enemy, trait);
        }
      }

      const bulwarks = enemies.filter((enemy) => (
        enemy?.hp > 0
        && definitions[enemy.type]?.id === "bulwark"
      ));
      for (const bulwark of bulwarks) {
        const trait = definitions[bulwark.type];
        for (const ally of enemies) {
          if (!ally || ally === bulwark || ally.hp <= 0 || ally.type === "boss") continue;
          if (distanceBetween(bulwark, ally) <= trait.radius) {
            initialize(ally);
            ally.behavior.protectedByBulwark = true;
          }
        }
      }
    }

    function getMovementMultiplier(enemy, controlMultiplier) {
      initialize(enemy);
      const base = Math.max(0, Number(controlMultiplier) || 0);
      if (base === 0) return 0;
      const resistedControl = enemy.behavior.slowFloor > 0
        ? Math.max(base, enemy.behavior.slowFloor)
        : base;
      return resistedControl * (enemy.behavior.speedMultiplier || 1);
    }

    function getDamageTakenMultiplier(enemy) {
      initialize(enemy);
      if (!enemy.behavior.protectedByBulwark) return 1;
      return definitions.armored?.allyDamageMultiplier || 0.82;
    }

    function getTrait(enemy) {
      return enemy ? definitions[enemy.type] || null : null;
    }

    function drawIndicator(ctx, enemy, position) {
      const trait = getTrait(enemy);
      const behavior = enemy?.behavior;
      if (!trait || !behavior) return;
      const showTrait = trait.id === "bulwark" || behavior.active;
      if (!showTrait && !behavior.protectedByBulwark) return;

      ctx.save();
      if (showTrait) {
        ctx.fillStyle = "rgba(2,6,23,.88)";
        ctx.strokeStyle = trait.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(position.x + 15, position.y - 25, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = trait.color;
        ctx.font = "700 7px Inter, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(trait.icon, position.x + 15, position.y - 24.5);
      }
      if (behavior.protectedByBulwark) {
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = definitions.armored?.color || "#cbd5e1";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(position.x, position.y + 2, 18, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
      }
      ctx.restore();
    }

    return Object.freeze({
      initialize,
      updateAll,
      getMovementMultiplier,
      getDamageTakenMultiplier,
      getTrait,
      drawIndicator
    });
  }

  DarkDefense.createEnemyBehaviorSystem = createEnemyBehaviorSystem;
})(typeof window !== "undefined" ? window : globalThis);
