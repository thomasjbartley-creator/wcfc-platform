import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050C0A',
      fontFamily: "'Barlow', sans-serif",
      color: '#d0ead8',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── STICKY NAV ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(5,12,10,0.97)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/auth/login" style={{
            fontFamily: "'Bebas Neue'",
            fontSize: '0.9rem',
            color: '#8ab898',
            letterSpacing: '2px',
            textDecoration: 'none',
            padding: '8px 18px',
          }}>SIGN IN</Link>
          <Link href="/auth/signup" style={{
            fontFamily: "'Bebas Neue'",
            fontSize: '0.9rem',
            color: '#050C0A',
            background: '#00C853',
            letterSpacing: '2px',
            textDecoration: 'none',
            padding: '8px 20px',
            borderRadius: '5px',
          }}>JOIN FREE →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 72px',
      }}>
        <div style={{
          display: 'inline-block',
          fontFamily: "'Barlow Condensed'",
          fontSize: '0.72rem',
          color: '#00C853',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          border: '1px solid rgba(0,200,83,0.3)',
          padding: '5px 14px',
          borderRadius: '20px',
          marginBottom: '24px',
        }}>
          ⚽ 2026 FIFA World Cup — June 11 Kickoff
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue'",
          fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
          color: 'white',
          letterSpacing: '3px',
          lineHeight: 1.05,
          marginBottom: '24px',
          maxWidth: '760px',
        }}>
          Pick Every Match.<br />
          <span style={{ color: '#00C853' }}>Win Real Prizes.</span>
        </h1>

        <p style={{
          fontFamily: "'Barlow Condensed'",
          fontSize: '1.2rem',
          color: '#8ab898',
          lineHeight: 1.7,
          maxWidth: '540px',
          marginBottom: '40px',
        }}>
          The global fan challenge for the 2026 World Cup. Submit your full bracket, make daily score picks, climb the leaderboard, and compete for $500 cash — free to enter.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
          <Link href="/auth/signup" style={{
            display: 'inline-block',
            padding: '18px 44px',
            background: '#00C853',
            color: '#050C0A',
            borderRadius: '6px',
            fontFamily: "'Bebas Neue'",
            fontSize: '1.2rem',
            letterSpacing: '3px',
            textDecoration: 'none',
          }}>
            JOIN FREE →
          </Link>
          <Link href="/auth/login" style={{
            display: 'inline-block',
            padding: '18px 44px',
            background: 'transparent',
            color: '#8ab898',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            fontFamily: "'Bebas Neue'",
            fontSize: '1.2rem',
            letterSpacing: '3px',
            textDecoration: 'none',
          }}>
            SIGN IN
          </Link>
        </div>

        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#3a5a42', letterSpacing: '1px' }}>
          ✓ Free to play &nbsp;·&nbsp; ✓ No purchase necessary &nbsp;·&nbsp; ✓ 18+ for cash prizes
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.02)',
      }}>
        {[
          { n: '104', label: 'Total Matches', sub: 'Groups through the final' },
          { n: '$500', label: 'Grand Prize', sub: 'Cash for top fan' },
          { n: '8', label: 'Pts Per Pick', sub: 'For exact score predictions' },
          { n: 'Jun 11', label: 'Bracket Deadline', sub: 'Lock in before kickoff' },
        ].map(s => (
          <div key={s.n} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#00C853', letterSpacing: '2px' }}>{s.n}</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: 'white', letterSpacing: '2px', marginTop: '2px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', marginTop: '3px' }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '72px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '4px', marginBottom: '10px' }}>HOW IT WORKS</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: 'white', letterSpacing: '2px' }}>THREE WAYS TO WIN POINTS</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            {
              step: '01',
              icon: '🏆',
              title: 'Submit Your Bracket',
              color: '#FFD600',
              desc: 'Predict winners for all 72 group stage matches plus the full knockout bracket — from Round of 32 to the Final. Lock in before June 11 kickoff.',
              cta: 'Go to Bracket →',
              href: '/auth/signup',
            },
            {
              step: '02',
              icon: '⚽',
              title: 'Daily Score Picks',
              color: '#00C853',
              desc: "Predict exact scores for each day's matches before kickoff. Nail the exact scoreline and earn 8 points. Build streaks for bonus points.",
              cta: 'Make Daily Picks →',
              href: '/auth/signup',
            },
            {
              step: '03',
              icon: '📲',
              title: 'Share & Go Viral',
              color: '#4FC3F7',
              desc: 'Generate animated pick cards for TikTok, Instagram, Facebook, X, and Snapchat. Show the world your predictions and earn referral bonus points.',
              cta: 'See Share Cards →',
              href: '/auth/signup',
            },
          ].map(card => (
            <div key={card.step} style={{
              background: '#0a1410',
              border: `1px solid ${card.color}22`,
              borderRadius: '14px',
              padding: '32px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.4rem' }}>{card.icon}</span>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: `${card.color}33`, letterSpacing: '2px' }}>{card.step}</span>
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: card.color, letterSpacing: '2px', marginBottom: '10px' }}>{card.title}</div>
              <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: '1.65', marginBottom: '24px' }}>{card.desc}</p>
              <Link href={card.href} style={{
                fontFamily: "'Bebas Neue'",
                fontSize: '0.85rem',
                color: card.color,
                letterSpacing: '2px',
                textDecoration: 'none',
                border: `1px solid ${card.color}44`,
                padding: '8px 18px',
                borderRadius: '5px',
                display: 'inline-block',
              }}>{card.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── POINTS LEGEND ── */}
      <section style={{
        background: '#0a1410',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '56px 24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '4px', marginBottom: '8px' }}>📊 SCORING SYSTEM</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white', letterSpacing: '2px' }}>HOW POINTS ARE EARNED</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' }}>
            {[
              { pts: '8 pts', label: 'Exact Score', color: '#FFD600' },
              { pts: '5 pts', label: 'Correct Draw', color: '#FF9800' },
              { pts: '3 pts', label: 'Correct Winner', color: '#00C853' },
              { pts: '2 pts', label: 'Goal Difference', color: '#4FC3F7' },
              { pts: '+3 pts', label: 'Underdog Pick', color: '#CE93D8' },
              { pts: '+2 pts', label: 'Daily Streak', color: '#00C853' },
              { pts: '15 pts', label: 'Champion Pick', color: '#FFD600' },
              { pts: '+5 pts', label: 'Referral Bonus', color: '#FF9800' },
            ].map(p => (
              <div key={p.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: p.color, minWidth: '50px' }}>{p.pts}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#8ab898' }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE SECTION ── */}
      <section style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '4px', marginBottom: '12px' }}>👑 PRIZES</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem, 6vw, 4rem)', color: 'white', letterSpacing: '3px', lineHeight: 1.05, marginBottom: '24px' }}>
            REAL CASH.<br /><span style={{ color: '#FFD600' }}>REAL PRIZES.</span>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.05rem', color: '#8ab898', lineHeight: '1.7', marginBottom: '40px' }}>
            Top fan on the global leaderboard wins $500 cash. Weekly top performers earn cash prizes too.
            Upgrade to Champion Founder for $10 to compete — free fans can play and earn points but can't claim cash.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{
              display: 'inline-block',
              padding: '18px 44px',
              background: '#00C853',
              color: '#050C0A',
              borderRadius: '6px',
              fontFamily: "'Bebas Neue'",
              fontSize: '1.15rem',
              letterSpacing: '3px',
              textDecoration: 'none',
            }}>
              JOIN FREE NOW →
            </Link>
            <a href="https://buy.stripe.com/5kQdR1bxS7iL0Nr1i9dfG03" style={{
              display: 'inline-block',
              padding: '18px 44px',
              background: 'rgba(255,214,0,0.12)',
              color: '#FFD600',
              border: '1px solid rgba(255,214,0,0.35)',
              borderRadius: '6px',
              fontFamily: "'Bebas Neue'",
              fontSize: '1.15rem',
              letterSpacing: '3px',
              textDecoration: 'none',
            }}>
              👑 GO CHAMPION — $10
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '32px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: 'white', letterSpacing: '3px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>Join Free</Link>
          <Link href="/auth/login" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>Sign In</Link>
          <Link href="/dashboard" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>Dashboard</Link>
          <Link href="/picks" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>My Picks</Link>
          <Link href="/picks/bracket" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>Bracket</Link>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '1px' }}>
          ✓ No purchase necessary to win &nbsp;·&nbsp; ✓ 18+ for cash prizes
        </div>
      </footer>
    </div>
  )
}
