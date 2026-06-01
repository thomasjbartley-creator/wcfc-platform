'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

/**
 * /ref/[code] — Affiliate referral landing page.
 * Stores the referral code in a cookie (30-day expiry) then redirects to homepage.
 * The cookie is read by /checkout and /auth/signup to credit the referral.
 */
export default function RefPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string || '').toUpperCase()

  useEffect(() => {
    if (code) {
      // Set a 30-day cookie with the referral code
      document.cookie = `wcfc_ref=${encodeURIComponent(code)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
    }
    // Redirect to homepage with ref param preserved for immediate use
    router.replace(`/?ref=${code}`)
  }, [code, router])

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif", color: '#8ab898' }}>
      Redirecting...
    </div>
  )
}
