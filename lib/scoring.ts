/**
 * Scoring engine — single source of truth for all point values.
 * Mirrors the public /rules page exactly.
 *
 * Pure TypeScript, no DB, no JSX, no React.
 */

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
