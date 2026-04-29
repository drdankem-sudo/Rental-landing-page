// ============================================================
// Base.ke — SMS Notification Edge Function
//
// Deploy: paste into Supabase Dashboard → Edge Functions → New Function
// Name: send-sms
//
// Set these secrets in Supabase Dashboard → Edge Functions → Secrets:
//   AT_API_KEY    — Africa's Talking API key
//   AT_USERNAME   — Africa's Talking username (or "sandbox")
//   AT_SENDER_ID  — Sender ID (default: "BASE")
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const AT_API_KEY = Deno.env.get('AT_API_KEY') || ''
const AT_USERNAME = Deno.env.get('AT_USERNAME') || 'sandbox'
const AT_SENDER_ID = Deno.env.get('AT_SENDER_ID') || 'BASE'

async function sendSms(phone: string, message: string) {
  const to = phone.startsWith('+') ? phone : `+${phone}`

  if (!AT_API_KEY || AT_USERNAME === 'sandbox') {
    console.log(`[SMS-DEV] To: ${to} | ${message}`)
    return { status: 'dev-logged', to, message }
  }

  const res = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      apiKey: AT_API_KEY,
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      username: AT_USERNAME,
      to,
      message,
      from: AT_SENDER_ID,
    }),
  })

  return await res.json()
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { paymentId } = await req.json()
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'paymentId required' }), { status: 400 })
    }

    // Get payment with relations
    const { data: payment } = await supabase
      .from('payments')
      .select(`
        *,
        property:properties(id, name, owner_id),
        unit:units(unit_number),
        tenancy:tenancies(id, tenant_id)
      `)
      .eq('id', paymentId)
      .single()

    if (!payment || !payment.tenancy) {
      return new Response(JSON.stringify({ error: 'Payment not found or unmatched' }), { status: 404 })
    }

    // Get tenant profile
    const { data: tenant } = await supabase
      .from('profiles')
      .select('phone, name')
      .eq('id', payment.tenancy.tenant_id)
      .single()

    // Get receipt
    const { data: receipt } = await supabase
      .from('receipts')
      .select('receipt_no')
      .eq('payment_id', paymentId)
      .single()

    const unitLabel = `${payment.property.name} - Unit ${payment.unit?.unit_number || '?'}`
    const amountStr = payment.amount.toLocaleString('en-KE')
    const receiptNo = receipt?.receipt_no || 'N/A'

    // Send to tenant
    if (tenant?.phone) {
      await sendSms(
        tenant.phone,
        `Base: KES ${amountStr} received for ${unitLabel}. Ref: ${payment.mpesa_ref}. Receipt: ${receiptNo}`
      )
      await supabase
        .from('payments')
        .update({ receipt_sent_tenant: true })
        .eq('id', paymentId)
    }

    // Send to landlord
    const { data: owner } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', payment.property.owner_id)
      .single()

    if (owner?.phone) {
      await sendSms(
        owner.phone,
        `Base: KES ${amountStr} received from ${tenant?.name || 'tenant'} for ${unitLabel}. Ref: ${payment.mpesa_ref}`
      )
      await supabase
        .from('payments')
        .update({ receipt_sent_landlord: true })
        .eq('id', paymentId)
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('SMS error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
