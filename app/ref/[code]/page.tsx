'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * /ref/[code] -- Referral landing page.
 *
 * AFFILIATE PROGRAM PAUSED — see brief.
 * Affiliate referral links now redirect straight to the homepage with no
 * cookie set and no code captured. Fan referral codes still work via the
 * signup flow (?ref= param), but this route no longer sets a cookie.
 *
 * Original code preserved in comments below for re-enablement.
 */
export default function RefPage() {
  const router = useRouter()

  useEffect(() => {
    // No tracking cookie, no affiliate code capture — just go home.
    router.replace('/')
  }, [router])

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif", color: '#8ab898' }}>
      Redirecting...
    </div>
  )
}

/* ── ORIGINAL /ref/[code] — PAUSED ────────────────────────────────
import { useParams } from 'next/navigation'

function _OriginalRefPage_PAUSED() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string || '').toUpperCase()

  useEffect(() => {
    if (code) {
      document.cookie = `wcfc_ref=${encodeURIComponent(code)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
    }
    router.replace(`/checkout?ref=${code}`)
  }, [code, router])

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif", color: '#8ab898' }}>
      Redirecting...
    </div>
  )
}
── END PAUSED BLOCK ──────────────────────────────────────────── */
