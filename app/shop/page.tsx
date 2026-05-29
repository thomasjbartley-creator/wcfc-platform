import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop & Donate — WCFC',
  description: 'Activity books, companion guides, and donations supporting youth soccer worldwide through the Grassroots Fútbol Fund.',
}

export default function ShopPage() {
  const products = [
    {
      name: 'Activity Book — Print',
      price: '$16.99',
      color: '#FFD600',
      desc: 'The ultimate World Cup Fan Challenge activity book. Puzzles, trivia, bracket sheets, and more — printed and shipped to your door.',
      link: 'https://paypal.com/ncp/payment/26TUUPRGDY9JN',
      cta: 'BUY PRINT BOOK',
    },
    {
      name: 'Activity Book — Digital',
      price: '$9.99',
      color: '#FFD600',
      desc: 'Same great activity book in digital format. Download instantly, print at home, or use on your tablet.',
      link: 'https://paypal.com/ncp/payment/M6D25ZH659M76',
      cta: 'BUY DIGITAL BOOK',
    },
    {
      name: 'Kids Companion Book — Print',
      price: '$12.99',
      color: '#00C853',
      desc: 'A World Cup companion designed for young fans. Learn about every country, color flags, track scores, and follow along all tournament.',
      link: 'https://paypal.com/ncp/payment/AXNLFY2XFNEMG',
      cta: 'BUY PRINT BOOK',
    },
    {
      name: 'Kids Companion Book — Digital',
      price: '$7.99',
      color: '#00C853',
      desc: 'Digital version of the Kids Companion Book. Instant download — perfect for tablets and at-home printing.',
      link: 'https://paypal.com/ncp/payment/HBGLE4CTWDNXN',
      cta: 'BUY DIGITAL BOOK',
    },
    {
      name: 'Family Bundle',
      price: '$29.99',
      color: '#4FC3F7',
      desc: 'Both the Activity Book and Kids Companion Book in digital format. One purchase, the whole family is covered.',
      badge: 'BEST VALUE',
      link: 'https://paypal.com/ncp/payment/RBE7J24VPBZ9U',
      cta: 'BUY FAMILY BUNDLE',
    },
    {
      name: 'Donate to Youth Fútbol',
      price: 'Any Amount',
      color: '#E53935',
      desc: 'Support the Grassroots Fútbol Fund. 100% of your donation goes directly to youth soccer programs worldwide.',
      link: 'https://paypal.com/ncp/payment/BTKA5UPNZ64FQ',
      cta: 'DONATE NOW',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.97)', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '4px', textDecoration: 'none' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </Link>
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
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>SHOP & SUPPORT</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
            Books, Bundles &<br /><span style={{ color: '#FFD600' }}>the Grassroots Fútbol Fund</span>
          </div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '640px' }}>
            Activity books for the whole family and direct donations to youth soccer programs worldwide. Every purchase supports the mission.
          </p>
        </div>

        {/* PRODUCT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '60px' }}>
          {products.map(p => (
            <div key={p.name} style={{ background: '#0a1410', border: `1.5px solid ${p.color}40`, borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: 12, right: 16, background: `${p.color}20`, border: `1px solid ${p.color}40`, color: p.color, fontFamily: "'Barlow Condensed'", fontSize: '0.65rem', letterSpacing: '1.5px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {p.badge}
                </div>
              )}
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: 'white', letterSpacing: '2px', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: p.color, marginBottom: '12px' }}>{p.price}</div>
              <p style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>{p.desc}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', padding: '12px', background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color, fontFamily: "'Bebas Neue'", fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '6px', textDecoration: 'none', textAlign: 'center' }}
              >
                {p.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* MISSION CALLOUT */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.08),rgba(255,214,0,0.04))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>THE GRASSROOTS FÚTBOL FUND</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '8px' }}>Every Dollar Goes to the Kids</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 24px' }}>
            100% of donations through this page go directly to youth soccer programs worldwide. The Grassroots Fútbol Fund is the heart of the World Cup Fan Challenge — fans competing for a cause.
          </p>
          <a
            href="https://paypal.com/ncp/payment/BTKA5UPNZ64FQ"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '14px 36px', background: '#00C853', color: '#050C0A', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', borderRadius: '6px', textDecoration: 'none' }}
          >
            DONATE ANY AMOUNT →
          </a>
        </div>

        {/* BACK TO HOME */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#00C853', letterSpacing: '1px', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
