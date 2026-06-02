/**
 * R32 Advancement Engine.
 * Computes which teams advance from group stage to Round of 32.
 * - 12 group winners (rank 1) advance
 * - 12 group runners-up (rank 2) advance
 * - Best 8 of 12 third-place teams advance
 * - Third-place ranking: points -> GD -> GF (NO head-to-head, different groups)
 *
 * Pure functions, no DB writes.
 */

import { type GroupStandings, type TeamStanding } from './standings'

export interface ThirdPlaceTeam extends TeamStanding {
  qualified: boolean
  thirdRank: number
  tiebreakNeeded: boolean
}

export interface Qualifiers {
  winners: Map<string, TeamStanding>      // group letter -> winner
  runnersUp: Map<string, TeamStanding>    // group letter -> runner-up
  thirds: ThirdPlaceTeam[]                // all 12 third-place teams, ranked
  qualifiedThirds: ThirdPlaceTeam[]       // best 8
  eliminatedThirds: ThirdPlaceTeam[]      // worst 4
}

export interface R32Matchup {
  match_number: number
  home_slot: string
  away_slot: string
  home_team: string | null
  away_team: string | null
  home_cluster: string | null   // for 3rd-place slots, e.g. "ABCDF"
  away_cluster: string | null
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
    // Teams are already sorted by rank from standings engine
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

  // Assign third-place ranks (sequential)
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

  // Best 8 qualify (unless tiebreak needed at boundary)
  for (let i = 0; i < Math.min(8, thirds.length); i++) {
    thirds[i].qualified = true
  }

  const qualifiedThirds = thirds.filter(t => t.qualified)
  const eliminatedThirds = thirds.filter(t => !t.qualified)

  return { winners, runnersUp, thirds, qualifiedThirds, eliminatedThirds }
}

/**
 * Build 16 R32 matchups by resolving slot codes against standings.
 * Slot formats:
 *   '1X' -> winner of group X
 *   '2X' -> runner-up of group X
 *   '3:XXXXX' -> one of the qualified 3rd-place teams from groups X/X/X/X/X (TBD)
 */
export function buildR32(
  allStandings: GroupStandings[],
  r32Rows: Array<{ match_number: number; home_slot: string; away_slot: string }>
): R32Matchup[] {
  const qualifiers = getQualifiers(allStandings)

  function resolveSlot(slot: string): { team: string | null; cluster: string | null } {
    if (!slot) return { team: null, cluster: null }

    // '1X' format - group winner
    if (slot.length === 2 && slot[0] === '1') {
      const group = slot[1]
      const winner = qualifiers.winners.get(group)
      return { team: winner ? winner.team : null, cluster: null }
    }

    // '2X' format - group runner-up
    if (slot.length === 2 && slot[0] === '2') {
      const group = slot[1]
      const ru = qualifiers.runnersUp.get(group)
      return { team: ru ? ru.team : null, cluster: null }
    }

    // '3:XXXXX' format - third-place cluster
    if (slot.startsWith('3:')) {
      const cluster = slot.substring(2)
      return { team: null, cluster }
    }

    return { team: null, cluster: null }
  }

  return r32Rows.map(row => {
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
    }
  })
}
