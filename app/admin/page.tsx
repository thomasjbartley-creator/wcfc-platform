'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { computeAllGroupStandings, type GroupMatch, type GroupStandings } from '@/lib/standings'
import { getQualifiers, buildR32, type R32Matchup, type Qualifiers, type ThirdPlaceTeam } from '@/lib/advancement'

const OWNER_EMAIL = 'thomas@bartleytechaisolutions.com'

interface Match {
  id: string
  match_number: number
  group_name: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  status: string
}

type Tab = 'results' | 'standings' | 'bracket'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [editScores, setEditScores] = useState<Record<string, { home: string; away: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [standings, setStandings] = useState<GroupStandings[]>([])
  const [r32Matchups, setR32Matchups] = useState<R32Matchup[]>([])
  const [qualifiers, setQualifiers] = useState<Qualifiers | null>(null)
  const [thirdOverrides, setThirdOverrides] = useState<Record<number, string>>({})
  const [activeTab, setActiveTab] = useState<Tab>('results')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u || u.email?.toLowerCase() !== OWNER_EMAIL) {
        router.replace('/')
        return
      }
      setUser(u)
      setAuthorized(true)
      setLoading(false)
    })
  }, [router])

  useEffect(() => {
    if (!authorized || !user) return
    const enc = encodeURIComponent(user.email)
    Promise.all([
      fetch('/api/admin/matches?email=' + enc + '&stage=group').then(r => r.json()),
      fetch('/api/admin/matches?email=' + enc + '&stage=r32').then(r => r.json()),
    ]).then(([groupData, r32Data]) => {
      if (groupData.matches) {
        setMatches(groupData.matches)
        const sc: Record<string, { home: string; away: string }> = {}
        for (const m of groupData.matches) {
          sc[m.id] = {
            home: m.home_score !== null ? String(m.home_score) : '',
            away: m.away_score !== null ? String(m.away_score) : '',
          }
        }
        setEditScores(sc)
        const st = computeAllGroupStandings(groupData.matches as GroupMatch[])
        setStandings(st)
        if (r32Data.matches) {
          const q = getQualifiers(st)
          setQualifiers(q)
          const mu = buildR32(st, r32Data.matches.map((m: any) => ({
            match_number: m.match_number,
            home_slot: m.home_slot || '',
            away_slot: m.away_slot || '',
          })))
          setR32Matchups(mu)
        }
      }
    })
  }, [authorized, user])

  const saveMatch = useCallback(async (matchId: string, markFinished: boolean) => {
    if (!user) return
    const sc = editScores[matchId]
    if (!sc) return
    const hs = sc.home !== '' ? parseInt(sc.home, 10) : null
    const as_ = sc.away !== '' ? parseInt(sc.away, 10) : null
    if (markFinished && (hs === null || as_ === null || isNaN(hs) || isNaN(as_))) {
      alert('Enter both scores before marking as finished.')
      return
    }
    setSaving(prev => ({ ...prev, [matchId]: true }))
    const body: any = { matchId, userEmail: user.email, homeScore: hs, awayScore: as_ }
    if (markFinished) body.status = 'finished'
    const res = await fetch('/api/admin/update-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setMatches(prev => prev.map(m =>
        m.id === matchId ? { ...m, home_score: hs, away_score: as_, status: markFinished ? 'finished' : m.status } : m
      ))
      const updated = matches.map(m =>
        m.id === matchId ? { ...m, home_score: hs, away_score: as_, status: markFinished ? 'finished' : m.status } : m
      )
      const st = computeAllGroupStandings(updated as GroupMatch[])
      setStandings(st)
      const q = getQualifiers(st)
      setQualifiers(q)
      if (r32Matchups.length > 0) {
        setR32Matchups(buildR32(st, r32Matchups.map(m => ({ match_number: m.match_number, home_slot: m.home_slot, away_slot: m.away_slot }))))
      }
    }
    setSaving(prev => ({ ...prev, [matchId]: false }))
  }, [user, editScores, matches, r32Matchups])

  if (loading || !authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a8a68', fontFamily: "'Barlow', sans-serif" }}>
        {loading ? 'Checking access...' : 'Redirecting...'}
      </div>
    )
  }

  const groups = new Map<string, Match[]>()
  for (const m of matches) {
    const arr = groups.get(m.group_name) || []
    arr.push(m)
    groups.set(m.group_name, arr)
  }
  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))

  const inputStyle = { width: '44px', textAlign: 'center' as const, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '5px', color: 'white', fontFamily: "'Bebas Neue'", fontSize: '1rem' }

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ background: 'rgba(229,57,53,0.08)', borderBottom: '1px solid rgba(229,57,53,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#E53935', letterSpacing: '2px' }}>ADMIN</span>
          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', marginLeft: '12px' }}>{user?.email}</span>
        </div>
        <a href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none' }}>Back to site</a>
      </div>
      <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0' }}>
        {(['results', 'standings', 'bracket'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', background: activeTab === tab ? '#E53935' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '6px 6px 0 0', color: activeTab === tab ? 'white' : '#5a8a68', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' as const }}>{tab}</button>
        ))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {activeTab === 'results' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Stage Results</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Enter scores and mark matches as finished. {matches.filter(m => m.status === 'finished').length}/72 finished.</div>
            {sortedGroups.map(([gn, gm]) => (
              <div key={gn} style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>GROUP {gn}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {gm.map(m => {
                    const s = editScores[m.id] || { home: '', away: '' }
                    const fin = m.status === 'finished'
                    const sv = saving[m.id] || false
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: fin ? 'rgba(0,200,83,0.05)' : '#0a1410', border: '1px solid ' + (fin ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.06)'), borderRadius: '8px', flexWrap: 'wrap' as const }}>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px', textAlign: 'right' as const }}>{m.home_team}</span>
                        <input type="number" min="0" value={s.home} onChange={e => setEditScores(p => ({ ...p, [m.id]: { ...p[m.id], home: e.target.value } }))} disabled={fin} style={inputStyle} />
                        <span style={{ color: '#3a5a42', fontSize: '0.75rem' }}>-</span>
                        <input type="number" min="0" value={s.away} onChange={e => setEditScores(p => ({ ...p, [m.id]: { ...p[m.id], away: e.target.value } }))} disabled={fin} style={inputStyle} />
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px' }}>{m.away_team}</span>
                        {fin ? (
                          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '1px' }}>FINISHED</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                            <button onClick={() => saveMatch(m.id, false)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#8ab898', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '1px' }}>{sv ? '...' : 'SAVE'}</button>
                            <button onClick={() => saveMatch(m.id, true)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '4px', color: '#00C853', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '1px' }}>{sv ? '...' : 'MARK FINAL'}</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'standings' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Standings</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Computed from finished matches. Rankings follow FIFA tiebreaker rules.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {standings.map(g => (
                <div key={g.group} style={{ background: '#0a1410', border: '1px solid ' + (g.hasTiebreak ? 'rgba(255,214,0,0.3)' : 'rgba(255,255,255,0.07)'), borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', letterSpacing: '2px' }}>GROUP {g.group}</span>
                    {g.hasTiebreak && <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: '#FFD600', background: 'rgba(255,214,0,0.15)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '1px' }}>TIEBREAK NEEDED</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr repeat(8, 32px)', gap: '2px', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map(h => (
                      <div key={h} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.6rem', color: '#3a5a42', letterSpacing: '1px', textAlign: h === 'Team' ? 'left' as const : 'center' as const }}>{h}</div>
                    ))}
                  </div>
                  {g.teams.map((t, idx) => (
                    <div key={t.team} style={{ display: 'grid', gridTemplateColumns: '24px 1fr repeat(8, 32px)', gap: '2px', padding: '5px 10px', borderBottom: idx < g.teams.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', background: idx < 2 ? 'rgba(0,200,83,0.03)' : 'transparent' }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: t.tiebreakNeeded ? '#FFD600' : (idx < 2 ? '#00C853' : '#5a8a68'), textAlign: 'center' }}>{t.tiebreakNeeded ? '?' : t.rank}</div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: 'white', fontWeight: 700 }}>{t.team}</div>
                      {[t.played, t.won, t.drawn, t.lost, t.goalsFor, t.goalsAgainst, t.goalDifference, t.points].map((v, vi) => (
                        <div key={vi} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: vi === 7 ? '#FFD600' : '#8ab898', textAlign: 'center', fontWeight: vi === 7 ? 700 : 400 }}>{v > 0 && vi === 6 ? '+' + v : v}</div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bracket' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '4px' }}>Round of 32 Bracket</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '4px' }}>24 from 1st/2nd, 8 best thirds via Annex C.</div>
            {r32Matchups.length > 0 && r32Matchups[0].thirdsResolved ? (
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', marginBottom: '20px' }}>Annex C resolved - all 32 teams assigned.</div>
            ) : (
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', marginBottom: '20px' }}>Third-place slots not yet resolved (groups incomplete or tiebreak pending).</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '12px' }}>16 MATCHES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {r32Matchups.map(m => {
                    const isThirdSlot = m.away_slot.startsWith('3:') || m.home_slot.startsWith('3:')
                    const overrideTeam = thirdOverrides[m.match_number]
                    const displayAway = overrideTeam || m.away_team
                    const displayHome = m.home_team
                    return (
                      <div key={m.match_number} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#0a1410', border: '1px solid ' + (isThirdSlot && m.thirdsResolved ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.06)'), borderRadius: '8px', flexWrap: 'wrap' as const }}>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
                        <div style={{ flex: 1, textAlign: 'right' as const }}>
                          {displayHome ? (
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{displayHome}</span>
                          ) : (
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68' }}>{m.home_slot}</span>
                          )}
                        </div>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', padding: '0 4px' }}>vs</span>
                        <div style={{ flex: 1 }}>
                          {displayAway ? (
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', fontWeight: 700, color: isThirdSlot ? '#4FC3F7' : 'white' }}>{displayAway}</span>
                          ) : m.away_cluster ? (
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#FFD600' }}>3rd of {m.away_cluster.split('').join('/')} - TBD</span>
                          ) : (
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68' }}>{m.away_slot}</span>
                          )}
                        </div>
                        {isThirdSlot && m.away_slot.startsWith('3:') && qualifiers && (
                          <select
                            value={overrideTeam || m.away_team || ''}
                            onChange={e => {
                              const v = e.target.value
                              setThirdOverrides(p => v ? { ...p, [m.match_number]: v } : (() => { const n = { ...p }; delete n[m.match_number]; return n })())
                            }}
                            style={{ background: '#0d1c14', border: '1px solid rgba(79,195,247,0.3)', borderRadius: '4px', padding: '3px 6px', fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#4FC3F7', cursor: 'pointer' }}
                          >
                            <option value="">Annex C</option>
                            {qualifiers.qualifiedThirds.map(t => (
                              <option key={t.team} value={t.team}>{t.team} ({t.group})</option>
                            ))}
                          </select>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', position: 'sticky' as const, top: '80px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>THIRD-PLACE RANKING</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#3a5a42', marginBottom: '8px' }}>Best 8 qualify (green). Pts / GD / GF.</div>
                {qualifiers && qualifiers.thirds.map((t, idx) => (
                  <div key={t.team} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', borderBottom: idx === 7 ? '2px solid rgba(229,57,53,0.4)' : '1px solid rgba(255,255,255,0.03)', background: t.qualified ? 'rgba(0,200,83,0.04)' : 'transparent' }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.85rem', color: t.tiebreakNeeded ? '#FFD600' : (t.qualified ? '#00C853' : '#E53935'), minWidth: '18px', textAlign: 'center' }}>{t.tiebreakNeeded ? '?' : t.thirdRank}</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', minWidth: '16px' }}>({t.group})</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: 'white', flex: 1 }}>{t.team}</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#8ab898' }}>{t.points}pts</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68' }}>{t.goalDifference > 0 ? '+' + t.goalDifference : String(t.goalDifference)}</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42' }}>{t.goalsFor}gf</span>
                  </div>
                ))}
                {qualifiers && qualifiers.thirds.some(t => t.tiebreakNeeded) && (
                  <div style={{ marginTop: '8px', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', background: 'rgba(255,214,0,0.08)', padding: '8px', borderRadius: '6px' }}>Tiebreak at 8th/9th boundary. Manual resolution required.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
