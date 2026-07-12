const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const moneyBadge = document.getElementById("moneyBadge");
const livesBadge = document.getElementById("livesBadge");
const waveBadge = document.getElementById("waveBadge");
const stageBadge = document.getElementById("stageBadge");
const panelHeaderUserLink = document.getElementById("panelHeaderUserLink");
const panelHeaderUserValue = document.getElementById("panelHeaderUserValue");
const panelHeaderLogoutBtn = document.getElementById("panelHeaderLogoutBtn");
const progressText = document.getElementById("progressText");
const waveFill = document.getElementById("waveFill");
const messageBox = document.getElementById("messageBox");
const statusPill = document.getElementById("statusPill");
const waveForecastTag = document.getElementById("waveForecastTag");
const waveForecastText = document.getElementById("waveForecastText");
const hintChip = document.getElementById("hintChip");
const audioToggle = document.getElementById("audioToggle");
const hudToggleBtn = document.getElementById("hudToggleBtn");
const onboardingCard = document.getElementById("onboardingCard");
const onboardingProgress = document.getElementById("onboardingProgress");
const onboardingTitle = document.getElementById("onboardingTitle");
const onboardingText = document.getElementById("onboardingText");
const onboardingDots = document.getElementById("onboardingDots");
const onboardingSkipBtn = document.getElementById("onboardingSkipBtn");

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
const overviewCard = document.getElementById("overviewCard");
const coreStatsToggle = document.getElementById("coreStatsToggle");

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
const leaderboardNameOverlay = document.getElementById("leaderboardNameOverlay");
const leaderboardNameTitle = document.getElementById("leaderboardNameTitle");
const leaderboardNameText = document.getElementById("leaderboardNameText");
const leaderboardNameInput = document.getElementById("leaderboardNameInput");
const leaderboardNameSubmitBtn = document.getElementById("leaderboardNameSubmitBtn");
const leaderboardNameCancelBtn = document.getElementById("leaderboardNameCancelBtn");
const startGameBtn = document.getElementById("startGameBtn");
const restartFromGameOverBtn = document.getElementById("restartFromGameOverBtn");
const returnToMenuBtn = document.getElementById("returnToMenuBtn");
const gameOverText = document.getElementById("gameOverText");
const gameOverQuote = document.getElementById("gameOverQuote");
const gameOverStageLabel = document.getElementById("gameOverStageLabel");
const gameOverStageStat = document.getElementById("gameOverStageStat");
const gameOverWaveStat = document.getElementById("gameOverWaveStat");
const gameOverKillsStat = document.getElementById("gameOverKillsStat");
const gameOverScoreStat = document.getElementById("gameOverScoreStat");
const gameOverComboStat = document.getElementById("gameOverComboStat");
const auraRewardOverlay = document.getElementById("auraRewardOverlay");
const auraRewardList = document.getElementById("auraRewardList");
const auraRewardText = document.getElementById("auraRewardText");
const auraRewardNote = document.getElementById("auraRewardNote");
const auraRewardBonus = document.getElementById("auraRewardBonus");
const endlessUnlockOverlay = document.getElementById("endlessUnlockOverlay");
const endlessUnlockText = document.getElementById("endlessUnlockText");
const endlessUnlockReward = document.getElementById("endlessUnlockReward");
const enterEndlessBtn = document.getElementById("enterEndlessBtn");
const backToMenuFromEndlessBtn = document.getElementById("backToMenuFromEndlessBtn");
const endlessUnlockArtwork = document.querySelector(".endless-unlocked-artwork");
const endlessUnlockArtworkImage = endlessUnlockArtwork?.querySelector("img");

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

const UNIT_CARD_META = {
  archer:{emoji:"🏹", role:"Fast", roleClass:"", summary:"Fast single-target damage"},
  hunter:{emoji:"🎯", role:"Power", roleClass:"power", summary:"Heavy precision shots"},
  mage:{emoji:"🔮", role:"Splash", roleClass:"splash", summary:"AoE magic damage"},
  bomb:{emoji:"💣", role:"Blast", roleClass:"blast", summary:"Splash burst tower"}
};

function clampPercent(value){
  return `${Math.max(8, Math.min(100, Math.round(value)))}%`;
}

function setPanelUserLabel(name, crestId = null){
  if(!panelHeaderUserValue) return;
  const trimmedName = String(name || "").trim();
  panelHeaderUserValue.textContent = trimmedName || "Guest";
  const crestSlot = document.getElementById("panelHeaderUserCrest");
  if(crestSlot && window.DarkDefenseCrest){
    crestSlot.innerHTML = window.DarkDefenseCrest.markup(trimmedName || "Guest", "dd-crest-header", crestId);
  }
}

async function loadPanelUserSession(){
  setPanelUserLabel("Guest");
  panelHeaderUserLink?.setAttribute("href", "/account.html");
  panelHeaderLogoutBtn?.classList.add("hidden");
  try{
    const response = await fetch("/.netlify/functions/me", {
      credentials: "include",
      cache: "no-store"
    });
    if(!response.ok) return;
    const data = await response.json();
    if(!data?.authenticated || !data?.user?.username) return;
    setPanelUserLabel(data.user.username, data.user.crestId || null);
    panelHeaderUserLink?.setAttribute("href", "/profile.html");
    panelHeaderLogoutBtn?.classList.remove("hidden");
    leyAccountAuthed = true;
    syncLeyMetaWithAccount();
  }catch(_){
    setPanelUserLabel("Guest");
  }
}

function refreshUnitShopCards(){
  if(!unitInfoButtons?.length) return;
  const unitEntries = Object.entries(UNIT_TYPES);
  const maxDamage = Math.max(...unitEntries.map(([, data]) => data.damage || 0), 1);
  const maxRange = Math.max(...unitEntries.map(([, data]) => data.range || 0), 1);

  unitInfoButtons.forEach((card)=>{
    const type = card.dataset.type;
    const unit = UNIT_TYPES[type];
    const meta = UNIT_CARD_META[type];
    if(!unit || !meta) return;

    const titleEl = card.querySelector('.unit-info-top strong');
    const roleEl = card.querySelector('.unit-role-tag');
    const costEl = card.querySelector('.unit-cost-badge');
    const barRows = card.querySelectorAll('.unit-bar');
    const barEls = card.querySelectorAll('.unit-bar i');
    const metaEl = card.querySelector('.unit-info-meta');

    if(titleEl) titleEl.textContent = `${meta.emoji} ${unit.name}`;
    if(roleEl){
      roleEl.textContent = meta.role;
      roleEl.className = `unit-role-tag ${meta.roleClass}`.trim();
    }
    if(costEl) costEl.textContent = String(unit.cost);
    if(barRows[0]){
      const dmgLabelEl = barRows[0].querySelector('span');
      if(dmgLabelEl) dmgLabelEl.textContent = `DMG ${Math.round(unit.damage)}`;
    }
    if(barRows[1]){
      const rangeLabelEl = barRows[1].querySelector('span');
      if(rangeLabelEl) rangeLabelEl.textContent = `RNG ${Math.round(unit.range)}`;
    }
    if(barEls[0]) barEls[0].style.setProperty('--fill', clampPercent((unit.damage / maxDamage) * 100));
    if(barEls[1]) barEls[1].style.setProperty('--fill', clampPercent((unit.range / maxRange) * 100));
    if(metaEl) metaEl.textContent = `${meta.summary}`;
  });
}

function getCurrentBossBannerInfo(){
  if(!isCurrentWaveBoss()) return { title: "WARNING", subtitle: "" };
  if(currentMode === "endless") {
    if(pendingEndlessBossPair.length === 2){
      const [firstBossStage, secondBossStage] = pendingEndlessBossPair;
      const firstBoss = STAGE_BOSS[firstBossStage]?.name || `Boss ${firstBossStage}`;
      const secondBoss = STAGE_BOSS[secondBossStage]?.name || `Boss ${secondBossStage}`;
      return {
        title: "TWIN HORRORS EMERGE",
        subtitle: `${firstBoss}  ✦  ${secondBoss}`
      };
    }
    return { title: "TWIN HORRORS EMERGE", subtitle: "Dual boss wave" };
  }
  return {
    title: STAGE_BOSS[currentStage]?.name || "BOSS WAVE",
    subtitle: `Stage ${currentStage} boss`
  };
}

function startBossCastBanner(text, color="#f8fafc", duration=1.35){
  bossCastTimer = duration;
  bossCastText = text;
  bossCastColor = color;
}

function playBossWaveWarning(){
  ensureAudio();
  tone("sawtooth", 110, 62, .42, .026);
  setTimeout(()=>tone("square", 165, 82, .28, .018), 180);
  setTimeout(()=>tone("sawtooth", 105, 55, .46, .024), 520);
  noiseBurst(.22, .026, 850);
  addScreenShake(currentMode === "endless" ? 8 : 5, .55);
  screenFlashes.push({ color:"#7f1d1d", life:.55, maxLife:.55, alpha:.24 });
  vibrate(currentMode === "endless" ? [80, 45, 110] : [70, 45, 70]);
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
const START_LIVES = 20, START_MONEY = 300;

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

const bossSplashSources = {
  1: "assets/ui/boss-stage1.jpg",
  2: "assets/ui/boss-stage2.jpg",
  3: "assets/ui/boss-stage3.jpg",
  4: "assets/ui/boss-stage4.jpg",
  5: "assets/ui/boss-stage5.jpg",
  6: "assets/ui/boss-stage6.jpg"
};
const bossSplashImages = {};
function loadBossSplashImages(){
  Object.entries(bossSplashSources).forEach(([stage, src]) => {
    const img = new Image();
    img.src = src;
    bossSplashImages[stage] = img;
  });
}
loadBossSplashImages();

const bossDefeatLogoSources = {
  campaign: "assets/ui/boss-defeat-campaign.jpg",
  endless: "assets/ui/boss-defeat-endless.jpg"
};
const bossDefeatLogoImages = {};
function loadBossDefeatLogos(){
  Object.entries(bossDefeatLogoSources).forEach(([mode, src]) => {
    const img = new Image();
    img.src = src;
    bossDefeatLogoImages[mode] = img;
  });
}
loadBossDefeatLogos();


const STAGES = {
  1: { name:"Forest", bossWave:5, difficulty:1.0, bossAbility:"roots",
    route:[{c:0,r:4},{c:4,r:4},{c:4,r:2},{c:9,r:2},{c:9,r:7},{c:13,r:7},{c:13,r:3},{c:17,r:3}],
    blocked:[{c:5,r:3},{c:8,r:3},{c:10,r:6},{c:2,r:7},{c:15,r:1}], ley:[{c:10,r:4,kind:"range"},{c:6,r:1,kind:"damage"}],
    grassPatches:[{x:42,y:26,w:120,h:72},{x:790,y:408,w:124,h:76},{x:368,y:438,w:140,h:52}],
    trees:[{x:98,y:116},{x:918,y:466},{x:956,y:86},{x:710,y:118}]},
  2: { name:"Ruins", bossWave:6, difficulty:1.35, bossAbility:"rage",
    route:[{c:0,r:7},{c:5,r:7},{c:5,r:2},{c:9,r:2},{c:9,r:5},{c:14,r:5},{c:14,r:2},{c:17,r:2}],
    blocked:[{c:6,r:3},{c:10,r:4},{c:4,r:6},{c:12,r:7},{c:2,r:3}], ley:[{c:11,r:6,kind:"damage"},{c:7,r:1,kind:"range"}],
    grassPatches:[{x:84,y:352,w:166,h:98},{x:704,y:38,w:160,h:78},{x:408,y:212,w:112,h:62}],
    ruins:[{x:108,y:126},{x:846,y:168},{x:770,y:424},{x:524,y:302}]},
  3: { name:"Graveyard", bossWave:7, difficulty:1.7, bossAbility:"summon",
    route:[{c:0,r:5},{c:3,r:5},{c:3,r:7},{c:9,r:7},{c:9,r:2},{c:14,r:2},{c:14,r:6},{c:17,r:6}],
    blocked:[{c:10,r:3},{c:4,r:6},{c:8,r:6},{c:16,r:1},{c:6,r:4}], ley:[{c:6,r:6,kind:"damage"},{c:16,r:4,kind:"range"}],
    grassPatches:[{x:102,y:44,w:162,h:62},{x:476,y:376,w:124,h:76},{x:804,y:298,w:110,h:64}],
    ruins:[{x:150,y:178},{x:596,y:132},{x:866,y:380},{x:700,y:466}]},
  4: { name:"Castle", bossWave:8, difficulty:2.15, bossAbility:"shield",
    route:[{c:0,r:2},{c:6,r:2},{c:6,r:5},{c:10,r:5},{c:10,r:2},{c:15,r:2},{c:15,r:7},{c:17,r:7}],
    blocked:[{c:5,r:3},{c:9,r:4},{c:14,r:3},{c:2,r:5},{c:12,r:8}], ley:[{c:16,r:3,kind:"damage"},{c:11,r:1,kind:"range"}],
    grassPatches:[{x:54,y:402,w:144,h:74},{x:744,y:64,w:152,h:66},{x:514,y:434,w:128,h:54}],
    ruins:[{x:184,y:236},{x:790,y:286},{x:918,y:186}]},
  5: { name:"Catacombs", bossWave:9, difficulty:2.55, bossAbility:"rage",
    route:[{c:0,r:6},{c:2,r:6},{c:2,r:2},{c:8,r:2},{c:8,r:7},{c:13,r:7},{c:13,r:3},{c:17,r:3}],
    blocked:[{c:9,r:6},{c:14,r:4},{c:3,r:3},{c:5,r:4},{c:16,r:7}], ley:[{c:5,r:1,kind:"range"},{c:15,r:2,kind:"damage"}],
    grassPatches:[{x:78,y:72,w:108,h:48},{x:794,y:434,w:134,h:52},{x:470,y:300,w:116,h:64}],
    ruins:[{x:366,y:258},{x:846,y:154},{x:628,y:456}]},
  6: { name:"Dark Portal", bossWave:10, difficulty:3.0, bossAbility:"shield",
    route:[{c:0,r:2},{c:5,r:2},{c:5,r:7},{c:8,r:7},{c:8,r:2},{c:13,r:2},{c:13,r:7},{c:17,r:7}],
    blocked:[{c:4,r:3},{c:9,r:3},{c:7,r:6},{c:16,r:1},{c:11,r:4}], ley:[{c:6,r:4,kind:"damage"},{c:10,r:1,kind:"range"}],
    grassPatches:[{x:86,y:42,w:120,h:62},{x:752,y:344,w:166,h:84},{x:500,y:458,w:124,h:52}],
    ruins:[{x:184,y:144},{x:492,y:340},{x:856,y:214},{x:952,y:430}]}
};

const stageFxState = {
  emberSeed: Array.from({length: 18}, (_, i) => ({
    baseX: 40 + i * 53 + (i % 3) * 7,
    phase: i * 0.7,
    speed: 0.18 + (i % 5) * 0.035,
    size: 1.2 + (i % 4) * 0.5
  })),
  dustSeed: Array.from({length: 16}, (_, i) => ({
    baseX: 80 + i * 58 + (i % 4) * 11,
    baseY: 90 + (i % 5) * 86,
    phase: i * 0.63,
    speed: 0.22 + (i % 4) * 0.04,
    size: 18 + (i % 5) * 5
  })),
  ashSeed: Array.from({length: 20}, (_, i) => ({
    baseX: 36 + i * 48 + (i % 2) * 9,
    phase: i * 0.58,
    speed: 0.2 + (i % 6) * 0.03,
    size: 1.1 + (i % 4) * 0.45
  })),
  portalSeed: Array.from({length: 10}, (_, i) => ({
    phase: i * 0.8,
    radius: 54 + i * 10,
    wobble: 8 + (i % 3) * 3
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
  archer:{name:"Archer",cost:90,range:122,fireRate:.72,damage:30,projectileSpeed:450,color:"#34d399",hood:"#065f46",upgradeCost:105,sellFactor:.8,kind:"arrow"},
  hunter:{name:"Hunter",cost:190,range:186,fireRate:1.24,damage:76,projectileSpeed:520,color:"#f59e0b",hood:"#78350f",upgradeCost:215,sellFactor:.8,kind:"arrow"},
  mage:{name:"Mage",cost:235,range:156,fireRate:1.08,damage:54,projectileSpeed:400,color:"#a78bfa",hood:"#5b21b6",upgradeCost:230,sellFactor:.82,kind:"magic",splash:52},
  bomb:{name:"Bomb Tower",cost:305,range:145,fireRate:1.7,damage:104,projectileSpeed:315,color:"#ef4444",hood:"#7f1d1d",upgradeCost:345,sellFactor:.84,kind:"bomb",splash:68}
};

refreshUnitShopCards();

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



const STAGE_CLEAR_GOLD_REWARD = {
  1: 80,
  2: 100,
  3: 120,
  4: 140,
  5: 160,
  6: 200
};

function getStageClearGoldReward(stage){
  return STAGE_CLEAR_GOLD_REWARD[stage] || 0;
}

const STAGE_BOSS = {
  1: { name: "Ancient Treant Skull", color: "#84cc16" },
  2: { name: "Ruin Warden", color: "#94a3b8" },
  3: { name: "Grave Necromancer", color: "#a78bfa" },
  4: { name: "Iron Castellan", color: "#f59e0b" },
  5: { name: "Catacomb Devourer", color: "#fb7185" },
  6: { name: "Dark Portal Overlord", color: "#c084fc" }
};

const BOSS_ABILITY_META = {
  roots: { label:"Root Grasp", short:"Roots", color:"#86efac", warning:"Snares the nearest tower for 3.5 seconds.", tip:"Spread damage across multiple towers." },
  rage: { label:"Blood Rage", short:"Rage", color:"#fca5a5", warning:"Gains speed and restores part of its health.", tip:"Save burst damage and control for the rage." },
  summon: { label:"Grave Summons", short:"Summon", color:"#c4b5fd", warning:"Summons fast minions onto the road.", tip:"Keep an area-damage tower near the main path." },
  shield: { label:"Void Bulwark", short:"Shield", color:"#93c5fd", warning:"Restores health through a defensive shield.", tip:"Hold Meteor or heavy damage for the shield." }
};

function getBossAbilityMeta(stageNumber=currentStage){
  const abilityId = STAGES[stageNumber]?.bossAbility;
  return BOSS_ABILITY_META[abilityId] || { label:"Boss Ability", short:"Ability", color:"#f8fafc", warning:"The boss is preparing a special attack.", tip:"Keep spells ready." };
}

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
    bullets:["+40% gold on kill","+25 bonus score on kill","Pact Surge every 8 kills"]
  }
};

const FONT_UI = '"Inter", Arial, Helvetica, sans-serif';
const FONT_DISPLAY = '"Cinzel", Georgia, "Times New Roman", serif';

let currentStage = 1, path = STAGES[currentStage].route, pathCells = buildPathCells(path);
let units = [], enemies = [], projectiles = [], particles = [], popups = [], placementEffects = [], upgradeEffects = [], impactBursts = [], screenFlashes = [];
let money = START_MONEY, lives = START_LIVES, score = 0, bonusScore = 0, kills = 0;
let wave = 1, stageWave = 1, waveActive = false, spawnLeft = 0, selectedUnitType = "archer", selectedPlacedUnitId = null;
let isHudManuallyHidden = false, isPlacementHudAutoHidden = false;
let spawnTimer = 0, idCounter = 1, lastTime = 0, hoveredCell = null, isPaused = false, hasStarted = false, bossBannerTimer = 0, stageStartLives = START_LIVES;
let currentMode = "campaign", endlessUnlocked = false;
let comboCount = 0, comboTimer = 0, comboPop = 0, comboBest = 0;
let waveCallBonus = 0, waveCallBonusMax = 0;
const WAVE_CALL_DECAY_SECONDS = 30;
function armWaveCallBonus(){
  waveCallBonusMax = 16 + stageWave * 3 + currentStage * 4;
  waveCallBonus = waveCallBonusMax;
}
const COMBO_WINDOW = 2.6;
function getBestComboRecord(){
  try { return parseInt(localStorage.getItem("sdcBestCombo") || "0", 10) || 0; } catch(e){ return 0; }
}
function getComboMultiplier(){
  return comboCount >= 20 ? 2 : comboCount >= 10 ? 1.5 : comboCount >= 5 ? 1.25 : 1;
}
function registerComboKill(pos){
  comboCount += 1;
  comboBest = Math.max(comboBest, comboCount);
  comboTimer = COMBO_WINDOW;
  comboPop = 1;
  if(comboCount === 5 || comboCount === 10 || comboCount === 20){
    tone("sine", 520 + comboCount * 14, 760 + comboCount * 16, .09, .016);
    showPopup(pos.x, pos.y - 44, `COMBO x${comboCount}!`, comboCount >= 20 ? "#f472b6" : comboCount >= 10 ? "#fbbf24" : "#5eead4");
  }
  if(comboCount >= 10) unlockAchievement("combo_10");
  if(comboCount >= 25) unlockAchievement("combo_25");
  if(comboCount > getBestComboRecord()){
    try { localStorage.setItem("sdcBestCombo", String(comboCount)); } catch(e){}
    if(comboCount >= 10) showPopup(pos.x, pos.y - 58, "New combo record!", "#f472b6");
  }
}
function breakCombo(rewarded){
  if(rewarded && comboCount >= 10){
    const bonus = comboCount * 8;
    bonusScore += bonus;
    pushNotification("achievement", "Combo finished", `Combo x${comboCount} — +${bonus} bonus score.`);
  }
  comboCount = 0;
  comboTimer = 0;
}
let bossFxTimer = 0;
let bossFxType = "";
let bossTelegraphTimer = 0;
let bossTelegraphType = "";
let bossTelegraphStage = null;
let bossCastTimer = 0;
let bossCastText = "";
let bossCastColor = "#f8fafc";
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
  damage: { cooldown: 24, radius: 84, damage: 180 },
  bomb: { cooldown: 16, range: 120, damage: 90, chains: 4 }
};

let pendingAuraDraft = null;
let pendingAuraChoice = null;
let pendingBossResolution = null;
let pendingEndlessBossPair = [];
let lastEndlessBossPairKey = "";
let runEndlessBossPairsDefeated = 0;
let pendingLeaderboardNameRequest = null;
let bestEndlessWave = 0;
let bestEndlessBossPairs = 0;

let leaderboardRun = { runId:"", runToken:"", expiresAt:0, clientStartedAt:0, mode:"campaign" };
let leaderboardRunPromise = null;

const achievements = {
  first_kill:false,
  builder:false,
  boss_hunter:false,
  rich:false,
  wave_master:false,
  survivor:false,
  first_spell_cast:false,
  first_tower_upgrade:false,
  stage6_clear:false,
  first_endless_boss_pair:false,
  endless_wave_20:false,
  endless_wave_30:false,
  combo_10:false,
  combo_25:false
};

const ACHIEVEMENT_CONFIG = {
  first_kill:{ title:"First Blood", goldReward:0 },
  builder:{ title:"Builder", goldReward:0 },
  boss_hunter:{ title:"Boss Hunter", goldReward:50 },
  rich:{ title:"Treasurer", goldReward:0 },
  wave_master:{ title:"Wave Master", goldReward:0 },
  survivor:{ title:"Survivor", goldReward:0 },
  first_spell_cast:{ title:"Arcane Initiate", goldReward:25 },
  first_tower_upgrade:{ title:"Forged for War", goldReward:25 },
  stage6_clear:{ title:"Campaign Conqueror", goldReward:100 },
  first_endless_boss_pair:{ title:"Twin Terrors Broken", goldReward:75 },
  endless_wave_20:{ title:"Abyss Walker", goldReward:75 },
  endless_wave_30:{ title:"Beyond the Threshold", goldReward:100 },
  combo_10:{ title:"Chain Reaction", goldReward:25 },
  combo_25:{ title:"Unbroken Slaughter", goldReward:75 }
};

function getAchievementRewardClaimKey(key){
  return `sdcAchievementGoldClaimed:${key}`;
}

function isAchievementRewardClaimed(key){
  try{ return localStorage.getItem(getAchievementRewardClaimKey(key)) === "1"; }catch(e){ return false; }
}

function markAchievementRewardClaimed(key){
  try{ localStorage.setItem(getAchievementRewardClaimKey(key), "1"); }catch(e){}
}

/* ============================================================
   LEY ATTUNEMENT — persistent meta progression.
   Ley Crystals are earned every run (win or lose) and spent on
   permanent talents. Stored in localStorage; survives resets.
   ============================================================ */
const LEY_STORAGE_KEYS = { crystals:"sdcLeyCrystals", talents:"sdcLeyTalents" };

const LEY_TALENT_BRANCHES = [
  {
    id:"radiance", name:"Radiance", icon:"🔆", color:"#fbbf24",
    tagline:"Channel ley light into raw firepower.",
    nodes:[
      { id:"radiant_edge", name:"Radiant Edge", maxRank:3, costs:[20,45,90],
        desc:r=>`Towers deal +${4*r}% damage.`, next:r=>`+${4*(r+1)}% damage` },
      { id:"swift_current", name:"Swift Current", maxRank:2, costs:[60,120],
        desc:r=>`Towers attack ${4*r}% faster.`, next:r=>`${4*(r+1)}% faster attacks` },
      { id:"farsight", name:"Farsight Prism", maxRank:1, costs:[150],
        desc:r=>r>0?"Towers gain +6% range.":"Towers gain +6% range.", next:()=> "+6% tower range" },
      { id:"ley_conduit", name:"Ley Conduit", maxRank:1, costs:[100],
        desc:()=> "Ley stones on the map are empowered: +18% damage / +22% range (up from +10% / +12%).",
        next:()=> "Empowered ley stones" }
    ]
  },
  {
    id:"bastion", name:"Bastion", icon:"🛡️", color:"#5eead4",
    tagline:"Fortify the gate and your war chest.",
    nodes:[
      { id:"golden_veins", name:"Golden Veins", maxRank:3, costs:[20,40,80],
        desc:r=>`Start every run with +${40*r} gold.`, next:r=>`+${40*(r+1)} starting gold` },
      { id:"warding_light", name:"Warding Light", maxRank:2, costs:[55,110],
        desc:r=>`Start every run with +${2*r} lives.`, next:r=>`+${2*(r+1)} starting lives` },
      { id:"prosperity", name:"Prosperity", maxRank:2, costs:[70,140],
        desc:r=>`Enemies drop +${6*r}% gold.`, next:r=>`+${6*(r+1)}% gold from kills` },
      { id:"mended_gate", name:"Mended Gate", maxRank:1, costs:[90],
        desc:()=> "Stage-clear healing restores up to 4 lives (up from 2).",
        next:()=> "Stage heal 2 → 4 lives" }
    ]
  },
  {
    id:"arcana", name:"Arcana", icon:"🔮", color:"#c084fc",
    tagline:"Bend spells, auras and the ley itself.",
    nodes:[
      { id:"attuned_casting", name:"Attuned Casting", maxRank:2, costs:[40,85],
        desc:r=>`Spell cooldowns reduced by ${Math.round((1-Math.pow(0.90,r))*100)}%.`, next:r=>`-10% spell cooldowns` },
      { id:"second_sight", name:"Second Sight", maxRank:1, costs:[130],
        desc:()=> "Once per boss reward, you may reroll the aura draft.",
        next:()=> "Aura draft reroll" },
      { id:"crystal_harvest", name:"Crystal Harvest", maxRank:2, costs:[30,70],
        desc:r=>`Earn +${20*r}% Ley Crystals from all sources.`, next:r=>`+${20*(r+1)}% crystal gain` },
      { id:"luminous_awakening", name:"Luminous Awakening", maxRank:1, costs:[200],
        desc:()=> "Boss aura drafts reveal all 4 auras instead of 3.",
        next:()=> "Draft shows all auras" }
    ]
  }
];

function getLeyNodeDef(nodeId){
  for(const branch of LEY_TALENT_BRANCHES){
    const node = branch.nodes.find(n=>n.id===nodeId);
    if(node) return node;
  }
  return null;
}

let leyCrystals = (()=>{ try{ return Math.max(0, parseInt(localStorage.getItem(LEY_STORAGE_KEYS.crystals)||"0",10)||0); }catch(e){ return 0; } })();
let leyTalents = (()=>{ try{ const raw = JSON.parse(localStorage.getItem(LEY_STORAGE_KEYS.talents)||"{}"); return raw && typeof raw === "object" ? raw : {}; }catch(e){ return {}; } })();
let runLeyCrystalsEarned = 0;
let auraRerollUsed = false;

function leyTalentsSpentTotal(talents = leyTalents){
  let spent = 0;
  for(const branch of LEY_TALENT_BRANCHES){
    for(const node of branch.nodes){
      const rank = Math.max(0, Math.min(node.maxRank, parseInt(talents[node.id],10) || 0));
      for(let i=0;i<rank;i++) spent += node.costs[i] || 0;
    }
  }
  return spent;
}

let leyEarnedTotal = (()=>{
  try{
    const stored = localStorage.getItem("sdcLeyEarnedTotal");
    if(stored !== null) return Math.max(0, parseInt(stored,10)||0);
  }catch(e){}
  // migration from balance-only format: lifetime = current balance + everything already spent
  return leyCrystals + leyTalentsSpentTotal();
})();

function saveLeyState(){
  try{
    localStorage.setItem(LEY_STORAGE_KEYS.crystals, String(leyCrystals));
    localStorage.setItem(LEY_STORAGE_KEYS.talents, JSON.stringify(leyTalents));
    localStorage.setItem("sdcLeyEarnedTotal", String(leyEarnedTotal));
  }catch(e){}
}

function getLeyRank(nodeId){
  const def = getLeyNodeDef(nodeId);
  if(!def) return 0;
  const raw = parseInt(leyTalents[nodeId],10) || 0;
  return Math.max(0, Math.min(def.maxRank, raw));
}

/* --- effect helpers (single source of truth for all hooks) --- */
function leyDamageMult(){ return 1 + 0.04 * getLeyRank("radiant_edge"); }
function leyFireRateMult(){ return Math.pow(0.96, getLeyRank("swift_current")); }
function leyRangeMult(){ return 1 + 0.06 * getLeyRank("farsight"); }
function getLeyTileDamageMult(){ return getLeyRank("ley_conduit") > 0 ? 1.18 : 1.10; }
function getLeyTileRangeMult(){ return getLeyRank("ley_conduit") > 0 ? 1.22 : 1.12; }
function leyStartGoldBonus(){ return 40 * getLeyRank("golden_veins"); }
function leyBonusLives(){ return 2 * getLeyRank("warding_light"); }
function getMaxLives(){ return START_LIVES + leyBonusLives(); }
function leyKillGoldMult(){ return 1 + 0.06 * getLeyRank("prosperity"); }
function leyStageHealAmount(){ return getLeyRank("mended_gate") > 0 ? 4 : 2; }
function leySpellCooldownMult(){ return Math.pow(0.90, getLeyRank("attuned_casting")); }
function hasAuraReroll(){ return getLeyRank("second_sight") > 0; }
function leyCrystalGainMult(){ return 1 + 0.20 * getLeyRank("crystal_harvest"); }
function getAuraDraftCount(){ return getLeyRank("luminous_awakening") > 0 ? 4 : 3; }

function awardLeyCrystals(base, label, opts={}){
  const amount = Math.max(1, Math.round(base * leyCrystalGainMult()));
  leyCrystals += amount;
  leyEarnedTotal += amount;
  runLeyCrystalsEarned += amount;
  saveLeyState();
  scheduleLeySyncPush();
  if(!opts.silent) pushNotification("gold","Ley Crystals",`+${amount} ✦ ${label}`);
  updateLeyBadges();
  return amount;
}

/* --- account sync (Neon DB via Netlify functions) ---
   Model: total_earned and talent ranks only ever grow, so merging
   two states is a per-field max(). Balance is derived from them. */
let leyAccountAuthed = false;
let leySyncPushTimer = null;
let leySyncInFlight = false;

function mergeLeyMeta(a, b){
  const talents = {};
  for(const branch of LEY_TALENT_BRANCHES){
    for(const node of branch.nodes){
      const rank = Math.min(node.maxRank, Math.max(
        parseInt(a.talents?.[node.id],10) || 0,
        parseInt(b.talents?.[node.id],10) || 0
      ));
      if(rank > 0) talents[node.id] = rank;
    }
  }
  return {
    totalEarned: Math.max(parseInt(a.totalEarned,10)||0, parseInt(b.totalEarned,10)||0),
    talents
  };
}

function getLocalLeyMeta(){
  return { totalEarned: leyEarnedTotal, talents: { ...leyTalents } };
}

function adoptLeyMeta(meta){
  const merged = mergeLeyMeta(getLocalLeyMeta(), meta || {});
  leyEarnedTotal = merged.totalEarned;
  leyTalents = merged.talents;
  leyCrystals = Math.max(0, leyEarnedTotal - leyTalentsSpentTotal(leyTalents));
  saveLeyState();
  updateLeyBadges();
  if(leyOverlay && !leyOverlay.classList.contains("hidden")) renderLeyOverlay();
}

async function pushLeyMeta(){
  if(!leyAccountAuthed || leySyncInFlight) return;
  leySyncInFlight = true;
  try{
    const response = await fetch("/.netlify/functions/save-ley-meta", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getLocalLeyMeta())
    });
    if(response.ok){
      const data = await response.json();
      if(data?.ok) adoptLeyMeta({ totalEarned: data.totalEarned, talents: data.talents });
    }
  }catch(_){ /* offline is fine — localStorage remains source of truth until next push */ }
  finally{ leySyncInFlight = false; }
}

