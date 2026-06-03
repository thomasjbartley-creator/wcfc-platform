"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { BRACKET_LOCK_UTC } from "@/lib/bracket-lock"

const TWEMOJI = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72"
const FLAGS: Record<string, string> = {
  MX:"1f1f2-1f1fd",ZA:"1f1ff-1f1e6",KR:"1f1f0-1f1f7",CZ:"1f1e8-1f1ff",
  CA:"1f1e8-1f1e6",BA:"1f1e7-1f1e6",QA:"1f1f6-1f1e6",CH:"1f1e8-1f1ed",
  BR:"1f1e7-1f1f7",MA:"1f1f2-1f1e6",HT:"1f1ed-1f1f9",GB:"1f1ec-1f1e7",
  US:"1f1fa-1f1f8",PY:"1f1f5-1f1fe",AU:"1f1e6-1f1fa",TR:"1f1f9-1f1f7",
  DE:"1f1e9-1f1ea",CW:"1f1e8-1f1fc",CI:"1f1e8-1f1ee",EC:"1f1ea-1f1e8",
  NL:"1f1f3-1f1f1",JP:"1f1ef-1f1f5",SE:"1f1f8-1f1ea",TN:"1f1f9-1f1f3",
  BE:"1f1e7-1f1ea",EG:"1f1ea-1f1ec",IR:"1f1ee-1f1f7",NZ:"1f1f3-1f1ff",
  ES:"1f1ea-1f1f8",CV:"1f1e8-1f1fb",SA:"1f1f8-1f1e6",UY:"1f1fa-1f1fe",
  FR:"1f1eb-1f1f7",SN:"1f1f8-1f1f3",IQ:"1f1ee-1f1f6",NO:"1f1f3-1f1f4",
  AR:"1f1e6-1f1f7",DZ:"1f1e9-1f1ff",AT:"1f1e6-1f1f9",JO:"1f1ef-1f1f4",
  PT:"1f1f5-1f1f9",CD:"1f1e8-1f1e9",UZ:"1f1fa-1f1ff",CO:"1f1e8-1f1f4",
  HR:"1f1ed-1f1f7",GH:"1f1ec-1f1ed",PA:"1f1f5-1f1e6",
}
function FlagImg({ code, size = 28 }: { code: string; size?: number }) {
  const cp = FLAGS[code]
  if (!cp) return <div style={{ width: size, height: size, borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
  return <img src={`${TWEMOJI}/${cp}.png`} width={size} height={size} style={{ borderRadius: 4, objectFit: "cover", display: "block", flexShrink: 0 }} alt={code} />
}

const GROUPS: Record<string, { teams: { name: string; flag: string }[] }> = {
  A:{teams:[{name:"Mexico",flag:"MX"},{name:"South Africa",flag:"ZA"},{name:"South Korea",flag:"KR"},{name:"Czechia",flag:"CZ"}]},
  B:{teams:[{name:"Canada",flag:"CA"},{name:"Bosnia",flag:"BA"},{name:"Qatar",flag:"QA"},{name:"Switzerland",flag:"CH"}]},
  C:{teams:[{name:"Brazil",flag:"BR"},{name:"Morocco",flag:"MA"},{name:"Haiti",flag:"HT"},{name:"Scotland",flag:"GB"}]},
  D:{teams:[{name:"USA",flag:"US"},{name:"Paraguay",flag:"PY"},{name:"Australia",flag:"AU"},{name:"Türkiye",flag:"TR"}]},
  E:{teams:[{name:"Germany",flag:"DE"},{name:"Curaçao",flag:"CW"},{name:"Ivory Coast",flag:"CI"},{name:"Ecuador",flag:"EC"}]},
  F:{teams:[{name:"Netherlands",flag:"NL"},{name:"Japan",flag:"JP"},{name:"Sweden",flag:"SE"},{name:"Tunisia",flag:"TN"}]},
  G:{teams:[{name:"Belgium",flag:"BE"},{name:"Egypt",flag:"EG"},{name:"Iran",flag:"IR"},{name:"New Zealand",flag:"NZ"}]},
  H:{teams:[{name:"Spain",flag:"ES"},{name:"Cabo Verde",flag:"CV"},{name:"Saudi Arabia",flag:"SA"},{name:"Uruguay",flag:"UY"}]},
  I:{teams:[{name:"France",flag:"FR"},{name:"Senegal",flag:"SN"},{name:"Iraq",flag:"IQ"},{name:"Norway",flag:"NO"}]},
  J:{teams:[{name:"Argentina",flag:"AR"},{name:"Algeria",flag:"DZ"},{name:"Austria",flag:"AT"},{name:"Jordan",flag:"JO"}]},
  K:{teams:[{name:"Portugal",flag:"PT"},{name:"DR Congo",flag:"CD"},{name:"Uzbekistan",flag:"UZ"},{name:"Colombia",flag:"CO"}]},
  L:{teams:[{name:"England",flag:"GB"},{name:"Croatia",flag:"HR"},{name:"Ghana",flag:"GH"},{name:"Panama",flag:"PA"}]},
}
const GROUP_MATCH_PAIRS = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]]
const ALL_TEAMS = Object.entries(GROUPS).flatMap(([g, { teams }]) => teams.map(t => ({ ...t, group: g })))

