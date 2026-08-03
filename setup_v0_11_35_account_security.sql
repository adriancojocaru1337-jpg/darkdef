-- Ashen Bastion v0.11.35 - account security
-- Adds storage for verified email changes. Run once in the Neon SQL Editor.

create table if not exists email_change_requests (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  new_email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_change_requests_user
  on email_change_requests (user_id);

create index if not exists idx_email_change_requests_open
  on email_change_requests (token_hash)
  where used = false;

-- Housekeeping: drop consumed or expired rows older than 7 days.
delete from email_change_requests
where created_at < now() - interval '7 days'
  and (used = true or expires_at < now());
