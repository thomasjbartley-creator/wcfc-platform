import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'About \u2014 WCFC',
  description: 'Meet the team behind the World Cup Fan Challenge. Built by fans, for fans \u2014 a global prediction game for the 2026 FIFA World Cup.',
}

export default function AboutPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />
 <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 80px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>BUILT BY A COACH</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '32px' }}>Why I Built This</div>

 {/* JORDAN STORY */}
 <div style={{ background: 'linear-gradient(135deg,rgba(255,214,0,0.07),rgba(0,200,83,0.03))', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px', padding: '28px 32px', marginBottom: '40px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '12px' }}>THE FULL CIRCLE STORY</div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1.05rem', color: '#d0ead8', lineHeight: 1.8, marginBottom: '16px' }}>In the early 1990s, my Navy ship was one of the first American Naval vessels to port in Jordan after diplomatic relations were restored. As part of a goodwill exchange, our crew played a match against the Jordanian National Army Fútbol Team — a side that was, in all but name, Jordan&apos;s national team.
 </p>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1.05rem', color: '#d0ead8', lineHeight: 1.8, marginBottom: '16px' }}>We were down 5-0 at halftime. I was the player-coach. I adjusted our tactics, used our size advantage, and we won the second half 1-0. I got the assist. Nearly scored the second off the crossbar.
 </p>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1.05rem', color: '#FFD600', lineHeight: 1.8, fontWeight: 600 }}>Jordan qualified for their first-ever World Cup in 2026 — Group J, alongside Argentina. They&apos;re on this platform. That&apos;s not a coincidence I manufactured. That&apos;s the game coming back around.
 </p>
 </div>

 {/* STORY SECTIONS */}
 {[
 { icon: '', title: 'Where It Started', body: "As a five-year-old growing up in the Chicago area, I watched Pelé play live at a New York Cosmos vs. Chicago Sting match. That moment lit something that never went out." },
 { icon: '', title: 'The Navy Years', body: "Soccer followed me into the Navy. I played wherever we ported. The match against Jordan's national army fútbol team wasn't just a game — it was a cultural exchange on a ship that helped restore a diplomatic relationship. Soccer did that." },
 { icon: '', title: 'Thunder FC & The Nationals', body: "After the Navy I became a volunteer youth coach — first in Orland Park, Illinois, then in Houston. Thunder FC was born out of a YMCA program in 2017. In July 2018, a group of volunteer coaches — parents, a college student who drove four hours each way, coaches who gave their time without compensation — took seven YMCA teams to the 3v3 Nationals at Disney. Every team finished 4th or better. Lightning won the national championship. Thunder finished 3rd. What had been born on those YMCA fields now had a name the kids had earned." },
 { icon: '', title: 'The Mission', body: "I anonymously sponsored the entire team myself — jerseys, fees, everything — because I wanted every kid who wanted to play to be able to play. Players from my program have gone on to MLS Next, a 2nd Division MLS club, the U17 National Team, and academies in Mexico and Saudi Arabia. The real credit belongs to every volunteer who showed up, every parent who gave their time, and every kid who believed they belonged on that field." },
 { icon: '', title: 'Why This Platform', body: "Most charity-driven sports platforms have to invent stories. I have the real thing — real kids, real seasons, real growth, real impact. The World Cup Fan Challenge is the Thunder FC mission going global. Every fan who joins helps fund the next generation of youth fútbol players worldwide." },
 ].map(s => (
 <div key={s.title} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
 <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px' }}>{s.title}</div>
 </div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
 </div>
 ))}

 {/* SIGNATURE */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: '12px', marginBottom: '40px' }}>
 <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#00C853,#FFD600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}></div>
 <div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: 'white', letterSpacing: '2px' }}>Thomas &quot;Coach&quot; Bartley</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', letterSpacing: '1px' }}>Founder · U.S. Navy Veteran · Youth Soccer Coach · Houston, TX</div>
 </div>
 </div>

 <div style={{ textAlign: 'center' }}>
 <Link href="/auth/signup" style={{ display: 'inline-block', padding: '16px 40px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none', marginBottom: '12px' }}>PLAY FREE
 </Link>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px', marginTop: '8px' }}><a href="/checkout" style={{ color: '#FFD600', textDecoration: 'none' }}>Donate to youth fútbol →</a>
 </div>
 </div>
 </div>
 </div>
 )
}
