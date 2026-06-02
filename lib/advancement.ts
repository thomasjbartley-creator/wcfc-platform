/**
 * Advancement Engine: R32 + Knockout (R16 -> Final).
 *
 * - R32: group winners, runners-up, best 8 thirds via Annex C
 * - Knockout: tree-map wiring R16->QF->SF->3rd/Final
 * - Winner rule: home_score > away_score -> home; tied -> shootout_winner; else undecided
 *
 * Pure functions, no DB writes, no JSX.
 */

import { type GroupStandings, type TeamStanding } from './standings'
import annexCData from './data/annex_c.json'

const annexC: Record<string, Record<string, string>> = annexCData

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface ThirdPlaceTeam extends TeamStanding {
  qualified: boolean
  thirdRank: number
  tiebreakNeeded: boolean
}

export interface Qualifiers {
  winners: Map<string, TeamStanding>
  runnersUp: Map<string, TeamStanding>
  thirds: ThirdPlaceTeam[]
  qualifiedThirds: ThirdPlaceTeam[]
  eliminatedThirds: ThirdPlaceTeam[]
}

export interface R32Matchup {
  match_number: number
  home_slot: string
  away_slot: string
  home_team: string | null
  away_team: string | null
  home_cluster: string | null
  away_cluster: string | null
  thirdsResolved: boolean
}

export interface KnockoutMatch {
  match_number: number
  stage: string
  home_team: string | null
  away_team: string | null
  home_score: number | null
  away_score: number | null
  shootout_winner: string | null
  winner: string | null
  loser: string | null
  decided: boolean
  home_source: string
  away_source: string
}

export interface KnockoutBracket {
  r32: R32Matchup[]
  r16: KnockoutMatch[]
  qf: KnockoutMatch[]
  sf: KnockoutMatch[]
  third: KnockoutMatch | null
  final: KnockoutMatch | null
  allMatches: KnockoutMatch[]
}

// ──────────────────────────────────────────────
// Authoritative tree map (from brief, encoded exactly)
// First in each pair = home, second = away
// ──────────────────────────────────────────────

type Feeder = { type: 'W' | 'L'; match: number }

interface TreeEntry {
  match_number: number
  stage: string
  home: Feeder
  away: Feeder
}

const KNOCKOUT_TREE: TreeEntry[] = [
  // R16
  { match_number: 89,  stage: 'r16',   home: { type: 'W', match: 74 },  away: { type: 'W', match: 77 } },
  { match_number: 90,  stage: 'r16',   home: { type: 'W', match: 73 },  away: { type: 'W', match: 75 } },
  { match_number: 91,  stage: 'r16',   home: { type: 'W', match: 76 },  away: { type: 'W', match: 78 } },
  { match_number: 92,  stage: 'r16',   home: { type: 'W', match: 79 },  away: { type: 'W', match: 80 } },
  { match_number: 93,  stage: 'r16',   home: { type: 'W', match: 83 },  away: { type: 'W', match: 84 } },
  { match_number: 94,  stage: 'r16',   home: { type: 'W', match: 81 },  away: { type: 'W', match: 82 } },
  { match_number: 95,  stage: 'r16',   home: { type: 'W', match: 86 },  away: { type: 'W', match: 88 } },
  { match_number: 96,  stage: 'r16',   home: { type: 'W', match: 85 },  away: { type: 'W', match: 87 } },
  // QF
  { match_number: 97,  stage: 'qf',    home: { type: 'W', match: 89 },  away: { type: 'W', match: 90 } },
  { match_number: 98,  stage: 'qf',    home: { type: 'W', match: 93 },  away: { type: 'W', match: 94 } },
  { match_number: 99,  stage: 'qf',    home: { type: 'W', match: 91 },  away: { type: 'W', match: 92 } },
  { match_number: 100, stage: 'qf',    home: { type: 'W', match: 95 },  away: { type: 'W', match: 96 } },
  // SF
  { match_number: 101, stage: 'sf',    home: { type: 'W', match: 97 },  away: { type: 'W', match: 98 } },
  { match_number: 102, stage: 'sf',    home: { type: 'W', match: 99 },  away: { type: 'W', match: 100 } },
  // 3rd place
  { match_number: 103, stage: 'third', home: { type: 'L', match: 101 }, away: { type: 'L', match: 102 } },
  // Final
  { match_number: 104, stage: 'final', home: { type: 'W', match: 101 }, away: { type: 'W', match: 102 } },
]

// ──────────────────────────────────────────────
// getQualifiers (unchanged from B1/B2a)
// ──────────────────────────────────────────────

