const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const moneyBadge = document.getElementById("moneyBadge");
const livesBadge = document.getElementById("livesBadge");
const waveBadge = document.getElementById("waveBadge");
const stageBadge = document.getElementById("stageBadge");
const progressText = document.getElementById("progressText");
const waveFill = document.getElementById("waveFill");
const messageBox = document.getElementById("messageBox");
const statusPill = document.getElementById("statusPill");
const hintChip = document.getElementById("hintChip");
const audioToggle = document.getElementById("audioToggle");

const enemyCountStat = document.getElementById("enemyCountStat");
const towerCountStat = document.getElementById("towerCountStat");
const killsStat = document.getElementById("killsStat");
const bossInfoStat = document.getElementById("bossInfoStat");
const scoreStat = document.getElementById("scoreStat");
const bonusScoreStat = document.getElementById("bonusScoreStat");
const stageNumberStat = document.getElementById("stageNumberStat");
const stageWaveStat = document.getElementById("stageWaveStat");
const modeStat = document.getElementById("modeStat");
const bestScoreStat = document.getElementById("bestScoreStat");
const furthestStageStat = document.getElementById("furthestStageStat");
const endlessUnlockedStat = document.getElementById("endlessUnlockedStat");

const notificationPanel = document.getElementById("notificationPanel");
const notificationBadge = document.getElementById("notificationBadge");
const notificationEmpty = document.getElementById("notificationEmpty");
const notificationFeed = document.getElementById("notificationFeed");
const notificationToggle = document.getElementById("notificationToggle");

const canvasWrap = document.getElementById("canvasWrap");
const towerMenu = document.getElementById("towerMenu");
const towerMenuName = document.getElementById("towerMenuName");
const towerMenuLevel = document.getElementById("towerMenuLevel");
const towerMenuAura = document.getElementById("towerMenuAura");
const towerMenuStats = document.getElementById("towerMenuStats");
const towerUpgradeBtn = document.getElementById("towerUpgradeBtn");
const towerSellBtn = document.getElementById("towerSellBtn");

const startWaveBtn = document.getElementById("startWaveBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const resetCameraBtn = document.getElementById("resetCameraBtn");
const spellSlowBtn = document.getElementById("spellSlowBtn");
const spellDamageBtn = document.getElementById("spellDamageBtn");
const spellBombBtn = document.getElementById("spellBombBtn");
const spellSlowTimer = document.getElementById("spellSlowTimer");
const spellDamageTimer = document.getElementById("spellDamageTimer");
const spellBombTimer = document.getElementById("spellBombTimer");
const refreshLeaderboardBtn = document.getElementById("refreshLeaderboardBtn");
const bonusLeaderboardList = document.getElementById("bonusLeaderboardList");
const bonusLeaderboardSubtitle = document.getElementById("bonusLeaderboardSubtitle");

const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const startGameBtn = document.getElementById("startGameBtn");
const restartFromGameOverBtn = document.getElementById("restartFromGameOverBtn");
const gameOverText = document.getElementById("gameOverText");
const auraRewardOverlay = document.getElementById("auraRewardOverlay");
const auraRewardList = document.getElementById("auraRewardList");
const auraRewardText = document.getElementById("auraRewardText");
const auraRewardNote = document.getElementById("auraRewardNote");

const unitButtons = document.querySelectorAll(".map-unit-btn");
const unitInfoPanel = document.getElementById("unitInfoPanel");
const unitInfoButtons = document.querySelectorAll(".unit-info-card");
const reserveBadgeEls = {
  archer: null,
  hunter: null,
  mage: null,
  bomb: null
};

const reservePanelEls = {
  archer: document.getElementById("panel-reserve-archer"),
  hunter: document.getElementById("panel-reserve-hunter"),
  mage: document.getElementById("panel-reserve-mage"),
  bomb: document.getElementById("panel-reserve-bomb")
};
const reserveLevelEls = {};

const COLS = 12, ROWS = 8, CELL = 56;
const START_LIVES = 20, START_MONEY = 150;

const STAGES = {
  1: { name:"Forest", bossWave:5, difficulty:1.0, bossAbility:"summon",
    route:[{c:0,r:3},{c:2,r:3},{c:2,r:1},{c:5,r:1},{c:5,r:5},{c:8,r:5},{c:8,r:2},{c:11,r:2}],
    grassPatches:[{x:30,y:18,w:86,h:54},{x:545,y:336,w:94,h:56},{x:240,y:360,w:88,h:42}],
    trees:[{x:76,y:88},{x:612,y:395},{x:640,y:60}]},
  2: { name:"Ruins", bossWave:6, difficulty:1.25, bossAbility:"rage",
    route:[{c:0,r:6},{c:3,r:6},{c:3,r:2},{c:6,r:2},{c:6,r:4},{c:9,r:4},{c:9,r:1},{c:11,r:1}],
    grassPatches:[{x:62,y:296,w:120,h:76},{x:468,y:34,w:126,h:64},{x:260,y:186,w:74,h:48}],
    ruins:[{x:80,y:100},{x:578,y:144},{x:532,y:360}]},
  3: { name:"Graveyard", bossWave:7, difficulty:1.5, bossAbility:"shield",
    route:[{c:0,r:4},{c:2,r:4},{c:2,r:6},{c:6,r:6},{c:6,r:2},{c:9,r:2},{c:9,r:5},{c:11,r:5}],
    grassPatches:[{x:80,y:40,w:120,h:50},{x:320,y:320,w:80,h:60}],
    ruins:[{x:120,y:150},{x:420,y:120},{x:600,y:330}]},
  4: { name:"Castle", bossWave:8, difficulty:1.85, bossAbility:"summon",
    route:[{c:0,r:1},{c:4,r:1},{c:4,r:4},{c:7,r:4},{c:7,r:2},{c:10,r:2},{c:10,r:6},{c:11,r:6}],
    grassPatches:[{x:40,y:320,w:100,h:60},{x:500,y:50,w:100,h:50}],
    ruins:[{x:150,y:200},{x:530,y:250}]},
  5: { name:"Catacombs", bossWave:9, difficulty:2.25, bossAbility:"rage",
    route:[{c:0,r:5},{c:1,r:5},{c:1,r:1},{c:5,r:1},{c:5,r:6},{c:8,r:6},{c:8,r:3},{c:11,r:3}],
    grassPatches:[{x:60,y:60,w:70,h:40},{x:520,y:350,w:100,h:40}],
    ruins:[{x:260,y:220},{x:570,y:130}]},
  6: { name:"Dark Portal", bossWave:10, difficulty:2.8, bossAbility:"summon",
    route:[{c:0,r:2},{c:3,r:2},{c:3,r:5},{c:5,r:5},{c:5,r:1},{c:8,r:1},{c:8,r:6},{c:11,r:6}],
    grassPatches:[{x:70,y:30,w:80,h:50},{x:490,y:300,w:120,h:60}],
    ruins:[{x:150,y:110},{x:350,y:290},{x:580,y:180}]}
};

const UNIT_TYPES = {
  archer:{name:"Archer",cost:50,range:120,fireRate:.8,damage:18,projectileSpeed:430,color:"#34d399",hood:"#065f46",upgradeCost:75,sellFactor:.7,kind:"arrow"},
  hunter:{name:"Hunter",cost:90,range:178,fireRate:1.3,damage:34,projectileSpeed:500,color:"#f59e0b",hood:"#78350f",upgradeCost:110,sellFactor:.7,kind:"arrow"},
  mage:{name:"Mage",cost:120,range:150,fireRate:1.15,damage:24,projectileSpeed:390,color:"#a78bfa",hood:"#5b21b6",upgradeCost:130,sellFactor:.72,kind:"magic",splash:46},
  bomb:{name:"Bomb Tower",cost:140,range:140,fireRate:1.55,damage:48,projectileSpeed:320,color:"#ef4444",hood:"#7f1d1d",upgradeCost:150,sellFactor:.74,kind:"bomb",splash:64}
};


const STAGE_BOSS = {
  1: { name: "Ancient Treant Skull", color: "#84cc16" },
  2: { name: "Ruin Warden", color: "#94a3b8" },
  3: { name: "Grave Necromancer", color: "#a78bfa" },
  4: { name: "Iron Castellan", color: "#f59e0b" },
  5: { name: "Catacomb Devourer", color: "#fb7185" },
  6: { name: "Dark Portal Overlord", color: "#c084fc" }
};

const AURA_REWARDS = {
  inferno: {
    id:"inferno",
    name:"Inferno Core",
    icon:"🔥",
    className:"inferno",
    color:"#fb923c",
    desc:"Arde țintele agresiv și face explozie la kill pentru clear de valuri.",
    bullets:["Burn 3s","35% damage/sec din lovitură","Explozie 60% damage la kill"]
  },
  frost: {
    id:"frost",
    name:"Frost Crown",
    icon:"❄",
    className:"frost",
    color:"#67e8f9",
    desc:"Slow puternic, apoi freeze real după câteva lovituri pe aceeași țintă.",
    bullets:["Slow 22% timp de 1.8s","Freeze 0.9s după 4 hituri","Freeze cooldown 4s / enemy"]
  },
  storm: {
    id:"storm",
    name:"Storm Sigil",
    icon:"⚡",
    className:"storm",
    color:"#fde047",
    desc:"Lovește ținta principală și sare instant spre alte ținte apropiate.",
    bullets:["2 chain jumps","65% chain damage","+20% damage dacă e single target"]
  },
  wealth: {
    id:"wealth",
    name:"Golden Pact",
    icon:"💰",
    className:"wealth",
    color:"#fbbf24",
    desc:"Transformă turnul într-un motor de snowball cu gold, score și buff temporar.",
    bullets:["+40% gold la kill","+25 bonus score la kill","Pact Surge la fiecare 8 killuri"]
  }
};

let currentStage = 1, path = STAGES[currentStage].route, pathCells = buildPathCells(path);
let units = [], enemies = [], projectiles = [], particles = [], popups = [], placementEffects = [], upgradeEffects = [];
let money = START_MONEY, lives = START_LIVES, score = 0, bonusScore = 0, kills = 0;
let wave = 1, stageWave = 1, waveActive = false, spawnLeft = 0, selectedUnitType = "archer", selectedPlacedUnitId = null;
let spawnTimer = 0, idCounter = 1, lastTime = 0, hoveredCell = null, isPaused = false, hasStarted = false, bossBannerTimer = 0, stageStartLives = START_LIVES;
let currentMode = "campaign", endlessUnlocked = false;
let bossFxTimer = 0;
let bossFxType = "";
let reservePool = { archer:[], hunter:[], mage:[], bomb:[] };
let view = { scale: 1, minScale: 1, maxScale: 1.45, offsetX: 0, offsetY: 0 };
let pinchState = null;
let isMuted = false;
let selectedSpell = null;
const spellCooldown = { slow:0, damage:0, bomb:0 };
const spellConfig = {
  slow: { cooldown: 18, radius: 92, factor: 0.45, duration: 3.2 },
  damage: { cooldown: 24, radius: 84, damage: 160 },
  bomb: { cooldown: 16, range: 120, damage: 90, chains: 4 }
};

let pendingAuraDraft = null;
let pendingAuraChoice = null;
let pendingBossResolution = null;

let leaderboardRun = { runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:"campaign" };
let leaderboardRunPromise = null;

const achievements = { first_kill:false, builder:false, boss_hunter:false, rich:false, wave_master:false, survivor:false };


function randomAuraDraft(count=3){
  const pool = Object.values(AURA_REWARDS).slice();
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

function getAuraData(auraType){
  return auraType ? AURA_REWARDS[auraType] || null : null;
}

function getAuraAdjustedStats(unit){
  const stats = {
    damage: unit.damage,
    range: unit.range,
    fireRate: unit.fireRate,
    projectileSpeed: unit.projectileSpeed || 0,
    splash: unit.splash || 0
  };
  if(unit.auraType === "inferno"){
    stats.damage *= 1.12;
  } else if(unit.auraType === "frost"){
    stats.damage *= 0.96;
  } else if(unit.auraType === "storm"){
    stats.damage *= 1.00;
  } else if(unit.auraType === "wealth"){
    const surgeActive = (unit.wealthSurgeTimer || 0) > 0;
    if(surgeActive){
      stats.fireRate *= 0.80;
      stats.projectileSpeed *= 1.20;
    }
  }
  return stats;
}

function getProjectileColorByAura(unit, fallbackColor){
  if(unit.auraType === "inferno") return "#fb923c";
  if(unit.auraType === "frost") return "#67e8f9";
  if(unit.auraType === "storm") return "#fde047";
  if(unit.auraType === "wealth") return "#fbbf24";
  return fallbackColor;
}

function markEnemyHit(enemy, unit, damageDone){
  if(!enemy || !unit) return;
  enemy.lastHitByUnitId = unit.id;
  enemy.lastHitAuraType = unit.auraType || null;
  enemy.lastHitDamage = damageDone || 0;
}

function applyAuraStatusOnEnemy(enemy, unit, pos, damageDone=0){
  if(!enemy || !unit || !unit.auraType) return;
  if(unit.auraType === "inferno"){
    enemy.burnTimer = Math.max(enemy.burnTimer || 0, 3.0);
    enemy.burnDps = Math.max(enemy.burnDps || 0, Math.max(16, damageDone * 0.35));
  } else if(unit.auraType === "frost"){
    enemy.auraSlowTimer = Math.max(enemy.auraSlowTimer || 0, 1.8);
    enemy.auraSlowFactor = Math.min(enemy.auraSlowFactor || 1, 0.78);
    enemy.frostHits = (enemy.frostHits || 0) + 1;
    enemy.freezeLockTimer = Math.max(0, enemy.freezeLockTimer || 0);
    if(enemy.frostHits >= 4 && enemy.freezeLockTimer <= 0){
      enemy.freezeTimer = Math.max(enemy.freezeTimer || 0, 0.9);
      enemy.freezeLockTimer = 4.0;
      enemy.frostHits = 0;
      if(pos) showPopup(pos.x, pos.y - 14, "Freeze!", "#67e8f9");
    }
  }
}

function chainStormDamage(sourceEnemy, sourceUnit, sourcePos){
  if(!sourceUnit || sourceUnit.auraType !== "storm") return;
  const stats = getAuraAdjustedStats(sourceUnit);
  const chainDamage = stats.damage * 0.65;
  const chainRange = 95;
  const maxJumps = sourceUnit.level >= 4 ? 3 : 2;
  const visited = new Set([sourceEnemy.id]);
  let currentPos = sourcePos;
  let jumpsDone = 0;
  for(let jump=0;jump<maxJumps;jump++) {
    const next = enemies
      .filter(enemy => !visited.has(enemy.id))
      .map(enemy => ({ enemy, pos:getPathPosition(enemy.progress), dist:distance(currentPos, getPathPosition(enemy.progress)) }))
      .filter(item => item.dist <= chainRange)
      .sort((a,b)=>a.dist-b.dist)[0];
    if(!next) break;
    visited.add(next.enemy.id);
    next.enemy.hp -= chainDamage;
    markEnemyHit(next.enemy, sourceUnit, chainDamage);
    addHitParticles(next.pos.x, next.pos.y, 8, "#fde047");
    showPopup(next.pos.x, next.pos.y - 10, `-${Math.round(chainDamage)}`, "#fde047");
    particles.push({ x:next.pos.x, y:next.pos.y, vx:0, vy:0, life:.12, maxLife:.12, color:"#fde047" });
    currentPos = next.pos;
    jumpsDone += 1;
  }
  if(jumpsDone === 0 && sourceEnemy){
    const bonusDamage = stats.damage * 0.20;
    sourceEnemy.hp -= bonusDamage;
    markEnemyHit(sourceEnemy, sourceUnit, bonusDamage);
    addHitParticles(sourcePos.x, sourcePos.y, 6, "#fde047");
    showPopup(sourcePos.x, sourcePos.y - 18, `+${Math.round(bonusDamage)} storm`, "#fde047");
  }
}

function triggerInfernoExplosion(deadEnemy){
  if(deadEnemy.lastHitAuraType !== "inferno") return;
  const center = getPathPosition(deadEnemy.progress);
  const owner = getUnitById(deadEnemy.lastHitByUnitId);
  const ownerStats = owner ? getAuraAdjustedStats(owner) : null;
  const dmg = ownerStats ? ownerStats.damage * (owner && (owner.type === "mage" || owner.type === "bomb") ? 0.75 : 0.60) : 65;
  for(const enemy of enemies){
    if(enemy.id === deadEnemy.id) continue;
    const pos = getPathPosition(enemy.progress);
    if(distance(center, pos) <= 55){
      enemy.hp -= dmg;
      if(owner) markEnemyHit(enemy, owner, dmg);
      addHitParticles(pos.x, pos.y, 8, "#fb923c");
      showPopup(pos.x, pos.y - 12, `-${Math.round(dmg)}`, "#fb923c");
    }
  }
  burstSpellParticles(center.x, center.y, "#fdba74", "#fb923c", 20);
}

function renderAuraRewardCards(){
  if(!auraRewardList || !pendingAuraDraft) return;
  auraRewardList.innerHTML = pendingAuraDraft.map(aura => `
    <button class="reward-card ${aura.className}" data-aura-id="${aura.id}" type="button">
      <div class="reward-card-icon">${aura.icon}</div>
      <div class="reward-card-title">${aura.name}</div>
      <div class="reward-card-sub">${aura.desc}</div>
      <div class="reward-card-points">${aura.bullets.map(item => `<span>• ${item}</span>`).join("")}</div>
    </button>
  `).join("");
}

function showAuraRewardOverlay(){
  if(!auraRewardOverlay) return;
  pendingAuraDraft = randomAuraDraft(3);
  pendingAuraChoice = null;
  renderAuraRewardCards();
  auraRewardText.textContent = "Boss-ul a fost învins. Alege 1 din 3 aura legendare, apoi aplic-o pe un singur turn. Aura rămâne pe acel turn și în stage-urile următoare.";
  auraRewardNote.textContent = units.length ? "Alege reward-ul, apoi dă click pe turnul pe care vrei să rămână aura." : "Nu ai niciun turn pe hartă. Reward-ul va fi sărit.";
  auraRewardOverlay.classList.remove("hidden");
  isPaused = true;
  updateUI();
}

function hideAuraRewardOverlay(){
  auraRewardOverlay?.classList.add("hidden");
}

function beginBossAuraReward(){
  if(!units.length){
    pushNotification("stage", "Aura ratată", "Nu exista niciun turn pe hartă pentru reward-ul de boss.");
    resolveBossWaveCompletion();
    return;
  }
  showAuraRewardOverlay();
}

function applyPendingAuraToUnit(unit){
  if(!pendingAuraChoice || !unit) return false;
  unit.auraType = pendingAuraChoice.id;
  unit.auraName = pendingAuraChoice.name;
  unit.auraIcon = pendingAuraChoice.icon;
  pendingAuraChoice = null;
  hideAuraRewardOverlay();
  pushNotification("achievement", "Aura aplicată", `${unit.name} a primit ${unit.auraName}. Va păstra aura și în stage-urile următoare.`);
  setMessage(`${unit.name} a primit ${unit.auraName}.`);
  showPopup(cellCenter(unit.c, unit.r).x, cellCenter(unit.c, unit.r).y - 18, unit.auraName, getAuraData(unit.auraType)?.color || "#fde68a");
  resolveBossWaveCompletion();
  return true;
}

function resolveBossWaveCompletion(){
  hideAuraRewardOverlay();
  const resolution = pendingBossResolution;
  pendingBossResolution = null;
  if(!resolution) return;

  if(resolution.type === "campaign-next-stage") {
    wave += 1;
    moveUnitsToReserve();
    applyStage(resolution.nextStage,false);
    pushNotification("stage","Stage Clear",`Ai trecut în Stage ${currentStage} — ${STAGES[currentStage].name}. Unitățile tale au fost mutate în rezervă.`);
    saveProgress();
    setMessage(`Stage clear! Ai ajuns în Stage ${currentStage} — ${STAGES[currentStage].name}.`);
  } else if(resolution.type === "unlock-endless") {
    endlessUnlocked = true;
    try { localStorage.setItem("sdcEndlessUnlocked","1"); } catch(e){}
    pushNotification("stage","Endless Mode unlocked",`Ai terminat campania. Endless Mode este acum deblocat!`);
    currentMode="endless";
    currentStage=6;
    path=STAGES[6].route; pathCells=buildPathCells(path);
    stageWave = 1;
    wave += 1;
    moveUnitsToReserve();
    saveProgress();
    setMessage(`Ai terminat povestea principală. Endless Mode a fost deblocat.`);
  } else if(resolution.type === "endless-next") {
    stageWave += 1;
    wave += 1;
    money += 50;
    bonusScore += 80;
    pushNotification("stage","Endless Boss down",`Continuă! Endless wave ${stageWave} urmează.`);
  }
  isPaused = false;
  updateUI();
}



async function requestLeaderboardRun(modeHint=currentMode){
  try{
    const response = await fetch("/.netlify/functions/start-run", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ mode: modeHint === "endless" ? "endless" : "campaign" })
    });
    if(!response.ok) throw new Error("run token unavailable");
    const data = await response.json();
    if(!data?.runId || !data?.runToken) throw new Error("invalid run token");
    leaderboardRun = {
      runId: data.runId,
      runToken: data.runToken,
      expiresAt: Number(data.expiresAt || 0),
      clientStartedAt: Date.now(),
      mode: data.mode || modeHint || currentMode
    };
    return leaderboardRun;
  }catch(error){
    leaderboardRun = { runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:modeHint || currentMode };
    throw error;
  }
}