function scheduleLeySyncPush(delayMs = 2500){
  if(!leyAccountAuthed) return;
  if(leySyncPushTimer) clearTimeout(leySyncPushTimer);
  leySyncPushTimer = setTimeout(()=>{ leySyncPushTimer = null; pushLeyMeta(); }, delayMs);
}

async function syncLeyMetaWithAccount(){
  if(!leyAccountAuthed) return;
  let server = null;
  try{
    const response = await fetch("/.netlify/functions/get-ley-meta", { credentials: "include", cache: "no-store" });
    if(response.ok){
      const data = await response.json();
      if(data?.ok) server = { totalEarned: data.totalEarned, talents: data.talents };
    }
  }catch(_){ return; }
  if(!server) return;
  const localBefore = getLocalLeyMeta();
  adoptLeyMeta(server);
  const serverMissesLocal = localBefore.totalEarned > (server.totalEarned || 0) ||
    LEY_TALENT_BRANCHES.some(branch => branch.nodes.some(node =>
      (parseInt(localBefore.talents[node.id],10)||0) > (parseInt(server.talents?.[node.id],10)||0)
    ));
  if(serverMissesLocal) pushLeyMeta();
}

window.addEventListener("pagehide", ()=>{
  if(!leyAccountAuthed || !navigator.sendBeacon) return;
  try{
    const blob = new Blob([JSON.stringify(getLocalLeyMeta())], { type:"application/json" });
    navigator.sendBeacon("/.netlify/functions/save-ley-meta", blob);
  }catch(_){}
});

function buyLeyTalent(nodeId){
  const def = getLeyNodeDef(nodeId);
  if(!def) return false;
  const rank = getLeyRank(nodeId);
  if(rank >= def.maxRank) return false;
  const cost = def.costs[rank];
  if(leyCrystals < cost){
    setMessage(`Not enough Ley Crystals. ${def.name} needs ✦ ${cost}.`);
    return false;
  }
  leyCrystals -= cost;
  leyTalents[nodeId] = rank + 1;
  saveLeyState();
  scheduleLeySyncPush();
  tone("sine", 620, 940, .12, .02);
  pushNotification("achievement","Ley Attunement",`${def.name} — rank ${rank+1}/${def.maxRank} unlocked.`);
  renderLeyOverlay();
  updateLeyBadges();
  return true;
}

/* --- UI --- */
const leyOverlay = document.getElementById("leyOverlay");
const leyBranchesEl = document.getElementById("leyBranches");
const leyCrystalBalanceEl = document.getElementById("leyCrystalBalance");
const openLeyBtn = document.getElementById("openLeyBtn");
const openLeyFromGameOverBtn = document.getElementById("openLeyFromGameOverBtn");
const closeLeyBtn = document.getElementById("closeLeyBtn");
const leyBtnBalanceEl = document.getElementById("leyBtnBalance");
const leyHudBadge = document.getElementById("leyHudBadge");
const panelHeaderLeyBtn = document.getElementById("panelHeaderLeyBtn");
const panelHeaderLeyBalance = document.getElementById("panelHeaderLeyBalance");
const gameOverCrystalsStat = document.getElementById("gameOverCrystalsStat");
const auraRerollBtn = document.getElementById("auraRerollBtn");
let leyAutoPaused = false;

function hasAffordableLeyTalent(){
  for(const branch of LEY_TALENT_BRANCHES){
    for(const node of branch.nodes){
      const rank = getLeyRank(node.id);
      if(rank < node.maxRank && leyCrystals >= node.costs[rank]) return true;
    }
  }
  return false;
}

function updateLeyBadges(){
  const affordable = hasAffordableLeyTalent();
  if(leyBtnBalanceEl) leyBtnBalanceEl.textContent = `✦ ${leyCrystals}`;
  if(leyCrystalBalanceEl) leyCrystalBalanceEl.textContent = String(leyCrystals);
  if(leyHudBadge){
    leyHudBadge.textContent = `✦ ${leyCrystals}`;
    leyHudBadge.classList.toggle("ley-glow", affordable);
  }
  if(panelHeaderLeyBalance) panelHeaderLeyBalance.textContent = String(leyCrystals);
  panelHeaderLeyBtn?.classList.toggle("ley-glow", affordable);
  openLeyBtn?.classList.toggle("ley-glow", affordable);
}

function renderLeyOverlay(){
  if(!leyBranchesEl) return;
  updateLeyBadges();
  leyBranchesEl.innerHTML = "";
  for(const branch of LEY_TALENT_BRANCHES){
    const branchEl = document.createElement("div");
    branchEl.className = "ley-branch";
    branchEl.style.setProperty("--branch-color", branch.color);
    const nodesHtml = branch.nodes.map(node=>{
      const rank = getLeyRank(node.id);
      const maxed = rank >= node.maxRank;
      const cost = maxed ? null : node.costs[rank];
      const affordable = cost !== null && leyCrystals >= cost;
      const pips = Array.from({length:node.maxRank}, (_,i)=>`<span class="ley-pip${i<rank?" filled":""}"></span>`).join("");
      const buyLabel = maxed
        ? `<span class="ley-buy-label">✓ Maxed</span>`
        : `<span class="ley-buy-label">${rank>0?"Upgrade":"Attune"}</span><span class="ley-buy-cost">✦ ${cost}</span>`;
      return `
        <div class="ley-node${maxed?" ley-node-maxed":""}">
          <div class="ley-node-head">
            <span class="ley-node-name">${node.name}</span>
            <span class="ley-pips">${pips}</span>
          </div>
          <p class="ley-node-desc">${rank>0 ? node.desc(rank) : node.next(0)}</p>
          ${!maxed && rank>0 ? `<p class="ley-node-next">Next: ${node.next(rank)}</p>` : ""}
          <button class="btn ley-buy-btn${maxed?" ley-buy-maxed":affordable?" btn-primary":" ley-buy-locked"}" data-ley-node="${node.id}" ${maxed?"disabled":""}>${buyLabel}</button>
        </div>`;
    }).join("");
    branchEl.innerHTML = `
      <div class="ley-branch-head">
        <span class="ley-branch-icon">${branch.icon}</span>
        <div>
          <div class="ley-branch-name">${branch.name}</div>
          <div class="ley-branch-tagline">${branch.tagline}</div>
        </div>
      </div>
      <div class="ley-branch-nodes">${nodesHtml}</div>`;
    leyBranchesEl.appendChild(branchEl);
  }
  leyBranchesEl.querySelectorAll("[data-ley-node]").forEach(btn=>{
    btn.addEventListener("click",(event)=>{
      event.stopPropagation();
      buyLeyTalent(btn.getAttribute("data-ley-node"));
    });
  });
}

function openLeyOverlay(){
  renderLeyOverlay();
  leyOverlay?.classList.remove("hidden");
  if(hasStarted && lives > 0 && !isPaused){
    isPaused = true;
    leyAutoPaused = true;
    updateUI();
  }
}
function closeLeyOverlay(){
  leyOverlay?.classList.add("hidden");
  if(leyAutoPaused){
    leyAutoPaused = false;
    if(lives > 0) isPaused = false;
    updateUI();
  }
}

openLeyBtn?.addEventListener("click",(event)=>{ event.stopPropagation(); openLeyOverlay(); });
openLeyFromGameOverBtn?.addEventListener("click",(event)=>{ event.stopPropagation(); openLeyOverlay(); });
closeLeyBtn?.addEventListener("click",(event)=>{ event.stopPropagation(); closeLeyOverlay(); });
leyHudBadge?.addEventListener("click",(event)=>{ event.stopPropagation(); openLeyOverlay(); });
panelHeaderLeyBtn?.addEventListener("click",(event)=>{ event.stopPropagation(); openLeyOverlay(); });
leyOverlay?.addEventListener("click",(event)=>{ if(event.target === leyOverlay) closeLeyOverlay(); });
document.addEventListener("keydown",(event)=>{
  if(event.key === "Escape" && leyOverlay && !leyOverlay.classList.contains("hidden")) closeLeyOverlay();
});

function updateAuraRerollButton(){
  if(!auraRerollBtn) return;
  const draftShowsAll = getAuraDraftCount() >= Object.keys(AURA_REWARDS).length;
  const available = hasAuraReroll() && !auraRerollUsed && !draftShowsAll;
  auraRerollBtn.classList.toggle("hidden", !available);
}

auraRerollBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasAuraReroll() || auraRerollUsed || pendingAuraChoice) return;
  auraRerollUsed = true;
  pendingAuraDraft = randomAuraDraft(getAuraDraftCount());
  renderAuraRewardCards();
  updateAuraRerollButton();
  tone("sine", 540, 820, .1, .018);
  setMessage("Second Sight: the ley revealed a new draft.");
});


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

/* ============================================================
   TOWER SYNERGIES — adjacent towers (8-neighborhood) of a
   DIFFERENT type grant a bonus. Each distinct neighbor type
   counts once, so stacking duplicates does nothing.
   ============================================================ */
