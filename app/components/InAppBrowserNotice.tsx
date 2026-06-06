'use client'

import { useEffect, useState } from 'react'

// Detects common in-app browsers (Facebook, Instagram, TikTok / Bytedance,
// Android System WebView) where third-party sign-up and PayPal auth often
// fail silently. Real browsers (Safari, Chrome, Edge, Samsung) are NOT matched.
function detectInApp(ua: string): boolean {
  return /FBAN|FBAV|FB_IAB|Instagram|TikTok|BytedanceWebview|musical_ly|Bytedance|; wv/i.test(ua)
}

export default function InAppBrowserNotice() {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('https://worldcupfanchallenge.com/auth/signup')

  useEffect(() => {
    if (typeof navigator !== 'undefined' && detectInApp(navigator.userAgent)) {
      setShow(true)
    }
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [])

  if (!show) return null

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div style={{ width: '100%', background: '#1a1400', borderBottom: '2px solid #FFD600', padding: '14px 16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
        <button onClick={() => setShow(false)} aria-label="Dismiss" style={{ position: 'absolute', top: '-4px', right: '0', background: 'transparent', border: 'none', color: '#8ab898', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '1px', color: '#FFD600', marginBottom: '4px', paddingRight: '22px' }}>
          Open in your browser to sign up
        </div>
        <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#cfe3d6', lineHeight: 1.5, marginBottom: '10px' }}>
          Sign-up may not work inside this app. Tap the menu (⋯ or ⋮) at the top of your screen and choose &ldquo;Open in Browser,&rdquo; or copy the link below and paste it into Safari or Chrome.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <button onClick={copyLink} style={{ background: '#FFD600', color: '#050C0A', border: 'none', borderRadius: '6px', padding: '8px 16px', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '1px', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <span style={{ fontFamily: "'Barlow'", fontSize: '0.75rem', color: '#8ab898', wordBreak: 'break-all', userSelect: 'all' }}>{url}</span>
        </div>
      </div>
    </div>
  )
}
