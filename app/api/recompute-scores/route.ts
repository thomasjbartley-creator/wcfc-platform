import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { SCORING, scoreMatchPick, scoreGroupBracket, scoreKnockoutBracket } from '@/lib/scoring'
import type { GroupMatch } from '@/lib/standings'

// Force the route to run on every request (no cached/static response).
export const dynamic = 'force-dynamic'

/**
 * Idempotent score recompute.
 *
 * Scores every submitted bracket from the existing scoring engine (lib/scoring.ts —
 * the single source of truth; no point values are duplicated or changed here), writes
 * per-pick `points_earned`/`is_correct`, the authoritative per-user `points_total`, and
 * rebuilds `leaderboard_individual` with ranks. Safe to run anytime: it recomputes from
 * scratch every run and never increments on top of existing values.
 *
 * Powers the live group-stage standings now and the knockout game later, with no change
 * to scoring values.
 */

// --- Row shapes (only the columns we read) -------------------------------------------

interface MatchRow {
  id: string
  match_number: number
  stage: string
  group_name: string | null
  home_team: string
  away_team: string
  status: string
  home_score: number | null
  away_score: number | null
  shootout_winner: string | null
}

interface PickRow {
  id: string
  user_id: string
  match_id: string
  predicted_home: number | null
  predicted_away: number | null
  predicted_winner: string | null
  predicted_champion: string | null
}

interface ProfileRow {
  id: string
  username: string | null
  country_supported: string | null
  tier: string | null
  points_total: number | null
}

// --- Match helpers -------------------------------------------------------------------

/**
 * A match counts as finished when it has a terminal status and both scores set.
 *
 * NOTE / DEVIATION FROM BRIEF: the brief states a match is finished only when
 * `status = 'completed'`. Live data (verified) marks all played matches `status = 'finished'`,
 * and lib/scoring.ts itself treats 'finished' as the finished signal. We therefore accept
 * BOTH terminal statuses so the leaderboard actually populates regardless of which string is
 * used; a match is still only scored when both scores are present.
 */
function isFinished(m: MatchRow): boolean {
  const terminal = m.status === 'completed' || m.status === 'finished'
  return terminal && m.home_score !== null && m.away_score !== null
}

/**
 * Actual winner of a knockout match.
 *
 * NOTE: `shootout_winner` stores the side ('home' | 'away'), not a team name (verified live
 * + matches the admin update-match contract), so it is resolved to the corresponding team.
 * Falls back to the score line (knockouts cannot draw). Returns null if undecided.
 */
function knockoutWinner(m: MatchRow): string | null {
  if (!isFinished(m)) return null
  if (m.shootout_winner === 'home') return m.home_team
  if (m.shootout_winner === 'away') return m.away_team
  const h = m.home_score as number
  const a = m.away_score as number
  if (h > a) return m.home_team
  if (a > h) return m.away_team
  return null
}

/** Loser of a knockout match (used for the final's runner-up). */
function knockoutLoser(m: MatchRow): string | null {
  const w = knockoutWinner(m)
  if (w === null) return null
  return w === m.home_team ? m.away_team : m.home_team
}

/** Per-pick winner points for a knockout match number (matches SCORING.knockout ranges). */
function knockoutRoundPoints(matchNumber: number): number {
  if (matchNumber >= 73 && matchNumber <= 88) return SCORING.knockout.r32
  if (matchNumber >= 89 && matchNumber <= 96) return SCORING.knockout.r16
  if (matchNumber >= 97 && matchNumber <= 100) return SCORING.knockout.qf
  if (matchNumber >= 101 && matchNumber <= 102) return SCORING.knockout.sf
  return 0 // 103 (third place) and 104 (final) carry no per-pick winner points
}

// --- Core recompute ------------------------------------------------------------------

