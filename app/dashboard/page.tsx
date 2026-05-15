'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const TIER_COLORS: Record<string, string> = {
  champion: '#FFD600',
  founder:  '#FF9800',
  premium:  '#00C853',
  plus:     '#4FC3F7',
  free:     '#5a8a68',
}
const TIER_LABELS: Record<string, string> = {
  champion: '👑 Champion Founder',
  founder:  '🏅 Founder Fan',
  premium:  '💎 Premium',
  plus:     '⚡ Plus',
  free:     '🆓 Free Fan',
}

interface Profile {
  id: string
  username: string | null
  tier: string | null
  points_total: number
  streak_current: number | null
  country_supported: string | null
  referral_code: string | null
  referral_count: number
  referral_points_earned: number
  founding_wall_name: string | null
}

interface Match {
  match_number: number
  home_team: string
  away_team: string
  home_flag: string | null
  away_flag: string | null
  kickoff_time: string
  stage: string
  group_name: string | null
  stadium: string
  city: string
}

function shareBtn(color: string): React.CSSProperties {
  return {
    flex: 1,
    padding: '8px',
    background: `${color}18`,
    border: `1px solid ${color}40`,
    borderRadius: '6px',
    color,
    fontFamily: "'Barlow Condensed'",
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '1px',
    cursor: 'pointer',
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [countdown, setCountdown] = useState('')
  const [loading, setLoading] = useState(true)
  const [copyDone, setCopyDone] = useState(false)
  const [shareCopied, setShareCopied] = useState('')

  const referralLink = profile?.referral_code
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://worldcupfanchallenge.com'}/auth/signup?ref=${profile.referral_code}`
    : ''

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserEmail(user.email ?? '')

      const [{ data: prof }, { data: matches }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, tier, points_total, streak_current, country_supported, referral_code, referral_count, referral_points_earned, founding_wall_name')
          .eq('id', user.id)
          .single(),
        supabase
          .from('matches')
          .select('*')
          .gte('kickoff_time', new Date().toISOString())
          .order('kickoff_time', { ascending: true })
          .limit(1),
      ])

      if (prof) setProfile(prof)
      if (matches && matches.length > 0) setNextMatch(matches[0])
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!nextMatch) return
    const tick = () => {
      const diff = new Date(nextMatch.kickoff_time).getTime() - Date.now()
      if (diff <= 0) { setCountdown('LIVE NOW'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${d}d ${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextMatch])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const copyReferral = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  const shareReferral = (platform: string) => {
    const country = profile?.country_supported || 'my country'
    const msg = `I just joined the World Cup Fan Challenge representing ${country}! Predict scores, win cash prizes, and help fund youth futbol. Join me\n${referralLink}`
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank')
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    if (platform === 'instagram') {
      navigator.clipboard.writeText(referralLink)
      setShareCopied('instagram')
      setTimeout(() => setShareCopied(''), 3500)
      window.open('https://www.instagram.com/', '_blank')
    }
    if (platform === 'tiktok') {
      navigator.clipboard.writeText(referralLink)
      setShareCopied('tiktok')
      setTimeout(() => setShareCopied(''), 3500)
      window.open('https://www.tiktok.com/', '_blank')
    }
    if (platform === 'native' && navigator.share) navigator.share({ title: 'World Cup Fan Challenge', text: msg, url: referralLink })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '3px' }}>LOADING...</div>
    </div>
  )

  const tier = profile?.tier || 'free'
  const tierColor = TIER_COLORS[tier] ?? '#5a8a68'
  const tierLabel = TIER_LABELS[tier] ?? tier.toUpperCase()
  const isPaid = ['champion', 'founder', 'premium', 'plus'].includes(tier)
  const referralCount = profile?.referral_count ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: 'white', letterSpacing: '3px', textDecoration: 'none' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: tierColor, fontWeight: 700, letterSpacing: '1px' }}>{tierLabel}</span>
          <button onClick={handleSignOut} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', padding: '7px 14px', fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', cursor: 'pointer', letterSpacing: '1px' }}>
            SIGN OUT
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>
            HEY, {(profile?.username || 'FAN').toUpperCase()}!
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginTop: '4px' }}>
            {userEmail}{profile?.country_supported ? ` · Supporting ${profile.country_supported}` : ''}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Points', value: profile?.points_total?.toLocaleString() || '0', color: '#FFD600' },
            { label: 'Global Rank', value: '—', color: '#00C853', note: 'Opens June 11' },
            { label: 'Day Streak', value: String(profile?.streak_current || 0), color: '#FF9800' },
            { label: 'Referrals', value: String(referralCount), color: '#4FC3F7' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              {s.note && <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '2px' }}>{s.note}</div>}
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {nextMatch && (
          <div style={{ background: 'linear-gradient(135deg, rgba(0,200,83,0.08), rgba(255,214,0,0.04))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Next Match — {nextMatch.group_name ? `Group ${nextMatch.group_name}` : nextMatch.stage.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px' }}>
                {nextMatch.home_flag ?? ''} {nextMatch.home_team} <span style={{ color: '#5a8a68' }}>vs</span> {nextMatch.away_team} {nextMatch.away_flag ?? ''}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', marginTop: '2px' }}>
                {nextMatch.stadium} · {nextMatch.city} · {new Date(nextMatch.kickoff_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#FFD600', letterSpacing: '2px' }}>{countdown}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#5a8a68', letterSpacing: '2px' }}>UNTIL KICKOFF</div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ background: '#0a1410', border: `1px solid ${isPaid ? 'rgba(0,200,83,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚽</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>
                {isPaid ? 'Make Your Picks' : 'Enter the Challenge'}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '16px', lineHeight: '1.5' }}>
                {isPaid
                  ? 'Predict every match. Submit your bracket before June 11.'
                  : 'Become a Champion Founder for $10 — lock in your picks and compete for $500 in cash prizes.'}
              </div>
              {isPaid ? (
                <Link href="/picks" style={{ display: 'block', padding: '12px', background: '#00C853', color: '#050C0A', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', textDecoration: 'none' }}>
                  GO TO PICKS →
                </Link>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="https://buy.stripe.com/5kQdR1bxS7iL0Nr1i9dfG03" style={{ display: 'block', padding: '13px', background: '#FFD600', color: '#050C0A', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', textDecoration: 'none' }}>
                    👑 CHAMPION FOUNDER — $10
                  </a>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px', textAlign: 'center', padding: '2px 0' }}>
                    or choose a smaller entry:
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="https://buy.stripe.com/eVq3cnfO8cD5fIl2mddfG01" style={{ flex: 1, display: 'block', padding: '9px', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.3)', color: '#00C853', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.85rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                      💎 PREMIUM — $5
                    </a>
                    <a href="https://buy.stripe.com/bJe3cndG01Yr0NraSJdfG0b" style={{ flex: 1, display: 'block', padding: '9px', background: 'rgba(79,195,247,0.08)', border: '1px solid rgba(79,195,247,0.25)', color: '#4FC3F7', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.85rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                      ⚡ PLUS — $3
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '3px', marginBottom: '12px' }}>YOUR MEMBERSHIP</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: tierColor, letterSpacing: '1px', marginBottom: '14px' }}>{tierLabel}</div>
              {tier === 'free' && (
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', lineHeight: '1.6', marginBottom: '14px' }}>
                    You're in — but free fans aren't eligible for cash prizes. Upgrade before June 11 to compete for $500.
                  </div>
                  <a href="https://buy.stripe.com/5kQdR1bxS7iL0Nr1i9dfG03" style={{ display: 'block', padding: '12px', background: '#FFD600', color: '#050C0A', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                    👑 CHAMPION FOUNDER — $10
                  </a>
                </div>
              )}
              {tier === 'plus' && (
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', lineHeight: '1.6' }}>
                  You're competing for weekly prizes. Upgrade to Premium for the $500 grand prize.
                  <a href="https://buy.stripe.com/eVq3cnfO8cD5fIl2mddfG01" style={{ display: 'block', marginTop: '10px', padding: '10px', background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.3)', color: '#00C853', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                    UPGRADE TO PREMIUM →
                  </a>
                </div>
              )}
              {['premium', 'founder', 'champion'].includes(tier) && (
                <ul style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.8', paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                  <li><span style={{ color: '#00C853' }}>✓</span> $500 Grand Prize eligible</li>
                  <li><span style={{ color: '#00C853' }}>✓</span> Weekly cash prizes</li>
                  {tier === 'champion' && <li><span style={{ color: '#FFD600' }}>✓</span> Founding Wall — permanent</li>}
                  {tier === 'champion' && <li><span style={{ color: '#FFD600' }}>✓</span> $3/entry forever locked</li>}
                </ul>
              )}
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ background: '#0a1410', border: '1px solid rgba(0,200,83,0.15)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>🎯 REFER FRIENDS — EARN POINTS</div>
              <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '14px', lineHeight: '1.5' }}>
                Share your link. When a friend joins the paid challenge you earn <strong style={{ color: '#00C853' }}>+5 bonus points</strong>.
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  readOnly
                  value={referralLink}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '9px 12px', fontFamily: "'Barlow'", fontSize: '0.75rem', color: '#5a8a68', outline: 'none' }}
                />
                <button onClick={copyReferral} style={{ padding: '9px 16px', background: copyDone ? '#00C853' : 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '6px', color: copyDone ? '#050C0A' : '#00C853', fontFamily: "'Bebas Neue'", fontSize: '0.85rem', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {copyDone ? '✓ COPIED' : 'COPY'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <button onClick={() => shareReferral('instagram')} style={shareBtn('#E1306C')}>Instagram</button>
                <button onClick={() => shareReferral('tiktok')} style={shareBtn('#69C9D0')}>TikTok</button>
                <button onClick={() => shareReferral('whatsapp')} style={shareBtn('#25d366')}>WhatsApp</button>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <button onClick={() => shareReferral('twitter')} style={shareBtn('#1da1f2')}>X</button>
                <button onClick={() => shareReferral('native')} style={{ ...shareBtn('#FFD600'), flex: 2 }}>Share</button>
              </div>
              {shareCopied && (
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: shareCopied === 'instagram' ? '#E1306C' : '#69C9D0', letterSpacing: '0.5px', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '6px' }}>
                  Link copied! Open {shareCopied === 'instagram' ? 'Instagram' : 'TikTok'} and paste it in your story or bio.
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#4FC3F7', lineHeight: 1 }}>{referralCount}</div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68', letterSpacing: '1px' }}>FRIENDS JOINED</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#00C853', lineHeight: 1 }}>+{profile?.referral_points_earned ?? referralCount * 5}</div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68', letterSpacing: '1px' }}>BONUS POINTS</div>
                </div>
              </div>
              <Link href="/share" style={{ display: 'block', padding: '11px', background: 'linear-gradient(135deg, rgba(105,201,208,0.12), rgba(225,48,108,0.12))', border: '1px solid rgba(105,201,208,0.3)', borderRadius: '8px', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center', color: '#69C9D0' }}>
                🎬 CREATE TIKTOK CARD
              </Link>
            </div>

            <div style={{ background: 'rgba(0,200,83,0.04)', border: '1px solid rgba(0,200,83,0.12)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>🌱 GRASSROOTS FUTBOL FUND</div>
              <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.6', marginBottom: '14px' }}>
                Every fan who joins helps fund youth futbol programs around the world. Your participation matters beyond the leaderboard.
              </div>
              <a href="https://buy.stripe.com/3cI7sDfO8dH9fIlgd3dfG0c" style={{ display: 'block', padding: '11px', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)', color: '#00C853', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', textDecoration: 'none', textAlign: 'center' }}>
                🌱 DONATE TO YOUTH FUTBOL →
              </a>
            </div>

          </div>
        </div>

        <div style={{ marginTop: '24px', background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '3px', marginBottom: '14px' }}>📅 COMING UP — GROUP STAGE</div>
          <UpcomingMatchesStrip supabase={supabase} />
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px' }}>
          <a href="/" style={{ color: '#3a5a42', textDecoration: 'none' }}>worldcupfanchallenge.com</a>
          {' · '}
          <span>No purchase necessary to win</span>
          {' · '}
          <span>Skill-based competition</span>
        </div>

      </div>
    </div>
  )
}

function UpcomingMatchesStrip({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    supabase
      .from('matches')
      .select('*')
      .eq('stage', 'group')
      .gte('kickoff_time', new Date().toISOString())
      .order('kickoff_time', { ascending: true })
      .limit(6)
      .then(({ data }) => { if (data) setMatches(data) })
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
      {matches.map(m => (
        <div key={m.match_number} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#00C853', letterSpacing: '2px', marginBottom: '4px' }}>
            GROUP {m.group_name} · {m.city}
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: 'white', letterSpacing: '1px' }}>
            {m.home_flag ?? ''} {m.home_team} <span style={{ color: '#5a8a68' }}>vs</span> {m.away_team} {m.away_flag ?? ''}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', marginTop: '3px' }}>
            {new Date(m.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
          </div>
        </div>
      ))}
    </div>
  )
}
