'use client'
import { useState } from 'react'

export default function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const email = 'thomasjbartley' + '@' + 'worldcupfanchallenge.com'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
      <span style={{ fontFamily: "'Barlow'", fontSize: '0.82rem', color: '#8ab898', letterSpacing: '0.3px' }}>
        {email}
      </span>
      <button
        onClick={handleCopy}
        style={{
          background: copied ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.06)',
          border: copied ? '1px solid rgba(0,200,83,0.4)' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px',
          color: copied ? '#00C853' : '#8ab898',
          cursor: 'pointer',
          padding: '3px 10px',
          fontSize: '0.75rem',
          fontFamily: "'Barlow Condensed'",
          letterSpacing: '1px',
          transition: 'all 0.2s ease'
        }}
      >
        {copied ? '✓ COPIED' : 'COPY'}
      </button>
    </span>
  )
}
