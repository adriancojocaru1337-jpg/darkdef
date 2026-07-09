
create table if not exists leaderboard_scores (
  id bigserial primary key,
  player_name text not null,
  score_total integer not null,
  bonus_score integer not null default 0,
  wave_reached integer not null,
  kills integer not null default 0,
  mode text not null default 'endless',
  run_id text unique,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_bonus_idx
  on leaderboard_scores (mode, bonus_score desc, wave_reached desc, created_at asc);

create index if not exists leaderboard_scores_ip_idx
  on leaderboard_scores (ip_hash, created_at desc);

create table if not exists game_runs (
  id bigserial primary key,
  run_id text not null unique,
  mode text not null default 'endless',
  token_signature text not null,
  token_expires_at timestamptz not null,
  ip_hash text not null,
  user_agent_hash text not null,
  origin_host text,
  status text not null default 'active',
  rejection_reason text,
  player_name text,
  score_total integer,
  bonus_score integer,
  wave_reached integer,
  kills integer,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists game_runs_active_idx
  on game_runs (status, token_expires_at desc);

create table if not exists score_submissions (
  id bigserial primary key,
  run_id text,
  ip_hash text not null,
  player_name text,
  accepted boolean not null default false,
  rejection_reason text,
  score_total integer,
  bonus_score integer,
  wave_reached integer,
  kills integer,
  created_at timestamptz not null default now()
);

create index if not exists score_submissions_ip_idx
  on score_submissions (ip_hash, created_at desc);

create index if not exists score_submissions_name_idx
  on score_submissions (player_name, created_at desc);

create table if not exists blocked_ips (
  id bigserial primary key,
  ip_hash text not null unique,
  blocked_until timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
