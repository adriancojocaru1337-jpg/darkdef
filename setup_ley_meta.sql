-- Ley Attunement meta progression (run this once on Neon)
create table if not exists player_ley_meta (
  user_id bigint primary key references users(id) on delete cascade,
  total_earned integer not null default 0,
  spent_crystals integer not null default 0,
  talents jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table player_ley_meta
  add column if not exists spent_crystals integer not null default 0;

create table if not exists username_renames (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  previous_username text not null,
  new_username text not null,
  crystal_cost integer not null,
  created_at timestamptz not null default now()
);

create index if not exists username_renames_user_time_idx
  on username_renames (user_id, created_at desc);