async function runRecompute(req: NextRequest) {
  // Protect with a secret so the public can't trigger a full recompute.
  // Vercel cron sends `Authorization: Bearer <CRON_SECRET>`; also accept `?secret=` for
  // manual runs.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    const querySecret = req.nextUrl.searchParams.get('secret')
    const ok = authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret
    if (!ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Hard requirement: this writes across many users' rows and must bypass RLS via the
  // service-role key. If it is missing, stop and report rather than work around it.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not set; cannot run recompute.' },
      { status: 500 }
    )
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  // 1. Load everything we need.
  const [matchesRes, picksRes, profilesRes, prevLbRes] = await Promise.all([
    admin
      .from('matches')
      .select('id, match_number, stage, group_name, home_team, away_team, status, home_score, away_score, shootout_winner'),
    admin
      .from('bracket_picks')
      .select('id, user_id, match_id, predicted_home, predicted_away, predicted_winner, predicted_champion'),
    admin.from('profiles').select('id, username, country_supported, tier, points_total'),
    admin.from('leaderboard_individual').select('user_id, rank'),
  ])

  for (const [label, res] of [
    ['matches', matchesRes],
    ['bracket_picks', picksRes],
    ['profiles', profilesRes],
    ['leaderboard_individual', prevLbRes],
  ] as const) {
    if (res.error) {
      console.error(`recompute: failed to load ${label}:`, res.error)
      return NextResponse.json({ error: `Failed to load ${label}` }, { status: 500 })
    }
  }

  const matches = (matchesRes.data ?? []) as MatchRow[]
  const picks = (picksRes.data ?? []) as PickRow[]
  const profiles = (profilesRes.data ?? []) as ProfileRow[]
  const prevRankByUser = new Map<string, number>()
  for (const r of (prevLbRes.data ?? []) as { user_id: string; rank: number | null }[]) {
    if (r.rank != null) prevRankByUser.set(r.user_id, r.rank)
  }

  const matchById = new Map<string, MatchRow>()
  for (const m of matches) matchById.set(m.id, m)
  const profileById = new Map<string, ProfileRow>()
  for (const p of profiles) profileById.set(p.id, p)

  // Pre-compute actual group / knockout facts once (shared by every user).
  const actualGroupMatches: GroupMatch[] = matches
    .filter((m) => m.match_number >= 1 && m.match_number <= 72)
    .map((m) => ({
      id: m.id,
      match_number: m.match_number,
      group_name: m.group_name ?? '',
      home_team: m.home_team,
      away_team: m.away_team,
      home_score: m.home_score,
      away_score: m.away_score,
      // Normalize the terminal status to the 'finished' signal the scoring engine expects.
      status: isFinished(m) ? 'finished' : m.status,
    }))

  const actualWinners: Record<number, string | null> = {}
  for (const m of matches) {
    if (m.match_number >= 73 && m.match_number <= 102) {
      actualWinners[m.match_number] = knockoutWinner(m)
    }
  }
  const finalMatch = matches.find((m) => m.match_number === 104)
  const actualChampion = finalMatch ? knockoutWinner(finalMatch) : null
  const actualRunnerUp = finalMatch ? knockoutLoser(finalMatch) : null

  // 2. Per-pick points + group up the picks by user.
  const pickUpdates: { id: string; user_id: string; match_id: string; points_earned: number; is_correct: boolean }[] = []
  const picksByUser = new Map<string, PickRow[]>()
  let picksScored = 0

  for (const pick of picks) {
    const arr = picksByUser.get(pick.user_id)
    if (arr) arr.push(pick)
    else picksByUser.set(pick.user_id, [pick])

    const m = matchById.get(pick.match_id)
    let points = 0
    if (m && isFinished(m)) {
      const n = m.match_number
      if (n >= 1 && n <= 72) {
        // Group match: full match-pick scoring (winner / margin / exact / draw).
        if (pick.predicted_home !== null && pick.predicted_away !== null) {
          points = scoreMatchPick(pick.predicted_home, pick.predicted_away, m.home_score as number, m.away_score as number)
        }
      } else if (n >= 73 && n <= 102) {
        // Knockout match: round winner points only when the predicted winner matches.
        const actual = knockoutWinner(m)
        if (actual !== null && pick.predicted_winner === actual) {
          points = knockoutRoundPoints(n)
        }
      }
      // n === 103 (third place) / n === 104 (final): no per-pick points; the final feeds the
      // champion bonus computed in the bracket total below.
    }

    if (points > 0) picksScored++
    pickUpdates.push({
      id: pick.id,
      user_id: pick.user_id,
      match_id: pick.match_id,
      points_earned: points,
      is_correct: points > 0,
    })
  }

  // 3. Per-user authoritative total via the bracket functions (per-pick rows exclude bonuses).
  interface UserTotal {
    user_id: string
    username: string | null
    country_supported: string | null
    tier: string | null
    points_total: number
  }
  const userTotals: UserTotal[] = []

  for (const [userId, userPicks] of picksByUser) {
    // Group bracket: predicted results carry the user's predicted scores, marked 'finished'
    // so the engine scores them against the real group matches.
    const predictedGroupMatches: GroupMatch[] = []
    const predictedWinners: Record<number, string> = {}
    let predictedChampion: string | null = null

    for (const pick of userPicks) {
      const m = matchById.get(pick.match_id)
      if (!m) continue
      const n = m.match_number
      if (n >= 1 && n <= 72) {
        if (pick.predicted_home !== null && pick.predicted_away !== null) {
          predictedGroupMatches.push({
            id: m.id,
            match_number: n,
            group_name: m.group_name ?? '',
            home_team: m.home_team,
            away_team: m.away_team,
            home_score: pick.predicted_home,
            away_score: pick.predicted_away,
            status: 'finished',
          })
        }
      } else if (n >= 73 && n <= 102) {
        if (pick.predicted_winner !== null) predictedWinners[n] = pick.predicted_winner
      }
      if (n === 104 && pick.predicted_champion !== null) {
        predictedChampion = pick.predicted_champion
      }
    }

    const groupTotal = scoreGroupBracket({
      predictedMatches: predictedGroupMatches,
      actualMatches: actualGroupMatches,
    }).total

    const knockoutTotal = scoreKnockoutBracket({
      predictedWinners,
      predictedChampion,
      // KNOWN GAP: there is no `predicted_runner_up` column yet, so runner-up points can never
      // be earned. Passing null yields 0 runner-up points. Revisit when the column is added.
      predictedRunnerUp: null,
      actualWinners,
      actualChampion,
      actualRunnerUp,
    }).total

    // HOOK: daily-game points and P3 bonuses are out of scope here. When added, fold them into
    // this same total (e.g. `+ dailyTotal + p3Bonus`) so the leaderboard stays the single sum.
    const pointsTotal = groupTotal + knockoutTotal

    const profile = profileById.get(userId)
    userTotals.push({
      user_id: userId,
      username: profile?.username ?? null,
      country_supported: profile?.country_supported ?? null,
      tier: profile?.tier ?? null,
      points_total: pointsTotal,
    })
  }

  // 4. Rank (dense rank: tied point totals share a rank, the next distinct total is +1).
  //    Stable, deterministic ordering: points desc, then username asc, then user_id asc.
  userTotals.sort((a, b) => {
    if (b.points_total !== a.points_total) return b.points_total - a.points_total
    const ua = a.username ?? ''
    const ub = b.username ?? ''
    if (ua !== ub) return ua < ub ? -1 : 1
    return a.user_id < b.user_id ? -1 : a.user_id > b.user_id ? 1 : 0
  })

  const leaderboardRows = userTotals.map((u) => ({ ...u, rank: 0 }))

  // Assign dense ranks (userTotals is already sorted by the comparator above).
  let denseRank = 0
  let lastPoints: number | null = null
  for (const row of leaderboardRows) {
    if (lastPoints === null || row.points_total !== lastPoints) {
      denseRank += 1
      lastPoints = row.points_total
    }
    row.rank = denseRank
  }

  // 5. Write everything.

  // 5a. Per-pick points (chunked upsert on the PK so reruns overwrite, never accumulate).
  for (let i = 0; i < pickUpdates.length; i += 500) {
    const chunk = pickUpdates.slice(i, i + 500)
    const { error } = await admin.from('bracket_picks').upsert(chunk, { onConflict: 'id' })
    if (error) {
      console.error('recompute: bracket_picks upsert failed:', error)
      return NextResponse.json({ error: 'Failed to write per-pick points' }, { status: 500 })
    }
  }

  // 5b. profiles.points_total per user.
  for (const u of userTotals) {
    const { error } = await admin
      .from('profiles')
      .update({ points_total: u.points_total })
      .eq('id', u.user_id)
    if (error) {
      console.error(`recompute: profiles update failed for ${u.user_id}:`, error)
      return NextResponse.json({ error: 'Failed to write profiles.points_total' }, { status: 500 })
    }
  }

  // 5c. Rebuild leaderboard_individual (upsert on user_id PK).
  const lbUpsert = leaderboardRows.map((row) => ({
    user_id: row.user_id,
    username: row.username,
    country_supported: row.country_supported,
    tier: row.tier,
    points_total: row.points_total,
    rank: row.rank,
    // rank_change: positive = moved up since the previous run; 0 if no previous rank.
    rank_change: prevRankByUser.has(row.user_id)
      ? (prevRankByUser.get(row.user_id) as number) - row.rank
      : 0,
    updated_at: now,
  }))

  if (lbUpsert.length > 0) {
    const { error } = await admin
      .from('leaderboard_individual')
      .upsert(lbUpsert, { onConflict: 'user_id' })
    if (error) {
      console.error('recompute: leaderboard upsert failed:', error)
      return NextResponse.json({ error: 'Failed to rebuild leaderboard' }, { status: 500 })
    }
  }

  const completedMatches = matches.filter(isFinished).length

  return NextResponse.json({
    success: true,
    ran_at: now,
    completed_matches: completedMatches,
    picks_processed: pickUpdates.length,
    picks_scored: picksScored, // picks that earned > 0 per-pick points
    profiles_updated: userTotals.length,
    leaderboard_rows: lbUpsert.length,
    top5: leaderboardRows.slice(0, 5).map((r) => ({
      username: r.username,
      points_total: r.points_total,
      rank: r.rank,
    })),
  })
}

// Vercel cron triggers via GET.
export async function GET(req: NextRequest) {
  return runRecompute(req)
}

// Manual trigger (curl/testing).
export async function POST(req: NextRequest) {
  return runRecompute(req)
}
