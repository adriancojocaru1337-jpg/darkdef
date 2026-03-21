CREATE TABLE IF NOT EXISTS password_resets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS password_resets_token_hash_uidx
  ON password_resets (token_hash);

CREATE INDEX IF NOT EXISTS password_resets_user_id_idx
  ON password_resets (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS password_resets_ip_hash_idx
  ON password_resets (ip_hash, created_at DESC);
