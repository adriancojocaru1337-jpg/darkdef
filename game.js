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
const hudToggleBtn = document.getElementById("hudToggleBtn");

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
const towerSpecializationPanel = document.getElementById("towerSpecializationPanel");

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
const returnToMenuBtn = document.getElementById("returnToMenuBtn");
const gameOverText = document.getElementById("gameOverText");
const gameOverQuote = document.getElementById("gameOverQuote");
const gameOverStageStat = document.getElementById("gameOverStageStat");
const gameOverWaveStat = document.getElementById("gameOverWaveStat");
const gameOverKillsStat = document.getElementById("gameOverKillsStat");
const gameOverScoreStat = document.getElementById("gameOverScoreStat");
const auraRewardOverlay = document.getElementById("auraRewardOverlay");
const auraRewardList = document.getElementById("auraRewardList");
const auraRewardText = document.getElementById("auraRewardText");
const auraRewardNote = document.getElementById("auraRewardNote");
const endlessUnlockOverlay = document.getElementById("endlessUnlockOverlay");
const endlessUnlockText = document.getElementById("endlessUnlockText");
const enterEndlessBtn = document.getElementById("enterEndlessBtn");
const backToMenuFromEndlessBtn = document.getElementById("backToMenuFromEndlessBtn");

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
const mobileLayoutMedia = window.matchMedia("(max-width: 700px)");

const TEST_MODE_ONE_HP = false;

function enforceTestModeEnemyHp(enemy){
  if(!enemy || !TEST_MODE_ONE_HP) return enemy;
  enemy.maxHp = 1;
  enemy.hp = Math.min(enemy.hp ?? 1, 1);
  if(enemy.hp <= 0) enemy.hp = 1;
  return enemy;
}


function applyHudVisibility(){
  const hidden = !!isHudManuallyHidden;
  canvasWrap?.classList.toggle("hud-hide-obstacles", hidden);
  hudToggleBtn?.classList.toggle("active", hidden);
  if(hudToggleBtn){
    hudToggleBtn.setAttribute("aria-label", hidden ? "Show interface" : "Hide interface");
    hudToggleBtn.setAttribute("title", hidden ? "Show interface (H)" : "Hide interface (H)");
    hudToggleBtn.textContent = hidden ? "◑" : "◐";
  }
}

function setPlacementHudAutoHide(value){
  isPlacementHudAutoHidden = false;
}

function toggleHudVisibility(){
  isHudManuallyHidden = !isHudManuallyHidden;
  applyHudVisibility();
  setMessage(isHudManuallyHidden ? "Interface hidden." : "Interface visible.");
}
function getVisibleMobileBottomStack(){
  if(!mobileLayoutMedia.matches || !unitInfoPanel || unitInfoPanel.classList.contains("hidden")) return 0;
  return Math.ceil(unitInfoPanel.getBoundingClientRect().height) + 12;
}

function syncMobileHudLayout(){
  if(!canvasWrap) return;
  canvasWrap.style.setProperty("--mobile-bottom-stack", `${getVisibleMobileBottomStack()}px`);
}

function clampTowerMenuPosition(targetLeft, targetTop){
  if(!towerMenu || !canvasWrap) return { left: targetLeft, top: targetTop };
  const wrapRect = canvasWrap.getBoundingClientRect();
  const menuRect = towerMenu.getBoundingClientRect();
  const sidePadding = mobileLayoutMedia.matches ? 12 : 16;
  const topPadding = mobileLayoutMedia.matches ? 84 : 16;
  const bottomPadding = mobileLayoutMedia.matches ? getVisibleMobileBottomStack() + 88 : 16;
  const maxLeft = Math.max(sidePadding, wrapRect.width - menuRect.width - sidePadding);
  const maxTop = Math.max(topPadding, wrapRect.height - menuRect.height - bottomPadding);
  return {
    left: Math.min(Math.max(targetLeft, sidePadding), maxLeft),
    top: Math.min(Math.max(targetTop, topPadding), maxTop)
  };
}


const COLS = 18, ROWS = 10, CELL = 56;
const START_LIVES = 20, START_MONEY = 220;

const towerSpriteSources = {
  archer: "assets/towers/archer.png",
  hunter: "assets/towers/hunter.png",
  mage: "assets/towers/mage.png",
  bomb: "assets/towers/bomb.png"
};
const towerSprites = {};
function loadTowerSprites(){
  Object.entries(towerSpriteSources).forEach(([key, src]) => {
    const img = new Image();
    img.src = src;
    towerSprites[key] = img;
  });
}
loadTowerSprites();


const STAGES = {
  1: { name:"Forest", bossWave:5, difficulty:1.0, bossAbility:"summon",
    route:[{c:0,r:4},{c:4,r:4},{c:4,r:2},{c:9,r:2},{c:9,r:7},{c:13,r:7},{c:13,r:3},{c:17,r:3}],
    grassPatches:[{x:42,y:26,w:120,h:72},{x:790,y:408,w:124,h:76},{x:368,y:438,w:140,h:52}],
    trees:[{x:98,y:116},{x:918,y:466},{x:956,y:86},{x:710,y:118}]},
  2: { name:"Ruins", bossWave:6, difficulty:1.25, bossAbility:"rage",
    route:[{c:0,r:7},{c:5,r:7},{c:5,r:2},{c:9,r:2},{c:9,r:5},{c:14,r:5},{c:14,r:2},{c:17,r:2}],
    grassPatches:[{x:84,y:352,w:166,h:98},{x:704,y:38,w:160,h:78},{x:408,y:212,w:112,h:62}],
    ruins:[{x:108,y:126},{x:846,y:168},{x:770,y:424},{x:524,y:302}]},
  3: { name:"Graveyard", bossWave:7, difficulty:1.5, bossAbility:"shield",
    route:[{c:0,r:5},{c:3,r:5},{c:3,r:7},{c:9,r:7},{c:9,r:2},{c:14,r:2},{c:14,r:6},{c:17,r:6}],
    grassPatches:[{x:102,y:44,w:162,h:62},{x:476,y:376,w:124,h:76},{x:804,y:298,w:110,h:64}],
    ruins:[{x:150,y:178},{x:596,y:132},{x:866,y:380},{x:700,y:466}]},
  4: { name:"Castle", bossWave:8, difficulty:1.85, bossAbility:"summon",
    route:[{c:0,r:2},{c:6,r:2},{c:6,r:5},{c:10,r:5},{c:10,r:2},{c:15,r:2},{c:15,r:7},{c:17,r:7}],
    grassPatches:[{x:54,y:402,w:144,h:74},{x:744,y:64,w:152,h:66},{x:514,y:434,w:128,h:54}],
    ruins:[{x:184,y:236},{x:790,y:286},{x:918,y:186}]},
  5: { name:"Catacombs", bossWave:9, difficulty:2.05, bossAbility:"rage",
    route:[{c:0,r:6},{c:2,r:6},{c:2,r:2},{c:8,r:2},{c:8,r:7},{c:13,r:7},{c:13,r:3},{c:17,r:3}],
    grassPatches:[{x:78,y:72,w:108,h:48},{x:794,y:434,w:134,h:52},{x:470,y:300,w:116,h:64}],
    ruins:[{x:366,y:258},{x:846,y:154},{x:628,y:456}]},
  6: { name:"Dark Portal", bossWave:10, difficulty:2.8, bossAbility:"summon",
    route:[{c:0,r:2},{c:5,r:2},{c:5,r:7},{c:8,r:7},{c:8,r:2},{c:13,r:2},{c:13,r:7},{c:17,r:7}],
    grassPatches:[{x:86,y:42,w:120,h:62},{x:752,y:344,w:166,h:84},{x:500,y:458,w:124,h:52}],
    ruins:[{x:184,y:144},{x:492,y:340},{x:856,y:214},{x:952,y:430}]}
};

const stageFxState = {
  emberSeed: Array.from({length: 18}, (_, i) => ({
    baseX: 40 + i * 53 + (i % 3) * 7,
    phase: i * 0.7,
    speed: 0.18 + (i % 5) * 0.035,
    size: 1.2 + (i % 4) * 0.5
  }))
};

const STAGE_VEGETATION = {
  1:[{x:146,y:126,size:22,kind:'bush',phase:0.1},{x:678,y:454,size:24,kind:'bush',phase:1.4},{x:846,y:246,size:20,kind:'fern',phase:2.2}],
  2:[{x:122,y:254,size:18,kind:'deadbush',phase:0.3},{x:642,y:118,size:20,kind:'deadbush',phase:1.6},{x:854,y:458,size:17,kind:'grass',phase:2.6}],
  3:[{x:110,y:118,size:19,kind:'thorn',phase:0.6},{x:382,y:448,size:22,kind:'thorn',phase:1.9},{x:932,y:278,size:18,kind:'thorn',phase:2.8}],
  4:[{x:116,y:432,size:18,kind:'ivy',phase:0.5},{x:708,y:106,size:20,kind:'ivy',phase:1.5},{x:904,y:426,size:17,kind:'ivy',phase:2.4}],
  5:[{x:174,y:98,size:20,kind:'moss',phase:0.9},{x:438,y:316,size:18,kind:'moss',phase:1.8},{x:910,y:430,size:22,kind:'moss',phase:2.9}],
  6:[{x:102,y:78,size:18,kind:'voidbloom',phase:0.2},{x:572,y:466,size:20,kind:'voidbloom',phase:1.7},{x:896,y:342,size:19,kind:'voidbloom',phase:2.5}]
};

const UNIT_TYPES = {
  archer:{name:"Archer",cost:100,range:120,fireRate:.8,damage:36,projectileSpeed:430,color:"#34d399",hood:"#065f46",upgradeCost:120,sellFactor:.8,kind:"arrow"},
  hunter:{name:"Hunter",cost:180,range:178,fireRate:1.3,damage:68,projectileSpeed:500,color:"#f59e0b",hood:"#78350f",upgradeCost:200,sellFactor:.8,kind:"arrow"},
  mage:{name:"Mage",cost:240,range:150,fireRate:1.15,damage:48,projectileSpeed:390,color:"#a78bfa",hood:"#5b21b6",upgradeCost:220,sellFactor:.82,kind:"magic",splash:46},
  bomb:{name:"Bomb Tower",cost:280,range:140,fireRate:1.55,damage:96,projectileSpeed:320,color:"#ef4444",hood:"#7f1d1d",upgradeCost:320,sellFactor:.84,kind:"bomb",splash:64}
};

const TOWER_SPECIALIZATIONS = {
  archer: {
    rapid: {
      id:"rapid",
      name:"Rapid Shot",
      short:"Fast arrows · anti-fast",
      costMult:1.35,
      statLabel:"AS↑ / Speed↑",
      apply(unit){
        unit.damage *= 0.95;
        unit.fireRate *= 0.78;
        unit.projectileSpeed *= 1.15;
      }
    },
    heavy: {
      id:"heavy",
      name:"Heavy Arrows",
      short:"Heavy hits · anti-tank",
      costMult:1.35,
      statLabel:"DMG↑ / slower",
      apply(unit){
        unit.damage *= 1.38;
        unit.fireRate *= 1.08;
        unit.projectileSpeed *= 1.05;
      }
    }
  },
  hunter: {
    sniper: {
      id:"sniper",
      name:"Sniper",
      short:"Long range · elite killer",
      costMult:1.35,
      statLabel:"Range↑ / DMG↑",
      apply(unit){
        unit.range *= 1.20;
        unit.damage *= 1.25;
        unit.fireRate *= 1.08;
      }
    },
    tracker: {
      id:"tracker",
      name:"Tracker",
      short:"Anti-fast specialist",
      costMult:1.35,
      statLabel:"Fast bonus / Speed↑",
      apply(unit){
        unit.damage *= 1.12;
        unit.projectileSpeed *= 1.20;
        unit.specBonusVsFast = 1.35;
      }
    }
  },
  mage: {
    frost: {
      id:"frost",
      name:"Frost Mage",
      short:"20% slow on hit",
      costMult:1.35,
      statLabel:"Control / range↑",
      apply(unit){
        unit.damage *= 1.08;
        unit.range *= 1.05;
        unit.specSlowFactor = 0.80;
        unit.specSlowDuration = 1.2;
      }
    },
    arc: {
      id:"arc",
      name:"Arc Mage",
      short:"Chains to 1 extra target",
      costMult:1.35,
      statLabel:"Chain / DMG↑",
      apply(unit){
        unit.damage *= 1.10;
        unit.specChainTargets = 1;
        unit.specChainDamageFactor = 0.60;
      }
    }
  },
  bomb: {
    demolition: {
      id:"demolition",
      name:"Demolition",
      short:"Big splash burst",
      costMult:1.35,
      statLabel:"Splash↑ / DMG↑",
      apply(unit){
        unit.damage *= 1.20;
        unit.splash *= 1.30;
        unit.fireRate *= 1.06;
      }
    },
    shock: {
      id:"shock",
      name:"Shock Bomb",
      short:"Shockwaves can stun",
      costMult:1.35,
      statLabel:"Stun / control",
      apply(unit){
        unit.damage *= 1.05;
        unit.splash *= 0.95;
        unit.specStunChance = 0.20;
        unit.specStunDuration = 0.60;
      }
    }
  }
};

function getSpecializationData(unit){
  if(!unit?.specialization) return null;
  return TOWER_SPECIALIZATIONS[unit.type]?.[unit.specialization] || null;
}

function getSpecializationIcon(specId){
  const icons = {
    rapid: "➶",
    heavy: "➹",
    sniper: "⌖",
    tracker: "◎",
    frost: "❄",
    arc: "⚡",
    demolition: "✹",
    shock: "✦"
  };
  return icons[specId] || "✦";
}

