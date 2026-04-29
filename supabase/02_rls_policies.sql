-- ============================================================
-- Base.ke — Row Level Security Policies
-- Paste this into Supabase SQL Editor AFTER running 01_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════
-- HELPER: check if user owns or manages a property
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION has_property_access(prop_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM properties WHERE id = prop_id AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM property_managers WHERE property_id = prop_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ═══════ PROFILES ═══════

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Owners can view tenant profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenancies t
      JOIN units u ON t.unit_id = u.id
      WHERE t.tenant_id = profiles.id
        AND has_property_access(u.property_id)
    )
  );

CREATE POLICY "Managers can view tenant profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_managers pm
      WHERE pm.user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM tenancies t
          JOIN units u ON t.unit_id = u.id
          WHERE t.tenant_id = profiles.id
            AND u.property_id = pm.property_id
        )
    )
  );

-- ═══════ PROPERTIES ═══════

CREATE POLICY "Owners can do everything with their properties"
  ON properties FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Managers can view their assigned properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = properties.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view property they live in"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenancies t
      JOIN units u ON t.unit_id = u.id
      WHERE u.property_id = properties.id
        AND t.tenant_id = auth.uid()
        AND t.status IN ('ACTIVE', 'NOTICE_GIVEN')
    )
  );

-- ═══════ PROPERTY MANAGERS ═══════

CREATE POLICY "Owners manage their property managers"
  ON property_managers FOR ALL
  USING (has_property_access(property_id))
  WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
  );

CREATE POLICY "Managers can view own record"
  ON property_managers FOR SELECT
  USING (user_id = auth.uid());

-- ═══════ UNITS ═══════

CREATE POLICY "Property access can view units"
  ON units FOR SELECT
  USING (has_property_access(property_id));

CREATE POLICY "Owners can manage units"
  ON units FOR ALL
  USING (has_property_access(property_id))
  WITH CHECK (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM property_managers
      WHERE property_id = units.property_id AND user_id = auth.uid() AND can_manage_units = TRUE
    )
  );

CREATE POLICY "Tenants can view their own unit"
  ON units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenancies
      WHERE unit_id = units.id
        AND tenant_id = auth.uid()
        AND status IN ('ACTIVE', 'NOTICE_GIVEN')
    )
  );

-- ═══════ TENANCIES ═══════

CREATE POLICY "Property access can view tenancies"
  ON tenancies FOR SELECT
  USING (
    has_property_access((SELECT property_id FROM units WHERE id = unit_id))
  );

CREATE POLICY "Owners/managers can create tenancies"
  ON tenancies FOR INSERT
  WITH CHECK (
    has_property_access((SELECT property_id FROM units WHERE id = unit_id))
  );

CREATE POLICY "Owners/managers can update tenancies"
  ON tenancies FOR UPDATE
  USING (
    has_property_access((SELECT property_id FROM units WHERE id = unit_id))
  );

CREATE POLICY "Tenants can view own tenancy"
  ON tenancies FOR SELECT
  USING (tenant_id = auth.uid());

-- ═══════ PAYMENTS ═══════

CREATE POLICY "Property access can view payments"
  ON payments FOR SELECT
  USING (has_property_access(property_id));

CREATE POLICY "Property access can insert payments"
  ON payments FOR INSERT
  WITH CHECK (has_property_access(property_id));

CREATE POLICY "Property access can update payments"
  ON payments FOR UPDATE
  USING (has_property_access(property_id));

CREATE POLICY "Tenants can view own payments"
  ON payments FOR SELECT
  USING (
    tenancy_id IN (
      SELECT id FROM tenancies WHERE tenant_id = auth.uid()
    )
  );

-- Service role bypass for M-Pesa callbacks (Edge Functions use service_role key)
-- No policy needed — service_role bypasses RLS automatically

-- ═══════ RECEIPTS ═══════

CREATE POLICY "Property access can view receipts"
  ON receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments p
      WHERE p.id = receipts.payment_id AND has_property_access(p.property_id)
    )
  );

CREATE POLICY "Tenants can view own receipts"
  ON receipts FOR SELECT
  USING (
    tenant_phone = (SELECT phone FROM profiles WHERE id = auth.uid())
  );

-- ═══════ MAINTENANCE REQUESTS ═══════

CREATE POLICY "Tenants can create maintenance requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Tenants can view own maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (requester_id = auth.uid());

CREATE POLICY "Property access can view maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (
    has_property_access((SELECT property_id FROM units WHERE id = unit_id))
  );

CREATE POLICY "Property access can update maintenance requests"
  ON maintenance_requests FOR UPDATE
  USING (
    has_property_access((SELECT property_id FROM units WHERE id = unit_id))
  );

-- ═══════ NOTIFICATIONS ═══════

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications (mark read)"
  ON notifications FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Property access can send notifications"
  ON notifications FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- ═══════ ACTIVITY LOGS ═══════

CREATE POLICY "Property access can view activity logs"
  ON activity_logs FOR SELECT
  USING (
    user_id = auth.uid()
    OR (property_id IS NOT NULL AND has_property_access(property_id))
  );

CREATE POLICY "Authenticated users can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());
