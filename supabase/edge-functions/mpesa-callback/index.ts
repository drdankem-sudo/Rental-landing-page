// ============================================================
// Base.ke — M-Pesa C2B Callback Edge Function
//
// Deploy: paste into Supabase Dashboard → Edge Functions → New Function
// Name: mpesa-callback
// This receives M-Pesa C2B payment notifications
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()

    // Safaricom C2B callback format
    const result = body?.Body?.stkCallback || body?.TransactionType ? body : null
    if (!result) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Extract C2B fields
    const transId = result.TransID || result.TransactionId
    const amount = parseInt(result.TransAmount || result.Amount || '0')
    const phone = result.MSISDN || result.PhoneNumber || ''
    const name = result.FirstName
      ? `${result.FirstName} ${result.MiddleName || ''} ${result.LastName || ''}`.trim()
      : result.BillRefNumber || ''
    const accountRef = result.BillRefNumber || result.AccountReference || ''
    const shortcode = result.BusinessShortCode || result.ReceivedFrom || ''
    const transTime = result.TransTime || ''

    // Parse transaction time (format: YYYYMMDDHHmmss)
    let paidAt = new Date()
    if (transTime && transTime.length >= 14) {
      const y = transTime.substring(0, 4)
      const m = transTime.substring(4, 6)
      const d = transTime.substring(6, 8)
      const h = transTime.substring(8, 10)
      const min = transTime.substring(10, 12)
      const s = transTime.substring(12, 14)
      paidAt = new Date(`${y}-${m}-${d}T${h}:${min}:${s}+03:00`)
    }

    const month = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, '0')}`

    // Normalize phone (remove +, ensure 254 prefix)
    let normalizedPhone = phone.replace(/[\s\-\+]/g, '')
    if (normalizedPhone.startsWith('0')) normalizedPhone = '254' + normalizedPhone.slice(1)

    // Find property by paybill/shortcode
    const { data: property } = await supabase
      .from('properties')
      .select('id')
      .or(`paybill_number.eq.${shortcode},till_number.eq.${shortcode}`)
      .single()

    if (!property) {
      console.error(`No property found for shortcode: ${shortcode}`)
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('mpesa_ref', transId)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Duplicate' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Insert payment
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        property_id: property.id,
        amount,
        mpesa_ref: transId,
        mpesa_phone: normalizedPhone,
        mpesa_name: name,
        account_reference: accountRef,
        source: 'MPESA_C2B',
        status: 'UNMATCHED',
        paid_at: paidAt.toISOString(),
        month,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Error' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Auto-match
    const { data: matchResult } = await supabase.rpc('match_payment', {
      payment_id: payment.id,
    })

    console.log(`Payment ${transId}: KES ${amount} from ${normalizedPhone} → ${JSON.stringify(matchResult)}`)

    // If matched, send SMS via the sms edge function
    if (matchResult?.matched) {
      try {
        await supabase.functions.invoke('send-sms', {
          body: { paymentId: payment.id },
        })
      } catch (smsErr) {
        console.error('SMS send failed:', smsErr)
      }
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Callback error:', err)
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Error' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
