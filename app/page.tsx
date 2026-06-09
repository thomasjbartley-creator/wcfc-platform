import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'WCFC — World Cup Fan Challenge 2026',
  description: 'Play the World Cup. Fund the next generation. A free, skill-based bracket challenge for the 2026 FIFA World Cup.',
  alternates: {
    languages: {
      'pt-BR': 'https://worldcupfanchallenge.com/?lang=pt',
      'es-MX': 'https://worldcupfanchallenge.com/?lang=es',
      'x-default': 'https://worldcupfanchallenge.com',
    },
  },
}

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      <Nav />

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(60px,10vw,120px) 24px 60px', background: 'radial-gradient(ellipse at top, rgba(0,200,83,0.08) 0%, transparent 70%)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)', borderRadius: '20px', padding: '6px 16px', fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', fontWeight: 700, color: '#00C853', letterSpacing: '2px', marginBottom: '24px' }}>
          2026 FIFA WORLD CUP — JUNE 11 KICKOFF
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,7rem)', color: 'white', letterSpacing: '3px', lineHeight: 1, marginBottom: '8px' }}>
          PLAY THE WORLD CUP.
        </h1>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,7rem)', color: '#00C853', letterSpacing: '3px', lineHeight: 1, marginBottom: '28px' }}>
          FUND THE NEXT GENERATION.
        </h1>
        <p style={{ fontFamily: "'Barlow'", fontSize: 'clamp(1rem,2vw,1.2rem)', color: '#8ab898', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          A free, skill-based World Cup bracket built by a Houston youth coach. Every dollar donated goes to youth soccer.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Link href="/auth/signup" style={{ display: 'inline-block', padding: '18px 48px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none', boxShadow: '0 0 32px rgba(0,200,83,0.25)' }}>
            PLAY FREE
          </Link>
          <a href="/checkout" style={{ display: 'inline-block', padding: '15px 44px', background: 'rgba(255,214,0,0.12)', color: '#FFD600', border: '1px solid rgba(255,214,0,0.4)', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>
            DONATE
          </a>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#7a9988', letterSpacing: '1px', marginTop: '4px' }}>
            ✓ No purchase necessary to enter or win &nbsp;·&nbsp; ✓ Donating does not improve your chances
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: 'clamp(24px,6vw,80px)', flexWrap: 'wrap' }}>
        {[['104', 'Total Matches'], ['Free', 'Entry'], ['25 Pts', 'Per Exact Score'], ['Jun 11', 'Bracket Deadline']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#FFD600', letterSpacing: '2px' }}>{n}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#8ab898', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* NEW TO PICK'EM? */}
      <section style={{ padding: '48px 24px 0' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '28px 32px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '12px' }}>New to Pick&apos;em?</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '16px' }}>
            Before June 11 kickoff, you pick your tournament bracket and predict the result and score of every match. The closer your guesses, the more points you earn. Most points wins.
          </p>
          <Link href="/how-it-works" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#00C853', letterSpacing: '1px', textDecoration: 'none' }}>Full How It Works →</Link>
        </div>
      </section>

      {/* PREDICT EVERY MATCH */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg,rgba(255,214,0,0.05),rgba(0,200,83,0.02))' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>PREDICT EVERY MATCH</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
              Pick the result and score of every match.<br /><span style={{ color: '#FFD600' }}>Lock in your full tournament before June 11.</span>
            </div>
            <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '20px' }}>
              Predict scores for all 72 group matches. Pick winners through every knockout round to the final. Auto-saves as you go and locks in 1 hour before kickoff.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[['Exact score prediction', '25 pts'], ['Correct winner', '10 pts'], ['Pick the champion', '50 pts'], ['Perfect matchday bonus', '+20 pts']].map(([label, pts]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#d0ead8' }}>
                  <span style={{ color: '#00C853' }}>—</span><span style={{ flex: 1 }}>{label}</span><span style={{ color: '#FFD600', fontWeight: 700 }}>{pts}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ padding: '13px 24px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
                Play Free &amp; Fill Bracket
              </Link>
              <Link href="/picks/bracket" style={{ padding: '13px 20px', background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.25)', color: '#FFD600', fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
                Preview Bracket →
              </Link>
            </div>
          </div>
          {/* Bracket preview */}
          <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '12px' }}>TOURNAMENT PICK-EM BRACKET PREVIEW</div>
            {[['A','Mexico','S. Africa'],['B','Canada','Switzerland'],['C','Brazil','Morocco'],['D','USA','Paraguay'],['I','France','Senegal'],['J','Argentina','Algeria']].map(([g,h,a]) => (
              <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', marginBottom: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '7px' }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#8ab898', minWidth: '44px' }}>GRP {g}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: 'white', flex: 1 }}>{h}</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)' }}>vs</span>
                <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: 'white', flex: 1, textAlign: 'right' }}>{a}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>?</div>
                  <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>?</div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '10px', fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#7a9988', letterSpacing: '1px' }}>72 group matches + full knockout bracket</div>
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
            { n: '01', title: 'Predict Every Score', desc: 'Pick the result and score of every match. Closer guess = more points.' },
            { n: '02', title: 'Fill Your Tournament Bracket', desc: 'Bonus picks: pick winners through the knockout rounds. Lock in before June 11.' },
            { n: '03', title: 'Climb the Leaderboard', desc: 'Compete on the global individual leaderboard and the country leaderboard. The Champion wins a Thunder FC jersey, a custom WCFC Champion shirt, and permanent recognition.' },
          ].map(s => (
            <div key={s.n} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', opacity: 0.5 }}>{s.n}</span>
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>{s.title}</div>
              <p style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6 }}>{s.desc}</p>
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
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>PRIZES</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', marginBottom: '40px' }}>Free to Play. Real Recognition.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'Champion Prize', amt: 'Jersey + Shirt', tier: 'Thunder FC jersey + WCFC Champion shirt', color: '#FFD600' },
              { label: 'Recognition', amt: 'Badge + Wall', tier: 'Champion badge + Winners Wall', color: '#00C853' },
              { label: 'Country Title', amt: 'Best Fans', tier: '"Best World Cup Fans" country title', color: '#FF9800' },
            ].map(p => (
              <div key={p.label} style={{ background: '#0a1410', border: `1px solid ${p.color}30`, borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: p.color, letterSpacing: '1px', marginBottom: '8px' }}>{p.label}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: p.color, lineHeight: 1 }}>{p.amt}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#8ab898', marginTop: '6px', letterSpacing: '1px' }}>{p.tier}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '12px', padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Sponsor &amp; Donor Prizes</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '16px' }}>
              Additional prizes provided by sponsors and donors, announced throughout the tournament as they&apos;re confirmed. Help us grow the prize pool — every donation counts.
            </div>
            <a href="/checkout" style={{ display: 'inline-block', padding: '14px 36px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>
              DONATE →
            </a>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#7a9988', letterSpacing: '1px' }}>
            The World Cup Fan Challenge is free to play. No purchase or donation is necessary to enter or win. Donating does not improve your chances.
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>THE MISSION</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Built by a Coach. Powered by Fans.</div>
        <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.8, marginBottom: '28px' }}>
          This started with a youth team called Thunder FC. The World Cup Fan Challenge turns the world&apos;s biggest tournament into a way to fund kids&apos; soccer. Play the bracket free, and if you can, donate — every dollar goes to youth programs, and donations grow the champion&apos;s prize pool. No donation is required to play or to win.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ padding: '12px 24px', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)', color: '#00C853', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            OUR STORY →
          </Link>
          <a href="/checkout" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,214,0,0.3)', color: '#FFD600', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            DONATE TO YOUTH FÚTBOL
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '4px', marginBottom: '16px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[['Play Free', '/auth/signup'], ['Sign In', '/auth/login'], ['Leaderboard', '/leaderboard'], ['For Clubs', '/clubs'], ['Sponsors', '/sponsors'], ['Our Story', '/about'], ['Donate', '/checkout'], ['How It Works', '/how-it-works'], ['Rules', '/rules']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#8ab898', textDecoration: 'none', letterSpacing: '1px' }}>{label}</Link>
          ))}
        </div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#7a9988', letterSpacing: '1px', lineHeight: 1.8 }}>
          worldcupfanchallenge.com · Free to play · No purchase necessary to enter or win · Skill-based competition<br />
          © 2026 Bartex Enterprise Holdings LLC · Houston, TX
        </div>
      </footer>

    </div>
  )
}
