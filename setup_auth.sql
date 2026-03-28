create table if not exists users (
  id bigserial primary key,
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists user_profiles (
  user_id bigint primary key references users(id) on delete cascade,
  best_endless_score integer not null default 0,
  best_story_stage integer not null default 1,
  total_kills integer not null default 0,
  total_runs integer not null default 0,
  crest_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_sessions (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on users (email);
create index if not exists users_username_lower_idx on users ((lower(username)));
create index if not exists user_sessions_user_idx on user_sessions (user_id, expires_at desc);
create index if not exists user_sessions_exp_idx on user_sessions (expires_at desc);

alter table leaderboard_scores
  add column if not exists user_id bigint references users(id) on delete set null;

alter table user_profiles
  add column if not exists crest_id text;

create index if not exists leaderboard_scores_user_idx
  on leaderboard_scores (user_id, created_at desc);