function getSpecializationTheme(specId){
  const themes = {
    rapid: { fill:"rgba(22,101,52,.88)", stroke:"rgba(134,239,172,.82)", icon:"#f0fdf4", glow:"rgba(34,197,94,.32)", panel:"rgba(34,197,94,.18)", panelBorder:"rgba(134,239,172,.46)" },
    heavy: { fill:"rgba(146,64,14,.90)", stroke:"rgba(253,224,71,.82)", icon:"#fffbeb", glow:"rgba(245,158,11,.30)", panel:"rgba(245,158,11,.18)", panelBorder:"rgba(253,224,71,.46)" },
    sniper: { fill:"rgba(30,64,175,.90)", stroke:"rgba(125,211,252,.82)", icon:"#eff6ff", glow:"rgba(59,130,246,.30)", panel:"rgba(59,130,246,.18)", panelBorder:"rgba(125,211,252,.46)" },
    tracker: { fill:"rgba(6,95,70,.90)", stroke:"rgba(110,231,183,.84)", icon:"#ecfdf5", glow:"rgba(16,185,129,.30)", panel:"rgba(16,185,129,.18)", panelBorder:"rgba(110,231,183,.46)" },
    frost: { fill:"rgba(14,116,144,.90)", stroke:"rgba(103,232,249,.84)", icon:"#ecfeff", glow:"rgba(6,182,212,.30)", panel:"rgba(6,182,212,.18)", panelBorder:"rgba(103,232,249,.46)" },
    arc: { fill:"rgba(91,33,182,.90)", stroke:"rgba(196,181,253,.84)", icon:"#f5f3ff", glow:"rgba(139,92,246,.30)", panel:"rgba(139,92,246,.18)", panelBorder:"rgba(196,181,253,.46)" },
    demolition: { fill:"rgba(153,27,27,.90)", stroke:"rgba(252,165,165,.84)", icon:"#fef2f2", glow:"rgba(239,68,68,.30)", panel:"rgba(239,68,68,.18)", panelBorder:"rgba(252,165,165,.46)" },
    shock: { fill:"rgba(133,77,14,.92)", stroke:"rgba(253,224,71,.84)", icon:"#fefce8", glow:"rgba(234,179,8,.30)", panel:"rgba(234,179,8,.18)", panelBorder:"rgba(253,224,71,.46)" }
  };
  return themes[specId] || { fill:"rgba(30,41,59,.92)", stroke:"rgba(196,181,253,.46)", icon:"rgba(196,181,253,.98)", glow:"rgba(139,92,246,.22)", panel:"rgba(139,92,246,.16)", panelBorder:"rgba(196,181,253,.36)" };
}

function getSpecializationChoices(unit){
  const defs = TOWER_SPECIALIZATIONS[unit?.type];
  return defs ? Object.values(defs) : [];
}

function canChooseSpecialization(unit){
  return !!(unit && !unit.specialization && !!TOWER_SPECIALIZATIONS[unit.type] && unit.level === 2);
}

function getSpecializationCost(unit){
  const choice = getSpecializationChoices(unit)[0];
  return choice ? Math.round(unit.nextUpgradeCost * choice.costMult) : unit.nextUpgradeCost;
}


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
    desc:"Aggressively burns targets and triggers an explosion on kill for strong wave clear.",
    bullets:["Burn 3s","35% damage/sec from hit","60% damage explosion on kill"]
  },
  frost: {
    id:"frost",
    name:"Frost Crown",
    icon:"❄",
    className:"frost",
    color:"#67e8f9",
    desc:"Applies a heavy slow, then a real freeze after repeated hits on the same target.",
    bullets:["22% slow for 1.8s","Freeze 0.9s after 4 hits","Freeze cooldown 4s / enemy"]
  },
  storm: {
    id:"storm",
    name:"Storm Sigil",
    icon:"⚡",
    className:"storm",
    color:"#fde047",
    desc:"Hits the main target and instantly jumps to nearby enemies.",
    bullets:["2 chain jumps","65% chain damage","+20% damage if single target"]
  },
  wealth: {
    id:"wealth",
    name:"Golden Pact",
    icon:"💰",
    className:"wealth",
    color:"#fbbf24",
    desc:"Turns the tower into a snowball engine with extra gold, score, and a temporary buff.",
    bullets:["+40% gold la kill","+25 bonus score la kill","Pact Surge la fiecare 8 killuri"]
  }
};

let currentStage = 1, path = STAGES[currentStage].route, pathCells = buildPathCells(path);
let units = [], enemies = [], projectiles = [], particles = [], popups = [], placementEffects = [], upgradeEffects = [];
let money = START_MONEY, lives = START_LIVES, score = 0, bonusScore = 0, kills = 0;
let wave = 1, stageWave = 1, waveActive = false, spawnLeft = 0, selectedUnitType = "archer", selectedPlacedUnitId = null;
let isHudManuallyHidden = false, isPlacementHudAutoHidden = false;
let spawnTimer = 0, idCounter = 1, lastTime = 0, hoveredCell = null, isPaused = false, hasStarted = false, bossBannerTimer = 0, stageStartLives = START_LIVES;
let currentMode = "campaign", endlessUnlocked = false;
let bossFxTimer = 0;
let bossFxType = "";
let waveIntroTimer = 0;
let waveIntroText = "";
let waveIntroSubtext = "";
let bossDefeatIntroTimer = 0;
let bossDefeatRewardDelayTimer = 0;
let bossDefeatIntroText = "";
let bossDefeatIntroSubtext = "";

const GAME_OVER_QUOTES = [
  "“Even broken walls remember how to stand.”",
  "“From ash and ruin, the bastion rises again.”",
  "“The dark may enter once, but never unchallenged.”",
  "“Every fall teaches the next stand.”"
];

const ENDLESS_UNLOCK_QUOTES = [
  "“You thought you’d seen it all. You were wrong.”",
  "“The quiet wasn’t peace… it was a warning.”",
  "“Something ancient just woke up.”",
  "“The shadows have been waiting for this moment.”",
  "“What comes next was never meant to be seen.”",
  "“The darkness didn’t retreat. It regrouped.”",
  "“You’ve crossed the threshold. Now the unknown crosses back.”"
];

const STAGE_QUOTES = [
  "Victory is survival with a name.",
  "The war never ends. Only the soldiers change.",
  "You didn’t win. You endured.",
  "Strength is a path. You just crossed the line.",
  "This is where weakness ends.",
  "Survival is not victory. It’s permission to continue.",
  "The towers do not fear. They endure.",
  "You built this line. Now hold it.",
  "The tower never retreats.",
  "Where towers rise, hope resists.",
  "Your defense is their grave.",
  "You don’t fight the war. You shape it.",
  "The towers decide who passes.",
  "What you’ve awakened now guards your path.",
  "Your will now echoes through every tower.",
  "The aura binds you to the battlefield."
];
let lastStageQuote = "";
let stageQuoteTimer = 0;
let stageQuoteText = "";
let stageQuoteSubtext = "";
let stageQuoteResolveTimer = 0;
let auraBindFxTimer = 0;
let auraBindFxUnitId = null;
let reservePool = { archer:[], hunter:[], mage:[], bomb:[] };
let view = { scale: 1, minScale: 1, maxScale: 1.7, offsetX: 0, offsetY: 0 };
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
let pendingEndlessBossPair = [];

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


function applySpecializationStatusOnEnemy(enemy, unit, pos, damageDone=0){
  if(!enemy || !unit || !unit.specialization) return;
  if(unit.type === "mage" && unit.specialization === "frost") {
    enemy.specSlowTimer = Math.max(enemy.specSlowTimer || 0, unit.specSlowDuration || 1.2);
    enemy.specSlowFactor = Math.min(enemy.specSlowFactor || 1, unit.specSlowFactor || 0.80);
    if(pos) showPopup(pos.x, pos.y - 18, "Slow", "#93c5fd");
  } else if(unit.type === "bomb" && unit.specialization === "shock") {
    const stunChance = unit.specStunChance || 0;
    if(stunChance > 0 && Math.random() < stunChance){
      enemy.stunTimer = Math.max(enemy.stunTimer || 0, unit.specStunDuration || 0.60);
      if(pos) showPopup(pos.x, pos.y - 18, "Stun!", "#fca5a5");
    }
  }
}

function triggerSpecializationChain(sourceEnemy, sourceUnit, sourcePos){
  if(!sourceEnemy || !sourceUnit || sourceUnit.type !== "mage" || sourceUnit.specialization !== "arc") return;
  const jumps = sourceUnit.specChainTargets || 0;
  if(jumps <= 0) return;
  const stats = getAuraAdjustedStats(sourceUnit);
  const chainDamage = stats.damage * (sourceUnit.specChainDamageFactor || 0.60);
  let currentPos = sourcePos;
  const visited = new Set([sourceEnemy.id]);
  for(let jump=0; jump<jumps; jump++){
    const next = enemies
      .filter(enemy => !visited.has(enemy.id))
      .map(enemy => ({ enemy, pos:getPathPosition(enemy.progress), dist:distance(currentPos, getPathPosition(enemy.progress)) }))
      .filter(item => item.dist <= 90)
      .sort((a,b)=>a.dist-b.dist)[0];
    if(!next) break;
    visited.add(next.enemy.id);
    next.enemy.hp -= chainDamage;
    markEnemyHit(next.enemy, sourceUnit, chainDamage);
    addHitParticles(next.pos.x, next.pos.y, 7, "#c4b5fd");
    showPopup(next.pos.x, next.pos.y - 12, `-${Math.round(chainDamage)}`, "#c4b5fd");
    currentPos = next.pos;
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
  auraRewardText.textContent = "The boss has been defeated. Choose 1 of 3 legendary auras, then apply it to a single tower. That aura stays on the tower in future stages.";
  auraRewardNote.textContent = units.length ? "Choose the reward, then click the tower that should keep the aura." : "You have no towers on the map. The reward will be skipped.";
  auraRewardOverlay.classList.remove("hidden");
  isPaused = true;
  updateUI();
}

function hideAuraRewardOverlay(){
  auraRewardOverlay?.classList.add("hidden");
}

function beginBossAuraReward(){
  if(!units.length){
    pushNotification("stage", "Aura missed", "There was no tower on the field for the boss reward.");
    resolveBossWaveCompletion();
    return;
  }
  showAuraRewardOverlay();
}

function queueBossAuraReward(){
  bossDefeatIntroTimer = 1.2;
  bossDefeatRewardDelayTimer = 1.55;
  bossDefeatIntroText = "BOSS DEFEATED";
  bossDefeatIntroSubtext = "Choose a legendary aura";
  isPaused = true;
  setMessage("Boss defeated. Choose your legendary aura.");
  updateUI();
}

function pickStageQuote(){
  if(!STAGE_QUOTES.length) return "";
  if(STAGE_QUOTES.length === 1){
    lastStageQuote = STAGE_QUOTES[0];
    return STAGE_QUOTES[0];
  }

  let quote = "";
  do {
    quote = STAGE_QUOTES[Math.floor(Math.random() * STAGE_QUOTES.length)];
  } while(quote === lastStageQuote);

  lastStageQuote = quote;
  return quote;
}

function startAuraBindCinematic(unit){
  auraBindFxUnitId = unit?.id || null;
  auraBindFxTimer = 1.0;
  stageQuoteText = pickStageQuote();
  stageQuoteSubtext = `Stage ${currentStage} cleared`;
  stageQuoteTimer = 3.6;
  stageQuoteResolveTimer = 3.2;
  setMessage(`${unit.name} received ${unit.auraName}.`);
  updateUI();
}

function applyPendingAuraToUnit(unit){
  if(!pendingAuraChoice || !unit) return false;
  unit.auraType = pendingAuraChoice.id;
  unit.auraName = pendingAuraChoice.name;
  unit.auraIcon = pendingAuraChoice.icon;

  const appliedAuraName = unit.auraName;
  pendingAuraChoice = null;
  hideAuraRewardOverlay();

  pushNotification("achievement", "Aura applied", `${unit.name} received ${appliedAuraName}. It will keep the aura in future stages.`);
  showPopup(
    cellCenter(unit.c, unit.r).x,
    cellCenter(unit.c, unit.r).y - 18,
    appliedAuraName,
    getAuraData(unit.auraType)?.color || "#fde68a"
  );

  isPaused = true;
  startAuraBindCinematic(unit);
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
    pushNotification("stage","Stage Clear",`You reached Stage ${currentStage} — ${STAGES[currentStage].name}. Your towers were moved to reserve.`);
    saveProgress();
    setMessage(`Stage clear! You reached Stage ${currentStage} — ${STAGES[currentStage].name}.`);
  } else if(resolution.type === "unlock-endless") {
    submitStoryLeaderboardScore(currentStage);
    endlessUnlocked = true;
    try { localStorage.setItem("sdcEndlessUnlocked","1"); } catch(e){}
    pushNotification("stage","Endless Mode unlocked",`You finished the campaign. Endless Mode is now unlocked!`);
    saveProgress();
    setMessage(`You finished the main campaign. Endless Mode has been unlocked.`);
    showEndlessUnlockOverlay();
    updateUI();
    return;
  } else if(resolution.type === "endless-next") {
    stageWave += 1;
    if(currentMode === "campaign") wave += 1;
    money += 50;
    bonusScore += 80;
    pushNotification("stage","Endless Boss down",`Keep going! Endless wave ${stageWave} is next.`);
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
  bonusLeaderboardSubtitle.textContent = "Loading the global Endless bonus scoreboard...";
  try{
    const response = await fetch("/.netlify/functions/get-bonus-leaderboard", { cache: "no-store" });
    if(!response.ok) throw new Error("Leaderboard unavailable");
    const rows = await response.json();
    if(!Array.isArray(rows) || rows.length === 0){
      bonusLeaderboardList.innerHTML = '<div class="leaderboard-empty">No Endless runs submitted yet.</div>';
      bonusLeaderboardSubtitle.textContent = "Be the first to post a bonus score.";
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
    bonusLeaderboardList.innerHTML = '<div class="leaderboard-empty">Leaderboard is temporarily unavailable.</div>';
    bonusLeaderboardSubtitle.textContent = "Connect Netlify Functions + Neon for the global leaderboard.";
  }
}

async function submitStoryLeaderboardScore(finalStage=currentStage){
  if(currentMode !== "campaign") return;
  let playerName = "";
  try{
    playerName = localStorage.getItem("sdcPlayerName") || "";
  }catch(e){}
  if(!playerName){
    playerName = prompt("Name for the Story leaderboard:") || "";
  }
  playerName = playerName.trim().slice(0, 20);
  if(!playerName) return;
  try{
    localStorage.setItem("sdcPlayerName", playerName);
  }catch(e){}
  try{
    await ensureLeaderboardRun("campaign");
    const response = await fetch("/.netlify/functions/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "campaign",
        name: playerName,
        score: totalScore(),
        bonusScore: bonusScore,
        wave: finalStage,
        kills: kills,
        runId: leaderboardRun.runId,
        runToken: leaderboardRun.runToken,
        clientStartedAt: leaderboardRun.clientStartedAt,
        elapsedMs: leaderboardRun.clientStartedAt ? (Date.now() - leaderboardRun.clientStartedAt) : 0
      })
    });
    if(!response.ok) throw new Error("submit failed");
    leaderboardRun = { runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:"campaign" };
    pushNotification("achievement", "Story leaderboard submitted", `${playerName} reached stage ${finalStage} with score ${totalScore()}.`);
  }catch(error){
    pushNotification("stage", "Story leaderboard offline", "The campaign score could not be submitted right now.");
  }
}

async function submitBonusLeaderboardScore(){
  if(currentMode !== "endless" || bonusScore <= 0) return;
  let playerName = "";
  try{
    playerName = localStorage.getItem("sdcPlayerName") || "";
  }catch(e){}
  if(!playerName){
    playerName = prompt("Name for the Endless Bonus leaderboard:") || "";
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
    pushNotification("achievement", "Leaderboard submitted", `${playerName} submitted bonus +${bonusScore} to the global leaderboard.`);
  }catch(error){
    pushNotification("stage", "Leaderboard offline", "The global score could not be submitted right now.");
  }
}


