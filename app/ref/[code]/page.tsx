'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

/**
 * /ref/[code] -- Referral landing page (fan OR affiliate).
 * Stores the referral code in a cookie (30-day expiry) then redirects to checkout.
 * The cookie is read by /checkout and /api/capture-order to credit the referral.
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
    // Redirect to checkout with ref param preserved for immediate use
    router.replace(`/checkout?ref=${code}`)
  }, [code, router])

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif", color: '#8ab898' }}>
      Redirecting...
    </div>
  )
}
