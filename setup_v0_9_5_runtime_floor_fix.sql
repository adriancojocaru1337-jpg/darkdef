-- v0.9.5 — rankings fix for endless / daily runs played at game speed x2 / x3.
--
-- The old minimum-runtime heuristic in submit-score.js assumed x1 pacing and
-- added wave time and kill time together, so real runs were rejected with
-- "Run completed too quickly" and the IP was blocklisted for 30 minutes.
-- No schema change is needed — this only clears the fallout.

-- 1. Release IPs that were blocked by the timing false positives.
delete from blocked_ips
where reason in ('Run completed too quickly', 'Run timing mismatch');

-- 2. See how much of the leaderboard traffic this was eating (last 7 days).
select
  rejection_reason,
  count(*)::int as attempts,
  max(created_at) as last_seen
from score_submissions
where accepted = false
  and created_at > now() - interval '7 days'
group by rejection_reason
order by attempts desc;

-- 3. Optional: the runs that were wrongly marked rejected are already lost
--    (their score was never inserted). This just lists them for the record.
select run_id, mode, wave_reached, kills, score_total, submitted_at
from game_runs
where status = 'rejected'
  and rejection_reason in ('Run completed too quickly', 'Run timing mismatch')
order by submitted_at desc
limit 50;
