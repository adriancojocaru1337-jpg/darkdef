-- Hero loadout snapshot for public profiles.
-- One row per user. Because equipment/skills are computed client-side, this is
-- trust-on-submit (like power_leaderboard) — it is a display convenience, not a
-- verified record. The loadout is stored as JSON: equipped items per slot, a
-- skill summary, and the total power at submit time.

create table if not exists hero_loadouts (
  user_id bigint primary key references users(id) on delete cascade,
  power integer not null default 0,
  equipment_power integer not null default 0,
  skill_points integer not null default 0,
  loadout jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
