'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Nav from '@/app/components/Nav'

export default function CheckoutPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paypalReady, setPaypalReady] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  // Check auth on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  // Load PayPal SDK after auth check
  useEffect(() => {
    if (loading || !user) return

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setError('PayPal is not configured. Please contact support.')
      return
    }

    // Don't load twice
    if (document.getElementById('paypal-sdk-script')) {
      setPaypalReady(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'paypal-sdk-script'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
    script.onload = () => setPaypalReady(true)
    script.onerror = () => setError('Failed to load PayPal. Please refresh and try again.')
    document.body.appendChild(script)
  }, [loading, user])

  // Render PayPal buttons when SDK is ready
  useEffect(() => {
    if (!paypalReady || !(window as any).paypal) return

    const container = document.getElementById('paypal-button-container')
    if (!container || container.hasChildNodes()) return

    ;(window as any).paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        height: 48,
      },

      createOrder: async () => {
        setError('')
        const res = await fetch('/api/create-order', { method: 'POST' })
        const data = await res.json()
        if (!res.ok || !data.id) {
          throw new Error(data.error || 'Failed to create order')
        }
        return data.id
      },

      onApprove: async (data: any) => {
        setProcessing(true)
        setError('')
        try {
          const res = await fetch('/api/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          })
          const result = await res.json()

          if (!res.ok) {
            if (result.error === 'INSTRUMENT_DECLINED') {
              setError('Your payment method was declined. Please try a different payment method.')
              setProcessing(false)
              return
            }
            throw new Error(result.error || 'Payment capture failed')
          }

          // Success — redirect to thank-you
          router.push('/thank-you?tier=champion')
        } catch (err: any) {
          setError(err.message || 'Payment failed. Please try again.')
          setProcessing(false)
        }
      },

      onError: (err: any) => {
        console.error('PayPal button error:', err)
        setError('Something went wrong with PayPal. Please try again.')
        setProcessing(false)
      },

      onCancel: () => {
        setError('')
        setProcessing(false)
      },
    }).render('#paypal-button-container')
  }, [paypalReady, router])

  // Not logged in — show login prompt
  if (!loading && !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
        <Nav />
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.4rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Sign In to Continue</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '32px' }}>
            Create a free account or sign in to upgrade to Champion Founder.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ padding: '14px 32px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
              CREATE FREE ACCOUNT
            </Link>
            <Link href="/auth/login" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d0ead8', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <Nav />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>CHAMPION FOUNDER</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '12px' }}>
            Join as Champion Founder
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.5rem', color: '#FFD600', marginBottom: '16px' }}>$10</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
            One-time founding membership. Includes all future tournament entries — no fees ever. +25 bonus points. Name on the Founding Wall. Includes $2 donation to youth fútbol.
          </p>
        </div>

        {/* BENEFITS */}
        <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          {['All future tournament entries included', '+25 bonus points at signup', 'Name on the Founding Wall', '$2 donation to Grassroots Fútbol Fund', 'Champion tier on leaderboard'].map(b => (
            <div key={b} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 0' }}>
              <span style={{ color: '#FFD600', flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#8ab898' }}>{b}</span>
            </div>
          ))}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#E53935', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* PROCESSING OVERLAY */}
        {processing && (
          <div style={{ textAlign: 'center', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#FFD600', letterSpacing: '1px' }}>
              Processing your payment...
            </div>
          </div>
        )}

        {/* PAYPAL BUTTONS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: "'Barlow'", color: '#5a8a68' }}>Loading...</div>
        ) : (
          <div id="paypal-button-container" style={{ minHeight: '150px' }} />
        )}

        {/* FINE PRINT */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px', lineHeight: 1.8 }}>
          Secure payment via PayPal · No purchase necessary to enter or win non-cash prizes · 18+ for cash prizes
        </div>
      </div>
    </div>
  )
}
