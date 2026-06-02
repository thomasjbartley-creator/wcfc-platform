/**
 * Scoring engine — single source of truth for all point values.
 * Mirrors the public /rules page exactly.
 *
 * Pure TypeScript, no DB, no JSX, no React.
 */

import { computeAllGroupStandings, type GroupMatch } from './standings'

export const SCORING = {
  match:    { winner: 10, draw: 12, marginBonus: 5, exact: 25 },
  group:    { winner: 3, runnerUp: 2 },
  knockout: { r32: 3, r16: 5, qf: 8, sf: 12, runnerUp: 25, champion: 50 },
  bonus:    { perfectMatchday: 20, underdog: 5, streakPerDay: 2,
              referralPerPaid: 2, referralDailyCap: 10, championFounderSignup: 25 },
} as const

/**
 * Score a single match pick against the actual result.
 *
 * Caller guarantees the match is finished and all four values are
 * non-negative integers.
 *
 * Tiered logic (non-stacking):
 *   exact score                          -> 25
 *   actual draw + predicted draw         -> 12
 *   actual draw + predicted non-draw     ->  0
 *   correct winner + exact margin        -> 15  (winner + marginBonus)
 *   correct winner only                  -> 10
 *   wrong side                           ->  0
 */
export function scoreMatchPick(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  const { winner, draw, marginBonus, exact } = SCORING.match

  // Exact score
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return exact
  }

  // Actual draw
  if (actualHome === actualAway) {
    if (predictedHome === predictedAway) return draw
    return 0
  }

  // Actual has a winner
  const predictedSide = predictedHome > predictedAway ? 'H'
                      : predictedAway > predictedHome ? 'A'
                      : 'D'
  const actualSide = actualHome > actualAway ? 'H' : 'A'

  if (predictedSide !== actualSide) return 0

  if ((predictedHome - predictedAway) === (actualHome - actualAway)) {
    return winner + marginBonus
  }

  return winner
}

/**
 * Score a user's knockout bracket picks against actual results.
 *
 * Does not score match 103 (third-place match — not in the ladder).
 * Never awards points when the actual value is null (undecided).
 */
export function scoreKnockoutBracket(input: {
  predictedWinners: Record<number, string>
  predictedChampion: string | null
  predictedRunnerUp: string | null
  actualWinners: Record<number, string | null>
  actualChampion: string | null
  actualRunnerUp: string | null
}): { r32: number; r16: number; qf: number; sf: number; champion: number; runnerUp: number; total: number } {
  const { predictedWinners, predictedChampion, predictedRunnerUp, actualWinners, actualChampion, actualRunnerUp } = input
  const ko = SCORING.knockout

  function sumRange(start: number, end: number, pts: number): number {
    let sum = 0
    for (let n = start; n <= end; n++) {
      const actual = actualWinners[n]
      if (actual != null && predictedWinners[n] === actual) sum += pts
    }
    return sum
  }

  const r32 = sumRange(73, 88, ko.r32)
  const r16 = sumRange(89, 96, ko.r16)
  const qf = sumRange(97, 100, ko.qf)
  const sf = sumRange(101, 102, ko.sf)
  const champion = (predictedChampion != null && actualChampion != null && predictedChampion === actualChampion) ? ko.champion : 0
  const runnerUp = (predictedRunnerUp != null && actualRunnerUp != null && predictedRunnerUp === actualRunnerUp) ? ko.runnerUp : 0
  const total = r32 + r16 + qf + sf + champion + runnerUp

  return { r32, r16, qf, sf, champion, runnerUp, total }
}

/**
 * Score a user's group-stage bracket: per-match score points
 * plus correct group winner (+3) / runner-up (+2) bonuses.
 *
 * predictedMatches: user's predicted group results (home_score/away_score = predicted, status 'finished').
 * actualMatches: the real group-stage matches from the DB.
 */
export function scoreGroupBracket(input: {
  predictedMatches: GroupMatch[]
  actualMatches: GroupMatch[]
}): { matchPoints: number; groupWinnerBonus: number; groupRunnerUpBonus: number; total: number } {
  const { predictedMatches, actualMatches } = input

  // Index actual matches by match_number
  const actualByNum = new Map<number, GroupMatch>()
  for (const a of actualMatches) actualByNum.set(a.match_number, a)

  // 1. Match points
  let matchPoints = 0
  for (const p of predictedMatches) {
    const a = actualByNum.get(p.match_number)
    if (!a) continue
    if (a.status !== 'finished') continue
    if (a.home_score === null || a.away_score === null) continue
    if (p.home_score === null || p.away_score === null) continue
    matchPoints += scoreMatchPick(p.home_score, p.away_score, a.home_score, a.away_score)
  }

  // 2. Group bonus
  const predictedStandings = computeAllGroupStandings(predictedMatches)
  const actualStandings = computeAllGroupStandings(actualMatches)

  // Index actual standings by group
  const actualByGroup = new Map<string, typeof actualStandings[0]>()
  for (const gs of actualStandings) actualByGroup.set(gs.group, gs)

  // Index predicted standings by group
  const predictedByGroup = new Map<string, typeof predictedStandings[0]>()
  for (const gs of predictedStandings) predictedByGroup.set(gs.group, gs)

  // Determine which groups are complete (all actual matches in that group are finished)
  const actualMatchesByGroup = new Map<string, GroupMatch[]>()
  for (const a of actualMatches) {
    if (!a.group_name) continue
    const arr = actualMatchesByGroup.get(a.group_name) || []
    arr.push(a)
    actualMatchesByGroup.set(a.group_name, arr)
  }

  let groupWinnerBonus = 0
  let groupRunnerUpBonus = 0

  for (const [groupName, groupMatches] of actualMatchesByGroup) {
    if (groupMatches.length === 0) continue
    const allFinished = groupMatches.every(m => m.status === 'finished' && m.home_score !== null && m.away_score !== null)
    if (!allFinished) continue

    const actualGs = actualByGroup.get(groupName)
    const predictedGs = predictedByGroup.get(groupName)
    if (!actualGs || !predictedGs) continue

    const actualWinner = actualGs.teams.find(t => t.rank === 1)
    const actualRunnerUp = actualGs.teams.find(t => t.rank === 2)
    const predictedWinner = predictedGs.teams.find(t => t.rank === 1)
    const predictedRunnerUp = predictedGs.teams.find(t => t.rank === 2)

    if (actualWinner && predictedWinner && actualWinner.team === predictedWinner.team) {
      groupWinnerBonus += SCORING.group.winner
    }
    if (actualRunnerUp && predictedRunnerUp && actualRunnerUp.team === predictedRunnerUp.team) {
      groupRunnerUpBonus += SCORING.group.runnerUp
    }
  }

  const total = matchPoints + groupWinnerBonus + groupRunnerUpBonus
  return { matchPoints, groupWinnerBonus, groupRunnerUpBonus, total }
}