function prewarmLeaderboardRun(modeHint=currentMode){
  leaderboardRunPromise = requestLeaderboardRun(modeHint).catch(()=>null).finally(()=>{ leaderboardRunPromise = null; });
  return leaderboardRunPromise;
}

async function ensureLeaderboardRun(modeHint=currentMode){
  const mode = modeHint || currentMode;
  const stillValid = leaderboardRun.runId && leaderboardRun.runToken && leaderboardRun.expiresAt > (Date.now() + 5000) && leaderboardRun.mode === mode;
  if(stillValid) return leaderboardRun;
  if(leaderboardRunPromise) {
    try{ await leaderboardRunPromise; }catch(e){}
    if(leaderboardRun.runId && leaderboardRun.runToken && leaderboardRun.expiresAt > (Date.now() + 5000) && leaderboardRun.mode === mode) return leaderboardRun;
  }
  return await requestLeaderboardRun(mode);
}

async function loadBonusLeaderboard(){
  if(!bonusLeaderboardList) return;
  bonusLeaderboardSubtitle.textContent = "Încarc topul global pentru Endless bonus score...";
  try{
    const response = await fetch("/.netlify/functions/get-bonus-leaderboard", { cache: "no-store" });
    if(!response.ok) throw new Error("Leaderboard unavailable");
    const rows = await response.json();
    if(!Array.isArray(rows) || rows.length === 0){
      bonusLeaderboardList.innerHTML = '<div class="leaderboard-empty">Nicio rundă Endless trimisă încă.</div>';
      bonusLeaderboardSubtitle.textContent = "Fii primul care urcă un bonus score.";
      return;
    }
    bonusLeaderboardList.innerHTML = rows.slice(0,5).map((row, index) => {
      const safeName = String(row.player_name || "Anonim").replace(/[&<>"]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
      const bonus = Number(row.bonus_score || 0);
      const waveReached = Number(row.wave_reached || 0);
      return `
        <div class="leaderboard-row">
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="leaderboard-main">
            <span class="leaderboard-name">${safeName}</span>
            <span class="leaderboard-meta">Wave ${waveReached}</span>
          </div>
          <div class="leaderboard-score">+${bonus}</div>
        </div>
      `;
    }).join("");
    const best = rows[0];
    bonusLeaderboardSubtitle.textContent = `Record: ${best.player_name} cu bonus +${best.bonus_score}.`;
  }catch(error){
    bonusLeaderboardList.innerHTML = '<div class="leaderboard-empty">Leaderboard indisponibil momentan.</div>';
    bonusLeaderboardSubtitle.textContent = "Conectează Netlify Functions + Neon pentru top global.";
  }
}

async function submitBonusLeaderboardScore(){
  if(currentMode !== "endless" || bonusScore <= 0) return;
  let playerName = "";
  try{
    playerName = localStorage.getItem("sdcPlayerName") || "";
  }catch(e){}
  if(!playerName){
    playerName = prompt("Numele pentru Endless Bonus leaderboard:") || "";
  }
  playerName = playerName.trim().slice(0, 20);
  if(!playerName) return;
  try{
    localStorage.setItem("sdcPlayerName", playerName);
  }catch(e){}
  try{
    await ensureLeaderboardRun("endless");
    const response = await fetch("/.netlify/functions/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playerName,
        score: totalScore(),
        bonusScore: bonusScore,
        wave: wave,
        kills: kills,
        runId: leaderboardRun.runId,
        runToken: leaderboardRun.runToken,
        clientStartedAt: leaderboardRun.clientStartedAt,
        elapsedMs: leaderboardRun.clientStartedAt ? (Date.now() - leaderboardRun.clientStartedAt) : 0
      })
    });
    if(!response.ok) throw new Error("submit failed");
    leaderboardRun = { runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:"endless" };
    await loadBonusLeaderboard();
    pushNotification("achievement", "Leaderboard trimis", `${playerName} a urcat bonus +${bonusScore} în topul global.`);
  }catch(error){
    pushNotification("stage", "Leaderboard offline", "Scorul global nu a putut fi trimis acum.");
  }
}


let audioCtx = null;
let audioAssets = null;

