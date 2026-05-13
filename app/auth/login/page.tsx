'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (authError) throw authError
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password'
      setError(message)
    } finally {
      setLoading(false)
    }
  }
  return (
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '4px' }}>
              WCFC<span style={{ color: '#00C853' }}>.</span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#5a8a68', letterSpacing: '3px', textTransform: 'uppercase' }}>
              World Cup Fan Challenge
            </div>
          </a>
        </div>
        <div style={{
          background: '#0a1410',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '36px',
        }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>
            Welcome Back
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '28px' }}>
            Sign in to make picks and check the leaderboard
          </div>
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
              ⚠ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                placeholder="Your password"
                style={inputStyle}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link href="/auth/reset-password" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', textDecoration: 'none' }}>
                Forgot password?
              </Link>
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
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#00C853', textDecoration: 'none' }}>Create one free →</Link>
          </div>
        </div>
      </div>
    </div>
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
