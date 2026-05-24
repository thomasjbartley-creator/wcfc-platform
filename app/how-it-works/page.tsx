import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works \u2014 WCFC',
  description: 'Learn how to play the World Cup Fan Challenge. Submit your bracket, make daily score picks, climb the leaderboard, and win real prizes.',
}

export default function HowItWorksPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.97)', position: 'sticky', top: 0, zIndex: 50 }}>
 <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></Link>
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
 <Link href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#8ab898', textDecoration: 'none' }}>← Back</Link>
 <Link href="/rules" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#8ab898', textDecoration: 'none' }}>Official Rules →</Link>
 <Link href="/auth/signup?plan=champion" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>JOIN — $10</Link>
 </div>
 </nav>

 <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 80px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>COMPLETE GUIDE</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '40px' }}>How It Works</div>

 {/* STEP 1 — SIGN UP */}
 <Section color="#FFD600" icon="1" title="Sign Up & Choose Your Tier">
 <p>Create a free account at worldcupfanchallenge.com. Choose the tier that works for you:</p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', margin: '16px 0' }}>
 {[
 { tier: ' Champion Founder', price: '$10', color: '#FFD600', perks: '$3/entry forever, +25 pts, Founding Wall, both books' },
 { tier: ' Premium', price: '$5', color: '#00C853', perks: '$500 grand prize, $100 weekly, full leaderboard' },
 { tier: ' Plus', price: '$3', color: '#4FC3F7', perks: 'Weekly prize eligible, full leaderboard' },
 { tier: 'Free', price: '$0', color: '#5a8a68', perks: 'Merch prizes only, no cash prizes' },
 ].map(t => (
 <div key={t.tier} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.color}30`, borderRadius: '10px', padding: '14px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', fontWeight: 700, color: t.color, marginBottom: '4px' }}>{t.tier} — {t.price}</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.78rem', color: '#5a8a68', lineHeight: 1.4 }}>{t.perks}</div>
 </div>
 ))}
 </div>
 <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68' }}>No purchase necessary to enter or win non-cash prizes.</p>
 </Section>

 {/* STEP 2 — BRACKET */}
 <Section color="#FFD600" icon="2" title="Fill Your Bracket Before June 11">
 <p>Predict scores for all 72 group stage matches and pick winners through every knockout round to the final. Your bracket locks automatically at 12pm CT on June 11 — 1 hour before the opening kickoff.</p>
 <div style={{ background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>BRACKET POINTS</div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
 {[['Exact score', '8 pts'], ['Correct draw', '5 pts'], ['Correct winner', '3 pts'], ['Goal difference', '2 pts'], ['Tournament champion', '15 pts'], ['Runner-up', '10 pts'], ['Semifinalists', '5 pts each']].map(([l, p]) => (
 <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem' }}>
 <span style={{ color: '#8ab898' }}>{l}</span>
 <span style={{ color: '#FFD600', fontWeight: 700 }}>{p}</span>
 </div>
 ))}
 </div>
 </div>
 <p>Auto-saves as you go. Come back and edit any time before the deadline.</p>
 </Section>

 {/* STEP 3 — DAILY PICKS */}
 <Section color="#00C853" icon="3" title="Make Daily Score Picks">
 <p>Every matchday, predict the exact score for each game. Picks lock at kickoff for each individual match — so you can submit picks right up until the whistle blows.</p>
 <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '2px', marginBottom: '10px' }}>DAILY BONUSES</div>
 {[['Daily streak (consecutive matchdays)', '+2 pts'], ['Underdog pick correct', '+3 pts'], ['Perfect matchday (all matches)', '+10 pts'], ['Daily point cap', '25 pts max'], ['Referral bonus', '+5 pts per signup']].map(([l, p]) => (
 <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', marginBottom: '6px' }}>
 <span style={{ color: '#8ab898' }}>{l}</span>
 <span style={{ color: '#00C853', fontWeight: 700 }}>{p}</span>
 </div>
 ))}
 </div>
 </Section>

 {/* STEP 4 — LEADERBOARD */}
 <Section color="#4FC3F7" icon="4" title="Climb the Leaderboard">
 <p>After every match, scores update and rankings shift. Two leaderboards run simultaneously:</p>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
 {[
 { title: ' Individual', desc: 'Every fan ranked globally. Premium fans compete for $500 grand prize. Plus fans compete for weekly prizes.' },
 { title: ' Country', desc: 'Average score per fan by country. Levels the playing field — a country with 10 fans can beat a country with 10,000.' },
 ].map(l => (
 <div key={l.title} style={{ background: 'rgba(79,195,247,0.05)', border: '1px solid rgba(79,195,247,0.15)', borderRadius: '10px', padding: '16px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.95rem', fontWeight: 700, color: '#4FC3F7', marginBottom: '6px' }}>{l.title}</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: 1.5 }}>{l.desc}</div>
 </div>
 ))}
 </div>
 </Section>

 {/* STEP 5 — REFERRALS */}
 <Section color="#FF9800" icon="5" title="Refer Friends — Earn Points">
 <p>Share your unique referral link. When a friend creates a paid account through your link, you earn +5 bonus points immediately. No limit on referrals.</p>
 <div style={{ background: 'rgba(255,152,0,0.06)', border: '1px solid rgba(255,152,0,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0', fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#FF9800' }}>
 1 referral = +5 pts &nbsp;·&nbsp; 10 referrals = +50 pts &nbsp;·&nbsp; 20 referrals = +100 pts
 </div>
 <p>Find your referral link on your dashboard after signing up.</p>
 </Section>

 {/* STEP 6 — FUND */}
 <Section color="#00C853" icon="6" title="The Grassroots Fútbol Fund">
 <p>Every Champion Founder membership includes a $2 donation to the Grassroots Fútbol Fund. Fans can also donate separately. Donors designate which country&apos;s youth programs receive their contribution.</p>
 <p>After the tournament ends (July 19), the fund distributes donations to approved youth fútbol projects. Fan voting determines which projects receive funding. Projects are published and impact is reported publicly.</p>
 <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', lineHeight: 1.6 }}>Phase 1: Now → July 19 — Youth clubs submit project proposals<br />Phase 2: July 19 → Aug 15 — Review and shortlist published<br />Phase 3: Aug 15 → Sep 1 — Fan backing + board selection<br />Phase 4: September 2026 — Funds awarded, impact published
 </div>
 </div>
 <p>501(c)(3) application in progress. Donations support youth soccer programs worldwide.</p>
 </Section>

 {/* CTA */}
 <div style={{ textAlign: 'center', marginTop: '48px', padding: '40px', background: 'linear-gradient(135deg,rgba(255,214,0,0.07),rgba(0,200,83,0.03))', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Ready to Play?</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginBottom: '24px' }}>June 11 bracket deadline · Free to enter · 18+ for cash prizes</div>
 <Link href="/auth/signup?plan=champion" style={{ display: 'inline-block', padding: '16px 40px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>Join as Champion Founder — $10
 </Link>
 <div style={{ marginTop: '12px' }}>
 <Link href="/rules" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#3a5a42', letterSpacing: '1px' }}>Read Official Rules →</Link>
 &nbsp;&middot;&nbsp;
 <Link href="/auth/signup" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#3a5a42', letterSpacing: '1px' }}>Free entry available →</Link>
 </div>
 </div>

 </div>
 </div>
 )
}

function Section({ color, icon, title, children }: { color: string; icon: string; title: string; children: React.ReactNode }) {
 return (
 <div style={{ marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
 <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color, flexShrink: 0 }}>{icon}</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px' }}>{title}</div>
 </div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.8, paddingLeft: '54px' }}>{children}</div>
 </div>
 )
}