function createAudioPool(src, size, volume, loop=false){
  const items = Array.from({ length: size }, () => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    audio.loop = loop;
    return audio;
  });
  let index = 0;
  return {
    play(restart=true){
      if(isMuted) return;
      const audio = items[index % items.length];
      index += 1;
      if(restart) audio.currentTime = 0;
      audio.play().catch(()=>{});
    },
    stop(){
      for(const audio of items){
        audio.pause();
        audio.currentTime = 0;
      }
    },
    setMuted(value){
      for(const audio of items){
        audio.muted = value;
      }
    },
    get first(){
      return items[0];
    }
  };
}

function ensureAudio(){
  if(!audioCtx){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(Ctx) audioCtx = new Ctx();
  }
  if(audioCtx && audioCtx.state==="suspended") audioCtx.resume();

  if(!audioAssets){
    audioAssets = {
      arrow: createAudioPool("archer_hunter_shot.mp3", 8, 0.55),
      mage: createAudioPool("mage_shot.mp3", 8, 0.55),
      upgrade: createAudioPool("upgrade.mp3", 4, 0.72),
      boss: createAudioPool("boss_entry.mp3", 1, 0.65, true)
    };
  }
}

function tone(type, a, b, d, v){
  if(!audioCtx || isMuted) return;
  const n=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type; o.frequency.setValueAtTime(a,n); o.frequency.exponentialRampToValueAtTime(Math.max(40,b),n+d);
  g.gain.setValueAtTime(.0001,n); g.gain.exponentialRampToValueAtTime(v,n+Math.min(d*.25,.02)); g.gain.exponentialRampToValueAtTime(.0001,n+d);
  o.connect(g); g.connect(audioCtx.destination); o.start(n); o.stop(n+d);
}
function playShootSound(kind="arrow"){
  ensureAudio();
  if(kind==="magic") audioAssets.mage.play();
  else audioAssets.arrow.play();
}
function playHitSound(){ tone("square",220,120,.06,.012); }
function playDeathSound(){ tone("triangle",320,90,.12,.018); }
function playWaveSound(){ tone("sine",480,760,.18,.03); }
function playUpgradeSound(){ ensureAudio(); audioAssets.upgrade.play(); }
function startBossLoop(){
  ensureAudio();
  if(isMuted || !audioAssets) return;
  const bossAudio = audioAssets.boss.first;
  if(bossAudio.paused){
    bossAudio.currentTime = 0;
    bossAudio.play().catch(()=>{});
  }
}
function stopBossLoop(){
  if(audioAssets) audioAssets.boss.stop();
}


function buildPathCells(route){
  const s=new Set();
  for(let i=0;i<route.length-1;i++){
    const a=route[i], b=route[i+1];
    if(a.c===b.c){ for(let r=Math.min(a.r,b.r); r<=Math.max(a.r,b.r); r++) s.add(`${a.c}-${r}`); }
    else { for(let c=Math.min(a.c,b.c); c<=Math.max(a.c,b.c); c++) s.add(`${c}-${a.r}`); }
  }
  return s;
}
function cellCenter(c,r){ return {x:c*CELL+CELL/2,y:r*CELL+CELL/2}; }
function getPathPosition(progress){
  const points=path.map(p=>cellCenter(p.c,p.r)), segs=[]; let total=0;
  for(let i=0;i<points.length-1;i++){ const a=points[i], b=points[i+1], len=Math.hypot(b.x-a.x,b.y-a.y); segs.push({a,b,len}); total+=len; }
  let target=progress*total;
  for(const seg of segs){ if(target<=seg.len){ const t=seg.len===0?0:target/seg.len; return {x:seg.a.x+(seg.b.x-seg.a.x)*t,y:seg.a.y+(seg.b.y-seg.a.y)*t}; } target-=seg.len; }
  return points[points.length-1];
}
function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); }
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const enemyCountForWave=(n)=>6+(n-1)*2;
const setMessage=(t)=>messageBox.textContent=t;
function hideHintChip(){ hintChip?.classList.add("hidden-chip"); }
function showHintChip(){ hintChip?.classList.remove("hidden-chip"); }
function updateHintChip(){
  if(!hintChip) return;
  let text = "Click pe celule libere pentru plasare.";
  if(pendingAuraChoice){
    text = "Alege turnul care primește aura legendară.";
  } else if(selectedSpell === "slow"){
    text = "Target Frost Nova pe zona dorită.";
  } else if(selectedSpell === "damage"){
    text = "Target Meteor Strike pe grupul de inamici.";
  } else if(selectedSpell === "bomb"){
    text = "Target Chain Lightning aproape de ținte.";
  } else if(selectedPlacedUnitId){
    text = "Turn selectat — upgrade sau sell din meniul popup.";
  } else if(unitInfoPanel && !unitInfoPanel.classList.contains("hidden")){
    text = "Shop deschis — alege unitatea potrivită pentru wave.";
  } else if(waveActive){
    text = "Wave activ — folosește spells și urmărește boss wave.";
  }
  hintChip.textContent = text;
}
const getUnitById=(id)=>units.find(u=>u.id===id)||null;
const reserveCount=(type)=>reservePool[type]?.length||0;
const reserveLevelLabel=(type)=>{ const pool=reservePool[type]||[]; return pool.length ? "Rezervă: "+pool.map(u=>`Lv.${u.level||1}`).join(", ") : ""; };

function vibrate(pattern){
  try{
    if(navigator.vibrate) navigator.vibrate(pattern);
  }catch(e){}
}

function updateAudioToggle(){
  if(!audioToggle) return;
  audioToggle.textContent = isMuted ? "🔇" : "🔊";
  audioToggle.classList.toggle("muted", isMuted);
  audioToggle.setAttribute("aria-label", isMuted ? "Sunet oprit" : "Sunet pornit");
  audioToggle.title = isMuted ? "Sunet oprit" : "Sunet pornit";
}


function updateSpellButtons(){
  const map = [
    ["slow", spellSlowBtn, spellSlowTimer],
    ["damage", spellDamageBtn, spellDamageTimer],
    ["bomb", spellBombBtn, spellBombTimer]
  ];
  for(const [key, btn, timerEl] of map){
    if(!btn || !timerEl) continue;
    const cd = spellCooldown[key];
    const ready = cd <= 0;
    btn.disabled = !hasStarted || lives<=0 || !ready;
    btn.classList.toggle("active", selectedSpell === key);
    timerEl.textContent = ready ? (selectedSpell===key ? "Target" : "Ready") : `${cd.toFixed(1)}s`;
  }
}

function cancelSpellSelection(){
  selectedSpell = null;
  updateSpellButtons();
}

function burstSpellParticles(x, y, colorA, colorB, count=18){
  for(let i=0;i<count;i++){
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
    const speed = 40 + Math.random() * 70;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: .24 + Math.random() * .16,
      maxLife: .42,
      color: i % 2 ? colorA : colorB
    });
  }
}

function castSlowSpell(x, y){
  if(spellCooldown.slow > 0) return false;
  const cfg = spellConfig.slow;
  let affected = 0;
  for(const enemy of enemies){
    const pos = getPathPosition(enemy.progress);
    if(distance({x,y}, pos) <= cfg.radius){
      enemy.spellSlowTimer = Math.max(enemy.spellSlowTimer || 0, cfg.duration);
      enemy.spellSlowFactor = Math.min(enemy.spellSlowFactor || 1, cfg.factor);
      affected += 1;
      addHitParticles(pos.x, pos.y, 6, "#93c5fd");
      showPopup(pos.x, pos.y - 10, "Slow!", "#93c5fd");
    }
  }
  placementEffects.push({x,y,color:"#93c5fd",life:.45,maxLife:.45});
  burstSpellParticles(x, y, "#dbeafe", "#93c5fd", 18);
  spellCooldown.slow = cfg.cooldown;
  cancelSpellSelection();
  setMessage(affected ? `Frost Nova a încetinit ${affected} inamici.` : "Frost Nova lansată.");
  updateUI();
  return true;
}

function castDamageSpell(x, y){
  if(spellCooldown.damage > 0) return false;
  const cfg = spellConfig.damage;
  let affected = 0;
  for(const enemy of enemies){
    const pos = getPathPosition(enemy.progress);
    if(distance({x,y}, pos) <= cfg.radius){
      enemy.hp -= cfg.damage;
      affected += 1;
      addHitParticles(pos.x, pos.y, 10, "#fb923c");
      showPopup(pos.x, pos.y - 10, `-${cfg.damage}`, "#fb923c");
    }
  }
  placementEffects.push({x,y,color:"#fb923c",life:.52,maxLife:.52});
  burstSpellParticles(x, y, "#fdba74", "#fb923c", 22);
  showPopup(x, y - cfg.radius - 6, "Meteor!", "#fdba74");
  spellCooldown.damage = cfg.cooldown;
  cancelSpellSelection();
  setMessage(affected ? `Meteor Strike a lovit ${affected} inamici.` : "Meteor Strike lansat.");
  updateUI();
  return true;
}

function castBombSpell(x, y){
  if(spellCooldown.bomb > 0) return false;
  const cfg = spellConfig.bomb;
  const inRange = enemies
    .map(enemy => {
      const pos = getPathPosition(enemy.progress);
      return { enemy, pos, dist: distance({x,y}, pos) };
    })
    .filter(item => item.dist <= cfg.range)
    .sort((a,b)=>a.dist-b.dist)
    .slice(0, cfg.chains);

  let affected = 0;
  for(const item of inRange){
    item.enemy.hp -= cfg.damage;
    affected += 1;
    addHitParticles(item.pos.x, item.pos.y, 8, "#fde047");
    showPopup(item.pos.x, item.pos.y - 10, `-${cfg.damage}`, "#fde047");
  }

  placementEffects.push({x,y,color:"#fde047",life:.32,maxLife:.32});
  burstSpellParticles(x, y, "#fde68a", "#fde047", 14);
  spellCooldown.bomb = cfg.cooldown;
  cancelSpellSelection();
  setMessage(affected ? `Chain Lightning a lovit ${affected} inamici.` : "Chain Lightning lansat.");
  updateUI();
  return true;
}


function resetCamera(){
  view.scale = 1;
  view.offsetX = 0;
  view.offsetY = 0;
  clampView();
  if(selectedPlacedUnitId) updateSelectedPanel();
}

function clampView(){
  const minOffsetX = canvas.width - canvas.width * view.scale;
  const minOffsetY = canvas.height - canvas.height * view.scale;
  view.offsetX = Math.min(0, Math.max(minOffsetX, view.offsetX));
  view.offsetY = Math.min(0, Math.max(minOffsetY, view.offsetY));
}

function setZoom(nextScale, anchorX, anchorY){
  const oldScale = view.scale;
  const newScale = Math.max(view.minScale, Math.min(view.maxScale, nextScale));
  if(newScale === oldScale) return;
  view.offsetX = anchorX - ((anchorX - view.offsetX) * (newScale / oldScale));
  view.offsetY = anchorY - ((anchorY - view.offsetY) * (newScale / oldScale));
  view.scale = newScale;
  clampView();
  if(selectedPlacedUnitId) updateSelectedPanel();
}

function worldToScreen(x, y){
  return {
    x: x * view.scale + view.offsetX,
    y: y * view.scale + view.offsetY
  };
}

function screenToWorld(x, y){
  return {
    x: (x - view.offsetX) / view.scale,
    y: (y - view.offsetY) / view.scale
  };
}


function hideUnitInfoPanel(){
  unitInfoPanel?.classList.add("hidden");
  resetCameraBtn?.classList.remove("active");
}

function showUnitInfoPanel(){
  unitInfoPanel?.classList.remove("hidden");
  resetCameraBtn?.classList.add("active");
}

function toggleUnitInfoPanel(){
  if(unitInfoPanel?.classList.contains("hidden")) showUnitInfoPanel();
  else hideUnitInfoPanel();
}

function syncUnitSelectors(){
  unitButtons.forEach((btn)=>btn.classList.toggle("active", btn.dataset.type===selectedUnitType));
  unitInfoButtons.forEach((btn)=>btn.classList.toggle("active", btn.dataset.type===selectedUnitType));
}

function hideTowerMenu(){
  towerMenu?.classList.add("hidden");
}

function showTowerMenu(unit){
  if(!towerMenu || !canvasWrap) return;
  const worldPos = cellCenter(unit.c, unit.r);
  const pos = worldToScreen(worldPos.x, worldPos.y);

  const aura = getAuraData(unit.auraType);
  const stats = getAuraAdjustedStats(unit);
  towerMenuName.textContent = unit.name;
  towerMenuLevel.textContent = `Lv.${unit.level}${aura ? ` · ${aura.icon} ${aura.name}` : ""}`;
  if(towerMenuAura){
    towerMenuAura.textContent = aura ? aura.name : "Standard";
    towerMenuAura.style.color = aura ? (aura.color || "#7dd3fc") : "#7dd3fc";
    towerMenuAura.style.borderColor = aura ? `${aura.color}44` : "rgba(56,189,248,.18)";
    towerMenuAura.style.background = aura ? `${aura.color}22` : "rgba(56,189,248,.12)";
  }
  towerMenuStats.innerHTML = `
    <div class="tower-stat-row"><span>Damage</span><strong>${Math.round(stats.damage)}</strong></div>
    <div class="tower-stat-row"><span>Range</span><strong>${Math.round(stats.range)}</strong></div>
    <div class="tower-stat-row"><span>Speed</span><strong>${stats.fireRate.toFixed(2)}s</strong></div>
    <div class="tower-stat-row"><span>Upgrade</span><strong>${Math.round(unit.nextUpgradeCost)}</strong></div>
    <div class="tower-stat-row"><span>Sell</span><strong>${Math.round(unit.totalSpent * unit.sellFactor)}</strong></div>
  `;
  towerUpgradeBtn.disabled = money < unit.nextUpgradeCost;

  const wrapRect = canvasWrap.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const cssX = (pos.x / canvas.width) * canvasRect.width + (canvasRect.left - wrapRect.left);
  const cssY = (pos.y / canvas.height) * canvasRect.height + (canvasRect.top - wrapRect.top);

  towerMenu.style.left = `${cssX}px`;
  towerMenu.style.top = `${cssY - 12}px`;
  towerMenu.classList.remove("hidden");
}


