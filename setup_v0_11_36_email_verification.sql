-- Ashen Bastion v0.11.36 - email verification
-- Run once in the Neon SQL Editor, after setup_v0_11_35_account_security.sql.

alter table users
  add column if not exists email_verified boolean not null default false,
  add column if not exists email_verified_at timestamptz;

-- Grandfather every account that already exists: these players registered
-- before verification existed and must not be locked out.
update users
set email_verified = true,
    email_verified_at = coalesce(email_verified_at, now())
where email_verified = false;

create table if not exists email_verifications (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_verifications_user
  on email_verifications (user_id);

create index if not exists idx_email_verifications_open
  on email_verifications (token_hash)
  where used = false;

-- Housekeeping: drop consumed or expired rows older than 7 days.
delete from email_verifications
where created_at < now() - interval '7 days'
  and (used = true or expires_at < now());
