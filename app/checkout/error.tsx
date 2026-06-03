'use client'

import { useEffect } from 'react'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Checkout error boundary caught:', error)
  }, [error])

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: '#d0ead8' }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
        Something interrupted checkout
      </h2>
      <p style={{ maxWidth: 440, marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Your payment was not affected. This can happen when a translation tool changes the page. Tap below to reload and try again.
      </p>
      <button
        onClick={() => reset()}
        style={{ background: '#00C853', color: '#04130B', border: 'none', borderRadius: 6, padding: '12px 22px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.95rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  )
}