function moveUnitsToReserve(){
  for(const unit of units){
    const copy=structuredClone(unit);
    copy.id=null; copy.c=null; copy.r=null; copy.cooldown=0; copy.aimAngle=-0.3;
    reservePool[unit.type].push(copy);
  }
  units=[];
}
function createPlacedUnit(c,r,typeKey){
  const base=UNIT_TYPES[typeKey];
  return { id:idCounter++, c,r, type:typeKey, cooldown:0, aimAngle:-0.3, level:1, totalSpent:base.cost, nextUpgradeCost:base.upgradeCost, wealthKills:0, wealthSurgeTimer:0, ...structuredClone(base) };
}
function createFreshUnitForPlacement(typeKey,c,r){
  const unit=createPlacedUnit(c,r,typeKey);
  unit.id=idCounter++; unit.c=c; unit.r=r; unit.cooldown=0; unit.aimAngle=-0.3; unit.level=1; unit.totalSpent=UNIT_TYPES[typeKey].cost; unit.nextUpgradeCost=UNIT_TYPES[typeKey].upgradeCost;
  return unit;
}
function takeReservedUnit(typeKey,c,r){
  if(!reservePool[typeKey] || reservePool[typeKey].length===0) return null;
  const unit=reservePool[typeKey].shift();
  unit.id=idCounter++; unit.c=c; unit.r=r; unit.cooldown=0; unit.aimAngle=-0.3;
  return unit;
}

function showPopup(x,y,text,color="#fde68a"){ popups.push({x,y,text,color,life:.8,maxLife:.8}); }
function showNotificationToast(type, title, text){
  if(!canvasWrap) return;
  const toast = document.createElement("div");
  toast.className = `notification-toast ${type}`;
  toast.innerHTML = `<div class="notification-title">${title}</div><div class="notification-meta">${text}</div>`;
  canvasWrap.appendChild(toast);
  setTimeout(()=>{
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-6px)";
    setTimeout(()=>toast.remove(), 180);
  }, 2200);
}

function pushNotification(type,title,text){
  if(!notificationFeed) return;
  notificationEmpty?.classList.add("hidden");
  notificationFeed.classList.remove("hidden");
  notificationBadge?.classList.remove("hidden");

  const item=document.createElement("div");
  item.className=`notification-item ${type}`;
  item.innerHTML=`<div class="notification-title">${title}</div><div class="notification-meta">${text}</div>`;
  notificationFeed.prepend(item);

  while(notificationFeed.children.length>8) notificationFeed.removeChild(notificationFeed.lastElementChild);

  if(notificationPanel?.classList.contains("collapsed")){
    showNotificationToast(type, title, text);
  }
}
function clearNotifications(){
  if(!notificationFeed) return;
  notificationFeed.innerHTML="";
  notificationFeed.classList.add("hidden");
  notificationEmpty?.classList.remove("hidden");
  notificationBadge?.classList.add("hidden");
}
const addScore=(base,bonus=0)=>{ score+=base; bonusScore+=bonus; };
const totalScore=()=>score+bonusScore;

function saveProgress(){
  try{
    const best=Math.max(totalScore(), Number(localStorage.getItem("sdcBestScore")||0));
    const furthest=Math.max(currentStage, Number(localStorage.getItem("sdcFurthestStage")||1));
    localStorage.setItem("sdcBestScore", String(best));
    localStorage.setItem("sdcFurthestStage", String(furthest));
    localStorage.setItem("sdcEndlessUnlocked", endlessUnlocked ? "1" : localStorage.getItem("sdcEndlessUnlocked") || "0");
  }catch(e){}
}
function loadProgressNotice(){
  try{
    const best=Number(localStorage.getItem("sdcBestScore")||0);
    const furthest=Number(localStorage.getItem("sdcFurthestStage")||1);
    endlessUnlocked = localStorage.getItem("sdcEndlessUnlocked")==="1";
    if(best>0 || furthest>1 || endlessUnlocked){
      pushNotification("stage","Progres salvat",`Best score: ${best} · Furthest stage: ${furthest}${endlessUnlocked ? " · Endless unlocked" : ""}`);
    }
  }catch(e){}
}

function unlockAchievement(key){
  if(achievements[key]) return;
  achievements[key]=true;
  const titles={first_kill:"First Blood",builder:"Builder",boss_hunter:"Boss Hunter",rich:"Treasurer",wave_master:"Wave Master",survivor:"Survivor"};
  showPopup(canvas.width/2,40,"Achievement unlocked!","#bbf7d0");
  pushNotification("achievement",`🏆 ${titles[key]||"Achievement"}`,"Achievement nou deblocat.");
}
function checkAchievements(){
  if(kills>=1) unlockAchievement("first_kill");
  if(units.length>=5) unlockAchievement("builder");
  if(money>=500) unlockAchievement("rich");
  if(wave>=10) unlockAchievement("wave_master");
}

function updateSelectedPanel(){
  const unit=getUnitById(selectedPlacedUnitId);
  if(!unit){
    hideTowerMenu();
    return;
  }
  showTowerMenu(unit);
}

function updateUI(){
  moneyBadge.textContent=`💰 ${money}`;
  livesBadge.textContent=`❤️ ${lives}`;
  waveBadge.textContent=`🌊 Wave ${wave}`;
  stageBadge.textContent=currentMode==="campaign" ? `🗺️ Stage ${currentStage} · ${STAGES[currentStage].name}` : `♾️ Endless · Stage ${currentStage}`;
  if(waveActive){
    const total=enemyCountForWave(stageWave)+(stageWave===STAGES[currentStage].bossWave?1:0);
    const progress=((total-spawnLeft)/total)*100;
    waveFill.style.width=`${Math.max(0,Math.min(100,progress))}%`;
    progressText.textContent=`${Math.round(progress)}%`;
    statusPill.textContent=isPaused?"Paused":"Battle";
  }else{
    waveFill.style.width="0%";
    progressText.textContent=isPaused?"Pauză":"Pregătit";
    statusPill.textContent=lives<=0?"Game Over":(isPaused?"Paused":"Ready");
  }
  enemyCountStat.textContent=String(enemies.length);
  towerCountStat.textContent=String(units.length);
  killsStat.textContent=String(kills);
  bossInfoStat.textContent=String(STAGES[currentStage].bossWave);
  scoreStat.textContent=String(totalScore());
  bonusScoreStat.textContent=String(bonusScore);
  stageNumberStat.textContent=String(currentStage);
  stageWaveStat.textContent=String(stageWave);
  modeStat.textContent=currentMode==="campaign" ? "Story" : "Endless";
  bestScoreStat.textContent=String(Number(localStorage.getItem("sdcBestScore")||0));
  furthestStageStat.textContent=String(Number(localStorage.getItem("sdcFurthestStage")||1));
  endlessUnlockedStat.textContent=endlessUnlocked ? "Yes" : "No";

  startWaveBtn.disabled=waveActive || lives<=0 || isPaused;
  if(pauseBtn){
    pauseBtn.innerHTML = isPaused
      ? '<span class="resume-icon">▶</span><span class="btn-label">Resume</span>'
      : '<span class="pause-icon-wrap" aria-hidden="true"></span><span class="btn-label">Pause</span>';
  }

  Object.entries(reserveBadgeEls).forEach(([key,el])=>{ if(el) el.textContent=String(reserveCount(key)); });
  Object.entries(reservePanelEls).forEach(([key,el])=>{ if(el) el.textContent=String(reserveCount(key)); });
  syncUnitSelectors();
  Object.entries(reserveLevelEls).forEach(([key,el])=>{ if(el) el.textContent=reserveLevelLabel(key); });
  updateSelectedPanel();
  checkAchievements();
  updateSpellButtons();
  updateHintChip();
}

function resetAchievementsUI(){}
function applyStage(stageNumber, resetRun=false){
  currentStage=stageNumber;
  path=STAGES[currentStage].route;
  pathCells=buildPathCells(path);

  units=[]; enemies=[]; projectiles=[]; particles=[]; popups=[]; placementEffects=[]; upgradeEffects=[];
  selectedPlacedUnitId=null; hoveredCell=null; hideTowerMenu();
  waveActive=false; spawnLeft=0; spawnTimer=0; bossBannerTimer=0; bossFxTimer=0; bossFxType=""; isPaused=false; stageWave=1;
  pendingAuraDraft = null; pendingAuraChoice = null; pendingBossResolution = null; hideAuraRewardOverlay();
  stopBossLoop();
  cancelSpellSelection();
  spellCooldown.slow = 0;
  spellCooldown.damage = 0;
  spellCooldown.bomb = 0;

  if(resetRun){
    reservePool={ archer:[], hunter:[], mage:[], bomb:[] };
    money=START_MONEY + (stageNumber-1)*40;
    lives=START_LIVES; score=0; bonusScore=0; kills=0; wave=1;
    Object.keys(achievements).forEach(k=>achievements[k]=false);
    resetAchievementsUI(); clearNotifications();
    currentMode="campaign";
  }else{
    pushNotification("stage","Stage nou",`Ai intrat în Stage ${currentStage} — ${STAGES[currentStage].name}. Boss: ${STAGE_BOSS[currentStage].name}. Unitățile tale sunt în rezervă.`);
  }

  stageStartLives=lives;
  resetCamera();
  setMessage(`A început Stage ${currentStage} — ${STAGES[currentStage].name}. Replasează unitățile din rezervă fără cost.`);
  updateUI();
}
const resetGame=()=>{ showHintChip(); resetCamera(); applyStage(1,true); prewarmLeaderboardRun("campaign"); };

function startWave(){
  if(waveActive || lives<=0 || isPaused || pendingAuraChoice || pendingBossResolution) return;
  ensureAudio();
  const stage=STAGES[currentStage];
  spawnLeft=enemyCountForWave(stageWave)+(stageWave===stage.bossWave?1:0);
  spawnTimer=0; waveActive=true;
  if(stageWave===stage.bossWave) bossBannerTimer=2.2;
  playWaveSound();
  hideHintChip();
  hideTowerMenu();
  setMessage(stageWave===stage.bossWave?`${STAGE_BOSS[currentStage]?.name || "Boss"} a apărut!`:`Wave ${stageWave} a început.`);
  updateUI();
}
function togglePause(){ if(!hasStarted || lives<=0 || pendingAuraChoice || pendingBossResolution) return; isPaused=!isPaused; setMessage(isPaused?"Joc pus pe pauză.":"Joc reluat."); updateUI(); }

function enemyTemplateForSpawn(indexFromEnd){
  const stage=STAGES[currentStage], boss=stageWave===stage.bossWave && indexFromEnd===1;
  if(boss) return {type:"boss",hpMult:4.5*stage.difficulty,speed:.05+currentStage*.003,reward:80};
  const roll=Math.random();
  if(roll < 0.18 + currentStage*0.01) return {type:"fast",hpMult:.75*stage.difficulty,speed:.15+wave*.004,reward:12};
  if(roll < 0.40 + currentStage*0.02) return {type:"tank",hpMult:2.0*stage.difficulty,speed:.07+currentStage*.002,reward:20};
  return {type:"normal",hpMult:1.0*stage.difficulty,speed:.09+wave*.004+currentStage*.002,reward:14};
}
function spawnEnemy(){
  const t=enemyTemplateForSpawn(spawnLeft), hpBase=44+wave*13+currentStage*9;
  const enemy = { id:idCounter++, hp:hpBase*t.hpMult, maxHp:hpBase*t.hpMult, speed:t.speed, progress:0, wobble:Math.random()*Math.PI*2, type:t.type, reward:t.reward, abilityUsed:false, bossName: t.type==="boss" ? STAGE_BOSS[currentStage].name : null };
  enemies.push(enemy);
  if(enemy.type==="boss") startBossLoop();
}

