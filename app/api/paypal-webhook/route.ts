import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

/* --- Tier ladder (order matters: higher index = higher tier) --- */
const TIER_RANK: Record<string, number> = {
  free: 0,
  plus: 1,
  premium: 2,
  champion: 3,
}

/** Map payment amount to tier name */
function amountToTier(amount: number): string | null {
  if (amount >= 10) return 'champion'
  if (amount >= 5)  return 'premium'
  if (amount >= 3)  return 'plus'
  return null
}

/** Returns true if newTier outranks currentTier */
function isUpgrade(currentTier: string, newTier: string): boolean {
  return (TIER_RANK[newTier] ?? 0) > (TIER_RANK[currentTier] ?? 0)
}

/* --- PayPal signature verification (STRICT - rejects if creds missing) --- */
async function verifyPayPalWebhook(req: NextRequest, rawBody: string): Promise<boolean> {
  const clientId     = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const webhookId    = process.env.PAYPAL_WEBHOOK_ID

  // STRICT: reject all webhooks if credentials are not configured
  if (!clientId || !clientSecret || !webhookId) {
    console.error('PAYPAL credentials missing - rejecting webhook (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, or PAYPAL_WEBHOOK_ID not set)')
    return false
  }

  // Determine API base from env (sandbox vs live)
  const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

  // Get access token
  const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!tokenRes.ok) {
    console.error('PayPal OAuth token request failed:', tokenRes.status)
    return false
  }
  const { access_token } = await tokenRes.json()

  // Verify signature
  const verifyRes = await fetch(`${apiBase}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo:         req.headers.get('paypal-auth-algo'),
      cert_url:          req.headers.get('paypal-cert-url'),
      transmission_id:   req.headers.get('paypal-transmission-id'),
      transmission_sig:  req.headers.get('paypal-transmission-sig'),
      transmission_time: req.headers.get('paypal-transmission-time'),
      webhook_id:        webhookId,
      webhook_event:     JSON.parse(rawBody),
    }),
  })
  if (!verifyRes.ok) {
    console.error('PayPal verify-webhook-signature failed:', verifyRes.status)
    return false
  }
  const { verification_status } = await verifyRes.json()
  return verification_status === 'SUCCESS'
}

/* --- Brevo: add contact to list --- */
async function addToBrevoList(email: string, listId: number): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set - skipping Brevo list add')
    return
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`Brevo API error (${res.status}):`, body)
    } else {
      console.log(`Brevo: added/updated ${email} on list ${listId}`)
    }
  } catch (err) {
    console.error('Brevo API call failed:', err)
  }
}

/* --- Orphan event logger --- */
async function logOrphanEvent(
  supabase: ReturnType<typeof createAdminClient>,
  transactionId: string,
  payerEmail: string,
  amount: number,
  eventPayload: unknown
): Promise<void> {
  const { error } = await supabase
    .from('paypal_orphan_events')
    .upsert({
      transaction_id: transactionId,
      payer_email: payerEmail,
      amount,
      event_payload: eventPayload,
    }, { onConflict: 'transaction_id' })

  if (error) {
    console.error('Failed to log orphan event:', error)
  } else {
    console.warn(`Orphan event logged: ${payerEmail} / $${amount} / txn ${transactionId}`)
  }
}

/* --- Main webhook handler --- */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const event = JSON.parse(rawBody)

    // Only handle completed payments
    if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
      return NextResponse.json({ received: true })
    }

    // STRICT signature verification
    const verified = await verifyPayPalWebhook(req, rawBody)
    if (!verified) {
      console.error('PayPal webhook signature verification FAILED - rejecting')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const resource = event.resource
    const transactionId: string = resource?.id ?? ''
    const payerEmail: string | undefined =
      resource?.payer?.email_address ??
      resource?.payment_source?.paypal?.email_address

    const amountStr: string =
      resource?.amount?.value ??
      resource?.seller_receivable_breakdown?.gross_amount?.value ?? '0'
    const amount = parseFloat(amountStr)
    const newTier = amountToTier(amount)

    console.log(`PayPal webhook: email=${payerEmail} amount=$${amount} tier=${newTier} txn=${transactionId}`)

    if (!payerEmail || !newTier) {
      return NextResponse.json({ received: true, note: 'No matching tier for amount or no email' })
    }

    const supabase = createAdminClient()

    // Idempotency check: has this transaction already been processed?
    const { data: existingTxn } = await supabase
      .from('profiles')
      .select('id')
      .eq('paypal_transaction_id', transactionId)
      .maybeSingle()

    if (existingTxn) {
      console.log(`Transaction ${transactionId} already processed - skipping`)
      return NextResponse.json({ received: true, note: 'Already processed' })
    }

    // Look up profile by email
    const { data: profile, error: lookupError } = await supabase
      .from('profiles')
      .select('id, tier, email')
      .eq('email', payerEmail)
      .maybeSingle()

    if (lookupError) {
      console.error('Profile lookup error:', lookupError)
      return NextResponse.json({ error: 'DB lookup failed' }, { status: 500 })
    }

    // Orphan: no profile matches this email
    if (!profile) {
      await logOrphanEvent(supabase, transactionId, payerEmail, amount, event)
      return NextResponse.json({ received: true, note: 'No profile found - logged as orphan' })
    }

    // One-way tier upgrade: only go UP, never down
    const currentTier = profile.tier || 'free'
    if (!isUpgrade(currentTier, newTier)) {
      console.log(`${payerEmail} already at ${currentTier} (>= ${newTier}) - no change`)
      // Still record the transaction for audit trail
      await supabase
        .from('profiles')
        .update({ paypal_transaction_id: transactionId })
        .eq('id', profile.id)
      return NextResponse.json({ received: true, note: 'Current tier same or higher' })
    }

    // Upgrade the tier
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        tier: newTier,
        paid_at: new Date().toISOString(),
        paypal_transaction_id: transactionId,
      })
      .eq('id', profile.id)

    if (updateError) {
      console.error('Supabase tier update error:', updateError)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`Tier upgraded: ${payerEmail} ${currentTier} -> ${newTier} (txn: ${transactionId})`)

    // Add to Brevo "WCFC Master List" (list ID 2)
    await addToBrevoList(payerEmail, 2)

    return NextResponse.json({ received: true, tier: newTier, upgraded: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
