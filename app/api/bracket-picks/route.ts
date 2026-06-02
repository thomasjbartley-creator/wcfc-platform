import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase'
import { isBracketLocked } from '@/lib/bracket-lock'

/**
 * POST /api/bracket-picks
 * Save or submit bracket picks.
 *
 * Body: {
 *   action: 'save' | 'submit',
 *   picks: Array<{
 *     match_id: string,
 *     predicted_home?: number | null,
 *     predicted_away?: number | null,
 *     predicted_winner?: string | null,
 *     predicted_champion?: string | null,
 *   }>
 * }
 *
 * Save:   upserts with submitted_at = NULL (draft)
 * Submit: upserts with submitted_at = now()
 * Both rejected if bracket is locked.
 */
export async function POST(req: NextRequest) {
  try {
    // --- Auth ---
    const supabase = createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // --- Lock guard (server-side, cannot be bypassed) ---
    if (isBracketLocked()) {
      return NextResponse.json(
        { error: 'Bracket is locked. Picks can no longer be saved or submitted.' },
        { status: 403 }
      )
    }

    const { action, picks } = await req.json()

    if (!action || !['save', 'submit'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "save" or "submit".' }, { status: 400 })
    }

    if (!Array.isArray(picks) || picks.length === 0) {
      return NextResponse.json({ error: 'No picks provided.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const now = new Date().toISOString()

    // Build upsert rows
    const rows = picks.map((p: any) => ({
      user_id: user.id,
      match_id: p.match_id,
      predicted_home: p.predicted_home ?? null,
      predicted_away: p.predicted_away ?? null,
      predicted_winner: p.predicted_winner ?? null,
      predicted_champion: p.predicted_champion ?? null,
      submitted_at: action === 'submit' ? now : null,
    }))

    const { error: upsertErr } = await admin
      .from('bracket_picks')
      .upsert(rows, { onConflict: 'user_id,match_id' })

    if (upsertErr) {
      console.error('Bracket picks upsert failed:', upsertErr)
      return NextResponse.json({ error: 'Failed to save picks.' }, { status: 500 })
    }

    console.log(`Bracket ${action}: user=${user.id} picks=${rows.length}`)
    return NextResponse.json({ success: true, action, count: rows.length })

  } catch (err) {
    console.error('Bracket picks error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