const SYNERGY_CONFIG = {
  archer: { name:"Volley Drill",   icon:"🏹", color:"#34d399", desc:"+8% attack speed" },
  hunter: { name:"Marked Targets", icon:"🎯", color:"#f59e0b", desc:"+8% damage" },
  mage:   { name:"Arcane Insight", icon:"🔮", color:"#a78bfa", desc:"+6% range" },
  bomb:   { name:"Shrapnel Craft", icon:"💣", color:"#fb7185", desc:"+10% splash radius" }
};
function getUnitSynergies(unit, cOverride, rOverride, typeOverride){
  const c = cOverride ?? unit?.c, r = rOverride ?? unit?.r, myType = typeOverride ?? unit?.type;
  const found = new Set(), partners = [];
  for(const other of units){
    if(unit && other.id === unit.id) continue;
    if(Math.abs(other.c - c) > 1 || Math.abs(other.r - r) > 1) continue;
    if(other.type === myType) continue;
    if(!found.has(other.type)) found.add(other.type);
    partners.push(other);
  }
  return { types: [...found], partners };
}
function applySynergiesToStats(stats, unit){
  const syn = getUnitSynergies(unit);
  for(const t of syn.types){
    if(t === "archer") stats.fireRate *= 0.92;
    else if(t === "hunter") stats.damage *= 1.08;
    else if(t === "mage") stats.range *= 1.06;
    else if(t === "bomb" && stats.splash > 0) stats.splash *= 1.10;
  }
  return stats;
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
  const ley = getLeyStoneAt(unit.c, unit.r);
  if(ley){
    if(ley.kind === "damage") stats.damage *= getLeyTileDamageMult();
    else stats.range *= getLeyTileRangeMult();
  }
  stats.damage *= leyDamageMult();
  stats.range *= leyRangeMult();
  stats.fireRate *= leyFireRateMult();
  applySynergiesToStats(stats, unit);
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
  pendingAuraDraft = randomAuraDraft(getAuraDraftCount());
  pendingAuraChoice = null;
  auraRerollUsed = false;
  renderAuraRewardCards();
  updateAuraRerollButton();
  auraRewardText.textContent = `The boss has been defeated. Choose 1 of ${pendingAuraDraft.length} legendary auras, then apply it to a single tower. That aura stays on the tower in future stages.`;
  const upcomingClearReward = pendingBossResolution?.type === "campaign-next-stage" ? getStageClearGoldReward(Math.max(1, pendingBossResolution.nextStage - 1)) : 0;
  if(auraRewardBonus){
    auraRewardBonus.textContent = upcomingClearReward > 0 ? `Stage clear reward: +${upcomingClearReward} gold` : "";
    auraRewardBonus.style.display = upcomingClearReward > 0 ? "block" : "none";
  }
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
  bossDefeatIntroTimer = 2.7;
  bossDefeatRewardDelayTimer = 3.0;
  bossDefeatIntroText = "AN ANCIENT EVIL FALLS";
  bossDefeatIntroSubtext = "";
  isPaused = true;
  setMessage(currentMode === "campaign" ? "An ancient evil falls." : "The endless horror falters.");
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
    const clearedStage = Math.max(1, resolution.nextStage - 1);
    const clearReward = getStageClearGoldReward(clearedStage);
    awardLeyCrystals(5 * clearedStage, `Stage ${clearedStage} cleared`);
    if(lives < getMaxLives()){
      const healed = Math.min(leyStageHealAmount(), getMaxLives() - lives);
      lives += healed;
      pushNotification("stage","The gate is mended",`+${healed} ${healed === 1 ? "life" : "lives"} restored for the next stage.`);
    }
    wave += 1;
    if(clearReward > 0){
      money += clearReward;
      bonusScore += Math.round(clearReward * 0.5);
      pushNotification("gold","Stage reward",`Stage ${clearedStage} clear reward: +${clearReward} gold.`);
    }
    moveUnitsToReserve();
    applyStage(resolution.nextStage,false);
    pushNotification("stage","Stage Clear",`You reached Stage ${currentStage} — ${STAGES[currentStage].name}. Your towers were moved to reserve.`);
    saveProgress();
    setMessage(`Stage clear! +${clearReward} gold. You reached Stage ${currentStage} — ${STAGES[currentStage].name}.`);
  } else if(resolution.type === "unlock-endless") {
    const clearedStage = currentStage;
    const clearReward = getStageClearGoldReward(clearedStage);
    awardLeyCrystals(5 * clearedStage, "Campaign complete");
    submitStoryLeaderboardScore(currentStage);
    if(clearReward > 0){
      money += clearReward;
      bonusScore += Math.round(clearReward * 0.5);
      pushNotification("gold","Final stage reward",`Stage ${clearedStage} clear reward: +${clearReward} gold.`);
    }
    endlessUnlocked = true;
    try { localStorage.setItem("sdcEndlessUnlocked","1"); } catch(e){}
    pushNotification("stage","Endless Mode unlocked",`You finished the campaign. Endless Mode is now unlocked!`);
    saveProgress();
    setMessage(`You finished the main campaign. +${clearReward} gold. Endless Mode has been unlocked.`);
    showEndlessUnlockOverlay();
    updateUI();
    return;
  } else if(resolution.type === "endless-next") {
    if(lives < getMaxLives()){
      lives += 1;
      pushNotification("stage","The gate holds","+1 life restored after the boss pair.");
    }
    runEndlessBossPairsDefeated += 1;
    stageWave += 1;
    if(currentMode === "campaign") wave += 1;
    money += 50;
    bonusScore += 80;
    maybeSaveBestEndlessRun();
    pushNotification("stage","Endless Boss down",`Keep going! Endless wave ${stageWave} is next. Boss pairs defeated: ${runEndlessBossPairsDefeated}.`);
  }
  isPaused = false;
  armWaveCallBonus();
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
  bonusLeaderboardSubtitle.textContent = "Ranks Endless runs by Bonus Score, not Total Score.";
  try{
    const response = await fetch("/.netlify/functions/get-bonus-leaderboard", { cache: "no-store" });
    if(!response.ok) throw new Error("Leaderboard unavailable");
    const rows = await response.json();
    if(!Array.isArray(rows) || rows.length === 0){
      bonusLeaderboardList.innerHTML = '<div class="leaderboard-empty">No Endless runs submitted yet.</div>';
      bonusLeaderboardSubtitle.textContent = "No runs yet. Ranking uses Bonus Score, not Total Score.";
      return;
    }
    bonusLeaderboardList.innerHTML = rows.slice(0,3).map((row, index) => {
      const safeName = String(row.player_name || "Anonim").replace(/[&<>"]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
      const crest = window.DarkDefenseCrest?.markup(row.player_name || "Anonim", "dd-crest-sm", row.profile_crest_id || null) || "";
      const bonus = Number(row.bonus_score || 0);
      const waveReached = Number(row.wave_reached || 0);
      return `
        <div class="leaderboard-row">
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="leaderboard-main">
            <span class="leaderboard-name">${crest}${safeName}</span>
            <span class="leaderboard-meta">Wave ${waveReached}</span>
          </div>
          <div class="leaderboard-score">+${bonus}</div>
        </div>
      `;
    }).join("");
    const best = rows[0];
    bonusLeaderboardSubtitle.textContent = `Record: ${best.player_name} with Bonus Score +${best.bonus_score}.`;
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
    playerName = await requestLeaderboardName("Story", "Choose the name that will appear for your campaign run.");
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
    playerName = await requestLeaderboardName("Endless Bonus", "Choose the name that will appear for your endless run.");
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
        wave: stageWave,
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

function requestLeaderboardName(modeLabel, helperText){
  if(!leaderboardNameOverlay || !leaderboardNameInput || !leaderboardNameSubmitBtn || !leaderboardNameCancelBtn){
    return Promise.resolve("");
  }

  if(pendingLeaderboardNameRequest){
    pendingLeaderboardNameRequest.resolve("");
    pendingLeaderboardNameRequest = null;
  }

  leaderboardNameTitle.textContent = `${modeLabel} leaderboard`;
  leaderboardNameText.textContent = helperText;

  let initialName = "";
  try{
    initialName = localStorage.getItem("sdcPlayerName") || "";
  }catch(e){}

  leaderboardNameInput.value = initialName.trim().slice(0, 20);
  leaderboardNameOverlay.classList.remove("hidden");

  return new Promise((resolve)=>{
    const cleanup = () => {
      leaderboardNameOverlay.classList.add("hidden");
      leaderboardNameSubmitBtn.removeEventListener("click", handleSubmit);
      leaderboardNameCancelBtn.removeEventListener("click", handleCancel);
      leaderboardNameInput.removeEventListener("keydown", handleKeydown);
      pendingLeaderboardNameRequest = null;
    };

    const finish = (value) => {
      cleanup();
      resolve(value);
    };

    const handleSubmit = () => {
      finish((leaderboardNameInput.value || "").trim().slice(0, 20));
    };

    const handleCancel = () => finish("");

    const handleKeydown = (event) => {
      if(event.key === "Enter"){
        event.preventDefault();
        handleSubmit();
        return;
      }
      if(event.key === "Escape"){
        event.preventDefault();
        handleCancel();
      }
    };

    pendingLeaderboardNameRequest = { resolve: finish };
    leaderboardNameSubmitBtn.addEventListener("click", handleSubmit);
    leaderboardNameCancelBtn.addEventListener("click", handleCancel);
    leaderboardNameInput.addEventListener("keydown", handleKeydown);
    requestAnimationFrame(() => {
      leaderboardNameInput.focus();
      leaderboardNameInput.select();
    });
  });
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
function noiseBurst(duration, volume, filterFreq){
  if(!audioCtx || isMuted) return;
  const n = audioCtx.currentTime;
  const len = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterFreq;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(volume, n);
  g.gain.exponentialRampToValueAtTime(.0001, n + duration);
  src.connect(filter); filter.connect(g); g.connect(audioCtx.destination);
  src.start(n); src.stop(n + duration);
}
function playDeathSound(enemyType = "normal"){
  if(enemyType === "splitter"){
    tone("sine", 320, 130, .1, .02);
    noiseBurst(.09, .03, 2400);
    return;
  }
  const big = enemyType === "tank" || enemyType === "armored";
  tone("sine", big ? 150 : 190, big ? 46 : 60, big ? .17 : .13, big ? .03 : .022);   // low thud
  tone("square", big ? 300 : 380, 110, .06, .008);                                    // crack
  noiseBurst(big ? .14 : .1, big ? .045 : .03, big ? 900 : 1400);                     // crunch
}
function playBossDeathSound(){
  tone("sine", 120, 34, .5, .05);
  tone("sawtooth", 240, 60, .3, .016);
  noiseBurst(.32, .07, 700);
  setTimeout(()=>{ tone("sine", 90, 30, .4, .035); noiseBurst(.2, .04, 500); }, 130);
}
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
function syncBossLoop(){
  if(enemies.some(enemy => enemy.type === "boss")) startBossLoop();
  else stopBossLoop();
}


function isBlockedCell(c, r){
  return (STAGES[currentStage].blocked || []).some(b => b.c === c && b.r === r);
}
function getLeyStoneAt(c, r){
  return (STAGES[currentStage].ley || []).find(l => l.c === c && l.r === r) || null;
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
const enemyCountForWave=(n)=>6+(n-1)*2 + Math.max(0, currentStage-1);

function getWaveThreatProfile(){
  if(isCurrentWaveBoss()){
    const boss = STAGE_BOSS[currentStage];
    const meta = getBossAbilityMeta(currentStage);
    return {
      key: "boss",
      label: currentMode === "endless" ? "Boss Pair" : "Boss Wave",
      detail: currentMode === "endless"
        ? "Two bosses arrive together. Save spells for the engage."
        : `${boss?.name || "Boss"}: ${meta.label} - ${meta.warning}`
    };
  }

  if(stageWave % 5 === 0){
    return {
      key: "armored",
      label: "Armored Push",
      detail: "Heavy armor resists arrows. Bombs and mages perform best."
    };
  }

  if(stageWave % 3 === 0){
    return {
      key: "fast",
      label: "Swift Pack",
      detail: "Fast enemies are leading this wave. Archers and hunters can pick them off."
    };
  }

  return {
    key: "mixed",
    label: "Mixed Assault",
    detail: "Balanced pressure wave. Keep damage and coverage spread out."
  };
}

function getDamageMultiplierAgainstEnemy(enemy, projectileType){
  if(!enemy) return 1;
  if(enemy.type === "armored"){
    if(projectileType === "archer" || projectileType === "hunter") return 0.68;
    if(projectileType === "mage") return 1.18;
    if(projectileType === "bomb") return 1.28;
  }
  return 1;
}

function getTargetPriority(unit, enemy, stats, unitPos, enemyPos){
  if(!unit || !enemy) return -Infinity;

  let score = enemy.progress * 1000;
  const dist = distance(unitPos, enemyPos);
  const rangePct = stats.range > 0 ? dist / stats.range : 1;

  if(enemy.type === "boss") score += 220;

  if(unit.type === "archer"){
    if(enemy.type === "fast") score += 140;
    if(enemy.type === "splitter" && enemy.fragment) score += 95;
    if(enemy.type === "armored") score -= 110;
    score += (1 - rangePct) * 18;
  } else if(unit.type === "hunter"){
    if(enemy.type === "boss") score += 180;
    if(enemy.type === "tank" || enemy.type === "armored") score += 90;
    if(enemy.type === "fast") score += 25;
    score += enemy.maxHp * 0.07;
  } else if(unit.type === "mage"){
    const nearbyCount = enemies.reduce((count, other)=>{
      if(other.id === enemy.id) return count;
      const otherPos = getPathPosition(other.progress);
      return count + (distance(enemyPos, otherPos) <= (stats.splash || 48) ? 1 : 0);
    }, 0);
    if(enemy.type === "armored") score += 90;
    if(enemy.type === "splitter" && !enemy.fragment) score += 70;
    score += nearbyCount * 45;
  } else if(unit.type === "bomb"){
    const clusterScore = enemies.reduce((count, other)=>{
      const otherPos = getPathPosition(other.progress);
      return count + (distance(enemyPos, otherPos) <= (stats.splash || 64) ? 1 : 0);
    }, 0);
    if(enemy.type === "armored" || enemy.type === "tank") score += 110;
    if(enemy.type === "splitter" && !enemy.fragment) score += 80;
    score += clusterScore * 38;
  }

  return score;
}

function updateWaveForecast(){
  if(!waveForecastTag || !waveForecastText) return;
  const profile = getWaveThreatProfile();
  waveForecastTag.textContent = profile.label;
  waveForecastText.textContent = profile.detail;
}
const FEEDBACK_CLASSES = ["feedback-gold", "feedback-invalid", "feedback-cooldown"];
const setMessage=(t)=>{
  messageBox.textContent=t;
  messageBox.classList.remove(...FEEDBACK_CLASSES);
};
const ONBOARDING_STORAGE_KEY = "sdcFirstBattleTutorialV1";
let onboardingStep = 0;

function onboardingCompleted(){
  try{ return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1"; }catch(_){ return false; }
}

function clearOnboardingHighlights(){
  document.querySelectorAll(".onboarding-highlight").forEach(el=>el.classList.remove("onboarding-highlight"));
  canvasWrap?.classList.remove("onboarding-placement-step");
}

function renderOnboarding(){
  if(!onboardingCard || onboardingStep < 1 || onboardingStep > 3) return;
  const steps = {
    1:{ title:"Select Archer", text:"Choose the Archer from the Unit Shop. It is fast, affordable, and ideal for your first defense." },
    2:{ title:"Place near the path", text:"Click an empty tile beside the enemy road. Green placement feedback confirms a valid position." },
    3:{ title:"Start the first wave", text:"Your Archer is ready. Press Start to call Wave 1 and begin the battle." }
  };
  const step = steps[onboardingStep];
  clearOnboardingHighlights();
  onboardingCard.classList.remove("hidden");
  onboardingProgress.textContent = `${onboardingStep} / 3`;
  onboardingTitle.textContent = step.title;
  onboardingText.textContent = step.text;
  onboardingDots.innerHTML = [1,2,3].map(index=>`<i class="${index <= onboardingStep ? "active" : ""}"></i>`).join("");

  if(onboardingStep === 1){
    showUnitInfoPanel();
    Array.from(unitInfoButtons).find(btn=>btn.dataset.type === "archer")?.classList.add("onboarding-highlight");
  } else if(onboardingStep === 2){
    canvasWrap?.classList.add("onboarding-placement-step");
    canvas?.classList.add("onboarding-highlight");
  } else {
    startWaveBtn?.classList.add("onboarding-highlight");
  }
}

function beginOnboarding(){
  if(onboardingCompleted() || units.length > 0 || waveActive) return;
  onboardingStep = 1;
  renderOnboarding();
}

function finishOnboarding(skipped=false){
  if(onboardingStep === 0) return;
  onboardingStep = 0;
  clearOnboardingHighlights();
  onboardingCard?.classList.add("hidden");
  try{ localStorage.setItem(ONBOARDING_STORAGE_KEY, "1"); }catch(_){}
  if(skipped) setMessage("Tutorial skipped. Open the Unit Shop whenever you need another tower.");
  else {
    setMessage("First defense ready! Watch the road and upgrade your Archer when you have enough gold.");
    pushNotification("achievement", "Tutorial complete", "You placed your first tower and started the battle.");
  }
}

function handleOnboardingUnitSelection(type){
  if(onboardingStep !== 1) return;
  if(type !== "archer"){
    setMessage("First battle tutorial: select Archer to continue.");
    showUnitInfoPanel();
    renderOnboarding();
    return;
  }
  onboardingStep = 2;
  renderOnboarding();
}

function handleOnboardingPlacement(){
  if(onboardingStep !== 2) return;
  onboardingStep = 3;
  renderOnboarding();
}

function playActionDeniedSound(type){
  ensureAudio();
  if(type === "gold"){
    tone("square", 210, 125, .11, .018);
    setTimeout(()=>tone("square", 165, 105, .09, .013), 85);
  } else if(type === "invalid"){
    tone("sawtooth", 145, 70, .15, .016);
    noiseBurst(.08, .018, 700);
  } else {
    tone("sine", 430, 310, .08, .012);
    setTimeout(()=>tone("sine", 430, 310, .08, .009), 105);
  }
}

function showActionDenied(type, message, { x=null, y=null, target=null, popupText="" }={}){
  setMessage(message);
  messageBox.classList.remove(...FEEDBACK_CLASSES);
  void messageBox.offsetWidth;
  messageBox.classList.add(`feedback-${type}`);
  if(target){
    target.classList.remove("feedback-denied-pulse");
    void target.offsetWidth;
    target.classList.add("feedback-denied-pulse");
  }
  if(Number.isFinite(x) && Number.isFinite(y)){
    const colors = { gold:"#fbbf24", invalid:"#fb7185", cooldown:"#7dd3fc" };
    showPopup(x, y - 18, popupText || message, colors[type] || "#f8fafc");
  }
  playActionDeniedSound(type);
  vibrate(type === "invalid" ? [35, 25, 35] : 35);
}

function showSpellCooldownFeedback(key, button){
  const names = { slow:"Frost Nova", damage:"Meteor Strike", bomb:"Chain Lightning" };
  const remaining = Math.max(0, spellCooldown[key]);
  showActionDenied("cooldown", `${names[key]} is recharging - ${remaining.toFixed(1)}s remaining.`, {
    target: button
  });
}
function hideHintChip(){ hintChip?.classList.add("hidden-chip"); }
function showHintChip(){ hintChip?.classList.remove("hidden-chip"); }
function updateHintChip(){
  if(!hintChip) return;
  let text = "Click an empty tile to place a tower.";
  if(pendingAuraChoice){
    text = "Choose the tower that will receive the legendary aura.";
  } else if(selectedSpell === "slow"){
    text = "Target Frost Nova at the desired area.";
  } else if(selectedSpell === "damage"){
    text = "Target Meteor Strike on a group of enemies.";
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
  audioToggle.setAttribute("aria-label", isMuted ? "Audio off" : "Audio on");
  audioToggle.title = isMuted ? "Audio off" : "Audio on";
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
    btn.disabled = !hasStarted || lives<=0 || isPaused;
    btn.classList.toggle("on-cooldown", !ready);
    btn.setAttribute("aria-disabled", !ready ? "true" : "false");
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
  spellCooldown.slow = cfg.cooldown * leySpellCooldownMult();
  cancelSpellSelection();
  unlockAchievement("first_spell_cast");
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
  spellCooldown.damage = cfg.cooldown * leySpellCooldownMult();
  cancelSpellSelection();
  unlockAchievement("first_spell_cast");
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
  spellCooldown.bomb = cfg.cooldown * leySpellCooldownMult();
  cancelSpellSelection();
  unlockAchievement("first_spell_cast");
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

function applyStandardUpgradeStats(unit){
  unit.damage *= unit.type === "bomb" ? 1.70 : 1.55;
  unit.range *= 1.10;
  unit.fireRate *= .92;
  if(unit.projectileSpeed) unit.projectileSpeed *= 1.06;
  if(unit.splash) unit.splash *= 1.10;
}

function getStandardUpgradePreview(unit){
  const previewUnit = { ...unit };
  applyStandardUpgradeStats(previewUnit);
  return getAuraAdjustedStats(previewUnit);
}

function upgradeStatValue(current, next, formatter){
  return `<span class="tower-stat-current">${formatter(current)}</span><span class="tower-stat-arrow" aria-hidden="true">&rarr;</span><span class="tower-stat-next">${formatter(next)}</span>`;
}

function showTowerMenu(unit){
  if(!towerMenu || !canvasWrap) return;
  const worldPos = cellCenter(unit.c, unit.r);
  const pos = worldToScreen(worldPos.x, worldPos.y);

  const aura = getAuraData(unit.auraType);
  const specialization = getSpecializationData(unit);
  const stats = getAuraAdjustedStats(unit);
  const choosingSpecialization = canChooseSpecialization(unit);
  const nextStats = choosingSpecialization ? null : getStandardUpgradePreview(unit);
  towerMenuName.textContent = unit.name;
  towerMenuLevel.textContent = `Lv.${unit.level}${aura ? ` · ${aura.icon} ${aura.name}` : ""}${specialization ? ` · ${specialization.name}` : ""}`;
  if(towerMenuAura){
    towerMenuAura.textContent = specialization ? specialization.name : (aura ? aura.name : "Standard");
    towerMenuAura.style.color = specialization ? "#c4b5fd" : (aura ? (aura.color || "#7dd3fc") : "#7dd3fc");
    towerMenuAura.style.borderColor = specialization ? "rgba(196,181,253,.28)" : (aura ? `${aura.color}44` : "rgba(56,189,248,.18)");
    towerMenuAura.style.background = specialization ? "rgba(139,92,246,.16)" : (aura ? `${aura.color}22` : "rgba(56,189,248,.12)");
  }
  const nextCost = choosingSpecialization ? getSpecializationCost(unit) : Math.round(unit.nextUpgradeCost);
  const nextLabel = choosingSpecialization ? "Spec cost" : "Upgrade cost";
  const specRow = specialization ? `<div class="tower-stat-row"><span>Spec</span><strong>${specialization.name}</strong></div>` : "";
  const damageValue = nextStats ? upgradeStatValue(stats.damage, nextStats.damage, value => Math.round(value)) : Math.round(stats.damage);
  const rangeValue = nextStats ? upgradeStatValue(stats.range, nextStats.range, value => Math.round(value)) : Math.round(stats.range);
  const speedValue = nextStats ? upgradeStatValue(stats.fireRate, nextStats.fireRate, value => `${value.toFixed(2)}s`) : `${stats.fireRate.toFixed(2)}s`;
  towerMenuStats.innerHTML = `
    <div class="tower-stat-row"><span>Damage</span><strong>${damageValue}</strong></div>
    <div class="tower-stat-row"><span>Range</span><strong>${rangeValue}</strong></div>
    <div class="tower-stat-row"><span>Attack delay</span><strong>${speedValue}</strong></div>
    ${specRow}
    <div class="tower-stat-row"><span>${nextLabel}</span><strong>${nextCost}</strong></div>
    <div class="tower-stat-row"><span>Sell</span><strong>${Math.round(unit.totalSpent * unit.sellFactor)}</strong></div>
  `;
  if(towerSpecializationPanel) towerSpecializationPanel.classList.add("hidden");
  towerUpgradeBtn.textContent = canChooseSpecialization(unit) ? "✨ Specialize" : "⬆ Upgrade";
  const cannotAffordNext = money < nextCost;
  towerUpgradeBtn.disabled = false;
  towerUpgradeBtn.classList.toggle("is-unaffordable", cannotAffordNext);
  towerUpgradeBtn.setAttribute("aria-disabled", cannotAffordNext ? "true" : "false");

  if(towerSpecializationPanel){
    if(canChooseSpecialization(unit)) {
      const cost = getSpecializationCost(unit);
      towerSpecializationPanel.innerHTML = getSpecializationChoices(unit).map(choice => {
        const theme = getSpecializationTheme(choice.id);
        return `
        <button class="tower-spec-btn${money < cost ? ' is-unaffordable' : ''}" data-spec-id="${choice.id}" type="button" aria-disabled="${money < cost ? 'true' : 'false'}" style="--spec-fill:${theme.panel}; --spec-border:${theme.panelBorder}; --spec-accent:${theme.stroke}; --spec-icon:${theme.icon}; --spec-medallion:${theme.fill}; --spec-glow:${theme.glow};">
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

function getBossPairKey(pair){
  return [...pair].sort((a,b)=>a-b).join("-");
}

function pickRandomEndlessBossPair(){
  const ids = Object.keys(STAGE_BOSS).map(Number);
  const allPairs = [];
  for(let i = 0; i < ids.length; i++){
    for(let j = i + 1; j < ids.length; j++){
      allPairs.push([ids[i], ids[j]]);
    }
  }
  for(let i = allPairs.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
  }
  const preferred = allPairs.find(pair => getBossPairKey(pair) !== lastEndlessBossPairKey);
  const selected = preferred || allPairs[0] || ids.slice(0,2);
  lastEndlessBossPairKey = getBossPairKey(selected);
  return [...selected].sort(()=>Math.random()-0.5);
}

function syncEndlessUnlockArtworkBounds(){
  if(!endlessUnlockArtwork || !endlessUnlockArtworkImage) return;
  const rect = endlessUnlockArtworkImage.getBoundingClientRect();
  endlessUnlockArtwork.style.width = `${Math.round(rect.width)}px`;
  endlessUnlockArtwork.style.height = `${Math.round(rect.height)}px`;
}

function showEndlessUnlockOverlay(){
  if(endlessUnlockText){
    endlessUnlockText.textContent = ENDLESS_UNLOCK_QUOTES[Math.floor(Math.random() * ENDLESS_UNLOCK_QUOTES.length)];
    endlessUnlockText.classList.remove("quote-fade-in");
    void endlessUnlockText.offsetWidth;
    endlessUnlockText.classList.add("quote-fade-in");
  }
  endlessUnlockOverlay?.classList.remove("hidden");
  requestAnimationFrame(syncEndlessUnlockArtworkBounds);
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
  lastEndlessBossPairKey = "";
  runEndlessBossPairsDefeated = 0;
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
  return { id:idCounter++, c,r, type:typeKey, cooldown:0, aimAngle:-0.3, level:1, totalSpent:base.cost, nextUpgradeCost:base.upgradeCost, wealthKills:0, wealthSurgeTimer:0, snaredUntil:0, specialization:null, specSlowFactor:1, specSlowDuration:0, specChainTargets:0, specChainDamageFactor:0, specBonusVsFast:1, specStunChance:0, specStunDuration:0, ...structuredClone(base) };
}
function createFreshUnitForPlacement(typeKey,c,r){
  const unit=createPlacedUnit(c,r,typeKey);
  unit.id=idCounter++; unit.c=c; unit.r=r; unit.cooldown=0; unit.aimAngle=-0.3; unit.snaredUntil=0; unit.level=1; unit.totalSpent=UNIT_TYPES[typeKey].cost; unit.nextUpgradeCost=UNIT_TYPES[typeKey].upgradeCost; unit.snaredUntil=0; unit.specialization=null; unit.specSlowFactor=1; unit.specSlowDuration=0; unit.specChainTargets=0; unit.specChainDamageFactor=0; unit.specBonusVsFast=1; unit.specStunChance=0; unit.specStunDuration=0;
  return unit;
}
function takeReservedUnit(typeKey,c,r){
  if(!reservePool[typeKey] || reservePool[typeKey].length===0) return null;
  reservePool[typeKey].sort((a,b)=>{
    const levelDiff = (b.level || 1) - (a.level || 1);
    if(levelDiff !== 0) return levelDiff;
    const spentDiff = (b.totalSpent || 0) - (a.totalSpent || 0);
    if(spentDiff !== 0) return spentDiff;
    return (b.nextUpgradeCost || 0) - (a.nextUpgradeCost || 0);
  });
  const unit=reservePool[typeKey].shift();
  unit.id=idCounter++; unit.c=c; unit.r=r; unit.cooldown=0; unit.aimAngle=-0.3; unit.snaredUntil=0;
  return unit;
}

function showPopup(x,y,text,color="#fde68a"){ popups.push({x,y,text,color,life:.8,maxLife:.8}); }
function showNotificationToast(type, title, text){
  if(!canvasWrap) return;
  const toast = document.createElement("div");
  toast.className = `notification-toast ${type}`;
  const titleEl = document.createElement("div");
  titleEl.className = "notification-title";
  titleEl.textContent = title;
  const metaEl = document.createElement("div");
  metaEl.className = "notification-meta";
  metaEl.textContent = text;
  toast.appendChild(titleEl);
  toast.appendChild(metaEl);
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

function getSavedEndlessWave(){
  return Number(localStorage.getItem("sdcBestEndlessWave") || 0);
}

function getSavedEndlessBossPairs(){
  return Number(localStorage.getItem("sdcBestEndlessBossPairs") || 0);
}

function syncBestEndlessStats(){
  try{
    bestEndlessWave = getSavedEndlessWave();
    bestEndlessBossPairs = getSavedEndlessBossPairs();
  }catch(e){
    bestEndlessWave = 0;
    bestEndlessBossPairs = 0;
  }
}

function maybeSaveBestEndlessRun(){
  if(currentMode !== "endless") return;
  try{
    const nextBestWave = Math.max(stageWave, getSavedEndlessWave());
    const nextBestPairs = Math.max(runEndlessBossPairsDefeated, getSavedEndlessBossPairs());
    localStorage.setItem("sdcBestEndlessWave", String(nextBestWave));
    localStorage.setItem("sdcBestEndlessBossPairs", String(nextBestPairs));
    bestEndlessWave = nextBestWave;
    bestEndlessBossPairs = nextBestPairs;
  }catch(e){}
}

function saveProgress(){
  try{
    const best=Math.max(totalScore(), Number(localStorage.getItem("sdcBestScore")||0));
    const furthest=Math.max(currentStage, Number(localStorage.getItem("sdcFurthestStage")||1));
    localStorage.setItem("sdcBestScore", String(best));
    localStorage.setItem("sdcFurthestStage", String(furthest));
    localStorage.setItem("sdcEndlessUnlocked", endlessUnlocked ? "1" : localStorage.getItem("sdcEndlessUnlocked") || "0");
    syncBestEndlessStats();
  }catch(e){}
}
function loadProgressNotice(){
  try{
    const best=Number(localStorage.getItem("sdcBestScore")||0);
    const furthest=Number(localStorage.getItem("sdcFurthestStage")||1);
    endlessUnlocked = localStorage.getItem("sdcEndlessUnlocked")==="1";
    syncBestEndlessStats();
    if(best>0 || furthest>1 || endlessUnlocked || bestEndlessWave>0){
      pushNotification("stage","Progress loaded",`Best score: ${best} · Furthest stage: ${furthest}${endlessUnlocked ? " · Endless unlocked" : ""}${bestEndlessWave>0 ? ` · Best endless wave: ${bestEndlessWave}` : ""}`);
    }
  }catch(e){}
}

function unlockAchievement(key){
  if(achievements[key]) return;
  achievements[key]=true;
  const config = ACHIEVEMENT_CONFIG[key] || { title:"Achievement", goldReward:0 };
  showPopup(canvas.width/2,40,"Achievement unlocked!","#bbf7d0");
  pushNotification("achievement",`🏆 ${config.title || "Achievement"}`,"New achievement unlocked.");
  if(config.goldReward > 0 && !isAchievementRewardClaimed(key)){
    money += config.goldReward;
    markAchievementRewardClaimed(key);
    showPopup(canvas.width/2, 68, `+${config.goldReward} gold`, "#facc15");
    pushNotification("gold", "Achievement reward", `${config.title || "Achievement"} granted +${config.goldReward} gold.`);
    updateUI();
  }
}
function checkAchievements(){
  if(kills>=1) unlockAchievement("first_kill");
  if(units.length>=5) unlockAchievement("builder");
  if(money>=500) unlockAchievement("rich");
  if(wave>=10) unlockAchievement("wave_master");
  if(currentMode === "endless" && stageWave >= 20) unlockAchievement("endless_wave_20");
  if(currentMode === "endless" && stageWave >= 30) unlockAchievement("endless_wave_30");
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
  if(currentMode === "endless") maybeSaveBestEndlessRun();
  if(gameOverStageLabel) gameOverStageLabel.textContent = currentMode === "campaign" ? "Stage" : "Mode";
  if(gameOverStageStat) gameOverStageStat.textContent = currentMode === "campaign" ? String(currentStage) : "Endless";
  if(gameOverWaveStat) gameOverWaveStat.textContent = String(currentMode === "campaign" ? wave : stageWave);
  if(gameOverKillsStat) gameOverKillsStat.textContent = String(kills);
  if(gameOverScoreStat) gameOverScoreStat.textContent = String(totalScore());
  if(gameOverComboStat){
    const record = getBestComboRecord();
    gameOverComboStat.textContent = comboBest > 0 && comboBest >= record && comboBest >= 10
      ? `x${comboBest} ★` : `x${comboBest}`;
  }
  if(gameOverCrystalsStat) gameOverCrystalsStat.textContent = `+${runLeyCrystalsEarned} ✦`;
  updateLeyBadges();
  scheduleLeySyncPush(300);
  const spent = getRunSpentGold();
  if(currentMode === "endless") {
    gameOverText.textContent = `You survived ${stageWave} Endless Waves. Boss pairs defeated: ${runEndlessBossPairsDefeated}. Best Endless Wave: ${bestEndlessWave}.`;
    if(gameOverQuote) gameOverQuote.textContent = `The abyss marked ${runEndlessBossPairsDefeated} boss waves this run. Best boss-pair record: ${bestEndlessBossPairs}.`;
  } else {
    gameOverText.textContent = `You reached Stage ${currentStage}. Kills: ${kills} · Gold spent: ${spent} · Score: ${totalScore()}.`;
    if(gameOverQuote) gameOverQuote.textContent = GAME_OVER_QUOTES[Math.floor(Math.random() * GAME_OVER_QUOTES.length)];
  }
  gameOverOverlay.classList.remove("hidden");
}

function updateUI(){
  moneyBadge.textContent = `💰 ${money}`;
  livesBadge.textContent = `❤️ ${lives}`;
  waveBadge.textContent = currentMode==="campaign" ? `🌊 Wave ${wave}` : `♾️ Endless Wave ${stageWave}`;
  stageBadge.textContent = currentMode==="campaign" ? `🗺️ Stage ${currentStage} · ${STAGES[currentStage].name}` : `🗺️ Endless Mode · ${STAGES[currentStage].name}`;
  moneyBadge.textContent=`💰 ${money}`;
  livesBadge.textContent=`❤️ ${lives}`;
  waveBadge.textContent=currentMode==="campaign" ? `🌊 Wave ${wave}` : `♾️ Endless Wave ${stageWave}`;
  stageBadge.textContent=currentMode==="campaign" ? `🗺️ Stage ${currentStage} · ${STAGES[currentStage].name}` : `🕳️ Endless Mode · ${STAGES[currentStage].name}`;
  moneyBadge.textContent = `💰 ${money}`;
  livesBadge.textContent = `❤️ ${lives}`;
  waveBadge.textContent = currentMode==="campaign" ? `🌊 Wave ${wave}` : `♾️ Endless Wave ${stageWave}`;
  stageBadge.textContent = currentMode==="campaign" ? `🗺️ Stage ${currentStage} · ${STAGES[currentStage].name}` : `🗺️ Endless Mode · ${STAGES[currentStage].name}`;
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
  bossInfoStat.textContent=currentMode==="campaign" ? String(STAGES[currentStage].bossWave) : "Dual every 10";
  scoreStat.textContent=String(totalScore());
  bonusScoreStat.textContent=String(bonusScore);
  stageNumberStat.textContent=String(currentStage);
  stageWaveStat.textContent=String(stageWave);
  modeStat.textContent=currentMode==="campaign" ? "Story" : "Endless Run";
  bestScoreStat.textContent=String(Number(localStorage.getItem("sdcBestScore")||0));
  furthestStageStat.textContent=String(Number(localStorage.getItem("sdcFurthestStage")||1));
  endlessUnlockedStat.textContent=endlessUnlocked ? "Yes" : "No";

  startWaveBtn.disabled=waveActive || lives<=0 || isPaused;
  if(pauseBtn){
    pauseBtn.innerHTML = isPaused
      ? '<span class="resume-icon">▶</span><span class="btn-label">Resume</span>'
      : '<span class="pause-icon-wrap" aria-hidden="true"></span><span class="btn-label">Pause</span>';
  }

  if(pauseBtn && isPaused){
    pauseBtn.innerHTML = '<span class="resume-icon">Play</span><span class="btn-label">Resume</span>';
  }
  updateWaveForecast();
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

  units=[]; enemies=[]; projectiles=[]; particles=[]; popups=[]; placementEffects=[]; upgradeEffects=[]; impactBursts=[]; screenFlashes=[];
  comboCount = 0; comboTimer = 0; comboPop = 0; comboBest = 0;
  selectedPlacedUnitId=null; hoveredCell=null; hideTowerMenu();
  waveActive=false; spawnLeft=0; spawnTimer=0; bossBannerTimer=0; bossFxTimer=0; bossFxType=""; bossTelegraphTimer=0; bossTelegraphType=""; bossTelegraphStage=null; bossCastTimer=0; bossCastText=""; bossCastColor="#f8fafc"; waveIntroTimer=0; waveIntroText=""; waveIntroSubtext=""; bossDefeatIntroTimer=0; bossDefeatRewardDelayTimer=0; bossDefeatIntroText=""; bossDefeatIntroSubtext=""; stageQuoteTimer=0; stageQuoteText=""; stageQuoteSubtext=""; stageQuoteResolveTimer=0; auraBindFxTimer=0; auraBindFxUnitId=null; isPaused=false; stageWave=1; waveCallBonus=0; waveCallBonusMax=0;
  pendingAuraDraft = null; pendingAuraChoice = null; pendingBossResolution = null; pendingEndlessBossPair = []; lastEndlessBossPairKey = ""; hideAuraRewardOverlay(); hideEndlessUnlockOverlay();
  stopBossLoop();
  syncAmbientAudio();
  cancelSpellSelection();
  spellCooldown.slow = 0;
  spellCooldown.damage = 0;
  spellCooldown.bomb = 0;

  if(resetRun){
    reservePool={ archer:[], hunter:[], mage:[], bomb:[] };
    money=START_MONEY + leyStartGoldBonus() + (stageNumber-1)*60;
    lives=getMaxLives(); score=0; bonusScore=0; kills=0; wave=1;
    runLeyCrystalsEarned = 0;
    runEndlessBossPairsDefeated = 0;
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
  const threatProfile = getWaveThreatProfile();
  if(currentMode === "endless" && isCurrentWaveBoss()) pendingEndlessBossPair = pickRandomEndlessBossPair();
  if(waveCallBonus >= 1){
    const callGold = Math.floor(waveCallBonus);
    money += callGold;
    bonusScore += Math.round(callGold * 0.5);
    showPopup(canvas.width / 2 / view.scale - view.offsetX / view.scale, 150 / view.scale - view.offsetY / view.scale, `Early call +${callGold}g`, "#5eead4");
    pushNotification("gold","Early call",`Wave called early: +${callGold} gold.`);
  }
  waveCallBonus = 0;
  spawnLeft=getWaveEnemyTotal();
  spawnTimer=0; waveActive=true;
  if(onboardingStep === 3) finishOnboarding(false);
  if(isCurrentWaveBoss()){
    bossBannerTimer = currentMode === "endless" ? 5.2 : 4.6;
    playBossWaveWarning();
  }
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
    waveIntroSubtext = `${threatProfile.label} - Stage ${currentStage} ${stage.name}`;
    waveIntroSubtext = `Stage ${currentStage} · ${stage.name}`;
  }
  if(isCurrentWaveBoss()){
    const bossStages = currentMode === "endless" ? pendingEndlessBossPair : [currentStage];
    const mechanics = bossStages.map(stageNumber => {
      const boss = STAGE_BOSS[stageNumber];
      const meta = getBossAbilityMeta(stageNumber);
      return `${boss?.name || "Boss"}: ${meta.label} - ${meta.warning}`;
    });
    const bossMessage = mechanics.join(" | ");
    setMessage(`Boss wave! ${bossMessage}`);
    pushNotification("stage", currentMode === "endless" ? "Boss Pair" : "Boss Wave", bossMessage);
  } else {
    waveIntroSubtext = `${threatProfile.label} - Stage ${currentStage} ${stage.name}`;
    pushNotification("stage", threatProfile.label, threatProfile.detail);
    setMessage(`Wave ${stageWave} started. ${threatProfile.detail}`);
  }
  updateUI();
}
function togglePause(){
  if(!hasStarted || lives<=0 || pendingAuraChoice || pendingBossResolution) return;
  isPaused=!isPaused;
  if(isPaused) cancelSpellSelection();
  setMessage(isPaused?"Game paused. Spells are disabled while paused.":"Game resumed.");
  updateUI();
}

function getBossHpBonus(stageNumber){
  if(stageNumber >= 1 && stageNumber <= 2) return 1.10;
  if(stageNumber >= 3 && stageNumber <= 4) return 1.20;
  if(stageNumber >= 5 && stageNumber <= 6) return 1.30;
  return 1.0;
}

function enemyTemplateForSpawn(indexFromEnd){
  const stage=STAGES[currentStage];
  if(currentMode === "endless" && isCurrentWaveBoss() && indexFromEnd <= pendingEndlessBossPair.length){
    const bossStage = pendingEndlessBossPair[pendingEndlessBossPair.length - indexFromEnd];
    const cycle = getEndlessCycle();
    const scale = 1 + (cycle - 1) * 0.5;
    return {type:"boss", hpMult:4.0 * STAGES[bossStage].difficulty * scale * getBossHpBonus(bossStage), speed:.05 + bossStage * .003 + (cycle - 1) * .005, reward:140 + (cycle - 1) * 30, bossStage, bossColor: STAGE_BOSS[bossStage].color, bossName: STAGE_BOSS[bossStage].name};
  }
  const boss=isCurrentWaveBoss() && indexFromEnd===1;
  if(boss) return {type:"boss",hpMult:4.0*stage.difficulty*getBossHpBonus(currentStage),speed:.05+currentStage*.003,reward:125, bossStage: currentStage, bossColor: STAGE_BOSS[currentStage].color, bossName: STAGE_BOSS[currentStage].name};
  if(stageWave % 5 === 0){
    const armoredWindow = enemyCountForWave(stageWave);
    if(indexFromEnd <= Math.max(3, Math.ceil(armoredWindow * (currentStage >= 4 ? 0.55 : 0.4)))){
      return {type:"armored", hpMult:1.55*stage.difficulty, speed:.082+currentStage*.0025, reward:26};
    }
  }
  const roll=Math.random();
  if(roll < 0.18 + currentStage*0.01){
    const isLateStageFast = currentStage >= 5;
    const difficultyWave = getDifficultyWaveNumber();
    const lateStageFastSpeed = currentStage === 6
      ? Math.min(0.185, 0.10856 + difficultyWave * 0.002024)
      : (.135 + difficultyWave * .0035);
    return {
      type:"fast",
      hpMult:(isLateStageFast ? .52 : .75) * stage.difficulty,
      speed:isLateStageFast ? lateStageFastSpeed : (.15 + difficultyWave*.004),
      reward:isLateStageFast ? 18 : 16
    };
  }
  if(roll < 0.40 + currentStage*0.02) return {type:"tank",hpMult:2.0*stage.difficulty,speed:.07+currentStage*.002,reward:28};
  if(currentStage >= 3 && roll < 0.52 + currentStage*0.02){
    return {type:"splitter", hpMult:1.3*stage.difficulty, speed:.075+currentStage*.002, reward:18};
  }
  return {type:"normal",hpMult:1.0*stage.difficulty,speed:.09+getDifficultyWaveNumber()*.004+currentStage*.002,reward:20};
}
function spawnEnemy(){
  const t=enemyTemplateForSpawn(spawnLeft), hpBase=44+Math.max(wave, stageWave)*13+currentStage*9;
  const enemy = { id:idCounter++, hp:hpBase*t.hpMult, maxHp:hpBase*t.hpMult, speed:t.speed, progress:0, wobble:Math.random()*Math.PI*2, type:t.type, reward:t.reward, abilityUsed:false, bossTelegraphShown:false, bossStage: t.bossStage || null, bossColor: t.bossColor || null, bossName: t.type==="boss" ? (t.bossName || STAGE_BOSS[currentStage].name) : null };
  enemies.push(enemy);
  if(enemy.type==="boss") startBossLoop();
}

function placeUnit(c,r){
  if(lives<=0) return;
  const key=`${c}-${r}`;
  const deniedPos = cellCenter(c, r);
  if(pathCells.has(key)){
    showActionDenied("invalid", "Invalid placement - towers cannot be built on the enemy path.", { ...deniedPos, popupText:"Path blocked" });
    return;
  }
  if(isBlockedCell(c, r)){
    showActionDenied("invalid", "Invalid placement - this terrain cannot support a tower.", { ...deniedPos, popupText:"Terrain blocked" });
    return;
  }

  const existing=units.find(t=>t.c===c && t.r===r);
  if(existing){ selectedPlacedUnitId=existing.id; setPlacementHudAutoHide(false); setMessage(`You selected ${existing.name}.`); updateUI(); return; }

  const type=UNIT_TYPES[selectedUnitType];
  let unit=null, usedReserve=false;

  if(reserveCount(selectedUnitType)>0){
    unit=takeReservedUnit(selectedUnitType,c,r);
    usedReserve=!!unit;
  }
  if(!unit){
    if(money < type.cost){
      showActionDenied("gold", `Not enough gold - ${type.name} costs ${type.cost}g and you have ${money}g.`, { ...deniedPos, popupText:`Need ${type.cost - money}g` });
      return;
    }
    money -= type.cost;
    unit = createFreshUnitForPlacement(selectedUnitType,c,r);
  }

  units.push(unit);
  handleOnboardingPlacement();
  selectedPlacedUnitId=null;
  hideTowerMenu();
  setPlacementHudAutoHide(false);
  const fxPos = cellCenter(c, r);
  addPlacementEffect(fxPos.x, fxPos.y, type.color || "#7dd3fc");
  const placedLey = getLeyStoneAt(c, r);
  if(placedLey){
    showPopup(fxPos.x, fxPos.y - 44, "Ley empowered!", placedLey.kind === "damage" ? "#fbbf24" : "#c4b5fd");
    tone("sine", 480, 720, .16, .018);
  }
  const placedSyn = getUnitSynergies(unit);
  if(placedSyn.types.length){
    const names = placedSyn.types.map(t => SYNERGY_CONFIG[t]?.name).filter(Boolean).join(", ");
    showPopup(fxPos.x, fxPos.y - 30, "Synergy!", "#5eead4");
    tone("sine", 620, 940, .12, .016);
    setMessage(`${type.name} placed. Synergies: ${names}.`);
  } else {
    setMessage(usedReserve ? `${type.name} re-placed from reserve.` : `${type.name} purchased and placed.`);
  }
  updateUI();
}

function applySpecializationToSelectedUnit(specId){
  const unit=getUnitById(selectedPlacedUnitId); if(!unit || !canChooseSpecialization(unit)) return;
  const choice = TOWER_SPECIALIZATIONS[unit.type]?.[specId];
  if(!choice) return;
  const cost = getSpecializationCost(unit);
  if(money < cost){
    const pos = cellCenter(unit.c, unit.r);
    showActionDenied("gold", `Not enough gold - this specialization costs ${cost}g and you have ${money}g.`, { ...pos, popupText:`Need ${cost - money}g` });
    return;
  }
  money -= cost; unit.totalSpent += cost; unit.level += 1; unit.specialization = specId;
  choice.apply(unit);
  unit.nextUpgradeCost = Math.round(cost * 1.65);
  const fxPos = cellCenter(unit.c, unit.r);
  addUpgradeEffect(fxPos.x, fxPos.y, unit.color || "#7dd3fc");
  playUpgradeSound();
  unlockAchievement("first_tower_upgrade");
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
  if(money<unit.nextUpgradeCost){
    const pos = cellCenter(unit.c, unit.r);
    showActionDenied("gold", `Not enough gold - this upgrade costs ${unit.nextUpgradeCost}g and you have ${money}g.`, { ...pos, popupText:`Need ${unit.nextUpgradeCost - money}g` });
    return;
  }
  money-=unit.nextUpgradeCost; unit.totalSpent+=unit.nextUpgradeCost; unit.level+=1;
  applyStandardUpgradeStats(unit);
  unit.nextUpgradeCost=Math.round(unit.nextUpgradeCost*1.65);
  const fxPos = cellCenter(unit.c, unit.r);
  addUpgradeEffect(fxPos.x, fxPos.y, unit.color || "#7dd3fc");
  playUpgradeSound();
  unlockAchievement("first_tower_upgrade");
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

function addHitParticles(x,y,amount,color,options={}){
  const {
    speed = 90,
    speedY = speed,
    lifeMin = .35,
    lifeMax = .6,
    sizeMin = 1.8,
    sizeMax = 3.6,
    glow = 0,
    shape = "circle",
    gravity = 0,
    drift = 1
  } = options;
  for(let i=0;i<amount;i++){
    particles.push({
      x,
      y,
      vx:(Math.random()-.5)*speed*drift,
      vy:(Math.random()-.5)*speedY - gravity * 0.02,
      life:lifeMin + Math.random() * Math.max(0.01, lifeMax - lifeMin),
      maxLife:lifeMax,
      color,
      size:sizeMin + Math.random() * Math.max(0.1, sizeMax - sizeMin),
      glow,
      shape,
      gravity
    });
  }
}

function addImpactBurst(x,y,options={}){
  impactBursts.push({
    x,
    y,
    radius: options.radius ?? 24,
    innerRadius: options.innerRadius ?? 8,
    lineWidth: options.lineWidth ?? 3,
    color: options.color ?? "#f8fafc",
    fillColor: options.fillColor ?? options.color ?? "#f8fafc",
    fillAlpha: options.fillAlpha ?? 0.12,
    strokeAlpha: options.strokeAlpha ?? 0.75,
    life: options.life ?? 0.42,
    maxLife: options.life ?? 0.42
  });
}

function addScreenFlash(color, life=.24, alpha=.14){
  screenFlashes.push({ color, life, maxLife: life, alpha });
}

/* --- screenshake (world-space only, HUD stays still) --- */
let shakeTimer = 0, shakeDuration = 0.001, shakeMag = 0;
function addScreenShake(mag, dur){
  shakeMag = Math.max(shakeMag, mag);
  shakeDuration = Math.max(shakeDuration, dur);
  shakeTimer = Math.max(shakeTimer, dur);
}
function getShakeOffset(){
  if(shakeTimer <= 0) return { x: 0, y: 0 };
  const falloff = shakeTimer / shakeDuration;
  const amp = shakeMag * falloff * falloff;
  const t = performance.now() * 0.055;
  return {
    x: Math.sin(t * 1.9) * amp + (Math.random() - .5) * amp * 0.7,
    y: Math.cos(t * 2.3) * amp + (Math.random() - .5) * amp * 0.7
  };
}

/* --- enemy death burst: palette-matched gibs with gravity + shock ring --- */
function addDeathBurst(enemy, pos){
  const pal = enemyPalette(enemy.type, enemy);
  const isBig = enemy.type === "boss" || enemy.type === "tank";
  const gibCount = enemy.type === "boss" ? 26 : enemy.type === "tank" ? 16 : enemy.type === "armored" ? 13 : 10;
  addHitParticles(pos.x, pos.y, gibCount, pal.skin, {
    speed: isBig ? 230 : 170,
    speedY: isBig ? 210 : 160,
    lifeMin: .3, lifeMax: isBig ? .7 : .55,
    sizeMin: 2, sizeMax: isBig ? 5 : 3.8,
    gravity: 340, shape: "diamond"
  });
  addHitParticles(pos.x, pos.y, Math.ceil(gibCount * 0.5), pal.skinD, {
    speed: 140, speedY: 130,
    lifeMin: .26, lifeMax: .5,
    sizeMin: 1.6, sizeMax: 3,
    gravity: 300
  });
  addHitParticles(pos.x, pos.y - 4, enemy.type === "boss" ? 8 : 4, pal.accent, {
    speed: 120, speedY: 110,
    lifeMin: .2, lifeMax: .4,
    sizeMin: 1.4, sizeMax: 2.6,
    glow: 8
  });
  addImpactBurst(pos.x, pos.y, {
    radius: enemy.type === "boss" ? 40 : isBig ? 26 : 20,
    innerRadius: 6,
    color: pal.accent,
    fillAlpha: 0.08,
    strokeAlpha: 0.6,
    life: enemy.type === "boss" ? 0.45 : 0.3
  });
}

function addArmorDeflectEffect(x,y){
  addImpactBurst(x, y, {
    radius: 18,
    innerRadius: 5,
    lineWidth: 2.8,
    color: "#cbd5e1",
    fillColor: "#94a3b8",
    fillAlpha: 0.10,
    strokeAlpha: 0.80,
    life: 0.26
  });
  addHitParticles(x, y, 8, "#e2e8f0", {
    speed: 150,
    speedY: 120,
    lifeMin: .16,
    lifeMax: .34,
    sizeMin: 1.4,
    sizeMax: 3.1,
    glow: 6,
    shape: "diamond"
  });
}

function addMageImpactEffect(x,y,radius=52){
  addImpactBurst(x, y, {
    radius: Math.max(24, radius * 0.58),
    innerRadius: 10,
    lineWidth: 3.4,
    color: "#c4b5fd",
    fillColor: "#8b5cf6",
    fillAlpha: 0.14,
    strokeAlpha: 0.82,
    life: 0.38
  });
  addHitParticles(x, y, 16, "#ddd6fe", {
    speed: 165,
    speedY: 150,
    lifeMin: .18,
    lifeMax: .42,
    sizeMin: 1.6,
    sizeMax: 3.8,
    glow: 10
  });
  addHitParticles(x, y, 8, "#f0abfc", {
    speed: 120,
    speedY: 120,
    lifeMin: .22,
    lifeMax: .48,
    sizeMin: 1.2,
    sizeMax: 2.6,
    glow: 8,
    shape: "diamond"
  });
}

function addBombImpactEffect(x,y,radius=68){
  addImpactBurst(x, y, {
    radius: Math.max(34, radius * 0.72),
    innerRadius: 12,
    lineWidth: 4.6,
    color: "#fb923c",
    fillColor: "#f97316",
    fillAlpha: 0.18,
    strokeAlpha: 0.88,
    life: 0.46
  });
  addHitParticles(x, y, 18, "#fdba74", {
    speed: 220,
    speedY: 180,
    lifeMin: .18,
    lifeMax: .38,
    sizeMin: 1.8,
    sizeMax: 4.4,
    glow: 12
  });
  addHitParticles(x, y, 12, "rgba(71,33,11,.85)", {
    speed: 105,
    speedY: 90,
    lifeMin: .28,
    lifeMax: .55,
    sizeMin: 2.4,
    sizeMax: 5.6,
    drift: 0.75,
    gravity: -24
  });
}

function addBossDeathFinisher(x,y,color){
  addImpactBurst(x, y, {
    radius: 110,
    innerRadius: 24,
    lineWidth: 6,
    color,
    fillColor: color,
    fillAlpha: 0.16,
    strokeAlpha: 0.95,
    life: 0.62
  });
  addScreenFlash(color, 0.34, 0.18);
  addHitParticles(x, y, 26, color, {
    speed: 240,
    speedY: 210,
    lifeMin: .26,
    lifeMax: .58,
    sizeMin: 2.2,
    sizeMax: 5.2,
    glow: 14
  });
  addHitParticles(x, y, 18, "#f8fafc", {
    speed: 200,
    speedY: 180,
    lifeMin: .18,
    lifeMax: .44,
    sizeMin: 1.4,
    sizeMax: 3.2,
    glow: 10,
    shape: "diamond"
  });
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
      const finalDamage = damage * getDamageMultiplierAgainstEnemy(enemy, projectileType);
      enemy.hp -= finalDamage;
      addHitParticles(pos.x,pos.y,projectileType==="bomb"?6:4,projectileType==="bomb"?"#fb923c":"#c4b5fd");
      showPopup(pos.x,pos.y-10,`-${Math.round(finalDamage)}`,projectileType==="bomb"?"#fb923c":"#c4b5fd");
    }
  }
}
function getKillRewardMultiplier(){
  const stageBonus = (currentStage - 1) * 0.15;
  const endlessBonus = currentMode === "endless" ? (getEndlessCycle() - 1) * 0.10 : 0;
  return 1 + stageBonus + endlessBonus;
}
function rewardKill(enemy,pos){
  const scaledBase = Math.max(1, Math.round(enemy.reward * getKillRewardMultiplier() * leyKillGoldMult()));
  let reward = scaledBase;
  let scoreGain = 0;
  money += reward; kills += 1;
  const baseScore=enemy.type==="boss"?300:enemy.type==="tank"?90:enemy.type==="armored"?85:enemy.type==="splitter"?(enemy.fragment?25:60):enemy.type==="fast"?70:50;
  const scoreBonus=isCurrentWaveBoss()?40:0;
  registerComboKill(pos);
  addScore(Math.round(baseScore * getComboMultiplier()), scoreBonus);
  if(enemy.lastHitAuraType === "wealth"){
    const owner = getUnitById(enemy.lastHitByUnitId);
    const bonusGold = Math.max(1, Math.round(scaledBase * 0.40)) + (enemy.type === "boss" ? 120 : 0);
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
  addHitParticles(pos.x,pos.y,enemy.type==="boss"?16:8,enemy.type==="boss"?"#f59e0b":"#cbd5e1", enemy.type==="boss"
    ? { speed: 220, speedY: 200, lifeMin: .24, lifeMax: .56, sizeMin: 2.2, sizeMax: 4.8, glow: 12 }
    : { speed: 110, speedY: 100, lifeMin: .22, lifeMax: .44, sizeMin: 1.8, sizeMax: 3.4, glow: 4 });
  if(enemy.type==="boss") addBossDeathFinisher(pos.x, pos.y, enemy.bossColor || (currentStage===6 ? "#c084fc" : "#f59e0b"));
  if(enemy.type==="boss") vibrate([45, 50, 65]);
  addDeathBurst(enemy, pos);
  if(enemy.type==="boss"){
    addScreenShake(9, .55);
    playBossDeathSound();
  } else {
    addScreenShake(enemy.type==="tank" ? 3 : enemy.type==="armored" ? 2.4 : 1.6, enemy.type==="tank" ? .18 : .13);
    playDeathSound(enemy.type);
  }
}
function triggerBossAbility(enemy){
  const bossStage = enemy?.bossStage || currentStage;
  const ability=STAGES[bossStage].bossAbility;
  const meta = getBossAbilityMeta(bossStage);
  if(ability==="summon"){
    const minionHp = bossStage === 3 ? 48 * STAGES[bossStage].difficulty : 40 * STAGES[bossStage].difficulty;
    const minionSpeed = bossStage === 3 ? .125 : .13;
    const summonCount = bossStage === 3 ? 3 : 2;
    for(let i=0;i<summonCount;i++) enemies.push({ id:idCounter++, hp:minionHp, maxHp:minionHp, speed:minionSpeed, progress:Math.max(0,enemy.progress-.03*(i+1)), wobble:Math.random()*Math.PI*2, type:"fast", reward:8, abilityUsed:true });
    bossFxType = "summon";
    bossFxTimer = 1.0;
    startBossCastBanner(meta.label, meta.color);
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} summoned minions!`,"#fca5a5");
  }
  if(ability==="rage"){
    const speedMultiplier = bossStage === 5 ? 1.75 : 1.68;
    const bonusHp = bossStage === 5 ? .18 : .15;
    enemy.speed*=speedMultiplier; enemy.hp += enemy.maxHp*bonusHp;
    enemy.rageFxTimer = 2.4;
    bossFxType = "rage";
    bossFxTimer = 1.0;
    startBossCastBanner(meta.label, meta.color);
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} entered rage mode!`,"#fca5a5");
  }
  if(ability==="shield"){
    const shieldAmount = bossStage === 6 ? .25 : (bossStage === 4 ? .30 : .25);
    enemy.hp += enemy.maxHp*shieldAmount;
    enemy.shieldFxTimer = 2.8;
    bossFxType = "shield";
    bossFxTimer = 1.0;
    startBossCastBanner(meta.label, meta.color);
    showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} gained a shield!`,"#93c5fd");
  }
  if(ability==="roots"){
    const activeUnits = units.filter(unit => (unit.snaredUntil || 0) <= performance.now());
    if(activeUnits.length){
      let rootedUnit = null;
      let bestDistance = Infinity;
      const bossPos = getPathPosition(enemy.progress);
      for(const unit of activeUnits){
        const unitPos = cellCenter(unit.c, unit.r);
        const d = distance(unitPos, bossPos);
        if(d < bestDistance){
          bestDistance = d;
          rootedUnit = unit;
        }
      }
      if(rootedUnit){
        rootedUnit.snaredUntil = performance.now() + 3500;
        rootedUnit.cooldown = Math.max(rootedUnit.cooldown || 0, 0.35);
        const rootedPos = cellCenter(rootedUnit.c, rootedUnit.r);
        bossFxType = "roots";
        bossFxTimer = 1.0;
        startBossCastBanner(meta.label, meta.color);
        showPopup(rootedPos.x, rootedPos.y - 26, "Rooted!", "#86efac");
        showPopup(canvas.width/2,70,`${enemy.bossName || "Boss"} entangled a tower!`,"#86efac");
      }
    }
  }
  enemy.abilityUsed=true;
}

function update(dt){
  if(shakeTimer > 0){ shakeTimer = Math.max(0, shakeTimer - dt); if(shakeTimer === 0) shakeMag = 0; }
  if(comboTimer > 0){
    comboTimer = Math.max(0, comboTimer - dt);
    if(comboTimer === 0) breakCombo(true);
  }
  comboPop = Math.max(0, comboPop - dt * 3.2);
  if(!waveActive && waveCallBonus > 0 && hasStarted && lives > 0 && !pendingAuraChoice && !pendingBossResolution){
    waveCallBonus = Math.max(0, waveCallBonus - (waveCallBonusMax / WAVE_CALL_DECAY_SECONDS) * dt);
  }
  bossBannerTimer=Math.max(0,bossBannerTimer-dt);
  bossFxTimer=Math.max(0,bossFxTimer-dt);
  bossTelegraphTimer=Math.max(0,bossTelegraphTimer-dt);
  bossCastTimer=Math.max(0,bossCastTimer-dt);
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
    if(enemy.shieldFxTimer){
      enemy.shieldFxTimer = Math.max(0, enemy.shieldFxTimer - dt);
    }
    if(enemy.rageFxTimer){
      enemy.rageFxTimer = Math.max(0, enemy.rageFxTimer - dt);
    }
    const spellSlowFactor = enemy.spellSlowTimer > 0 ? (enemy.spellSlowFactor || 1) : 1;
    const auraSlowFactor = enemy.auraSlowTimer > 0 ? (enemy.auraSlowFactor || 1) : 1;
    const specSlowFactor = enemy.specSlowTimer > 0 ? (enemy.specSlowFactor || 1) : 1;
    const freezeFactor = enemy.freezeTimer > 0 ? 0 : 1;
    const stunFactor = enemy.stunTimer > 0 ? 0 : 1;
    enemy.progress += enemy.speed * spellSlowFactor * auraSlowFactor * specSlowFactor * freezeFactor * stunFactor * dt;
    if(enemy.type==="boss" && !enemy.abilityUsed){
      const bossStage = enemy.bossStage || currentStage;
      if(!enemy.bossTelegraphShown && enemy.hp < enemy.maxHp * 0.68 && enemy.hp >= enemy.maxHp * 0.55){
        const meta = getBossAbilityMeta(bossStage);
        enemy.bossTelegraphShown = true;
        bossTelegraphType = STAGES[bossStage].bossAbility;
        bossTelegraphStage = bossStage;
        bossTelegraphTimer = 1.15;
        startBossCastBanner(`${meta.short} incoming`, meta.color, 1.15);
      }
      if(enemy.hp<enemy.maxHp*.55) triggerBossAbility(enemy);
    }
    if(enemy.progress>=1){
      enemies.splice(i,1);
      if(enemy.type==="boss") syncBossLoop();
      breakCombo(false);
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
    if((unit.snaredUntil || 0) > performance.now()) continue;
    const stats = getAuraAdjustedStats(unit);
    const unitPos=cellCenter(unit.c,unit.r);
    let bestTarget=null,bestPriority=-Infinity;
    for(const enemy of enemies){
      const enemyPos=getPathPosition(enemy.progress);
      if(distance(unitPos,enemyPos)>stats.range) continue;
      const priority = getTargetPriority(unit, enemy, stats, unitPos, enemyPos);
      if(priority>bestPriority){
        bestTarget={enemy,pos:enemyPos};
        bestPriority=priority;
      }
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
        addMageImpactEffect(targetPos.x, targetPos.y, projectile.splash);
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
        addBombImpactEffect(targetPos.x, targetPos.y, projectile.splash);
        applySplashDamage(targetPos,projectile.splash,projectile.damage,"bomb");
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
        const damageMult = getDamageMultiplierAgainstEnemy(target, projectile.projectileType);
        const finalDamage = projectile.damage * damageMult;
        target.hp-=finalDamage;
        if(owner) markEnemyHit(target, owner, finalDamage);
        applyAuraStatusOnEnemy(target, owner, targetPos, finalDamage);
        applySpecializationStatusOnEnemy(target, owner, targetPos, finalDamage);
        if(damageMult < 0.95) addArmorDeflectEffect(targetPos.x, targetPos.y);
        addHitParticles(targetPos.x,targetPos.y,4,projectile.color,{
          speed: damageMult < 0.95 ? 80 : 110,
          speedY: damageMult < 0.95 ? 70 : 100,
          lifeMin: .18,
          lifeMax: .34,
          sizeMin: 1.6,
          sizeMax: 3.1,
          glow: damageMult < 0.95 ? 3 : 7
        });
        showPopup(targetPos.x,targetPos.y-8,`-${Math.round(finalDamage)}`,projectile.color);
      }
      if(owner && projectile.ownerAuraType === "storm"){
        chainStormDamage(target, owner, targetPos);
      }
      playHitSound(); projectiles.splice(i,1); continue;
    }
    projectile.x += (dx/d)*step; projectile.y += (dy/d)*step;
  }

  for(let i=enemies.length-1;i>=0;i--){
    if(enemies[i].hp<=0){
      const defeatedEnemy = enemies[i];
      const pos=getPathPosition(defeatedEnemy.progress);
      rewardKill(defeatedEnemy,pos);
      if(defeatedEnemy.type==="splitter" && !defeatedEnemy.fragment){
        const fragHp = Math.max(12, defeatedEnemy.maxHp * 0.34);
        for(let f=0; f<2; f++){
          enemies.push({
            id:idCounter++, hp:fragHp, maxHp:fragHp,
            speed:defeatedEnemy.speed * 1.4,
            progress:Math.max(0, defeatedEnemy.progress - 0.006 - f * 0.012),
            wobble:Math.random()*Math.PI*2,
            type:"splitter", fragment:true, reward:6,
            abilityUsed:true, bossTelegraphShown:true
          });
        }
        showPopup(pos.x, pos.y - 26, "Split!", "#5eead4");
      }
      enemies.splice(i,1);
      if(defeatedEnemy.type==="boss") syncBossLoop();
      updateUI();
    }
  }

  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.life-=dt;
    p.x+=p.vx*dt;
    p.y+=p.vy*dt;
    p.vx*=.96;
    p.vy = (p.vy + (p.gravity || 0) * dt) * .96;
    if(p.life<=0) particles.splice(i,1);
  }
  for(let i=impactBursts.length-1;i>=0;i--){
    const burst = impactBursts[i];
    burst.life -= dt;
    if(burst.life<=0) impactBursts.splice(i,1);
  }
  for(let i=screenFlashes.length-1;i>=0;i--){
    const flash = screenFlashes[i];
    flash.life -= dt;
    if(flash.life<=0) screenFlashes.splice(i,1);
  }
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
      const bossCrystals = currentMode === "campaign" ? 8 + 4 * currentStage : 25;
      awardLeyCrystals(bossCrystals, currentMode === "campaign" ? `${STAGE_BOSS[currentStage]?.name || "Boss"} defeated` : "Endless boss pair defeated");
      if(lives===stageStartLives){ unlockAchievement("survivor"); bonusScore += 250; }

      if(!pendingBossResolution){
        if(currentMode==="campaign" && currentStage < Object.keys(STAGES).length){
          pendingBossResolution = { type:"campaign-next-stage", nextStage: currentStage + 1 };
        } else if(currentMode==="campaign" && currentStage >= Object.keys(STAGES).length){
          unlockAchievement("stage6_clear");
          pendingBossResolution = { type:"unlock-endless" };
        } else {
          unlockAchievement("first_endless_boss_pair");
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
    const waveCrystals = awardLeyCrystals(currentMode === "endless" ? 3 : 2, "Wave cleared", { silent:true });
    armWaveCallBonus();
    setMessage(currentMode === "campaign" ? `Wave complete. +${waveCrystals} ✦ Ley Crystals. Next wave in this stage: ${stageWave}.` : `Endless wave complete. +${waveCrystals} ✦ Ley Crystals. Next wave: ${stageWave}.`);
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

function drawRuinDust(){
  const t = performance.now() * 0.0008;
  for(const mote of stageFxState.dustSeed){
    const x = mote.baseX + Math.sin(t * 2.1 + mote.phase) * 26;
    const y = mote.baseY + Math.cos(t * 1.6 + mote.phase * 1.2) * 12;
    const alpha = 0.024 + 0.018 * Math.sin(t * 3.2 + mote.phase);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1.3, 0.55);
    ctx.fillStyle = `rgba(214,220,228,${Math.max(0.01, alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(0, 0, mote.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawGraveAsh(){
  const t = performance.now() * 0.001;
  for(const ash of stageFxState.ashSeed){
    const x = ash.baseX + Math.sin(t * 0.7 + ash.phase) * 22;
    const y = ((ROWS * CELL + 50) - ((t * 26 * ash.speed + ash.phase * 52) % (ROWS * CELL + 90)));
    const alpha = 0.05 + 0.04 * Math.sin(t * 1.8 + ash.phase * 1.4);
    ctx.fillStyle = `rgba(210,196,224,${Math.max(0.015, alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, ash.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPortalDistortion(){
  const start = path[0];
  if(!start) return;
  const pos = cellCenter(start.c, start.r);
  const t = performance.now() * 0.0013;

  ctx.save();
  ctx.translate(pos.x, pos.y);

  for(const ring of stageFxState.portalSeed){
    const pulse = 1 + Math.sin(t * 3 + ring.phase) * 0.06;
    const radius = ring.radius + Math.sin(t * 2.1 + ring.phase) * ring.wobble;
    ctx.globalAlpha = 0.10 + Math.sin(t * 2.4 + ring.phase) * 0.03;
    ctx.strokeStyle = "rgba(192,132,252,.55)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(Math.sin(t + ring.phase) * 4, Math.cos(t * 1.4 + ring.phase) * 3, radius * pulse, radius * 0.42 * pulse, t + ring.phase, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.18;
  const veil = ctx.createRadialGradient(0, 0, 10, 0, 0, 86);
  veil.addColorStop(0, "rgba(216,180,255,.24)");
  veil.addColorStop(0.45, "rgba(139,92,246,.10)");
  veil.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = veil;
  ctx.beginPath();
  ctx.arc(0, 0, 86, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSkyAtmosphere(){
  const pal = getStagePalette();
  const t = performance.now() * 0.00012;
  const sweepColorByStage = {
    1: "rgba(120,180,110,0.045)",
    2: "rgba(200,210,224,0.018)",
    3: "rgba(180,120,220,0.050)",
    4: "rgba(170,190,224,0.020)",
    5: "rgba(214,132,92,0.045)",
    6: "rgba(168,85,247,0.060)"
  };
  const sweepColor = sweepColorByStage[currentStage] || "rgba(200,210,224,0.04)";

  ctx.save();

  const horizon = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
  horizon.addColorStop(0, pal.ambient);
  horizon.addColorStop(0.5, "rgba(0,0,0,0)");
  horizon.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.52);

  for(let i = 0; i < 3; i++){
    const x = canvas.width * (0.18 + i * 0.28) + Math.sin(t * (2 + i * 0.35) + i) * 90;
    const y = 70 + i * 48;
    const sweep = ctx.createRadialGradient(x, y, 12, x, y, 220 + i * 26);
    sweep.addColorStop(0, sweepColor);
    sweep.addColorStop(0.42, sweepColor.replace(/0\.\d+\)/, "0.018)"));
    sweep.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sweep;
    ctx.beginPath();
    ctx.ellipse(x, y, 240 + i * 20, 82 + i * 10, -0.18 + i * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStageLightBands(){
  if(currentStage === 1){
    drawStageBirds();
    return;
  }

  const bandColors = {
    1: "rgba(246,194,118,0.050)",
    2: "rgba(214,220,228,0.016)",
    3: "rgba(196,144,252,0.050)",
    4: "rgba(190,210,236,0.018)",
    5: "rgba(250,168,110,0.045)",
    6: "rgba(192,132,252,0.060)"
  };
  const color = bandColors[currentStage] || "rgba(226,232,240,0.04)";
  const t = performance.now() * 0.00018;

  ctx.save();
  for(let i = 0; i < 2; i++){
    const x = 120 + i * 420 + Math.sin(t * (1.4 + i * 0.18) + i * 1.7) * 120;
    const y = -40;
    ctx.translate(x, y);
    ctx.rotate(-0.22 + i * 0.06);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height + 120);
    grad.addColorStop(0, color);
    grad.addColorStop(0.18, color.replace(/0\.\d+\)/, "0.020)"));
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(-34, 0, 68, canvas.height + 140);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.restore();
}

function drawStageBirds(){
  const t = performance.now() * 0.00042;
  const flocks = [
    { baseX: canvas.width * 0.18, baseY: 84, spread: 86, speed: 34, scale: 0.95 },
    { baseX: canvas.width * 0.42, baseY: 122, spread: 104, speed: 28, scale: 0.8 },
    { baseX: canvas.width * 0.7, baseY: 96, spread: 72, speed: 24, scale: 0.68 }
  ];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  flocks.forEach((flock, flockIndex) => {
    for(let i = 0; i < 3; i++){
      const drift = (t * flock.speed + i * 0.9 + flockIndex * 1.7);
      const x = flock.baseX + Math.sin(drift) * flock.spread + i * 18;
      const y = flock.baseY + Math.cos(drift * 1.4) * 12 + i * 10;
      const wing = (Math.sin(drift * 7.2) * 0.5 + 0.5) * 8 + 4;
      const size = flock.scale + i * 0.08;

      ctx.strokeStyle = `rgba(18,24,18,${(0.52 - i * 0.06).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.4, 2.2 * size);
      ctx.beginPath();
      ctx.moveTo(x - 10 * size, y + 1);
      ctx.quadraticCurveTo(x - 4 * size, y - wing, x, y);
      ctx.quadraticCurveTo(x + 4 * size, y - wing, x + 10 * size, y + 1);
      ctx.stroke();
    }
  });

  ctx.restore();
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
  drawSkyAtmosphere();
  drawStageLightBands();

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
  if(stage.ruins && currentStage !== 2 && currentStage !== 4) drawRuins(stage.ruins);
  if(pal.fog && currentStage !== 2 && currentStage !== 4) drawStageFog();
  if(currentStage === 3 || currentStage === 5) drawGraveAsh();
  if(currentStage === 6) drawPortalDistortion();
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
function drawTerrainFeatures(){
  const stage = STAGES[currentStage];
  const now = performance.now();
  // blocked cells — themed props
  for(const b of (stage.blocked || [])){
    const pos = cellCenter(b.c, b.r);
    const seed = (b.c * 31 + b.r * 17) % 100 / 100;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    if(currentStage === 3 || currentStage === 5){
      // tombstone
      ctx.fillStyle = "rgba(2,6,23,.35)";
      ctx.beginPath(); ctx.ellipse(0, 15, 15, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = currentStage === 5 ? "#4b5563" : "#6b7280";
      roundRect(-9, -14, 18, 28, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.10)";
      roundRect(-9, -14, 18, 9, 8); ctx.fill();
      ctx.strokeStyle = "rgba(2,6,23,.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -8); ctx.lineTo(0, 2); ctx.moveTo(-4, -4); ctx.lineTo(4, -4);
      ctx.stroke();
      ctx.fillStyle = "#374151";
      ctx.beginPath(); ctx.ellipse(8 + seed * 4, 13, 5, 3, 0.4, 0, Math.PI * 2); ctx.fill();
    } else if(currentStage === 6){
      // obsidian shard
      ctx.fillStyle = "rgba(2,6,23,.4)";
      ctx.beginPath(); ctx.ellipse(0, 16, 16, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1e1b2e";
      ctx.beginPath();
      ctx.moveTo(-11, 15); ctx.lineTo(-4 + seed * 3, -17); ctx.lineTo(4, -6); ctx.lineTo(11, 15);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(192,132,252,.55)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4 + seed * 3, -17); ctx.lineTo(-1, 15);
      ctx.stroke();
    } else {
      // boulder cluster
      ctx.fillStyle = "rgba(2,6,23,.35)";
      ctx.beginPath(); ctx.ellipse(0, 15, 17, 5, 0, 0, Math.PI * 2); ctx.fill();
      const rockA = currentStage === 2 ? "#7c7368" : currentStage === 4 ? "#6f6a63" : "#6b7c5e";
      const rockB = currentStage === 2 ? "#5d564d" : currentStage === 4 ? "#524e48" : "#4f5c46";
      ctx.fillStyle = rockB;
      ctx.beginPath(); ctx.ellipse(7, 6, 8, 7, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rockA;
      ctx.beginPath(); ctx.ellipse(-4, 1, 11, 10.5, -0.15 + seed * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.ellipse(-7, -4, 5, 3, -0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // ley stones — pulsing rune circles (drawn under towers)
  for(const l of (stage.ley || [])){
    const pos = cellCenter(l.c, l.r);
    const color = l.kind === "damage" ? "#fbbf24" : "#c4b5fd";
    const pulse = 0.5 + Math.sin(now * 0.0035 + l.c * 2 + l.r) * 0.22;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.globalAlpha = 0.35 + pulse * 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(0, 0, 17 + pulse * 2, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 0.5 + pulse * 0.35;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -9); ctx.lineTo(7, 0); ctx.lineTo(0, 9); ctx.lineTo(-7, 0);
    ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = 0.25 + pulse * 0.2;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function getPlacementPreviewUnit(typeKey, c, r){
  const reserve = reservePool[typeKey] || [];
  let source = UNIT_TYPES[typeKey];
  if(reserve.length){
    source = reserve.reduce((best, unit)=>{
      if(!best) return unit;
      if((unit.level || 1) !== (best.level || 1)) return (unit.level || 1) > (best.level || 1) ? unit : best;
      return (unit.totalSpent || 0) > (best.totalSpent || 0) ? unit : best;
    }, null) || source;
  }
  return { ...source, id:-1, type:typeKey, c, r, auraType:source.auraType || null, wealthSurgeTimer:0 };
}

function drawTowerPlacementGhost(typeKey, pos, blocked){
  const sprite = towerSprites[typeKey];
  const isBomb = typeKey === "bomb";
  const isHunter = typeKey === "hunter";
  const isMage = typeKey === "mage";
  const drawSize = isBomb ? 52 : isHunter ? 44 : isMage ? 50 : 46;
  const drawY = isBomb ? -30 : typeKey === "archer" ? -28 : isHunter ? -27 : -29;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.globalAlpha = blocked ? .44 : .78;
  ctx.filter = blocked
    ? "grayscale(1) sepia(1) saturate(5) hue-rotate(310deg)"
    : "brightness(1.25) drop-shadow(0 6px 7px rgba(34,197,94,.42))";
  if(sprite?.complete && sprite.naturalWidth){
    ctx.drawImage(sprite, -drawSize / 2, drawY, drawSize, drawSize);
  } else {
    ctx.fillStyle = blocked ? "#fb7185" : (UNIT_TYPES[typeKey]?.color || "#4ade80");
    ctx.beginPath();
    ctx.arc(0, 2, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.filter = "none";
  ctx.globalAlpha = .96;
  ctx.fillStyle = "rgba(5,8,16,.92)";
  ctx.beginPath();
  ctx.arc(20, -23, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = blocked ? "#fb7185" : "#4ade80";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(20, -23, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = blocked ? "#fb7185" : "#4ade80";
  ctx.font = `900 8px ${FONT_UI}`;
  ctx.textAlign = "center";
  ctx.fillText(blocked ? "X" : "OK", 20, -20);
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
    ctx.font=`bold 12px ${FONT_UI}`;
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
    const occupiedRange = getAuraAdjustedStats(occupied).range;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,occupiedRange,0,Math.PI*2);
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

  const blocked=pathCells.has(`${c}-${r}`) || isBlockedCell(c, r);
  const hoverLey = !blocked ? getLeyStoneAt(c, r) : null;
  const pos=cellCenter(c,r);
  const previewUnit = getPlacementPreviewUnit(selectedUnitType, c, r);
  const previewStats = getAuraAdjustedStats(previewUnit);

  ctx.save();
  ctx.beginPath();
  ctx.arc(pos.x,pos.y,previewStats.range,0,Math.PI*2);
  ctx.fillStyle=blocked?"rgba(251,113,133,.07)":"rgba(34,197,94,.08)";
  ctx.fill();
  ctx.strokeStyle=blocked?"rgba(251,113,133,.58)":"rgba(74,222,128,.62)";
  ctx.setLineDash([8,8]);
  ctx.lineWidth=2;
  ctx.stroke();
  ctx.setLineDash([]);

  roundRect(c*CELL+3,r*CELL+3,CELL-6,CELL-6,12);
  ctx.fillStyle=blocked?"rgba(251,113,133,.22)":"rgba(34,197,94,.18)";
  ctx.fill();

  drawTowerPlacementGhost(selectedUnitType, pos, blocked);

  ctx.fillStyle = blocked ? "#fecdd3" : "#bbf7d0";
  ctx.font = `700 10px ${FONT_UI}`;
  ctx.textAlign = "center";
  ctx.fillText(`Range ${Math.round(previewStats.range)}`, pos.x, pos.y - previewStats.range - 9);
  ctx.textAlign = "start";

  if(!blocked){
    const preview = getUnitSynergies(null, c, r, selectedUnitType);
    for(const partner of preview.partners){
      const pPos = cellCenter(partner.c, partner.r);
      const linkColor = SYNERGY_CONFIG[partner.type]?.color || "#e2e8f0";
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pPos.x, pPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    if(preview.types.length){
      ctx.save();
      ctx.font = `700 10px ${FONT_UI}`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#5eead4";
      ctx.shadowColor = "rgba(2,6,23,.9)";
      ctx.shadowBlur = 4;
      ctx.fillText(`⚡ ${preview.types.length} synerg${preview.types.length === 1 ? "y" : "ies"}`, pos.x, pos.y + 30);
      ctx.restore();
      ctx.textAlign = "start";
    }
    if(hoverLey){
      ctx.save();
      ctx.font = `700 10px ${FONT_UI}`;
      ctx.textAlign = "center";
      ctx.fillStyle = hoverLey.kind === "damage" ? "#fbbf24" : "#c4b5fd";
      ctx.shadowColor = "rgba(2,6,23,.9)";
      ctx.shadowBlur = 4;
      ctx.fillText(hoverLey.kind === "damage" ? "◆ Ley Stone: +10% damage" : "◆ Ley Stone: +12% range", pos.x, pos.y + (preview.types.length ? 42 : 30));
      ctx.restore();
      ctx.textAlign = "start";
    }
  }

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
    const syn = getUnitSynergies(unit);
    for(const partner of syn.partners){
      const pPos = cellCenter(partner.c, partner.r);
      const linkColor = SYNERGY_CONFIG[partner.type]?.color || "#e2e8f0";
      ctx.save();
      ctx.globalAlpha = 0.55 + Math.sin(performance.now() * 0.006 + partner.id) * 0.15;
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.lineDashOffset = -(performance.now() * 0.02) % 11;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pPos.x, pPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = linkColor;
      ctx.beginPath();
      ctx.arc(pPos.x, pPos.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
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

  const isSnared = (unit.snaredUntil || 0) > performance.now();
  if(isSnared){
    ctx.save();
    ctx.strokeStyle = "rgba(74,222,128,.95)";
    ctx.lineWidth = 3;
    for(let i=0;i<3;i++){
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + 2, 12 + i * 4 + Math.sin(performance.now() * 0.008 + i + unit.id) * 1.5, 0.2 + i * 0.4, Math.PI * 1.6 + i * 0.25);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(8,17,31,.82)";
    roundRect(pos.x - 20, pos.y - 56, 40, 16, 8);
    ctx.fill();
    ctx.fillStyle = "#86efac";
    ctx.font = `bold 11px ${FONT_UI}`;
    ctx.textAlign = "center";
    ctx.fillText("ROOTED", pos.x, pos.y - 44);
    ctx.textAlign = "start";
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
    ctx.font = `bold 11px ${FONT_UI}`;
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
    ctx.font = `12px ${FONT_UI}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(specIcon, badgeX, badgeY + 0.5);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.restore();
  }
}
const drawUnits=()=>units.forEach(drawPlacedUnit);

/* ============================================================
   ENEMY SPRITES — procedural sprite sheets, pre-rendered once
   per (type, palette) on offscreen canvases. 8 walk frames,
   side profile facing right, flipped for leftward movement.
   ============================================================ */
const ENEMY_SPRITE_CACHE = new Map();
const ENEMY_WALK_FRAMES = 8;
const ENEMY_SPRITE_RES = 3; // render at 3x for crisp downscale

function enemyPalette(type, enemy){
  const dark = currentStage === 6 && type !== "boss";
  if(type === "boss"){
    const accent = enemy?.bossColor || (currentStage === 6 ? "#c084fc" : "#f59e0b");
    return { key:`boss-${accent}`, skin:"#2b2437", skinD:"#191423", cloth:"#3f3454", metal:"#6b5f85", accent, eye:accent };
  }
  if(type === "splitter" || type === "splitterling"){
    return (currentStage === 6)
      ? { key:"split-dark", skin:"#7c6bc4", skinD:"#52419c", cloth:"#3b2d78", metal:"#9d8fd6", accent:"#c4b5fd", eye:"#f3e8ff" }
      : { key:"split-std",  skin:"#2fa88f", skinD:"#1d7a68", cloth:"#125246", metal:"#5eead4", accent:"#5eead4", eye:"#ccfbf1" };
  }
  if(type === "fast") return dark
    ? { key:"fast-dark", skin:"#8b7cc2", skinD:"#5f4e9e", cloth:"#43307a", metal:"#b1a4e0", accent:"#c4b5fd", eye:"#f3e8ff" }
    : { key:"fast-std",  skin:"#4c94c9", skinD:"#31699b", cloth:"#1d3f66", metal:"#9bd0f0", accent:"#7dd3fc", eye:"#e0f2fe" };
  if(type === "tank") return dark
    ? { key:"tank-dark", skin:"#7d6aa8", skinD:"#544384", cloth:"#3a2b66", metal:"#8d7cc0", accent:"#c4b5fd", eye:"#ede9fe" }
    : { key:"tank-std",  skin:"#b0563f", skinD:"#7e3a2b", cloth:"#4a2a1e", metal:"#8a7f74", accent:"#fca5a5", eye:"#fee2e2" };
  if(type === "armored") return dark
    ? { key:"arm-dark",  skin:"#8f83b8", skinD:"#655a92", cloth:"#4c3f80", metal:"#a99ed6", accent:"#ddd6fe", eye:"#c4b5fd" }
    : { key:"arm-std",   skin:"#94a3b8", skinD:"#64748b", cloth:"#334155", metal:"#cbd5e1", accent:"#e2e8f0", eye:"#93c5fd" };
  return dark
    ? { key:"norm-dark", skin:"#9887c9", skinD:"#6d5aa8", cloth:"#4a3a82", metal:"#8f80c2", accent:"#c4b5fd", eye:"#ede9fe" }
    : { key:"norm-std",  skin:"#79945c", skinD:"#556b3e", cloth:"#3c4a2c", metal:"#8fa376", accent:"#bef264", eye:"#ecfccb" };
}

function limbPath(g, x1, y1, x2, y2, x3, y3, width, color){
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x1, y1);
  g.quadraticCurveTo(x2, y2, x3, y3);
  g.stroke();
}

// Walk-cycle leg: hip -> foot with knee bend and lift on the forward swing.
function drawLeg(g, hipX, hipY, ground, swing, lift, stride, width, color){
  const footX = hipX + swing * stride;
  const footY = ground - Math.max(0, lift) * 3.4;
  const kneeX = hipX + swing * stride * 0.45 + 1.6;
  const kneeY = hipY + (ground - hipY) * 0.52 - Math.max(0, lift) * 1.6;
  limbPath(g, hipX, hipY, kneeX, kneeY, footX, footY, width, color);
  return { footX, footY };
}

function drawEnemyFigure(g, type, phase, pal){
  const t = phase * Math.PI * 2;
  const sw = Math.sin(t);            // primary swing  (-1..1)
  const sw2 = Math.sin(t + Math.PI); // opposite limb
  const liftA = Math.sin(t + Math.PI * 0.5);
  const liftB = Math.sin(t + Math.PI * 1.5);
  const bounce = Math.abs(Math.cos(t)) * 1.3;
  const GROUND = 20;

  if(type === "splitter" || type === "splitterling"){
    const frag = type === "splitterling";
    // squash & stretch hop cycle
    const hop = Math.max(0, Math.sin(t));            // in the air
    const squash = Math.max(0, -Math.sin(t)) * 0.5;  // landed, flattened
    const lift = hop * 5;
    const rx = 8.6 * (1 + squash * 0.32 - hop * 0.10);
    const ry = 7.4 * (1 - squash * 0.34 + hop * 0.14);
    const cy = 12 - ry - lift;
    // drips at the base
    g.fillStyle = pal.skinD;
    g.beginPath();
    g.ellipse(-4 + sw * 1.2, GROUND - 1.4, 2 + squash * 1.4, 1.1, 0, 0, Math.PI * 2);
    g.ellipse(4 + sw2 * 1.2, GROUND - 1.1, 1.6 + squash * 1.2, 0.9, 0, 0, Math.PI * 2);
    g.fill();
    // gel body
    const body = g.createRadialGradient(1.5, cy - 3, 1, 0, cy, ry + 3);
    body.addColorStop(0, pal.metal);
    body.addColorStop(0.55, pal.skin);
    body.addColorStop(1, pal.skinD);
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2); g.fill();
    // inner core
    g.globalAlpha = 0.55;
    g.fillStyle = pal.cloth;
    g.beginPath(); g.ellipse(0.5, cy + 1.5, rx * 0.5, ry * 0.5, 0, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
    // split seam down the middle (only on the full-size splitter)
    if(!frag){
      g.strokeStyle = pal.cloth;
      g.lineWidth = 1.3;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(0.2, cy - ry + 1);
      g.quadraticCurveTo(-1.6 + sw * 0.6, cy, 0.4, cy + ry - 1.2);
      g.stroke();
    }
    // glossy highlight
    g.fillStyle = "rgba(255,255,255,.30)";
    g.beginPath(); g.ellipse(-2.6, cy - ry * 0.45, 2.4, 1.3, -0.5, 0, Math.PI * 2); g.fill();
    // glowing eyes: two on splitter (one each side of the seam), one on fragment
    g.save(); g.shadowColor = pal.eye; g.shadowBlur = 5;
    g.fillStyle = pal.eye;
    if(frag){
      g.beginPath(); g.arc(3, cy - 1.5, 1.5, 0, Math.PI * 2); g.fill();
    } else {
      g.beginPath();
      g.arc(3.6, cy - 1.8, 1.3, 0, Math.PI * 2);
      g.arc(-2.6, cy - 1.8, 1.15, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
    return;
  }

  if(type === "fast"){
    const by = -bounce * 1.2;
    // trailing scarf
    g.strokeStyle = pal.accent; g.lineWidth = 2.4; g.lineCap = "round";
    g.beginPath();
    g.moveTo(-1, -9 + by);
    g.quadraticCurveTo(-9, -10 + by + sw * 1.5, -15, -6 + by + sw2 * 2.2);
    g.stroke();
    drawLeg(g, -0.5, 6 + by, GROUND, sw, liftA, 7.5, 3.1, pal.skinD);
    // torso: lean, tilted forward
    g.save();
    g.translate(0, by);
    g.rotate(0.34);
    const body = g.createLinearGradient(0, -10, 0, 8);
    body.addColorStop(0, pal.skin); body.addColorStop(1, pal.skinD);
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, -1, 4.6, 9.2, 0, 0, Math.PI * 2); g.fill();
    // head: sleek, swept-back crest
    g.beginPath(); g.ellipse(3.4, -11.5, 4.6, 3.8, 0.25, 0, Math.PI * 2); g.fill();
    g.fillStyle = pal.cloth;
    g.beginPath();
    g.moveTo(0.5, -13.6); g.lineTo(-6.5, -12.2); g.lineTo(-0.5, -10.2);
    g.closePath(); g.fill();
    // eye
    g.save(); g.shadowColor = pal.eye; g.shadowBlur = 5;
    g.fillStyle = pal.eye;
    g.beginPath(); g.arc(5.6, -11.8, 1.25, 0, Math.PI * 2); g.fill();
    g.restore();
    g.restore();
    // arms pumping
    limbPath(g, 0.5, -4 + by, 4 + sw2 * 2.5, 0 + by, 5.5 + sw2 * 4.5, 3 + by, 2.6, pal.skin);
    drawLeg(g, 1, 6 + by, GROUND, sw2, liftB, 7.5, 3.1, pal.skin);
    return;
  }

  if(type === "tank"){
    const by = -bounce * 0.7;
    drawLeg(g, -3, 9 + by, GROUND, sw * 0.8, liftA * 0.8, 5.5, 4.6, pal.skinD);
    // club resting over back shoulder
    g.save();
    g.translate(-2, -6 + by);
    g.rotate(-0.85 + sw * 0.05);
    g.fillStyle = "#5d4636";
    roundRectOn(g, -1.6, -15, 3.2, 16, 1.6); g.fill();
    g.fillStyle = "#7a5c44";
    g.beginPath(); g.ellipse(0, -15.5, 3.6, 4.6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = pal.metal;
    g.beginPath(); g.arc(-1.4, -17, 0.8, 0, Math.PI * 2); g.arc(1.5, -14.5, 0.8, 0, Math.PI * 2); g.fill();
    g.restore();
    // massive torso
    g.save(); g.translate(0, by);
    const body = g.createLinearGradient(0, -12, 0, 10);
    body.addColorStop(0, pal.skin); body.addColorStop(1, pal.skinD);
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, -2, 9.4, 11, 0, 0, Math.PI * 2); g.fill();
    // belly plate
    g.fillStyle = pal.cloth;
    g.beginPath(); g.ellipse(2.4, 2.2, 5.4, 6, 0.1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = pal.metal; g.lineWidth = 1;
    g.beginPath(); g.moveTo(-1.5, -1.5); g.lineTo(6, -0.5); g.moveTo(-1.5, 3); g.lineTo(6, 4); g.stroke();
    // small head sunk in shoulders
    g.fillStyle = pal.skin;
    g.beginPath(); g.ellipse(4.6, -11.6, 4, 3.4, 0.15, 0, Math.PI * 2); g.fill();
    g.fillStyle = pal.skinD;
    g.beginPath(); g.moveTo(6.8, -10.4); g.lineTo(9.4, -9.2); g.lineTo(6.6, -8.8); g.closePath(); g.fill(); // jaw
    g.save(); g.shadowColor = pal.eye; g.shadowBlur = 4;
    g.fillStyle = pal.eye;
    g.beginPath(); g.arc(6.2, -12, 1.05, 0, Math.PI * 2); g.fill();
    g.restore();
    g.restore();
    // huge front arm swinging
    limbPath(g, 3, -6 + by, 8 + sw * 1.5, 0 + by, 8.5 + sw * 3, 6.5 + by, 4.4, pal.skin);
    drawLeg(g, 3, 9 + by, GROUND, sw2 * 0.8, liftB * 0.8, 5.5, 4.6, pal.skin);
    return;
  }

  if(type === "armored"){
    const by = -bounce;
    drawLeg(g, -1.5, 7 + by, GROUND, sw, liftA, 6.5, 3.6, pal.skinD);
    // back arm + sword held low
    g.save();
    g.translate(-3.5 + sw2 * 1.2, 0 + by);
    g.rotate(0.5 + sw2 * 0.12);
    g.strokeStyle = pal.metal; g.lineWidth = 1.8;
    g.beginPath(); g.moveTo(0, 2); g.lineTo(0, 13); g.stroke();
    g.strokeStyle = pal.cloth; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 1); g.lineTo(0, 3.6); g.stroke();
    g.restore();
    // torso plate
    g.save(); g.translate(0, by);
    const body = g.createLinearGradient(-4, -8, 5, 8);
    body.addColorStop(0, pal.metal); body.addColorStop(1, pal.skinD);
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(-5, -8); g.lineTo(5, -8); g.lineTo(6, 2); g.lineTo(0, 8); g.lineTo(-6, 2);
    g.closePath(); g.fill();
    g.strokeStyle = pal.skinD; g.lineWidth = 0.9;
    g.beginPath(); g.moveTo(-4.5, -3.5); g.lineTo(5, -3.5); g.moveTo(-4.5, 0.5); g.lineTo(5.3, 0.5); g.stroke();
    // helmet with visor slit + plume
    g.fillStyle = pal.metal;
    g.beginPath(); g.ellipse(1.2, -12.8, 4.6, 4.4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = pal.skinD;
    roundRectOn(g, 1.8, -13.8, 4.4, 2.4, 1.1); g.fill();
    g.save(); g.shadowColor = pal.eye; g.shadowBlur = 4;
    g.fillStyle = pal.eye;
    roundRectOn(g, 2.6, -13.3, 2.8, 1.3, 0.6); g.fill();
    g.restore();
    g.strokeStyle = pal.accent; g.lineWidth = 2; g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, -16.6);
    g.quadraticCurveTo(-5, -17.5 + sw * 0.6, -8, -14 + sw2 * 1);
    g.stroke();
    g.restore();
    // kite shield on front arm
    g.save();
    g.translate(5.6 + sw * 0.6, -1.5 + by);
    g.rotate(0.08);
    const sh = g.createLinearGradient(-3, -5, 3, 6);
    sh.addColorStop(0, pal.metal); sh.addColorStop(1, pal.cloth);
    g.fillStyle = sh;
    g.beginPath();
    g.moveTo(-3.4, -5.5); g.lineTo(3.4, -5.5); g.lineTo(3, 2.5); g.lineTo(0, 6.5); g.lineTo(-3, 2.5);
    g.closePath(); g.fill();
    g.strokeStyle = pal.accent; g.lineWidth = 0.9; g.stroke();
    g.fillStyle = pal.accent;
    g.beginPath(); g.arc(0, -0.5, 1.3, 0, Math.PI * 2); g.fill();
    g.restore();
    drawLeg(g, 1.5, 7 + by, GROUND, sw2, liftB, 6.5, 3.6, pal.metal);
    return;
  }

  if(type === "boss"){
    const by = -bounce * 0.9;
    // flowing cape
    g.fillStyle = pal.cloth;
    g.beginPath();
    g.moveTo(-2, -14 + by);
    g.quadraticCurveTo(-13, -8 + sw * 1.8 + by, -14, 6 + sw2 * 2.5 + by);
    g.quadraticCurveTo(-8, 8 + by, -4, 4 + by);
    g.closePath(); g.fill();
    drawLeg(g, -2.5, 9 + by, GROUND + 3, sw * 0.9, liftA, 7, 4.2, pal.skinD);
    // torso
    g.save(); g.translate(0, by);
    const body = g.createLinearGradient(0, -14, 0, 10);
    body.addColorStop(0, pal.cloth); body.addColorStop(1, pal.skinD);
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, -3, 7.6, 11.5, 0, 0, Math.PI * 2); g.fill();
    // glowing chest rune
    g.save(); g.shadowColor = pal.accent; g.shadowBlur = 8;
    g.strokeStyle = pal.accent; g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(1.5, -6); g.lineTo(4.2, -2.5); g.lineTo(1.5, 1); g.lineTo(-1.2, -2.5);
    g.closePath(); g.stroke();
    g.restore();
    // head + horns
    g.fillStyle = pal.skin;
    g.beginPath(); g.ellipse(2.2, -15, 4.6, 4.2, 0.1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = pal.accent; g.lineWidth = 2.1; g.lineCap = "round";
    g.beginPath();
    g.moveTo(-0.6, -18); g.quadraticCurveTo(-3.5, -22, -2, -25.5);
    g.moveTo(4.6, -18.2); g.quadraticCurveTo(7.8, -22, 6.6, -25.5);
    g.stroke();
    g.save(); g.shadowColor = pal.eye; g.shadowBlur = 6;
    g.fillStyle = pal.eye;
    g.beginPath(); g.arc(4.4, -15.6, 1.35, 0, Math.PI * 2); g.arc(0.9, -15.9, 1.15, 0, Math.PI * 2); g.fill();
    g.restore();
    g.restore();
    // clawed front arm
    limbPath(g, 3.5, -7 + by, 9 + sw * 2, -2 + by, 10 + sw * 3.5, 3.5 + by, 3.6, pal.skin);
    g.strokeStyle = pal.skin; g.lineWidth = 1.4; g.lineCap = "round";
    const cx = 10 + sw * 3.5, cy = 3.5 + by;
    g.beginPath();
    g.moveTo(cx, cy); g.lineTo(cx + 2.4, cy + 2.6);
    g.moveTo(cx, cy); g.lineTo(cx + 0.4, cy + 3.4);
    g.moveTo(cx, cy); g.lineTo(cx - 1.6, cy + 3);
    g.stroke();
    drawLeg(g, 2.5, 9 + by, GROUND + 3, sw2 * 0.9, liftB, 7, 4.2, pal.skin);
    return;
  }

  // default: "ghoul" — hunched creature, tattered waist cloth, dangling arms
  const by = -bounce;
  drawLeg(g, -1.5, 8 + by, GROUND, sw, liftA, 6, 3.2, pal.skinD);
  // back arm dangling
  limbPath(g, -2, -3 + by, -3 + sw2 * 1.5, 4 + by, -2.5 + sw2 * 3, 10 + by, 2.7, pal.skinD);
  g.save(); g.translate(0, by);
  // hunched body
  const body = g.createLinearGradient(0, -12, 0, 8);
  body.addColorStop(0, pal.skin); body.addColorStop(1, pal.skinD);
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(-4.5, 7);
  g.quadraticCurveTo(-7.5, -4, -1.5, -9.5);
  g.quadraticCurveTo(4.5, -13.5, 6.5, -8.5);
  g.quadraticCurveTo(7.5, -3, 4.5, 7);
  g.closePath(); g.fill();
  // tattered waist cloth
  g.fillStyle = pal.cloth;
  g.beginPath();
  g.moveTo(-4.5, 4); g.lineTo(5, 4.5);
  g.lineTo(4, 9); g.lineTo(2, 6.5); g.lineTo(0, 9.5); g.lineTo(-2, 6.5); g.lineTo(-3.8, 9);
  g.closePath(); g.fill();
  // head thrust forward, open jaw
  g.fillStyle = pal.skin;
  g.beginPath(); g.ellipse(5, -10.5, 4.2, 3.6, 0.3, 0, Math.PI * 2); g.fill();
  g.fillStyle = pal.skinD;
  g.beginPath(); g.moveTo(7.2, -8.6); g.lineTo(10.2, -7.2); g.lineTo(6.8, -6.6); g.closePath(); g.fill();
  // spine bumps
  g.fillStyle = pal.metal;
  g.beginPath();
  g.arc(-2.5, -8.5, 1, 0, Math.PI * 2);
  g.arc(-4, -5.5, 0.9, 0, Math.PI * 2);
  g.arc(-4.8, -2.2, 0.8, 0, Math.PI * 2);
  g.fill();
  g.save(); g.shadowColor = pal.eye; g.shadowBlur = 5;
  g.fillStyle = pal.eye;
  g.beginPath(); g.arc(6.4, -11.4, 1.2, 0, Math.PI * 2); g.fill();
  g.restore();
  g.restore();
  // front arm reaching
  limbPath(g, 2, -4 + by, 6 + sw * 1.5, 1 + by, 7.5 + sw * 3, 7 + by, 2.7, pal.skin);
  drawLeg(g, 1.5, 8 + by, GROUND, sw2, liftB, 6, 3.2, pal.skin);
}

// roundRect helper that works on any context (offscreen sheets included)
function roundRectOn(g, x, y, w, h, r){
  g.beginPath();
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}

function getEnemySpriteSheet(type, enemy){
  const pal = enemyPalette(type, enemy);
  const key = `${type}|${pal.key}`;
  let sheet = ENEMY_SPRITE_CACHE.get(key);
  if(sheet) return sheet;
  const world = type === "boss" ? 64 : 48;       // world px per frame cell
  const cell = world * ENEMY_SPRITE_RES;
  const cv = document.createElement("canvas");
  cv.width = cell * ENEMY_WALK_FRAMES;
  cv.height = cell;
  const g = cv.getContext("2d");
  for(let f = 0; f < ENEMY_WALK_FRAMES; f++){
    g.save();
    g.translate(cell * f + cell / 2, cell / 2 + (type === "boss" ? 2 : 4) * ENEMY_SPRITE_RES);
    g.scale(ENEMY_SPRITE_RES, ENEMY_SPRITE_RES);
    drawEnemyFigure(g, type, f / ENEMY_WALK_FRAMES, pal);
    g.restore();
  }
  sheet = { canvas: cv, cell, world };
  ENEMY_SPRITE_CACHE.set(key, sheet);
  return sheet;
}

function drawEnemy(enemy){
  const pos = getPathPosition(enemy.progress);
  const now = performance.now();

  // --- facing: sample the path slightly ahead, keep last horizontal facing on vertical segments
  const ahead = getPathPosition(Math.min(1, enemy.progress + 0.004));
  const dirX = ahead.x - pos.x, dirY = ahead.y - pos.y;
  if(enemy.facing === undefined) enemy.facing = 1;
  if(Math.abs(dirX) > Math.abs(dirY) * 0.6 && Math.abs(dirX) > 0.01) enemy.facing = dirX >= 0 ? 1 : -1;

  // --- walk animation clock (pauses when frozen/stunned, slows when slowed)
  const frozen = (enemy.freezeTimer > 0) || (enemy.stunTimer > 0);
  const slowed = (enemy.spellSlowTimer > 0) || (enemy.auraSlowTimer > 0) || (enemy.specSlowTimer > 0);
  if(enemy.animT === undefined){ enemy.animT = enemy.wobble; enemy.animLast = now; }
  const adt = Math.min(0.05, (now - enemy.animLast) / 1000);
  enemy.animLast = now;
  const stepRate = enemy.type === "fast" ? 3.0 : enemy.type === "tank" ? 1.35 : enemy.type === "armored" ? 1.8 : enemy.type === "boss" ? 1.15 : enemy.type === "splitter" ? (enemy.fragment ? 2.5 : 1.7) : 2.1;
  if(!frozen && !isPaused) enemy.animT += adt * stepRate * (slowed ? 0.55 : 1);

  const scale = enemy.type === "boss" ? 1.55 : enemy.type === "tank" ? 1.18 : enemy.type === "armored" ? 1.08 : enemy.type === "splitter" ? (enemy.fragment ? .58 : 1.05) : enemy.type === "fast" ? .88 : 1;
  const bob = frozen ? 0 : Math.sin(now * .004 + enemy.wobble) * (enemy.type === "boss" ? 1.2 : 0.7);
  const x = pos.x, y = pos.y + bob;
  const hpPct = Math.max(0, enemy.hp / enemy.maxHp);
  const pulseT = now * 0.008 + enemy.wobble;

  // --- ground shadow
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.ellipse(x, pos.y + 20 * scale, 11 * scale, 3.6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  if(enemy.burnTimer > 0){
    ctx.save();
    ctx.globalAlpha = 0.24 + Math.sin(pulseT * 1.7) * 0.06;
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    ctx.arc(0, 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if(enemy.freezeTimer > 0){
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 2, 14 + Math.sin(pulseT) * 1.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if(slowed){
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 2, 13 + Math.sin(pulseT) * 1.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if(enemy.type === "boss" && enemy.shieldFxTimer > 0){
    ctx.save();
    ctx.globalAlpha = Math.min(0.7, enemy.shieldFxTimer / 2.8 * 0.7);
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 1, 18 + Math.sin(pulseT * 1.2) * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if(enemy.type === "boss" && enemy.rageFxTimer > 0){
    ctx.save();
    ctx.globalAlpha = Math.min(0.5, enemy.rageFxTimer / 2.4 * 0.5);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 1, 20 + Math.sin(pulseT * 1.35) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // --- sprite blit (flip horizontally for leftward movement)
  const sheet = getEnemySpriteSheet(enemy.type === "splitter" && enemy.fragment ? "splitterling" : enemy.type, enemy);
  const frame = Math.floor((enemy.animT % 1) * ENEMY_WALK_FRAMES) % ENEMY_WALK_FRAMES;
  ctx.save();
  if(enemy.facing < 0) ctx.scale(-1, 1);
  if(enemy.freezeTimer > 0){ ctx.filter = "saturate(0.35) brightness(1.25)"; }
  ctx.drawImage(
    sheet.canvas,
    frame * sheet.cell, 0, sheet.cell, sheet.cell,
    -sheet.world / 2, -sheet.world / 2, sheet.world, sheet.world
  );
  ctx.restore();

  if(enemy.stunTimer > 0){
    ctx.save();
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 1.4;
    for(let i = 0; i < 3; i++){
      const ang = pulseT * 1.6 + i * ((Math.PI * 2) / 3);
      const sx = Math.cos(ang) * 8;
      const sy = -18 + Math.sin(ang) * 3;
      ctx.beginPath();
      ctx.moveTo(sx - 1.8, sy);
      ctx.lineTo(sx + 1.8, sy);
      ctx.moveTo(sx, sy - 1.8);
      ctx.lineTo(sx, sy + 1.8);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();

  const hpWidth = enemy.type === "boss" ? 46 : 36, hpX = x - hpWidth / 2, hpY = y - (enemy.type === "boss" ? 44 : 28);
  ctx.fillStyle = "rgba(15,23,42,.95)"; roundRect(hpX, hpY, hpWidth, 6, 4); ctx.fill();
  ctx.fillStyle = enemy.type === "boss" ? (enemy.bossColor || (currentStage === 6 ? "#c084fc" : "#f59e0b")) : enemy.type === "tank" ? "#fb7185" : enemy.type === "armored" ? "#94a3b8" : enemy.type === "splitter" ? "#2dd4bf" : enemy.type === "fast" ? "#38bdf8" : "#22c55e";
  roundRect(hpX, hpY, hpWidth * hpPct, 6, 4); ctx.fill();
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
    ctx.font = `bold 14px ${FONT_UI}`;
    ctx.textAlign = "center";
    ctx.fillText("★", fx.x, fx.y - 20 - t * 8);
    ctx.restore();
  }
}
function drawImpactBursts(){
  for(const burst of impactBursts){
    const t = 1 - (burst.life / burst.maxLife);
    const alpha = Math.max(0, burst.life / burst.maxLife);
    const radius = burst.innerRadius + (burst.radius - burst.innerRadius) * t;
    ctx.save();
    ctx.globalAlpha = alpha * burst.fillAlpha;
    ctx.fillStyle = burst.fillColor;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * burst.strokeAlpha;
    ctx.strokeStyle = burst.color;
    ctx.lineWidth = Math.max(1, burst.lineWidth * (1 - t * 0.5));
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawParticles(){
  for(const p of particles){
    const alpha=Math.max(0,p.life/p.maxLife);
    const size = p.size || 2.2;
    ctx.save();
    ctx.globalAlpha=alpha;
    if(p.glow){
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.glow;
    }
    ctx.fillStyle=p.color;
    if(p.shape === "diamond"){
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(p.x,p.y,size * 0.5,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha=1;
}

function drawWaveCallChip(){
  if(waveActive || waveCallBonus < 1 || !hasStarted || lives <= 0 || isPaused) return;
  if(pendingAuraChoice || pendingBossResolution) return;
  const gold = Math.floor(waveCallBonus);
  const pct = waveCallBonusMax > 0 ? waveCallBonus / waveCallBonusMax : 0;
  const text = `✦ Early call bonus: +${gold}g`;
  const x = canvas.width / 2, y = 84;
  ctx.save();
  ctx.font = `700 12px ${FONT_UI}`;
  const w = ctx.measureText(text).width + 26, h = 24;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(8,17,31,.88)";
  roundRect(x - w/2, y - h/2, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(94,234,212,.5)";
  ctx.lineWidth = 1.2;
  roundRect(x - w/2, y - h/2, w, h, 12);
  ctx.stroke();
  ctx.fillStyle = "#5eead4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 0.5);
  // decay bar under the chip
  ctx.fillStyle = "rgba(94,234,212,.25)";
  ctx.fillRect(x - w/2 + 6, y + h/2 - 3.5, w - 12, 2);
  ctx.fillStyle = "#5eead4";
  ctx.fillRect(x - w/2 + 6, y + h/2 - 3.5, (w - 12) * pct, 2);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

function drawComboMeter(){
  if(comboCount < 3) return;
  const mult = getComboMultiplier();
  const color = comboCount >= 20 ? "#f472b6" : comboCount >= 10 ? "#fbbf24" : "#5eead4";
  const x = canvas.width / 2, y = 118;
  const popScale = 1 + comboPop * 0.28;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(popScale, popScale);
  ctx.textAlign = "center";
  ctx.font = `700 20px ${FONT_DISPLAY}`;
  ctx.shadowColor = "rgba(2,6,23,.9)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillText(`COMBO x${comboCount}`, 0, 0);
  if(mult > 1){
    ctx.font = `700 11px ${FONT_UI}`;
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fillText(`score ×${mult}`, 0, 15);
  }
  ctx.shadowBlur = 0;
  // shrinking timer bar
  const barW = 74, pct = comboTimer / COMBO_WINDOW;
  ctx.fillStyle = "rgba(15,23,42,.8)";
  ctx.fillRect(-barW/2, 21, barW, 3.5);
  ctx.fillStyle = color;
  ctx.fillRect(-barW/2, 21, barW * pct, 3.5);
  ctx.restore();
  ctx.textAlign = "start";
}

function drawScreenFlashes(){
  for(const flash of screenFlashes){
    const alpha = Math.max(0, flash.life / flash.maxLife) * flash.alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = flash.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}
function drawPopups(){ ctx.save(); ctx.font=`bold 16px ${FONT_UI}`; ctx.textAlign="center"; for(const p of popups){ const alpha=Math.max(0,p.life/p.maxLife); ctx.globalAlpha=alpha; ctx.fillStyle=p.color; ctx.fillText(p.text,p.x,p.y); } ctx.restore(); ctx.globalAlpha=1; }

function drawHUDInsideCanvas(){}


function drawBossHealthBar(){
  const boss = enemies.find(e=>e.type==="boss");
  if(!boss) return;
  const pct = Math.max(0, boss.hp / boss.maxHp);
  const meta = getBossAbilityMeta(boss.bossStage || currentStage);
  const x = canvas.width/2 - 190, y = 12, w = 380, h = 22;
  ctx.fillStyle = "rgba(8,17,31,.84)";
  roundRect(x,y,w,h,10); ctx.fill();
  ctx.strokeStyle = boss.bossColor || (currentStage===6 ? "rgba(192,132,252,.8)" : "rgba(251,191,36,.8)");
  ctx.stroke();
  ctx.fillStyle = boss.bossColor || (currentStage===6 ? "#c084fc" : "#f59e0b");
  roundRect(x+2,y+2,(w-4)*pct,h-4,8); ctx.fill();
  ctx.fillStyle = "rgba(8,17,31,.72)";
  roundRect(canvas.width/2 - 84, y + h + 6, 168, 18, 9); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = `700 12px ${FONT_DISPLAY}`;
  ctx.textAlign = "center";
  ctx.fillText(boss.bossName || "BOSS HP", canvas.width/2, y+15);
  ctx.fillStyle = meta.color;
  ctx.font = `700 10px ${FONT_UI}`;
  ctx.fillText(`Trait: ${meta.short}`, canvas.width/2, y + h + 18);
  ctx.textAlign = "start";
}

function drawBossCastBanner(){
  if(bossCastTimer <= 0 || !bossCastText) return;
  const alpha = Math.min(1, bossCastTimer / 0.24, bossCastTimer);
  const width = Math.max(220, Math.min(380, 160 + bossCastText.length * 8));
  const x = canvas.width / 2 - width / 2;
  const y = 48;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(7,12,22,.82)";
  roundRect(x, y, width, 28, 14);
  ctx.fill();
  ctx.strokeStyle = `${bossCastColor}aa`;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = bossCastColor;
  ctx.font = `700 12px ${FONT_DISPLAY}`;
  ctx.fillText(bossCastText, canvas.width / 2, y + 18);
  ctx.restore();
}

function drawBossMechanicPanel(alpha, stages, y){
  const bossStages = stages.length ? stages : [currentStage];
  const isPair = bossStages.length > 1;
  const width = Math.min(canvas.width - 72, isPair ? 760 : 620);
  const height = isPair ? 126 : 116;
  const x = canvas.width / 2 - width / 2;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(5,8,16,.94)";
  roundRect(x, y, width, height, 18);
  ctx.fill();
  ctx.strokeStyle = isPair ? "rgba(248,113,113,.95)" : "rgba(251,191,36,.88)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = isPair ? "#fecaca" : "#fde68a";
  ctx.font = `800 12px ${FONT_UI}`;
  ctx.fillText(isPair ? "BOSS PAIR - SPECIAL MECHANICS" : "BOSS WAVE - SPECIAL MECHANIC", canvas.width / 2, y + 20);

  if(isPair){
    bossStages.forEach((stageNumber, index)=>{
      const boss = STAGE_BOSS[stageNumber];
      const meta = getBossAbilityMeta(stageNumber);
      ctx.fillStyle = meta.color;
      ctx.font = `700 12px ${FONT_DISPLAY}`;
      ctx.fillText(`${boss?.name || "Boss"}: ${meta.label}`, canvas.width / 2, y + 45 + index * 27, width - 36);
      ctx.fillStyle = "rgba(226,232,240,.88)";
      ctx.font = `600 10px ${FONT_UI}`;
      ctx.fillText(meta.warning, canvas.width / 2, y + 58 + index * 27, width - 42);
    });
    ctx.fillStyle = "#fef3c7";
    ctx.font = `700 10px ${FONT_UI}`;
    ctx.fillText("TIP: Expect both mechanics. Save spells for the most dangerous overlap.", canvas.width / 2, y + 115, width - 40);
  } else {
    const stageNumber = bossStages[0];
    const boss = STAGE_BOSS[stageNumber];
    const meta = getBossAbilityMeta(stageNumber);
    ctx.fillStyle = boss?.color || "#f8fafc";
    ctx.font = `700 19px ${FONT_DISPLAY}`;
    ctx.fillText(boss?.name || "Boss", canvas.width / 2, y + 44, width - 32);
    ctx.fillStyle = meta.color;
    ctx.font = `800 13px ${FONT_UI}`;
    ctx.fillText(`${meta.label}: ${meta.warning}`, canvas.width / 2, y + 68, width - 36);
    ctx.fillStyle = "#fef3c7";
    ctx.font = `700 11px ${FONT_UI}`;
    ctx.fillText(`TIP: ${meta.tip}`, canvas.width / 2, y + 94, width - 40);
  }
  ctx.restore();
}

function drawBossBanner(){
  if(bossBannerTimer<=0) return;
  const alpha=Math.min(1,bossBannerTimer/.45,bossBannerTimer);
  const pulse = currentMode === "endless" ? 1 + Math.sin(performance.now() * 0.014) * 0.02 : 1;
  const imageStages = currentMode === "endless"
    ? (pendingEndlessBossPair.length === 2 ? pendingEndlessBossPair.slice() : [])
    : [currentStage];
  const splashImages = imageStages
    .map(stage => bossSplashImages[stage])
    .filter(img => img && img.complete && img.naturalWidth > 0);

  if(splashImages.length === imageStages.length && splashImages.length > 0){
    const panelY = currentMode === "endless" ? 28 : 20;
    const panelHeight = currentMode === "endless" ? 250 : 290;
    const gap = currentMode === "endless" ? 18 : 0;
    const panelWidth = currentMode === "endless"
      ? Math.min(canvas.width - 72, 340 * splashImages.length + gap * (splashImages.length - 1))
      : Math.min(canvas.width - 80, 420);
    const singleWidth = currentMode === "endless"
      ? (panelWidth - gap * (splashImages.length - 1)) / splashImages.length
      : panelWidth;
    const x = canvas.width / 2 - panelWidth / 2;

    ctx.save();
    ctx.globalAlpha = Math.min(0.32, alpha * 0.34);
    ctx.fillStyle = currentMode === "endless" ? "#140505" : "#08111f";
    ctx.fillRect(0, 0, canvas.width, panelY + panelHeight + 26);

    ctx.globalAlpha = alpha;
    ctx.translate(canvas.width/2, panelY + panelHeight/2);
    ctx.scale(pulse, pulse);
    ctx.translate(-canvas.width/2, -(panelY + panelHeight/2));

    splashImages.forEach((img, idx) => {
      const px = x + idx * (singleWidth + gap);
      const py = panelY;
      ctx.save();
      roundRect(px, py, singleWidth, panelHeight, 20);
      ctx.clip();
      ctx.fillStyle = currentMode === "endless" ? "rgba(8,6,10,0.96)" : "rgba(4,8,18,0.96)";
      ctx.fillRect(px, py, singleWidth, panelHeight);
      const pad = currentMode === "endless" ? 10 : 12;
      const availW = Math.max(10, singleWidth - pad * 2);
      const availH = Math.max(10, panelHeight - pad * 2);
      const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const drawX = px + (singleWidth - drawW) / 2;
      const drawY = py + (panelHeight - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const gradient = ctx.createLinearGradient(0, py, 0, py + panelHeight);
      gradient.addColorStop(0, "rgba(2,6,23,0.04)");
      gradient.addColorStop(0.6, "rgba(2,6,23,0.0)");
      gradient.addColorStop(1, "rgba(2,6,23,0.12)");
      ctx.fillStyle = gradient;
      ctx.fillRect(px, py, singleWidth, panelHeight);
      ctx.restore();
      ctx.lineWidth = currentMode === "endless" ? 2.2 : 2;
      ctx.strokeStyle = currentMode === "endless" ? "rgba(248,113,113,.90)" : "rgba(255,255,255,.22)";
      roundRect(px, py, singleWidth, panelHeight, 20);
      ctx.stroke();
    });

    ctx.restore();
    drawBossMechanicPanel(alpha, imageStages, panelY + panelHeight + 8);
    return;
  }

  const info = getCurrentBossBannerInfo();
  const title = info.title || "WARNING";
  const subtitle = info.subtitle || "";
  const width = Math.max(340, Math.min(640, 220 + Math.max(title.length * 10, subtitle.length * 8)));
  const height = subtitle ? 62 : 44;
  const x = canvas.width/2 - width/2;
  const y = 34;
  ctx.save();
  if(currentMode === "endless"){
    ctx.globalAlpha = Math.min(0.22, alpha * 0.24);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(0, 0, canvas.width, 118);
  }
  ctx.globalAlpha=Math.min(1,alpha);
  ctx.translate(canvas.width/2, y + height/2);
  ctx.scale(pulse, pulse);
  ctx.translate(-canvas.width/2, -(y + height/2));
  ctx.fillStyle=currentMode === "endless" ? "rgba(71,10,10,.82)" : "rgba(127,29,29,.65)";
  roundRect(x,y,width,height,22);
  ctx.fill();
  ctx.strokeStyle=currentMode === "endless" ? "rgba(248,113,113,.95)" : (currentStage===6 ? "rgba(192,132,252,.8)" : "rgba(251,191,36,.7)");
  ctx.lineWidth = currentMode === "endless" ? 2.2 : 1.6;
  ctx.stroke();
  ctx.textAlign="center";
  ctx.fillStyle="#fff7ed";
  ctx.font= currentMode === "endless" ? `700 24px ${FONT_DISPLAY}` : (title.length > 24 ? `700 16px ${FONT_DISPLAY}` : `700 20px ${FONT_DISPLAY}`);
  ctx.fillText(title, canvas.width/2, subtitle ? y + 25 : y + 29);
  if(subtitle){
    ctx.fillStyle = currentMode === "endless" ? "rgba(254,226,226,.9)" : "rgba(226,232,240,.82)";
    ctx.font = currentMode === "endless" ? `700 13px ${FONT_UI}` : `600 11px ${FONT_UI}`;
    ctx.fillText(subtitle, canvas.width/2, y + 44);
  }
  ctx.restore();
  drawBossMechanicPanel(alpha, imageStages, y + height + 10);
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
  ctx.font = `700 22px ${FONT_DISPLAY}`;
  ctx.fillText(waveIntroText, canvas.width/2, y - 2);
  ctx.fillStyle = "rgba(226,232,240,.78)";
  ctx.font = `600 11px ${FONT_UI}`;
  ctx.fillText(waveIntroSubtext, canvas.width/2, y + 16);
  ctx.restore();
}


function drawBossDefeatIntro(){
  if(bossDefeatIntroTimer<=0) return;
  const total = 2.7;
  const progress = 1 - (bossDefeatIntroTimer / total);
  const fadeIn = Math.min(1, progress / 0.14);
  const fadeOut = Math.min(1, bossDefeatIntroTimer / 0.40);
  const alpha = Math.min(fadeIn, fadeOut);
  const modeKey = currentMode === "endless" ? "endless" : "campaign";
  const img = bossDefeatLogoImages[modeKey];
  const panelW = Math.min(canvas.width * 0.78, 760);
  const panelH = panelW * 0.5625;
  const x = canvas.width/2 - panelW/2;
  const y = canvas.height * 0.22 - (1 - alpha) * 14;

  ctx.save();
  ctx.globalAlpha = alpha;

  if(img && img.complete && img.naturalWidth){
    ctx.shadowColor = currentMode === "endless" ? "rgba(168,85,247,.38)" : "rgba(248,113,113,.34)";
    ctx.shadowBlur = 28;
    ctx.drawImage(img, x, y, panelW, panelH);
  } else {
    roundRect(x, y + 28, panelW, panelH - 56, 26);
    ctx.fillStyle = currentMode === "endless" ? "rgba(26,8,34,.84)" : "rgba(18,8,8,.84)";
    ctx.fill();
    ctx.strokeStyle = currentMode === "endless" ? "rgba(192,132,252,.35)" : "rgba(248,113,113,.34)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = `700 34px ${FONT_DISPLAY}`;
    ctx.fillText(bossDefeatIntroText || "AN ANCIENT EVIL FALLS", canvas.width/2, y + panelH/2 + 8);
  }

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
  ctx.font = `700 24px ${FONT_DISPLAY}`;
  ctx.fillText(stageQuoteText, canvas.width / 2, y + 44);

  ctx.fillStyle = "rgba(226,232,240,0.72)";
  ctx.font = `600 12px ${FONT_UI}`;
  ctx.fillText(stageQuoteSubtext, canvas.width / 2, y + 72);

  ctx.restore();
}

function drawBossAbilityFx(){
  if(bossTelegraphTimer > 0 && bossTelegraphType){
    const boss = enemies.find(e => e.type === "boss");
    const meta = getBossAbilityMeta(bossTelegraphStage || boss?.bossStage || currentStage);
    const alpha = Math.min(1, bossTelegraphTimer / 0.25, bossTelegraphTimer);
    ctx.save();
    ctx.globalAlpha = 0.16 * alpha;
    ctx.fillStyle = meta.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(boss){
      const pos = getPathPosition(boss.progress);
      ctx.globalAlpha = 0.72 * alpha;
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30 + Math.sin(performance.now() * 0.02) * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 48 + Math.sin(performance.now() * 0.018 + 1.3) * 7, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

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

  if(bossFxType === "roots"){
    ctx.save();
    ctx.globalAlpha = 0.20 * alpha;
    ctx.fillStyle = "#22c55e";
    for(const unit of units){
      if((unit.snaredUntil || 0) > performance.now()){
        const pos = cellCenter(unit.c, unit.r);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 34 + Math.sin(performance.now() * 0.012 + unit.id) * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  const shake = getShakeOffset();
  ctx.setTransform(view.scale, 0, 0, view.scale, view.offsetX + shake.x, view.offsetY + shake.y);
  drawBackground();
  drawSpawnPortal();
  drawPathAtmosphere();
  drawPath();
  drawStageLighting();
  drawGate();
  drawTerrainFeatures();
  drawPlacementPreview();
  drawUnits();
  drawEnemies();
  drawProjectiles();
  drawPlacementEffects();
  drawUpgradeEffects();
  drawImpactBursts();
  drawParticles();
  drawPopups();
  ctx.restore();

  drawScreenFlashes();
  drawWaveCallChip();
  drawComboMeter();
  drawHUDInsideCanvas();
  drawBossAbilityFx();
  drawBossHealthBar();
  drawBossCastBanner();
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
      handleOnboardingUnitSelection(selectedUnitType);
    });
  });
}

bindUnitSelectorButtons(unitButtons);
bindUnitSelectorButtons(unitInfoButtons);

onboardingSkipBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  finishOnboarding(true);
});

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
  if(!hasStarted || lives<=0 || isPaused) return;
  if(spellCooldown.slow > 0){ showSpellCooldownFeedback("slow", spellSlowBtn); return; }
  selectedSpell = selectedSpell === "slow" ? null : "slow";
  setMessage(selectedSpell === "slow" ? "Choose the target area for Frost Nova." : "Spell canceled.");
  updateSpellButtons();
});

spellDamageBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || isPaused) return;
  if(spellCooldown.damage > 0){ showSpellCooldownFeedback("damage", spellDamageBtn); return; }
  selectedSpell = selectedSpell === "damage" ? null : "damage";
  setMessage(selectedSpell === "damage" ? "Choose the target area for Meteor Strike." : "Spell canceled.");
  updateSpellButtons();
});

spellBombBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  if(!hasStarted || lives<=0 || isPaused) return;
  if(spellCooldown.bomb > 0){ showSpellCooldownFeedback("bomb", spellBombBtn); return; }
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
  requestAnimationFrame(()=>{
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    canvasWrap?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });
    beginOnboarding();
  });
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

window.addEventListener("resize", syncEndlessUnlockArtworkBounds);
endlessUnlockArtworkImage?.addEventListener("load", syncEndlessUnlockArtworkBounds);

updateAudioToggle();
applyHudVisibility();
applyStage(1,true);
loadPanelUserSession();
loadBonusLeaderboard();
prewarmLeaderboardRun("campaign");
updateLeyBadges();
draw();
requestAnimationFrame(gameLoop);


/* Zoom removed by design — the camera is fixed at scale 1.
   The wheel now scrolls the page normally, and two-finger
   gestures on mobile are left to the browser. */

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
  setMessage(isMuted ? "Audio off." : "Audio on.");
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
  const isCollapsed = notificationPanel?.classList.contains("collapsed");
  notificationToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  notificationToggle.setAttribute("aria-label", isCollapsed ? "Expand notifications" : "Collapse notifications");
  if(!isCollapsed){
    notificationBadge?.classList.add("hidden");
  }
});

coreStatsToggle?.addEventListener("click",()=>{
  overviewCard?.classList.toggle("collapsed");
  const isCollapsed = overviewCard?.classList.contains("collapsed");
  coreStatsToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  coreStatsToggle.setAttribute("aria-label", isCollapsed ? "Expand core stats" : "Collapse core stats");
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

panelHeaderLogoutBtn?.addEventListener("click", async (event)=>{
  event.preventDefault();
  try{
    const response = await fetch("/.netlify/functions/logout", {
      method: "POST",
      credentials: "include"
    });
    if(!response.ok) return;
    window.location.reload();
  }catch(_){}
});
