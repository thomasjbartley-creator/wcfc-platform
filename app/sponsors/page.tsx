import Link from 'next/link'
import CopyEmail from './CopyEmail'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'Become a Sponsor \u2014 WCFC',
  description: 'Partner with the World Cup Fan Challenge 2026. Reach passionate football fans worldwide through premium sponsorship opportunities.',
}

export default function SponsorsPage() {
 const tiers = [
 {
 name: 'Founding Sponsor',
 price: '$5,000+',
 color: '#FFD600',
 limit: 'Founding privileges by commit date',
 perks: [
 '"Presented by" on the Grassroots Fútbol Fund',
 'Logo in hero position on all pages',
 'Included in every fan email',
 'Donation match opportunity — become the hero',
 'Product/brand links placed prominently on site',
 'Social media features throughout tournament',
 'Included in press releases when issued',
 'Champion Founder memberships for your team (10)',
 'Seat on the Selection Board choosing donation recipients',
 'Top placement on the public Sponsor Leaderboard',
 'Check presentation attendance — higher amount and earlier commit = higher-level presentation',
 'Award credit at Youth Project awards ceremony',
 ],
 },
 {
 name: 'Tournament Partner',
 price: '$1,000–$4,999',
 color: '#4FC3F7',
 limit: 'Match spotlight slots by commit date',
 perks: [
 'Logo in sponsors section on site',
 'Donation match opportunity',
 'Product/brand links placed on site',
 'Public Sponsor Leaderboard placement',
 '2 dedicated social media features',
 'Spotlight post during a marquee match',
 'Check presentation attendance at regional level',
 'Named in tournament communications',
 'Champion Founder memberships (5)',
 'Award mention at Youth Project ceremony',
 ],
 },
 {
 name: 'Community Supporter',
 price: '$250–$999',
 color: '#00C853',
 limit: 'Sponsors wall placement by commit date',
 perks: [
 'Logo on sponsors wall',
 'Brand link placement on site',
 'Public Sponsor Leaderboard placement',
 'Thank you post on social media',
 'Named in award announcement',
 'Champion Founder memberships (2)',
 ],
 },
 ]

 const targets = [
 { cat: ' Soccer', names: ['Adidas', 'Nike Football', 'Puma', 'EA Sports FC', 'MLS Teams'] },
 { cat: ' Apps', names: ['Sofascore', 'OneFootball', 'FotMob', 'Sorare'] },
 { cat: ' Food & Drink', names: ['Budweiser', 'Gatorade', 'Red Bull', 'Chipotle'] },
 { cat: ' Media', names: ['Apple TV+', 'Paramount+', 'Telemundo', 'Univision'] },
 { cat: ' Travel', names: ['Marriott', 'Booking.com', 'American Airlines', 'Airbnb'] },
 { cat: ' Mission', names: ['Common Goal', 'streetfootballworld', 'US Youth Soccer', 'UNICEF Sport'] },
 ]

 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />

 <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 80px' }}>

 {/* HERO */}
 <div style={{ marginBottom: '60px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>PARTNER WITH WCFC</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>Sponsor the World Cup&apos;s<br /><span style={{ color: '#FFD600' }}>Most Passionate Fans</span>
 </div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '640px', marginBottom: '24px' }}>The 2026 FIFA World Cup is the biggest sporting event in history — 48 teams, 104 matches, 5 billion global fans. The World Cup Fan Challenge puts your brand in front of the most engaged fans during the tournament&apos;s most exciting moments, while funding youth soccer programs worldwide.
 </p>
 <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
 {[['', '48', 'Nations Competing'], ['', '104', 'Matches'], ['', 'Jun 27', 'Knockout Bracket'], ['', 'Free', 'To Play']].map(([i, n, l]) => (
 <div key={l} style={{ textAlign: 'center' }}>
 <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{i}</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: '#FFD600', lineHeight: 1 }}>{n}</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.7rem', color: '#5a8a68', letterSpacing: '1px' }}>{l}</div>
 </div>
 ))}
 </div>
 </div>

 {/* DONATION MATCH CALLOUT */}
 <div style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.08),rgba(255,214,0,0.04))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '28px 32px', marginBottom: '20px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>MOST POPULAR FEATURE</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>The Donation Match</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '0' }}>Commit a match amount (e.g. $2,500). We announce it to all fans with a live progress bar on the site. When the match hits, you&apos;re the hero. You get a dedicated announcement post, award credit, and a story every fan remembers. This is the highest-visibility sponsorship we offer.
 </p>
 </div>

 {/* AFFILIATE PARTNERSHIP CALLOUT — PAUSED (affiliate program hidden, see brief) */}

 {/* SPONSOR LEADERBOARD CALLOUT */}
 <div style={{ background: 'linear-gradient(135deg,rgba(229,57,53,0.06),rgba(255,214,0,0.04))', border: '1px solid rgba(229,57,53,0.2)', borderRadius: '14px', padding: '28px 32px', marginBottom: '48px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
 <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E53935', boxShadow: '0 0 8px #E53935' }} />
 <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#E53935', letterSpacing: '3px', fontWeight: 700 }}>LIVE PUBLIC RANKING</span>
 </div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>The Sponsor Leaderboard</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '20px' }}>Every sponsor commitment appears on a live public leaderboard ranked by total contribution. Visible to all fans, all press, every other brand watching the space. Your position climbs as your commitment grows. The top of the board is reserved for the brands who showed up first and biggest — and there&apos;s only one #1 spot.
 </p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
 {[1, 2, 3].map(n => (
 <div key={n} style={{ background: 'rgba(5,12,10,0.6)', border: '1px dashed rgba(229,57,53,0.3)', borderRadius: '8px', padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#FFD600', lineHeight: 1 }}>#{n}</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', fontStyle: 'italic', letterSpacing: '0.5px' }}>Open — be first</div>
 </div>
 ))}
 </div>
 <Link href="/leaderboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#E53935', textDecoration: 'none', letterSpacing: '1.5px', fontWeight: 700 }}>SEE LIVE LEADERBOARD →</Link>
 </div>

 {/* TIER CARDS */}
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Sponsorship Tiers</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.9rem', color: '#8ab898', marginBottom: '20px', maxWidth: '720px' }}>Open at every tier — what&apos;s scarce is the moments and the ranking. The higher your commitment amount and the earlier you commit, the more you&apos;re in: a seat on the Selection Board choosing donation recipients, top spots on the public Sponsor Leaderboard, attendance at the highest-level check presentations, marquee match spotlights, press release order, and front-of-the-line placement.</p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '48px' }}>
 {tiers.map(t => (
 <div key={t.name} style={{ background: '#0a1410', border: `1.5px solid ${t.color}40`, borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: t.color, letterSpacing: '2px', marginBottom: '8px' }}>{t.limit}</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '4px' }}>{t.name}</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: t.color, marginBottom: '16px' }}>{t.price}</div>
 <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
 {t.perks.map(p => (
 <li key={p} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
 <span style={{ color: t.color, flexShrink: 0, marginTop: '2px' }}>✓</span>
 <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#8ab898', lineHeight: 1.4 }}>{p}</span>
 </li>
 ))}
 </ul>
 <a href={`mailto:thomasjbartley@worldcupfanchallenge.com?subject=${encodeURIComponent(t.name + ' Sponsorship Inquiry')}&body=${encodeURIComponent('Hi Thomas,\n\nI am interested in the ' + t.name + ' sponsorship opportunity for the World Cup Fan Challenge.\n\nOrganization:\nContact name:\nBest number to reach you:\n\nLooking forward to connecting.')}`}
 style={{ display: 'block', padding: '12px', background: `${t.color}18`, border: `1px solid ${t.color}40`, color: t.color, fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none', textAlign: 'center' }}>GET IN TOUCH →
 </a>
            <div style={{ marginTop: '6px', textAlign: 'center' }}><CopyEmail /></div>
 </div>
 ))}
 </div>

 {/* TARGET CATEGORIES */}
 <div style={{ marginBottom: '48px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Categories We&apos;re Targeting</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '16px', maxWidth: '640px' }}>Examples of brands that fit each category. These are aspirational targets, not current partners — your brand could be the first.</p>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
 {targets.map(t => (
 <div key={t.cat} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{t.cat}</div>
 <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
 {t.names.map(n => (
 <span key={n} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>{n}</span>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* BACK THE MISSION · ADD A PRIZE */}
 <div style={{ marginBottom: '48px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>SUPPORT THE CHALLENGE</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>Back the Mission · Add a Prize</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '720px', marginBottom: '24px' }}>
 Donations support the Grassroots Fútbol Fund — funding youth soccer programs and the cost of running the platform. Want to add a prize fans compete for, fund the mission directly, or keep the lights on so every dollar raised goes to kids? Here&apos;s how.
 </p>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
 {/* PRIZE SPONSOR */}
 <div style={{ background: '#0a1410', border: '1.5px solid rgba(255,214,0,0.25)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>ADD A PRIZE</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Prize Sponsor</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '12px' }}>
 <span style={{ color: '#FFD600', fontWeight: 600 }}>You provide:</span> A prize fans compete for — a jersey, gear, experience, gift card, or anything fans would want to win.
 </div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, flex: 1 }}>
 <span style={{ color: '#FFD600', fontWeight: 600 }}>You get:</span> Your brand featured on the prize announcement, recognition on the Sponsor Leaderboard, and a direct connection to the most engaged fans during the tournament.
 </div>
 </div>

 {/* MISSION SPONSOR */}
 <div style={{ background: '#0a1410', border: '1.5px solid rgba(0,200,83,0.25)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#00C853', letterSpacing: '2px', marginBottom: '8px' }}>SPONSOR THE MISSION</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Mission Sponsor</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '12px' }}>
 <span style={{ color: '#00C853', fontWeight: 600 }}>You provide:</span> A donation to the Grassroots Fútbol Fund — any amount, no minimum. Every dollar funds youth soccer programs worldwide.
 </div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, flex: 1 }}>
 <span style={{ color: '#00C853', fontWeight: 600 }}>You get:</span> Sponsor Leaderboard placement, recognition in fan communications, and the story of directly funding the next generation of players.
 </div>
 </div>

 {/* FOUNDING / OPERATIONS PARTNER */}
 <div style={{ background: '#0a1410', border: '1.5px solid rgba(79,195,247,0.25)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.68rem', color: '#4FC3F7', letterSpacing: '2px', marginBottom: '8px' }}>COVER PLATFORM COSTS</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Operations Partner</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, marginBottom: '12px' }}>
 <span style={{ color: '#4FC3F7', fontWeight: 600 }}>You provide:</span> Funding that covers hosting, infrastructure, and platform costs — so that fan donations can go entirely to youth soccer instead of overhead.
 </div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#8ab898', lineHeight: 1.6, flex: 1 }}>
 <span style={{ color: '#4FC3F7', fontWeight: 600 }}>You get:</span> &ldquo;Operations powered by&rdquo; credit across the platform, top-tier Sponsor Leaderboard placement, and the distinction of making the entire fund go further.
 </div>
 </div>
 </div>

 {/* CONTACT BLOCK */}
 <div style={{ background: 'rgba(0,200,83,0.04)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#8ab898', lineHeight: 1.8 }}>
 Reach out to discuss any tier — amounts are flexible and every contribution matters.<br />
 <a href="mailto:thomasjbartley@worldcupfanchallenge.com" style={{ color: '#FFD600', textDecoration: 'none' }}>thomasjbartley@worldcupfanchallenge.com</a> · <span style={{ color: '#FFD600' }}>773-680-3623</span>
 </div>
 </div>

 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '0.5px', lineHeight: 1.6, textAlign: 'center' }}>
 All prizes are awarded in a free, skill-based contest. No purchase or donation is necessary to enter or win, and donating does not improve anyone&apos;s chances.
 </div>
 </div>

 {/* CONTACT CTA */}
 <div style={{ background: 'rgba(255,214,0,0.05)', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Ready to Talk?</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>Response within 24 hours. Custom packages available for organizations that don&apos;t fit a standard tier.
 </p>
 <a href="mailto:thomasjbartley@worldcupfanchallenge.com?subject=Sponsorship%20Inquiry&body=Hi%20Thomas%2C%0A%0AI%27m%20interested%20in%20sponsoring%20the%20World%20Cup%20Fan%20Challenge.%0A%0AOrganization%3A%0ABudget%20range%3A%0AWhat%20we%27re%20looking%20for%3A%0A%0ALooking%20forward%20to%20connecting."
 style={{ display: 'inline-block', padding: '14px 36px', background: '#FFD600', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}>EMAIL US TO DISCUSS
 </a>
            <div style={{ textAlign: 'center', marginTop: '8px' }}><CopyEmail /></div>
 <div style={{ marginTop: '12px', fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px' }}>
 thomasjbartley@worldcupfanchallenge.com
 </div>
 </div>

 </div>
 </div>
 )
}