function placeUnit(c,r){
  if(lives<=0) return;
  const key=`${c}-${r}`;
  if(pathCells.has(key)){ setMessage("Nu poți plasa unități pe traseu."); return; }

  const existing=units.find(t=>t.c===c && t.r===r);
  if(existing){ selectedPlacedUnitId=existing.id; setMessage(`Ai selectat ${existing.name}.`); updateUI(); return; }

  const type=UNIT_TYPES[selectedUnitType];
  let unit=null, usedReserve=false;

  if(reserveCount(selectedUnitType)>0){
    unit=takeReservedUnit(selectedUnitType,c,r);
    usedReserve=!!unit;
  }
  if(!unit){
    if(money < type.cost){ setMessage("Nu ai destui bani pentru unitatea aleasă."); return; }
    money -= type.cost;
    unit = createFreshUnitForPlacement(selectedUnitType,c,r);
  }

  units.push(unit);
  selectedPlacedUnitId=null;
  hideTowerMenu();
  const fxPos = cellCenter(c, r);
  addPlacementEffect(fxPos.x, fxPos.y, type.color || "#7dd3fc");
  setMessage(usedReserve ? `${type.name} replasat din rezervă.` : `${type.name} cumpărat și plasat.`);
  updateUI();
}

function upgradeSelectedUnit(){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit) return;
  if(money<unit.nextUpgradeCost){ setMessage("Nu ai destui bani pentru upgrade."); return; }
  money-=unit.nextUpgradeCost; unit.totalSpent+=unit.nextUpgradeCost; unit.level+=1;
  unit.damage*=unit.type==="bomb"?1.3:1.22; unit.range*=1.08; unit.fireRate*=.94;
  if(unit.projectileSpeed) unit.projectileSpeed*=1.05;
  if(unit.splash) unit.splash*=1.08;
  unit.nextUpgradeCost=Math.round(unit.nextUpgradeCost*1.55);
  const fxPos = cellCenter(unit.c, unit.r);
  addUpgradeEffect(fxPos.x, fxPos.y, unit.color || "#7dd3fc");
  playUpgradeSound();
  setMessage(`${unit.name} a fost upgradat la Lv.${unit.level}.`);
  updateUI();
}
function sellSelectedUnit(){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit) return;
  const refund=Math.round(unit.totalSpent*unit.sellFactor);
  money += refund;
  units=units.filter(u=>u.id!==unit.id);
  selectedPlacedUnitId=null;
  setMessage(`${unit.name} vândut pentru ${refund} gold.`);
  updateUI();
}

function addHitParticles(x,y,amount,color){
  for(let i=0;i<amount;i++) particles.push({ x,y,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*90,life:.35+Math.random()*.25,maxLife:.5,color });
}
function addPlacementEffect(x,y,color){
  placementEffects.push({x,y,color,life:.32,maxLife:.32});
  for(let i=0;i<10;i++){
    particles.push({
      x,y,
      vx:(Math.random()-.5)*120,
      vy:-30 + (Math.random()-.5)*60,
      life:.22+Math.random()*.12,
      maxLife:.34,
      color
    });
  }
}