let audioCtx = null;
let audioAssets = null;
let ambientState = { currentStage:null, masterGain:null, nodes:[], intervals:[], noiseBuffer:null };

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
  if(audioCtx && !ambientState.noiseBuffer){
    const length = Math.max(1, Math.floor(audioCtx.sampleRate * 2.5));
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for(let i=0;i<length;i++){
      const white = Math.random() * 2 - 1;
      last = (last + (0.035 * white)) / 1.035;
      data[i] = last * 3.5;
    }
    ambientState.noiseBuffer = buffer;
  }
}

function clearAmbientAudio(){
  ambientState.intervals.forEach(id=>clearInterval(id));
  ambientState.intervals = [];
  ambientState.nodes.forEach(node=>{
    try{ if(node.stop) node.stop(); }catch(e){}
    try{ node.disconnect?.(); }catch(e){}
  });
  ambientState.nodes = [];
  if(ambientState.masterGain){
    try{ ambientState.masterGain.disconnect(); }catch(e){}
  }
  ambientState.masterGain = null;
}

function createAmbientNoise({ type="lowpass", frequency=800, q=0.0001, gain=0.05, playbackRate=1 } = {}){
  if(!audioCtx || !ambientState.noiseBuffer) return null;
  const src = audioCtx.createBufferSource();
  src.buffer = ambientState.noiseBuffer;
  src.loop = true;
  src.playbackRate.value = playbackRate;

  const filter = audioCtx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gain;

  src.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ambientState.masterGain);
  src.start();

  ambientState.nodes.push(src, filter, gainNode);
  return { src, filter, gainNode };
}

function createAmbientOsc({ type="sine", frequency=110, gain=0.02 } = {}){
  if(!audioCtx) return null;
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gain;
  osc.connect(gainNode);
  gainNode.connect(ambientState.masterGain);
  osc.start();
  ambientState.nodes.push(osc, gainNode);
  return { osc, gainNode };
}

function ambientPulse(freq=220, duration=0.2, peak=0.03, type="sine"){
  if(!audioCtx || isMuted || !ambientState.masterGain) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + Math.min(0.04, duration * 0.35));
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gainNode);
  gainNode.connect(ambientState.masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
  ambientState.nodes.push(osc, gainNode);
}

function ambientNoiseBurst({ type="bandpass", frequency=1200, q=0.8, duration=0.6, peak=0.02, playbackRate=1 } = {}){
  if(!audioCtx || isMuted || !ambientState.masterGain || !ambientState.noiseBuffer) return;
  const now = audioCtx.currentTime;
  const src = audioCtx.createBufferSource();
  src.buffer = ambientState.noiseBuffer;
  src.loop = true;
  src.playbackRate.value = playbackRate;
  const filter = audioCtx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + Math.min(0.08, duration * 0.3));
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  src.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ambientState.masterGain);
  src.start(now);
  src.stop(now + duration + 0.05);
  ambientState.nodes.push(src, filter, gainNode);
}

function ambientSweep(startFreq=500, endFreq=200, duration=1.1, peak=0.01, type="triangle"){
  if(!audioCtx || isMuted || !ambientState.masterGain) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + duration);
  filter.type = "lowpass";
  filter.frequency.value = Math.max(startFreq, endFreq) * 2;
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + Math.min(0.12, duration * 0.28));
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ambientState.masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.05);
  ambientState.nodes.push(osc, filter, gainNode);
}

function playRareAmbientEvent(stage=currentStage){
  if(!audioCtx || isMuted || !ambientState.masterGain || stage !== currentStage) return;
  const roll = Math.random();
  if(stage === 1){
    if(roll < 0.55){
      ambientNoiseBurst({ type:"bandpass", frequency:1900 + Math.random()*400, q:1.2, duration:0.18 + Math.random()*0.18, peak:0.008, playbackRate:1.2 + Math.random()*0.25 });
      setTimeout(()=>ambientPulse(920 + Math.random()*220, 0.07 + Math.random()*0.05, 0.004, "sine"), 60 + Math.random()*120);
    } else {
      ambientSweep(520 + Math.random()*120, 170 + Math.random()*40, 1.4 + Math.random()*0.4, 0.006, "triangle");
    }
  } else if(stage === 2){
    if(roll < 0.6){
      ambientPulse(140 + Math.random()*30, 0.06, 0.012, "square");
      setTimeout(()=>ambientPulse(90 + Math.random()*20, 0.14, 0.007, "square"), 90);
      setTimeout(()=>ambientNoiseBurst({ type:"bandpass", frequency:800 + Math.random()*240, q:3.5, duration:0.15, peak:0.004, playbackRate:0.85 }), 20);
    } else {
      ambientNoiseBurst({ type:"highpass", frequency:1200 + Math.random()*500, q:0.5, duration:0.9, peak:0.007, playbackRate:0.6 + Math.random()*0.12 });
    }
  } else if(stage === 3){
    if(roll < 0.5){
      ambientSweep(380 + Math.random()*40, 130 + Math.random()*20, 2.2 + Math.random()*0.8, 0.007, "sine");
      setTimeout(()=>ambientPulse(260 + Math.random()*30, 0.28, 0.004, "triangle"), 260);
    } else {
      ambientNoiseBurst({ type:"bandpass", frequency:1400 + Math.random()*250, q:1.4, duration:0.45, peak:0.006, playbackRate:0.82 + Math.random()*0.1 });
      setTimeout(()=>ambientPulse(480 + Math.random()*90, 0.08, 0.0035, "sine"), 140);
    }
  } else if(stage === 4){
    if(roll < 0.65){
      ambientPulse(610 + Math.random()*90, 0.035, 0.006, "square");
      setTimeout(()=>ambientPulse(420 + Math.random()*60, 0.05, 0.004, "square"), 70);
      setTimeout(()=>ambientPulse(260 + Math.random()*40, 0.08, 0.003, "triangle"), 120);
    } else {
      ambientNoiseBurst({ type:"bandpass", frequency:2200 + Math.random()*300, q:2.8, duration:0.12, peak:0.0045, playbackRate:1.35 });
    }
  } else if(stage === 5){
    if(roll < 0.55){
      ambientNoiseBurst({ type:"lowpass", frequency:260 + Math.random()*80, q:0.4, duration:0.35, peak:0.01, playbackRate:0.7 + Math.random()*0.08 });
      setTimeout(()=>ambientPulse(160 + Math.random()*35, 0.16, 0.0045, "triangle"), 180);
    } else {
      ambientPulse(760 + Math.random()*180, 0.045, 0.006, "sine");
      setTimeout(()=>ambientPulse(510 + Math.random()*80, 0.06, 0.004, "sine"), 110);
    }
  } else if(stage === 6){
    if(roll < 0.5){
      ambientSweep(920 + Math.random()*180, 260 + Math.random()*100, 1.6 + Math.random()*0.6, 0.008, "sawtooth");
      setTimeout(()=>ambientPulse(640 + Math.random()*140, 0.11, 0.005, "triangle"), 180);
    } else {
      ambientNoiseBurst({ type:"bandpass", frequency:1800 + Math.random()*500, q:1.6, duration:0.4, peak:0.007, playbackRate:1 + Math.random()*0.15 });
      setTimeout(()=>ambientPulse(330 + Math.random()*120, 0.2, 0.0045, "sine"), 90);
    }
  }
}

function scheduleRareAmbientEvent(stage, minMs, maxMs){
  if(!audioCtx || isMuted || !ambientState.masterGain || stage !== currentStage) return;
  const wait = Math.floor(minMs + Math.random() * Math.max(0, maxMs - minMs));
  const id = setTimeout(()=>{
    if(!audioCtx || isMuted || stage !== currentStage || !ambientState.masterGain) return;
    playRareAmbientEvent(stage);
    scheduleRareAmbientEvent(stage, minMs, maxMs);
  }, wait);
  ambientState.intervals.push(id);
}

function syncAmbientAudio(){
  clearAmbientAudio();
  if(!audioCtx || isMuted) return;

  ambientState.currentStage = currentStage;
  ambientState.masterGain = audioCtx.createGain();
  ambientState.masterGain.gain.value = 0.16;
  ambientState.masterGain.connect(audioCtx.destination);

  const stage = currentStage;

  if(stage === 1){
    ambientState.masterGain.gain.value = 0.18;
    createAmbientNoise({ type:"lowpass", frequency:520, gain:0.055, playbackRate:0.9 });
    createAmbientNoise({ type:"bandpass", frequency:1400, q:0.4, gain:0.02, playbackRate:1.15 });
    const drone = createAmbientOsc({ type:"triangle", frequency:82, gain:0.008 });
    if(drone){
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 0.07;
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain);
      lfoGain.connect(drone.osc.frequency);
      lfo.start();
      ambientState.nodes.push(lfo, lfoGain);
    }
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 1) return;
      ambientPulse(660 + Math.random()*120, 0.12 + Math.random()*0.08, 0.008, "sine");
    }, 9000));
    scheduleRareAmbientEvent(1, 14000, 26000);
  } else if(stage === 2){
    ambientState.masterGain.gain.value = 0.15;
    createAmbientNoise({ type:"lowpass", frequency:380, gain:0.05, playbackRate:0.82 });
    createAmbientOsc({ type:"sawtooth", frequency:55, gain:0.006 });
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 2) return;
      ambientPulse(170 + Math.random()*40, 0.08, 0.01, "square");
      setTimeout(()=>ambientPulse(120 + Math.random()*35, 0.18, 0.006, "triangle"), 110);
    }, 7500));
    scheduleRareAmbientEvent(2, 15000, 28000);
  } else if(stage === 3){
    ambientState.masterGain.gain.value = 0.17;
    createAmbientNoise({ type:"bandpass", frequency:620, q:0.5, gain:0.024, playbackRate:0.72 });
    createAmbientOsc({ type:"triangle", frequency:74, gain:0.010 });
    createAmbientOsc({ type:"sine", frequency:111, gain:0.0045 });
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 3) return;
      ambientPulse(240 + Math.random()*40, 0.45, 0.008, "triangle");
      setTimeout(()=>ambientPulse(310 + Math.random()*60, 0.25, 0.005, "sine"), 180);
    }, 6200));
    scheduleRareAmbientEvent(3, 13000, 24000);
  } else if(stage === 4){
    ambientState.masterGain.gain.value = 0.15;
    createAmbientNoise({ type:"lowpass", frequency:450, gain:0.04, playbackRate:0.95 });
    createAmbientNoise({ type:"bandpass", frequency:1900, q:1.2, gain:0.009, playbackRate:1.3 });
    createAmbientOsc({ type:"triangle", frequency:92, gain:0.006 });
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 4) return;
      ambientPulse(520 + Math.random()*90, 0.04, 0.007, "square");
      setTimeout(()=>ambientPulse(250 + Math.random()*20, 0.05, 0.004, "square"), 80);
    }, 6800));
    scheduleRareAmbientEvent(4, 16000, 30000);
  } else if(stage === 5){
    ambientState.masterGain.gain.value = 0.17;
    createAmbientNoise({ type:"lowpass", frequency:300, gain:0.045, playbackRate:0.76 });
    createAmbientOsc({ type:"sine", frequency:58, gain:0.008 });
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 5) return;
      ambientPulse(480 + Math.random()*120, 0.09, 0.012, "sine");
      setTimeout(()=>ambientPulse(180 + Math.random()*40, 0.12, 0.005, "triangle"), 260);
    }, 5400));
    scheduleRareAmbientEvent(5, 14000, 25000);
  } else if(stage === 6){
    ambientState.masterGain.gain.value = 0.19;
    createAmbientNoise({ type:"bandpass", frequency:900, q:0.7, gain:0.025, playbackRate:0.9 });
    const humA = createAmbientOsc({ type:"sawtooth", frequency:72, gain:0.008 });
    const humB = createAmbientOsc({ type:"sine", frequency:145, gain:0.006 });
    [humA, humB].forEach((layer, idx)=>{
      if(!layer) return;
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = idx === 0 ? 0.14 : 0.2;
      lfoGain.gain.value = idx === 0 ? 9 : 5;
      lfo.connect(lfoGain);
      lfoGain.connect(layer.osc.frequency);
      lfo.start();
      ambientState.nodes.push(lfo, lfoGain);
    });
    ambientState.intervals.push(setInterval(()=>{
      if(isMuted || currentStage !== 6) return;
      ambientPulse(700 + Math.random()*220, 0.14, 0.010, "triangle");
      setTimeout(()=>ambientPulse(360 + Math.random()*140, 0.22, 0.006, "sine"), 120);
    }, 4100));
    scheduleRareAmbientEvent(6, 12000, 22000);
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
    text = "Choose the tower that will receive the legendary aura.";
  } else if(selectedSpell === "slow"){
    text = "Target Frost Nova at the desired area.";
  } else if(selectedSpell === "damage"){
    text = "Target Meteor Strike pe grupul de enemies.";
  } else if(selectedSpell === "bomb"){
    text = "Target Chain Lightning near the enemies.";
  } else if(selectedPlacedUnitId){
    text = "Tower selected — upgrade or sell from the popup menu.";
  } else if(unitInfoPanel && !unitInfoPanel.classList.contains("hidden")){
    text = "Shop open — choose the right tower for the wave.";
  } else if(waveActive){
    text = "Wave active — use spells and watch for the boss wave.";
  }
  hintChip.textContent = text;
}
const getUnitById=(id)=>units.find(u=>u.id===id)||null;
const reserveCount=(type)=>reservePool[type]?.length||0;
const reserveLevelLabel=(type)=>{ const pool=reservePool[type]||[]; return pool.length ? "Reserve: "+pool.map(u=>`Lv.${u.level||1}`).join(", ") : ""; };

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
    btn.disabled = !hasStarted || lives<=0 || isPaused || !ready;
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
  if(isPaused || spellCooldown.slow > 0) return false;
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
  setMessage(affected ? `Frost Nova slowed ${affected} enemies.` : "Frost Nova cast.");
  updateUI();
  return true;
}

function castDamageSpell(x, y){
  if(isPaused || spellCooldown.damage > 0) return false;
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
  setMessage(affected ? `Meteor Strike hit ${affected} enemies.` : "Meteor Strike cast.");
  updateUI();
  return true;
}

function castBombSpell(x, y){
  if(isPaused || spellCooldown.bomb > 0) return false;
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
  setMessage(affected ? `Chain Lightning hit ${affected} enemies.` : "Chain Lightning cast.");
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
  syncMobileHudLayout();
  applyHudVisibility();
}

