'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ClubsPage() {
  const [form, setForm] = useState({ name: '', email: '', club: '', city: '', size: '', type: '', source: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Club Kit Request — ${form.club}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nClub: ${form.club}\nCity: ${form.city}\nSize: ${form.size}\nType: ${form.type}\nHeard about us: ${form.source}`
    )
    window.location.href = `mailto:thomasjbartley@worldcupfanchallenge.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const kitItems = [
    { title: 'Custom Club Link', desc: 'Your own signup URL — worldcupfanchallenge.com/join/YOURCLUB — tracks every member who joins through your club.' },
    { title: 'Club Leaderboard', desc: 'Your members compete against each other on a private leaderboard. Best club fans rise to the top.' },
    { title: 'Promo Materials', desc: 'Ready-to-send email, WhatsApp message, and social post templates. Copy, paste, send. Done.' },
    { title: '30% Revenue Share', desc: 'Every paid entry through your club link puts 30% directly into your club treasury. No minimums.' },
    { title: 'QR Code', desc: 'Print it, put it on your phone, tape it to the wall at practice. Every scan is a potential signup.' },
    { title: 'Club Champion Badge', desc: 'The club with the highest average score wins the Club Champion title and a limited edition banner.' },
  ]

  const tiers = [
    { name: 'Free Club Kit', price: '$0', color: '#00C853', perks: ['Custom club link', 'Club leaderboard', 'Promo templates', 'QR code', '30% revenue share on paid entries'] },
    { name: 'Club League', price: '$49', color: '#FFD600', badge: 'Coming Soon', perks: ['Everything in Free Kit', 'Private competition bracket', 'Custom prizes for your members', 'Club vs club competition', 'Coach admin dashboard'] },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.97)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>WCFC<span style={{ color: '#00C853' }}>.</span></Link>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/leaderboard" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>LEADERBOARD</Link>
          <Link href="/clubs" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>FOR CLUBS</Link>
          <Link href="/sponsors" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>SPONSORS</Link>
          <Link href="/about" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>OUR STORY</Link>
          <Link href="/affiliate" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#FFD600', letterSpacing: '1px', textDecoration: 'none', padding: '7px 12px' }}>EARN $$$</Link>
          <Link href="/auth/login" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textDecoration: 'none', padding: '7px 14px' }}>SIGN IN</Link>
          <Link href="/auth/signup?plan=champion" style={{ fontFamily: "'Bebas Neue'", fontSize: '0.9rem', color: '#050C0A', background: '#FFD600', letterSpacing: '2px', textDecoration: 'none', padding: '9px 20px', borderRadius: '5px' }}>JOIN — $10</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* HERO */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>FOR CLUBS & COACHES</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4.5rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
            Turn the World Cup Into<br /><span style={{ color: '#FFD600' }}>a Club Fundraiser</span>
          </div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '1.05rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '620px', marginBottom: '32px' }}>
            Give your players, parents, and alumni something to compete for during the biggest soccer tournament in history. Set up in 5 minutes. Free club kit. Your members join, compete, and 30% of every entry fee goes back to your club.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a href="#request-kit" style={{ padding: '14px 32px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
              GET YOUR FREE KIT →
            </a>
            <a href="#how-it-works" style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d0ead8', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
              HOW IT WORKS
            </a>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[['$0', 'Setup cost'], ['30%', 'Revenue back to you'], ['5 min', 'To get started'], ['104', 'Matches to predict']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#FFD600', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '1px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* THE KIT */}
        <div style={{ marginBottom: '60px' }} id="how-it-works">
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>WHAT YOU GET</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '24px' }}>Your Free Club Kit</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {kitItems.map(k => (
              <div key={k.title} style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{k.title}</div>
                <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: 1.5 }}>{k.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* REVENUE MATH */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.08),rgba(255,214,0,0.04))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '32px', marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>THE MATH</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>How Much Can Your Club Raise?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              ['25 families', '$10 entry', '$75 back'],
              ['50 families', '$10 entry', '$150 back'],
              ['100 families', '$10 entry', '$300 back'],
              ['200 families', '$10 entry', '$600 back'],
            ].map(([fam, entry, back]) => (
              <div key={fam} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600' }}>{back}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#5a8a68', letterSpacing: '1px' }}>{fam} @ {entry}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', lineHeight: 1.6 }}>
            30% of every paid entry through your club link goes back to your club treasury. Paid monthly via PayPal or check. No minimum payout. No setup fees.
          </div>
        </div>

        {/* HOW TO SET UP */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '24px' }}>Set Up in 5 Minutes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { n: '1', t: 'Request your free kit', d: 'Fill out the form below. We set up your club link and QR code within 24 hours.' },
              { n: '2', t: 'Share with your families', d: 'Send the email template, post the QR code at practice, drop the link in your WhatsApp group. Takes 2 minutes.' },
              { n: '3', t: 'Members join and predict', d: 'Everyone who signs up through your link is automatically added to your club leaderboard.' },
              { n: '4', t: 'Track your revenue', d: 'We send you a monthly report. Every paid member through your link = 30% to your club.' },
              { n: '5', t: 'Crown your club champion', d: 'The member with the highest score at the end of the tournament wins the Club Champion title.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#0a1410', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#00C853', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{s.t}</div>
                  <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIERS */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '20px' }}>Club Options</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {tiers.map(t => (
              <div key={t.name} style={{ background: '#0a1410', border: `1.5px solid ${t.color}40`, borderRadius: '14px', padding: '28px', position: 'relative' }}>
                {t.badge && <div style={{ position: 'absolute', top: 12, right: 16, background: 'rgba(255,214,0,0.15)', border: '1px solid rgba(255,214,0,0.3)', color: '#FFD600', fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', letterSpacing: '1px', padding: '2px 8px', borderRadius: '4px' }}>{t.badge}</div>}
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '4px' }}>{t.name}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: t.color, marginBottom: '16px' }}>{t.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {t.perks.map(p => (
                    <li key={p} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: t.color, flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#8ab898' }}>{p}</span>
                    </li>
                  ))}
                </ul>
                {!t.badge && (
                  <a href="#request-kit" style={{ display: 'block', padding: '12px', background: `${t.color}18`, border: `1px solid ${t.color}40`, color: t.color, fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none', textAlign: 'center' }}>
                    GET FREE KIT →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOM PROGRAM */}
        <div style={{ background: '#0a1410', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px', padding: '32px', marginBottom: '60px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>ENTERPRISE & CUSTOM</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Need Something Bigger?</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.9rem', color: '#8ab898', lineHeight: 1.7, marginBottom: '16px' }}>
            Running a league with 20+ clubs? A school district? A national youth federation? A corporate tournament? We build fully custom programs — your brand, your revenue structure, your scale.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {['Custom Branding', 'Custom Revenue Split', 'Multi-Club Scale', 'Dedicated Support', 'Free Consultation'].map(f => (
              <span key={f} style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#FFD600', background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.2)', padding: '4px 10px', borderRadius: '4px' }}>✓ {f}</span>
            ))}
          </div>
          <a href="mailto:thomasjbartley@worldcupfanchallenge.com?subject=Custom%20Club%20Program%20Inquiry&body=Hi%20Thomas%2C%0A%0AI%27m%20interested%20in%20a%20custom%20program%20for%20my%20organization.%0A%0AOrganization%3A%0ASize%2FScope%3A%0AWhat%20I%27m%20looking%20for%3A"
            style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(255,214,0,0.12)', border: '1px solid rgba(255,214,0,0.3)', color: '#FFD600', fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none' }}>
            CONTACT US FOR DETAILS →
          </a>
        </div>

        {/* REQUEST FORM */}
        <div id="request-kit" style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.06),rgba(255,214,0,0.03))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '36px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>Request Your Free Club Kit</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '28px' }}>We set up your club link and QR code within 24 hours.</div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#00C853', marginBottom: '12px', letterSpacing: '2px' }}>DONE</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: '#00C853', letterSpacing: '2px' }}>Request Sent!</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginTop: '8px' }}>We&apos;ll have your club kit ready within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  { label: 'Your Name', key: 'name', placeholder: 'Coach Mike Johnson' },
                  { label: 'Email Address', key: 'email', placeholder: 'coach@yourclub.com' },
                  { label: 'Club or Team Name', key: 'club', placeholder: 'Houston Thunder FC' },
                  { label: 'City / State', key: 'city', placeholder: 'Houston, TX' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
                    <input type="text" required placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Club Size (families/members)</label>
                  <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} required
                    style={{ width: '100%', background: '#0d1c14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', cursor: 'pointer' }}>
                    <option value="">Select size...</option>
                    <option>Under 25</option>
                    <option>25–50</option>
                    <option>50–100</option>
                    <option>100–200</option>
                    <option>200+</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Club Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required
                    style={{ width: '100%', background: '#0d1c14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', cursor: 'pointer' }}>
                    <option value="">Select type...</option>
                    <option>Youth Soccer Club</option>
                    <option>Adult Recreational League</option>
                    <option>School / University</option>
                    <option>Corporate / Workplace</option>
                    <option>Fan Group</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>How Did You Hear About Us?</label>
                <input type="text" placeholder="Social media, friend, Google..." value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none' }} />
              </div>
              <button type="submit" style={{ padding: '15px', background: '#00C853', color: '#050C0A', border: 'none', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', cursor: 'pointer', marginTop: '6px' }}>
                REQUEST MY FREE CLUB KIT →
              </button>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', textAlign: 'center', letterSpacing: '1px' }}>
                Free to set up · 30% revenue share · No purchase necessary to enter or win non-cash prizes
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
                                                                                                                                                   