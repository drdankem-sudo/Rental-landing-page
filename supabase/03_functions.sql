-- ============================================================
-- Base.ke — Database Functions
-- Paste this into Supabase SQL Editor AFTER running 02_rls_policies.sql
-- ============================================================

-- ═══════ DASHBOARD STATS ═══════
-- Returns overview stats for a property in a single RPC call

CREATE OR REPLACE FUNCTION get_dashboard_stats(prop_id UUID)
RETURNS JSON AS $$
DECLARE
  current_month TEXT;
  total_units INT;
  occupied_units INT;
  expected_rent BIGINT;
  collected_rent BIGINT;
  unmatched_count INT;
  collection_rate INT;
  occupancy_rate INT;
BEGIN
  -- Verify access
  IF NOT has_property_access(prop_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  current_month := to_char(now(), 'YYYY-MM');

  SELECT count(*) INTO total_units FROM units WHERE property_id = prop_id;
  SELECT count(*) INTO occupied_units FROM units WHERE property_id = prop_id AND status = 'OCCUPIED';

  SELECT COALESCE(sum(t.rent_amount), 0) INTO expected_rent
  FROM tenancies t JOIN units u ON t.unit_id = u.id
  WHERE u.property_id = prop_id AND t.status = 'ACTIVE';

  SELECT COALESCE(sum(amount), 0) INTO collected_rent
  FROM payments
  WHERE property_id = prop_id
    AND month = current_month
    AND status IN ('MATCHED', 'MANUALLY_MATCHED', 'PARTIAL', 'OVERPAYMENT');

  SELECT count(*) INTO unmatched_count
  FROM payments WHERE property_id = prop_id AND status = 'UNMATCHED';

  collection_rate := CASE WHEN expected_rent > 0 THEN round((collected_rent::NUMERIC / expected_rent) * 100) ELSE 0 END;
  occupancy_rate := CASE WHEN total_units > 0 THEN round((occupied_units::NUMERIC / total_units) * 100) ELSE 0 END;

  RETURN json_build_object(
    'totalUnits', total_units,
    'occupiedUnits', occupied_units,
    'vacantUnits', total_units - occupied_units,
    'occupancyRate', occupancy_rate,
    'expectedRent', expected_rent,
    'collectedRent', collected_rent,
    'collectionRate', collection_rate,
    'unmatchedPayments', unmatched_count,
    'currentMonth', current_month
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════ MONTHLY COLLECTIONS (last N months) ═══════

CREATE OR REPLACE FUNCTION get_monthly_collections(prop_id UUID, num_months INT DEFAULT 6)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT has_property_access(prop_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT
      to_char(d, 'YYYY-MM') AS month,
      COALESCE(sum(p.amount), 0) AS total
    FROM generate_series(
      date_trunc('month', now()) - ((num_months - 1) || ' months')::INTERVAL,
      date_trunc('month', now()),
      '1 month'
    ) AS d
    LEFT JOIN payments p
      ON p.property_id = prop_id
      AND p.month = to_char(d, 'YYYY-MM')
      AND p.status IN ('MATCHED', 'MANUALLY_MATCHED', 'PARTIAL', 'OVERPAYMENT')
    GROUP BY d
    ORDER BY d
  ) t;

  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════ ARREARS ═══════

CREATE OR REPLACE FUNCTION get_arrears(prop_id UUID)
RETURNS JSON AS $$
DECLARE
  current_month TEXT;
  result JSON;
BEGIN
  IF NOT has_property_access(prop_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  current_month := to_char(now(), 'YYYY-MM');

  SELECT json_agg(row_to_json(a)) INTO result
  FROM (
    SELECT
      json_build_object('id', pr.id, 'name', pr.name, 'phone', pr.phone) AS tenant,
      json_build_object('id', u.id, 'unitNumber', u.unit_number) AS unit,
      t.rent_amount AS "rentAmount",
      COALESCE(paid.total, 0) AS "paidAmount",
      t.rent_amount - COALESCE(paid.total, 0) AS owing
    FROM tenancies t
    JOIN units u ON t.unit_id = u.id
    JOIN profiles pr ON t.tenant_id = pr.id
    LEFT JOIN (
      SELECT tenancy_id, sum(amount) AS total
      FROM payments
      WHERE month = current_month
        AND status IN ('MATCHED', 'MANUALLY_MATCHED', 'PARTIAL')
      GROUP BY tenancy_id
    ) paid ON paid.tenancy_id = t.id
    WHERE u.property_id = prop_id
      AND t.status = 'ACTIVE'
      AND t.rent_amount - COALESCE(paid.total, 0) > 0
    ORDER BY owing DESC
  ) a;

  RETURN json_build_object('arrears', COALESCE(result, '[]'::JSON), 'month', current_month);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════ PAYMENT MATCHING ═══════
-- Called by Edge Function after M-Pesa callback

CREATE OR REPLACE FUNCTION match_payment(payment_id UUID)
RETURNS JSON AS $$
DECLARE
  pay RECORD;
  matched_tenancy RECORD;
  new_status payment_status;
  pay_month TEXT;
  receipt TEXT;
  receipt_count INT;
BEGIN
  SELECT * INTO pay FROM payments WHERE id = payment_id;
  IF NOT FOUND OR pay.status != 'UNMATCHED' THEN
    RETURN json_build_object('matched', false, 'reason', 'not found or already matched');
  END IF;

  -- Strategy 1: Match by phone → active tenancy in this property
  IF pay.mpesa_phone IS NOT NULL THEN
    SELECT t.* INTO matched_tenancy
    FROM tenancies t
    JOIN profiles pr ON t.tenant_id = pr.id
    JOIN units u ON t.unit_id = u.id
    WHERE pr.phone = pay.mpesa_phone
      AND u.property_id = pay.property_id
      AND t.status = 'ACTIVE'
    LIMIT 1;
  END IF;

  -- Strategy 2: Match by account reference → unit number
  IF matched_tenancy IS NULL AND pay.account_reference IS NOT NULL THEN
    SELECT t.* INTO matched_tenancy
    FROM tenancies t
    JOIN units u ON t.unit_id = u.id
    WHERE u.property_id = pay.property_id
      AND upper(trim(u.unit_number)) = upper(trim(pay.account_reference))
      AND t.status = 'ACTIVE'
    LIMIT 1;
  END IF;

  IF matched_tenancy IS NULL THEN
    RETURN json_build_object('matched', false, 'reason', 'no matching tenancy found');
  END IF;

  -- Determine status
  IF pay.amount < matched_tenancy.rent_amount THEN
    new_status := 'PARTIAL';
  ELSIF pay.amount > matched_tenancy.rent_amount THEN
    new_status := 'OVERPAYMENT';
  ELSE
    new_status := 'MATCHED';
  END IF;

  pay_month := to_char(pay.paid_at, 'YYYY-MM');

  -- Update payment
  UPDATE payments SET
    unit_id = matched_tenancy.unit_id,
    tenancy_id = matched_tenancy.id,
    status = new_status,
    month = pay_month
  WHERE id = payment_id;

  -- Generate receipt
  SELECT count(*) INTO receipt_count FROM receipts;
  receipt := 'BK-' || extract(YEAR FROM now())::TEXT || '-' || lpad((receipt_count + 1)::TEXT, 5, '0');

  INSERT INTO receipts (payment_id, receipt_no, tenant_phone, amount)
  SELECT
    payment_id,
    receipt,
    pr.phone,
    pay.amount
  FROM profiles pr WHERE pr.id = matched_tenancy.tenant_id;

  RETURN json_build_object(
    'matched', true,
    'status', new_status::TEXT,
    'unitId', matched_tenancy.unit_id,
    'tenancyId', matched_tenancy.id,
    'month', pay_month,
    'receiptNo', receipt
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════ MANUAL MATCH ═══════

CREATE OR REPLACE FUNCTION manual_match_payment(payment_id UUID, target_unit_id UUID, target_month TEXT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  ten RECORD;
BEGIN
  SELECT * INTO ten FROM tenancies WHERE unit_id = target_unit_id AND status = 'ACTIVE' LIMIT 1;

  UPDATE payments SET
    unit_id = target_unit_id,
    tenancy_id = ten.id,
    status = 'MANUALLY_MATCHED',
    month = COALESCE(target_month, month)
  WHERE id = payment_id;

  RETURN json_build_object('matched', true, 'status', 'MANUALLY_MATCHED');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════ GENERATE RECEIPT NUMBER ═══════

CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
  yr TEXT;
  cnt INT;
BEGIN
  yr := extract(YEAR FROM now())::TEXT;
  SELECT count(*) INTO cnt FROM receipts;
  RETURN 'BK-' || yr || '-' || lpad((cnt + 1)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql STABLE;

-- ═══════ ASSIGN TENANT TO UNIT ═══════

CREATE OR REPLACE FUNCTION assign_tenant(
  p_unit_id UUID,
  p_tenant_id UUID,
  p_rent_amount INT,
  p_deposit_paid INT DEFAULT 0,
  p_start_date DATE DEFAULT CURRENT_DATE,
  p_lease_doc_url TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  prop_id UUID;
  tenancy_record RECORD;
BEGIN
  SELECT property_id INTO prop_id FROM units WHERE id = p_unit_id;
  IF NOT has_property_access(prop_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO tenancies (unit_id, tenant_id, rent_amount, deposit_paid, start_date, lease_doc_url)
  VALUES (p_unit_id, p_tenant_id, p_rent_amount, p_deposit_paid, p_start_date, p_lease_doc_url)
  RETURNING * INTO tenancy_record;

  UPDATE units SET status = 'OCCUPIED' WHERE id = p_unit_id;

  RETURN row_to_json(tenancy_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════ MOVE OUT ═══════

CREATE OR REPLACE FUNCTION move_out_tenant(p_tenancy_id UUID, p_end_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  ten RECORD;
BEGIN
  UPDATE tenancies SET status = 'ENDED', end_date = p_end_date
  WHERE id = p_tenancy_id
  RETURNING * INTO ten;

  UPDATE units SET status = 'VACANT' WHERE id = ten.unit_id;

  RETURN row_to_json(ten);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════ GIVE NOTICE ═══════

CREATE OR REPLACE FUNCTION give_notice(p_tenancy_id UUID)
RETURNS JSON AS $$
DECLARE
  ten RECORD;
BEGIN
  UPDATE tenancies SET status = 'NOTICE_GIVEN', notice_date = CURRENT_DATE
  WHERE id = p_tenancy_id
  RETURNING * INTO ten;

  UPDATE units SET status = 'NOTICE_GIVEN' WHERE id = ten.unit_id;

  RETURN row_to_json(ten);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
