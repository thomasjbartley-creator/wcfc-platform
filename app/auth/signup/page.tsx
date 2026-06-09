'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import InAppBrowserNotice from '@/app/components/InAppBrowserNotice'

function generateReferralCode(seed: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const base = (seed || 'FAN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  return base + suffix
}

export default function SignupPage() { return <Suspense fallback={null}><SignupPageContent /></Suspense> }

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [referredBy, setReferredBy] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setReferredBy(ref)
  }, [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!form.firstName.trim()) {
      setError('Please enter your first name')
      setLoading(false)
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    const cleanFirst = form.firstName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'FAN'
    const username = cleanFirst + Math.floor(1000 + Math.random() * 9000)
    const referralCode = generateReferralCode(form.firstName)
    const cleanEmail = form.email.trim().toLowerCase()
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
          }
        }
      })
      if (authError) throw authError
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: cleanEmail,
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            username,
            referral_code: referralCode,
            referred_by: referredBy ?? null,
          })
        if (profileError) throw profileError
        router.push('/picks/bracket')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <InAppBrowserNotice />
    <div style={{
      minHeight: '100vh',
      background: '#050C0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '4px' }}>
                WCFC<span style={{ color: '#00C853' }}>.</span>
              </div>
            </a>
            <div id="translate-widget-slot" style={{ display: 'inline-block' }} />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#5a8a68', letterSpacing: '3px', textTransform: 'uppercase' }}>
            World Cup Fan Challenge
          </div>
        </div>
        <div style={{
          background: '#0a1410',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '36px',
        }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>
            Create Your Account
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '28px', letterSpacing: '0.5px' }}>
            Join the global fan challenge — free to play
          </div>
          {referredBy && (
            <div style={{
              background: 'rgba(0,200,83,0.08)',
              border: '1px solid rgba(0,200,83,0.25)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontFamily: "'Barlow Condensed'",
              fontSize: '0.9rem',
              color: '#00C853',
            }}>
              You were invited by a friend! Sign up to join the challenge together.
            </div>
          )}
          {error && (
            <div style={{
              background: 'rgba(229,57,53,0.1)',
              border: '1px solid rgba(229,57,53,0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontFamily: "'Barlow Condensed'",
              fontSize: '0.9rem',
              color: '#ff6b6b',
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  placeholder="First"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Last"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                style={inputStyle}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5a8a68', fontFamily: "'Barlow Condensed'", lineHeight: '1.5', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              By creating an account you agree that no purchase is necessary to enter or win. This is a free, skill-based competition.
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? 'rgba(0,200,83,0.4)' : '#00C853',
                color: '#050C0A',
                border: 'none',
                borderRadius: '6px',
                fontFamily: "'Bebas Neue'",
                fontSize: '1.05rem',
                letterSpacing: '3px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE MY ACCOUNT →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#00C853', textDecoration: 'none' }}>Sign in →</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px' }}>
          {'✓'} No purchase necessary to win {' '}{'·'}{' '} {'✓'} Skill-based competition {' '}{'·'}{' '} {'✓'} Secure &amp; private
        </div>
      </div>
    </div>
    </>
  )
}
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Barlow Condensed'",
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#8ab898',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '6px',
}
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  padding: '11px 14px',
  fontFamily: "'Barlow'",
  fontSize: '0.95rem',
  color: 'white',
  outline: 'none',
}
