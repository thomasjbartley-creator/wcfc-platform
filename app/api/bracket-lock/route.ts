import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { BRACKET_LOCK_UTC, isBracketLocked } from '@/lib/bracket-lock'

// Force the route to run on every request (no cached/static response)
export const dynamic = 'force-dynamic'

// Shared logic for both GET (Vercel cron) and POST (manual trigger).
async function runLock(req: NextRequest) {
  try {
    // Protect with a secret so only cron/admin can call this.
    // Vercel attaches `Authorization: Bearer <CRON_SECRET>` automatically.
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isBracketLocked()) {
      return NextResponse.json(
        { error: 'Lock time has not arrived yet.', lock_time: BRACKET_LOCK_UTC },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    const now = new Date().toISOString()

    // Step 1: auto-submit all drafts (submitted_at IS NULL). Never creates new rows.
    const { data: drafted, error: draftErr } = await admin
      .from('bracket_picks')
      .update({ submitted_at: now })
      .is('submitted_at', null)
      .select('id')
    if (draftErr) {
      console.error('Auto-submit drafts failed:', draftErr)
      return NextResponse.json({ error: 'Auto-submit failed' }, { status: 500 })
    }

    // Step 2: lock all rows not already locked.
    const { data: locked, error: lockErr } = await admin
      .from('bracket_picks')
      .update({ locked_at: now })
      .is('locked_at', null)
      .select('id')
    if (lockErr) {
      console.error('Lock all picks failed:', lockErr)
      return NextResponse.json({ error: 'Lock failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      lock_time: BRACKET_LOCK_UTC,
      drafts_auto_submitted: drafted?.length ?? 0,
      rows_locked: locked?.length ?? 0,
    })
  } catch (err) {
    console.error('Bracket lock error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Vercel cron triggers via GET.
export async function GET(req: NextRequest) {
  return runLock(req)
}

// Manual trigger (curl/testing).
export async function POST(req: NextRequest) {
  return runLock(req)
}
