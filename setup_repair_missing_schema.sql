-- ============================================================
-- Ashen Bastion — repair migration
-- Run this whole file once in Neon. Everything is idempotent
-- (if not exists), so it is safe on a database that is already
-- partially migrated.
--
-- Why: run_start_limits was missing, and start-run.js inserts into
-- game_runs through a CTE that depends on it. A missing table made
-- the whole statement fail, so start-run returned 500 on every call
-- and no run was ever recorded.
-- ============================================================


-- ---------- STEP 1: what is actually missing? ----------
-- Run this first on its own if you want to see the damage.

select expected.name,
       case when c.relname is null then 'MISSING' else 'ok' end as status
from (values
  ('users'), ('user_profiles'), ('user_sessions'),
  ('leaderboard_scores'), ('game_runs'), ('score_submissions'),
  ('blocked_ips'), ('run_start_limits'), ('username_renames'),
  ('player_ley_meta'), ('password_resets'), ('hero_loadouts'),
  ('power_leaderboard')
) as expected(name)
left join pg_class c
  on c.relname = expected.name
 and c.relkind = 'r'
 and c.relnamespace = 'public'::regnamespace
order by status, expected.name;

-- Columns added by later migrations.
select 'leaderboard_scores.daily_key' as column_name,
       count(*)::int as present
from information_schema.columns
where table_name = 'leaderboard_scores' and column_name = 'daily_key'
union all
select 'player_ley_meta.spent_crystals',
       count(*)::int
from information_schema.columns
where table_name = 'player_ley_meta' and column_name = 'spent_crystals';


-- ---------- STEP 2: the table that breaks start-run ----------

create table if not exists run_start_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);


-- ---------- STEP 3: Ley meta progression ----------
-- player_ley_meta was missing too, which breaks get-ley-meta / save-ley-meta:
-- Crystal totals and talent purchases never persist to the account. The table
-- must be CREATED before the spent_crystals column can be added to it.

create table if not exists player_ley_meta (
  user_id bigint primary key references users(id) on delete cascade,
  total_earned integer not null default 0,
  spent_crystals integer not null default 0,
  talents jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- No-op on a fresh create above; needed if the table predates v0.9.4.
alter table player_ley_meta
  add column if not exists spent_crystals integer not null default 0;


-- ---------- STEP 4: the rest of the v0.9.4 migration ----------

create index if not exists game_runs_expiry_idx
  on game_runs (token_expires_at);

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

-- Case-insensitive unique usernames. This raises if duplicates exist;
-- resolve them and re-run if it fires.
do $$
begin
  if exists (
    select 1 from users group by lower(username) having count(*) > 1
  ) then
    raise exception
      'Duplicate usernames differing only by case — resolve them first.';
  end if;
end
$$;

create unique index if not exists users_username_lower_uidx
  on users ((lower(username)));

drop index if exists users_username_lower_idx;


-- ---------- STEP 5: daily leaderboard column ----------

alter table leaderboard_scores add column if not exists daily_key text;

create index if not exists leaderboard_scores_daily_idx
  on leaderboard_scores (mode, daily_key, wave_reached desc, bonus_score desc);


-- ---------- STEP 6: clear the fallout ----------

-- IPs blocked by the old timing false positives.
delete from blocked_ips
where reason in ('Run completed too quickly', 'Run timing mismatch');

-- Abandoned run tokens from the failed period.
update game_runs
set status = 'expired', updated_at = now()
where status = 'active'
  and started_at < now() - interval '6 hours';


-- ---------- STEP 7: confirm ----------

-- Re-run the STEP 1 inventory; every row should now read 'ok'.
select expected.name,
       case when c.relname is null then 'MISSING' else 'ok' end as status
from (values
  ('users'), ('user_profiles'), ('user_sessions'),
  ('leaderboard_scores'), ('game_runs'), ('score_submissions'),
  ('blocked_ips'), ('run_start_limits'), ('username_renames'),
  ('player_ley_meta'), ('password_resets'), ('hero_loadouts'),
  ('power_leaderboard')
) as expected(name)
left join pg_class c
  on c.relname = expected.name
 and c.relkind = 'r'
 and c.relnamespace = 'public'::regnamespace
order by status, expected.name;