export function getQualifiers(allStandings: GroupStandings[]): Qualifiers {
  const winners = new Map<string, TeamStanding>()
  const runnersUp = new Map<string, TeamStanding>()
  const thirdPlaceRaw: TeamStanding[] = []

  for (const gs of allStandings) {
    const sorted = [...gs.teams].sort((a, b) => a.rank - b.rank)
    if (sorted.length >= 1) winners.set(gs.group, sorted[0])
    if (sorted.length >= 2) runnersUp.set(gs.group, sorted[1])
    if (sorted.length >= 3) thirdPlaceRaw.push(sorted[2])
  }

  const thirds: ThirdPlaceTeam[] = thirdPlaceRaw.map(t => ({
    ...t,
    qualified: false,
    thirdRank: 0,
    tiebreakNeeded: false,
  }))

  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return 0
  })

  for (let i = 0; i < thirds.length; i++) {
    thirds[i].thirdRank = i + 1
  }

  if (thirds.length >= 9) {
    const eighth = thirds[7]
    const ninth = thirds[8]
    if (eighth.points === ninth.points && eighth.goalDifference === ninth.goalDifference && eighth.goalsFor === ninth.goalsFor) {
      eighth.tiebreakNeeded = true
      ninth.tiebreakNeeded = true
    }
  }

  for (let i = 0; i < Math.min(8, thirds.length); i++) {
    thirds[i].qualified = true
  }

  return {
    winners, runnersUp, thirds,
    qualifiedThirds: thirds.filter(t => t.qualified),
    eliminatedThirds: thirds.filter(t => !t.qualified),
  }
}

// ──────────────────────────────────────────────
// resolveThirdSlots (unchanged from B2a)
// ──────────────────────────────────────────────

export function resolveThirdSlots(
  matchups: R32Matchup[],
  qualifiers: Qualifiers,
  allStandings: GroupStandings[]
): R32Matchup[] {
  const qualGroups = qualifiers.qualifiedThirds.map(t => t.group)
  if (qualGroups.length !== 8) return matchups.map(m => ({ ...m, thirdsResolved: false }))
  if (qualifiers.thirds.some(t => t.tiebreakNeeded)) return matchups.map(m => ({ ...m, thirdsResolved: false }))

  const comboKey = qualGroups.slice().sort().join('')
  const mapping = annexC[comboKey]
  if (!mapping) return matchups.map(m => ({ ...m, thirdsResolved: false }))

  const thirdByGroup = new Map<string, string>()
  for (const gs of allStandings) {
    const sorted = [...gs.teams].sort((a, b) => a.rank - b.rank)
    if (sorted.length >= 3) thirdByGroup.set(gs.group, sorted[2].team)
  }

  return matchups.map(m => {
    if (!m.away_cluster && !m.home_cluster) return { ...m, thirdsResolved: true }
    const result = { ...m, thirdsResolved: true }
    if (m.away_cluster && mapping[m.home_slot]) {
      const g = mapping[m.home_slot]
      const team = thirdByGroup.get(g)
      if (team) { result.away_team = team; result.away_cluster = g }
    }
    if (m.home_cluster && mapping[m.away_slot]) {
      const g = mapping[m.away_slot]
      const team = thirdByGroup.get(g)
      if (team) { result.home_team = team; result.home_cluster = g }
    }
    return result
  })
}

// ──────────────────────────────────────────────
// buildR32 (unchanged from B2a)
// ──────────────────────────────────────────────

export function buildR32(
  allStandings: GroupStandings[],
  r32Rows: Array<{ match_number: number; home_slot: string; away_slot: string }>
): R32Matchup[] {
  const qualifiers = getQualifiers(allStandings)

  function resolveSlot(slot: string): { team: string | null; cluster: string | null } {
    if (!slot) return { team: null, cluster: null }
    if (slot.length === 2 && slot[0] === '1') {
      const w = qualifiers.winners.get(slot[1])
      return { team: w ? w.team : null, cluster: null }
    }
    if (slot.length === 2 && slot[0] === '2') {
      const r = qualifiers.runnersUp.get(slot[1])
      return { team: r ? r.team : null, cluster: null }
    }
    if (slot.startsWith('3:')) return { team: null, cluster: slot.substring(2) }
    return { team: null, cluster: null }
  }

  const base: R32Matchup[] = r32Rows.map(row => {
    const h = resolveSlot(row.home_slot)
    const a = resolveSlot(row.away_slot)
    return {
      match_number: row.match_number, home_slot: row.home_slot, away_slot: row.away_slot,
      home_team: h.team, away_team: a.team, home_cluster: h.cluster, away_cluster: a.cluster,
      thirdsResolved: false,
    }
  })

  return resolveThirdSlots(base, qualifiers, allStandings)
}

