import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/create-order
 * Creates a PayPal Orders v2 order for Champion Founder ($10).
 * Called by the PayPal button's createOrder callback.
 * Amount is set server-side — never trusted from the client.
 */
export async function POST(req: NextRequest) {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('PAYPAL credentials missing for create-order')
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

    // Create order — $10 Champion Founder, amount set server-side
    const orderRes = await fetch(`${apiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '10.00',
            },
            description: 'WCFC Champion Founder Membership',
          },
        ],
      }),
    })

    const orderData = await orderRes.json()

    if (!orderRes.ok) {
      console.error('PayPal create order failed:', orderRes.status, orderData)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    console.log(`PayPal order created: ${orderData.id}`)
    return NextResponse.json({ id: orderData.id })

  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
