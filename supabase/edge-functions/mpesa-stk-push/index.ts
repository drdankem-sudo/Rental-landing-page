// ============================================================
// Base.ke — M-Pesa STK Push (Lipa Na M-Pesa Online) Edge Function
//
// Deploy: paste into Supabase Dashboard → Edge Functions → New Function
// Name: mpesa-stk-push
//
// Initiates an STK Push request so the tenant gets the M-Pesa
// PIN prompt on their phone. The result comes back via the
// mpesa-callback edge function.
//
// POST body: { propertyId, phone, amount, accountReference }
// Returns:  { CheckoutRequestID, MerchantRequestID } on success
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const SANDBOX = Deno.env.get('MPESA_ENV') !== 'production'
const BASE_URL = SANDBOX
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke'

async function getDarajaToken(consumerKey: string, consumerSecret: string): Promise<string> {
  const auth = btoa(`${consumerKey}:${consumerSecret}`)
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get Daraja token')
  return data.access_token
}

function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s\-\+]/g, '')
  if (p.startsWith('0')) p = '254' + p.slice(1)
  if (p.startsWith('7')) p = '254' + p
  return p
}

function timestamp(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  try {
    const { propertyId, phone, amount, accountReference } = await req.json()

    if (!propertyId || !phone || !amount) {
      return new Response(
        JSON.stringify({ error: 'propertyId, phone, and amount are required' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Look up property Daraja credentials
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('daraja_consumer_key, daraja_consumer_secret, daraja_shortcode, daraja_passkey, paybill_number, name')
      .eq('id', propertyId)
      .single()

    if (propError || !property) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: corsHeaders }
      )
    }

    const shortcode = property.daraja_shortcode || property.paybill_number
    const passkey = property.daraja_passkey
    const consumerKey = property.daraja_consumer_key
    const consumerSecret = property.daraja_consumer_secret

    if (!shortcode || !passkey || !consumerKey || !consumerSecret) {
      return new Response(
        JSON.stringify({ error: 'M-Pesa credentials not configured for this property' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Get OAuth token
    const token = await getDarajaToken(consumerKey, consumerSecret)

    // Build STK Push request
    const ts = timestamp()
    const password = btoa(`${shortcode}${passkey}${ts}`)
    const normalizedPhone = normalizePhone(phone)
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`
    const acctRef = accountReference || 'RENT'

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: acctRef,
      TransactionDesc: `Rent payment - ${property.name} Unit ${acctRef}`,
    }

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPayload),
    })

    const stkResult = await stkRes.json()

    if (stkResult.ResponseCode === '0') {
      console.log(`STK Push initiated: ${stkResult.CheckoutRequestID} for ${normalizedPhone}, KES ${amount}`)

      return new Response(
        JSON.stringify({
          success: true,
          CheckoutRequestID: stkResult.CheckoutRequestID,
          MerchantRequestID: stkResult.MerchantRequestID,
          ResponseDescription: stkResult.ResponseDescription,
        }),
        { headers: corsHeaders }
      )
    }

    console.error('STK Push failed:', stkResult)
    return new Response(
      JSON.stringify({
        success: false,
        error: stkResult.errorMessage || stkResult.ResponseDescription || 'STK Push failed',
      }),
      { status: 400, headers: corsHeaders }
    )
  } catch (err) {
    console.error('STK Push error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: corsHeaders }
    )
  }
})
