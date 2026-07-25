-- Hero Power leaderboard.
-- One row per authenticated user; power is their current total Hero Power
-- (equipment power + skill investment). Because power is computed client-side
-- it is trust-on-submit: we gate on auth, a plausibility cap, and rate limits,
-- but this board is not as tamper-resistant as the run-based score boards.

create table if not exists power_leaderboard (
  user_id bigint primary key references users(id) on delete cascade,
  player_name text not null,
  power integer not null default 0,
  equipment_power integer not null default 0,
  skill_points integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists power_leaderboard_power_idx
  on power_leaderboard (power desc, updated_at asc);