// ──────────────────────────────────────────────
// Knockout winner rule
// ──────────────────────────────────────────────

interface MatchRow {
  match_number: number
  stage: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  shootout_winner: string | null
  status: string
}

function getWinnerLoser(m: MatchRow): { winner: string | null; loser: string | null; decided: boolean } {
  if (m.home_score === null || m.away_score === null || m.status !== 'finished') {
    return { winner: null, loser: null, decided: false }
  }
  if (m.home_score > m.away_score) return { winner: m.home_team, loser: m.away_team, decided: true }
  if (m.away_score > m.home_score) return { winner: m.away_team, loser: m.home_team, decided: true }
  // Tied: need shootout_winner
  if (m.shootout_winner === 'home') return { winner: m.home_team, loser: m.away_team, decided: true }
  if (m.shootout_winner === 'away') return { winner: m.away_team, loser: m.home_team, decided: true }
  return { winner: null, loser: null, decided: false }
}

// ──────────────────────────────────────────────
// buildKnockout
// ──────────────────────────────────────────────

export function buildKnockout(
  allStandings: GroupStandings[],
  r32Rows: Array<{ match_number: number; home_slot: string; away_slot: string }>,
  knockoutRows: MatchRow[]
): KnockoutBracket {
  const r32 = buildR32(allStandings, r32Rows)

  // Index of decided results: match_number -> { winner, loser }
  const decided = new Map<number, { winner: string | null; loser: string | null; decided: boolean }>()

  // Seed R32 results from knockoutRows (matches 73-88 are R32 but results come from DB)
  const rowByNum = new Map<number, MatchRow>()
  for (const row of knockoutRows) rowByNum.set(row.match_number, row)

  // R32 matches: compute winners from the DB rows
  for (const m of r32) {
    const row = rowByNum.get(m.match_number)
    if (row && row.status === 'finished' && row.home_score !== null && row.away_score !== null) {
      // Use the resolved team names from buildR32, not TBD from DB
      const fakeRow: MatchRow = {
        ...row,
        home_team: m.home_team || row.home_team,
        away_team: m.away_team || row.away_team,
      }
      decided.set(m.match_number, getWinnerLoser(fakeRow))
    }
  }

  // Walk the tree in order, resolving each round
  const allKnockout: KnockoutMatch[] = []

  for (const entry of KNOCKOUT_TREE) {
    const homeFeeder = entry.home
    const awayFeeder = entry.away

    let homeTeam: string | null = null
    let awayTeam: string | null = null

    // Resolve home from feeder
    const homeSrc = decided.get(homeFeeder.match)
    if (homeSrc && homeSrc.decided) {
      homeTeam = homeFeeder.type === 'W' ? homeSrc.winner : homeSrc.loser
    }

    // Resolve away from feeder
    const awaySrc = decided.get(awayFeeder.match)
    if (awaySrc && awaySrc.decided) {
      awayTeam = awayFeeder.type === 'W' ? awaySrc.winner : awaySrc.loser
    }

    // Check if this match itself has a result in the DB
    const row = rowByNum.get(entry.match_number)
    let matchResult = { winner: null as string | null, loser: null as string | null, decided: false }

    if (row && row.status === 'finished' && homeTeam && awayTeam) {
      const fakeRow: MatchRow = { ...row, home_team: homeTeam, away_team: awayTeam }
      matchResult = getWinnerLoser(fakeRow)
    }

    // Store for downstream lookups
    decided.set(entry.match_number, matchResult)

    const km: KnockoutMatch = {
      match_number: entry.match_number,
      stage: entry.stage,
      home_team: homeTeam,
      away_team: awayTeam,
      home_score: row ? row.home_score : null,
      away_score: row ? row.away_score : null,
      shootout_winner: row ? row.shootout_winner : null,
      winner: matchResult.winner,
      loser: matchResult.loser,
      decided: matchResult.decided,
      home_source: homeFeeder.type + String(homeFeeder.match),
      away_source: awayFeeder.type + String(awayFeeder.match),
    }

    allKnockout.push(km)
  }

  return {
    r32,
    r16: allKnockout.filter(m => m.stage === 'r16'),
    qf: allKnockout.filter(m => m.stage === 'qf'),
    sf: allKnockout.filter(m => m.stage === 'sf'),
    third: allKnockout.find(m => m.stage === 'third') || null,
    final: allKnockout.find(m => m.stage === 'final') || null,
    allMatches: allKnockout,
  }
}