function showUnitInfoPanel(){
  unitInfoPanel?.classList.remove("hidden");
  resetCameraBtn?.classList.add("active");
  syncMobileHudLayout();
  applyHudVisibility();
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
  const specialization = getSpecializationData(unit);
  const stats = getAuraAdjustedStats(unit);
  towerMenuName.textContent = unit.name;
  towerMenuLevel.textContent = `Lv.${unit.level}${aura ? ` · ${aura.icon} ${aura.name}` : ""}${specialization ? ` · ${specialization.name}` : ""}`;
  if(towerMenuAura){
    towerMenuAura.textContent = specialization ? specialization.name : (aura ? aura.name : "Standard");
    towerMenuAura.style.color = specialization ? "#c4b5fd" : (aura ? (aura.color || "#7dd3fc") : "#7dd3fc");
    towerMenuAura.style.borderColor = specialization ? "rgba(196,181,253,.28)" : (aura ? `${aura.color}44` : "rgba(56,189,248,.18)");
    towerMenuAura.style.background = specialization ? "rgba(139,92,246,.16)" : (aura ? `${aura.color}22` : "rgba(56,189,248,.12)");
  }
  const nextCost = canChooseSpecialization(unit) ? getSpecializationCost(unit) : Math.round(unit.nextUpgradeCost);
  const nextLabel = canChooseSpecialization(unit) ? "Spec" : "Upgrade";
  const specRow = specialization ? `<div class="tower-stat-row"><span>Spec</span><strong>${specialization.name}</strong></div>` : "";
  towerMenuStats.innerHTML = `
    <div class="tower-stat-row"><span>Damage</span><strong>${Math.round(stats.damage)}</strong></div>
    <div class="tower-stat-row"><span>Range</span><strong>${Math.round(stats.range)}</strong></div>
    <div class="tower-stat-row"><span>Speed</span><strong>${stats.fireRate.toFixed(2)}s</strong></div>
    ${specRow}
    <div class="tower-stat-row"><span>${nextLabel}</span><strong>${nextCost}</strong></div>
    <div class="tower-stat-row"><span>Sell</span><strong>${Math.round(unit.totalSpent * unit.sellFactor)}</strong></div>
  `;
  if(towerSpecializationPanel) towerSpecializationPanel.classList.add("hidden");
  towerUpgradeBtn.textContent = canChooseSpecialization(unit) ? "✨ Specialize" : "⬆ Upgrade";
  towerUpgradeBtn.disabled = money < nextCost;

  if(towerSpecializationPanel){
    if(canChooseSpecialization(unit)) {
      const cost = getSpecializationCost(unit);
      towerSpecializationPanel.innerHTML = getSpecializationChoices(unit).map(choice => {
        const theme = getSpecializationTheme(choice.id);
        return `
        <button class="tower-spec-btn" data-spec-id="${choice.id}" type="button" ${money < cost ? 'disabled' : ''} style="--spec-fill:${theme.panel}; --spec-border:${theme.panelBorder}; --spec-accent:${theme.stroke}; --spec-icon:${theme.icon}; --spec-medallion:${theme.fill}; --spec-glow:${theme.glow};">
          <span class="tower-spec-medallion" aria-hidden="true">${getSpecializationIcon(choice.id)}</span>
          <span class="tower-spec-copy">
            <strong>${choice.name}</strong>
            <span>${choice.short}</span>
            <em>${choice.statLabel} · ${cost}G</em>
          </span>
        </button>
      `;
      }).join("");
      towerSpecializationPanel.classList.remove("hidden");
    } else {
      towerSpecializationPanel.classList.add("hidden");
      towerSpecializationPanel.innerHTML = "";
    }
  }

  const wrapRect = canvasWrap.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const cssX = (pos.x / canvas.width) * canvasRect.width + (canvasRect.left - wrapRect.left);
  const cssY = (pos.y / canvas.height) * canvasRect.height + (canvasRect.top - wrapRect.top);

  towerMenu.classList.remove("hidden");
  // Keep the menu fully inside the canvas-wrap. A CSS translate on the menu can
  // push it out of bounds (especially for towers near the top edge), and the
  // wrap uses overflow:hidden.
  towerMenu.style.transform = "none";
  const preferredLeft = cssX - towerMenu.offsetWidth / 2;
  let preferredTop = cssY - towerMenu.offsetHeight - 18;
  const minTop = mobileLayoutMedia.matches ? 84 : 16;
  if(preferredTop < minTop){
    preferredTop = cssY + 18;
  }
  const clampedMenu = clampTowerMenuPosition(preferredLeft, preferredTop);
  towerMenu.style.left = `${clampedMenu.left}px`;
  towerMenu.style.top = `${clampedMenu.top}px`;
  syncMobileHudLayout();
}


function isCurrentWaveBoss(){
  return currentMode === "endless" ? (stageWave % 10 === 0) : (stageWave === STAGES[currentStage].bossWave);
}

function getBossCountForCurrentWave(){
  if(!isCurrentWaveBoss()) return 0;
  return currentMode === "endless" ? 2 : 1;
}

function getWaveEnemyTotal(){
  if(currentMode === "endless" && isCurrentWaveBoss()) return getBossCountForCurrentWave();
  return enemyCountForWave(stageWave) + getBossCountForCurrentWave();
}

function getEndlessCycle(){
  return Math.max(1, Math.floor(stageWave / 10));
}

function getDifficultyWaveNumber(){
  return currentMode === "endless" ? stageWave : wave;
}

function pickRandomEndlessBossPair(){
  const ids = Object.keys(STAGE_BOSS).map(Number);
  for(let i = ids.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0,2);
}

function showEndlessUnlockOverlay(){
  if(endlessUnlockText){
    endlessUnlockText.textContent = ENDLESS_UNLOCK_QUOTES[Math.floor(Math.random() * ENDLESS_UNLOCK_QUOTES.length)];
    endlessUnlockText.classList.remove("quote-fade-in");
    void endlessUnlockText.offsetWidth;
    endlessUnlockText.classList.add("quote-fade-in");
  }
  endlessUnlockOverlay?.classList.remove("hidden");
}

function hideEndlessUnlockOverlay(){
  endlessUnlockOverlay?.classList.add("hidden");
}

function enterEndlessModeFromUnlock(){
  hideEndlessUnlockOverlay();
  currentMode = "endless";
  currentStage = 6;
  path = STAGES[6].route;
  pathCells = buildPathCells(path);
  stageWave = 1;
  wave = 1;
  pendingEndlessBossPair = [];
  saveProgress();
  setMessage("Endless Mode begins. Your defenses hold the Dark Portal.");
  isPaused = false;
  updateUI();
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
  return { id:idCounter++, c,r, type:typeKey, cooldown:0, aimAngle:-0.3, level:1, totalSpent:base.cost, nextUpgradeCost:base.upgradeCost, wealthKills:0, wealthSurgeTimer:0, specialization:null, specSlowFactor:1, specSlowDuration:0, specChainTargets:0, specChainDamageFactor:0, specBonusVsFast:1, specStunChance:0, specStunDuration:0, ...structuredClone(base) };
}
function createFreshUnitForPlacement(typeKey,c,r){
  const unit=createPlacedUnit(c,r,typeKey);
  unit.id=idCounter++; unit.c=c; unit.r=r; unit.cooldown=0; unit.aimAngle=-0.3; unit.level=1; unit.totalSpent=UNIT_TYPES[typeKey].cost; unit.nextUpgradeCost=UNIT_TYPES[typeKey].upgradeCost; unit.specialization=null; unit.specSlowFactor=1; unit.specSlowDuration=0; unit.specChainTargets=0; unit.specChainDamageFactor=0; unit.specBonusVsFast=1; unit.specStunChance=0; unit.specStunDuration=0;
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
      pushNotification("stage","Progress loaded",`Best score: ${best} · Furthest stage: ${furthest}${endlessUnlocked ? " · Endless unlocked" : ""}`);
    }
  }catch(e){}
}

function unlockAchievement(key){
  if(achievements[key]) return;
  achievements[key]=true;
  const titles={first_kill:"First Blood",builder:"Builder",boss_hunter:"Boss Hunter",rich:"Treasurer",wave_master:"Wave Master",survivor:"Survivor"};
  showPopup(canvas.width/2,40,"Achievement unlocked!","#bbf7d0");
  pushNotification("achievement",`🏆 ${titles[key]||"Achievement"}`,"New achievement unlocked.");
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

function getRunSpentGold(){
  return units.reduce((sum, unit) => sum + (unit.totalSpent || 0), 0);
}

function openGameOverOverlay(){
  if(gameOverStageStat) gameOverStageStat.textContent = currentMode === "campaign" ? String(currentStage) : `Endless ${currentStage}`;
  if(gameOverWaveStat) gameOverWaveStat.textContent = String(currentMode === "campaign" ? wave : stageWave);
  if(gameOverKillsStat) gameOverKillsStat.textContent = String(kills);
  if(gameOverScoreStat) gameOverScoreStat.textContent = String(totalScore());
  const spent = getRunSpentGold();
  gameOverText.textContent = `You reached ${currentMode === "campaign" ? "Stage " + currentStage : "Endless Wave " + stageWave}. Kills: ${kills} · Gold spent: ${spent} · Score: ${totalScore()}.`;
  if(gameOverQuote) gameOverQuote.textContent = GAME_OVER_QUOTES[Math.floor(Math.random() * GAME_OVER_QUOTES.length)];
  gameOverOverlay.classList.remove("hidden");
}

function updateUI(){
  moneyBadge.textContent=`💰 ${money}`;
  livesBadge.textContent=`❤️ ${lives}`;
  waveBadge.textContent=currentMode==="campaign" ? `🌊 Wave ${wave}` : `♾️ Endless Wave ${stageWave}`;
  stageBadge.textContent=currentMode==="campaign" ? `🗺️ Stage ${currentStage} · ${STAGES[currentStage].name}` : `♾️ Endless · ${STAGES[currentStage].name}`;
  if(waveActive){
    const total=getWaveEnemyTotal();
    const progress=((total-spawnLeft)/total)*100;
    waveFill.style.width=`${Math.max(0,Math.min(100,progress))}%`;
    progressText.textContent=`${Math.round(progress)}%`;
    statusPill.textContent=isPaused?"Paused":"Battle";
  }else{
    waveFill.style.width="0%";
    progressText.textContent=isPaused?"Pause":"Ready";
    statusPill.textContent=lives<=0?"Game Over":(isPaused?"Paused":"Ready");
  }
  enemyCountStat.textContent=String(enemies.length);
  towerCountStat.textContent=String(units.length);
  killsStat.textContent=String(kills);
  bossInfoStat.textContent=currentMode==="campaign" ? String(STAGES[currentStage].bossWave) : "Every 10";
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
  waveActive=false; spawnLeft=0; spawnTimer=0; bossBannerTimer=0; bossFxTimer=0; bossFxType=""; waveIntroTimer=0; waveIntroText=""; waveIntroSubtext=""; bossDefeatIntroTimer=0; bossDefeatRewardDelayTimer=0; bossDefeatIntroText=""; bossDefeatIntroSubtext=""; stageQuoteTimer=0; stageQuoteText=""; stageQuoteSubtext=""; stageQuoteResolveTimer=0; auraBindFxTimer=0; auraBindFxUnitId=null; isPaused=false; stageWave=1;
  pendingAuraDraft = null; pendingAuraChoice = null; pendingBossResolution = null; pendingEndlessBossPair = []; hideAuraRewardOverlay(); hideEndlessUnlockOverlay();
  stopBossLoop();
  syncAmbientAudio();
  cancelSpellSelection();
  spellCooldown.slow = 0;
  spellCooldown.damage = 0;
  spellCooldown.bomb = 0;

  if(resetRun){
    reservePool={ archer:[], hunter:[], mage:[], bomb:[] };
    money=START_MONEY + (stageNumber-1)*60;
    lives=START_LIVES; score=0; bonusScore=0; kills=0; wave=1;
    Object.keys(achievements).forEach(k=>achievements[k]=false);
    resetAchievementsUI(); clearNotifications();
    currentMode="campaign";
  }else{
    pushNotification("stage","New stage",`You entered Stage ${currentStage} — ${STAGES[currentStage].name}. Boss: ${STAGE_BOSS[currentStage].name}. Your towers are in reserve.`);
  }

  stageStartLives=lives;
  resetCamera();
  setMessage(`Stage ${currentStage} — ${STAGES[currentStage].name} started. Re-place reserve towers for free.`);
  updateUI();
}
const resetGame=()=>{ showHintChip(); resetCamera(); applyStage(1,true); prewarmLeaderboardRun("campaign"); };

function startWave(){
  if(waveActive || lives<=0 || isPaused || pendingAuraChoice || pendingBossResolution) return;
  ensureAudio();
  const stage=STAGES[currentStage];
  if(currentMode === "endless" && isCurrentWaveBoss()) pendingEndlessBossPair = pickRandomEndlessBossPair();
  spawnLeft=getWaveEnemyTotal();
  spawnTimer=0; waveActive=true;
  if(isCurrentWaveBoss()) bossBannerTimer=2.2;
  playWaveSound();
  hideHintChip();
  hideTowerMenu();
  if(isCurrentWaveBoss()){
    waveIntroTimer = 0;
    waveIntroText = "";
    waveIntroSubtext = "";
  } else {
    waveIntroTimer = 1.8;
    waveIntroText = `Wave ${stageWave}`;
    waveIntroSubtext = `Stage ${currentStage} · ${stage.name}`;
  }
  setMessage(isCurrentWaveBoss() ? "" : `Wave ${stageWave} started.`);
  updateUI();
}
function togglePause(){
  if(!hasStarted || lives<=0 || pendingAuraChoice || pendingBossResolution) return;
  isPaused=!isPaused;
  if(isPaused) cancelSpellSelection();
  setMessage(isPaused?"Game paused. Spells are disabled while paused.":"Game resumed.");
  updateUI();
}

function enemyTemplateForSpawn(indexFromEnd){
  const stage=STAGES[currentStage];
  if(currentMode === "endless" && isCurrentWaveBoss() && indexFromEnd <= pendingEndlessBossPair.length){
    const bossStage = pendingEndlessBossPair[pendingEndlessBossPair.length - indexFromEnd];
    const cycle = getEndlessCycle();
    const scale = 1 + (cycle - 1) * 0.35;
    return {type:"boss", hpMult:4.0 * STAGES[bossStage].difficulty * scale, speed:.05 + bossStage * .003 + (cycle - 1) * .005, reward:140 + (cycle - 1) * 30, bossStage, bossColor: STAGE_BOSS[bossStage].color, bossName: STAGE_BOSS[bossStage].name};
  }
  const boss=isCurrentWaveBoss() && indexFromEnd===1;
  if(boss) return {type:"boss",hpMult:4.0*stage.difficulty,speed:.05+currentStage*.003,reward:110, bossStage: currentStage, bossColor: STAGE_BOSS[currentStage].color, bossName: STAGE_BOSS[currentStage].name};
  const roll=Math.random();
  if(roll < 0.18 + currentStage*0.01){
    const isLateStageFast = currentStage >= 5;
    return {
      type:"fast",
      hpMult:(isLateStageFast ? .52 : .75) * stage.difficulty,
      speed:isLateStageFast ? (.135 + getDifficultyWaveNumber()*.0035) : (.15 + getDifficultyWaveNumber()*.004),
      reward:isLateStageFast ? 18 : 16
    };
  }
  if(roll < 0.40 + currentStage*0.02) return {type:"tank",hpMult:2.0*stage.difficulty,speed:.07+currentStage*.002,reward:28};
  return {type:"normal",hpMult:1.0*stage.difficulty,speed:.09+getDifficultyWaveNumber()*.004+currentStage*.002,reward:20};
}
function spawnEnemy(){
  const t=enemyTemplateForSpawn(spawnLeft), hpBase=44+Math.max(wave, stageWave)*13+currentStage*9;
  const enemy = enforceTestModeEnemyHp({ id:idCounter++, hp:hpBase*t.hpMult, maxHp:hpBase*t.hpMult, speed:t.speed, progress:0, wobble:Math.random()*Math.PI*2, type:t.type, reward:t.reward, abilityUsed:false, bossStage: t.bossStage || null, bossColor: t.bossColor || null, bossName: t.type==="boss" ? (t.bossName || STAGE_BOSS[currentStage].name) : null });
  enemies.push(enemy);
  if(enemy.type==="boss") startBossLoop();
}

function placeUnit(c,r){
  if(lives<=0) return;
  const key=`${c}-${r}`;
  if(pathCells.has(key)){ setMessage("You cannot place towers on the path."); return; }

  const existing=units.find(t=>t.c===c && t.r===r);
  if(existing){ selectedPlacedUnitId=existing.id; setPlacementHudAutoHide(false); setMessage(`You selected ${existing.name}.`); updateUI(); return; }

  const type=UNIT_TYPES[selectedUnitType];
  let unit=null, usedReserve=false;

  if(reserveCount(selectedUnitType)>0){
    unit=takeReservedUnit(selectedUnitType,c,r);
    usedReserve=!!unit;
  }
  if(!unit){
    if(money < type.cost){ setMessage("You do not have enough gold for the selected tower."); return; }
    money -= type.cost;
    unit = createFreshUnitForPlacement(selectedUnitType,c,r);
  }

  units.push(unit);
  selectedPlacedUnitId=null;
  hideTowerMenu();
  setPlacementHudAutoHide(false);
  const fxPos = cellCenter(c, r);
  addPlacementEffect(fxPos.x, fxPos.y, type.color || "#7dd3fc");
  setMessage(usedReserve ? `${type.name} re-placed from reserve.` : `${type.name} purchased and placed.`);
  updateUI();
}

function applySpecializationToSelectedUnit(specId){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit || !canChooseSpecialization(unit)) return;
  const choice = TOWER_SPECIALIZATIONS[unit.type]?.[specId];
  if(!choice) return;
  const cost = getSpecializationCost(unit);
  if(money < cost){ setMessage("You do not have enough gold for the specialization."); return; }
  money -= cost; unit.totalSpent += cost; unit.level += 1; unit.specialization = specId;
  choice.apply(unit);
  unit.nextUpgradeCost = Math.round(cost * 1.90);
  const fxPos = cellCenter(unit.c, unit.r);
  addUpgradeEffect(fxPos.x, fxPos.y, unit.color || "#7dd3fc");
  playUpgradeSound();
  setMessage(`${unit.name} specialized into ${choice.name}.`);
  updateUI();
}

