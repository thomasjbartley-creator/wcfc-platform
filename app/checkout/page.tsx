'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/app/components/Nav'
import InAppBrowserNotice from '@/app/components/InAppBrowserNotice'
import { createClient } from '@/lib/supabase'
import { Suspense } from 'react'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [paypalReady, setPaypalReady] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const buttonsRendered = useRef(false)
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const refCodeRef = useRef('')
  const firstNameRef = useRef('')
  const lastNameRef = useRef('')

  // Read referral code: ?ref= param first, then wcfc_ref cookie
  useEffect(() => {
    const refParam = searchParams.get('ref')
    if (refParam) {
      refCodeRef.current = refParam.toUpperCase()
      return
    }
    // Fall back to cookie
    const match = document.cookie.match(/(?:^|;\s*)wcfc_ref=([^;]+)/)
    if (match) {
      refCodeRef.current = decodeURIComponent(match[1]).toUpperCase()
    }
  }, [searchParams])

  // Keep refs in sync so PayPal callbacks see current values
  useEffect(() => { emailRef.current = email }, [email])
  useEffect(() => { passwordRef.current = password }, [password])
  useEffect(() => { firstNameRef.current = firstName }, [firstName])
  useEffect(() => { lastNameRef.current = lastName }, [lastName])

  // Load PayPal SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) {
      setError('PayPal is not configured. Please contact support.')
      return
    }

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
  }, [])

  // Render PayPal buttons when SDK is ready
  useEffect(() => {
    if (!paypalReady || !(window as any).paypal || buttonsRendered.current) return

    const container = document.getElementById('paypal-button-container')
    if (!container) return

    buttonsRendered.current = true

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

        // Validate email + password before creating the order
        const currentEmail = emailRef.current.trim()
        const currentPassword = passwordRef.current

        if (!currentEmail || !currentPassword) {
          throw new Error('Please enter your email and password before paying.')
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
          throw new Error('Please enter a valid email address.')
        }

        if (currentPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.')
        }

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

        const currentEmail = emailRef.current.trim().toLowerCase()
        const currentPassword = passwordRef.current

        try {
          const res = await fetch('/api/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderID: data.orderID,
              email: currentEmail,
              password: currentPassword,
              refCode: refCodeRef.current || undefined,
              firstName: firstNameRef.current.trim() || undefined,
              lastName: lastNameRef.current.trim() || undefined,
            }),
          })

          const result = await res.json()

          if (result.error === 'INSTRUMENT_DECLINED') {
            setError('Your payment method was declined. Please try a different payment method.')
            setProcessing(false)
            return
          }

          if (result.paymentReceived && !result.success) {
            // Payment captured but account creation failed
            setPaymentSuccess(true)
            setError(result.error)
            setProcessing(false)
            return
          }

          if (!res.ok || !result.success) {
            throw new Error(result.error || 'Payment failed')
          }

          // Sign in with the email + password
          const supabase = createClient()
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: currentEmail,
            password: currentPassword,
          })

          if (signInError) {
            console.warn('Auto sign-in failed:', signInError)
            // Payment worked, account created -- just redirect to login
            router.push('/auth/login?upgraded=champion')
            return
          }

          // Signed in -- go to dashboard
          router.push('/dashboard')

        } catch (err: any) {
          setError(err.message || 'Payment failed. Please try again.')
          setProcessing(false)
        }
      },

      onError: (err: any) => {
        console.error('PayPal button error:', err)
        // Extract the message if it's a validation error from createOrder
        const msg = err?.message || 'Something went wrong with PayPal. Please try again.'
        setError(msg)
        setProcessing(false)
      },

      onCancel: () => {
        setError('')
        setProcessing(false)
      },
    }).render('#paypal-button-container')
  }, [paypalReady, router])

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <Nav />
      <InAppBrowserNotice />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>CHAMPION FOUNDER</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '12px' }}>
            Join as Champion Founder
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.5rem', color: '#FFD600', marginBottom: '16px' }}>$10</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
            One-time founding membership. +25 bonus points at signup. Name on the Founding Wall. Champion tier on the leaderboard. Includes $2 donation to the Grassroots F&#250;tbol Fund.
          </p>
        </div>

        {/* BENEFITS */}
        <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          {['+25 bonus points at signup', 'Name on the Founding Wall', 'Champion tier on the leaderboard', '$2 donation to the Grassroots Fútbol Fund'].map(b => (
            <div key={b} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 0' }}>
              <span style={{ color: '#FFD600', flexShrink: 0 }}>{'✓'}</span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#8ab898' }}>{b}</span>
            </div>
          ))}
        </div>

        {/* PAYMENT SUCCESS BUT ACCOUNT FAILED */}
        {paymentSuccess && (
          <div style={{ background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.3)', borderRadius: '10px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>Payment Received</div>
            <p style={{ fontFamily: "'Barlow'", fontSize: '0.9rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '12px' }}>
              Your $10 payment was captured successfully. We&apos;re setting up your Champion account &mdash; if it doesn&apos;t appear within a few minutes, contact us.
            </p>
            <a href="mailto:thomasjbartley@worldcupfanchallenge.com" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#00C853', textDecoration: 'none' }}>
              Contact support &rarr;
            </a>
          </div>
        )}

        {/* EMAIL + PASSWORD + NAME FIELDS */}
        {!paymentSuccess && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px', marginBottom: '12px' }}>YOUR ACCOUNT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={processing}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={processing}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>First Name</label>
                <input
                  type="text"
                  placeholder="First"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={processing}
                  maxLength={50}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={processing}
                  maxLength={50}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', marginTop: '8px' }}>
              Already have an account? Use your existing email &mdash; we&apos;ll upgrade it to Champion.
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && !paymentSuccess && (
          <div style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#E53935', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* PROCESSING */}
        {processing && (
          <div style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#FFD600', letterSpacing: '1px' }}>
              Processing your payment...
            </div>
          </div>
        )}

        {/* PAYPAL BUTTONS */}
        {!paymentSuccess && (
          <div id="paypal-button-container" style={{ minHeight: '150px' }} />
        )}

        {/* FINE PRINT */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px', lineHeight: 1.8 }}>
            Secure payment via PayPal &middot; No purchase necessary to enter or win non-cash prizes &middot; 18+ for cash prizes
          </div>
          <div style={{ marginTop: '8px' }}>
            <Link href="/auth/signup" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', textDecoration: 'underline' }}>
              Just want a free account? Sign up here &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8ab898', fontFamily: "'Barlow', sans-serif" }}>
        Loading...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
