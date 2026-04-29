// ============================================================
// Base.ke — Supabase Client
// Include this in your dashboard HTML or import in your app
// ============================================================
//
// SETUP: Replace these with your Supabase project values
// Found in: Supabase Dashboard → Settings → API
//
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Load Supabase from CDN (add to HTML <head>):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════ AUTH ═══════

async function requestOtp(phone) {
  const normalized = normalizePhone(phone);
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: normalized,
  });
  if (error) throw error;
  return data;
}

async function verifyOtp(phone, code) {
  const normalized = normalizePhone(phone);
  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalized,
    token: code,
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}

async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════ PROPERTIES ═══════

async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function createProperty(property) {
  const user = await getUser();
  const { data, error } = await supabase
    .from('properties')
    .insert({ ...property, owner_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════ UNITS ═══════

async function getUnits(propertyId) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('property_id', propertyId)
    .order('unit_number');
  if (error) throw error;
  return data;
}

async function createUnit(unit) {
  const { data, error } = await supabase
    .from('units')
    .insert(unit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function createUnits(units) {
  const { data, error } = await supabase
    .from('units')
    .insert(units)
    .select();
  if (error) throw error;
  return data;
}

async function updateUnit(id, updates) {
  const { data, error } = await supabase
    .from('units')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════ TENANTS & TENANCIES ═══════

async function getTenancies(propertyId) {
  const { data, error } = await supabase
    .from('tenancies')
    .select(`
      *,
      tenant:profiles!tenant_id(id, name, phone, id_verified),
      unit:units!unit_id(id, unit_number, rent_amount)
    `)
    .in('status', ['ACTIVE', 'NOTICE_GIVEN'])
    .eq('unit.property_id', propertyId)
    .order('unit(unit_number)');
  if (error) throw error;
  return data;
}

async function assignTenant(unitId, tenantId, rentAmount, depositPaid, startDate, leaseDocUrl) {
  const { data, error } = await supabase.rpc('assign_tenant', {
    p_unit_id: unitId,
    p_tenant_id: tenantId,
    p_rent_amount: rentAmount,
    p_deposit_paid: depositPaid || 0,
    p_start_date: startDate || new Date().toISOString().split('T')[0],
    p_lease_doc_url: leaseDocUrl || null,
  });
  if (error) throw error;
  return data;
}

async function moveOut(tenancyId, endDate) {
  const { data, error } = await supabase.rpc('move_out_tenant', {
    p_tenancy_id: tenancyId,
    p_end_date: endDate || new Date().toISOString().split('T')[0],
  });
  if (error) throw error;
  return data;
}

async function giveNotice(tenancyId) {
  const { data, error } = await supabase.rpc('give_notice', {
    p_tenancy_id: tenancyId,
  });
  if (error) throw error;
  return data;
}

// ═══════ PAYMENTS ═══════

async function getPayments(propertyId, filters = {}) {
  let query = supabase
    .from('payments')
    .select(`
      *,
      unit:units(unit_number),
      tenancy:tenancies(id, tenant:profiles!tenant_id(name, phone))
    `)
    .eq('property_id', propertyId)
    .order('paid_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.month) query = query.eq('month', filters.month);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function manualMatchPayment(paymentId, unitId, month) {
  const { data, error } = await supabase.rpc('manual_match_payment', {
    payment_id: paymentId,
    target_unit_id: unitId,
    target_month: month || null,
  });
  if (error) throw error;
  return data;
}

// ═══════ DASHBOARD ═══════

async function getDashboardStats(propertyId) {
  const { data, error } = await supabase.rpc('get_dashboard_stats', {
    prop_id: propertyId,
  });
  if (error) throw error;
  return data;
}

async function getMonthlyCollections(propertyId, months = 6) {
  const { data, error } = await supabase.rpc('get_monthly_collections', {
    prop_id: propertyId,
    num_months: months,
  });
  if (error) throw error;
  return data;
}

async function getArrears(propertyId) {
  const { data, error } = await supabase.rpc('get_arrears', {
    prop_id: propertyId,
  });
  if (error) throw error;
  return data;
}

// ═══════ MAINTENANCE ═══════

async function createMaintenanceRequest(request) {
  const user = await getUser();
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert({ ...request, requester_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getMaintenanceRequests(propertyId, filters = {}) {
  let query = supabase
    .from('maintenance_requests')
    .select(`
      *,
      unit:units(unit_number, property_id),
      requester:profiles!requester_id(name, phone)
    `)
    .eq('unit.property_id', propertyId)
    .order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function updateMaintenanceRequest(id, updates) {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ═══════ NOTIFICATIONS ═══════

async function getNotifications() {
  const user = await getUser();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// ═══════ REALTIME ═══════

function subscribeToPayments(propertyId, callback) {
  return supabase
    .channel(`payments:${propertyId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'payments', filter: `property_id=eq.${propertyId}` },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

function subscribeToNotifications(userId, callback) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

// ═══════ HELPERS ═══════

function normalizePhone(phone) {
  let p = phone.replace(/[\s\-\+]/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('+')) p = p.slice(1);
  return '+' + p;
}
