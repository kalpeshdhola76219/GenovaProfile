-- GenovaProfile Authoritative PostgreSQL Database Schema
-- For Supabase / PostgreSQL database

CREATE TABLE IF NOT EXISTS guest_sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  mobile TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  guest_session_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  document_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  pdf_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  cashfree_order_id TEXT UNIQUE NOT NULL,
  document_id TEXT NOT NULL,
  guest_session_id TEXT NOT NULL,
  mobile TEXT NOT NULL,
  customer_email TEXT,
  receipt_id TEXT,
  recovery_code_hash TEXT,
  restore_attempts INT DEFAULT 0,
  restore_locked_until TIMESTAMPTZ,
  code_shown BOOLEAN DEFAULT FALSE,
  receipt_email_sent BOOLEAN DEFAULT FALSE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created',
  template_id TEXT,
  document_title TEXT,
  consent JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  cashfree_payment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  order_ref TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate Limits Table for Distributed Serverless Rate Limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL
);

-- Indices for rapid indexing & lookups
CREATE INDEX IF NOT EXISTS idx_orders_cf_id ON orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_doc_id ON orders(document_id);
CREATE INDEX IF NOT EXISTS idx_orders_mobile ON orders(mobile);
CREATE INDEX IF NOT EXISTS idx_documents_session ON documents(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);

-- Atomic Rate Limiting Function
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_key TEXT,
  p_limit INT,
  p_window_ms BIGINT
) RETURNS TABLE (
  allowed BOOLEAN,
  current_count INT,
  reset_at TIMESTAMPTZ,
  retry_after_seconds INT
) AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_reset_at TIMESTAMPTZ;
  v_count INT;
BEGIN
  INSERT INTO rate_limits (key, count, reset_at)
  VALUES (p_key, 1, v_now + (p_window_ms || ' milliseconds')::INTERVAL)
  ON CONFLICT (key) DO UPDATE
  SET
    count = CASE
      WHEN rate_limits.reset_at <= v_now THEN 1
      ELSE rate_limits.count + 1
    END,
    reset_at = CASE
      WHEN rate_limits.reset_at <= v_now THEN v_now + (p_window_ms || ' milliseconds')::INTERVAL
      ELSE rate_limits.reset_at
    END
  RETURNING rate_limits.count, rate_limits.reset_at INTO v_count, v_reset_at;

  RETURN QUERY SELECT
    (v_count <= p_limit) AS allowed,
    v_count AS current_count,
    v_reset_at AS reset_at,
    GREATEST(0, CEIL(EXTRACT(EPOCH FROM (v_reset_at - v_now))))::INT AS retry_after_seconds;
END;
$$ LANGUAGE plpgsql;


-- Webhook events table (used by server/db.ts)
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  order_id TEXT,
  event_type TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT TRUE,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- Atomic order confirmation (used by db.confirmOrderPaid via rpc)
CREATE OR REPLACE FUNCTION confirm_order_paid(
  p_order_id TEXT,
  p_cashfree_payment_id TEXT,
  p_paid_amount NUMERIC,
  p_payment_method TEXT
) RETURNS JSONB AS $$
DECLARE
  v_order orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'order_not_found');
  END IF;
  IF v_order.status = 'paid' THEN
    RETURN jsonb_build_object('ok', true, 'alreadyPaid', true);
  END IF;
  IF p_paid_amount < v_order.amount THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'amount_mismatch');
  END IF;
  UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = p_order_id;
  INSERT INTO payments (id, order_id, cashfree_payment_id, status, amount, payment_method)
  VALUES ('pay_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16),
          p_order_id, p_cashfree_payment_id, 'SUCCESS', p_paid_amount, p_payment_method);
  UPDATE documents SET status = 'paid', updated_at = NOW() WHERE id = v_order.document_id;
  RETURN jsonb_build_object('ok', true, 'alreadyPaid', false);
END;
$$ LANGUAGE plpgsql;

-- Row Level Security: block public (anon) access. The server uses the
-- service-role key, which bypasses RLS, so the app keeps working.
ALTER TABLE guest_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events   ENABLE ROW LEVEL SECURITY;
