import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050C0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '3.5rem', color: 'white', letterSpacing: '8px', lineHeight: 1 }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '4px' }}>
          World Cup Fan Challenge
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: '580px', marginBottom: '48px' }}>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: 'white', letterSpacing: '3px', lineHeight: 1.1, marginBottom: '20px' }}>
          Pick Every Match.<br />
          <span style={{ color: '#00C853' }}>Win Real Prizes.</span>
        </h1>
        <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.15rem', color: '#8ab898', lineHeight: 1.6 }}>
          The global fan challenge for the 2026 World Cup. Make your picks, climb the leaderboard, and compete for cash and prizes — free to play.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
        <Link href="/auth/signup" style={{ display: 'inline-block', padding: '16px 36px', background: '#00C853', color: '#050C0A', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', textDecoration: 'none' }}>
          JOIN FREE →
        </Link>
        <Link href="/auth/login" style={{ display: 'inline-block', padding: '16px 36px', background: 'transparent', color: '#8ab898', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', textDecoration: 'none' }}>
          SIGN IN
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px', maxWidth: '600px' }}>
        {[
          { icon: '⚽', label: '104 Matches', sub: 'Every game, groups to final' },
          { icon: '🏆', label: 'Cash Prizes', sub: 'For top ranked fans' },
          { icon: '🌍', label: 'Global League', sub: 'Fans from every nation' },
        ].map(f => (
          <div key={f.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{f.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: 'white', letterSpacing: '2px' }}>{f.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', marginTop: '2px' }}>{f.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '48px', fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px', textAlign: 'center' }}>
        ✓ No purchase necessary to win  ·  ✓ Skill-based competition  ·  ✓ 18+ for cash prizes
      </div>
    </div>
  )
}
