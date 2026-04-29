# Base.ke — Supabase Setup Guide

## Step-by-Step: Paste into Supabase SQL Editor

Go to your Supabase project → **SQL Editor** → **New Query** and paste each file in order. Click **Run** after each one.

### 1. Schema (`01_schema.sql`)
Creates all tables, enums, indexes, and the auto-profile trigger.
- 10 tables: profiles, properties, property_managers, units, tenancies, payments, receipts, maintenance_requests, notifications, activity_logs
- 10 enum types
- Auto-creates a profile row when a user signs up

### 2. RLS Policies (`02_rls_policies.sql`)
Enables Row Level Security on every table with policies:
- Owners see their properties, units, tenants, payments
- Managers see assigned properties (with permission flags)
- Tenants see only their own unit, tenancy, and payments
- Service role (Edge Functions) bypasses RLS automatically

### 3. Database Functions (`03_functions.sql`)
Server-side functions callable via `supabase.rpc()`:
- `get_dashboard_stats(prop_id)` — overview numbers
- `get_monthly_collections(prop_id, num_months)` — chart data
- `get_arrears(prop_id)` — who hasn't paid this month
- `match_payment(payment_id)` — auto-match M-Pesa payment
- `manual_match_payment(payment_id, unit_id, month)` — landlord resolves
- `assign_tenant(...)` — assign tenant + update unit status
- `move_out_tenant(...)` — end tenancy + mark vacant
- `give_notice(...)` — notice period

### 4. Seed Data (`04_seed.sql`) — OPTIONAL / DEV ONLY
Creates test data: 1 owner, 8 tenants, 24 units, ~28 payments.
**Only run this for testing.** Don't run in production.

---

## Supabase Auth Setup

1. Go to **Authentication** → **Providers**
2. Enable **Phone** provider
3. For development: set to "Test OTP" mode (any code works)
4. For production: configure Twilio or MessageBird for real SMS OTPs

---

## Edge Functions

Go to **Edge Functions** → **New Function** for each:

### `mpesa-callback`
- Paste contents of `edge-functions/mpesa-callback/index.ts`
- This is the URL Safaricom calls when a payment hits your paybill
- URL will be: `https://YOUR_PROJECT.supabase.co/functions/v1/mpesa-callback`

### `send-sms`
- Paste contents of `edge-functions/send-sms/index.ts`
- Called internally after payment matching
- Set secrets in Edge Functions → Secrets:
  - `AT_API_KEY` — your Africa's Talking API key
  - `AT_USERNAME` — your AT username
  - `AT_SENDER_ID` — sender ID (default: "BASE")

### `daraja-register`
- Paste contents of `edge-functions/daraja-register/index.ts`
- Call once per property to register callbacks with Safaricom
- Requires Daraja credentials stored on the property record

---

## Environment / Secrets

Set these in **Edge Functions** → **Secrets**:

| Secret | Description |
|--------|-------------|
| `AT_API_KEY` | Africa's Talking API key |
| `AT_USERNAME` | Africa's Talking username |
| `AT_SENDER_ID` | SMS sender ID (default: BASE) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected.

---

## Client Setup

1. Copy `05_client.js` into your project
2. Replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` with values from:
   **Settings** → **API** → **Project URL** and **anon/public** key
3. Add to your HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase/05_client.js"></script>
```

---

## Realtime (Live Updates)

Enable in **Database** → **Replication**:
- Toggle ON for `payments` table (live payment feed)
- Toggle ON for `notifications` table (in-app alerts)

---

## Pricing Tiers (free tier limits)

| | Free | Pro |
|---|---|---|
| Database | 500 MB | 8 GB |
| Edge Functions | 500K invocations | 2M |
| Auth | 50K MAU | 100K MAU |
| Realtime | 200 connections | 500 |

The free tier is fine for development and testing. Move to HostAfrica paid plan for production.
