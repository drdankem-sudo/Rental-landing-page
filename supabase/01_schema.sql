-- ============================================================
-- Base.ke — Supabase Schema Migration
-- Paste this into Supabase SQL Editor and click "Run"
-- ============================================================

-- ═══════ ENUMS ═══════

CREATE TYPE user_role AS ENUM ('OWNER', 'MANAGER', 'CARETAKER', 'TENANT');
CREATE TYPE property_type AS ENUM ('APARTMENT', 'MAISONETTE', 'BUNGALOW', 'BEDSITTER', 'SINGLE_ROOM', 'COMMERCIAL');
CREATE TYPE unit_status AS ENUM ('OCCUPIED', 'VACANT', 'NOTICE_GIVEN', 'MAINTENANCE');
CREATE TYPE tenancy_status AS ENUM ('ACTIVE', 'NOTICE_GIVEN', 'ENDED');
CREATE TYPE payment_status AS ENUM ('MATCHED', 'UNMATCHED', 'PARTIAL', 'OVERPAYMENT', 'MANUALLY_MATCHED');
CREATE TYPE payment_source AS ENUM ('MPESA_C2B', 'MPESA_STK', 'MANUAL_ENTRY', 'BANK_TRANSFER');
CREATE TYPE maintenance_status AS ENUM ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE maintenance_category AS ENUM ('PLUMBING', 'ELECTRICAL', 'PAINTING', 'CARPENTRY', 'GENERAL', 'SECURITY', 'CLEANING', 'OTHER');
CREATE TYPE notification_type AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_REMINDER', 'RENT_OVERDUE', 'RECEIPT', 'LEASE_EXPIRY', 'MAINTENANCE_UPDATE', 'GENERAL');
CREATE TYPE notification_channel AS ENUM ('SMS', 'IN_APP', 'BOTH');

-- ═══════ PROFILES (extends Supabase auth.users) ═══════

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT,
  role        user_role NOT NULL DEFAULT 'TENANT',
  id_number   TEXT,
  id_verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_phone ON profiles(phone);

-- ═══════ PROPERTIES ═══════

CREATE TABLE properties (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  type             property_type NOT NULL,
  address          TEXT NOT NULL,
  county           TEXT NOT NULL,
  town             TEXT NOT NULL,
  total_units      INT NOT NULL DEFAULT 0,
  owner_id         UUID NOT NULL REFERENCES profiles(id),
  paybill_number   TEXT,
  till_number      TEXT,
  daraja_consumer_key    TEXT,
  daraja_consumer_secret TEXT,
  daraja_shortcode       TEXT,
  daraja_passkey         TEXT,
  daraja_callback_registered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_paybill ON properties(paybill_number);

-- ═══════ PROPERTY MANAGERS ═══════

CREATE TABLE property_managers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id),
  role            user_role NOT NULL,
  can_view_payments  BOOLEAN NOT NULL DEFAULT TRUE,
  can_manage_tenants BOOLEAN NOT NULL DEFAULT TRUE,
  can_manage_units   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- ═══════ UNITS ═══════

CREATE TABLE units (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id    UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number    TEXT NOT NULL,
  floor          INT,
  bedrooms       INT,
  rent_amount    INT NOT NULL,
  deposit_amount INT,
  status         unit_status NOT NULL DEFAULT 'VACANT',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(property_id, unit_number)
);

CREATE INDEX idx_units_property ON units(property_id);

-- ═══════ TENANCIES ═══════

CREATE TABLE tenancies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id      UUID NOT NULL REFERENCES units(id),
  tenant_id    UUID NOT NULL REFERENCES profiles(id),
  rent_amount  INT NOT NULL,
  deposit_paid INT NOT NULL DEFAULT 0,
  start_date   DATE NOT NULL,
  end_date     DATE,
  notice_date  DATE,
  status       tenancy_status NOT NULL DEFAULT 'ACTIVE',
  lease_doc_url TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenancies_unit ON tenancies(unit_id);
CREATE INDEX idx_tenancies_tenant ON tenancies(tenant_id);
CREATE INDEX idx_tenancies_status ON tenancies(status);

-- ═══════ PAYMENTS ═══════

CREATE TABLE payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id          UUID NOT NULL REFERENCES properties(id),
  unit_id              UUID REFERENCES units(id),
  tenancy_id           UUID REFERENCES tenancies(id),
  amount               INT NOT NULL,
  mpesa_ref            TEXT UNIQUE,
  mpesa_phone          TEXT,
  mpesa_name           TEXT,
  account_reference    TEXT,
  status               payment_status NOT NULL DEFAULT 'UNMATCHED',
  source               payment_source NOT NULL DEFAULT 'MPESA_C2B',
  paid_at              TIMESTAMPTZ NOT NULL,
  month                TEXT NOT NULL,
  receipt_sent_tenant    BOOLEAN NOT NULL DEFAULT FALSE,
  receipt_sent_landlord  BOOLEAN NOT NULL DEFAULT FALSE,
  kra_invoice_generated  BOOLEAN NOT NULL DEFAULT FALSE,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_mpesa_ref ON payments(mpesa_ref);
CREATE INDEX idx_payments_mpesa_phone ON payments(mpesa_phone);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_month ON payments(month);

-- ═══════ RECEIPTS ═══════

CREATE TABLE receipts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id      UUID UNIQUE NOT NULL REFERENCES payments(id),
  receipt_no      TEXT UNIQUE NOT NULL,
  tenant_phone    TEXT,
  landlord_phone  TEXT,
  amount          INT NOT NULL,
  kra_pin         TEXT,
  tax_amount      INT,
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════ MAINTENANCE REQUESTS ═══════

CREATE TABLE maintenance_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id       UUID NOT NULL REFERENCES units(id),
  requester_id  UUID NOT NULL REFERENCES profiles(id),
  category      maintenance_category NOT NULL,
  description   TEXT NOT NULL,
  photo_urls    TEXT[] DEFAULT '{}',
  status        maintenance_status NOT NULL DEFAULT 'SUBMITTED',
  assigned_to   TEXT,
  notes         TEXT,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_maintenance_unit ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);

-- ═══════ NOTIFICATIONS ═══════

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id  UUID NOT NULL REFERENCES profiles(id),
  sender_id     UUID REFERENCES profiles(id),
  type          notification_type NOT NULL,
  channel       notification_channel NOT NULL DEFAULT 'SMS',
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  sms_sent      BOOLEAN NOT NULL DEFAULT FALSE,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ═══════ ACTIVITY LOG ═══════

CREATE TABLE activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  action      TEXT NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_property ON activity_logs(property_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at);

-- ═══════ UPDATED_AT TRIGGER ═══════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tenancies_updated_at BEFORE UPDATE ON tenancies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER maintenance_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════ AUTO-CREATE PROFILE ON SIGNUP ═══════

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'TENANT')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
