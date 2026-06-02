import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { BRACKET_LOCK_UTC, isBracketLocked } from '@/lib/bracket-lock'

/**
 * POST /api/bracket-lock
 * Auto-submit + lock job. Called at the lock time (via cron or manually).
 * Protected by CRON_SECRET env var.
 *
 * 1. Sets submitted_at = now() on all bracket_picks where submitted_at IS NULL
 *    (auto-submit drafts — only rows that already exist, never creates new ones)
 * 2. Sets locked_at = now() on ALL bracket_picks rows
 *
 * Uses BRACKET_LOCK_UTC from the shared constant — same source as the API guard.
 */
export async function POST(req: NextRequest) {
  try {
    // Protect with a secret so only cron/admin can call this
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isBracketLocked()) {
      return NextResponse.json({
        error: 'Lock time has not arrived yet.',
        lock_time: BRACKET_LOCK_UTC,
      }, { status: 400 })
    }

    const admin = createAdminClient()
    const now = new Date().toISOString()

    // Step 1: Auto-submit all drafts (submitted_at IS NULL)
    const { data: drafted, error: draftErr } = await admin
      .from('bracket_picks')
      .update({ submitted_at: now })
      .is('submitted_at', null)
      .select('id')

    if (draftErr) {
      console.error('Auto-submit drafts failed:', draftErr)
      return NextResponse.json({ error: 'Auto-submit failed' }, { status: 500 })
    }

    const draftsSubmitted = drafted?.length ?? 0
    console.log(`Bracket lock: auto-submitted ${draftsSubmitted} draft picks`)

    // Step 2: Lock ALL bracket_picks rows
    const { data: locked, error: lockErr } = await admin
      .from('bracket_picks')
      .update({ locked_at: now })
      .is('locked_at', null)
      .select('id')

    if (lockErr) {
      console.error('Lock all picks failed:', lockErr)
      return NextResponse.json({ error: 'Lock failed' }, { status: 500 })
    }

    const rowsLocked = locked?.length ?? 0
    console.log(`Bracket lock: locked ${rowsLocked} picks`)

    return NextResponse.json({
      success: true,
      lock_time: BRACKET_LOCK_UTC,
      drafts_auto_submitted: draftsSubmitted,
      rows_locked: rowsLocked,
    })

  } catch (err) {
    console.error('Bracket lock error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
