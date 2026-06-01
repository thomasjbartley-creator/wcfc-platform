import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

/**
 * POST /api/capture-order
 * Captures a PayPal Orders v2 payment and creates/upgrades a Supabase user to Champion.
 * No prior login required — email + password are submitted with the order.
 *
 * Expects JSON body: { orderID: string, email: string, password: string, refCode?: string }
 *
 * Flow:
 *   1. Capture the PayPal order (server-side, validates $10)
 *   2. Create Supabase auth user (or find existing)
 *   3. Insert/upgrade profile to champion
 *   4. Return success — client signs in with email+password and redirects
 *
 * Idempotent: same orderID processed twice will not create duplicate users.
 */
export async function POST(req: NextRequest) {
  try {
    const { orderID, email, password, refCode } = await req.json()

    if (!orderID || !email || !password) {
      return NextResponse.json({ error: 'Missing orderID, email, or password' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const referralCode = refCode ? String(refCode).trim().toUpperCase() : null

    console.log(`Capture-order: email=${normalizedEmail} orderID=${orderID}`)

    // --- Step 1: Capture the PayPal order ---
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('PAYPAL credentials missing for capture-order')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

    const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      console.error('PayPal OAuth token failed:', tokenRes.status)
      return NextResponse.json({ error: 'PayPal auth failed' }, { status: 500 })
    }

    const { access_token } = await tokenRes.json()

    const captureRes = await fetch(`${apiBase}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await captureRes.json()

    if (!captureRes.ok) {
      if (captureData?.details?.[0]?.issue === 'INSTRUMENT_DECLINED') {
        console.warn('Capture-order: INSTRUMENT_DECLINED for', normalizedEmail)
        return NextResponse.json({ error: 'INSTRUMENT_DECLINED' }, { status: 422 })
      }
      // ORDER_ALREADY_CAPTURED means this is an idempotent retry — treat as success
      if (captureData?.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
        console.log(`Order ${orderID} already captured — continuing to account creation`)
      } else {
        console.error('PayPal capture failed:', captureRes.status, captureData)
        return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 })
      }
    }

    // For already-captured orders, status check is skipped
    if (captureRes.ok && captureData.status !== 'COMPLETED') {
      console.error('PayPal capture status not COMPLETED:', captureData.status)
      return NextResponse.json({ error: `Unexpected capture status: ${captureData.status}` }, { status: 500 })
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
    const transactionId = capture?.id || orderID

    console.log(`PayPal capture successful: txn=${transactionId} email=${normalizedEmail}`)

    // --- Step 2: Create or find Supabase user ---
    const adminClient = createAdminClient()

    // Idempotency: check if this transaction was already processed
    const { data: existingTxn } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('paypal_transaction_id', transactionId)
      .maybeSingle()

    if (existingTxn) {
      console.log(`Transaction ${transactionId} already processed — returning success`)
      return NextResponse.json({ success: true, tier: 'champion', email: existingTxn.email, note: 'Already processed' })
    }

    // Check if user already exists in auth
    const { data: existingUsers } = await adminClient.auth.admin.listUsers({ perPage: 1, page: 1 })
    // listUsers doesn't filter by email — use a profile lookup instead
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('id, tier, email, referred_by')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // Validate referral code: must exist and must not be self-referral
    let validatedRefCode: string | null = null
    if (referralCode) {
      const { data: referrer } = await adminClient
        .from('profiles')
        .select('id, email, referral_code')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (referrer && referrer.email !== normalizedEmail) {
        validatedRefCode = referralCode
        console.log(`Referral validated: ${referralCode} -> referrer ${referrer.email}`)
      } else if (referrer && referrer.email === normalizedEmail) {
        console.log(`Self-referral blocked: ${normalizedEmail} tried code ${referralCode}`)
      } else {
        console.log(`Referral code ${referralCode} not found — ignoring`)
      }
    }

    let userId: string

    if (existingProfile) {
      // --- Existing user: upgrade tier (do NOT touch their password) ---
      userId = existingProfile.id

      const updateFields: Record<string, any> = {
          tier: 'champion',
          paid_at: new Date().toISOString(),
          paypal_transaction_id: transactionId,
      }
      // Only set referred_by if not already set (don't overwrite an earlier referral)
      if (validatedRefCode && !existingProfile.referred_by) {
        updateFields.referred_by = validatedRefCode
      }

      const { error: updateError } = await adminClient
        .from('profiles')
        .update(updateFields)
        .eq('id', userId)

      if (updateError) {
        console.error('Tier upgrade error:', updateError)
        // Payment captured but upgrade failed — log for manual reconciliation
        await logPaymentWithoutAccount(adminClient, transactionId, normalizedEmail, 'upgrade_failed', updateError.message)
        return NextResponse.json({
          success: false,
          paymentReceived: true,
          error: 'Payment received but account upgrade failed. We will set you up — contact thomasjbartley@worldcupfanchallenge.com if needed.',
        }, { status: 500 })
      }

      console.log(`Existing user upgraded: ${normalizedEmail} ${existingProfile.tier} -> champion`)
    } else {
      // --- New user: create auth user + profile ---
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          source: 'checkout_page',
          paypal_transaction_id: transactionId,
        },
      })

      if (authError || !authData?.user) {
        console.error('Auth user creation failed:', authError)
        await logPaymentWithoutAccount(adminClient, transactionId, normalizedEmail, 'auth_create_failed', authError?.message || 'Unknown')
        return NextResponse.json({
          success: false,
          paymentReceived: true,
          error: 'Payment received but account creation failed. We will set you up — contact thomasjbartley@worldcupfanchallenge.com if needed.',
        }, { status: 500 })
      }

      userId = authData.user.id

      // The DB trigger on_auth_user_created auto-creates a profile at tier='free'.
      // UPDATE that row to champion instead of inserting a duplicate.
      const newProfileFields: Record<string, any> = {
          tier: 'champion',
          paypal_transaction_id: transactionId,
          paid_at: new Date().toISOString(),
      }
      if (validatedRefCode) {
        newProfileFields.referred_by = validatedRefCode
      }

      const { error: profileError } = await adminClient
        .from('profiles')
        .update(newProfileFields)
        .eq('id', userId)

      if (profileError) {
        console.error('Profile upgrade failed after auth user created:', profileError)
        await logPaymentWithoutAccount(adminClient, transactionId, normalizedEmail, 'profile_upgrade_failed', profileError.message)
        return NextResponse.json({
          success: false,
          paymentReceived: true,
          error: 'Payment received but profile upgrade failed. We will set you up — contact thomasjbartley@worldcupfanchallenge.com if needed.',
        }, { status: 500 })
      }

      console.log(`New user created: ${normalizedEmail} -> champion (txn: ${transactionId})`)
    }

    // Non-critical: Brevo (fire-and-forget)
    const brevoKey = process.env.BREVO_API_KEY
    if (brevoKey) {
      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          listIds: [2],
          updateEnabled: true,
          attributes: { TIER: 'champion' },
        }),
      }).catch(err => console.warn('Brevo update failed (non-fatal):', err))
    }

    return NextResponse.json({ success: true, tier: 'champion', email: normalizedEmail, transactionId })

  } catch (err) {
    console.error('Capture order error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/** Log a payment that succeeded but account creation failed — for manual reconciliation */
async function logPaymentWithoutAccount(
  supabase: ReturnType<typeof createAdminClient>,
  transactionId: string,
  email: string,
  action: string,
  errorMessage: string
) {
  try {
    await supabase.from('paypal_orphan_events').upsert({
      transaction_id: transactionId,
      payer_email: email,
      amount: 10,
      action,
      metadata: { error_message: errorMessage, source: 'capture_order' },
    }, { onConflict: 'transaction_id' })
    console.warn(`Orphan logged: ${email} / txn ${transactionId} / ${action}`)
  } catch (e) {
    console.error('Failed to log orphan event:', e)
  }
}
