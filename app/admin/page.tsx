'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { computeAllGroupStandings, type GroupMatch, type GroupStandings } from '@/lib/standings'

// TODO: Replace with proper admin role when roles are implemented
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

type Tab = 'results' | 'standings'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [editScores, setEditScores] = useState<Record<string, { home: string; away: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [standings, setStandings] = useState<GroupStandings[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('results')

  // Auth check
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.email?.toLowerCase() !== OWNER_EMAIL) {
        router.replace('/')
        return
      }
      setUser(user)
      setAuthorized(true)
      setLoading(false)
    })
  }, [router])

  // Load matches via server-side admin API (bypasses RLS)
  useEffect(() => {
    if (!authorized || !user) return
    fetch(`/api/admin/matches?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.matches) {
          setMatches(data.matches)
          const scores: Record<string, { home: string; away: string }> = {}
          for (const m of data.matches) {
            scores[m.id] = {
              home: m.home_score !== null ? String(m.home_score) : '',
              away: m.away_score !== null ? String(m.away_score) : '',
            }
          }
          setEditScores(scores)
          setStandings(computeAllGroupStandings(data.matches as GroupMatch[]))
        }
      })
  }, [authorized, user])

  const saveMatch = useCallback(async (matchId: string, markFinished: boolean) => {
    if (!user) return
    const scores = editScores[matchId]
    if (!scores) return

    const homeScore = scores.home !== '' ? parseInt(scores.home, 10) : null
    const awayScore = scores.away !== '' ? parseInt(scores.away, 10) : null

    if (markFinished && (homeScore === null || awayScore === null || isNaN(homeScore) || isNaN(awayScore))) {
      alert('Enter both scores before marking as finished.')
      return
    }

    setSaving(prev => ({ ...prev, [matchId]: true }))

    const body: any = {
      matchId,
      userEmail: user.email,
      homeScore,
      awayScore,
    }
    if (markFinished) body.status = 'finished'

    const res = await fetch('/api/admin/update-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      // Update local state
      setMatches(prev => prev.map(m =>
        m.id === matchId
          ? { ...m, home_score: homeScore, away_score: awayScore, status: markFinished ? 'finished' : m.status }
          : m
      ))
      // Recompute standings
      const updated = matches.map(m =>
        m.id === matchId
          ? { ...m, home_score: homeScore, away_score: awayScore, status: markFinished ? 'finished' : m.status }
          : m
      )
      setStandings(computeAllGroupStandings(updated as GroupMatch[]))
    }

    setSaving(prev => ({ ...prev, [matchId]: false }))
  }, [user, editScores, matches])

  if (loading || !authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a8a68', fontFamily: "'Barlow', sans-serif" }}>
        {loading ? 'Checking access...' : 'Redirecting...'}
      </div>
    )
  }

  // Group matches by group_name
  const groups = new Map<string, Match[]>()
  for (const m of matches) {
    const arr = groups.get(m.group_name) || []
    arr.push(m)
    groups.set(m.group_name, arr)
  }
  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: 'rgba(229,57,53,0.08)', borderBottom: '1px solid rgba(229,57,53,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#E53935', letterSpacing: '2px' }}>ADMIN</span>
          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', marginLeft: '12px' }}>{user?.email}</span>
        </div>
        <a href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none' }}>← Back to site</a>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0' }}>
        {(['results', 'standings'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 20px',
            background: activeTab === tab ? '#E53935' : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(229,57,53,0.3)',
            borderRadius: '6px 6px 0 0',
            color: activeTab === tab ? 'white' : '#5a8a68',
            fontFamily: "'Barlow Condensed'",
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* ═══ RESULTS TAB ═══ */}
        {activeTab === 'results' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Stage Results</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>
              Enter scores and mark matches as finished. {matches.filter(m => m.status === 'finished').length}/72 finished.
            </div>

            {sortedGroups.map(([groupName, groupMatches]) => (
              <div key={groupName} style={{ marginBottom: '32px' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>GROUP {groupName}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {groupMatches.map(m => {
                    const scores = editScores[m.id] || { home: '', away: '' }
                    const isFinished = m.status === 'finished'
                    const isSaving = saving[m.id] || false

                    return (
                      <div key={m.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: isFinished ? 'rgba(0,200,83,0.05)' : '#0a1410',
                        border: `1px solid ${isFinished ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '8px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px', textAlign: 'right' }}>{m.home_team}</span>
                        <input
                          type="number"
                          min="0"
                          value={scores.home}
                          onChange={e => setEditScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], home: e.target.value } }))}
                          disabled={isFinished}
                          style={{ width: '44px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '5px', color: 'white', fontFamily: "'Bebas Neue'", fontSize: '1rem' }}
                        />
                        <span style={{ color: '#3a5a42', fontSize: '0.75rem' }}>–</span>
                        <input
                          type="number"
                          min="0"
                          value={scores.away}
                          onChange={e => setEditScores(prev => ({ ...prev, [m.id]: { ...prev[m.id], away: e.target.value } }))}
                          disabled={isFinished}
                          style={{ width: '44px', textAlign: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '5px', color: 'white', fontFamily: "'Bebas Neue'", fontSize: '1rem' }}
                        />
                        <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px' }}>{m.away_team}</span>

                        {isFinished ? (
                          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '1px' }}>FINISHED</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                            <button
                              onClick={() => saveMatch(m.id, false)}
                              disabled={isSaving}
                              style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#8ab898', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '1px' }}
                            >
                              {isSaving ? '...' : 'SAVE'}
                            </button>
                            <button
                              onClick={() => saveMatch(m.id, true)}
                              disabled={isSaving}
                              style={{ padding: '4px 10px', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '4px', color: '#00C853', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '1px' }}
                            >
                              {isSaving ? '...' : 'MARK FINAL'}
                            </button>
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

        {/* ═══ STANDINGS TAB ═══ */}
        {activeTab === 'standings' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Standings</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>
              Computed from finished matches. Rankings follow FIFA tiebreaker rules.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {standings.map(g => (
                <div key={g.group} style={{ background: '#0a1410', border: `1px solid ${g.hasTiebreak ? 'rgba(255,214,0,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', letterSpacing: '2px' }}>GROUP {g.group}</span>
                    {g.hasTiebreak && (
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: '#FFD600', background: 'rgba(255,214,0,0.15)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '1px' }}>TIEBREAK NEEDED</span>
                    )}
                  </div>

                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr repeat(8, 32px)', gap: '2px', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map(h => (
                      <div key={h} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.6rem', color: '#3a5a42', letterSpacing: '1px', textAlign: h === 'Team' ? 'left' : 'center' }}>{h}</div>
                    ))}
                  </div>

                  {/* Team rows */}
                  {g.teams.map((t, idx) => (
                    <div key={t.team} style={{
                      display: 'grid',
                      gridTemplateColumns: '24px 1fr repeat(8, 32px)',
                      gap: '2px',
                      padding: '5px 10px',
                      borderBottom: idx < g.teams.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      background: idx < 2 ? 'rgba(0,200,83,0.03)' : 'transparent',
                    }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: t.tiebreakNeeded ? '#FFD600' : (idx < 2 ? '#00C853' : '#5a8a68'), textAlign: 'center' }}>
                        {t.tiebreakNeeded ? '?' : t.rank}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {t.team}
                        {t.tiebreakNeeded && <span style={{ fontSize: '0.6rem', color: '#FFD600' }}>&#9888;</span>}
                      </div>
                      {[t.played, t.won, t.drawn, t.lost, t.goalsFor, t.goalsAgainst, t.goalDifference, t.points].map((v, vi) => (
                        <div key={vi} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: vi === 7 ? '#FFD600' : '#8ab898', textAlign: 'center', fontWeight: vi === 7 ? 700 : 400 }}>
                          {v > 0 && vi === 6 ? `+${v}` : v}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
