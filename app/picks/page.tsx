'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Profile {
  username: string
  tier: string
  points_total: number
}

interface Match {
  id: string
  match_number: number
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  kickoff_time: string
  stage: string
  group_name: string | null
  stadium: string
  city: string
  status: string
}

const TWEMOJI = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72'
const FLAGS: Record<string, string> = {
  MX:'1f1f2-1f1fd', ZA:'1f1ff-1f1e6', KR:'1f1f0-1f1f7', CZ:'1f1e8-1f1ff',
  CA:'1f1e8-1f1e6', BA:'1f1e7-1f1e6', QA:'1f1f6-1f1e6', CH:'1f1e8-1f1ed',
  BR:'1f1e7-1f1f7', MA:'1f1f2-1f1e6', HT:'1f1ed-1f1f9', GB:'1f1ec-1f1e7',
  US:'1f1fa-1f1f8', PY:'1f1f5-1f1fe', AU:'1f1e6-1f1fa', TR:'1f1f9-1f1f7',
  DE:'1f1e9-1f1ea', CW:'1f1e8-1f1fc', CI:'1f1e8-1f1ee', EC:'1f1ea-1f1e8',
  NL:'1f1f3-1f1f1', JP:'1f1ef-1f1f5', SE:'1f1f8-1f1ea', TN:'1f1f9-1f1f3',
  BE:'1f1e7-1f1ea', EG:'1f1ea-1f1ec', IR:'1f1ee-1f1f7', NZ:'1f1f3-1f1ff',
  ES:'1f1ea-1f1f8', CV:'1f1e8-1f1fb', SA:'1f1f8-1f1e6', UY:'1f1fa-1f1fe',
  FR:'1f1eb-1f1f7', SN:'1f1f8-1f1f3', IQ:'1f1ee-1f1f6', NO:'1f1f3-1f1f4',
  AR:'1f1e6-1f1f7', DZ:'1f1e9-1f1ff', AT:'1f1e6-1f1f9', JO:'1f1ef-1f1f4',
  PT:'1f1f5-1f1f9', CD:'1f1e8-1f1e9', UZ:'1f1fa-1f1ff', CO:'1f1e8-1f1f4',
  HR:'1f1ed-1f1f7', GH:'1f1ec-1f1ed', PA:'1f1f5-1f1e6',
}

function FlagImg({ code, size = 24 }: { code: string, size?: number }) {
  const cp = FLAGS[code]
  if (!cp) return <span style={{ fontSize: size * 0.7, fontFamily: "'Barlow Condensed'", color: '#5a8a68' }}>—</span>
  return <img src={`${TWEMOJI}/${cp}.png`} width={size} height={size} style={{ borderRadius: 4, objectFit: 'cover', display: 'block' }} alt={code} />
}

