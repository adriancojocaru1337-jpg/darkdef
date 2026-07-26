function getProfileContribution({ mode, waveReached, killsCount, bonus, runComplete }) {
  const countLifetimeStats = mode !== "campaign" || runComplete === true;
  return {
    bestEndlessScore: mode === "endless" ? bonus : 0,
    bestStoryStage: mode === "campaign" ? waveReached : 1,
    lifetimeKills: countLifetimeStats ? killsCount : 0,
    lifetimeRuns: countLifetimeStats ? 1 : 0
  };
}

module.exports = { getProfileContribution };
