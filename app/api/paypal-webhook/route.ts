import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// Map payment amount → tier
// Using floor to handle minor rounding differences ($9.99 → champion, etc.)
function amountToTier(amount: number): string | null {
  if (amount >= 10) return 'champion'
  if (amount >= 5)  return 'premium'
  if (amount >= 3)  return 'plus'
  return null
}

// Verify PayPal webhook signature using their REST API
async function verifyPayPalWebhook(req: NextRequest, rawBody: string): Promise<boolean> {
  const clientId     = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const webhookId    = process.env.PAYPAL_WEBHOOK_ID

  // If creds not configured, skip verification (dev mode only)
  if (!clientId || !clientSecret || !webhookId) {
    console.warn('PayPal webhook credentials not set — skipping signature verification')
    return true
  }

  // Get access token
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!tokenRes.ok) return false
  const { access_token } = await tokenRes.json()

  // Verify signature
  const verifyRes = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
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
  if (!verifyRes.ok) return false
  const { verification_status } = await verifyRes.json()
  return verification_status === 'SUCCESS'
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const event = JSON.parse(rawBody)

    // Only handle completed payments
    if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
      return NextResponse.json({ received: true })
    }

    const verified = await verifyPayPalWebhook(req, rawBody)
    if (!verified) {
      console.error('PayPal webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const resource = event.resource
    const payerEmail: string | undefined =
      resource?.payer?.email_address ??
      resource?.payment_source?.paypal?.email_address

    const amountStr: string = resource?.amount?.value ?? resource?.seller_receivable_breakdown?.gross_amount?.value ?? '0'
    const amount = parseFloat(amountStr)
    const tier = amountToTier(amount)

    console.log(`PayPal payment: ${payerEmail} paid $${amount} → tier: ${tier}`)

    if (!payerEmail || !tier) {
      return NextResponse.json({ received: true, note: 'No matching tier for amount' })
    }

    // Update profile tier in Supabase (match by email)
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .update({ tier })
      .eq('email', payerEmail)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`✓ Tier updated to '${tier}' for ${payerEmail}`)
    return NextResponse.json({ received: true, tier, email: payerEmail })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