export default function PicksPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [todayMatches, setTodayMatches] = useState<Match[]>([])
  const [bracketProgress, setBracketProgress] = useState(0)
  const [dailyProgress, setDailyProgress] = useState({ picked: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      // Profile
      const { data: prof } = await supabase.from('profiles').select('username,tier,points_total').eq('id', user.id).single()
      if (prof) setProfile(prof)

      // Today's matches (next 24 hours of upcoming matches)
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 86400000)
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'upcoming')
        .gte('kickoff_time', now.toISOString())
        .lte('kickoff_time', tomorrow.toISOString())
        .order('kickoff_time', { ascending: true })
      setTodayMatches(matches || [])

      // Bracket progress
      const { count: bracketCount } = await supabase
        .from('bracket_picks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setBracketProgress(bracketCount || 0)

      // Daily picks progress for upcoming matches today
      if (matches && matches.length > 0) {
        const matchIds = matches.map((m: Match) => m.id)
        const { count: pickedCount } = await supabase
          .from('daily_picks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .in('match_id', matchIds)
        setDailyProgress({ picked: pickedCount || 0, total: matches.length })
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '3px' }}>LOADING PICKS...</div>
    </div>
  )

  const isPaid = profile && ['champion', 'founder', 'premium', 'plus'].includes(profile.tier)

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: 'white', letterSpacing: '3px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>← Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#00C853', letterSpacing: '3px', marginBottom: '6px' }}>WORLD CUP 2026</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>YOUR PICKS</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginTop: '8px' }}>
            Submit your bracket before June 11. Make daily score picks before each match.
          </div>
        </div>

        {/* NOT PAID WARNING */}
        {!isPaid && (
          <div style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#ff6b6b', letterSpacing: '1px', marginBottom: '4px' }}>Free Fans Can't Win Cash Prizes</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68' }}>Upgrade before June 11 to compete for $500 grand prize and weekly cash.</div>
            </div>
            <a href="/checkout" style={{ padding: '12px 24px', background: '#FFD600', color: '#050C0A', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Champion Founder — $10
            </a>
          </div>
        )}

        {/* TWO MAIN CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>

          {/* BRACKET CARD */}
          <Link href="/picks/bracket" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px', padding: '28px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,214,0,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,214,0,0.2)')}>
              <div style={{ fontSize: '1rem', fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: '3px', color: '#FFD600', marginBottom: '12px' }}>BRACKET</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>BRACKET PICKS</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.6', marginBottom: '20px' }}>
                Predict winners for all 72 group matches + full knockout bracket. Lock in before June 11 kickoff.
              </div>
              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', letterSpacing: '1px' }}>PROGRESS</span>
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#FFD600' }}>{bracketProgress} / 105 PICKS</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (bracketProgress / 105) * 100)}%`, background: '#FFD600', borderRadius: '2px', transition: 'width 0.4s' }} />
                </div>
              </div>
              <div style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(255,214,0,0.15)', border: '1px solid rgba(255,214,0,0.3)', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#FFD600', letterSpacing: '2px' }}>
                {bracketProgress === 0 ? 'START BRACKET →' : bracketProgress >= 105 ? '✓ BRACKET COMPLETE' : 'CONTINUE BRACKET →'}
              </div>
            </div>
          </Link>

          {/* DAILY PICKS CARD */}
          <Link href="/picks/daily" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#0a1410', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '28px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,200,83,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,200,83,0.2)')}>
              <div style={{ fontSize: '1rem', fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: '3px', color: '#00C853', marginBottom: '12px' }}>DAILY</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#00C853', letterSpacing: '2px', marginBottom: '8px' }}>DAILY PICKS</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.6', marginBottom: '20px' }}>
                Predict exact scores for today's matches. Lock in before kickoff. Up to 25 pts per exact score.
              </div>
              {/* Today's matches */}
              {todayMatches.length > 0 ? (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px', marginBottom: '8px' }}>TODAY'S MATCHES</div>
                  {todayMatches.slice(0, 3).map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <FlagImg code={m.home_flag} size={18} />
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: 'white' }}>{m.home_team}</span>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68' }}>vs</span>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: 'white' }}>{m.away_team}</span>
                      <FlagImg code={m.away_flag} size={18} />
                    </div>
                  ))}
                  {dailyProgress.total > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '1px' }}>PICKED TODAY</span>
                      <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#00C853' }}>{dailyProgress.picked}/{dailyProgress.total}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  No matches in the next 24 hours. Check back before each matchday.
                </div>
              )}
              <div style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#00C853', letterSpacing: '2px' }}>
                {todayMatches.length > 0 ? 'MAKE PICKS →' : 'VIEW SCHEDULE →'}
              </div>
            </div>
          </Link>

        </div>

        {/* POINTS LEGEND */}
        <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '3px', marginBottom: '14px' }}>HOW POINTS WORK</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { pts: '25', label: 'Exact Score', color: '#FFD600' },
              { pts: '12', label: 'Correct Draw', color: '#FF9800' },
              { pts: '10', label: 'Correct Winner', color: '#00C853' },
              { pts: '+5', label: 'Goal Margin', color: '#4FC3F7' },
              { pts: '+5', label: 'Underdog Pick', color: '#CE93D8' },
              { pts: '+20', label: 'Perfect Matchday', color: '#E53935' },
              { pts: '+3/+2', label: 'Group W/RU', color: '#FF9800' },
              { pts: '50', label: 'Champion Pick', color: '#FFD600' },
            ].map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: p.color, minWidth: '36px', textAlign: 'center' }}>{p.pts}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', letterSpacing: '0.5px' }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
