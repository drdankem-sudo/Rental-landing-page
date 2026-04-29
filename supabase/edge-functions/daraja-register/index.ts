// ============================================================
// Base.ke — Daraja C2B URL Registration Edge Function
//
// Deploy: paste into Supabase Dashboard → Edge Functions → New Function
// Name: daraja-register
//
// Registers this Supabase project's mpesa-callback URL with Safaricom
// so C2B payments trigger the callback.
//
// Call this once per property after setting Daraja credentials.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getDarajaToken(consumerKey: string, consumerSecret: string): Promise<string> {
  const auth = btoa(`${consumerKey}:${consumerSecret}`)
  const res = await fetch(
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  const data = await res.json()
  return data.access_token
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { propertyId } = await req.json()
    if (!propertyId) {
      return new Response(JSON.stringify({ error: 'propertyId required' }), { status: 400 })
    }

    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (error || !property) {
      return new Response(JSON.stringify({ error: 'Property not found' }), { status: 404 })
    }

    if (!property.daraja_consumer_key || !property.daraja_consumer_secret || !property.daraja_shortcode) {
      return new Response(JSON.stringify({ error: 'Daraja credentials not configured' }), { status: 400 })
    }

    const token = await getDarajaToken(property.daraja_consumer_key, property.daraja_consumer_secret)
    const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-callback`

    const res = await fetch('https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ShortCode: property.daraja_shortcode,
        ResponseType: 'Completed',
        ConfirmationURL: callbackUrl,
        ValidationURL: callbackUrl,
      }),
    })

    const result = await res.json()

    if (result.ResponseDescription?.includes('success') || result.ResponseCode === '0') {
      await supabase
        .from('properties')
        .update({ daraja_callback_registered: true })
        .eq('id', propertyId)

      return new Response(JSON.stringify({ registered: true, result }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ registered: false, result }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Daraja registration error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
