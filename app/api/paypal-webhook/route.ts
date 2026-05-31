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

/* --- Brevo: add/update contact on list with attributes --- */
async function addToBrevoList(email: string, listId: number, attributes?: Record<string, string>): Promise<void> {
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
        ...(attributes ? { attributes } : {}),
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

/* --- Orphan event logger (extended with action field) --- */
async function logOrphanEvent(
  supabase: ReturnType<typeof createAdminClient>,
  transactionId: string,
  payerEmail: string,
  amount: number,
  eventPayload: unknown,
  action?: string,
  extra?: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from('paypal_orphan_events')
    .upsert({
      transaction_id: transactionId,
      payer_email: payerEmail,
      amount,
      event_payload: eventPayload,
      ...(action ? { action } : {}),
      ...(extra || {}),
    }, { onConflict: 'transaction_id' })

  if (error) {
    console.error('Failed to log orphan event:', error)
  } else {
    console.warn(`Orphan event logged: ${payerEmail} / $${amount} / txn ${transactionId} / action=${action || 'orphan'}`)
  }
}

/* ================================================================
   HANDLER: PAYMENT.CAPTURE.COMPLETED
   - Existing-user tier upgrade (unchanged logic)
   - New-user auto-account-creation (Task A)
   ================================================================ */
async function handleCaptureCompleted(event: any, req: NextRequest, rawBody: string) {
  const resource = event.resource
  const transactionId: string = resource?.id ?? ''
  const payerEmail: string | undefined =
    resource?.payer?.email_address ??
    resource?.payment_source?.paypal?.email_address
  const payerFirstName: string =
    resource?.payer?.name?.given_name ?? ''

  const amountStr: string =
    resource?.amount?.value ??
    resource?.seller_receivable_breakdown?.gross_amount?.value ?? '0'
  const amount = parseFloat(amountStr)
  const newTier = amountToTier(amount)

  console.log(`PayPal CAPTURE.COMPLETED: email=${payerEmail} amount=$${amount} tier=${newTier} txn=${transactionId}`)

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

  // Also check orphan_events for idempotency (auto-create path)
  const { data: existingOrphan } = await supabase
    .from('paypal_orphan_events')
    .select('transaction_id')
    .eq('transaction_id', transactionId)
    .eq('action', 'auto_create_attempted')
    .maybeSingle()

  if (existingOrphan) {
    console.log(`Transaction ${transactionId} already auto-create attempted - skipping`)
    return NextResponse.json({ received: true, note: 'Auto-create already attempted' })
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

  /* ---- NEW USER: auto-create account (Task A) ---- */
  if (!profile) {
    console.log(`No profile for ${payerEmail} - attempting auto-create (tier=${newTier})`)

    // Step A3: Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: payerEmail,
      email_confirm: true,
      user_metadata: {
        first_name: payerFirstName,
        source: 'paypal_webhook_auto_create',
        paypal_transaction_id: transactionId,
      },
    })

    if (authError || !authData?.user) {
      console.error('Auto-create auth user failed:', authError)
      await logOrphanEvent(supabase, transactionId, payerEmail, amount, event, 'auto_create_failed', {
        success: false,
        error_message: authError?.message || 'Unknown auth error',
      })
      return NextResponse.json({ error: 'Auth user creation failed' }, { status: 500 })
    }

    const userId = authData.user.id
    console.log(`Auth user created: ${payerEmail} -> ${userId}`)

    // Step A4: Insert profile row
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email: payerEmail,
      first_name: payerFirstName,
      tier: newTier,
      auto_created_via_webhook: true,
      paypal_transaction_id: transactionId,
      created_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error('Profile insert failed after auth user created (ORPHAN AUTH USER):', profileError)
      await logOrphanEvent(supabase, transactionId, payerEmail, amount, event, 'orphan_auth_user', {
        success: false,
        user_id: userId,
        error_message: profileError.message,
      })
      // Return 200 — do NOT retry, would create duplicate auth users
      return NextResponse.json({ received: true, note: 'Profile insert failed - orphan auth user logged' })
    }

    console.log(`Profile created: ${payerEmail} tier=${newTier}`)

    // Step A5: Generate magic link
    try {
      const { error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: payerEmail,
        options: { redirectTo: 'https://worldcupfanchallenge.com/dashboard' },
      })
      if (linkError) {
        console.warn('Magic link generation failed (non-fatal):', linkError)
      } else {
        console.log(`Magic link sent to ${payerEmail}`)
      }
    } catch (linkErr) {
      console.warn('Magic link error (non-fatal):', linkErr)
    }

    // Step A6: Add to Brevo with TIER attribute
    await addToBrevoList(payerEmail, 2, { TIER: newTier, FIRSTNAME: payerFirstName })

    // Step A7: Log success to orphan events
    await logOrphanEvent(supabase, transactionId, payerEmail, amount, event, 'auto_create_attempted', {
      success: true,
      user_id: userId,
    })

    return NextResponse.json({ received: true, tier: newTier, auto_created: true })
  }

  /* ---- EXISTING USER: one-way tier upgrade (unchanged logic) ---- */
  const currentTier = profile.tier || 'free'
  if (!isUpgrade(currentTier, newTier)) {
    console.log(`${payerEmail} already at ${currentTier} (>= ${newTier}) - no change`)
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

  // Add to Brevo
  await addToBrevoList(payerEmail, 2, { TIER: newTier })

  return NextResponse.json({ received: true, tier: newTier, upgraded: true })
}

