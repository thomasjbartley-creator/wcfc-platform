'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Profile {
  username: string | null
  referral_code: string | null
  referral_count: number
  referral_points_earned: number
  points_total: number
  country_supported: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [friendEmails, setFriendEmails] = useState(['', '', '', '', ''])
  const [emailsSent, setEmailsSent] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login')
        return
      }
      setUserEmail(data.user.email ?? '')
      const { data: prof } = await supabase
        .from('profiles')
        .select('username, referral_code, referral_count, referral_points_earned, points_total, country_supported')
        .eq('id', data.user.id)
        .single()
      setProfile(prof)
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const referralLink = profile?.referral_code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/signup?ref=${profile.referral_code}`
    : ''

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEmailInvites = () => {
    const validEmails = friendEmails.filter(e => e.trim() && e.includes('@'))
    if (validEmails.length === 0) return
    const subject = encodeURIComponent('Join me in the World Cup Fan Challenge!')
    const body = encodeURIComponent(
      `Hey!\n\nI just signed up for the World Cup Fan Challenge — a free skill-based competition where fans predict match results and compete for cash & prizes.\n\nJoin me using my link:\n${referralLink}\n\nSee you on the leaderboard! ⚽`
    )
    window.open(`mailto:${validEmails.join(',')}?subject=${subject}&body=${body}`)
    setEmailsSent(true)
    setTimeout(() => setEmailsSent(false), 3000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: '#00C853', letterSpacing: '4px' }}>LOADING...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68' }}>
            {profile?.points_total ?? 0} pts
          </div>
          <button
            onClick={handleSignOut}
            style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', letterSpacing: '1px' }}
          >
            SIGN OUT
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Welcome banner */}
        {isWelcome && (
          <div style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.25)', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: '#00C853', letterSpacing: '2px', marginBottom: '4px' }}>
              🏆 Welcome to WCFC!
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.95rem', color: '#8ab898' }}>
              Your account is set up. The World Cup Fan Challenge launches soon — invite friends below and earn bonus points when they join the paid challenge.
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px' }}>
            {profile?.username ? `Hey, ${profile.username}!` : 'Your Dashboard'}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginTop: '4px' }}>
            {userEmail}
          </div>
        </div>

        {/* Referral Widget */}
        <div style={{ background: 'linear-gradient(135deg, #0a1f14 0%, #0a1410 100%)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: '#00C853', letterSpacing: '2px', marginBottom: '6px' }}>
                🎯 Invite Friends — Earn Bonus Points
              </div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#8ab898', lineHeight: '1.5', marginBottom: '20px' }}>
                Share your link. When a friend signs up and joins the <strong style={{ color: 'white' }}>$10 Fan Challenge</strong>, you earn <strong style={{ color: '#00C853' }}>+5 bonus points</strong> on the leaderboard.
              </div>

              {/* Referral link box */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontFamily: "'Barlow'",
                  fontSize: '0.8rem',
                  color: '#8ab898',
                  wordBreak: 'break-all',
                  lineHeight: '1.4',
                }}>
                  {referralLink || 'Generating your link...'}
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? 'rgba(0,200,83,0.2)' : '#00C853',
                    color: copied ? '#00C853' : '#050C0A',
                    border: copied ? '1px solid #00C853' : 'none',
                    borderRadius: '6px',
                    padding: '10px 18px',
                    fontFamily: "'Bebas Neue'",
                    fontSize: '0.95rem',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>

              {/* Share buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Share on X', url: `https://twitter.com/intent/tweet?text=I'm playing the World Cup Fan Challenge — join me!&url=${encodeURIComponent(referralLink)}` },
                  { label: 'Share on WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(`Join me in the World Cup Fan Challenge! ${referralLink}`)}` },
                  { label: 'Share on Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}` },
                ].map(btn => (
                  <a
                    key={btn.label}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'Barlow Condensed'",
                      fontSize: '0.75rem',
                      color: '#5a8a68',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      textDecoration: 'none',
                      letterSpacing: '0.5px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Referral stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '130px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#00C853', letterSpacing: '2px' }}>
                  {profile?.referral_count ?? 0}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Friends Joined
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#00C853', letterSpacing: '2px' }}>
                  +{profile?.referral_points_earned ?? 0}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Bonus Points
                </div>
              </div>
            </div>
          </div>

          {/* Email invite section */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: 'white', letterSpacing: '2px', marginBottom: '4px' }}>
              ✉️ Invite Friends Directly
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', marginBottom: '14px' }}>
              Enter up to 5 email addresses — we'll open your email app with a ready-to-send invite.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {friendEmails.map((email, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', width: '18px', textAlign: 'right', flexShrink: 0 }}>
                    {i + 1}.
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      const updated = [...friendEmails]
                      updated[i] = e.target.value
                      setFriendEmails(updated)
                    }}
                    placeholder={`friend${i + 1}@example.com`}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '9px 12px',
                      fontFamily: "'Barlow'",
                      fontSize: '0.85rem',
                      color: 'white',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleEmailInvites}
              style={{
                background: emailsSent ? 'rgba(0,200,83,0.15)' : 'rgba(0,200,83,0.1)',
                color: emailsSent ? '#00C853' : '#8ab898',
                border: '1px solid rgba(0,200,83,0.3)',
                borderRadius: '6px',
                padding: '10px 20px',
                fontFamily: "'Bebas Neue'",
                fontSize: '0.95rem',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {emailsSent ? '✓ EMAIL APP OPENED' : 'SEND INVITES →'}
            </button>
          </div>

          {/* Your code */}
          {profile?.referral_code && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68' }}>
              Your referral code: <span style={{ color: '#00C853', fontWeight: 700, letterSpacing: '2px' }}>{profile.referral_code}</span>
            </div>
          )}
        </div>

        {/* Coming soon cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Make Your Picks', desc: 'Predict match winners, top scorers, and tournament outcomes.', icon: '⚽', soon: true },
            { title: 'Leaderboard', desc: 'See how you rank against fans from every country.', icon: '🏆', soon: true },
            { title: 'Your Points', desc: 'Track your score and streak as the tournament progresses.', icon: '📊', soon: true },
          ].map(card => (
            <div key={card.title} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{card.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', fontWeight: 700, color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>
                {card.title}
              </div>
              <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.5', marginBottom: '16px' }}>
                {card.desc}
              </div>
              <div style={{ display: 'inline-block', fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#00C853', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '4px', padding: '3px 8px', letterSpacing: '1px' }}>
                COMING SOON
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