function upgradeSelectedUnit(){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit) return;
  if(canChooseSpecialization(unit)){
    if(towerSpecializationPanel?.classList.contains("hidden")) showTowerMenu(unit);
    setMessage(`Choose a specialization for ${unit.name}.`);
    return;
  }
  if(money<unit.nextUpgradeCost){ setMessage("You do not have enough gold for the upgrade."); return; }
  money-=unit.nextUpgradeCost; unit.totalSpent+=unit.nextUpgradeCost; unit.level+=1;
  unit.damage*=unit.type==="bomb"?1.70:1.55; unit.range*=1.10; unit.fireRate*=.92;
  if(unit.projectileSpeed) unit.projectileSpeed*=1.06;
  if(unit.splash) unit.splash*=1.10;
  unit.nextUpgradeCost=Math.round(unit.nextUpgradeCost*1.90);
  const fxPos = cellCenter(unit.c, unit.r);
  addUpgradeEffect(fxPos.x, fxPos.y, unit.color || "#7dd3fc");
  playUpgradeSound();
  setMessage(`${unit.name} was upgraded to Lv.${unit.level}.`);
  updateUI();
}
function sellSelectedUnit(){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit) return;
  const refund=Math.round(unit.totalSpent*unit.sellFactor);
  money += refund;
  units=units.filter(u=>u.id!==unit.id);
  selectedPlacedUnitId=null;
  setMessage(`${unit.name} sold for ${refund} gold.`);
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
  const scoreBonus=isCurrentWaveBoss()?40:0;
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
        pushNotification("achievement", "Golden Pact surge", `${owner.name} entered Pact Surge for 5 seconds.`);
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
  const bossStage = enemy?.bossStage || currentStage;
  const ability=STAGES[bossStage].bossAbility;
  if(ability==="summon"){
    for(let i=0;i<2;i++) enemies.push(enforceTestModeEnemyHp({ id:idCounter++, hp:40*STAGES[bossStage].difficulty, maxHp:40*STAGES[bossStage].difficulty, speed:.13, progress:Math.max(0,enemy.progress-.03*(i+1)), wobble:Math.random()*Math.PI*2, type:"fast", reward:8, abilityUsed:true }));
    bossFxType = "summon";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} summoned minions!`,"#fca5a5");
  }
  if(ability==="rage"){
    enemy.speed*=1.6; enemy.hp += enemy.maxHp*.15;
    enforceTestModeEnemyHp(enemy);
    bossFxType = "rage";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} entered rage mode!`,"#fca5a5");
  }
  if(ability==="shield"){
    enemy.hp += enemy.maxHp*.25;
    enforceTestModeEnemyHp(enemy);
    bossFxType = "shield";
    bossFxTimer = 1.0;
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} gained a shield!`,"#93c5fd");
  }
  enemy.abilityUsed=true;
}

function update(dt){
  bossBannerTimer=Math.max(0,bossBannerTimer-dt);
  bossFxTimer=Math.max(0,bossFxTimer-dt);
  waveIntroTimer=Math.max(0,waveIntroTimer-dt);
  bossDefeatIntroTimer=Math.max(0,bossDefeatIntroTimer-dt);
  stageQuoteTimer = Math.max(0, stageQuoteTimer - dt);
  auraBindFxTimer = Math.max(0, auraBindFxTimer - dt);
  if(stageQuoteResolveTimer > 0){
    stageQuoteResolveTimer = Math.max(0, stageQuoteResolveTimer - dt);
    if(stageQuoteResolveTimer === 0){
      resolveBossWaveCompletion();
    }
  }
  if(bossDefeatRewardDelayTimer>0){
    bossDefeatRewardDelayTimer=Math.max(0,bossDefeatRewardDelayTimer-dt);
    if(bossDefeatRewardDelayTimer===0 && pendingBossResolution && !pendingAuraChoice){
      beginBossAuraReward();
    }
  }
  if(lives<=0 || isPaused) return;
  spellCooldown.slow = Math.max(0, spellCooldown.slow - dt);
  spellCooldown.damage = Math.max(0, spellCooldown.damage - dt);
  spellCooldown.bomb = Math.max(0, spellCooldown.bomb - dt);

  if(waveActive && spawnLeft>0){
    spawnTimer += dt;
    if(spawnTimer>=.68){ spawnTimer=0; spawnEnemy(); spawnLeft--; updateUI(); }
  }

  for(let i=enemies.length-1;i>=0;i--){
    const enemy=enemies[i];
    enforceTestModeEnemyHp(enemy);
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
    if(enemy.stunTimer){
      enemy.stunTimer = Math.max(0, enemy.stunTimer - dt);
    }
    if(enemy.specSlowTimer){
      enemy.specSlowTimer = Math.max(0, enemy.specSlowTimer - dt);
      if(enemy.specSlowTimer <= 0) enemy.specSlowFactor = 1;
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
    const specSlowFactor = enemy.specSlowTimer > 0 ? (enemy.specSlowFactor || 1) : 1;
    const freezeFactor = enemy.freezeTimer > 0 ? 0 : 1;
    const stunFactor = enemy.stunTimer > 0 ? 0 : 1;
    enemy.progress += enemy.speed * spellSlowFactor * auraSlowFactor * specSlowFactor * freezeFactor * stunFactor * dt;
    if(enemy.type==="boss" && !enemy.abilityUsed && enemy.hp<enemy.maxHp*.55) triggerBossAbility(enemy);
    if(enemy.progress>=1){
      enemies.splice(i,1);
      if(enemy.type==="boss") stopBossLoop();
      lives=Math.max(0,lives-(enemy.type==="boss"?3:1));
      if(lives<=0){
        waveActive=false;
        openGameOverOverlay();
        saveProgress();
        if(currentMode==="endless") submitBonusLeaderboardScore();
        if(currentMode==="campaign") submitStoryLeaderboardScore(currentStage);
        setMessage("Game over. The skeletons broke through the gate.");
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
        projectiles.push({ id:idCounter++, x:unitPos.x, y:unitPos.y, px:unitPos.x, py:unitPos.y, angle:unit.aimAngle, targetId:bestTarget.enemy.id, damage:stats.damage * (unit.specialization === "tracker" && bestTarget.enemy.type === "fast" ? (unit.specBonusVsFast || 1.35) : 1), speed:stats.projectileSpeed, color:getProjectileColorByAura(unit, unit.type==="hunter"?"#fcd34d":unit.type==="mage"?"#ddd6fe":unit.type==="bomb"?"#fb7185":"#e2e8f0"), projectileType:unit.type, splash:stats.splash||0, ownerUnitId:unit.id, ownerAuraType:unit.auraType || null });
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
            applySpecializationStatusOnEnemy(enemy, owner, pos, projectile.damage);
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
            applySpecializationStatusOnEnemy(enemy, owner, pos, projectile.damage);
          }
        }
      }
      else {
        target.hp-=projectile.damage;
        if(owner) markEnemyHit(target, owner, projectile.damage);
        applyAuraStatusOnEnemy(target, owner, targetPos, projectile.damage);
        applySpecializationStatusOnEnemy(target, owner, targetPos, projectile.damage);
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

    if(isCurrentWaveBoss()){
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
        queueBossAuraReward();
        return;
      }
      return;
    }

    stageWave += 1;
    if(currentMode === "campaign") wave += 1;
    money += 35 + Math.min(currentStage,6) * 10;
    bonusScore += 20;
    setMessage(currentMode === "campaign" ? `Wave complete. Next wave in this stage: ${stageWave}.` : `Endless wave complete. Next wave: ${stageWave}.`);
    updateUI();
  }
}


function getStagePalette(stage=currentStage){
  return {
    1:{ bgTop:"#0d1410", bgMid:"#0a100c", bgBot:"#050806", grid:"rgba(94,126,88,.040)",
        tile:"rgba(14,22,16,.34)", pathTile:"rgba(68,54,38,.16)",
        pathBase:"rgba(46,34,24,.94)", pathMid:"rgba(118,91,62,.72)", pathHi:"rgba(214,180,124,.10)",
        glow:"rgba(255,170,88,.10)", ambient:"rgba(38,120,70,.055)", lantern:"#f59e0b", fog:true, embers:true },
    2:{ bgTop:"#11141a", bgMid:"#0c0f14", bgBot:"#07090d", grid:"rgba(128,136,148,.050)",
        tile:"rgba(18,20,24,.34)", pathTile:"rgba(74,74,78,.18)",
        pathBase:"rgba(66,68,74,.92)", pathMid:"rgba(132,138,146,.46)", pathHi:"rgba(226,232,240,.06)",
        glow:"rgba(220,226,235,.055)", ambient:"rgba(168,176,190,.035)", lantern:"#ffd08a", fog:true, embers:false },
    3:{ bgTop:"#16101a", bgMid:"#0f0a12", bgBot:"#08050b", grid:"rgba(128,92,138,.045)",
        tile:"rgba(20,13,22,.34)", pathTile:"rgba(74,56,68,.18)",
        pathBase:"rgba(68,50,62,.94)", pathMid:"rgba(130,92,116,.46)", pathHi:"rgba(220,190,255,.07)",
        glow:"rgba(194,132,252,.065)", ambient:"rgba(168,85,247,.040)", lantern:"#d8b4fe", fog:true, embers:false },
    4:{ bgTop:"#13171c", bgMid:"#0c1015", bgBot:"#07090d", grid:"rgba(124,136,154,.045)",
        tile:"rgba(18,21,27,.34)", pathTile:"rgba(72,82,95,.18)",
        pathBase:"rgba(72,82,95,.94)", pathMid:"rgba(132,148,166,.44)", pathHi:"rgba(236,242,248,.07)",
        glow:"rgba(160,175,195,.055)", ambient:"rgba(88,120,170,.035)", lantern:"#ffe2a3", fog:true, embers:false },
    5:{ bgTop:"#140f12", bgMid:"#0d080b", bgBot:"#070506", grid:"rgba(118,86,90,.045)",
        tile:"rgba(21,14,16,.34)", pathTile:"rgba(82,58,54,.18)",
        pathBase:"rgba(72,52,48,.95)", pathMid:"rgba(126,90,82,.44)", pathHi:"rgba(251,191,36,.06)",
        glow:"rgba(251,191,36,.065)", ambient:"rgba(174,96,68,.035)", lantern:"#ffb347", fog:true, embers:true },
    6:{ bgTop:"#100d17", bgMid:"#090710", bgBot:"#05040a", grid:"rgba(118,88,160,.050)",
        tile:"rgba(16,12,26,.36)", pathTile:"rgba(72,48,104,.20)",
        pathBase:"rgba(78,52,118,.95)", pathMid:"rgba(130,90,180,.50)", pathHi:"rgba(214,188,255,.09)",
        glow:"rgba(168,85,247,.10)", ambient:"rgba(139,92,246,.050)", lantern:"#c084fc", fog:true, embers:true }
  }[stage];
}

function getStageScatterSeed(stage=currentStage){
  const seeds = {
    1:[[108,88],[256,72],[508,362],[628,298],[212,424],[834,124],[886,456]],
    2:[[86,86],[228,132],[546,96],[592,318],[456,394],[814,142],[894,438]],
    3:[[104,100],[162,152],[520,112],[604,332],[422,382],[262,94],[866,406]],
    4:[[90,60],[188,238],[580,72],[792,288],[922,188],[840,442]],
    5:[[92,92],[182,116],[402,318],[522,208],[610,372],[244,382],[846,156]],
    6:[[74,90],[184,144],[492,340],[856,214],[952,430],[620,112],[290,468]]
  };
  return seeds[stage] || [];
}

function getVegetationForStage(stage=currentStage){
  return STAGE_VEGETATION[stage] || [];
}

function drawAnimatedVegetation(){
  const plants = getVegetationForStage();
  if(!plants.length) return;
  const t = performance.now() * 0.001;
  const paletteByKind = {
    bush: {base:'rgba(22,56,30,.82)', hi:'rgba(78,126,76,.14)', trunk:'rgba(48,32,20,.78)'},
    fern: {base:'rgba(18,48,26,.76)', hi:'rgba(92,138,82,.12)', trunk:'rgba(48,32,20,.72)'},
    deadbush: {base:'rgba(74,78,72,.42)', hi:'rgba(190,196,188,.06)', trunk:'rgba(68,58,46,.58)'},
    grass: {base:'rgba(92,104,88,.30)', hi:'rgba(210,216,208,.04)', trunk:'rgba(78,64,52,.18)'},
    thorn: {base:'rgba(58,32,66,.52)', hi:'rgba(168,114,182,.08)', trunk:'rgba(48,26,52,.42)'},
    ivy: {base:'rgba(42,58,70,.40)', hi:'rgba(164,184,202,.06)', trunk:'rgba(60,68,74,.32)'},
    moss: {base:'rgba(74,60,46,.42)', hi:'rgba(178,144,112,.06)', trunk:'rgba(76,56,38,.28)'},
    voidbloom: {base:'rgba(72,44,104,.48)', hi:'rgba(188,140,252,.10)', trunk:'rgba(58,36,88,.28)'}
  };

  for(const plant of plants){
    const pal = paletteByKind[plant.kind] || paletteByKind.bush;
    const sway = Math.sin(t * 0.85 + plant.phase) * 1.8;
    const breathe = 1 + Math.sin(t * 0.55 + plant.phase * 1.7) * 0.028;
    const rise = Math.sin(t * 0.42 + plant.phase * 2.1) * 0.9;
    ctx.save();
    ctx.translate(plant.x + sway, plant.y + rise);
    ctx.scale(breathe, 0.985 + (breathe - 1) * 0.6);

    const halo = ctx.createRadialGradient(0, -2, 2, 0, -2, plant.size * 1.2);
    halo.addColorStop(0, pal.hi);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, plant.size * 1.15, 0, Math.PI * 2); ctx.fill();

    if(plant.kind === 'fern' || plant.kind === 'grass' || plant.kind === 'ivy' || plant.kind === 'voidbloom'){
      ctx.strokeStyle = pal.base;
      ctx.lineWidth = 2;
      for(let i=0;i<5;i++){
        const spread = (i - 2) * (plant.size * 0.18);
        ctx.beginPath();
        ctx.moveTo(spread * 0.2, plant.size * 0.35);
        ctx.quadraticCurveTo(spread, -plant.size * 0.35, spread * 0.65 + sway * 0.1, -plant.size * 0.72);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = pal.trunk;
      roundRect(-2, plant.size * 0.05, 4, plant.size * 0.42, 2); ctx.fill();
      ctx.fillStyle = pal.base;
      ctx.beginPath(); ctx.arc(0, -2, plant.size * 0.62, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-plant.size * 0.34, plant.size * 0.02, plant.size * 0.38, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(plant.size * 0.36, plant.size * 0.04, plant.size * 0.34, 0, Math.PI * 2); ctx.fill();
      if(plant.kind === 'thorn'){
        ctx.strokeStyle = 'rgba(188,140,224,.14)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-plant.size * 0.46, -2); ctx.lineTo(0, -plant.size * 0.62); ctx.lineTo(plant.size * 0.46, 0); ctx.stroke();
      }
    }

    ctx.restore();
  }
}

function getPathCanvasPoints(){
  return path.map(p => cellCenter(p.c, p.r));
}

function getStageLanterns(){
  const lanterns = [];
  const pts = path.map(p => ({ ...p, pos: cellCenter(p.c, p.r) }));
  if(!pts.length) return lanterns;

  const pushLantern = (x, y, size=1) => lanterns.push({ x, y, size });

  const start = pts[0].pos;
  const end = pts[pts.length - 1].pos;
  pushLantern(start.x + 20, start.y - 22, 1.05);
  pushLantern(end.x - 18, end.y - 20, 1.05);

  for(let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];
    const dirIn = { x: Math.sign(cur.c - prev.c), y: Math.sign(cur.r - prev.r) };
    const dirOut = { x: Math.sign(next.c - cur.c), y: Math.sign(next.r - cur.r) };
    const isTurn = dirIn.x !== dirOut.x || dirIn.y !== dirOut.y;
    if(!isTurn) continue;
    const outer = { x: -(dirIn.x + dirOut.x), y: -(dirIn.y + dirOut.y) };
    const len = Math.hypot(outer.x, outer.y) || 1;
    const ox = (outer.x / len) * 24;
    const oy = (outer.y / len) * 24;
    pushLantern(cur.pos.x + ox, cur.pos.y + oy, 1.0);
  }

  return lanterns;
}

function drawLantern(x, y, scale=1){
  const time = performance.now() * 0.0035 + x * 0.01;
  const flicker = Math.sin(time * 2.3) * 0.08 + Math.cos(time * 1.7) * 0.06;
  const glowR = 22 * scale * (1 + flicker);

  const glow = ctx.createRadialGradient(x, y - 4 * scale, 2, x, y - 4 * scale, glowR);
  glow.addColorStop(0, 'rgba(255,210,120,.30)');
  glow.addColorStop(.45, 'rgba(255,160,60,.18)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y - 4 * scale, glowR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(46,26,18,.88)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 12 * scale);
  ctx.lineTo(x, y + 2 * scale);
  ctx.stroke();

  ctx.fillStyle = 'rgba(34,20,12,.95)';
  roundRect(x - 4 * scale, y - 11 * scale, 8 * scale, 12 * scale, 2);
  ctx.fill();

  const flameY = y - 5 * scale + Math.sin(time * 5.4) * 1.2;
  const flame = ctx.createRadialGradient(x, flameY, 1, x, flameY, 7 * scale);
  flame.addColorStop(0, 'rgba(255,244,200,.95)');
  flame.addColorStop(.5, 'rgba(255,175,64,.88)');
  flame.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.arc(x, flameY, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawStageFog(){
  const t = performance.now() * 0.00018;
  for(let i = 0; i < 4; i++) {
    const x = 180 + i * 220 + Math.sin(t * (1.2 + i * 0.18) + i) * 38;
    const y = 120 + (i % 2) * 220 + Math.cos(t * (1.05 + i * 0.12) + i * 0.7) * 26;
    const rx = 150 + i * 16;
    const ry = 72 + (i % 3) * 12;
    const fog = ctx.createRadialGradient(x, y, 8, x, y, rx);
    fog.addColorStop(0, 'rgba(220,225,230,.040)');
    fog.addColorStop(.55, 'rgba(180,190,200,.022)');
    fog.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.fillStyle = fog;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawAmbientEmbers(){
  const t = performance.now() * 0.001;
  for(const ember of stageFxState.emberSeed){
    const x = ember.baseX + Math.sin(t * 0.9 + ember.phase) * 16;
    const y = ((ROWS * CELL + 40) - ((t * 34 * ember.speed + ember.phase * 60) % (ROWS * CELL + 80)));
    const alpha = 0.08 + 0.08 * Math.sin(t * 2 + ember.phase);
    ctx.fillStyle = `rgba(255,140,60,${Math.max(0, alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, ember.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPathAtmosphere(){
  const points = getPathCanvasPoints();
  if(points.length < 2) return;
  const pulse = 0.09 + Math.sin(performance.now() * 0.0022) * 0.018;
  const pal = getStagePalette();

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((pos, i) => { if(i === 0) ctx.moveTo(pos.x, pos.y); else ctx.lineTo(pos.x, pos.y); });
  ctx.strokeStyle = pal.glow.replace('0.10', pulse.toFixed(3)).replace('0.065', pulse.toFixed(3)).replace('0.055', pulse.toFixed(3));
  ctx.lineWidth = 24;
  ctx.stroke();

  ctx.strokeStyle = currentStage===1 ? 'rgba(250,214,160,.03)' : currentStage===6 ? 'rgba(224,196,255,.035)' : 'rgba(255,232,204,.020)';
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.restore();
}

function drawStageLighting(){
  const lanterns = getStageLanterns();
  lanterns.forEach(l => drawLantern(l.x, l.y, l.size));
}

function drawBackground(){
  const stage=STAGES[currentStage], pal=getStagePalette();
  const bg=ctx.createLinearGradient(0,0,0,canvas.height);
  bg.addColorStop(0,pal.bgTop);
  bg.addColorStop(.56,pal.bgMid);
  bg.addColorStop(1,pal.bgBot);
  ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let c=0;c<=COLS;c++){ ctx.beginPath(); ctx.moveTo(c*CELL,0); ctx.lineTo(c*CELL,ROWS*CELL); ctx.strokeStyle=pal.grid; ctx.stroke(); }
  for(let r=0;r<=ROWS;r++){ ctx.beginPath(); ctx.moveTo(0,r*CELL); ctx.lineTo(COLS*CELL,r*CELL); ctx.strokeStyle=pal.grid; ctx.stroke(); }

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const key=`${c}-${r}`, isPath=pathCells.has(key);
      ctx.fillStyle=isPath?pal.pathTile:pal.tile;
      roundRect(c*CELL+2,r*CELL+2,CELL-4,CELL-4,12); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,.035)"; ctx.stroke();
    }
  }

  for(let i=0;i<3;i++){
    const gx = 90 + i * 220;
    const gy = 70 + (i % 2) * 220;
    const grd = ctx.createRadialGradient(gx, gy, 8, gx, gy, 150);
    grd.addColorStop(0, pal.ambient);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(gx, gy, 150, 0, Math.PI * 2);
    ctx.fill();
  }

  for(const patch of (stage.grassPatches||[])){
    ctx.fillStyle=currentStage===1?"rgba(28,108,58,.08)":currentStage===2?"rgba(88,96,104,.06)":currentStage===3?"rgba(92,54,98,.08)":currentStage===4?"rgba(48,70,90,.07)":currentStage===5?"rgba(90,44,34,.07)":"rgba(82,54,122,.08)";
    roundRect(patch.x,patch.y,patch.w,patch.h,16); ctx.fill();
  }
  drawAnimatedVegetation();
  if(stage.trees) drawTrees(stage.trees);
  if(stage.ruins) drawRuins(stage.ruins);
  if(pal.fog) drawStageFog();
  drawStageAggressiveDecor();
  if(pal.embers) drawAmbientEmbers();
}

