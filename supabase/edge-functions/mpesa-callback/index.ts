// ============================================================
// Base.ke — M-Pesa Callback Edge Function (C2B + STK Push)
//
// Deploy: paste into Supabase Dashboard → Edge Functions → New Function
// Name: mpesa-callback
// Receives both C2B paybill and STK Push payment notifications
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

    // Determine callback type: STK Push or C2B
    const stkCallback = body?.Body?.stkCallback
    const isC2B = body?.TransactionType ? true : false

    if (!stkCallback && !isC2B) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let transId: string, amount: number, phone: string, name: string, accountRef: string, shortcode: string, paidAt: Date, source: string

    if (stkCallback) {
      // ── STK Push callback ──
      if (stkCallback.ResultCode !== 0) {
        console.log(`STK Push cancelled/failed: ${stkCallback.ResultDesc}`)
        return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
      const items = stkCallback.CallbackMetadata?.Item || []
      const get = (key: string) => items.find((i: any) => i.Name === key)?.Value
      transId = String(get('MpesaReceiptNumber') || '')
      amount = parseInt(String(get('Amount') || '0'))
      phone = String(get('PhoneNumber') || '')
      const transDate = String(get('TransactionDate') || '')
      accountRef = body._accountReference || ''
      shortcode = body._shortcode || ''
      name = ''
      source = 'MPESA_STK'
      paidAt = new Date()
      if (transDate.length >= 14) {
        const y = transDate.substring(0, 4)
        const m = transDate.substring(4, 6)
        const d = transDate.substring(6, 8)
        const h = transDate.substring(8, 10)
        const min = transDate.substring(10, 12)
        const s = transDate.substring(12, 14)
        paidAt = new Date(`${y}-${m}-${d}T${h}:${min}:${s}+03:00`)
      }
    } else {
      // ── C2B callback ──
      const result = body
      transId = result.TransID || result.TransactionId
      amount = parseInt(result.TransAmount || result.Amount || '0')
      phone = result.MSISDN || result.PhoneNumber || ''
      name = result.FirstName
        ? `${result.FirstName} ${result.MiddleName || ''} ${result.LastName || ''}`.trim()
        : result.BillRefNumber || ''
      accountRef = result.BillRefNumber || result.AccountReference || ''
      shortcode = result.BusinessShortCode || result.ReceivedFrom || ''
      source = 'MPESA_C2B'
      const transTime = result.TransTime || ''
      paidAt = new Date()
      if (transTime && transTime.length >= 14) {
        const y = transTime.substring(0, 4)
        const m = transTime.substring(4, 6)
        const d = transTime.substring(6, 8)
        const h = transTime.substring(8, 10)
        const min = transTime.substring(10, 12)
        const s = transTime.substring(12, 14)
        paidAt = new Date(`${y}-${m}-${d}T${h}:${min}:${s}+03:00`)
      }
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
        source,
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
