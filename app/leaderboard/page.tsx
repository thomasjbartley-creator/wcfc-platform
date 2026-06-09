import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'Leaderboard \u2014 WCFC',
  description: 'See who leads the World Cup Fan Challenge. Global individual and country leaderboards updated after every match.',
}
export default function LeaderboardPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />
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
 { icon: '', title: 'Weekly Highlights', desc: 'Top fans each week. Best predictions highlighted and celebrated.' },
 { icon: '', title: 'Champion Founders Wall', desc: 'Every founding member listed permanently. Your name in the history of this platform.' },
 { icon: '', title: 'Sponsor Leaderboard', desc: 'Live now. Brands ranked by total commitment, refreshed as new sponsors join.' },
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
 {/* SPONSOR LEADERBOARD — LIVE NOW */}
 <div style={{ textAlign: 'left', marginBottom: '24px', marginTop: '60px' }}>
 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
 <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E53935', boxShadow: '0 0 8px #E53935' }} />
 <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#E53935', letterSpacing: '3px', fontWeight: 700 }}>LIVE NOW</span>
 </div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '12px' }}>Sponsor Leaderboard
 </div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.6, maxWidth: '640px', marginBottom: '0' }}>Brands ranked by total commitment to the Grassroots Fútbol Fund. Top of the board is reserved for the sponsors who show up first and biggest. The earlier you commit, the higher your starting position.</p>
 </div>
 <div style={{ background: '#0a1410', border: '1px solid rgba(229,57,53,0.2)', borderRadius: '14px', overflow: 'hidden', marginBottom: '40px' }}>
 <div style={{ padding: '14px 20px', background: 'rgba(229,57,53,0.04)', borderBottom: '1px solid rgba(229,57,53,0.1)', display: 'grid', gridTemplateColumns: '48px 1fr 100px 100px', gap: '12px' }}>
 {['RANK', 'SPONSOR', 'TIER', 'COMMITMENT'].map(h => (
 <div key={h} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#E53935', letterSpacing: '2px', fontWeight: 700 }}>{h}</div>
 ))}
 </div>
 {[1,2,3,4,5].map(n => (
 <div key={n} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '48px 1fr 100px 100px', gap: '12px', alignItems: 'center' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: n <= 3 ? '#FFD600' : '#5a8a68' }}>#{n}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)' }} />
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', fontStyle: 'italic' }}>Open — be first</div>
 </div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#3a5a42' }}>—</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.95rem', color: '#3a5a42' }}>—</div>
 </div>
 ))}
 <div style={{ padding: '16px 20px', textAlign: 'center' }}>
 <Link href="/sponsors" style={{ display: 'inline-block', padding: '10px 24px', background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)', color: '#E53935', fontFamily: "'Bebas Neue'", fontSize: '0.85rem', letterSpacing: '2px', borderRadius: '5px', textDecoration: 'none' }}>CLAIM A SPOT →</Link>
 </div>
 </div>
 <Link href="/auth/signup" style={{ display: 'inline-block', padding: '16px 40px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none', marginBottom: '12px' }}>PLAY FREE
 </Link>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '8px' }}>Free to play · No purchase necessary to enter or win
 </div>
 </div>
 </div>
 )
}
