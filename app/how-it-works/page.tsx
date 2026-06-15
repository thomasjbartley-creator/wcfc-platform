import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'How It Works \u2014 WCFC',
  description: 'Learn how to play the World Cup Fan Challenge. Free to play. Submit your bracket, make daily score picks, and climb the leaderboard.',
}

export default function HowItWorksPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />

 <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 80px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>COMPLETE GUIDE</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '40px' }}>How It Works</div>

 {/* STEP 1 — SIGN UP */}
 <Section color="#FFD600" icon="1" title="Sign Up — Free">
 <p>Create a free account at worldcupfanchallenge.com. Every player gets full access to the bracket, daily picks, and the global leaderboard. No purchase necessary — the entire competition is free.</p>
 <p>The Champion wins an official Thunder FC jersey and a custom WCFC Champion shirt, earns the Champion badge, and is named on the Winners Wall. Additional prizes from sponsors and donors are announced throughout the tournament.</p>
 <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68' }}>No purchase or donation necessary to enter or win. Donating does not improve your chances.</p>
 </Section>

 {/* STEP 2 — BRACKET */}
 <Section color="#FFD600" icon="2" title="The Knockout Bracket Opens June 27">
 <p>The group stage is live now. Predict scores for all 72 group stage matches and pick winners through every knockout round to the final. The Knockout Bracket opens June 27 — bracket entries lock when the Round of 32 begins.</p>
 <div style={{ background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '10px' }}>BRACKET POINTS</div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
 {[['Exact final score', '25 pts'], ['Correct draw', '12 pts'], ['Correct winner', '10 pts'], ['Goal margin bonus', '+5 pts'], ['Group winner bonus', '+3 pts'], ['Group runner-up bonus', '+2 pts'], ['Correct champion', '50 pts'], ['Runner-up (Final)', '25 pts'], ['Each semifinalist', '12 pts'], ['Each quarterfinalist', '8 pts'], ['Each R16 pick', '5 pts'], ['Each R32 pick', '3 pts']].map(([l, p]) => (
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
 {[['Daily login streak', '+2 pts/day'], ['Correct upset/underdog pick', '+5 pts'], ['Perfect matchday (all matches)', '+20 pts'], ['Referral bonus (paid signup)', '+2 pts each (10/day cap)']].map(([l, p]) => (
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
 { title: ' Individual', desc: 'Every fan ranked globally. The Champion takes home a Thunder FC jersey, WCFC Champion shirt, and permanent recognition.' },
 { title: ' Country', desc: 'Average score per fan by country. Levels the playing field — a country with 10 fans can beat a country with 10,000. The winning country earns the "Best World Cup Fans" title.' },
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
 <p>Share your unique referral link. When a friend signs up through your link, you earn +2 bonus points. Capped at 10 referral points per day.</p>
 <div style={{ background: 'rgba(255,152,0,0.06)', border: '1px solid rgba(255,152,0,0.15)', borderRadius: '10px', padding: '16px', margin: '16px 0', fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#FF9800' }}>
 1 referral = +2 pts &nbsp;·&nbsp; 5 referrals/day = +10 pts &nbsp;·&nbsp; Max 10 referral pts/day
 </div>
 <p>Find your referral link on your dashboard after signing up.</p>
 </Section>

 {/* STEP 6 — FUND */}
 <Section color="#00C853" icon="6" title="The Grassroots Fútbol Fund">
 <p>Every donation goes to the Grassroots Fútbol Fund. Donors designate which country&apos;s youth programs receive their contribution. Donations are entirely optional and do not affect scoring or standings.</p>
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
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginBottom: '24px' }}>Knockout Bracket opens June 27 · Free to play · No purchase necessary</div>
 <Link href="/auth/signup" style={{ display: 'inline-block', padding: '16px 40px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>PLAY FREE
 </Link>
 <div style={{ marginTop: '12px' }}>
 <Link href="/rules" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#3a5a42', letterSpacing: '1px' }}>Read Official Rules →</Link>
 &nbsp;&middot;&nbsp;
 <a href="/checkout" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#FFD600', letterSpacing: '1px', textDecoration: 'none' }}>Donate →</a>
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
