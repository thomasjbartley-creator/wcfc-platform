import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// TODO: Replace with a proper admin role check when roles are implemented
const OWNER_EMAIL = 'thomas@bartleytechaisolutions.com'

export async function POST(req: NextRequest) {
  try {
    const { matchId, homeScore, awayScore, status, shootoutWinner, userEmail } = await req.json()

    if (!matchId || !userEmail) {
      return NextResponse.json({ error: 'Missing matchId or userEmail' }, { status: 400 })
    }

    if (userEmail.toLowerCase() !== OWNER_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const adminClient = createAdminClient()

    const updateFields: Record<string, any> = {}
    if (homeScore !== undefined && homeScore !== null) updateFields.home_score = homeScore
    if (awayScore !== undefined && awayScore !== null) updateFields.away_score = awayScore
    if (status) updateFields.status = status
    // shootoutWinner can be 'home', 'away', or null (to clear it)
    if (shootoutWinner !== undefined) updateFields.shootout_winner = shootoutWinner

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { error } = await adminClient
      .from('matches')
      .update(updateFields)
      .eq('id', matchId)

    if (error) {
      console.error('Match update error:', error)
      return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
    }

    console.log('Match ' + matchId + ' updated: ' + JSON.stringify(updateFields) + ' by ' + userEmail)
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Admin update-match error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
