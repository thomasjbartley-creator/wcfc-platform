/**
 * Group standings engine.
 * Computes per-team stats from finished group matches and ranks by FIFA rules:
 *   1. Points (W=3, D=1, L=0)
 *   2. Goal difference
 *   3. Goals scored
 *   4. Head-to-head (points -> GD -> goals scored among tied teams only)
 *   5. If still tied -> flag "tiebreak needed" (fair-play cards not captured)
 */

export interface GroupMatch {
  id: string
  match_number: number
  group_name: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  status: string
}

export interface TeamStanding {
  team: string
  group: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  rank: number
  tiebreakNeeded: boolean
}

export interface GroupStandings {
  group: string
  teams: TeamStanding[]
  hasTiebreak: boolean
}

/** Compute standings for a single group from its finished matches */
export function computeGroupStandings(groupName: string, matches: GroupMatch[]): GroupStandings {
  const finishedMatches = matches.filter(
    (m) => m.status === 'finished' && m.home_score !== null && m.away_score !== null
  )

  // Collect unique teams from ALL matches in the group (not just finished)
  const teamNames = new Set<string>()
  for (const m of matches) {
    teamNames.add(m.home_team)
    teamNames.add(m.away_team)
  }

  // Initialize stats
  const stats = new Map<string, TeamStanding>()
  for (const team of teamNames) {
    stats.set(team, {
      team,
      group: groupName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      rank: 0,
      tiebreakNeeded: false,
    })
  }

  // Accumulate from finished matches
  for (const m of finishedMatches) {
    const home = stats.get(m.home_team)
    const away = stats.get(m.away_team)
    if (!home || !away) continue
    const hs = m.home_score as number
    const as_ = m.away_score as number

    home.played++
    away.played++
    home.goalsFor += hs
    home.goalsAgainst += as_
    away.goalsFor += as_
    away.goalsAgainst += hs

    if (hs > as_) {
      home.won++
      home.points += 3
      away.lost++
    } else if (hs < as_) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points += 1
      away.points += 1
    }
  }

  // Update goal difference
  for (const t of stats.values()) {
    t.goalDifference = t.goalsFor - t.goalsAgainst
  }

  // Sort and rank
  let teams = Array.from(stats.values())
  teams = rankTeams(teams, finishedMatches)

  return {
    group: groupName,
    teams,
    hasTiebreak: teams.some((t) => t.tiebreakNeeded),
  }
}

/** Rank teams by FIFA group-stage rules */
function rankTeams(teams: TeamStanding[], matches: GroupMatch[]): TeamStanding[] {
  // Primary sort: points -> GD -> GF
  teams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return 0
  })

  // Detect ties and resolve with head-to-head
  let i = 0
  while (i < teams.length) {
    let j = i + 1
    while (
      j < teams.length &&
      teams[j].points === teams[i].points &&
      teams[j].goalDifference === teams[i].goalDifference &&
      teams[j].goalsFor === teams[i].goalsFor
    ) {
      j++
    }

    if (j - i > 1) {
      const tiedSlice = teams.slice(i, j)
      const resolved = resolveHeadToHead(tiedSlice, matches)
      for (let k = 0; k < resolved.length; k++) {
        teams[i + k] = resolved[k]
      }
    }

    i = j
  }

  // Final pass: assign distinct sequential ranks based on sorted position
  for (let k = 0; k < teams.length; k++) {
    teams[k].rank = k + 1
  }

  return teams
}

/** Resolve a tie using head-to-head records among the tied teams */
function resolveHeadToHead(tied: TeamStanding[], allMatches: GroupMatch[]): TeamStanding[] {
  if (tied.length <= 1) return tied

  const tiedNames = new Set(tied.map((t) => t.team))

  // Compute mini-table from only matches between the tied teams
  const h2hStats = new Map<string, { pts: number; gd: number; gf: number }>()
  for (const t of tied) {
    h2hStats.set(t.team, { pts: 0, gd: 0, gf: 0 })
  }

  const h2hMatches = allMatches.filter(
    (m) =>
      m.status === 'finished' &&
      m.home_score !== null &&
      tiedNames.has(m.home_team) &&
      tiedNames.has(m.away_team)
  )

  for (const m of h2hMatches) {
    const home = h2hStats.get(m.home_team)
    const away = h2hStats.get(m.away_team)
    if (!home || !away) continue
    const hs = m.home_score as number
    const as_ = m.away_score as number

    home.gf += hs
    home.gd += hs - as_
    away.gf += as_
    away.gd += as_ - hs

    if (hs > as_) {
      home.pts += 3
    } else if (hs < as_) {
      away.pts += 3
    } else {
      home.pts += 1
      away.pts += 1
    }
  }

  // Sort by H2H: points -> GD -> GF
  tied.sort((a, b) => {
    const ha = h2hStats.get(a.team)
    const hb = h2hStats.get(b.team)
    if (!ha || !hb) return 0
    if (hb.pts !== ha.pts) return hb.pts - ha.pts
    if (hb.gd !== ha.gd) return hb.gd - ha.gd
    if (hb.gf !== ha.gf) return hb.gf - ha.gf
    return 0
  })

  // Check if H2H resolved or if teams are still tied
  for (let i = 0; i < tied.length - 1; i++) {
    const ha = h2hStats.get(tied[i].team)
    const hb = h2hStats.get(tied[i + 1].team)
    if (!ha || !hb) continue
    if (ha.pts === hb.pts && ha.gd === hb.gd && ha.gf === hb.gf) {
      tied[i].tiebreakNeeded = true
      tied[i + 1].tiebreakNeeded = true
    }
  }

  return tied
}

/** Compute standings for ALL groups */
export function computeAllGroupStandings(matches: GroupMatch[]): GroupStandings[] {
  const byGroup = new Map<string, GroupMatch[]>()
  for (const m of matches) {
    if (!m.group_name) continue
    const arr = byGroup.get(m.group_name) || []
    arr.push(m)
    byGroup.set(m.group_name, arr)
  }

  const standings: GroupStandings[] = []
  const groups = Array.from(byGroup.keys()).sort()
  for (const g of groups) {
    const groupMatches = byGroup.get(g)
    if (groupMatches) {
      standings.push(computeGroupStandings(g, groupMatches))
    }
  }

  return standings
}
