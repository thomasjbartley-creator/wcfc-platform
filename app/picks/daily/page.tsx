'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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
  PT:'1f1f5-1f1f9', CD:'1f1e8-1f1e9', UZ:'1f1fa-1f1ff', CN:'1f1e8-1f1f4',
  HR:'1f1ed-1f1f7', GH:'1f1ec-1f1ed', PA:'1f1f5-1f1e6',
}

function FlagImg({ code, size = 44 }: { code: string, size?: number }) {
  const cp = FLAGS[code]
  if (!cp) return <div style={{ width: size, height: size, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5 }}>ð</div>
  return <img src={`${TWEMOJI}/${cp}.png`} width={size} height={size} style={{ borderRadius: 8, objectFit: 'cover', display: 'block' }} alt={code} />
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
  home_score: number | null
  away_score: number | null
}

interface PickState {
  home: number
  away: number
  saved: boolean
  saving: boolean
  locked: boolean
}

function getPtsPreview(home: number, away: number): { label: string; pts: number; color: string } {
  if (home === away) return { label: 'Draw pick', pts: 5, color: '#FF9800' }
  return { label: `${home > away ? 'Home' : 'Away'} win pick`, pts: 3, color: '#00C853' }
}

export default function DailyPicksPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [picks, setPicks] = useState<Record<string, PickState>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      // Load upcoming matches (next 7 days)
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .in('status', ['upcoming', 'live'])
        .order('kickoff_time', { ascending: true })
        .limit(20)

      const matchList = matchData || []
      setMatches(matchList)

      // Load existing picks
      if (matchList.length > 0) {
        const { data: existingPicks } = await supabase
          .from('daily_picks')
          .select('*')
          .eq('user_id', user.id)
          .in('match_id', matchList.map((m: Match) => m.id))

        const pickMap: Record<string, PickState> = {}
        matchList.forEach((m: Match) => {
          const existing = existingPicks?.find(p => p.match_id === m.id)
          const isLocked = new Date(m.kickoff_time) <= new Date() || m.status === 'live'
          pickMap[m.id] = {
            home: existing?.predicted_home ?? 0,
            away: existing?.predicted_away ?? 0,
            saved: !!existing,
            saving: false,
            locked: isLocked,
          }
        })
        setPicks(pickMap)
      }
      setLoading(false)
    }
    load()
  }, [])

  const updateScore = (matchId: string, side: 'home' | 'away', delta: number) => {
    setPicks(prev => {
      const cur = prev[matchId]
      if (!cur || cur.locked) return prev
      const newVal = Math.max(0, (side === 'home' ? cur.home : cur.away) + delta)
      return { ...prev, [matchId]: { ...cur, [side]: newVal, saved: false } }
    })
  }

  const savePick = useCallback(async (matchId: string) => {
    if (!userId) return
    const pick = picks[matchId]
    if (!pick || pick.locked) return

    setPicks(prev => ({ ...prev, [matchId]: { ...prev[matchId], saving: true } }))

    const { error } = await supabase.from('daily_picks').upsert({
      user_id: userId,
      match_id: matchId,
      predicted_home: pick.home,
      predicted_away: pick.away,
    }, { onConflict: 'user_id,match_id' })

    setPicks(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], saving: false, saved: !error }
    }))
  }, [userId, picks])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '3px' }}>LOADING MATCHES...</div>
    </div>
  )

  const now = new Date()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const todayMatches = matches.filter(m => new Date(m.kickoff_time) < todayEnd)
  const upcomingMatches = matches.filter(m => new Date(m.kickoff_time) >= todayEnd)
  const displayMatches = activeTab === 'today' ? todayMatches : upcomingMatches

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: 'white', letterSpacing: '3px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/picks" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', textDecoration: 'none' }}>â Picks</Link>
          <Link href="/picks/bracket" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#FFD600', textDecoration: 'none' }}>ð Bracket</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#00C853', letterSpacing: '3px', marginBottom: '6px' }}>â½ SCORE PREDICTIONS</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem, 6vw, 3rem)', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>DAILY PICKS</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginTop: '6px' }}>
            Predict exact scores Â· Lock at kickoff Â· Exact score = 8pts
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['today', 'upcoming'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 20px',
              background: activeTab === tab ? '#00C853' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeTab === tab ? '#00C853' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px',
              fontFamily: "'Barlow Condensed'",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: activeTab === tab ? '#050C0A' : '#5a8a68',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {tab === 'today' ? `Today (${todayMatches.length})` : `Upcoming (${upcomingMatches.length})`}
            </button>
          ))}
        </div>

        {/* MATCH CARDS */}
        {displayMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Barlow Condensed'", fontSize: '1rem', color: '#5a8a68', letterSpacing: '1px' }}>
            {activeTab === 'today' ? 'No matches today â check the upcoming tab.' : 'No upcoming matches loaded yet.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayMatches.map(match => {
              const pick = picks[match.id] || { home: 0, away: 0, saved: false, saving: false, locked: false }
              const isLocked = pick.locked
              const pts = getPtsPreview(pick.home, pick.away)
              const kickoff = new Date(match.kickoff_time)

              return (
                <div key={match.id} style={{
                  background: '#0a1410',
                  border: `1px solid ${pick.saved ? 'rgba(0,200,83,0.3)' : isLocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}>
                  {/* Card header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '2px', fontWeight: 700 }}>
                      {match.group_name ? `GROUP ${match.group_name}` : match.stage.toUpperCase()} Â· {match.city.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: isLocked ? '#E53935' : '#5a8a68', letterSpacing: '1px' }}>
                      {isLocked ? 'ð LOCKED' : kickoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
                    </div>
                  </div>

                  {/* Teams + inputs */}
                  <div style={{ padding: '20px 16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>

                      {/* Home team */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <FlagImg code={match.home_flag} size={44} />
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: 'white', letterSpacing: '1px', textAlign: 'center' }}>{match.home_team}</div>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : 'rgba(0,200,83,0.3)'}`, borderRadius: '8px', overflow: 'hidden' }}>
                          <button onClick={() => updateScore(match.id, 'home', -1)} disabled={isLocked} style={{ width: 36, height: 44, background: 'none', border: 'none', color: isLocked ? '#3a5a42' : '#5a8a68', fontSize: '1.2rem', cursor: isLocked ? 'default' : 'pointer', fontWeight: 700 }}>â</button>
                          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: isLocked ? '#5a8a68' : 'white', width: 40, textAlign: 'center', lineHeight: '44px' }}>{pick.home}</div>
                          <button onClick={() => updateScore(match.id, 'home', 1)} disabled={isLocked} style={{ width: 36, height: 44, background: 'none', border: 'none', color: isLocked ? '#3a5a42' : '#5a8a68', fontSize: '1.2rem', cursor: isLocked ? 'default' : 'pointer', fontWeight: 700 }}>+</button>
                        </div>
                      </div>

                      {/* VS center */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>VS</div>
                      </div>

                      {/* Away team */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <FlagImg code={match.away_flag} size={44} />
                        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: 'white', letterSpacing: '1px', textAlign: 'center' }}>{match.away_team}</div>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : 'rgba(229,57,53,0.3)'}`, borderRadius: '8px', overflow: 'hidden' }}>
                          <button onClick={() => updateScore(match.id, 'away', -1)} disabled={isLocked} style={{ width: 36, height: 44, background: 'none', border: 'none', color: isLocked ? '#3a5a42' : '#5a8a68', fontSize: '1.2rem', cursor: isLocked ? 'default' : 'pointer', fontWeight: 700 }}>â</button>
                          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: isLocked ? '#5a8a68' : 'white', width: 40, textAlign: 'center', lineHeight: '44px' }}>{pick.away}</div>
                          <button onClick={() => updateScore(match.id, 'away', 1)} disabled={isLocked} style={{ width: 36, height: 44, background: 'none', border: 'none', color: isLocked ? '#3a5a42' : '#5a8a68', fontSize: '1.2rem', cursor: isLocked ? 'default' : 'pointer', fontWeight: 700 }}>+</button>
                        </div>
                      </div>

                    </div>

                    {/* Submit row */}
                    {!isLocked && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ background: `${pts.color}18`, border: `1px solid ${pts.color}35`, borderRadius: '8px', padding: '6px 12px' }}>
                          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: pts.color, fontWeight: 700 }}>
                            {pts.label} Â· up to {pts.pts}pts if correct
                          </span>
                        </div>
                        <button onClick={() => savePick(match.id)} disabled={pick.saving} style={{
                          padding: '10px 20px',
                          background: pick.saved ? 'rgba(0,200,83,0.15)' : '#00C853',
                          border: `1px solid ${pick.saved ? 'rgba(0,200,83,0.3)' : '#00C853'}`,
                          borderRadius: '6px',
                          fontFamily: "'Bebas Neue'",
                          fontSize: '0.9rem',
                          letterSpacing: '2px',
                          color: pick.saved ? '#00C853' : '#050C0A',
                          cursor: pick.saving ? 'wait' : 'pointer',
                          transition: 'all 0.2s',
                        }}>
                          {pick.saving ? 'SAVING...' : pick.saved ? 'â SAVED' : 'SUBMIT PICK'}
                        </button>
                      </div>
                    )}

                    {isLocked && pick.saved && (
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#00C853' }}>
                        {`✓ Pick locked in: ${match.home_team} ${pick.home}–${pick.away} ${match.away_team}`}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
