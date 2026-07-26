-- Ashen Bastion v0.9.4 security and integrity migration.
-- Apply this once after the existing setup scripts and before deploying the
-- matching Netlify Functions.

create index if not exists game_runs_expiry_idx
  on game_runs (token_expires_at);

create table if not exists run_start_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
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

do $$
begin
  if exists (
    select 1
    from users
    group by lower(username)
    having count(*) > 1
  ) then
    raise exception
      'Cannot enforce case-insensitive usernames: resolve duplicate names that differ only by letter case first.';
  end if;
end
$$;

create unique index if not exists users_username_lower_uidx
  on users ((lower(username)));

drop index if exists users_username_lower_idx;
