-- Dark Defense — Daily Challenge leaderboard migration
-- Run this once in Neon / Netlify DB (after setup_leaderboard.sql).

alter table leaderboard_scores add column if not exists daily_key text;

create index if not exists leaderboard_scores_daily_idx
  on leaderboard_scores (mode, daily_key, wave_reached desc, bonus_score desc);
