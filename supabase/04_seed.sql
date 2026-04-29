-- ============================================================
-- Base.ke — Seed Data
-- Paste this into Supabase SQL Editor AFTER running 03_functions.sql
--
-- NOTE: This creates profiles directly (bypassing auth.users).
-- For production, users sign up through Supabase Auth.
-- This seed is for testing the dashboard and payment flows.
-- ============================================================

-- Create test users in auth.users first (Supabase requires this for FK)
-- Using a fixed UUID so we can reference them

DO $$
DECLARE
  owner_id UUID := 'a0000000-0000-0000-0000-000000000001';
  t1_id UUID := 'b0000000-0000-0000-0000-000000000001';
  t2_id UUID := 'b0000000-0000-0000-0000-000000000002';
  t3_id UUID := 'b0000000-0000-0000-0000-000000000003';
  t4_id UUID := 'b0000000-0000-0000-0000-000000000004';
  t5_id UUID := 'b0000000-0000-0000-0000-000000000005';
  t6_id UUID := 'b0000000-0000-0000-0000-000000000006';
  t7_id UUID := 'b0000000-0000-0000-0000-000000000007';
  t8_id UUID := 'b0000000-0000-0000-0000-000000000008';
  prop_id UUID;
  unit_ids UUID[];
  i INT;
  u_id UUID;
  tenancy_id UUID;
  pay_id UUID;
  receipt_cnt INT := 0;
  floor_num INT;
  letter TEXT;
  unit_num TEXT;
  rent INT;
  beds INT;
  tenant_ids UUID[];
  tenant_phones TEXT[];
  tenant_names TEXT[];
  months TEXT[] := ARRAY['2026-01', '2026-02', '2026-03', '2026-04'];
  m TEXT;
  day_num INT;
  paid_at TIMESTAMPTZ;
BEGIN
  tenant_ids := ARRAY[t1_id, t2_id, t3_id, t4_id, t5_id, t6_id, t7_id, t8_id];
  tenant_phones := ARRAY['254722111111','254722222222','254722333333','254722444444','254722555555','254722666666','254722777777','254722888888'];
  tenant_names := ARRAY['James Mwangi','Wanjiku Kamau','Hassan Omar','Njeri Wambui','Peter Ochieng','Aisha Mohamed','Grace Waithera','Samuel Kiprop'];

  -- Insert into auth.users (minimal — just id and phone)
  INSERT INTO auth.users (id, instance_id, aud, role, phone, encrypted_password, raw_user_meta_data, created_at, updated_at)
  VALUES
    (owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '254712345678', '', '{"name":"Daniel Mwangi","role":"OWNER"}'::jsonb, now(), now())
  ON CONFLICT (id) DO NOTHING;

  FOR i IN 1..8 LOOP
    INSERT INTO auth.users (id, instance_id, aud, role, phone, encrypted_password, raw_user_meta_data, created_at, updated_at)
    VALUES
      (tenant_ids[i], '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', tenant_phones[i], '', format('{"name":"%s","role":"TENANT"}', tenant_names[i])::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- Profiles should be auto-created by trigger, but ensure they exist
  INSERT INTO profiles (id, phone, name, email, role, id_number, id_verified)
  VALUES (owner_id, '254712345678', 'Daniel Mwangi', 'daniel@base.ke', 'OWNER', '12345678', true)
  ON CONFLICT (id) DO NOTHING;

  FOR i IN 1..8 LOOP
    INSERT INTO profiles (id, phone, name, role)
    VALUES (tenant_ids[i], tenant_phones[i], tenant_names[i], 'TENANT')
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- Create property
  INSERT INTO properties (id, name, type, address, county, town, total_units, owner_id, paybill_number)
  VALUES (gen_random_uuid(), 'Sunrise Apartments', 'APARTMENT', 'Ngong Road, Kilimani', 'Nairobi', 'Nairobi', 24, owner_id, '174379')
  RETURNING id INTO prop_id;

  -- Create 24 units (6 floors × 4 units)
  unit_ids := ARRAY[]::UUID[];
  FOR floor_num IN 1..6 LOOP
    FOREACH letter IN ARRAY ARRAY['A','B','C','D'] LOOP
      unit_num := floor_num::TEXT || letter;
      IF floor_num <= 2 THEN rent := 12000; beds := 1;
      ELSIF floor_num <= 4 THEN rent := 15000; beds := 2;
      ELSE rent := 22000; beds := 3;
      END IF;

      INSERT INTO units (property_id, unit_number, floor, bedrooms, rent_amount, deposit_amount, status)
      VALUES (prop_id, unit_num, floor_num, beds, rent, rent, 'VACANT')
      RETURNING id INTO u_id;

      unit_ids := array_append(unit_ids, u_id);
    END LOOP;
  END LOOP;

  -- Assign first 8 tenants to first 8 units
  FOR i IN 1..8 LOOP
    INSERT INTO tenancies (unit_id, tenant_id, rent_amount, deposit_paid, start_date, status)
    VALUES (unit_ids[i], tenant_ids[i], (SELECT rent_amount FROM units WHERE id = unit_ids[i]), (SELECT deposit_amount FROM units WHERE id = unit_ids[i]), '2026-01-01', 'ACTIVE')
    RETURNING id INTO tenancy_id;

    UPDATE units SET status = 'OCCUPIED' WHERE id = unit_ids[i];

    -- Create payments for each month (skip ~10% randomly)
    FOREACH m IN ARRAY months LOOP
      IF random() <= 0.9 THEN
        day_num := floor(random() * 5 + 1)::INT;
        paid_at := (m || '-' || lpad(day_num::TEXT, 2, '0') || ' ' || (10 + floor(random() * 8)::INT)::TEXT || ':' || lpad(floor(random() * 60)::INT::TEXT, 2, '0') || ':00')::TIMESTAMPTZ;

        INSERT INTO payments (property_id, unit_id, tenancy_id, amount, mpesa_ref, mpesa_phone, mpesa_name, account_reference, source, status, paid_at, month, receipt_sent_tenant, receipt_sent_landlord)
        VALUES (
          prop_id,
          unit_ids[i],
          tenancy_id,
          (SELECT rent_amount FROM units WHERE id = unit_ids[i]),
          'S' || upper(substr(md5(random()::TEXT), 1, 10)),
          tenant_phones[i],
          tenant_names[i],
          (SELECT unit_number FROM units WHERE id = unit_ids[i]),
          'MPESA_C2B',
          'MATCHED',
          paid_at,
          m,
          true,
          true
        )
        RETURNING id INTO pay_id;

        receipt_cnt := receipt_cnt + 1;
        INSERT INTO receipts (payment_id, receipt_no, tenant_phone, landlord_phone, amount)
        VALUES (pay_id, 'BK-2026-' || lpad(receipt_cnt::TEXT, 5, '0'), tenant_phones[i], '254712345678', (SELECT rent_amount FROM units WHERE id = unit_ids[i]));
      END IF;
    END LOOP;
  END LOOP;

  -- One unmatched payment
  INSERT INTO payments (property_id, amount, mpesa_ref, mpesa_phone, mpesa_name, source, status, paid_at, month)
  VALUES (prop_id, 15000, 'SUNKNOWN001', '254799999999', 'UNKNOWN PAYER', 'MPESA_C2B', 'UNMATCHED', now(), '2026-04');

  RAISE NOTICE 'Seed complete! Property: %, Units: %, Tenants: 8, Payments: %', prop_id, array_length(unit_ids, 1), receipt_cnt;
END;
$$;
