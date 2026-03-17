create table if not exists leaderboard_scores (
  id bigserial primary key,
  player_name text not null,
  score_total integer not null,
  bonus_score integer not null default 0,
  wave_reached integer not null,
  kills integer not null default 0,
  mode text not null default 'endless',
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_bonus_idx
  on leaderboard_scores (mode, bonus_score desc, wave_reached desc, created_at asc);