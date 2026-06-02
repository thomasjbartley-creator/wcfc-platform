import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// TODO: Replace with proper admin role when roles are implemented
const OWNER_EMAIL = 'thomas@bartleytechaisolutions.com'

/**
 * GET /api/admin/matches?email=...
 * Returns all group-stage matches via service-role client (bypasses RLS).
 * Gated to owner email.
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')

  if (!email || email.toLowerCase() !== OWNER_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('matches')
    .select('id, match_number, group_name, home_team, away_team, home_score, away_score, status')
    .eq('stage', 'group')
    .order('group_name')
    .order('match_number')

  if (error) {
    console.error('Admin matches fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }

  return NextResponse.json({ matches: data })
}