const R16_SRC: Record<number,[number,number]> = {89:[73,74],90:[75,76],91:[77,78],92:[79,80],93:[81,82],94:[83,84],95:[85,86],96:[87,88]}
const QF_SRC: Record<number,[number,number]> = {97:[89,90],98:[91,92],99:[93,94],100:[95,96]}
const SF_SRC: Record<number,[number,number]> = {101:[97,98],102:[99,100]}
const THIRD_MATCH = 103
const FINAL_MATCH = 104
const FINAL_SRC: [number,number] = [101,102]

const R32_SLOTS: Record<number, { home: string; away: string }> = {
  73:{home:"2A",away:"2B"},74:{home:"1E",away:"3:ABCDF"},
  75:{home:"1F",away:"2C"},76:{home:"1C",away:"2F"},
  77:{home:"1I",away:"3:CDFGH"},78:{home:"2E",away:"2I"},
  79:{home:"1A",away:"3:CEFHI"},80:{home:"1L",away:"3:EHIJK"},
  81:{home:"1D",away:"3:BEFIJ"},82:{home:"1G",away:"3:AEHIJ"},
  83:{home:"2K",away:"2L"},84:{home:"1H",away:"2J"},
  85:{home:"1B",away:"3:EFGIJ"},86:{home:"1J",away:"2H"},
  87:{home:"1K",away:"3:DEIJL"},88:{home:"2D",away:"2G"},
}
const THIRD_PLACE_SLOT_ALLOWED: [number, string[]][] = [
  [74,["A","B","C","D","F"]],[77,["C","D","F","G","H"]],
  [79,["C","E","F","H","I"]],[80,["E","H","I","J","K"]],
  [81,["B","E","F","I","J"]],[82,["A","E","H","I","J"]],
  [85,["E","F","G","I","J"]],[87,["D","E","I","J","L"]],
]
function assignThirdPlaceToSlots(qualGroups: string[]): Record<number, string> {
  const result: Record<number, string> = {}; const used = new Set<string>()
  function solve(si: number): boolean {
    if (si >= THIRD_PLACE_SLOT_ALLOWED.length) return true
    const [mn, allowed] = THIRD_PLACE_SLOT_ALLOWED[si]
    for (const g of qualGroups) {
      if (used.has(g) || !allowed.includes(g)) continue
      used.add(g); result[mn] = g
      if (solve(si + 1)) return true
      used.delete(g); delete result[mn]
    }
    return false
  }
  solve(0); return result
}

type ScorePick = { hs: number; as: number }
type TeamInfo = { name: string; flag: string } | null
type Tab = "groups" | "r32" | "r16" | "qf" | "sf"
const TABS: Tab[] = ["groups","r32","r16","qf","sf"]
const TAB_LABELS: Record<Tab, string> = { groups:"Groups", r32:"R32", r16:"R16", qf:"QF", sf:"SF / Final" }
const LOCK_DATE = new Date(BRACKET_LOCK_UTC)

