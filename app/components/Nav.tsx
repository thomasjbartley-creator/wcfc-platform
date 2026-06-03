'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'HOW IT WORKS', href: '/how-it-works' },
  { label: 'LEADERBOARD', href: '/leaderboard' },
  { label: 'FOR CLUBS', href: '/clubs' },
  { label: 'SPONSORS', href: '/sponsors' },
  { label: 'OUR STORY', href: '/about' },
  { label: 'EARN $$$', href: '/affiliate', gold: true },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const linkStyle = (gold?: boolean) => ({
    fontFamily: "'Barlow Condensed'" as const,
    fontSize: '0.82rem' as const,
    fontWeight: 700 as const,
    color: gold ? '#FFD600' : '#8ab898',
    letterSpacing: '1px' as const,
    textDecoration: 'none' as const,
    padding: '7px 10px' as const,
  })

  return (
    <>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(5,12,10,0.97)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </Link>

        {/* Desktop nav links — hidden at ≤768px */}
        <div className="wcfc-nav-desktop" style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle(l.gold)}>{l.label}</Link>
          ))}
          <div id="translate-widget-slot" style={{ display: 'inline-block' }} />
          <Link href="/auth/login" style={{ ...linkStyle(), padding: '7px 12px' }}>SIGN IN</Link>
          <a href="/checkout" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>
            JOIN — $10
          </a>
        </div>

        {/* Mobile: SIGN IN + JOIN + hamburger — shown at ≤768px */}
        <div className="wcfc-nav-mobile-ctas" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <div id="translate-widget-slot-mobile" style={{ display: 'inline-block' }} />
          <Link href="/auth/login" style={{ ...linkStyle(), padding: '7px 12px' }}>SIGN IN</Link>
          <a href="/checkout" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>
            JOIN — $10
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '5px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginLeft: '4px',
            }}
          >
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#8ab898', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#8ab898', transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#8ab898', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="wcfc-nav-mobile-dropdown" style={{
          display: 'none',
          flexDirection: 'column',
          background: 'rgba(5,12,10,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '8px 28px 16px',
          position: 'sticky',
          top: '52px',
          zIndex: 49,
        }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{ ...linkStyle(l.gold), padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .wcfc-nav-desktop { display: none !important; }
          .wcfc-nav-mobile-ctas { display: flex !important; }
          .wcfc-nav-mobile-dropdown { display: flex !important; }
        }
      `}</style>
    </>
  )
}