function drawTrees(trees){
  for(const tree of trees){
    ctx.fillStyle="rgba(40,24,18,.95)";
    roundRect(tree.x-5,tree.y,10,22,4);
    ctx.fill();

    const shadow = ctx.createRadialGradient(tree.x, tree.y - 12, 4, tree.x, tree.y - 12, 28);
    shadow.addColorStop(0, currentStage===1 ? 'rgba(28,82,44,.70)' : currentStage===3 ? 'rgba(70,40,72,.66)' : 'rgba(40,48,58,.64)');
    shadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadow;
    ctx.beginPath(); ctx.arc(tree.x, tree.y - 10, 28, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle=currentStage===1?"rgba(18,54,28,.96)":"rgba(26,30,38,.94)";
    ctx.beginPath(); ctx.arc(tree.x,tree.y-10,18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(tree.x-10,tree.y-15,12,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(tree.x+11,tree.y-13,11,0,Math.PI*2); ctx.fill();

    ctx.fillStyle=currentStage===1?"rgba(98,140,88,.10)":"rgba(255,220,180,.04)";
    ctx.beginPath(); ctx.arc(tree.x+5,tree.y-18,4,0,Math.PI*2); ctx.fill();
  }
}

function drawRuins(ruins){
  for(const ruin of ruins){
    ctx.fillStyle="rgba(156,163,175,.12)";
    roundRect(ruin.x-18,ruin.y-10,36,20,6);
    ctx.fill();

    ctx.fillStyle="rgba(200,206,214,.08)";
    roundRect(ruin.x-13,ruin.y-32,8,22,4);
    ctx.fill();
    roundRect(ruin.x+3,ruin.y-26,8,16,4);
    ctx.fill();

    ctx.fillStyle="rgba(255,255,255,.035)";
    roundRect(ruin.x-11,ruin.y-7,22,5,3);
    ctx.fill();

    if(currentStage >= 4){
      const torch = ctx.createRadialGradient(ruin.x + 12, ruin.y - 18, 2, ruin.x + 12, ruin.y - 18, 18);
      torch.addColorStop(0, 'rgba(255,180,90,.18)');
      torch.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = torch;
      ctx.beginPath(); ctx.arc(ruin.x + 12, ruin.y - 18, 18, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function drawStageAggressiveDecor(){
  const pal = getStagePalette();
  for(const [x,y] of getStageScatterSeed()){
    if(currentStage===3){
      ctx.fillStyle="rgba(210,214,225,.16)";
      roundRect(x-5,y-10,10,16,4); ctx.fill();
      ctx.fillRect(x-1,y-14,2,8); ctx.fillRect(x-4,y-11,8,2);
    } else if(currentStage===4){
      ctx.fillStyle="rgba(82,92,108,.22)";
      roundRect(x-7,y-5,14,10,3); ctx.fill();
    } else if(currentStage===5){
      ctx.fillStyle="rgba(110,82,66,.18)";
      ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2); ctx.fill();
    } else if(currentStage===6){
      ctx.strokeStyle="rgba(152,98,222,.20)";
      ctx.lineWidth=5;
      ctx.beginPath(); ctx.moveTo(x-10,y+4); ctx.lineTo(x,y-8); ctx.lineTo(x+11,y+2); ctx.stroke();
      ctx.strokeStyle="rgba(196,132,252,.34)";
      ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-10,y+4); ctx.lineTo(x,y-8); ctx.lineTo(x+11,y+2); ctx.stroke();
    } else {
      ctx.fillStyle=currentStage===1?"rgba(132,144,118,.12)":"rgba(156,163,175,.12)";
      roundRect(x-7,y-5,14,9,3); ctx.fill();
    }
  }

  if(currentStage===1){
    for(let i=0;i<18;i++){
      const x=20+i*42+(i%2)*5;
      const y=34+(i%6)*74;
      ctx.fillStyle="rgba(74,222,128,.08)";
      ctx.beginPath(); ctx.arc(x,y,2.1,0,Math.PI*2); ctx.fill();
    }
  }

  if(currentStage===4){
    const banners=[[90,60],[580,70]];
    for(const [x,y] of banners){
      ctx.fillStyle="rgba(71,85,105,.42)"; roundRect(x-4,y-24,8,48,3); ctx.fill();
      ctx.fillStyle="rgba(145,157,178,.18)";
      ctx.beginPath(); ctx.moveTo(x+4,y-20); ctx.lineTo(x+22,y-14); ctx.lineTo(x+4,y-6); ctx.closePath(); ctx.fill();
    }
  }
}

function drawPath(){
  const pal = getStagePalette();
  ctx.save();
  ctx.lineCap="round";
  ctx.lineJoin="round";

  ctx.beginPath();
  path.forEach((p,i)=>{
    const pos=cellCenter(p.c,p.r);
    if(i===0) ctx.moveTo(pos.x,pos.y);
    else ctx.lineTo(pos.x,pos.y);
  });

  ctx.strokeStyle="rgba(0,0,0,.34)";
  ctx.lineWidth=18;
  ctx.stroke();
  ctx.strokeStyle=pal.pathBase;
  ctx.lineWidth=14;
  ctx.stroke();
  ctx.strokeStyle=pal.pathMid;
  ctx.lineWidth=8;
  ctx.stroke();
  ctx.strokeStyle=pal.pathHi;
  ctx.lineWidth=2.5;
  ctx.stroke();

  for(let i=0;i<18;i++){
    const pt = getPathPosition((i+0.35)/18);
    ctx.fillStyle=currentStage===1 ? "rgba(22,16,10,.25)"
      : currentStage===2 ? "rgba(210,216,224,.07)"
      : currentStage===3 ? "rgba(220,188,244,.06)"
      : currentStage===4 ? "rgba(224,230,236,.06)"
      : currentStage===5 ? "rgba(255,186,116,.06)"
      : "rgba(224,196,255,.10)";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}
function drawSpawnPortal(){
  const start = path[0], pos = cellCenter(start.c, start.r);
  const t = performance.now() * 0.004;
  const pulse = 1 + Math.sin(t * 1.4) * 0.06;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(pulse, pulse);

  if(currentStage === 1){
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
    grad.addColorStop(0, 'rgba(255,214,150,.32)');
    grad.addColorStop(.45, 'rgba(245,158,11,.20)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(250,204,140,.78)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = 'rgba(68,42,22,.95)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16,-10); ctx.lineTo(-7,-18); ctx.lineTo(-2,-6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,-10); ctx.lineTo(7,-18); ctx.lineTo(2,-6); ctx.stroke();
  } else if(currentStage === 2){
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
    grad.addColorStop(0, 'rgba(226,232,240,.18)');
    grad.addColorStop(.55, 'rgba(148,163,184,.10)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(70,74,82,.96)'; roundRect(-16,-18,8,36,4); ctx.fill(); roundRect(8,-18,8,36,4); ctx.fill();
    ctx.fillStyle = 'rgba(108,114,124,.86)'; roundRect(-18,-20,36,6,3); ctx.fill();
    ctx.strokeStyle = 'rgba(220,226,235,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.stroke();
  } else if(currentStage === 3){
    const grad = ctx.createRadialGradient(0, 0, 3, 0, 0, 24);
    grad.addColorStop(0, 'rgba(216,180,255,.22)');
    grad.addColorStop(.5, 'rgba(168,85,247,.14)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(196,204,214,.22)'; roundRect(-4,-18,8,30,4); ctx.fill();
    ctx.fillRect(-1,-24,2,12); ctx.fillRect(-8,-17,16,2);
    ctx.strokeStyle = 'rgba(220,190,255,.70)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 3, 11, 0, Math.PI*2); ctx.stroke();
  } else if(currentStage === 4){
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
    grad.addColorStop(0, 'rgba(255,226,163,.18)');
    grad.addColorStop(.5, 'rgba(148,163,184,.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(80,92,108,.95)'; roundRect(-18,-20,36,8,4); ctx.fill();
    ctx.fillStyle = 'rgba(110,124,142,.90)'; roundRect(-16,-20,8,30,4); ctx.fill(); roundRect(8,-20,8,30,4); ctx.fill();
    ctx.fillStyle = 'rgba(40,48,60,.95)'; roundRect(-9,-8,18,18,4); ctx.fill();
    ctx.fillStyle = 'rgba(255,226,163,.80)'; ctx.beginPath(); ctx.arc(0, 1, 3, 0, Math.PI*2); ctx.fill();
  } else if(currentStage === 5){
    const grad = ctx.createRadialGradient(0, 0, 3, 0, 0, 26);
    grad.addColorStop(0, 'rgba(255,196,120,.28)');
    grad.addColorStop(.5, 'rgba(251,146,60,.16)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(140,92,66,.95)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, 15, Math.PI*0.1, Math.PI*0.9); ctx.stroke();
    ctx.fillStyle = 'rgba(116,80,58,.86)';
    for(let i=-12;i<=12;i+=8){ ctx.beginPath(); ctx.arc(i, -11 + Math.abs(i)*0.15, 3, 0, Math.PI*2); ctx.fill(); }
  } else if(currentStage === 6){
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
    grad.addColorStop(0, 'rgba(196,132,252,.34)');
    grad.addColorStop(.45, 'rgba(139,92,246,.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(196,132,252,.88)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = 'rgba(168,85,247,.56)'; ctx.lineWidth = 2;
    for(let a=0; a<6; a++){
      const ang = t + a * Math.PI/3;
      ctx.beginPath(); ctx.moveTo(Math.cos(ang)*7, Math.sin(ang)*7); ctx.lineTo(Math.cos(ang)*18, Math.sin(ang)*18); ctx.stroke();
    }
  }

  ctx.restore();
}
function drawGate(){
  const end = path[path.length - 1], pos = cellCenter(end.c, end.r);
  const t = performance.now() * 0.004;

  ctx.save();
  ctx.translate(pos.x + 18, pos.y);

  if(currentStage === 1){
    ctx.fillStyle = 'rgba(42,36,28,.96)'; roundRect(-20,-24,30,48,7); ctx.fill();
    ctx.fillStyle = 'rgba(94,84,68,.95)'; roundRect(-15,-20,20,40,5); ctx.fill();
    ctx.fillStyle = 'rgba(54,42,28,.92)'; for(let i=-12;i<=0;i+=6) ctx.fillRect(i,-18,2,36);
    const glow = ctx.createRadialGradient(-4, 0, 2, -4, 0, 15); glow.addColorStop(0,'rgba(255,214,150,.34)'); glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(-4,0,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(-4,0,2.5,0,Math.PI*2); ctx.fill();
  } else if(currentStage === 2){
    ctx.fillStyle = 'rgba(56,62,72,.96)'; roundRect(-20,-24,32,48,6); ctx.fill();
    ctx.fillStyle = 'rgba(124,132,144,.82)'; roundRect(-15,-20,22,40,4); ctx.fill();
    ctx.fillStyle = 'rgba(74,80,92,.94)'; for(let i=-12;i<=2;i+=6) ctx.fillRect(i,-18,2,36);
    ctx.strokeStyle = 'rgba(220,226,235,.40)'; ctx.lineWidth = 1.5; ctx.strokeRect(-15,-20,22,40);
  } else if(currentStage === 3){
    ctx.fillStyle = 'rgba(68,54,74,.94)'; roundRect(-18,-22,28,44,6); ctx.fill();
    ctx.fillStyle = 'rgba(212,220,228,.14)'; roundRect(-4,-18,8,30,4); ctx.fill();
    ctx.fillRect(-1,-24,2,10); ctx.fillRect(-8,-16,16,2);
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16); glow.addColorStop(0,'rgba(220,190,255,.24)'); glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0,2,16,0,Math.PI*2); ctx.fill();
  } else if(currentStage === 4){
    ctx.fillStyle = 'rgba(58,70,86,.96)'; roundRect(-21,-24,34,48,6); ctx.fill();
    ctx.fillStyle = 'rgba(138,150,166,.88)'; roundRect(-15,-20,22,40,5); ctx.fill();
    ctx.fillStyle = 'rgba(44,52,64,.94)'; for(let i=-12;i<=2;i+=6) ctx.fillRect(i,-18,2,36);
    ctx.fillStyle = 'rgba(255,226,163,.85)'; ctx.beginPath(); ctx.arc(-3,0,2.5,0,Math.PI*2); ctx.fill();
  } else if(currentStage === 5){
    ctx.fillStyle = 'rgba(66,44,42,.96)'; roundRect(-21,-24,34,48,8); ctx.fill();
    ctx.fillStyle = 'rgba(118,82,74,.92)'; roundRect(-15,-18,22,36,6); ctx.fill();
    ctx.fillStyle = 'rgba(84,56,48,.94)'; for(let i=-12;i<=2;i+=6) ctx.fillRect(i,-16,2,32);
    const glow = ctx.createRadialGradient(-2, 0, 2, -2, 0, 15); glow.addColorStop(0,'rgba(255,186,116,.26)'); glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(-2,0,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,186,116,.86)'; ctx.beginPath(); ctx.arc(-2,0,2.5,0,Math.PI*2); ctx.fill();
  } else if(currentStage === 6){
    ctx.translate(-6, 0);
    const portal = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
    portal.addColorStop(0, 'rgba(224,196,255,.40)');
    portal.addColorStop(.45, 'rgba(168,85,247,.24)');
    portal.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = portal; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(196,132,252,.90)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0,0,12.5,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle = 'rgba(139,92,246,.48)'; ctx.lineWidth = 2;
    for(let a=0; a<5; a++){
      const ang = -t * 0.8 + a * Math.PI*2/5;
      ctx.beginPath(); ctx.moveTo(Math.cos(ang)*15, Math.sin(ang)*15); ctx.lineTo(Math.cos(ang)*22, Math.sin(ang)*22); ctx.stroke();
    }
  }

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
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = aura.color;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 12, pulse, Math.max(9, pulse * 0.42), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = aura.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 12, 19, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
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


  const sprite = towerSprites[unit.type];
  if(sprite?.complete && sprite.naturalWidth){
    ctx.save();
    ctx.translate(pos.x, pos.y);

    const isBomb = unit.type==="bomb";
    const isArcher = unit.type==="archer";
    const isHunter = unit.type==="hunter";
    const isMage = unit.type==="mage";
    const t = performance.now() * 0.004 + unit.id * 0.17;
    const hoverLift = 0;
    const bob = 0;
    const sway = isBomb ? Math.sin(t * 0.65) * 0.025 : isArcher ? Math.sin(t * 0.45) * 0.012 : isHunter ? Math.sin(t * 0.55) * 0.018 : isMage ? Math.sin(t * 0.38) * 0.01 : 0;
    const drawSize = isBomb ? 52 : isHunter ? 44 : isMage ? 50 : 46;
    const drawY = isBomb ? -30 : isArcher ? -28 : isHunter ? -27 : isMage ? -29 : -29;

    ctx.shadowColor = isBomb ? "rgba(255,130,40,.22)" : isMage ? "rgba(168,139,250,.18)" : isHunter ? "rgba(56,189,116,.18)" : "rgba(255,184,74,.16)";
    ctx.shadowBlur = isBomb ? 12 : isArcher ? 8 : isHunter ? 9 : 8;
    ctx.shadowOffsetY = 1;

    const lightRadius = isBomb ? 24 : isMage ? 27 : isHunter ? 20 : 18;
    const lightAlpha = isBomb ? 0.12 : isMage ? 0.13 : isHunter ? 0.10 : 0.09;
    const lightColor = isBomb ? "255,166,92" : isMage ? "168,139,250" : isHunter ? "74,222,128" : "255,214,120";
    const flicker = 1 + Math.sin(t * (isBomb ? 1.8 : 1.25)) * 0.08;
    const glow = ctx.createRadialGradient(0, 7, 0, 0, 7, lightRadius * flicker);
    glow.addColorStop(0, `rgba(${lightColor},${(lightAlpha * 0.95).toFixed(3)})`);
    glow.addColorStop(0.35, `rgba(${lightColor},${(lightAlpha * 0.42).toFixed(3)})`);
    glow.addColorStop(1, `rgba(${lightColor},0)`);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 7, lightRadius * flicker, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if(isBomb){
      ctx.save();
      ctx.rotate(sway);
      ctx.drawImage(sprite, -drawSize / 2, drawY, drawSize, drawSize);
      ctx.restore();

      ctx.globalCompositeOperation = "screen";
      for(let i=0;i<4;i++){
        const px = Math.sin(t * (1.1 + i * 0.23) + i) * (8 + i * 1.6);
        const py = -18 - i * 7 - ((t * 12 + i * 5) % 8);
        const pr = i < 2 ? 2.2 : 1.5;
        ctx.fillStyle = i < 2 ? "rgba(255,196,110,.70)" : "rgba(255,132,52,.55)";
        ctx.beginPath();
        ctx.arc(px, py + bob * 0.4, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    } else {
      if(isArcher || isHunter){
        ctx.save();
        ctx.rotate(sway);
        ctx.drawImage(sprite, -drawSize / 2, drawY, drawSize, drawSize);
        ctx.restore();

        ctx.globalCompositeOperation = "screen";
        const count = isHunter ? 3 : 2;
        for(let i=0;i<count;i++){
          const px = (isHunter ? -10 : 18) + Math.sin(t * (1.2 + i * 0.25) + i) * (isHunter ? 5 : 3);
          const py = (isHunter ? -18 : -28) - i * (isHunter ? 7 : 10) - ((t * (isHunter ? 7 : 8) + i * 4) % (isHunter ? 5 : 6));
          ctx.fillStyle = isHunter ? (i === 0 ? "rgba(134,239,172,.42)" : "rgba(74,222,128,.28)") : (i === 0 ? "rgba(255,214,120,.50)" : "rgba(255,138,66,.38)");
          ctx.beginPath();
          ctx.arc(px, py + bob * 0.2, isHunter ? (i === 0 ? 1.6 : 1.1) : (i === 0 ? 1.8 : 1.2), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.save();
        ctx.rotate(sway);
        ctx.drawImage(sprite, -drawSize / 2, drawY, drawSize, drawSize);
        ctx.restore();

        ctx.globalCompositeOperation = "screen";
        const ringAlpha = 0.16 + (Math.sin(t * 1.5) + 1) * 0.06;
        ctx.strokeStyle = `rgba(196,181,253,${ringAlpha.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -10 + bob * 0.25, 14 + Math.sin(t * 1.3) * 1.8, 0, Math.PI * 2);
        ctx.stroke();
        for(let i=0;i<4;i++){
          const a = t * (0.9 + i * 0.08) + i * Math.PI / 2;
          const px = Math.cos(a) * (12 + i * 0.7);
          const py = -18 + Math.sin(a * 1.2) * 4 + bob * 0.3;
          ctx.fillStyle = i % 2 === 0 ? "rgba(216,180,254,.38)" : "rgba(167,139,250,.28)";
          ctx.beginPath();
          ctx.arc(px, py, i % 2 === 0 ? 1.7 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
    }
    ctx.restore();
  } else if(unit.type==="bomb"){
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
    ctx.save();
    ctx.fillStyle = "rgba(8,17,31,.92)";
    roundRect(pos.x - 16, pos.y - 39, 32, 16, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(253,230,138,.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(253,230,138,.96)";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`★${unit.level}`, pos.x, pos.y - 27);
    ctx.textAlign = "start";
    ctx.restore();
  }
  if(unit.specialization){
    const specIcon = getSpecializationIcon(unit.specialization);
    const theme = getSpecializationTheme(unit.specialization);
    const badgeX = pos.x + 18;
    const badgeY = pos.y + 17;
    ctx.save();
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(2,6,23,.72)";
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = theme.fill;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.stroke;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.16)";
    ctx.beginPath();
    ctx.arc(badgeX - 3.2, badgeY - 3.8, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.icon;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(specIcon, badgeX, badgeY + 0.5);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.restore();
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
  ctx.fillStyle=enemy.type==="boss"?(enemy.bossColor || (currentStage===6?"#c084fc":"#f59e0b")):enemy.type==="tank"?"#fb7185":enemy.type==="fast"?"#38bdf8":"#22c55e";
  roundRect(hpX,hpY,hpWidth*hpPct,6,4); ctx.fill();
}
const drawEnemies=()=>enemies.forEach(drawEnemy);

function drawProjectile(p){
  const trailDx = p.x - (p.px ?? p.x);
  const trailDy = p.y - (p.py ?? p.y);
  const speedGlow = Math.min(1, Math.hypot(trailDx, trailDy) / 8);

  if(p.projectileType==="bomb"){
    ctx.save();
    const grad = ctx.createLinearGradient(p.px, p.py, p.x, p.y);
    grad.addColorStop(0, "rgba(251,146,60,0)");
    grad.addColorStop(0.45, "rgba(251,146,60,.24)");
    grad.addColorStop(1, "rgba(255,214,170,.55)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(p.px,p.py);
    ctx.lineTo(p.x,p.y);
    ctx.stroke();

    ctx.shadowColor = p.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,6.5,0,Math.PI*2);
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(255,240,200,.75)";
    ctx.beginPath();
    ctx.arc(p.x + 1.5, p.y - 1.5, 2.2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if(p.projectileType==="mage"){
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.angle + Math.sin(performance.now()*0.01 + p.id) * 0.08);

    const tail = ctx.createLinearGradient(-20,0,8,0);
    tail.addColorStop(0, "rgba(167,139,250,0)");
    tail.addColorStop(0.5, "rgba(196,181,253,.26)");
    tail.addColorStop(1, "rgba(244,114,182,.16)");
    ctx.strokeStyle = tail;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-20,0);
    ctx.lineTo(4,0);
    ctx.stroke();

    ctx.shadowColor = "rgba(196,181,253,.9)";
    ctx.shadowBlur = 16;
    const orb = ctx.createRadialGradient(0,0,1,0,0,7);
    orb.addColorStop(0, "rgba(255,255,255,.95)");
    orb.addColorStop(.35, "rgba(224,231,255,.95)");
    orb.addColorStop(.7, "rgba(196,181,253,.9)");
    orb.addColorStop(1, "rgba(139,92,246,.65)");
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(0,0,6.2,0,Math.PI*2);
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = `rgba(216,180,254,${(0.25 + speedGlow * 0.2).toFixed(3)})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0,0,8.8 + Math.sin(performance.now()*0.02 + p.id) * 0.8,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.rotate(p.angle);

  const isHunter = p.projectileType === "hunter";
  const shaft = isHunter ? "#d9f99d" : "#e5e7eb";
  const fletch = isHunter ? "#4ade80" : "#f59e0b";
  const head = isHunter ? "#86efac" : "#f8fafc";

  ctx.strokeStyle = isHunter ? "rgba(74,222,128,.18)" : "rgba(251,191,36,.14)";
  ctx.lineWidth = isHunter ? 4 : 3.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-18,0);
  ctx.lineTo(6,0);
  ctx.stroke();

  ctx.shadowColor = isHunter ? "rgba(74,222,128,.45)" : "rgba(255,196,70,.35)";
  ctx.shadowBlur = isHunter ? 10 : 8;

  ctx.strokeStyle = shaft;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-12,0);
  ctx.lineTo(7,0);
  ctx.stroke();

  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.moveTo(8,0);
  ctx.lineTo(1,-4.2);
  ctx.lineTo(1,4.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fletch;
  ctx.beginPath();
  ctx.moveTo(-9,0);
  ctx.lineTo(-14,-3.5);
  ctx.lineTo(-12.3,0);
  ctx.lineTo(-14,3.5);
  ctx.closePath();
  ctx.fill();

  if(isHunter){
    ctx.globalCompositeOperation = "screen";
    for(let i=0;i<2;i++){
      ctx.fillStyle = i===0 ? "rgba(134,239,172,.55)" : "rgba(74,222,128,.35)";
      ctx.beginPath();
      ctx.arc(-4 - i * 5, (i===0 ? -1.5 : 1.8), i===0 ? 1.4 : 1.0, 0, Math.PI*2);
      ctx.fill();
    }
  }
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
  ctx.fillStyle="#fef3c7"; ctx.font="bold 20px Arial"; ctx.textAlign="center"; ctx.fillText(isCurrentWaveBoss() ? (currentMode === "endless" ? "TWIN BOSS WAVE" : (STAGE_BOSS[currentStage]?.name || "BOSS WAVE")) : "WARNING", canvas.width/2, 66);
  ctx.restore();
}

function drawWaveIntro(){
  if(waveIntroTimer<=0) return;
  const total = 1.8;
  const progress = 1 - (waveIntroTimer / total);
  const fadeIn = Math.min(1, progress / 0.18);
  const fadeOut = Math.min(1, waveIntroTimer / 0.45);
  const alpha = Math.min(fadeIn, fadeOut);
  const y = 70 - (1 - alpha) * 10;

  ctx.save();
  ctx.globalAlpha = alpha;

  const width = Math.max(220, Math.min(420, ctx.measureText ? 320 : 320));
  ctx.fillStyle = "rgba(8,17,31,.72)";
  roundRect(canvas.width/2 - 160, y - 28, 320, 54, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(251,191,36,.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 22px Arial";
  ctx.fillText(waveIntroText, canvas.width/2, y - 2);
  ctx.fillStyle = "rgba(226,232,240,.78)";
  ctx.font = "600 11px Arial";
  ctx.fillText(waveIntroSubtext, canvas.width/2, y + 16);
  ctx.restore();
}


function drawBossDefeatIntro(){
  if(bossDefeatIntroTimer<=0) return;
  const total = 1.2;
  const progress = 1 - (bossDefeatIntroTimer / total);
  const fadeIn = Math.min(1, progress / 0.16);
  const fadeOut = Math.min(1, bossDefeatIntroTimer / 0.30);
  const alpha = Math.min(fadeIn, fadeOut);
  const y = canvas.height * 0.28 - (1 - alpha) * 8;

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(canvas.width/2 - 190, y - 34, 380, 72, 22);
  ctx.fillStyle = "rgba(10,14,24,.76)";
  ctx.fill();
  ctx.strokeStyle = "rgba(251,191,36,.28)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#fde68a";
  ctx.font = "700 28px Arial";
  ctx.fillText(bossDefeatIntroText || "BOSS DEFEATED", canvas.width/2, y - 2);
  ctx.fillStyle = "rgba(226,232,240,.84)";
  ctx.font = "600 13px Arial";
  ctx.fillText(bossDefeatIntroSubtext || "Choose a legendary aura", canvas.width/2, y + 20);
  ctx.restore();
}

function drawAuraBindFx(){
  if(auraBindFxTimer <= 0 || !auraBindFxUnitId) return;

  const unit = getUnitById(auraBindFxUnitId);
  if(!unit) return;

  const aura = getAuraData(unit.auraType);
  const color = aura?.color || "#fde68a";
  const pos = cellCenter(unit.c, unit.r);
  const t = 1 - (auraBindFxTimer / 1.0);

  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - t * 0.9);

  for(let i = 0; i < 2; i++){
    const radius = 18 + t * 44 + i * 10;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = i === 0 ? 3 : 1.5;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 14 + Math.sin(t * Math.PI * 4) * 2, 0, Math.PI * 2);
  ctx.fillStyle = `${color}33`;
  ctx.fill();

  ctx.restore();
}

function drawStageQuoteCinematic(){
  if(stageQuoteTimer <= 0) return;

  const total = 3.6;
  const progress = 1 - (stageQuoteTimer / total);
  const fadeIn = Math.min(1, progress / 0.18);
  const fadeOut = Math.min(1, stageQuoteTimer / 0.75);
  const alpha = Math.min(fadeIn, fadeOut);

  ctx.save();

  ctx.globalAlpha = 0.58 * alpha;
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.20 * alpha;
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "rgba(0,0,0,0.95)");
  grad.addColorStop(0.22, "rgba(0,0,0,0.25)");
  grad.addColorStop(0.78, "rgba(0,0,0,0.25)");
  grad.addColorStop(1, "rgba(0,0,0,0.95)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const boxW = Math.min(760, canvas.width - 80);
  const boxH = 110;
  const x = canvas.width / 2 - boxW / 2;
  const y = canvas.height * 0.72 - boxH / 2;

  roundRect(x, y, boxW, boxH, 22);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(7,10,18,0.72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(251,191,36,0.22)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "italic 700 24px Georgia";
  ctx.fillText(stageQuoteText, canvas.width / 2, y + 44);

  ctx.fillStyle = "rgba(226,232,240,0.72)";
  ctx.font = "600 12px Arial";
  ctx.fillText(stageQuoteSubtext, canvas.width / 2, y + 72);

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
  drawPathAtmosphere();
  drawPath();
  drawStageLighting();
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
  drawWaveIntro();
  drawBossDefeatIntro();
  drawAuraBindFx();
  drawStageQuoteCinematic();
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
  ensureAudio(); hasStarted=true; if(!isMuted && !ambientState.masterGain) syncAmbientAudio();
  const {x,y,c,r}=getMousePos(event);

  if(pendingAuraChoice){
    for(const unit of units){
      const pos=cellCenter(unit.c,unit.r);
      if(distance({x,y},pos)<=26){
        applyPendingAuraToUnit(unit);
        return;
      }
    }
    setMessage("Choose a tower for the legendary aura.");
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
    setMessage(`You selected ${clickedUnit.name}.`);
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
      const t = UNIT_TYPES[selectedUnitType];
      hideUnitInfoPanel();
      setPlacementHudAutoHide(true);
      setMessage(`You selected ${t.name} · Cost ${t.cost} · Range ${Math.round(t.range)}`);
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
towerSpecializationPanel?.addEventListener("click",(event)=>{
  const btn = event.target.closest("[data-spec-id]");
  if(!btn) return;
  event.stopPropagation();
  applySpecializationToSelectedUnit(btn.dataset.specId);
});
startWaveBtn.addEventListener("click",startWave);
pauseBtn.addEventListener("click",togglePause);
resetBtn.addEventListener("click",resetGame);

spellSlowBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || isPaused || spellCooldown.slow > 0) return;
  selectedSpell = selectedSpell === "slow" ? null : "slow";
  setMessage(selectedSpell === "slow" ? "Choose the target area for Frost Nova." : "Spell canceled.");
  updateSpellButtons();
});

spellDamageBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || isPaused || spellCooldown.damage > 0) return;
  selectedSpell = selectedSpell === "damage" ? null : "damage";
  setMessage(selectedSpell === "damage" ? "Choose the target area for Meteor Strike." : "Spell canceled.");
  updateSpellButtons();
});

spellBombBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || isPaused || spellCooldown.bomb > 0) return;
  selectedSpell = selectedSpell === "bomb" ? null : "bomb";
  setMessage(selectedSpell === "bomb" ? "Choose the target area for Chain Lightning." : "Spell canceled.");
  updateSpellButtons();
});

resetCameraBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  toggleUnitInfoPanel();
  setMessage(unitInfoPanel?.classList.contains("hidden") ? "Tower panel closed." : "Tower panel opened.");
  updateUI();
});

startGameBtn.addEventListener("click",()=>{
  hasStarted=true; ensureAudio(); syncAmbientAudio();
  startOverlay.classList.add("hidden");
  loadProgressNotice();
  loadBonusLeaderboard();
  setMessage("Dark Defense started. Place towers, start the wave, and use spells when needed.");
});
restartFromGameOverBtn.addEventListener("click",()=>{
  gameOverOverlay.classList.add("hidden");
  applyStage(currentStage, true);
  if(hasStarted && !isMuted) syncAmbientAudio();
});

returnToMenuBtn?.addEventListener("click",()=>{
  gameOverOverlay.classList.add("hidden");
  resetGame();
  startOverlay.classList.remove("hidden");
  setMessage("Returned to the main menu.");
});

enterEndlessBtn?.addEventListener("click", ()=>{
  enterEndlessModeFromUnlock();
});

backToMenuFromEndlessBtn?.addEventListener("click", ()=>{
  hideEndlessUnlockOverlay();
  resetGame();
  startOverlay.classList.remove("hidden");
  setMessage("Returned to the main menu.");
});

updateAudioToggle();
applyHudVisibility();
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


hudToggleBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  toggleHudVisibility();
});

audioToggle?.addEventListener("click",(event)=>{
  event.stopPropagation();
  ensureAudio();
  isMuted = !isMuted;
  if(audioAssets){
    Object.values(audioAssets).forEach((pool)=>pool.setMuted(isMuted));
  }
  if(isMuted){ stopBossLoop(); clearAmbientAudio(); }
  else { syncAmbientAudio(); }
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

  if(key === "h"){
    toggleHudVisibility();
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
  hideUnitInfoPanel();
  setPlacementHudAutoHide(true);
  selectedPlacedUnitId = null;
  const t = UNIT_TYPES[selectedUnitType];
  setMessage(`You selected ${t.name} · Cost ${t.cost} · Range ${Math.round(t.range)}`);
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
  auraRewardNote.textContent = `Selected aura: ${aura.name}. Click the target tower to bind it permanently.`;
  setMessage(`You chose ${aura.name}. Click the tower that should receive the blessing.`);
  isPaused = false;
  updateUI();
});

refreshLeaderboardBtn?.addEventListener("click", ()=>{ loadBonusLeaderboard(); });


syncMobileHudLayout();
window.addEventListener("resize", syncMobileHudLayout);
mobileLayoutMedia.addEventListener?.("change", syncMobileHudLayout);
