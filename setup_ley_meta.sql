-- Ley Attunement meta progression (run this once on Neon)
create table if not exists player_ley_meta (
  user_id bigint primary key references users(id) on delete cascade,
  total_earned integer not null default 0,
  talents jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
