import { NextResponse } from 'next/server'

/**
 * ONE-TIME SETUP ROUTE — creates a PayPal webhook lookup
 * so NCP/hosted payment-link events are delivered to our webhook.
 *
 * Hit GET /api/setup-webhook-lookup once in production, then delete this file.
 */
export async function GET() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not set' }, { status: 500 })
    }

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

    // Step 1: Get OAuth2 access token
    const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      const body = await tokenRes.text()
      return NextResponse.json({ error: 'OAuth token failed', status: tokenRes.status, body }, { status: 500 })
    }

    const { access_token } = await tokenRes.json()

    // Step 2: List existing webhook lookups
    const listRes = await fetch(`${apiBase}/v1/notifications/webhooks-lookup`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const listBody = await listRes.json()

    if (!listRes.ok) {
      return NextResponse.json({
        step: 'list_lookups',
        error: 'List lookups failed',
        status: listRes.status,
        body: listBody
      }, { status: 500 })
    }

    // Check if any lookups already exist
    const existingLookups = listBody?.webhooks_lookup || listBody?.items || []
    if (existingLookups.length > 0) {
      return NextResponse.json({
        step: 'list_lookups',
        message: 'Webhook lookup(s) already exist — stopping. Investigate before changing.',
        lookups: existingLookups,
      })
    }

    // Step 3: Create webhook lookup (no body needed — ties caller's app to account)
    const createRes = await fetch(`${apiBase}/v1/notifications/webhooks-lookup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    })

    const createBody = await createRes.json()

    if (createRes.status === 201 || createRes.ok) {
      return NextResponse.json({
        step: 'create_lookup',
        message: 'Webhook lookup created successfully!',
        status: createRes.status,
        lookup: createBody,
      })
    } else {
      return NextResponse.json({
        step: 'create_lookup',
        error: 'Create lookup failed',
        status: createRes.status,
        body: createBody,
      }, { status: 500 })
    }

  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error', message: String(err) }, { status: 500 })
  }
}
