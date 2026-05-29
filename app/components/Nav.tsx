import Link from 'next/link'
import GoogleTranslate from '@/components/GoogleTranslate'

export default function Nav() {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.97)', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: '8px' }}>
      <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>
        WCFC<span style={{ color: '#00C853' }}>.</span>
      </Link>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/leaderboard" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 10px' }}>LEADERBOARD</Link>
        <Link href="/clubs" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 10px' }}>FOR CLUBS</Link>
        <Link href="/sponsors" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 10px' }}>SPONSORS</Link>
        <Link href="/about" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 10px' }}>OUR STORY</Link>
        <Link href="/affiliate" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#FFD600', letterSpacing: '1px', textDecoration: 'none', padding: '7px 10px' }}>EARN $$$</Link>
        <GoogleTranslate />
        <Link href="/auth/login" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>SIGN IN</Link>
        <Link href="/auth/signup?plan=champion" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>
          JOIN — $10
        </Link>
      </div>
    </nav>
  )
}
