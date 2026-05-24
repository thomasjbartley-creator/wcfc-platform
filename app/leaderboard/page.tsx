import Link from 'next/link'

export default function LeaderboardPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.97)', position: 'sticky', top: 0, zIndex: 50 }}>
 <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></Link>
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
 <Link href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#8ab898', textDecoration: 'none' }}>← Back</Link>
 <Link href="/auth/signup?plan=champion" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>JOIN — $10</Link>
 </div>
 </nav>

 <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>GLOBAL RANKINGS</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,7vw,5rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>Leaderboard<br /><span style={{ color: '#FFD600' }}>Goes Live June 11</span>
 </div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 48px' }}>The global leaderboard opens at kickoff. Rankings update after every match. Individual standings, country leaderboard, and weekly prize tracking — all live.
 </p>

 {/* PREVIEW CARDS */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px', marginBottom: '48px', textAlign: 'left' }}>
 {[
 { icon: '', title: 'Individual Leaderboard', desc: 'Every fan ranked globally by total points. Updated after each match.' },
 { icon: '', title: 'Country Leaderboard', desc: 'Average score per fan by country. Levels the playing field for smaller nations.' },
 { icon: '', title: 'Weekly Prize Tracker', desc: 'Top Plus and Premium fans each week. Cash prizes paid within 48 hours of week end.' },
 { icon: '', title: 'Champion Founders Wall', desc: 'Every founding member listed permanently. Your name in the history of this platform.' },
 ].map(c => (
 <div key={c.title} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
 <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{c.icon}</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{c.title}</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: 1.5 }}>{c.desc}</div>
 </div>
 ))}
 </div>

 {/* PLACEHOLDER TABLE */}
 <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', marginBottom: '40px' }}>
 <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px', gap: '12px' }}>
 {['RANK', 'FAN', 'COUNTRY', 'POINTS'].map(h => (
 <div key={h} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#5a8a68', letterSpacing: '2px', fontWeight: 700 }}>{h}</div>
 ))}
 </div>
 {[1,2,3,4,5].map(n => (
 <div key={n} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px', gap: '12px', alignItems: 'center', opacity: 0.25 }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: n <= 3 ? '#FFD600' : '#5a8a68' }}>#{n}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: 'white' }}>———</div>
 </div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#5a8a68' }}>——</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: '#00C853' }}>—</div>
 </div>
 ))}
 <div style={{ padding: '16px 20px', textAlign: 'center', fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', letterSpacing: '1px' }}>Rankings unlock at kickoff — June 11, 2026
 </div>
 </div>

 <Link href="/auth/signup?plan=champion" style={{ display: 'inline-block', padding: '16px 40px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none', marginBottom: '12px' }}>Get on the Leaderboard — $10
 </Link>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '8px' }}><Link href="/auth/signup" style={{ color: '#3a5a42' }}>Free entry available →</Link>
 </div>
 </div>
 </div>
 )
}
