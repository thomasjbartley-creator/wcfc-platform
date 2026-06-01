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
  PT:'1f1f5-1f1f9', CD:'1f1e8-1f1e9', UZ:'1f1fa-1f1ff', CO:'1f1e8-1f1f4',
  HR:'1f1ed-1f1f7', GH:'1f1ec-1f1ed', PA:'1f1f5-1f1e6',
}

function FlagImg({ code, size = 28 }: { code: string, size?: number }) {
  const cp = FLAGS[code]
  if (!cp) return <div style={{ width: size, height: size, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
  return <img src={`${TWEMOJI}/${cp}.png`} width={size} height={size} style={{ borderRadius: 4, objectFit: 'cover', display: 'block', flexShrink: 0 }} alt={code} />
}

// ── GROUP DEFINITIONS ──────────────────────────────────────────────
const GROUPS: Record<string, { teams: { name: string; flag: string }[] }> = {
  A: { teams: [{ name: 'Mexico', flag: 'MX' }, { name: 'South Africa', flag: 'ZA' }, { name: 'South Korea', flag: 'KR' }, { name: 'Czechia', flag: 'CZ' }] },
  B: { teams: [{ name: 'Canada', flag: 'CA' }, { name: 'Bosnia', flag: 'BA' }, { name: 'Qatar', flag: 'QA' }, { name: 'Switzerland', flag: 'CH' }] },
  C: { teams: [{ name: 'Brazil', flag: 'BR' }, { name: 'Morocco', flag: 'MA' }, { name: 'Haiti', flag: 'HT' }, { name: 'Scotland', flag: 'GB' }] },
  D: { teams: [{ name: 'USA', flag: 'US' }, { name: 'Paraguay', flag: 'PY' }, { name: 'Australia', flag: 'AU' }, { name: 'Türkiye', flag: 'TR' }] },
  E: { teams: [{ name: 'Germany', flag: 'DE' }, { name: 'Curaçao', flag: 'CW' }, { name: 'Ivory Coast', flag: 'CI' }, { name: 'Ecuador', flag: 'EC' }] },
  F: { teams: [{ name: 'Netherlands', flag: 'NL' }, { name: 'Japan', flag: 'JP' }, { name: 'Sweden', flag: 'SE' }, { name: 'Tunisia', flag: 'TN' }] },
  G: { teams: [{ name: 'Belgium', flag: 'BE' }, { name: 'Egypt', flag: 'EG' }, { name: 'Iran', flag: 'IR' }, { name: 'New Zealand', flag: 'NZ' }] },
  H: { teams: [{ name: 'Spain', flag: 'ES' }, { name: 'Cabo Verde', flag: 'CV' }, { name: 'Saudi Arabia', flag: 'SA' }, { name: 'Uruguay', flag: 'UY' }] },
  I: { teams: [{ name: 'France', flag: 'FR' }, { name: 'Senegal', flag: 'SN' }, { name: 'Iraq', flag: 'IQ' }, { name: 'Norway', flag: 'NO' }] },
  J: { teams: [{ name: 'Argentina', flag: 'AR' }, { name: 'Algeria', flag: 'DZ' }, { name: 'Austria', flag: 'AT' }, { name: 'Jordan', flag: 'JO' }] },
  K: { teams: [{ name: 'Portugal', flag: 'PT' }, { name: 'DR Congo', flag: 'CD' }, { name: 'Uzbekistan', flag: 'UZ' }, { name: 'Colombia', flag: 'CO' }] },
  L: { teams: [{ name: 'England', flag: 'GB' }, { name: 'Croatia', flag: 'HR' }, { name: 'Ghana', flag: 'GH' }, { name: 'Panama', flag: 'PA' }] },
}

// Group matches: [homeIdx, awayIdx]
const GROUP_MATCHES = [
  [0,1],[2,3],[0,2],[1,3],[0,3],[1,2]
]

// All 48 teams flat list for knockout dropdowns
const ALL_TEAMS = Object.entries(GROUPS).flatMap(([g, { teams }]) =>
  teams.map(t => ({ ...t, group: g }))
)

// ── TYPES ──────────────────────────────────────────────────────────
type ScorePick = { hs: number; as: number }    // home score, away score
type WinnerPick = string | null                 // team name

interface BracketState {
  groups: Record<string, ScorePick[]>           // group → 6 match scores
  r32:    (WinnerPick)[]                        // 16 winners
  r16:    (WinnerPick)[]                        // 8 winners
  qf:     (WinnerPick)[]                        // 4 winners
  sf:     (WinnerPick)[]                        // 2 winners
  final:  WinnerPick                            // 1 winner
  champion: WinnerPick                          // tournament champion
}

const defaultState = (): BracketState => ({
  groups: Object.fromEntries(Object.keys(GROUPS).map(g => [g, GROUP_MATCHES.map(() => ({ hs: 0, as: 0 }))])),
  r32: Array(16).fill(null),
  r16: Array(8).fill(null),
  qf:  Array(4).fill(null),
  sf:  Array(2).fill(null),
  final: null,
  champion: null,
})

// Calculate group standings from score picks
function getGroupStandings(groupKey: string, scores: ScorePick[]) {
  const teams = GROUPS[groupKey].teams.map(t => ({ ...t, pts: 0, gf: 0, ga: 0, gd: 0 }))
  GROUP_MATCHES.forEach(([hi, ai], mi) => {
    const s = scores[mi]
    if (s.hs === null || s.as === null) return
    teams[hi].gf += s.hs; teams[hi].ga += s.as
    teams[ai].gf += s.as; teams[ai].ga += s.hs
    if (s.hs > s.as) { teams[hi].pts += 3 }
    else if (s.hs < s.as) { teams[ai].pts += 3 }
    else { teams[hi].pts += 1; teams[ai].pts += 1 }
  })
  teams.forEach(t => { t.gd = t.gf - t.ga })
  return [...teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

const TABS = ['groups', 'r32', 'r16', 'qf', 'sf', 'champion'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = {
  groups: 'Groups', r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF / Final', champion: 'Champ'
}

const AUTO_SUBMIT_DATE = 'June 11 at 12:00 PM CT'
const LOCK_DATE = new Date('2026-06-11T17:00:00Z') // 12pm CT = 17:00 UTC

export default function BracketPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [bracket, setBracket] = useState<BracketState>(defaultState())
  const [activeTab, setActiveTab] = useState<Tab>('groups')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [matchIds, setMatchIds] = useState<Record<string, string>>({}) // "group_matchNum" → uuid

  const isLocked = new Date() >= LOCK_DATE

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      // Load group stage match IDs from DB
      const { data: dbMatches } = await supabase
        .from('matches')
        .select('id, match_number, stage, group_name')
        .eq('stage', 'group')
        .order('match_number')

      const idMap: Record<string, string> = {}
      dbMatches?.forEach(m => {
        if (m.group_name) {
          const groupMatchNum = dbMatches.filter(x => x.group_name === m.group_name).indexOf(m)
          idMap[`${m.group_name}_${groupMatchNum}`] = m.id
        }
      })
      setMatchIds(idMap)

      // Load existing bracket picks
      const { data: picks } = await supabase
        .from('bracket_picks')
        .select('*')
        .eq('user_id', user.id)

      if (picks && picks.length > 0) {
        const newBracket = defaultState()
        picks.forEach(p => {
          if (p.predicted_champion) newBracket.champion = p.predicted_champion
        })
        setBracket(newBracket)
        if (picks.length > 0) setLastSaved(new Date(picks[0].submitted_at))
      }

      setLoading(false)
    }
    load()
  }, [])

  // PREVIEW MODE: auto-save disabled — no writes to DB
  // When preview mode is removed, restore the debounced saveBracket() here
  const PREVIEW_MODE = true

  const saveBracket = useCallback(async () => {
    // Preview mode: no-op
    if (PREVIEW_MODE) return
  }, [])

  const updateGroupScore = (group: string, matchIdx: number, side: 'hs' | 'as', delta: number) => {
    if (isLocked) return
    setBracket(prev => {
      const newGroups = { ...prev.groups }
      const scores = [...newGroups[group]]
      scores[matchIdx] = { ...scores[matchIdx], [side]: Math.max(0, scores[matchIdx][side] + delta) }
      newGroups[group] = scores
      return { ...prev, groups: newGroups }
    })
  }

  const setKnockoutPick = (round: keyof Omit<BracketState, 'groups' | 'final' | 'champion'>, idx: number, team: string) => {
    if (isLocked) return
    setBracket(prev => {
      const arr = [...(prev[round] as WinnerPick[])]
      arr[idx] = arr[idx] === team ? null : team
      return { ...prev, [round]: arr }
    })
  }

  const totalPicks = () => {
    let count = 0
    Object.values(bracket.groups).forEach(scores => {
      scores.forEach(s => { if (s.hs >= 0 && s.as >= 0) count++ })
    })
    if (bracket.champion) count++
    return count
  }

  const pct = Math.round((totalPicks() / 73) * 100)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '3px' }}>LOADING BRACKET...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* STICKY NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,12,10,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '3px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '1px' }}>PREVIEW MODE</span>
            <Link href="/picks" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68', textDecoration: 'none' }}>← Picks</Link>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 20px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68', letterSpacing: '1px' }}>BRACKET COMPLETION</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.85rem', color: pct === 100 ? '#00C853' : '#FFD600' }}>{pct}% — {totalPicks()}/73 PICKS</span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#00C853' : '#FFD600', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '4px' }}>
            Preview mode — saving opens before June 11 kickoff
          </div>
        </div>

        {/* Round tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flexShrink: 0, padding: '6px 14px',
              background: activeTab === tab ? (tab === 'champion' ? '#FFD600' : '#00C853') : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeTab === tab ? (tab === 'champion' ? '#FFD600' : '#00C853') : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '16px',
              fontFamily: "'Barlow Condensed'",
              fontSize: '0.78rem', fontWeight: 700,
              color: activeTab === tab ? '#050C0A' : '#5a8a68',
              cursor: 'pointer', letterSpacing: '1px',
            }}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* PREVIEW MODE BANNER */}
        <div style={{ background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.25)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.2rem' }}>&#9888;</span>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#FFD600', letterSpacing: '0.5px' }}>
            Preview mode — fill out your bracket to try it, but saving opens before the June 11 kickoff. Your picks aren&apos;t stored yet.
          </div>
        </div>

        {/* ── GROUPS TAB ── */}
        {activeTab === 'groups' && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '6px' }}>GROUP STAGE</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Predict Every Score</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>
              Scores determine group standings — the winner/runner-up auto-fill your R32 bracket. Exact score = 25pts. Bonus: correct group winner +3pts, correct group runner-up +2pts.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '16px' }}>
              {Object.entries(GROUPS).map(([groupKey, { teams }]) => {
                const scores = bracket.groups[groupKey]
                const standings = getGroupStandings(groupKey, scores)
                const complete = scores.every(s => s.hs >= 0 && s.as >= 0)

                return (
                  <div key={groupKey} style={{ background: '#0a1410', border: `1px solid ${complete ? 'rgba(0,200,83,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', overflow: 'hidden' }}>
                    {/* Group header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: '#FFD600', letterSpacing: '2px' }}>GROUP {groupKey}</div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: complete ? '#00C853' : '#5a8a68', letterSpacing: '1px' }}>
                        {complete ? '✓ COMPLETE' : `${scores.filter(s => s.hs >= 0 && s.as >= 0).length}/6 SCORED`}
                      </div>
                    </div>

                    {/* Predicted standings */}
                    <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {standings.slice(0, 2).map((t, i) => (
                          <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.7rem', color: i === 0 ? '#FFD600' : '#00C853' }}>{i === 0 ? '1st' : '2nd'}:</span>
                            <FlagImg code={t.flag} size={14} />
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: i === 0 ? '#FFD600' : '#00C853' }}>{t.name}</span>
                          </div>
                        ))}
                        {standings[0].pts === 0 && standings[1].pts === 0 && (
                          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#3a5a42' }}>← predicted standings</span>
                        )}
                      </div>
                    </div>

                    {/* Match rows */}
                    <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {GROUP_MATCHES.map(([hi, ai], mi) => {
                        const home = teams[hi]
                        const away = teams[ai]
                        const s = scores[mi]
                        const isDraw = s.hs === s.as
                        const homeWins = s.hs > s.as
                        const awayWins = s.as > s.hs

                        return (
                          <div key={mi} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '6px', alignItems: 'center', padding: '6px 4px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                            {/* Home */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: homeWins ? 'rgba(0,200,83,0.08)' : isDraw ? 'rgba(255,214,0,0.05)' : 'transparent', borderRadius: '5px', padding: '4px 6px' }}>
                              <FlagImg code={home.flag} size={18} />
                              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: homeWins ? '#00C853' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{home.name}</span>
                            </div>
                            {/* Score inputs */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${homeWins ? 'rgba(0,200,83,0.3)' : isDraw ? 'rgba(255,214,0,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '5px', overflow: 'hidden' }}>
                                <button onClick={() => updateGroupScore(groupKey, mi, 'hs', -1)} style={{ width: 20, height: 28, background: 'none', border: 'none', color: '#5a8a68', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>−</button>
                                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: homeWins ? '#00C853' : isDraw ? '#FFD600' : 'white', width: 22, textAlign: 'center', lineHeight: '28px' }}>{s.hs}</span>
                                <button onClick={() => updateGroupScore(groupKey, mi, 'hs', 1)} style={{ width: 20, height: 28, background: 'none', border: 'none', color: '#5a8a68', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>+</button>
                              </div>
                              <span style={{ fontFamily: "'Bebas Neue'", fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>-</span>
                              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: `1px solid ${awayWins ? 'rgba(229,57,53,0.3)' : isDraw ? 'rgba(255,214,0,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '5px', overflow: 'hidden' }}>
                                <button onClick={() => updateGroupScore(groupKey, mi, 'as', -1)} style={{ width: 20, height: 28, background: 'none', border: 'none', color: '#5a8a68', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>−</button>
                                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: awayWins ? '#E53935' : isDraw ? '#FFD600' : 'white', width: 22, textAlign: 'center', lineHeight: '28px' }}>{s.as}</span>
                                <button onClick={() => updateGroupScore(groupKey, mi, 'as', 1)} style={{ width: 20, height: 28, background: 'none', border: 'none', color: '#5a8a68', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>+</button>
                              </div>
                            </div>
                            {/* Away */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', background: awayWins ? 'rgba(229,57,53,0.08)' : isDraw ? 'rgba(255,214,0,0.05)' : 'transparent', borderRadius: '5px', padding: '4px 6px' }}>
                              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: awayWins ? '#E53935' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>{away.name}</span>
                              <FlagImg code={away.flag} size={18} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── KNOCKOUT TABS (R32, R16, QF) ── */}
        {(['r32', 'r16', 'qf'] as const).includes(activeTab as 'r32' | 'r16' | 'qf') && (
          <KnockoutRound
            round={activeTab as 'r32' | 'r16' | 'qf'}
            bracket={bracket}
            onPick={(round, idx, team) => setKnockoutPick(round as keyof Omit<BracketState, 'groups' | 'final' | 'champion'>, idx, team)}
            isLocked={isLocked}
          />
        )}

        {/* ── SF / FINAL TAB ── */}
        {activeTab === 'sf' && (
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '20px' }}>Semifinals + Final</div>
            <SFAndFinal bracket={bracket} onPick={(round, idx, team) => {
              if (isLocked) return
              if (round === 'final') {
                setBracket(prev => ({ ...prev, final: prev.final === team ? null : team }))
              } else {
                setKnockoutPick(round as keyof Omit<BracketState, 'groups' | 'final' | 'champion'>, idx, team)
              }
            }} isLocked={isLocked} />
          </div>
        )}

        {/* ── CHAMPION TAB ── */}
        {activeTab === 'champion' && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '6px' }}>50 PTS IF CORRECT</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '20px' }}>Who Wins It All?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {ALL_TEAMS.map(team => {
                const isSelected = bracket.champion === team.name
                return (
                  <button key={`${team.group}_${team.name}`} onClick={() => {
                    if (isLocked) return
                    setBracket(prev => ({ ...prev, champion: prev.champion === team.name ? null : team.name }))
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px',
                    background: isSelected ? 'rgba(255,214,0,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isSelected ? '#FFD600' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '10px', cursor: isLocked ? 'default' : 'pointer',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}>
                    <FlagImg code={team.flag} size={28} />
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#FFD600' : 'white' }}>{team.name}</div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68' }}>Group {team.group}</div>
                    </div>
                    {isSelected && <div style={{ marginLeft: 'auto', fontFamily: "'Bebas Neue'", fontSize: '1rem', color: '#FFD600' }}>✓</div>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* STICKY BOTTOM STATUS */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(5,12,10,0.98) 30%)', padding: '20px 20px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '1px', marginBottom: '6px' }}>
            {isLocked
              ? 'BRACKET LOCKED — Picks submitted'
              : 'Preview mode — saving opens before June 11 kickoff'}
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginBottom: '8px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#00C853' : '#FFD600', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.85rem', color: pct === 100 ? '#00C853' : '#FFD600', letterSpacing: '2px' }}>
            {pct === 100 ? '✓ BRACKET COMPLETE — GOOD LUCK!' : `${totalPicks()} / 73 PICKS · ${100 - pct}% REMAINING`}
          </div>
        </div>
      </div>

    </div>
  )
}

// ── KNOCKOUT ROUND COMPONENT ───────────────────────────────────────
function KnockoutRound({ round, bracket, onPick, isLocked }: {
  round: 'r32' | 'r16' | 'qf'
  bracket: BracketState
  onPick: (round: string, idx: number, team: string) => void
  isLocked: boolean
}) {
  const config = {
    r32: { label: 'Round of 32', pts: '3 pts each', count: 16 },
    r16: { label: 'Round of 16', pts: '5 pts each', count: 8 },
    qf:  { label: 'Quarterfinals', pts: '8 pts each', count: 4 },
  }[round]

  const picks = bracket[round] as WinnerPick[]

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '6px' }}>{config.pts} PER CORRECT PICK</div>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>{config.label}</div>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', marginBottom: '20px' }}>
        Pick the winner of each match. Teams selected from all 48 nations.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '14px' }}>
        {Array.from({ length: config.count }, (_, i) => (
          <KnockoutMatchCard
            key={i}
            index={i}
            round={round}
            picked={picks[i]}
            onPick={(team) => onPick(round, i, team)}
            isLocked={isLocked}
          />
        ))}
      </div>
    </div>
  )
}

function KnockoutMatchCard({ index, round, picked, onPick, isLocked }: {
  index: number
  round: string
  picked: WinnerPick
  onPick: (team: string) => void
  isLocked: boolean
}) {
  const [homeTeam, setHomeTeam] = useState<string>('')
  const [awayTeam, setAwayTeam] = useState<string>('')

  const roundLabel = { r32: 'R32', r16: 'R16', qf: 'QF' }[round] || round

  return (
    <div style={{ background: '#0a1410', border: `1px solid ${picked ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px' }}>
        {roundLabel} MATCH {index + 1}
      </div>
      {/* Team selectors */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <select value={homeTeam} onChange={e => setHomeTeam(e.target.value)} disabled={isLocked} style={{ width: '100%', background: '#0d1c14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '8px 10px', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: 'white', outline: 'none', cursor: isLocked ? 'default' : 'pointer' }}>
          <option value="">— Select home team —</option>
          {ALL_TEAMS.map(t => <option key={`h_${t.group}_${t.name}`} value={t.name}>{t.name} (Group {t.group})</option>)}
        </select>
        <select value={awayTeam} onChange={e => setAwayTeam(e.target.value)} disabled={isLocked} style={{ width: '100%', background: '#0d1c14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '8px 10px', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: 'white', outline: 'none', cursor: isLocked ? 'default' : 'pointer' }}>
          <option value="">— Select away team —</option>
          {ALL_TEAMS.map(t => <option key={`a_${t.group}_${t.name}`} value={t.name}>{t.name} (Group {t.group})</option>)}
        </select>
        {/* Winner pick */}
        {homeTeam && awayTeam && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            {[homeTeam, awayTeam].map(team => {
              const isSelected = picked === team
              const flag = ALL_TEAMS.find(t => t.name === team)?.flag || ''
              return (
                <button key={team} onClick={() => onPick(team)} disabled={isLocked} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                  background: isSelected ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? '#00C853' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', cursor: isLocked ? 'default' : 'pointer', transition: 'all 0.15s',
                }}>
                  <FlagImg code={flag} size={20} />
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#00C853' : 'white' }}>{team}</span>
                  {isSelected && <span style={{ marginLeft: 'auto', color: '#00C853', fontSize: '0.9rem' }}>✓</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── SF + FINAL COMPONENT ───────────────────────────────────────────
function SFAndFinal({ bracket, onPick, isLocked }: {
  bracket: BracketState
  onPick: (round: string, idx: number, team: string) => void
  isLocked: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
      {/* Semis */}
      {[0, 1].map(i => (
        <div key={i} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px', marginBottom: '12px' }}>SEMIFINAL {i + 1} · 12 PTS</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ALL_TEAMS.slice(i * 8, i * 8 + 8).map(team => {
              const isSelected = (bracket.sf as WinnerPick[])[i] === team.name
              return (
                <button key={team.name} onClick={() => onPick('sf', i, team.name)} disabled={isLocked} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 6px',
                  background: isSelected ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? '#00C853' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', cursor: isLocked ? 'default' : 'pointer',
                }}>
                  <FlagImg code={team.flag} size={24} />
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', color: isSelected ? '#00C853' : '#5a8a68', textAlign: 'center' }}>{team.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Final */}
      <div style={{ background: 'linear-gradient(135deg, rgba(255,214,0,0.06), rgba(0,200,83,0.03))', border: '1.5px solid rgba(255,214,0,0.2)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '12px' }}>THE FINAL · 25 PTS (RUNNER-UP) · 50 PTS (CHAMPION)</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', marginBottom: '12px' }}>Pick from the dropdown — who makes the final?</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[0, 1].map(side => (
            <select key={side} onChange={e => onPick('final', side, e.target.value)} disabled={isLocked} style={{ flex: 1, background: '#0d1c14', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '6px', padding: '9px 10px', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: 'white', outline: 'none', cursor: isLocked ? 'default' : 'pointer' }}>
              <option value="">{side === 0 ? '— Finalist 1 —' : '— Finalist 2 —'}</option>
              {ALL_TEAMS.map(t => <option key={`f${side}_${t.name}`} value={t.name}>{t.name} (Group {t.group})</option>)}
            </select>
          ))}
        </div>
      </div>
    </div>
  )
}
