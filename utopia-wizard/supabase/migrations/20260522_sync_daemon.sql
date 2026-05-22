-- Tables that back the remote sync feature: a local listener daemon writes
-- its current git porcelain into `sync_status`, and the deployed wizard
-- queues commands by inserting into `sync_requests`. The daemon polls,
-- executes, and writes the outcome back.

-- One row per machine. Keep machine_id constant per-host (default 'default'
-- for single-user setups; daemon can override via env var).
CREATE TABLE IF NOT EXISTS sync_status (
  machine_id text PRIMARY KEY,
  branch text,
  pending_count integer NOT NULL DEFAULT 0,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  daemon_pid integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id text NOT NULL DEFAULT 'default',
  mode text NOT NULL CHECK (mode IN ('pr', 'main')),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'error')),
  result jsonb,
  requested_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz
);

-- Daemon polls "pending" rows, so a small index pays for itself.
CREATE INDEX IF NOT EXISTS sync_requests_pending_idx
  ON sync_requests (machine_id, status, requested_at)
  WHERE status = 'pending';

-- The deployed wizard polls completed/in-flight rows so the UI can show
-- progress. Limit retention to 7 days so the table doesn't grow forever.
-- (Run manually or via cron; not enforced as a constraint.)
COMMENT ON TABLE sync_requests IS 'Queue of sync commands written by the deployed wizard, consumed by the local sync-listener daemon. Prune rows older than 7 days.';

-- Public reads are fine (the only sensitive data is commit messages users
-- already chose to ship). Writes require the service-role key.
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS sync_status_read
  ON sync_status FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS sync_requests_read
  ON sync_requests FOR SELECT
  USING (true);

-- Insert (requesting a sync) is also fine for the anon key, since the
-- daemon validates the request server-side. Writers can only INSERT, not
-- UPDATE/DELETE — the daemon (service role) owns mutation.
CREATE POLICY IF NOT EXISTS sync_requests_insert
  ON sync_requests FOR INSERT
  WITH CHECK (true);
