'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { computeAllGroupStandings, type GroupMatch, type GroupStandings } from '@/lib/standings'
import { getQualifiers, buildR32, buildKnockout, type R32Matchup, type Qualifiers, type KnockoutBracket, type KnockoutMatch } from '@/lib/advancement'

const OWNER_EMAIL = 'thomas@bartleytechaisolutions.com'

interface Match { id: string; match_number: number; group_name: string; home_team: string; away_team: string; home_score: number | null; away_score: number | null; status: string; stage: string; home_slot: string; away_slot: string; shootout_winner: string | null }

type Tab = 'results' | 'standings' | 'bracket' | 'knockout'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [editScores, setEditScores] = useState<Record<string, { home: string; away: string }>>({})
  const [koEditScores, setKoEditScores] = useState<Record<string, { home: string; away: string; shootout: string }>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [standings, setStandings] = useState<GroupStandings[]>([])
  const [bracket, setBracket] = useState<KnockoutBracket | null>(null)
  const [qualifiers, setQualifiers] = useState<Qualifiers | null>(null)
  const [thirdOverrides, setThirdOverrides] = useState<Record<number, string>>({})
  const [activeTab, setActiveTab] = useState<Tab>('results')

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data: { user: u } }) => {
      if (!u || u.email?.toLowerCase() !== OWNER_EMAIL) { router.replace('/'); return }
      setUser(u); setAuthorized(true); setLoading(false)
    })
  }, [router])

  const recompute = useCallback((groupRows: Match[], allRows: Match[]) => {
    const st = computeAllGroupStandings(groupRows as GroupMatch[])
    setStandings(st)
    const q = getQualifiers(st)
    setQualifiers(q)
    const r32Rows = allRows.filter(m => m.stage === 'r32').map(m => ({ match_number: m.match_number, home_slot: m.home_slot || '', away_slot: m.away_slot || '' }))
    const koRows = allRows.filter(m => ['r32','r16','qf','sf','third','final'].includes(m.stage)).map(m => ({
      match_number: m.match_number, stage: m.stage, home_team: m.home_team, away_team: m.away_team,
      home_score: m.home_score, away_score: m.away_score, shootout_winner: m.shootout_winner, status: m.status,
    }))
    const kb = buildKnockout(st, r32Rows, koRows)
    setBracket(kb)
  }, [])

  useEffect(() => {
    if (!authorized || !user) return
    const enc = encodeURIComponent(user.email)
    Promise.all([
      fetch('/api/admin/matches?email=' + enc + '&stage=group').then(r => r.json()),
      fetch('/api/admin/matches?email=' + enc + '&stage=all').then(r => r.json()),
    ]).then(([gd, ad]) => {
      if (gd.matches) {
        setMatches(gd.matches)
        const sc: Record<string, { home: string; away: string }> = {}
        for (const m of gd.matches) sc[m.id] = { home: m.home_score !== null ? String(m.home_score) : '', away: m.away_score !== null ? String(m.away_score) : '' }
        setEditScores(sc)
      }
      if (ad.matches) {
        setAllMatches(ad.matches)
        const ksc: Record<string, { home: string; away: string; shootout: string }> = {}
        for (const m of ad.matches) {
          if (['r32','r16','qf','sf','third','final'].includes(m.stage)) {
            ksc[m.id] = { home: m.home_score !== null ? String(m.home_score) : '', away: m.away_score !== null ? String(m.away_score) : '', shootout: m.shootout_winner || '' }
          }
        }
        setKoEditScores(ksc)
      }
      if (gd.matches && ad.matches) recompute(gd.matches, ad.matches)
    })
  }, [authorized, user, recompute])

  const saveMatch = useCallback(async (matchId: string, markFinished: boolean) => {
    if (!user) return
    const sc = editScores[matchId]
    if (!sc) return
    const hs = sc.home !== '' ? parseInt(sc.home, 10) : null
    const as_ = sc.away !== '' ? parseInt(sc.away, 10) : null
    if (markFinished && (hs === null || as_ === null || isNaN(hs) || isNaN(as_))) { alert('Enter both scores.'); return }
    setSaving(p => ({ ...p, [matchId]: true }))
    const body: any = { matchId, userEmail: user.email, homeScore: hs, awayScore: as_ }
    if (markFinished) body.status = 'finished'
    const res = await fetch('/api/admin/update-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      const updG = matches.map(m => m.id === matchId ? { ...m, home_score: hs, away_score: as_, status: markFinished ? 'finished' : m.status } : m)
      setMatches(updG)
      const updA = allMatches.map(m => m.id === matchId ? { ...m, home_score: hs, away_score: as_, status: markFinished ? 'finished' : m.status } : m)
      setAllMatches(updA)
      recompute(updG, updA)
    }
    setSaving(p => ({ ...p, [matchId]: false }))
  }, [user, editScores, matches, allMatches, recompute])

  const saveKoMatch = useCallback(async (matchId: string, markFinished: boolean) => {
    if (!user) return
    const sc = koEditScores[matchId]
    if (!sc) return
    const hs = sc.home !== '' ? parseInt(sc.home, 10) : null
    const as_ = sc.away !== '' ? parseInt(sc.away, 10) : null
    if (markFinished && (hs === null || as_ === null || isNaN(hs) || isNaN(as_))) { alert('Enter both scores.'); return }
    const isTied = hs !== null && as_ !== null && hs === as_
    if (markFinished && isTied && !sc.shootout) { alert('Scores are tied. Select a shootout winner.'); return }
    setSaving(p => ({ ...p, [matchId]: true }))
    const body: any = { matchId, userEmail: user.email, homeScore: hs, awayScore: as_ }
    if (markFinished) body.status = 'finished'
    body.shootoutWinner = (isTied && sc.shootout) ? sc.shootout : null
    const res = await fetch('/api/admin/update-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      const updA = allMatches.map(m => m.id === matchId ? { ...m, home_score: hs, away_score: as_, status: markFinished ? 'finished' : m.status, shootout_winner: body.shootoutWinner } : m)
      setAllMatches(updA)
      recompute(matches, updA)
    }
    setSaving(p => ({ ...p, [matchId]: false }))
  }, [user, koEditScores, matches, allMatches, recompute])

  if (loading || !authorized) return <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a8a68', fontFamily: "'Barlow', sans-serif" }}>{loading ? 'Checking access...' : 'Redirecting...'}</div>

  const groups = new Map<string, Match[]>()
  for (const m of matches) { const a = groups.get(m.group_name) || []; a.push(m); groups.set(m.group_name, a) }
  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  const inputStyle = { width: '44px', textAlign: 'center' as const, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '5px', color: 'white', fontFamily: "'Bebas Neue'", fontSize: '1rem' }
  const ROUND_ORDER = ['r16','qf','sf','third','final']
  const ROUND_LABELS: Record<string, string> = { r16: 'Round of 16', qf: 'Quarterfinals', sf: 'Semifinals', third: '3rd Place', final: 'Final' }

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ background: 'rgba(229,57,53,0.08)', borderBottom: '1px solid rgba(229,57,53,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#E53935', letterSpacing: '2px' }}>ADMIN</span><span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', marginLeft: '12px' }}>{user?.email}</span></div>
        <a href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none' }}>Back to site</a>
      </div>
      <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0', flexWrap: 'wrap' as const }}>
        {(['results', 'standings', 'bracket', 'knockout'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', background: activeTab === tab ? '#E53935' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '6px 6px 0 0', color: activeTab === tab ? 'white' : '#5a8a68', fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' as const }}>{tab}</button>
        ))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {activeTab === 'results' && (<div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Stage Results</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Enter scores and mark matches as finished. {matches.filter(m => m.status === 'finished').length}/72 finished.</div>
          {sortedGroups.map(([gn, gm]) => (<div key={gn} style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>GROUP {gn}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{gm.map(m => {
              const s = editScores[m.id] || { home: '', away: '' }; const fin = m.status === 'finished'; const sv = saving[m.id] || false
              return (<div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: fin ? 'rgba(0,200,83,0.05)' : '#0a1410', border: '1px solid ' + (fin ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.06)'), borderRadius: '8px', flexWrap: 'wrap' as const }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px', textAlign: 'right' as const }}>{m.home_team}</span>
                <input type="number" min="0" value={s.home} onChange={e => setEditScores(p => ({ ...p, [m.id]: { ...p[m.id], home: e.target.value } }))} disabled={fin} style={inputStyle} />
                <span style={{ color: '#3a5a42', fontSize: '0.75rem' }}>-</span>
                <input type="number" min="0" value={s.away} onChange={e => setEditScores(p => ({ ...p, [m.id]: { ...p[m.id], away: e.target.value } }))} disabled={fin} style={inputStyle} />
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '120px' }}>{m.away_team}</span>
                {fin ? <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '1px' }}>FINISHED</span> : (
                  <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                    <button onClick={() => saveMatch(m.id, false)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#8ab898', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer' }}>{sv ? '...' : 'SAVE'}</button>
                    <button onClick={() => saveMatch(m.id, true)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '4px', color: '#00C853', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer' }}>{sv ? '...' : 'MARK FINAL'}</button>
                  </div>)}
              </div>)
            })}</div>
          </div>))}
        </div>)}

        {activeTab === 'standings' && (<div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Group Standings</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Computed from finished matches. FIFA tiebreaker rules.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {standings.map(g => (<div key={g.group} style={{ background: '#0a1410', border: '1px solid ' + (g.hasTiebreak ? 'rgba(255,214,0,0.3)' : 'rgba(255,255,255,0.07)'), borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', letterSpacing: '2px' }}>GROUP {g.group}</span>
                {g.hasTiebreak && <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: '#FFD600', background: 'rgba(255,214,0,0.15)', padding: '2px 8px', borderRadius: '4px' }}>TIEBREAK</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr repeat(8, 32px)', gap: '2px', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['#','Team','P','W','D','L','GF','GA','GD','Pts'].map(h => <div key={h} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.6rem', color: '#3a5a42', letterSpacing: '1px', textAlign: h === 'Team' ? 'left' as const : 'center' as const }}>{h}</div>)}
              </div>
              {g.teams.map((t, idx) => (<div key={t.team} style={{ display: 'grid', gridTemplateColumns: '24px 1fr repeat(8, 32px)', gap: '2px', padding: '5px 10px', borderBottom: idx < g.teams.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', background: idx < 2 ? 'rgba(0,200,83,0.03)' : 'transparent' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: t.tiebreakNeeded ? '#FFD600' : (idx < 2 ? '#00C853' : '#5a8a68'), textAlign: 'center' }}>{t.tiebreakNeeded ? '?' : t.rank}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: 'white', fontWeight: 700 }}>{t.team}</div>
                {[t.played, t.won, t.drawn, t.lost, t.goalsFor, t.goalsAgainst, t.goalDifference, t.points].map((v, vi) => <div key={vi} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: vi === 7 ? '#FFD600' : '#8ab898', textAlign: 'center', fontWeight: vi === 7 ? 700 : 400 }}>{v > 0 && vi === 6 ? '+' + v : v}</div>)}
              </div>))}
            </div>))}
          </div>
        </div>)}

        {activeTab === 'bracket' && bracket && (<div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Full Bracket</div>
          {ROUND_ORDER.map(stage => { const label = ROUND_LABELS[stage] || stage; const km = stage === 'third' ? (bracket.third ? [bracket.third] : []) : stage === 'final' ? (bracket.final ? [bracket.final] : []) : (bracket as any)[stage] as KnockoutMatch[]
            if (!km || km.length === 0) return null
            return (<div key={stage} style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>{km.map((m: KnockoutMatch) => (<div key={m.match_number} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#0a1410', border: '1px solid ' + (m.decided ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.06)'), borderRadius: '8px' }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: m.winner === m.home_team ? '#00C853' : 'white', flex: 1, textAlign: 'right' as const }}>{m.home_team || 'TBD'}</span>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#5a8a68', padding: '0 4px' }}>{m.home_score !== null && m.away_score !== null ? m.home_score + '-' + m.away_score : 'vs'}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: m.winner === m.away_team ? '#00C853' : 'white', flex: 1 }}>{m.away_team || 'TBD'}</span>
                {m.shootout_winner && <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.6rem', color: '#FF9800' }}>PEN</span>}
              </div>))}</div>
            </div>)
          })}
          {bracket.r32.length > 0 && (<div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>Round of 32</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>{bracket.r32.map(m => (<div key={m.match_number} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#0a1410', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{m.match_number}</span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', flex: 1, textAlign: 'right' as const }}>{m.home_team || m.home_slot}</span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42' }}>vs</span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: m.away_cluster ? '#4FC3F7' : 'white', flex: 1 }}>{m.away_team || (m.away_cluster ? '3rd ' + m.away_cluster : m.away_slot)}</span>
            </div>))}</div>
          </div>)}
        </div>)}

        {activeTab === 'knockout' && bracket && (<div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Knockout Results Entry</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Enter scores for matches where both teams are resolved.</div>
          {ROUND_ORDER.map(stage => {
            const label = ROUND_LABELS[stage] || stage
            const km: KnockoutMatch[] = stage === 'third' ? (bracket.third ? [bracket.third] : []) : stage === 'final' ? (bracket.final ? [bracket.final] : []) : (bracket as any)[stage] || []
            const ready = km.filter((m: KnockoutMatch) => m.home_team && m.away_team)
            if (ready.length === 0) return null
            return (<div key={stage} style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{ready.map((km: KnockoutMatch) => {
                const dbMatch = allMatches.find(m => m.match_number === km.match_number)
                if (!dbMatch) return null
                const sc = koEditScores[dbMatch.id] || { home: '', away: '', shootout: '' }
                const fin = dbMatch.status === 'finished'
                const sv = saving[dbMatch.id] || false
                const hsVal = sc.home !== '' ? parseInt(sc.home, 10) : null
                const asVal = sc.away !== '' ? parseInt(sc.away, 10) : null
                const isTied = hsVal !== null && asVal !== null && hsVal === asVal
                return (<div key={km.match_number} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: fin ? 'rgba(0,200,83,0.05)' : '#0a1410', border: '1px solid ' + (fin ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.06)'), borderRadius: '8px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', minWidth: '28px' }}>#{km.match_number}</span>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '100px', textAlign: 'right' as const }}>{km.home_team}</span>
                  <input type="number" min="0" value={sc.home} onChange={e => setKoEditScores(p => ({ ...p, [dbMatch.id]: { ...p[dbMatch.id], home: e.target.value } }))} disabled={fin} style={inputStyle} />
                  <span style={{ color: '#3a5a42', fontSize: '0.75rem' }}>-</span>
                  <input type="number" min="0" value={sc.away} onChange={e => setKoEditScores(p => ({ ...p, [dbMatch.id]: { ...p[dbMatch.id], away: e.target.value } }))} disabled={fin} style={inputStyle} />
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: 'white', minWidth: '100px' }}>{km.away_team}</span>
                  {isTied && !fin && (<select value={sc.shootout} onChange={e => setKoEditScores(p => ({ ...p, [dbMatch.id]: { ...p[dbMatch.id], shootout: e.target.value } }))} style={{ background: '#0d1c14', border: '1px solid rgba(255,152,0,0.3)', borderRadius: '4px', padding: '4px 6px', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FF9800', cursor: 'pointer' }}>
                    <option value="">Shootout?</option>
                    <option value="home">{km.home_team} wins PEN</option>
                    <option value="away">{km.away_team} wins PEN</option>
                  </select>)}
                  {fin ? <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853' }}>FINISHED{km.shootout_winner ? ' (PEN)' : ''}</span> : (
                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                      <button onClick={() => saveKoMatch(dbMatch.id, false)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#8ab898', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer' }}>{sv ? '...' : 'SAVE'}</button>
                      <button onClick={() => saveKoMatch(dbMatch.id, true)} disabled={sv} style={{ padding: '4px 10px', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '4px', color: '#00C853', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', cursor: 'pointer' }}>{sv ? '...' : 'MARK FINAL'}</button>
                    </div>)}
                </div>)
              })}</div>
            </div>)
          })}
        </div>)}

      </div>
    </div>
  )
}
