import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/capture-order
 * Captures a PayPal Orders v2 payment and upgrades the logged-in user to Champion.
 * Called by the PayPal button's onApprove callback.
 *
 * Expects JSON body: { orderID: string }
 * Expects the user to be authenticated (cookie-based Supabase session).
 */
export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json()

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

    // --- Identify the logged-in user via Supabase session cookie ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Read all cookies and pass them to the Supabase client
    const cookieHeader = req.headers.get('cookie') || ''

    // Create a server-side Supabase client that can read the auth cookie
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { cookie: cookieHeader } },
    })

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()

    if (userError || !user) {
      console.error('Capture-order: user not authenticated', userError)
      return NextResponse.json({ error: 'Not authenticated. Please log in first.' }, { status: 401 })
    }

    const userId = user.id
    const userEmail = user.email || ''

    console.log(`Capture-order: user=${userEmail} orderID=${orderID}`)

    // --- Capture the PayPal order ---
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('PAYPAL credentials missing for capture-order')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

    // Get OAuth2 access token
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

    // Capture the order
    const captureRes = await fetch(`${apiBase}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await captureRes.json()

    if (!captureRes.ok) {
      // Handle INSTRUMENT_DECLINED specifically
      if (captureData?.details?.[0]?.issue === 'INSTRUMENT_DECLINED') {
        console.warn('Capture-order: INSTRUMENT_DECLINED for', userEmail)
        return NextResponse.json({ error: 'INSTRUMENT_DECLINED' }, { status: 422 })
      }
      console.error('PayPal capture failed:', captureRes.status, captureData)
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 })
    }

    if (captureData.status !== 'COMPLETED') {
      console.error('PayPal capture status not COMPLETED:', captureData.status)
      return NextResponse.json({ error: `Unexpected capture status: ${captureData.status}` }, { status: 500 })
    }

    // Extract capture/transaction ID for idempotency
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
    const transactionId = capture?.id || orderID
    const capturedAmount = capture?.amount?.value || '10.00'

    console.log(`PayPal capture successful: txn=${transactionId} amount=$${capturedAmount} user=${userEmail}`)

    // --- Upgrade the logged-in user to Champion ---
    const adminClient = createAdminClient()

    // Idempotency: check if this transaction was already processed
    const { data: existingTxn } = await adminClient
      .from('profiles')
      .select('id')
      .eq('paypal_transaction_id', transactionId)
      .maybeSingle()

    if (existingTxn) {
      console.log(`Transaction ${transactionId} already processed - returning success without re-upgrading`)
      return NextResponse.json({ success: true, tier: 'champion', note: 'Already processed' })
    }

    // Get current profile
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id, tier, email')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('Profile lookup error:', profileError)
      return NextResponse.json({ error: 'Profile lookup failed' }, { status: 500 })
    }

    if (!profile) {
      // Profile doesn't exist yet — create it (user signed up free but no profile row yet)
      const { error: insertError } = await adminClient.from('profiles').insert({
        id: userId,
        email: userEmail,
        tier: 'champion',
        paypal_transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('Profile insert error:', insertError)
        return NextResponse.json({ error: 'Profile creation failed' }, { status: 500 })
      }

      console.log(`Profile created with champion tier: ${userEmail}`)
    } else {
      // Profile exists — upgrade tier
      const { error: updateError } = await adminClient
        .from('profiles')
        .update({
          tier: 'champion',
          paid_at: new Date().toISOString(),
          paypal_transaction_id: transactionId,
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Tier upgrade error:', updateError)
        return NextResponse.json({ error: 'Tier upgrade failed' }, { status: 500 })
      }

      console.log(`Tier upgraded: ${userEmail} ${profile.tier} -> champion (txn: ${transactionId})`)
    }

    // Non-critical: Brevo update (fire-and-forget)
    const brevoKey = process.env.BREVO_API_KEY
    if (brevoKey) {
      fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          listIds: [2],
          updateEnabled: true,
          attributes: { TIER: 'champion' },
        }),
      }).catch(err => console.warn('Brevo update failed (non-fatal):', err))
    }

    return NextResponse.json({ success: true, tier: 'champion', transactionId })

  } catch (err) {
    console.error('Capture order error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
