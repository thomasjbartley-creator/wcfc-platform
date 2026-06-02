/**
 * R32 Advancement Engine.
 * Computes which teams advance from group stage to Round of 32.
 * - 12 group winners (rank 1) advance
 * - 12 group runners-up (rank 2) advance
 * - Best 8 of 12 third-place teams advance
 * - Third-place ranking: points -> GD -> GF (NO head-to-head, different groups)
 *
 * resolveThirdSlots uses FIFA Annex C table to assign each qualifying
 * third-place team to a specific R32 match slot.
 *
 * Pure functions, no DB writes.
 */

import { type GroupStandings, type TeamStanding } from './standings'
import annexCData from './data/annex_c.json'

const annexC: Record<string, Record<string, string>> = annexCData

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

/**
 * From 12 group standings, extract winners, runners-up, and rank third-place teams.
 * Best 8 thirds are flagged qualified.
 */
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

  // Rank third-place teams: points -> GD -> GF (no head-to-head across groups)
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

  // Check for tiebreak at the 8th/9th boundary
  if (thirds.length >= 9) {
    const eighth = thirds[7]
    const ninth = thirds[8]
    if (
      eighth.points === ninth.points &&
      eighth.goalDifference === ninth.goalDifference &&
      eighth.goalsFor === ninth.goalsFor
    ) {
      eighth.tiebreakNeeded = true
      ninth.tiebreakNeeded = true
    }
  }

  for (let i = 0; i < Math.min(8, thirds.length); i++) {
    thirds[i].qualified = true
  }

  const qualifiedThirds = thirds.filter(t => t.qualified)
  const eliminatedThirds = thirds.filter(t => !t.qualified)

  return { winners, runnersUp, thirds, qualifiedThirds, eliminatedThirds }
}

/**
 * Resolve the 8 third-place cluster slots using FIFA Annex C.
 * Returns the R32 matchups with away_team filled for third-place slots.
 *
 * If exactly 8 thirds are resolved and the combo key exists in Annex C,
 * each third-slot match gets its away_team assigned.
 * Otherwise returns matchups unchanged with thirdsResolved=false.
 */
export function resolveThirdSlots(
  matchups: R32Matchup[],
  qualifiers: Qualifiers,
  allStandings: GroupStandings[]
): R32Matchup[] {
  // Collect the 8 qualifying group letters
  const qualGroups = qualifiers.qualifiedThirds.map(t => t.group)
  if (qualGroups.length !== 8) {
    // Not enough resolved thirds
    return matchups.map(m => ({ ...m, thirdsResolved: false }))
  }

  // Check if any tiebreak is unresolved at the boundary
  if (qualifiers.thirds.some(t => t.tiebreakNeeded)) {
    return matchups.map(m => ({ ...m, thirdsResolved: false }))
  }

  const comboKey = qualGroups.slice().sort().join('')
  const mapping = annexC[comboKey]
  if (!mapping) {
    // No Annex C entry for this combination
    return matchups.map(m => ({ ...m, thirdsResolved: false }))
  }

  // Build a lookup: group letter -> third-place team name
  const thirdByGroup = new Map<string, string>()
  for (const gs of allStandings) {
    const sorted = [...gs.teams].sort((a, b) => a.rank - b.rank)
    if (sorted.length >= 3) {
      thirdByGroup.set(gs.group, sorted[2].team)
    }
  }

  // Apply: for each matchup that has a 3:cluster away_slot, resolve using Annex C
  return matchups.map(m => {
    if (!m.away_cluster && !m.home_cluster) {
      // Not a third-place slot
      return { ...m, thirdsResolved: true }
    }

    const result = { ...m, thirdsResolved: true }

    // Check if this match's home_slot has an Annex C mapping
    if (m.away_cluster && mapping[m.home_slot]) {
      const assignedGroup = mapping[m.home_slot]
      const team = thirdByGroup.get(assignedGroup)
      if (team) {
        result.away_team = team
        result.away_cluster = assignedGroup
      }
    }

    // Same for home_cluster (unlikely in current data but future-proof)
    if (m.home_cluster && mapping[m.away_slot]) {
      const assignedGroup = mapping[m.away_slot]
      const team = thirdByGroup.get(assignedGroup)
      if (team) {
        result.home_team = team
        result.home_cluster = assignedGroup
      }
    }

    return result
  })
}

/**
 * Build 16 R32 matchups by resolving slot codes against standings.
 * Then applies Annex C third-place resolution.
 * Slot formats:
 *   '1X' -> winner of group X
 *   '2X' -> runner-up of group X
 *   '3:XXXXX' -> resolved via Annex C to a specific third-place team
 */
export function buildR32(
  allStandings: GroupStandings[],
  r32Rows: Array<{ match_number: number; home_slot: string; away_slot: string }>
): R32Matchup[] {
  const qualifiers = getQualifiers(allStandings)

  function resolveSlot(slot: string): { team: string | null; cluster: string | null } {
    if (!slot) return { team: null, cluster: null }

    if (slot.length === 2 && slot[0] === '1') {
      const group = slot[1]
      const winner = qualifiers.winners.get(group)
      return { team: winner ? winner.team : null, cluster: null }
    }

    if (slot.length === 2 && slot[0] === '2') {
      const group = slot[1]
      const ru = qualifiers.runnersUp.get(group)
      return { team: ru ? ru.team : null, cluster: null }
    }

    if (slot.startsWith('3:')) {
      const cluster = slot.substring(2)
      return { team: null, cluster }
    }

    return { team: null, cluster: null }
  }

  const baseMatchups: R32Matchup[] = r32Rows.map(row => {
    const home = resolveSlot(row.home_slot)
    const away = resolveSlot(row.away_slot)

    return {
      match_number: row.match_number,
      home_slot: row.home_slot,
      away_slot: row.away_slot,
      home_team: home.team,
      away_team: away.team,
      home_cluster: home.cluster,
      away_cluster: away.cluster,
      thirdsResolved: false,
    }
  })

  // Apply Annex C resolution
  return resolveThirdSlots(baseMatchups, qualifiers, allStandings)
}