/* ================================================================
   HANDLER: PAYMENT.CAPTURE.REFUNDED / REVERSED (Task B)
   - Downgrade tier to 'free' for the original payer
   ================================================================ */
async function handleCaptureRefunded(event: any, actionLabel: string = 'refund_processed') {
  const resource = event.resource
  const refundId: string = resource?.id ?? ''
  const refundAmount: string = resource?.amount?.value ?? '0'

  // Extract original capture/transaction ID from links array (rel: 'up' points to original capture)
  let originalTransactionId = ''
  const links: Array<{ href?: string; rel?: string }> = resource?.links ?? []
  for (const link of links) {
    if (link.rel === 'up' && link.href) {
      // href format: https://api.paypal.com/v2/payments/captures/{capture_id}
      const parts = link.href.split('/')
      originalTransactionId = parts[parts.length - 1] || ''
      break
    }
  }

  console.log(`PayPal CAPTURE.REFUNDED: refundId=${refundId} originalTxn=${originalTransactionId} amount=$${refundAmount}`)

  const supabase = createAdminClient()

  // Idempotency: check if this refund event was already processed
  const { data: existingRefund } = await supabase
    .from('paypal_orphan_events')
    .select('transaction_id')
    .eq('transaction_id', refundId)
    .eq('action', actionLabel)
    .maybeSingle()

  if (existingRefund) {
    console.log(`${actionLabel}: ${refundId} already processed - skipping`)
    return NextResponse.json({ received: true, note: `${actionLabel} already processed` })
  }

  // Look up profile by original transaction_id
  if (!originalTransactionId) {
    console.warn('Refund event missing original transaction ID')
    await logOrphanEvent(supabase, refundId, '', parseFloat(refundAmount), event, 'refund_missing_original_txn')
    return NextResponse.json({ received: true, note: 'Refund event missing original txn ID - logged' })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, tier, auto_created_via_webhook')
    .eq('paypal_transaction_id', originalTransactionId)
    .maybeSingle()

  if (!profile) {
    console.warn(`Refund: no profile found with txn ${originalTransactionId}`)
    await logOrphanEvent(supabase, refundId, '', parseFloat(refundAmount), event, 'refund_for_unknown_payment', {
      original_transaction_id: originalTransactionId,
    })
    return NextResponse.json({ received: true, note: 'No profile found for refunded payment - logged' })
  }

  // Downgrade tier to 'free'
  const previousTier = profile.tier || 'free'
  const { error: downgradeError } = await supabase
    .from('profiles')
    .update({ tier: 'free' })
    .eq('id', profile.id)

  if (downgradeError) {
    console.error('Refund tier downgrade failed:', downgradeError)
    await logOrphanEvent(supabase, refundId, profile.email, parseFloat(refundAmount), event, 'refund_downgrade_failed', {
      user_id: profile.id,
      error_message: downgradeError.message,
    })
    return NextResponse.json({ error: 'Downgrade failed' }, { status: 500 })
  }

  console.log(`Refund downgrade: ${profile.email} ${previousTier} -> free (refund ${refundId}, original txn ${originalTransactionId})`)

  // Update Brevo TIER attribute
  await addToBrevoList(profile.email, 2, { TIER: 'free' })

  // Log refund/reversal processed
  await logOrphanEvent(supabase, refundId, profile.email, parseFloat(refundAmount), event, actionLabel, {
    success: true,
    user_id: profile.id,
    previous_tier: previousTier,
    original_transaction_id: originalTransactionId,
  })

  return NextResponse.json({ received: true, refunded: true, previous_tier: previousTier })
}

/* ================================================================
   HANDLER: CUSTOMER.DISPUTE.CREATED / RESOLVED (Task C)
   - Log all dispute events for manual review
   - On RESOLVED_BUYER_FAVOUR: downgrade tier (same as refund)
   ================================================================ */
async function handleDisputeEvent(event: any) {
  const resource = event.resource
  const disputeId: string = resource?.dispute_id ?? event.id ?? ''
  const eventType: string = event.event_type
  const reason: string = resource?.reason ?? ''
  const outcome: string = resource?.dispute_outcome?.outcome_code ?? resource?.status ?? ''

  // Try to find the disputed transaction ID
  const disputedTxns: Array<{ seller_transaction_id?: string }> = resource?.disputed_transactions ?? []
  const originalTransactionId = disputedTxns[0]?.seller_transaction_id ?? ''

  // Try to extract buyer email
  const buyerEmail: string = resource?.buyer?.email ?? ''

  console.log(`PayPal DISPUTE: type=${eventType} disputeId=${disputeId} outcome=${outcome} reason=${reason} originalTxn=${originalTransactionId} buyer=${buyerEmail}`)

  const supabase = createAdminClient()

  // Log every dispute event
  await logOrphanEvent(supabase, disputeId, buyerEmail, 0, event, `dispute_${eventType === 'CUSTOMER.DISPUTE.CREATED' ? 'opened' : 'resolved'}`, {
    dispute_reason: reason,
    dispute_outcome: outcome,
    original_transaction_id: originalTransactionId,
  })

  // On dispute resolved in buyer's favour: downgrade tier (same as refund)
  if (eventType === 'CUSTOMER.DISPUTE.RESOLVED' && outcome === 'RESOLVED_BUYER_FAVOUR') {
    if (!originalTransactionId) {
      console.warn('Dispute resolved buyer favour but no original txn ID — manual review needed')
      return NextResponse.json({ received: true, note: 'Dispute buyer favour - no txn ID to downgrade' })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, tier')
      .eq('paypal_transaction_id', originalTransactionId)
      .maybeSingle()

    if (profile) {
      const previousTier = profile.tier || 'free'
      await supabase.from('profiles').update({ tier: 'free' }).eq('id', profile.id)
      await addToBrevoList(profile.email, 2, { TIER: 'free' })
      console.log(`Dispute buyer favour downgrade: ${profile.email} ${previousTier} -> free`)
      await logOrphanEvent(supabase, `${disputeId}_downgrade`, profile.email, 0, event, 'dispute_buyer_favour_downgrade', {
        success: true,
        user_id: profile.id,
        previous_tier: previousTier,
      })
    } else {
      console.warn(`Dispute buyer favour: no profile found for txn ${originalTransactionId}`)
    }
  }

  return NextResponse.json({ received: true, dispute_logged: true })
}

/* ================================================================
   MAIN WEBHOOK HANDLER — event type router
   ================================================================ */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const event = JSON.parse(rawBody)
    const eventType: string = event.event_type ?? ''

    console.log(`PayPal webhook received: event_type=${eventType}`)

    // STRICT signature verification for ALL event types
    const verified = await verifyPayPalWebhook(req, rawBody)
    if (!verified) {
      console.error('PayPal webhook signature verification FAILED - rejecting')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Route by event type
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        return await handleCaptureCompleted(event, req, rawBody)

      case 'PAYMENT.CAPTURE.REFUNDED':
        return await handleCaptureRefunded(event, 'refund_processed')

      case 'PAYMENT.CAPTURE.REVERSED':
        return await handleCaptureRefunded(event, 'reversal_processed')

      case 'CUSTOMER.DISPUTE.CREATED':
      case 'CUSTOMER.DISPUTE.RESOLVED':
        return await handleDisputeEvent(event)

      default: {
        // Log unhandled event types — never return non-200
        console.log(`Unhandled PayPal event type: ${eventType}`)
        const supabase = createAdminClient()
        await logOrphanEvent(supabase, event.id ?? `unhandled_${Date.now()}`, '', 0, event, 'unhandled_event_type', {
          event_type: eventType,
        })
        return NextResponse.json({ received: true, note: `Unhandled event type: ${eventType}` })
      }
    }

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