function addUpgradeEffect(x,y,color){
  upgradeEffects.push({x,y,color,life:.5,maxLife:.5});
  for(let i=0;i<14;i++){
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.2;
    const speed = 40 + Math.random() * 60;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 10,
      life: .28 + Math.random() * .14,
      maxLife: .42,
      color: i % 2 === 0 ? "#fde68a" : color
    });
  }
  showPopup(x, y - 18, "Upgrade!", "#fde68a");
}
function applySplashDamage(center,radius,damage,projectileType){
  for(const enemy of enemies){
    const pos=getPathPosition(enemy.progress);
    if(distance(center,pos)<=radius){
      enemy.hp -= damage;
      addHitParticles(pos.x,pos.y,projectileType==="bomb"?6:4,projectileType==="bomb"?"#fb923c":"#c4b5fd");
      showPopup(pos.x,pos.y-10,`-${Math.round(damage)}`,projectileType==="bomb"?"#fb923c":"#c4b5fd");
    }
  }
}
function rewardKill(enemy,pos){
  let reward = enemy.reward;
  let scoreGain = 0;
  money += reward; kills += 1;
  const baseScore=enemy.type==="boss"?300:enemy.type==="tank"?90:enemy.type==="fast"?70:50;
  const scoreBonus=stageWave===STAGES[currentStage].bossWave?40:0;
  addScore(baseScore,scoreBonus);
  if(enemy.lastHitAuraType === "wealth"){
    const owner = getUnitById(enemy.lastHitByUnitId);
    const bonusGold = Math.max(1, Math.round(enemy.reward * 0.40)) + (enemy.type === "boss" ? 120 : 0);
    money += bonusGold;
    bonusScore += 25;
    reward += bonusGold;
    scoreGain = 25;
    if(owner){
      owner.wealthKills = (owner.wealthKills || 0) + 1;
      if(owner.wealthKills % 8 === 0){
        owner.wealthSurgeTimer = 5;
        const ownerPos = cellCenter(owner.c, owner.r);
        showPopup(ownerPos.x, ownerPos.y - 22, "Pact Surge!", "#fbbf24");
        pushNotification("achievement", "Golden Pact surge", `${owner.name} a intrat în Pact Surge pentru 5 secunde.`);
      }
    }
  }
  if(enemy.lastHitAuraType === "inferno") triggerInfernoExplosion(enemy);
  if(enemy.type==="boss") unlockAchievement("boss_hunter");
  showPopup(pos.x,pos.y-16,`+${reward}g`, enemy.lastHitAuraType === "wealth" ? "#fbbf24" : "#fde68a");
  if(scoreGain) showPopup(pos.x, pos.y - 32, `+${scoreGain} bonus`, "#fbbf24");
  addHitParticles(pos.x,pos.y,enemy.type==="boss"?16:8,enemy.type==="boss"?"#f59e0b":"#cbd5e1");
  if(enemy.type==="boss") vibrate([45, 50, 65]);
  playDeathSound();
}
function triggerBossAbility(enemy){
  const ability=STAGES[currentStage].bossAbility;
  if(ability==="summon"){
    for(let i=0;i<2;i++) enemies.push({ id:idCounter++, hp:40*STAGES[currentStage].difficulty, maxHp:40*STAGES[currentStage].difficulty, speed:.13, progress:Math.max(0,enemy.progress-.03*(i+1)), wobble:Math.random()*Math.PI*2, type:"fast", reward:8, abilityUsed:true });
    bossFxType = "summon";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} summoned minions!`,"#fca5a5");
  }
  if(ability==="rage"){
    enemy.speed*=1.6; enemy.hp += enemy.maxHp*.15;
    bossFxType = "rage";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} entered rage mode!`,"#fca5a5");
  }
  if(ability==="shield"){
    enemy.hp += enemy.maxHp*.25;
    bossFxType = "shield";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} gained a shield!`,"#93c5fd");
  }
  enemy.abilityUsed=true;
}

function update(dt){
  if(lives<=0 || isPaused) return;
  bossBannerTimer=Math.max(0,bossBannerTimer-dt);
  bossFxTimer=Math.max(0,bossFxTimer-dt);
  spellCooldown.slow = Math.max(0, spellCooldown.slow - dt);
  spellCooldown.damage = Math.max(0, spellCooldown.damage - dt);
  spellCooldown.bomb = Math.max(0, spellCooldown.bomb - dt);

  if(waveActive && spawnLeft>0){
    spawnTimer += dt;
    if(spawnTimer>=.68){ spawnTimer=0; spawnEnemy(); spawnLeft--; updateUI(); }
  }

  for(let i=enemies.length-1;i>=0;i--){
    const enemy=enemies[i];
    if(enemy.spellSlowTimer){
      enemy.spellSlowTimer = Math.max(0, enemy.spellSlowTimer - dt);
      if(enemy.spellSlowTimer <= 0) enemy.spellSlowFactor = 1;
    }
    if(enemy.auraSlowTimer){
      enemy.auraSlowTimer = Math.max(0, enemy.auraSlowTimer - dt);
      if(enemy.auraSlowTimer <= 0) enemy.auraSlowFactor = 1;
    }
    if(enemy.freezeTimer){
      enemy.freezeTimer = Math.max(0, enemy.freezeTimer - dt);
    }
    if(enemy.freezeLockTimer){
      enemy.freezeLockTimer = Math.max(0, enemy.freezeLockTimer - dt);
    }
    if(enemy.burnTimer){
      enemy.burnTimer = Math.max(0, enemy.burnTimer - dt);
      const burnDamage = (enemy.burnDps || 0) * dt;
      if(burnDamage > 0){
        enemy.hp -= burnDamage;
      }
    }
    const spellSlowFactor = enemy.spellSlowTimer > 0 ? (enemy.spellSlowFactor || 1) : 1;
    const auraSlowFactor = enemy.auraSlowTimer > 0 ? (enemy.auraSlowFactor || 1) : 1;
    const freezeFactor = enemy.freezeTimer > 0 ? 0 : 1;
    enemy.progress += enemy.speed * spellSlowFactor * auraSlowFactor * freezeFactor * dt;
    if(enemy.type==="boss" && !enemy.abilityUsed && enemy.hp<enemy.maxHp*.55) triggerBossAbility(enemy);
    if(enemy.progress>=1){
      enemies.splice(i,1);
      if(enemy.type==="boss") stopBossLoop();
      lives=Math.max(0,lives-(enemy.type==="boss"?3:1));
      if(lives<=0){
        waveActive=false;
        gameOverText.textContent=`Ai ajuns până la ${currentMode==="campaign" ? "stage "+currentStage : "wave "+wave} cu score ${totalScore()}.`;
        gameOverOverlay.classList.remove("hidden");
        saveProgress();
        if(currentMode==="endless") submitBonusLeaderboardScore();
        setMessage("Game over. Scheleții au trecut de poartă.");
      }
      updateUI();
    }
  }

  for(const unit of units){
    unit.cooldown=Math.max(0,unit.cooldown-dt);
    const stats = getAuraAdjustedStats(unit);
    const unitPos=cellCenter(unit.c,unit.r);
    let bestTarget=null,bestProgress=-1;
    for(const enemy of enemies){
      const enemyPos=getPathPosition(enemy.progress);
      if(distance(unitPos,enemyPos)<=stats.range && enemy.progress>bestProgress){ bestTarget={enemy,pos:enemyPos}; bestProgress=enemy.progress; }
    }
    if(bestTarget){
      const dx=bestTarget.pos.x-unitPos.x, dy=bestTarget.pos.y-unitPos.y;
      unit.aimAngle=Math.atan2(dy,dx);
      if(unit.cooldown<=0){
        projectiles.push({ id:idCounter++, x:unitPos.x, y:unitPos.y, px:unitPos.x, py:unitPos.y, angle:unit.aimAngle, targetId:bestTarget.enemy.id, damage:stats.damage, speed:stats.projectileSpeed, color:getProjectileColorByAura(unit, unit.type==="hunter"?"#fcd34d":unit.type==="mage"?"#ddd6fe":unit.type==="bomb"?"#fb7185":"#e2e8f0"), projectileType:unit.type, splash:stats.splash||0, ownerUnitId:unit.id, ownerAuraType:unit.auraType || null });
        unit.cooldown=stats.fireRate; playShootSound(unit.kind);
      }
    }
  }

  for(let i=projectiles.length-1;i>=0;i--){
    const projectile=projectiles[i], target=enemies.find(e=>e.id===projectile.targetId);
    const owner = getUnitById(projectile.ownerUnitId);
    if(!target){ projectiles.splice(i,1); continue; }
    const targetPos=getPathPosition(target.progress);
    projectile.px=projectile.x; projectile.py=projectile.y;
    const dx=targetPos.x-projectile.x, dy=targetPos.y-projectile.y, d=Math.hypot(dx,dy), step=projectile.speed*dt;
    projectile.angle=Math.atan2(dy,dx);
    if(d<=step || d<10){
      if(projectile.projectileType==="mage"){
        applySplashDamage(targetPos,projectile.splash,projectile.damage,"mage");
        for(const enemy of enemies){
          const pos=getPathPosition(enemy.progress);
          if(distance(targetPos,pos)<=projectile.splash){
            if(owner) markEnemyHit(enemy, owner, projectile.damage);
            applyAuraStatusOnEnemy(enemy, owner, pos, projectile.damage);
          }
        }
      }
      else if(projectile.projectileType==="bomb"){
        applySplashDamage(targetPos,projectile.splash,projectile.damage,"bomb"); addHitParticles(targetPos.x,targetPos.y,14,"#fb923c");
        for(const enemy of enemies){
          const pos=getPathPosition(enemy.progress);
          if(distance(targetPos,pos)<=projectile.splash){
            if(owner) markEnemyHit(enemy, owner, projectile.damage);
            applyAuraStatusOnEnemy(enemy, owner, pos, projectile.damage);
          }
        }
      }
      else {
        target.hp-=projectile.damage;
        if(owner) markEnemyHit(target, owner, projectile.damage);
        applyAuraStatusOnEnemy(target, owner, targetPos, projectile.damage);
        addHitParticles(targetPos.x,targetPos.y,4,projectile.color);
        showPopup(targetPos.x,targetPos.y-8,`-${Math.round(projectile.damage)}`,projectile.color);
      }
      if(owner && projectile.ownerAuraType === "storm"){
        chainStormDamage(target, owner, targetPos);
      }
      playHitSound(); projectiles.splice(i,1); continue;
    }
    projectile.x += (dx/d)*step; projectile.y += (dy/d)*step;
  }

  for(let i=enemies.length-1;i>=0;i--){
    if(enemies[i].hp<=0){ const defeatedEnemy = enemies[i]; const pos=getPathPosition(defeatedEnemy.progress); rewardKill(defeatedEnemy,pos); if(defeatedEnemy.type==="boss") stopBossLoop(); enemies.splice(i,1); updateUI(); }
  }

  for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.life-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=.96; p.vy*=.96; if(p.life<=0) particles.splice(i,1); }
  for(let i=placementEffects.length-1;i>=0;i--){
    const fx=placementEffects[i];
    fx.life-=dt;
    if(fx.life<=0) placementEffects.splice(i,1);
  }
  for(let i=upgradeEffects.length-1;i>=0;i--){
    const fx=upgradeEffects[i];
    fx.life-=dt;
    if(fx.life<=0) upgradeEffects.splice(i,1);
  }
  for(let i=popups.length-1;i>=0;i--){ const p=popups[i]; p.life-=dt; p.y-=18*dt; if(p.life<=0) popups.splice(i,1); }

  if(waveActive && spawnLeft===0 && enemies.length===0){
    waveActive=false;
    const stage=STAGES[currentStage];

    if(stageWave===stage.bossWave){
      addScore(500,lives*25);
      if(lives===stageStartLives){ unlockAchievement("survivor"); bonusScore += 250; }

      if(!pendingBossResolution){
        if(currentMode==="campaign" && currentStage < Object.keys(STAGES).length){
          pendingBossResolution = { type:"campaign-next-stage", nextStage: currentStage + 1 };
        } else if(currentMode==="campaign" && currentStage >= Object.keys(STAGES).length){
          pendingBossResolution = { type:"unlock-endless" };
        } else {
          pendingBossResolution = { type:"endless-next" };
        }
        beginBossAuraReward();
        updateUI();
        return;
      }
      return;
    }

    stageWave += 1;
    wave += 1;
    money += 35 + Math.min(currentStage,6) * 10;
    bonusScore += 20;
    setMessage(`Wave complet. Următorul wave în stage: ${stageWave}.`);
    updateUI();
  }
}

function drawBackground(){
  const stage=STAGES[currentStage], bg=ctx.createLinearGradient(0,0,0,canvas.height);
  if(currentStage===1){ bg.addColorStop(0,"#17324d"); bg.addColorStop(1,"#0a1627"); }
  else if(currentStage===2){ bg.addColorStop(0,"#2a3142"); bg.addColorStop(1,"#111827"); }
  else if(currentStage===3){ bg.addColorStop(0,"#2c1b2f"); bg.addColorStop(1,"#12091a"); }
  else if(currentStage===4){ bg.addColorStop(0,"#283341"); bg.addColorStop(1,"#131c27"); }
  else if(currentStage===5){ bg.addColorStop(0,"#17111f"); bg.addColorStop(1,"#09060f"); }
  else { bg.addColorStop(0,"#111028"); bg.addColorStop(1,"#05060d"); }
  ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let c=0;c<=COLS;c++){ ctx.beginPath(); ctx.moveTo(c*CELL,0); ctx.lineTo(c*CELL,ROWS*CELL); ctx.strokeStyle="rgba(148,163,184,.10)"; ctx.stroke(); }
  for(let r=0;r<=ROWS;r++){ ctx.beginPath(); ctx.moveTo(0,r*CELL); ctx.lineTo(COLS*CELL,r*CELL); ctx.strokeStyle="rgba(148,163,184,.10)"; ctx.stroke(); }

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const key=`${c}-${r}`, isPath=pathCells.has(key);
      if(currentStage===1) ctx.fillStyle=isPath?"rgba(170,115,62,.24)":"rgba(17,54,37,.26)";
      else if(currentStage===2) ctx.fillStyle=isPath?"rgba(113,113,122,.30)":"rgba(39,39,42,.24)";
      else if(currentStage===3) ctx.fillStyle=isPath?"rgba(122,98,84,.28)":"rgba(48,34,52,.22)";
      else if(currentStage===4) ctx.fillStyle=isPath?"rgba(123,136,158,.26)":"rgba(31,46,58,.24)";
      else if(currentStage===5) ctx.fillStyle=isPath?"rgba(111,88,78,.28)":"rgba(35,26,44,.24)";
      else ctx.fillStyle=isPath?"rgba(110,72,148,.30)":"rgba(20,18,46,.30)";
      roundRect(c*CELL+2,r*CELL+2,CELL-4,CELL-4,12); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,.05)"; ctx.stroke();
    }
  }

  // ambient stage glow
  for(let i=0;i<3;i++){
    const gx = 90 + i * 220;
    const gy = 70 + (i % 2) * 220;
    const grd = ctx.createRadialGradient(gx, gy, 8, gx, gy, 130);
    const glowColor =
      currentStage===1 ? "rgba(34,197,94,.06)" :
      currentStage===2 ? "rgba(148,163,184,.05)" :
      currentStage===3 ? "rgba(168,85,247,.06)" :
      currentStage===4 ? "rgba(59,130,246,.05)" :
      currentStage===5 ? "rgba(244,114,182,.05)" :
      "rgba(139,92,246,.08)";
    grd.addColorStop(0, glowColor);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(gx, gy, 130, 0, Math.PI * 2);
    ctx.fill();
  }

  for(const patch of (stage.grassPatches||[])){
    ctx.fillStyle=currentStage<3?"rgba(34,197,94,.10)":currentStage<5?"rgba(168,85,247,.06)":"rgba(99,102,241,.08)";
    roundRect(patch.x,patch.y,patch.w,patch.h,16); ctx.fill();
  }
  if(stage.trees) drawTrees(stage.trees);
  if(stage.ruins) drawRuins(stage.ruins);
  drawStageAggressiveDecor();
}
function drawTrees(trees){
  for(const tree of trees){
    ctx.fillStyle="#3f2a1d";
    roundRect(tree.x-5,tree.y,10,18,4);
    ctx.fill();

    ctx.fillStyle="#16a34a";
    ctx.beginPath();
    ctx.arc(tree.x,tree.y-10,20,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#22c55e";
    ctx.beginPath();
    ctx.arc(tree.x-10,tree.y-16,11,0,Math.PI*2);
    ctx.arc(tree.x+10,tree.y-14,10,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="rgba(125,211,252,.08)";
    ctx.beginPath();
    ctx.arc(tree.x+6,tree.y-18,5,0,Math.PI*2);
    ctx.fill();
  }
}

function drawRuins(ruins){
  for(const ruin of ruins){
    ctx.fillStyle="rgba(203,213,225,.14)";
    roundRect(ruin.x-18,ruin.y-10,36,20,6);
    ctx.fill();

    ctx.fillStyle="rgba(203,213,225,.09)";
    roundRect(ruin.x-13,ruin.y-32,8,22,4);
    ctx.fill();
    roundRect(ruin.x+3,ruin.y-26,8,16,4);
    ctx.fill();

    ctx.fillStyle="rgba(255,255,255,.05)";
    roundRect(ruin.x-18,ruin.y-10,36,6,4);
    ctx.fill();
  }
}

function drawStageAggressiveDecor(){
  if(currentStage===1){
    const rocks=[[120,90],[260,70],[500,360],[620,300],[210,420]];
    for(const [x,y] of rocks){
      ctx.fillStyle="rgba(148,163,184,.20)";
      roundRect(x-7,y-5,14,9,3);
      ctx.fill();
    }
    for(let i=0;i<16;i++){
      const x=20+i*40+(i%2)*6;
      const y=40+(i%6)*68;
      ctx.fillStyle="rgba(74,222,128,.16)";
      ctx.beginPath();
      ctx.arc(x,y,2.2,0,Math.PI*2);
      ctx.fill();
    }
  } else if(currentStage===2){
    const rubble=[[94,84],[226,130],[548,92],[590,318],[454,392]];
    for(const [x,y] of rubble){
      ctx.fillStyle="rgba(203,213,225,.12)";
      for(let i=0;i<4;i++){
        roundRect(x+i*5-8,y+(i%2)*4-6,7,6,2);
        ctx.fill();
      }
    }
  } else if(currentStage===3){
    const graves=[[100,100],[160,150],[520,110],[600,330],[420,380],[260,90]];
    for(const [x,y] of graves){
      ctx.fillStyle="rgba(203,213,225,.20)";
      roundRect(x-5,y-10,10,16,4);
      ctx.fill();
      ctx.fillRect(x-1,y-14,2,8);
      ctx.fillRect(x-4,y-11,8,2);
    }
    ctx.fillStyle="rgba(255,255,255,.04)";
    for(let i=0;i<3;i++){
      ctx.beginPath();
      ctx.arc(120+i*180,90+i*84,42,0,Math.PI*2);
      ctx.fill();
    }
  } else if(currentStage===4){
    const banners=[[90,60],[580,70]];
    for(const [x,y] of banners){
      ctx.fillStyle="rgba(71,85,105,.45)";
      roundRect(x-4,y-24,8,48,3);
      ctx.fill();
      ctx.fillStyle="rgba(59,130,246,.25)";
      ctx.beginPath();
      ctx.moveTo(x+4,y-20);
      ctx.lineTo(x+24,y-14);
      ctx.lineTo(x+4,y-6);
      ctx.closePath();
      ctx.fill();
    }
  } else if(currentStage===5){
    const candles=[[90,90],[560,90],[610,370],[240,380]];
    for(const [x,y] of candles){
      ctx.fillStyle="rgba(250,204,21,.22)";
      ctx.beginPath();
      ctx.arc(x,y,10,0,Math.PI*2);
      ctx.fill();

      ctx.fillStyle="rgba(245,158,11,.95)";
      ctx.fillRect(x-2,y-10,4,10);

      ctx.fillStyle="rgba(253,224,71,.95)";
      ctx.beginPath();
      ctx.arc(x,y-12,3,0,Math.PI*2);
      ctx.fill();
    }

    const skulls=[[180,114],[402,318],[520,208]];
    for(const [x,y] of skulls){
      ctx.fillStyle="rgba(241,245,249,.18)";
      ctx.beginPath();
      ctx.arc(x,y,7,0,Math.PI*2);
      ctx.fill();
    }
  } else {
    const cracks=[[[70,90],[110,110],[140,100]],[[480,80],[520,100],[560,90]],[[420,360],[450,340],[490,350]]];
    for(const pts of cracks){
      ctx.strokeStyle="rgba(168,85,247,.18)";
      ctx.lineWidth=8;
      ctx.beginPath();
      pts.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.stroke();

      ctx.strokeStyle="rgba(168,85,247,.58)";
      ctx.lineWidth=3;
      ctx.beginPath();
      pts.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.stroke();
    }
  }
}

function drawPath(){
  ctx.save();
  ctx.lineCap="round";
  ctx.lineJoin="round";

  ctx.beginPath();
  path.forEach((p,i)=>{
    const pos=cellCenter(p.c,p.r);
    if(i===0) ctx.moveTo(pos.x,pos.y);
    else ctx.lineTo(pos.x,pos.y);
  });

  if(currentStage===1){
    ctx.strokeStyle="rgba(120,72,34,.94)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(181,124,71,.22)";
    ctx.lineWidth=12;
    ctx.stroke();
  } else if(currentStage===2){
    ctx.strokeStyle="rgba(107,114,128,.78)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(203,213,225,.12)";
    ctx.lineWidth=10;
    ctx.stroke();
  } else if(currentStage===3){
    ctx.strokeStyle="rgba(104,78,95,.86)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(168,85,247,.10)";
    ctx.lineWidth=10;
    ctx.stroke();
  } else if(currentStage===4){
    ctx.strokeStyle="rgba(108,125,147,.82)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(226,232,240,.10)";
    ctx.lineWidth=10;
    ctx.stroke();
  } else if(currentStage===5){
    ctx.strokeStyle="rgba(96,72,64,.86)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(251,191,36,.08)";
    ctx.lineWidth=10;
    ctx.stroke();
  } else {
    ctx.strokeStyle="rgba(109,72,163,.86)";
    ctx.lineWidth=22;
    ctx.stroke();
    ctx.strokeStyle="rgba(196,132,252,.18)";
    ctx.lineWidth=10;
    ctx.stroke();
  }

  for(let i=0;i<16;i++){
    const pt = getPathPosition((i+0.4)/16);
    ctx.fillStyle=currentStage===1 ? "rgba(92,58,32,.35)"
      : currentStage===2 ? "rgba(226,232,240,.10)"
      : currentStage===3 ? "rgba(203,213,225,.08)"
      : currentStage===4 ? "rgba(226,232,240,.08)"
      : currentStage===5 ? "rgba(251,191,36,.08)"
      : "rgba(216,180,254,.12)";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, currentStage===1 ? 3.2 : 2.4, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.beginPath();
  path.forEach((p,i)=>{
    const pos=cellCenter(p.c,p.r);
    if(i===0) ctx.moveTo(pos.x,pos.y);
    else ctx.lineTo(pos.x,pos.y);
  });
  ctx.strokeStyle="rgba(255,255,255,.12)";
  ctx.lineWidth=3;
  ctx.stroke();
  ctx.restore();
}
function drawSpawnPortal(){
  const start=path[0], pos=cellCenter(start.c,start.r), pulse=1+Math.sin(performance.now()*.006)*.08;
  ctx.save(); ctx.translate(pos.x,pos.y); ctx.scale(pulse,pulse);
  const grad=ctx.createRadialGradient(0,0,3,0,0,24);
  grad.addColorStop(0,currentStage===6?"rgba(168,85,247,.55)":"rgba(125,211,252,.45)");
  grad.addColorStop(1,"rgba(125,211,252,.02)");
  ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=currentStage===6?"rgba(192,132,252,.85)":"rgba(103,232,249,.8)";
  ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}
function drawGate(){
  const end=path[path.length-1], pos=cellCenter(end.c,end.r);
  ctx.save(); ctx.translate(pos.x+18,pos.y);
  ctx.fillStyle="#374151"; roundRect(-18,-24,26,48,6); ctx.fill();
  ctx.fillStyle="#94a3b8"; roundRect(-13,-19,16,38,4); ctx.fill();
  ctx.fillStyle="#1f2937";
  for(let i=-14;i<=0;i+=6) ctx.fillRect(i,-18,2,36);
  ctx.fillStyle="#fde68a"; ctx.beginPath(); ctx.arc(-4,0,2,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function drawPlacementPreview(){
  if(selectedSpell && hoveredCell){
    const pos=cellCenter(hoveredCell.c, hoveredCell.r);
    let radius=0, title="", fill="rgba(147,197,253,.10)", stroke="rgba(147,197,253,.48)";
    if(selectedSpell==="slow"){ radius=spellConfig.slow.radius; title="Frost Nova"; }
    if(selectedSpell==="damage"){ radius=spellConfig.damage.radius; title="Meteor"; fill="rgba(251,146,60,.10)"; stroke="rgba(251,146,60,.46)"; }
    if(selectedSpell==="bomb"){ radius=spellConfig.bomb.range; title="Lightning"; fill="rgba(250,204,21,.10)"; stroke="rgba(250,204,21,.48)"; }
    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,radius,0,Math.PI*2);
    ctx.fillStyle=fill;
    ctx.fill();
    ctx.strokeStyle=stroke;
    ctx.setLineDash([8,8]);
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle="#f8fafc";
    ctx.font="bold 12px Arial";
    ctx.textAlign="center";
    ctx.fillText(title, pos.x, pos.y - radius - 10);
    ctx.textAlign="start";
    ctx.restore();
    return;
  }
  if(!hoveredCell) return;
  const {c,r}=hoveredCell;
  if(c<0||c>=COLS||r<0||r>=ROWS) return;

  const occupied=units.find(a=>a.c===c&&a.r===r);
  if(occupied){
    const pos=cellCenter(c,r);
    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,occupied.range,0,Math.PI*2);
    ctx.fillStyle="rgba(34,197,94,.05)";
    ctx.fill();
    ctx.strokeStyle="rgba(34,197,94,.28)";
    ctx.setLineDash([7,7]);
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    return;
  }

  const blocked=pathCells.has(`${c}-${r}`);
  const type=UNIT_TYPES[selectedUnitType];
  const pos=cellCenter(c,r);

  ctx.save();
  ctx.beginPath();
  ctx.arc(pos.x,pos.y,type.range,0,Math.PI*2);
  ctx.fillStyle=blocked?"rgba(251,113,133,.06)":"rgba(56,189,248,.08)";
  ctx.fill();
  ctx.strokeStyle=blocked?"rgba(251,113,133,.34)":"rgba(56,189,248,.34)";
  ctx.setLineDash([8,8]);
  ctx.lineWidth=2;
  ctx.stroke();
  ctx.setLineDash([]);

  roundRect(c*CELL+3,r*CELL+3,CELL-6,CELL-6,12);
  ctx.fillStyle=blocked?"rgba(251,113,133,.18)":"rgba(56,189,248,.14)";
  ctx.fill();

  ctx.fillStyle=blocked?"rgba(251,113,133,.92)":"rgba(125,211,252,.95)";
  ctx.beginPath();
  ctx.arc(pos.x,pos.y,8,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle="#08111f";
  ctx.font="bold 11px Arial";
  ctx.textAlign="center";
  ctx.fillText(type.name, pos.x, pos.y - 16);
  ctx.textAlign="start";
  ctx.restore();
}
function drawPlacedUnit(unit){
  const pos=cellCenter(unit.c,unit.r), angle=unit.aimAngle||-.2, selected=unit.id===selectedPlacedUnitId;
  const aura = getAuraData(unit.auraType);

  if(aura){
    const pulse = 22 + Math.sin(performance.now() * 0.005 + unit.id) * 2;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = aura.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y + 6, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = aura.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y + 6, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(8,17,31,.92)";
    roundRect(pos.x - 14, pos.y - 36, 28, 18, 8);
    ctx.fill();
    ctx.fillStyle = aura.color;
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.fillText(aura.icon, pos.x, pos.y - 23);
    ctx.textAlign = "start";
    ctx.restore();
  }

  if(pendingAuraChoice){
    ctx.save();
    ctx.strokeStyle = getAuraData(pendingAuraChoice.id)?.color || "#67e8f9";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6,6]);
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,26 + Math.sin(performance.now()*0.008 + unit.id) * 1.5,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  if(selected){
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,24,0,Math.PI*2);
    ctx.strokeStyle="rgba(103,232,249,.95)";
    ctx.lineWidth=3;
    ctx.stroke();

    ctx.fillStyle="rgba(103,232,249,.08)";
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,28,0,Math.PI*2);
    ctx.fill();
  }

  // fantasy turret base under every unit
  ctx.save();
  ctx.translate(pos.x,pos.y);

  ctx.fillStyle="rgba(15,23,42,.95)";
  roundRect(-17, 9, 34, 12, 6);
  ctx.fill();

  ctx.fillStyle="rgba(100,116,139,.9)";
  roundRect(-12, 2, 24, 10, 5);
  ctx.fill();

  ctx.strokeStyle="rgba(226,232,240,.16)";
  ctx.lineWidth=1.5;
  ctx.stroke();

  ctx.fillStyle="rgba(148,163,184,.42)";
  roundRect(-7, -4, 14, 8, 4);
  ctx.fill();
  ctx.restore();

  if(unit.type==="bomb"){
    ctx.fillStyle=unit.color;
    roundRect(pos.x-15,pos.y-15,30,30,8);
    ctx.fill();

    ctx.fillStyle="#111827";
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,8,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#fca5a5";
    ctx.beginPath();
    ctx.arc(pos.x,pos.y-12,3,0,Math.PI*2);
    ctx.fill();
  } else {
    ctx.save();
    ctx.translate(pos.x,pos.y-2);

    ctx.fillStyle=unit.color;
    ctx.beginPath();
    ctx.arc(0,4,15,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#fde68a";
    ctx.beginPath();
    ctx.arc(0,-6,6,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle=unit.hood;
    ctx.beginPath();
    ctx.arc(0,-8,8,Math.PI,0);
    ctx.fill();

    ctx.rotate(angle);
    ctx.strokeStyle=unit.type==="mage"?"#a78bfa":"#7c2d12";
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(7,0,10,-1.2,1.2);
    ctx.stroke();

    ctx.strokeStyle=unit.type==="mage"?"#ddd6fe":"#f8fafc";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(0,-6);
    ctx.lineTo(10,7);
    ctx.stroke();
    ctx.restore();
  }

  if(unit.level>1){
    ctx.fillStyle="rgba(253,230,138,.92)";
    ctx.font="bold 12px Arial";
    ctx.fillText(`★${unit.level}`, pos.x-10, pos.y-18);
  }
}
const drawUnits=()=>units.forEach(drawPlacedUnit);

function drawEnemy(enemy){
  const pos=getPathPosition(enemy.progress), bob=Math.sin(performance.now()*.01+enemy.wobble)*(enemy.type==="boss"?2.8:1.8);
  const x=pos.x,y=pos.y+bob, scale=enemy.type==="boss"?1.55:enemy.type==="tank"?1.18:enemy.type==="fast"?.88:1, hpPct=Math.max(0,enemy.hp/enemy.maxHp);

  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  ctx.strokeStyle=enemy.type==="boss"?"#fcd34d":enemy.type==="tank"?"#fca5a5":enemy.type==="fast"?"#93c5fd":"#e5e7eb";
  if(currentStage===6 && enemy.type!=="boss") ctx.strokeStyle="#c4b5fd";
  ctx.lineWidth=enemy.type==="boss"?2.3:2;
  ctx.beginPath(); ctx.arc(0,-8,7,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,-1); ctx.lineTo(0,12); ctx.moveTo(-7,3); ctx.lineTo(7,3); ctx.moveTo(0,12); ctx.lineTo(-6,20); ctx.moveTo(0,12); ctx.lineTo(6,20); ctx.stroke();
  ctx.fillStyle="#111827"; ctx.beginPath(); ctx.arc(-2.5,-9,1.2,0,Math.PI*2); ctx.arc(2.5,-9,1.2,0,Math.PI*2); ctx.fill();
  if(enemy.type==="boss"){
    ctx.strokeStyle=currentStage===6 ? "#c084fc" : "#f59e0b";
    ctx.beginPath(); ctx.moveTo(-6,-14); ctx.lineTo(-2,-18); ctx.lineTo(0,-13); ctx.lineTo(2,-18); ctx.lineTo(6,-14); ctx.stroke();
  }
  ctx.restore();

  const hpWidth=enemy.type==="boss"?46:36, hpX=x-hpWidth/2, hpY=y-(enemy.type==="boss"?38:24);
  ctx.fillStyle="rgba(15,23,42,.95)"; roundRect(hpX,hpY,hpWidth,6,4); ctx.fill();
  ctx.fillStyle=enemy.type==="boss"?(currentStage===6?"#c084fc":"#f59e0b"):enemy.type==="tank"?"#fb7185":enemy.type==="fast"?"#38bdf8":"#22c55e";
  roundRect(hpX,hpY,hpWidth*hpPct,6,4); ctx.fill();
}
const drawEnemies=()=>enemies.forEach(drawEnemy);

function drawProjectile(p){
  if(p.projectileType==="bomb"){
    ctx.strokeStyle="rgba(251,146,60,.25)"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(p.px,p.py); ctx.lineTo(p.x,p.y); ctx.stroke();
    ctx.save();
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,Math.PI*2); ctx.fill();
    ctx.restore();
    return;
  }
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle);
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 8;
  ctx.strokeStyle=p.projectileType==="mage"?"rgba(221,214,254,.35)":"rgba(248,250,252,.25)";
  ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(0,0); ctx.stroke();
  ctx.strokeStyle=p.color; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(8,0); ctx.stroke();
  ctx.fillStyle=p.projectileType==="mage"?"#c4b5fd":"#f8fafc";
  ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(2,-4); ctx.lineTo(2,4); ctx.closePath(); ctx.fill();
  ctx.restore();
}
const drawProjectiles=()=>projectiles.forEach(drawProjectile);

function drawPlacementEffects(){
  for(const fx of placementEffects){
    const t = 1 - (fx.life / fx.maxLife);
    const radius = 14 + t * 28;
    const alpha = Math.max(0, 1 - t);

    ctx.save();
    ctx.globalAlpha = alpha * 0.28;
    ctx.strokeStyle = fx.color;
    ctx.lineWidth = 4 - t * 2;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.14;
    ctx.fillStyle = fx.color;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, 10 + t * 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawUpgradeEffects(){
  for(const fx of upgradeEffects){
    const t = 1 - (fx.life / fx.maxLife);
    const alpha = Math.max(0, 1 - t);
    const radius = 12 + t * 18;

    ctx.save();
    ctx.globalAlpha = alpha * 0.32;
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.22;
    ctx.strokeStyle = fx.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, radius + 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = "#fde68a";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("★", fx.x, fx.y - 20 - t * 8);
    ctx.restore();
  }
}
function drawParticles(){ for(const p of particles){ const alpha=Math.max(0,p.life/p.maxLife); ctx.globalAlpha=alpha; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; } }
function drawPopups(){ ctx.save(); ctx.font="bold 16px Arial"; ctx.textAlign="center"; for(const p of popups){ const alpha=Math.max(0,p.life/p.maxLife); ctx.globalAlpha=alpha; ctx.fillStyle=p.color; ctx.fillText(p.text,p.x,p.y); } ctx.restore(); ctx.globalAlpha=1; }

function drawHUDInsideCanvas(){}


function drawBossHealthBar(){
  const boss = enemies.find(e=>e.type==="boss");
  if(!boss) return;
  const pct = Math.max(0, boss.hp / boss.maxHp);
  const x = canvas.width/2 - 170, y = 14, w = 340, h = 18;
  ctx.fillStyle = "rgba(8,17,31,.84)";
  roundRect(x,y,w,h,10); ctx.fill();
  ctx.strokeStyle = currentStage===6 ? "rgba(192,132,252,.8)" : "rgba(251,191,36,.8)";
  ctx.stroke();
  ctx.fillStyle = currentStage===6 ? "#c084fc" : "#f59e0b";
  roundRect(x+2,y+2,(w-4)*pct,h-4,8); ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(boss.bossName || "BOSS HP", canvas.width/2, y+13);
  ctx.textAlign = "start";
}

function drawBossBanner(){
  if(bossBannerTimer<=0) return;
  const alpha=Math.min(1,bossBannerTimer/.4,bossBannerTimer);
  ctx.save(); ctx.globalAlpha=Math.min(1,alpha);
  ctx.fillStyle="rgba(127,29,29,.65)"; roundRect(canvas.width/2-140,40,280,40,20); ctx.fill();
  ctx.strokeStyle=currentStage===6 ? "rgba(192,132,252,.8)" : "rgba(251,191,36,.7)"; ctx.stroke();
  ctx.fillStyle="#fef3c7"; ctx.font="bold 20px Arial"; ctx.textAlign="center"; ctx.fillText(stageWave===STAGES[currentStage].bossWave ? (STAGE_BOSS[currentStage]?.name || "BOSS WAVE") : "WARNING", canvas.width/2, 66);
  ctx.restore();
}


function drawBossAbilityFx(){
  if(bossFxTimer <= 0) return;
  const alpha = Math.min(1, bossFxTimer / 0.3);

  if(bossFxType === "summon"){
    ctx.save();
    ctx.globalAlpha = 0.22 * alpha;
    ctx.fillStyle = "#fb7185";
    for(let i=0;i<4;i++){
      const x = 110 + i * 140;
      const y = 90 + (i % 2) * 180;
      ctx.beginPath();
      ctx.arc(x, y, 36 + Math.sin(performance.now() * 0.01 + i) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if(bossFxType === "rage"){
    ctx.save();
    ctx.globalAlpha = 0.18 * alpha;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if(bossFxType === "shield"){
    const boss = enemies.find(e => e.type === "boss");
    if(!boss) return;
    const pos = getPathPosition(boss.progress);
    ctx.save();
    ctx.globalAlpha = 0.35 * alpha;
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 38 + Math.sin(performance.now() * 0.01) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.setTransform(view.scale, 0, 0, view.scale, view.offsetX, view.offsetY);
  drawBackground();
  drawSpawnPortal();
  drawPath();
  drawGate();
  drawPlacementPreview();
  drawUnits();
  drawEnemies();
  drawProjectiles();
  drawPlacementEffects();
  drawUpgradeEffects();
  drawParticles();
  drawPopups();
  ctx.restore();

  drawHUDInsideCanvas();
  drawBossAbilityFx();
  drawBossHealthBar();
  drawBossBanner();
}
function gameLoop(timestamp){
  if(!lastTime) lastTime=timestamp;
  const dt=Math.min((timestamp-lastTime)/1000,.033);
  lastTime=timestamp;
  update(dt); draw(); requestAnimationFrame(gameLoop);
}
function getMousePos(event){
  const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width, scaleY=canvas.height/rect.height;
  const sx=(event.clientX-rect.left)*scaleX, sy=(event.clientY-rect.top)*scaleY;
  const world = screenToWorld(sx, sy);
  return {sx, sy, x:world.x, y:world.y, c:Math.floor(world.x/CELL), r:Math.floor(world.y/CELL)};
}

canvas.addEventListener("mousemove",(event)=>{ hoveredCell=getMousePos(event); });
canvas.addEventListener("mouseleave",()=>{ hoveredCell=null; });
canvas.addEventListener("click",(event)=>{
  ensureAudio(); hasStarted=true;
  const {x,y,c,r}=getMousePos(event);

  if(pendingAuraChoice){
    for(const unit of units){
      const pos=cellCenter(unit.c,unit.r);
      if(distance({x,y},pos)<=26){
        applyPendingAuraToUnit(unit);
        return;
      }
    }
    setMessage("Alege un turn pentru aura legendară.");
    return;
  }

  if(selectedSpell === "slow"){ castSlowSpell(x, y); return; }
  if(selectedSpell === "damage"){ castDamageSpell(x, y); return; }
  if(selectedSpell === "bomb"){ castBombSpell(x, y); return; }

  let clickedUnit=null;
  for(const unit of units){
    const pos=cellCenter(unit.c,unit.r);
    if(distance({x,y},pos)<=22){ clickedUnit=unit; break; }
  }

  if(clickedUnit){
    if(selectedPlacedUnitId === clickedUnit.id){
      selectedPlacedUnitId = null;
      hideTowerMenu();
      updateUI();
      return;
    }
    selectedPlacedUnitId=clickedUnit.id;
    setMessage(`Ai selectat ${clickedUnit.name}.`);
    updateUI();
    return;
  }

  selectedPlacedUnitId = null;
  hideTowerMenu();

  if(c>=0&&c<COLS&&r>=0&&r<ROWS) placeUnit(c,r);
});

function bindUnitSelectorButtons(buttonList){
  buttonList.forEach(btn=>{
    btn.addEventListener("click",(event)=>{
      event.stopPropagation();
      selectedUnitType = btn.dataset.type;
      selectedPlacedUnitId = null;
      hideTowerMenu();
      syncUnitSelectors();
      const t = UNIT_TYPES[selectedUnitType]; setMessage(`Ai selectat ${t.name} · Cost ${t.cost} · Range ${Math.round(t.range)}`);
      updateUI();
    });
  });
}

bindUnitSelectorButtons(unitButtons);
bindUnitSelectorButtons(unitInfoButtons);

towerUpgradeBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  upgradeSelectedUnit();
});
towerSellBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  sellSelectedUnit();
});
startWaveBtn.addEventListener("click",startWave);
pauseBtn.addEventListener("click",togglePause);
resetBtn.addEventListener("click",resetGame);

spellSlowBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || spellCooldown.slow > 0) return;
  selectedSpell = selectedSpell === "slow" ? null : "slow";
  setMessage(selectedSpell === "slow" ? "Alege zona pentru Frost Nova." : "Spell anulat.");
  updateSpellButtons();
});

spellDamageBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || spellCooldown.damage > 0) return;
  selectedSpell = selectedSpell === "damage" ? null : "damage";
  setMessage(selectedSpell === "damage" ? "Alege zona pentru Meteor Strike." : "Spell anulat.");
  updateSpellButtons();
});

spellBombBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || spellCooldown.bomb > 0) return;
  selectedSpell = selectedSpell === "bomb" ? null : "bomb";
  setMessage(selectedSpell === "bomb" ? "Alege zona pentru Chain Lightning." : "Spell anulat.");
  updateSpellButtons();
});

resetCameraBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  toggleUnitInfoPanel();
  setMessage(unitInfoPanel?.classList.contains("hidden") ? "Panou unități închis." : "Panou unități deschis.");
  updateUI();
});

startGameBtn.addEventListener("click",()=>{
  hasStarted=true; ensureAudio();
  startOverlay.classList.add("hidden");
  loadProgressNotice();
  loadBonusLeaderboard();
  setMessage("Dark Defense a început. Plasează unități, pornește wave-ul și folosește spell-urile la nevoie.");
});
restartFromGameOverBtn.addEventListener("click",()=>{
  gameOverOverlay.classList.add("hidden");
  resetGame();
});

updateAudioToggle();
applyStage(1,true);
loadBonusLeaderboard();
prewarmLeaderboardRun("campaign");
draw();
requestAnimationFrame(gameLoop);


canvas.addEventListener("wheel",(event)=>{
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const anchorX = (event.clientX - rect.left) * scaleX;
  const anchorY = (event.clientY - rect.top) * scaleY;
  const factor = event.deltaY < 0 ? 1.08 : 0.92;
  setZoom(view.scale * factor, anchorX, anchorY);
}, { passive:false });

function touchPointToCanvas(touch){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("touchstart",(event)=>{
  if(event.touches.length === 2){
    const a = touchPointToCanvas(event.touches[0]);
    const b = touchPointToCanvas(event.touches[1]);
    pinchState = {
      distance: Math.hypot(b.x - a.x, b.y - a.y),
      midpoint: { x:(a.x+b.x)/2, y:(a.y+b.y)/2 },
      scale: view.scale,
      offsetX: view.offsetX,
      offsetY: view.offsetY
    };
  }
}, { passive:true });

canvas.addEventListener("touchmove",(event)=>{
  if(event.touches.length !== 2 || !pinchState) return;
  event.preventDefault();
  const a = touchPointToCanvas(event.touches[0]);
  const b = touchPointToCanvas(event.touches[1]);
  const newDistance = Math.hypot(b.x - a.x, b.y - a.y);
  const midpoint = { x:(a.x+b.x)/2, y:(a.y+b.y)/2 };
  const scaleFactor = newDistance / pinchState.distance;

  view.scale = Math.max(view.minScale, Math.min(view.maxScale, pinchState.scale * scaleFactor));
  view.offsetX = midpoint.x - ((pinchState.midpoint.x - pinchState.offsetX) * (view.scale / pinchState.scale));
  view.offsetY = midpoint.y - ((pinchState.midpoint.y - pinchState.offsetY) * (view.scale / pinchState.scale));
  clampView();
  if(selectedPlacedUnitId) updateSelectedPanel();
}, { passive:false });

canvas.addEventListener("touchend",()=>{
  if(!pinchState) return;
  pinchState = null;
});

document.addEventListener("click",(event)=>{
  const clickedInsideTowerMenu = !!(towerMenu && towerMenu.contains(event.target));
  const clickedInsideUnitPanel = !!(unitInfoPanel && unitInfoPanel.contains(event.target));
  const clickedCanvas = event.target === canvas;
  const clickedMapUnit = !!event.target.closest(".map-unit-btn");
  const clickedViewBtn = event.target === resetCameraBtn || !!event.target.closest("#resetCameraBtn");

  if(!clickedInsideTowerMenu && !clickedCanvas){
    selectedPlacedUnitId = null;
    hideTowerMenu();
    updateUI();
  }

  if(!clickedInsideUnitPanel && !clickedMapUnit && !clickedViewBtn){
    hideUnitInfoPanel();
  }
});


audioToggle?.addEventListener("click",(event)=>{
  event.stopPropagation();
  ensureAudio();
  isMuted = !isMuted;
  if(audioAssets){
    Object.values(audioAssets).forEach((pool)=>pool.setMuted(isMuted));
  }
  if(isMuted) stopBossLoop();
  updateAudioToggle();
  setMessage(isMuted ? "Sunet oprit." : "Sunet pornit.");
});

document.addEventListener("keydown",(event)=>{
  const activeTag = document.activeElement?.tagName;
  if(activeTag === "INPUT" || activeTag === "TEXTAREA") return;

  const key = event.key.toLowerCase();

  if(event.key === " "){
    event.preventDefault();
    if(!hasStarted){
      startGameBtn?.click();
      return;
    }
    if(waveActive) togglePause();
    else startWave();
    return;
  }

  if(key === "r"){
    resetGame();
    return;
  }

  if(key === "v"){
    toggleUnitInfoPanel();
    updateUI();
    return;
  }

  if(event.key === "Escape"){
    selectedPlacedUnitId = null;
    hideTowerMenu();
    hideUnitInfoPanel();
    cancelSpellSelection();
    updateUI();
    return;
  }

  if(key === "1"){ selectedUnitType = "archer"; }
  else if(key === "2"){ selectedUnitType = "hunter"; }
  else if(key === "3"){ selectedUnitType = "mage"; }
  else if(key === "4"){ selectedUnitType = "bomb"; }
  else { return; }

  syncUnitSelectors();
  hideTowerMenu();
  selectedPlacedUnitId = null;
  const t = UNIT_TYPES[selectedUnitType];
  setMessage(`Ai selectat ${t.name} · Cost ${t.cost} · Range ${Math.round(t.range)}`);
  updateUI();
});


notificationToggle?.addEventListener("click",()=>{
  notificationPanel?.classList.toggle("collapsed");
  if(!notificationPanel?.classList.contains("collapsed")){
    notificationBadge?.classList.add("hidden");
  }
});

auraRewardList?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-aura-id]");
  if(!card) return;
  const auraId = card.dataset.auraId;
  const aura = AURA_REWARDS[auraId];
  if(!aura) return;
  pendingAuraChoice = aura;
  hideAuraRewardOverlay();
  auraRewardNote.textContent = `Aura aleasă: ${aura.name}. Click pe turnul dorit pentru a o fixa permanent.`;
  setMessage(`Ai ales ${aura.name}. Click pe turnul care trebuie binecuvântat.`);
  isPaused = false;
  updateUI();
});

refreshLeaderboardBtn?.addEventListener("click", ()=>{ loadBonusLeaderboard(); });
