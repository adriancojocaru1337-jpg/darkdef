-- Ashen Bastion Cloud Save (v0.11.27)
-- Run once in the same Neon database used by the existing account functions.

create table if not exists player_game_state (
  user_id bigint primary key references users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  revision bigint not null default 1 check (revision >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_player_game_state_updated_at
  on player_game_state (updated_at desc);

