import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

/**
 * POST /api/affiliate-apply
 * Creates a pending affiliate application row.
 * approved=false, is_active=false — owner reviews and approves manually.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, platform, audience, paypal } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Generate a unique affiliate code from the name
    const baseCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8)
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const code = `${baseCode || 'AFF'}${suffix}`

    const supabase = createAdminClient()

    // Check if email already applied
    const { data: existing } = await supabase
      .from('affiliates')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, note: 'Application already on file' })
    }

    const { error } = await supabase.from('affiliates').insert({
      name: name.trim(),
      email: normalizedEmail,
      code,
      platform: platform?.trim() || null,
      audience_size: audience?.trim() || null,
      paypal_email: paypal?.trim() || null,
      approved: false,
      is_active: false,
    })

    if (error) {
      console.error('Affiliate insert error:', error)
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
    }

    console.log(`Affiliate application saved: ${normalizedEmail} code=${code}`)
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Affiliate apply error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
