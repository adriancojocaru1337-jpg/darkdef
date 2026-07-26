const { sql } = require("./auth-utils");

exports.handler = async function handler() {
  try {
    await sql`
      with expired_runs as (
        delete from game_runs
        where token_expires_at < now() - interval '7 days'
        returning id
      ),
      old_attempts as (
        delete from score_submissions
        where created_at < now() - interval '30 days'
        returning id
      ),
      expired_blocks as (
        delete from blocked_ips
        where blocked_until < now() - interval '1 day'
        returning id
      ),
      old_limits as (
        delete from run_start_limits
        where updated_at < now() - interval '1 day'
        returning ip_hash
      ),
      old_resets as (
        delete from password_resets
        where expires_at < now() - interval '7 days'
        returning id
      )
      select
        (select count(*)::int from expired_runs) as expired_runs,
        (select count(*)::int from old_attempts) as old_attempts,
        (select count(*)::int from expired_blocks) as expired_blocks,
        (select count(*)::int from old_limits) as old_limits,
        (select count(*)::int from old_resets) as old_resets
    `;
    return { statusCode: 200 };
  } catch (error) {
    console.error("cleanup-security-data failed", error);
    return { statusCode: 500 };
  }
};