function getGroupStandings(groupKey: string, scores: ScorePick[]) {
  const teams = GROUPS[groupKey].teams.map(t => ({ ...t, pts: 0, gf: 0, ga: 0, gd: 0 }))
  GROUP_MATCH_PAIRS.forEach(([hi, ai], mi) => {
    const s = scores[mi]
    teams[hi].gf += s.hs; teams[hi].ga += s.as
    teams[ai].gf += s.as; teams[ai].ga += s.hs
    if (s.hs > s.as) teams[hi].pts += 3
    else if (s.hs < s.as) teams[ai].pts += 3
    else { teams[hi].pts += 1; teams[ai].pts += 1 }
  })
  teams.forEach(t => { t.gd = t.gf - t.ga })
  return [...teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

export default function BracketPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // THE REAL STATE — standings, completion, and save ALL read from these
  const [groupScores, setGroupScores] = useState<Record<string, ScorePick[]>>(
    Object.fromEntries(Object.keys(GROUPS).map(g => [g, GROUP_MATCH_PAIRS.map(() => ({ hs: 0, as: 0 }))]))
  )
  const [knockoutWinners, setKnockoutWinners] = useState<Record<number, string>>({})

  // Match IDs from DB (populated once on load)
  const [groupMatchIds, setGroupMatchIds] = useState<Record<string, string>>({})
  const [koMatchIds, setKoMatchIds] = useState<Record<number, string>>({})

  const [activeTab, setActiveTab] = useState<Tab>("groups")
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLocked, setIsLocked] = useState(new Date() >= LOCK_DATE)
  const [hasLockedRows, setHasLockedRows] = useState(false)

  // Champion = whoever the user picks to win the Final
  const champion = knockoutWinners[FINAL_MATCH] || null

  useEffect(() => {
    const t = setInterval(() => { if (new Date() >= LOCK_DATE) setIsLocked(true) }, 30000)
    return () => clearInterval(t)
  }, [])

  // --- Load matches + rehydrate picks from DB ---
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)
      const { data: dbMatches } = await supabase.from("matches").select("id, match_number, stage, group_name").order("match_number")
      const gMap: Record<string, string> = {}
      const kMap: Record<number, string> = {}
      const groupMatchOrder: Record<string, number[]> = {}
      dbMatches?.filter(m => m.stage === "group" && m.group_name).forEach(m => {
        if (!groupMatchOrder[m.group_name!]) groupMatchOrder[m.group_name!] = []
        groupMatchOrder[m.group_name!].push(m.match_number)
      })
      Object.values(groupMatchOrder).forEach(arr => arr.sort((a, b) => a - b))
      dbMatches?.forEach(m => {
        if (m.stage === "group" && m.group_name) {
          const idx = groupMatchOrder[m.group_name].indexOf(m.match_number)
          if (idx >= 0) gMap[`${m.group_name}_${idx}`] = m.id
        } else if (m.stage !== "group") {
          kMap[m.match_number] = m.id
        }
      })
      setGroupMatchIds(gMap)
      setKoMatchIds(kMap)

      // Rehydrate from bracket_picks
      const { data: picks } = await supabase.from("bracket_picks").select("*").eq("user_id", user.id)
      if (picks && picks.length > 0) {
        const loadedScores: Record<string, ScorePick[]> = Object.fromEntries(
          Object.keys(GROUPS).map(g => [g, GROUP_MATCH_PAIRS.map(() => ({ hs: 0, as: 0 }))])
        )
        const loadedKO: Record<number, string> = {}
        const matchInfo: Record<string, { num: number; stage: string; group: string | null }> = {}
        dbMatches?.forEach(m => { matchInfo[m.id] = { num: m.match_number, stage: m.stage, group: m.group_name } })

        picks.forEach(p => {
          const info = matchInfo[p.match_id]
          if (!info) return
          if (info.stage === "group" && info.group) {
            const idx = groupMatchOrder[info.group]?.indexOf(info.num) ?? -1
            if (idx >= 0 && p.predicted_home != null && p.predicted_away != null) {
              loadedScores[info.group][idx] = { hs: p.predicted_home, as: p.predicted_away }
            }
          } else if (info.stage !== "group") {
            if (p.predicted_winner) loadedKO[info.num] = p.predicted_winner
            if (info.num === FINAL_MATCH && p.predicted_champion && !p.predicted_winner) {
              loadedKO[FINAL_MATCH] = p.predicted_champion
            }
          }
        })
        setGroupScores(loadedScores)
        setKnockoutWinners(loadedKO)
        setIsSubmitted(picks.some(p => p.submitted_at != null))
        if (picks.some(p => p.locked_at != null)) { setHasLockedRows(true); setIsLocked(true) }
      }
      setLoading(false)
    }
    load()
  }, [])

  const locked = isLocked || hasLockedRows

  /* ---- Resolution logic (DO NOT TOUCH — verified working) ---- */
  const allStandings = useMemo(() => {
    const s: Record<string, ReturnType<typeof getGroupStandings>> = {}
    Object.keys(GROUPS).forEach(g => { s[g] = getGroupStandings(g, groupScores[g]) })
    return s
  }, [groupScores])

  const r32Teams = useMemo(() => {
    const pos: Record<string, { name: string; flag: string }> = {}
    Object.entries(allStandings).forEach(([g, st]) => {
      pos[`1${g}`] = { name: st[0].name, flag: st[0].flag }
      pos[`2${g}`] = { name: st[1].name, flag: st[1].flag }
    })
    const thirds = Object.entries(allStandings).map(([g, st]) => ({
      group: g, name: st[2].name, flag: st[2].flag,
      pts: st[2].pts, gd: st[2].gd, gf: st[2].gf,
    }))
    thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    const qualGroups = thirds.slice(0, 8).map(t => t.group)
    const thirdByGroup: Record<string, { name: string; flag: string }> = {}
    thirds.forEach(t => { thirdByGroup[t.group] = { name: t.name, flag: t.flag } })
    const assignment = assignThirdPlaceToSlots(qualGroups)
    const result: Record<number, { home: TeamInfo; away: TeamInfo }> = {}
    for (let mn = 73; mn <= 88; mn++) {
      const slot = R32_SLOTS[mn]
      const homeTeam = pos[slot.home] || null
      let awayTeam: TeamInfo = null
      if (slot.away.startsWith("3:")) {
        const ag = assignment[mn]; if (ag) awayTeam = thirdByGroup[ag] || null
      } else { awayTeam = pos[slot.away] || null }
      result[mn] = { home: homeTeam, away: awayTeam }
    }
    return result
  }, [allStandings])

  const resolvedKO = useMemo(() => {
    const teams: Record<number, { home: TeamInfo; away: TeamInfo }> = {}
    const teamByName = (name: string): TeamInfo => ALL_TEAMS.find(t => t.name === name) || null
    for (let mn = 73; mn <= 88; mn++) teams[mn] = r32Teams[mn]
    Object.entries(R16_SRC).forEach(([mn, [s1, s2]]) => {
      const n = Number(mn)
      teams[n] = { home: knockoutWinners[s1] ? teamByName(knockoutWinners[s1]) : null, away: knockoutWinners[s2] ? teamByName(knockoutWinners[s2]) : null }
    })
    Object.entries(QF_SRC).forEach(([mn, [s1, s2]]) => {
      const n = Number(mn)
      teams[n] = { home: knockoutWinners[s1] ? teamByName(knockoutWinners[s1]) : null, away: knockoutWinners[s2] ? teamByName(knockoutWinners[s2]) : null }
    })
    Object.entries(SF_SRC).forEach(([mn, [s1, s2]]) => {
      const n = Number(mn)
      teams[n] = { home: knockoutWinners[s1] ? teamByName(knockoutWinners[s1]) : null, away: knockoutWinners[s2] ? teamByName(knockoutWinners[s2]) : null }
    })
    const sf101 = teams[101]; const sf102 = teams[102]
    const loser1 = (sf101?.home && sf101?.away && knockoutWinners[101])
      ? (knockoutWinners[101] === sf101.home.name ? sf101.away : sf101.home) : null
    const loser2 = (sf102?.home && sf102?.away && knockoutWinners[102])
      ? (knockoutWinners[102] === sf102.home.name ? sf102.away : sf102.home) : null
    teams[THIRD_MATCH] = { home: loser1, away: loser2 }
    teams[FINAL_MATCH] = {
      home: knockoutWinners[FINAL_SRC[0]] ? teamByName(knockoutWinners[FINAL_SRC[0]]) : null,
      away: knockoutWinners[FINAL_SRC[1]] ? teamByName(knockoutWinners[FINAL_SRC[1]]) : null,
    }
    return teams
  }, [r32Teams, knockoutWinners])

  /* ---- Completion: fixed denominator of 104 ---- */
  const completion = useMemo(() => {
    const koDone = Object.keys(knockoutWinners).length
    const done = 72 + koDone  // all 72 group scores always count
    return { done, total: 104, pct: Math.round((done / 104) * 100) }
  }, [knockoutWinners])

  /* ---- BUILD PICKS: serializes from the REAL state ---- */
  function buildPicks() {
    const picks: any[] = []
    // ALL 72 group matches — 0-0 is a real pick
    Object.entries(groupScores).forEach(([gk, scores]) => {
      scores.forEach((s, mi) => {
        const matchId = groupMatchIds[`${gk}_${mi}`]
        if (matchId) picks.push({ match_id: matchId, predicted_home: s.hs, predicted_away: s.as })
      })
    })
    // All knockout winners
    Object.entries(knockoutWinners).forEach(([mnStr, winner]) => {
      const mn = Number(mnStr)
      const matchId = koMatchIds[mn]
      if (!matchId || !winner) return
      const row: any = { match_id: matchId, predicted_winner: winner }
      if (mn === FINAL_MATCH) row.predicted_champion = winner
      picks.push(row)
    })
    return picks
  }

  /* ---- Save / Submit: pass auth token, never blocked by completion ---- */
  const handleAction = async (action: "save" | "submit") => {
    if (locked) return
    const picks = buildPicks()
    if (picks.length === 0) { setStatusMsg("No picks to save"); return }
    action === "save" ? setSaving(true) : setSubmitting(true)
    setStatusMsg("")
    try {
      // Get the user's access token
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) { setStatusMsg("Not logged in"); setSaving(false); setSubmitting(false); return }

      const res = await fetch("/api/bracket-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action, picks }),
      })
      const data = await res.json()
      if (!res.ok) { setStatusMsg(data.error || `${action} failed`); return }
      if (action === "submit") setIsSubmitted(true)
      setStatusMsg(action === "save" ? `Draft saved (${data.count} picks)` : "Bracket submitted! You can edit and re-submit until lock.")
    } catch { setStatusMsg("Network error") }
    finally { setSaving(false); setSubmitting(false) }
  }

  const updateGroupScore = (group: string, mi: number, side: "hs" | "as", delta: number) => {
    if (locked) return
    setGroupScores(prev => {
      const newG = { ...prev }; const scores = [...newG[group]]
      scores[mi] = { ...scores[mi], [side]: Math.max(0, scores[mi][side] + delta) }
      newG[group] = scores; return newG
    })
  }

  const pickKnockoutWinner = (matchNum: number, team: string) => {
    if (locked) return
    setKnockoutWinners(prev => {
      const next = { ...prev }
      if (next[matchNum] === team) delete next[matchNum]; else next[matchNum] = team
      return next
    })
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050C0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.4rem", color: "#00C853", letterSpacing: "3px" }}>LOADING BRACKET...</div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#050C0A", fontFamily: "'Barlow', sans-serif", color: "#d0ead8" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,12,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: "1.4rem", color: "white", letterSpacing: "3px", textDecoration: "none" }}>WCFC<span style={{ color: "#00C853" }}>.</span></a>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {locked && <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.72rem", color: "#E53935", letterSpacing: "1px" }}>LOCKED</span>}
            {isSubmitted && !locked && <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.72rem", color: "#00C853", letterSpacing: "1px" }}>SUBMITTED</span>}
            <Link href="/picks" style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.8rem", color: "#5a8a68", textDecoration: "none" }}>&larr; Picks</Link>
          </div>
        </div>
        <div style={{ padding: "0 20px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.68rem", color: "#5a8a68", letterSpacing: "1px" }}>BRACKET COMPLETION</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "0.85rem", color: completion.pct === 100 ? "#00C853" : "#FFD600" }}>{completion.pct}% &mdash; {completion.done}/{completion.total} PICKS</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${completion.pct}%`, background: completion.pct === 100 ? "#00C853" : "#FFD600", borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "4px", padding: "0 16px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flexShrink: 0, padding: "6px 14px",
              background: activeTab === tab ? "#00C853" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeTab === tab ? "#00C853" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "16px", fontFamily: "'Barlow Condensed'", fontSize: "0.78rem", fontWeight: 700,
              color: activeTab === tab ? "#050C0A" : "#5a8a68", cursor: "pointer", letterSpacing: "1px",
            }}>{TAB_LABELS[tab]}</button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px 120px" }}>
        {locked && (
          <div style={{ background: "rgba(229,57,53,0.08)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.2rem" }}>&#128274;</span>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.88rem", color: "#E53935" }}>Picks locked &mdash; tournament has started.</div>
          </div>
        )}

        {/* GROUPS */}
        {activeTab === "groups" && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.75rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "6px" }}>GROUP STAGE</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.8rem", color: "white", letterSpacing: "2px", marginBottom: "8px" }}>Predict Every Score</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.85rem", color: "#5a8a68", marginBottom: "24px" }}>Scores determine group standings and auto-fill the R32 bracket. Exact score = 25pts.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: "16px" }}>
              {Object.entries(GROUPS).map(([gk, { teams }]) => {
                const scores = groupScores[gk]; const standings = allStandings[gk]
                return (
                  <div key={gk} style={{ background: "#0a1410", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1rem", color: "#FFD600", letterSpacing: "2px" }}>GROUP {gk}</div>
                    </div>
                    <div style={{ padding: "8px 14px", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {standings.slice(0, 2).map((t, i) => (
                          <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "0.7rem", color: i === 0 ? "#FFD600" : "#00C853" }}>{i === 0 ? "1st" : "2nd"}:</span>
                            <FlagImg code={t.flag} size={14} />
                            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.72rem", color: i === 0 ? "#FFD600" : "#00C853" }}>{t.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {GROUP_MATCH_PAIRS.map(([hi, ai], mi) => {
                        const home = teams[hi], away = teams[ai], s = scores[mi]
                        const isDraw = s.hs === s.as, homeWins = s.hs > s.as, awayWins = s.as > s.hs
                        return (
                          <div key={mi} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "6px", alignItems: "center", padding: "6px 4px", borderRadius: "6px", background: "rgba(255,255,255,0.01)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", background: homeWins ? "rgba(0,200,83,0.08)" : isDraw ? "rgba(255,214,0,0.05)" : "transparent", borderRadius: "5px", padding: "4px 6px" }}>
                              <FlagImg code={home.flag} size={18} />
                              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.78rem", fontWeight: 700, color: homeWins ? "#00C853" : "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{home.name}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: `1px solid ${homeWins ? "rgba(0,200,83,0.3)" : isDraw ? "rgba(255,214,0,0.25)" : "rgba(255,255,255,0.1)"}`, borderRadius: "5px", overflow: "hidden" }}>
                                <button onClick={() => updateGroupScore(gk, mi, "hs", -1)} disabled={locked} style={{ width: 20, height: 28, background: "none", border: "none", color: "#5a8a68", cursor: locked ? "default" : "pointer", fontSize: "0.9rem", fontWeight: 700 }}>&minus;</button>
                                <span style={{ fontFamily: "'Bebas Neue'", fontSize: "1.1rem", color: homeWins ? "#00C853" : isDraw ? "#FFD600" : "white", width: 22, textAlign: "center", lineHeight: "28px" }}>{s.hs}</span>
                                <button onClick={() => updateGroupScore(gk, mi, "hs", 1)} disabled={locked} style={{ width: 20, height: 28, background: "none", border: "none", color: "#5a8a68", cursor: locked ? "default" : "pointer", fontSize: "0.9rem", fontWeight: 700 }}>+</button>
                              </div>
                              <span style={{ fontFamily: "'Bebas Neue'", fontSize: "0.8rem", color: "rgba(255,255,255,0.2)" }}>-</span>
                              <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: `1px solid ${awayWins ? "rgba(229,57,53,0.3)" : isDraw ? "rgba(255,214,0,0.25)" : "rgba(255,255,255,0.1)"}`, borderRadius: "5px", overflow: "hidden" }}>
                                <button onClick={() => updateGroupScore(gk, mi, "as", -1)} disabled={locked} style={{ width: 20, height: 28, background: "none", border: "none", color: "#5a8a68", cursor: locked ? "default" : "pointer", fontSize: "0.9rem", fontWeight: 700 }}>&minus;</button>
                                <span style={{ fontFamily: "'Bebas Neue'", fontSize: "1.1rem", color: awayWins ? "#E53935" : isDraw ? "#FFD600" : "white", width: 22, textAlign: "center", lineHeight: "28px" }}>{s.as}</span>
                                <button onClick={() => updateGroupScore(gk, mi, "as", 1)} disabled={locked} style={{ width: 20, height: 28, background: "none", border: "none", color: "#5a8a68", cursor: locked ? "default" : "pointer", fontSize: "0.9rem", fontWeight: 700 }}>+</button>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "flex-end", background: awayWins ? "rgba(229,57,53,0.08)" : isDraw ? "rgba(255,214,0,0.05)" : "transparent", borderRadius: "5px", padding: "4px 6px" }}>
                              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.78rem", fontWeight: 700, color: awayWins ? "#E53935" : "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "right" }}>{away.name}</span>
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

        {/* KNOCKOUT: R32, R16, QF */}
        {(["r32","r16","qf"] as const).includes(activeTab as any) && (() => {
          const cfg: Record<string,{label:string;pts:string;range:[number,number]}> = {
            r32:{label:"Round of 32",pts:"3",range:[73,88]},
            r16:{label:"Round of 16",pts:"5",range:[89,96]},
            qf:{label:"Quarterfinals",pts:"8",range:[97,100]},
          }
          const c = cfg[activeTab]; if (!c) return null
          const nums: number[] = []; for (let i = c.range[0]; i <= c.range[1]; i++) nums.push(i)
          return (
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.75rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "6px" }}>{c.pts} PTS PER CORRECT PICK</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.8rem", color: "white", letterSpacing: "2px", marginBottom: "8px" }}>{c.label}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.82rem", color: "#5a8a68", marginBottom: "20px" }}>Teams are auto-filled from your predictions. Pick the winner.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "14px" }}>
                {nums.map(mn => <KOCard key={mn} mn={mn} label={`${activeTab.toUpperCase()} MATCH ${mn - c.range[0] + 1}`} teams={resolvedKO[mn]} picked={knockoutWinners[mn]||null} onPick={pickKnockoutWinner} locked={locked} />)}
              </div>
            </div>
          )
        })()}

        {/* SF / FINAL TAB */}
        {activeTab === "sf" && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.75rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "6px" }}>12 PTS PER CORRECT PICK</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.8rem", color: "white", letterSpacing: "2px", marginBottom: "16px" }}>Semifinals</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "14px", marginBottom: "32px" }}>
              {[101, 102].map(mn => <KOCard key={mn} mn={mn} label={`SEMIFINAL ${mn - 100}`} teams={resolvedKO[mn]} picked={knockoutWinners[mn]||null} onPick={pickKnockoutWinner} locked={locked} />)}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.75rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "6px" }}>5 PTS</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.4rem", color: "white", letterSpacing: "2px", marginBottom: "16px" }}>Third-Place Playoff</div>
            <div style={{ marginBottom: "32px" }}>
              <KOCard mn={THIRD_MATCH} label="3RD PLACE MATCH" teams={resolvedKO[THIRD_MATCH]} picked={knockoutWinners[THIRD_MATCH]||null} onPick={pickKnockoutWinner} locked={locked} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.75rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "6px" }}>50 PTS &mdash; PICK THE CHAMPION</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "1.8rem", color: "white", letterSpacing: "2px", marginBottom: "16px" }}>The Final</div>
            <KOCard mn={FINAL_MATCH} label="FINAL" teams={resolvedKO[FINAL_MATCH]} picked={knockoutWinners[FINAL_MATCH]||null} onPick={pickKnockoutWinner} locked={locked} highlight />
            {champion && (
              <div style={{ marginTop: "16px", textAlign: "center", padding: "16px", background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.25)", borderRadius: "12px" }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.72rem", color: "#FFD600", letterSpacing: "3px", marginBottom: "4px" }}>YOUR PREDICTED CHAMPION</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <FlagImg code={ALL_TEAMS.find(t => t.name === champion)?.flag || ""} size={24} />
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: "1.6rem", color: "#FFD600", letterSpacing: "2px" }}>{champion}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STICKY FOOTER */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(5,12,10,0.98) 30%)", padding: "20px 20px 16px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          {locked ? (
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.85rem", color: "#E53935", letterSpacing: "1px" }}>
              &#128274; BRACKET LOCKED &mdash; Tournament has started.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                <button onClick={() => handleAction("save")} disabled={saving || submitting} style={{
                  flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px", fontFamily: "'Bebas Neue'", fontSize: "1rem", letterSpacing: "2px",
                  color: "#8ab898", cursor: saving ? "default" : "pointer",
                }}>{saving ? "SAVING..." : "SAVE DRAFT"}</button>
                <button onClick={() => handleAction("submit")} disabled={saving || submitting} style={{
                  flex: 1, padding: "12px", background: "#00C853", border: "none",
                  borderRadius: "8px", fontFamily: "'Bebas Neue'", fontSize: "1rem", letterSpacing: "2px",
                  color: "#050C0A", cursor: submitting ? "default" : "pointer",
                }}>{submitting ? "SUBMITTING..." : isSubmitted ? "RE-SUBMIT" : "SUBMIT BRACKET"}</button>
              </div>
              {statusMsg && (
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.78rem", color: statusMsg.includes("fail") || statusMsg.includes("error") || statusMsg.includes("No picks") ? "#E53935" : "#00C853", marginBottom: "4px" }}>{statusMsg}</div>
              )}
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.68rem", color: "#3a5a42", letterSpacing: "1px" }}>
                Auto-submits June 11 at 12:00 PM CT &mdash; you can edit until then
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function KOCard({ mn, label, teams, picked, onPick, locked, highlight }: {
  mn: number; label: string; teams: { home: TeamInfo; away: TeamInfo } | undefined
  picked: string | null; onPick: (mn: number, team: string) => void; locked: boolean; highlight?: boolean
}) {
  const t = teams
  const borderColor = highlight
    ? (picked ? "rgba(255,214,0,0.4)" : "rgba(255,214,0,0.2)")
    : (picked ? "rgba(0,200,83,0.2)" : "rgba(255,255,255,0.07)")
  return (
    <div style={{ background: highlight ? "rgba(255,214,0,0.03)" : "#0a1410", border: `1px solid ${borderColor}`, borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Barlow Condensed'", fontSize: "0.72rem", color: highlight ? "#FFD600" : "#5a8a68", letterSpacing: "2px" }}>
        {label}
      </div>
      <div style={{ padding: "12px 14px" }}>
        {(!t?.home || !t?.away) ? (
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.82rem", color: "#3a5a42", textAlign: "center", padding: "16px 0" }}>
            Complete earlier rounds to reveal teams
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            {[t.home, t.away].map(team => {
              if (!team) return null
              const isSel = picked === team.name
              const selColor = highlight ? "#FFD600" : "#00C853"
              return (
                <button key={team.name} onClick={() => onPick(mn, team.name)} disabled={locked} style={{
                  flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px",
                  background: isSel ? (highlight ? "rgba(255,214,0,0.15)" : "rgba(0,200,83,0.15)") : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${isSel ? selColor : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "8px", cursor: locked ? "default" : "pointer", transition: "all 0.15s",
                }}>
                  <FlagImg code={team.flag} size={20} />
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: "0.85rem", fontWeight: 700, color: isSel ? selColor : "white" }}>{team.name}</span>
                  {isSel && <span style={{ marginLeft: "auto", color: selColor, fontSize: "0.9rem" }}>{"✓"}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
