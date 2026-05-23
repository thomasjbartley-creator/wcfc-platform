'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import GoogleTranslate from '@/components/GoogleTranslate'

function generateReferralCode(username: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const base = username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5)
  return base + suffix
}
const COUNTRIES = [
  // AFC (8)
  { code: 'AU', name: 'Australia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'UZ', name: 'Uzbekistan' },
  // CAF (9)
  { code: 'DZ', name: 'Algeria' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'CD', name: 'Congo DR' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GH', name: 'Ghana' },
  { code: 'MA', name: 'Morocco' },
  { code: 'SN', name: 'Senegal' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'TN', name: 'Tunisia' },
  // CONCACAF (6 inc. hosts)
  { code: 'CA', name: 'Canada' },
  { code: 'CW', name: 'Curaçao' },
  { code: 'HT', name: 'Haiti' },
  { code: 'MX', name: 'Mexico' },
  { code: 'PA', name: 'Panama' },
  { code: 'US', name: 'United States' },
  // CONMEBOL (6)
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
  // OFC (1)
  { code: 'NZ', name: 'New Zealand' },
  // UEFA (16)
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BA', name: 'Bosnia & Herzegovina' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'GB', name: 'England' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NO', name: 'Norway' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SCO', name: 'Scotland' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TR', name: 'Turkiye' },
  { code: 'OTHER', name: 'Other Country' },
]
export default function SignupPage() { return <Suspense fallback={null}><SignupPageContent /></Suspense> }

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [referredBy, setReferredBy] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    country: '',
    dateOfBirth: '',
    isJunior: false,
  })

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setReferredBy(ref)
  }, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isUnder18 = (dob: string) => {
    if (!dob) return false
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    return age < 18 || (age === 18 && m < 0)
  }
  const validateUsername = (username: string) => {
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (username.length > 25) return 'Username must be 25 characters or less'
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
    const blocked = ['admin','wcfc','champion','founder','moderator','staff','support','official']
    if (blocked.some(w => username.toLowerCase().includes(w))) return 'This username is reserved'
    return null
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }
    const usernameError = validateUsername(form.username)
    if (usernameError) {
      setError(usernameError)
      setLoading(false)
      return
    }
    if (!form.country) {
      setError('Please select a country to support')
      setLoading(false)
      return
    }
    if (!form.dateOfBirth) {
      setError('Please enter your date of birth')
      setLoading(false)
      return
    }
    const junior = isUnder18(form.dateOfBirth)
    const referralCode = generateReferralCode(form.username)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            country_supported: form.country,
            date_of_birth: form.dateOfBirth,
            is_junior: junior,
          }
        }
      })
      if (authError) throw authError
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: form.email,
            username: form.username,
            country_supported: form.country,
            date_of_birth: form.dateOfBirth,
            is_junior: junior,
            referral_code: referralCode,
            referred_by: referredBy ?? null,
          })
        if (profileError) throw profileError
        router.push('/dashboard?welcome=true')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
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
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '4px' }}>
                WCFC<span style={{ color: '#00C853' }}>.</span>
              </div>
            </a>
            <GoogleTranslate />
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
            Join the global fan challenge — free to play, win cash & prizes
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
              🎉 You were invited by a friend! Sign up to join the challenge together.
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
              <label style={labelStyle}>Username <span style={{ color: '#5a8a68' }}>(shown on leaderboard)</span></label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="SoccerFan99"
                maxLength={25}
                style={inputStyle}
              />
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', marginTop: '4px' }}>
                3–25 characters · Letters, numbers, underscores only · Usernames are reviewed — violations may result in suspension
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Country You're Supporting 🌍</label>
              <select
                required
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="" style={{ color: '#111', background: 'white' }}>Select your country...</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} style={{ color: '#111', background: 'white' }}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date of Birth <span style={{ color: '#5a8a68' }}>(required for prize eligibility)</span></label>
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                style={inputStyle}
              />
              {form.dateOfBirth && isUnder18(form.dateOfBirth) && (
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#FFD600', marginTop: '4px', padding: '8px', background: 'rgba(255,214,0,0.06)', borderRadius: '6px', border: '1px solid rgba(255,214,0,0.2)' }}>
                  👦 Junior Fan Account — Under 18. Cash prizes not available. Merch, trophies & activity books only. Parent/guardian will need to verify this account.
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5a8a68', fontFamily: "'Barlow Condensed'", lineHeight: '1.5', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              By creating an account you agree that no purchase is necessary to enter or win. This is a skill-based competition. You must be 18+ to win cash prizes.
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
          ✓ No purchase necessary to win &nbsp;·&nbsp; ✓ Skill-based competition &nbsp;·&nbsp; ✓ Secure & private
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
