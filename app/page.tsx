import Link from 'next/link'
import TranslateButton from './TranslateButton'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
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
          <Link href="/auth/login" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>SIGN IN</Link>
          <TranslateButton />
          <Link href="/auth/signup?plan=champion" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>
            👑 JOIN — $10
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(60px,10vw,120px) 24px 60px', background: 'radial-gradient(ellipse at top, rgba(0,200,83,0.08) 0%, transparent 70%)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)', borderRadius: '20px', padding: '6px 16px', fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', fontWeight: 700, color: '#00C853', letterSpacing: '2px', marginBottom: '24px' }}>
          ⚽ 2026 FIFA WORLD CUP — JUNE 11 KICKOFF
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,7rem)', color: 'white', letterSpacing: '3px', lineHeight: 1, marginBottom: '8px' }}>
          PICK EVERY MATCH.
        </h1>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,7rem)', color: '#00C853', letterSpacing: '3px', lineHeight: 1, marginBottom: '28px' }}>
          WIN REAL PRIZES.
        </h1>
        <p style={{ fontFamily: "'Barlow'", fontSize: 'clamp(1rem,2vw,1.2rem)', color: '#8ab898', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          The global fan challenge for the 2026 World Cup. Submit your full bracket, make daily score picks, climb the leaderboard, and compete for $500 cash.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Link href="/auth/signup?plan=champion" style={{ display: 'inline-block', padding: '18px 48px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none', boxShadow: '0 0 32px rgba(255,214,0,0.25)' }}>
            👑 JOIN AS CHAMPION FOUNDER — $10
          </Link>
          <Link href="/auth/signup?plan=premium" style={{ display: 'inline-block', padding: '13px 36px', background: 'rgba(0,200,83,0.12)', color: '#00C853', border: '1.5px solid rgba(0,200,83,0.35)', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            💎 PREMIUM ENTRY — $5
          </Link>
          <Link href="/shop" style={{ display: 'inline-block', padding: '10px 28px', background: 'transparent', color: '#5a8a68', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none', textTransform: 'uppercase' }}>
            📚 Books &amp; Donations →
          </Link>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '4px' }}>
            ✓ No purchase necessary to enter or win &nbsp;·&nbsp; ✓ 18+ for cash prizes &nbsp;·&nbsp;
            <Link href="/auth/signup" style={{ color: '#3a5a42', textDecoration: 'underline' }}>Free entry available</Link>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: 'clamp(24px,6vw,80px)', flexWrap: 'wrap' }}>
        {[['104', 'Total Matches'], ['$500', 'Grand Prize'], ['8 Pts', 'Per Exact Score'], ['Jun 11', 'Bracket Deadline']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#FFD600', letterSpacing: '2px' }}>{n}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* BRACKET CHALLENGE */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg,rgba(255,214,0,0.05),rgba(0,200,83,0.02))' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>🏆 FILL YOUR BRACKET NOW</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
              Predict Every Match.<br /><span style={{ color: '#FFD600' }}>Lock In Before June 11.</span>
            </div>
            <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '20px' }}>
              Predict scores for all 72 group matches. Pick winners through every knockout round to the final. Auto-saves as you go and locks in 1 hour before kickoff.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[['⭐', 'Exact score prediction', '8 pts'], ['🎯', 'Correct winner', '3 pts'], ['🏆', 'Pick the champion', '15 pts'], ['📅', 'Daily picks cap', '25 pts/day']].map(([icon, label, pts]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#d0ead8' }}>
                  <span>{icon}</span><span style={{ flex: 1 }}>{label}</span><span style={{ color: '#FFD600', fontWeight: 700 }}>{pts}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/auth/signup?plan=champion" style={{ padding: '13px 24px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
                👑 Join &amp; Fill Bracket — $10
              </Link>
              <Link href="/picks/bracket" style={{ padding: '13px 20px', background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.25)', color: '#FFD600', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
                Preview Bracket →
              </Link>
            </div>
          </div>
          {/* Bracket preview */}
          <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '12px' }}>BRACKET PREVIEW</div>
            {[['A','Mexico','S. Africa'],['B','Canada','Switzerland'],['C','Brazil','Morocco'],['D','USA','Paraguay'],['I','France','Senegal'],['J','Argentina','Algeria']].map(([g,h,a]) => (
              <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', marginBottom: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '7px' }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68', minWidth: '44px' }}>GRP {g}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: 'white', flex: 1 }}>{h}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>vs</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: 'white', flex: 1, textAlign: 'right' }}>{a}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>?</div>
                  <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>?</div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '10px', fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#3a5a42', letterSpacing: '1px' }}>72 group matches + full knockout bracket</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>HOW IT WORKS</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px' }}>Three Steps to Compete</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { n: '01', icon: '📋', title: 'Submit Your Bracket', desc: 'Predict scores for all 72 group matches and pick winners through the knockout rounds. Lock in before June 11.' },
            { n: '02', icon: '⚽', title: 'Daily Score Picks', desc: 'Predict exact scores for every match before kickoff. Up to 8 points for an exact score. Streak bonuses for consecutive days.' },
            { n: '03', icon: '🏆', title: 'Climb the Leaderboard', desc: 'Compete on the global individual leaderboard and the country leaderboard. Premium fans compete for $500 grand prize.' },
          ].map(s => (
            <div key={s.n} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: '#00C853', opacity: 0.5 }}>{s.n}</span>
                <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>{s.title}</div>
              <p style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link href="/how-it-works" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#00C853', letterSpacing: '1px' }}>Read the full guide →</Link>
        </div>
      </section>

      {/* PRIZES */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,214,0,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>💰 PRIZES</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', marginBottom: '40px' }}>Real Cash. Fixed Amounts.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: '👑 Grand Prize', amt: '$500', tier: 'Premium', color: '#FFD600' },
              { label: '💎 Weekly Prize', amt: '$100', tier: 'Premium', color: '#00C853' },
              { label: '⚡ Weekly Prize', amt: '$50', tier: 'Plus', color: '#4FC3F7' },
              { label: '🌍 Country Prize', amt: 'Trophy', tier: 'All tiers', color: '#FF9800' },
            ].map(p => (
              <div key={p.label} style={{ background: '#0a1410', border: `1px solid ${p.color}30`, borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: p.color, letterSpacing: '1px', marginBottom: '8px' }}>{p.label}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.5rem', color: p.color, lineHeight: 1 }}>{p.amt}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', marginTop: '6px', letterSpacing: '1px' }}>{p.tier}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '12px', padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>👑 Champion Founder — $10</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '16px' }}>
              One-time founding membership. Locks in $3/entry forever. +25 bonus points. Both activity books free (digital). Name on the Founding Wall. Includes $2 donation to youth fútbol. Price increases at June 11 kickoff.
            </div>
            <Link href="/auth/signup?plan=champion" style={{ display: 'inline-block', padding: '14px 36px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>
              JOIN AS CHAMPION FOUNDER →
            </Link>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px' }}>
            All cash prizes are fixed amounts funded by the platform operator — not pooled from entry fees. No purchase necessary to enter or win non-cash prizes.
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>🌱 THE MISSION</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Built by a Coach. Powered by Fans.</div>
        <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.8, marginBottom: '28px' }}>
          Founded by a Houston Navy veteran and youth soccer coach who spent 20+ years coaching YMCA kids for free. The Grassroots Fútbol Fund channels fan donations directly to youth soccer programs worldwide. This is the Thunder FC mission going global.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ padding: '12px 24px', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)', color: '#00C853', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            OUR STORY →
          </Link>
          <Link href="/shop" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#5a8a68', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            🌱 DONATE TO YOUTH FÚTBOL
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '4px', marginBottom: '16px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[['Join Free', '/auth/signup'], ['Sign In', '/auth/login'], ['Leaderboard', '/leaderboard'], ['For Clubs', '/clubs'], ['Sponsors', '/sponsors'], ['Our Story', '/about'], ['Earn $$$', '/affiliate'], ['Shop', '/shop'], ['How It Works', '/how-it-works'], ['Rules', '/rules']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px', lineHeight: 1.8 }}>
          worldcupfanchallenge.com · No purchase necessary to enter or win non-cash prizes · Skill-based competition · 18+ for cash prizes<br />
          © 2026 Bartex Enterprise Holdings LLC · Houston, TX
        </div>
      </footer>

    </div>
  )
}
