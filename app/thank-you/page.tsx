'use client'

import Link from 'next/link'
import Nav from '@/app/components/Nav'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const donateButtons = [
  { label: '$5', href: 'https://paypal.com/ncp/payment/BELX9PNVNWL22' },
  { label: '$10', href: 'https://paypal.com/ncp/payment/VBE2SJX9GV434' },
  { label: '$25', href: 'https://paypal.com/ncp/payment/JD88GAEVETZJG' },
  { label: 'Custom', href: 'https://paypal.com/ncp/payment/BTKA5UPNZ64FQ' },
]

function ThankYouContent() {
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier')
  const isChampion = tier === 'champion'

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      <Nav />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '50%', width: 64, height: 64, lineHeight: '64px', fontSize: '1.8rem', marginBottom: '20px' }}>&#10003;</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
            {isChampion ? 'Welcome to the Founding Wall.' : 'Welcome — Your Payment Was Received.'}
          </div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '1.05rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            {isChampion
              ? 'Your Champion Founder status is confirmed. You just supported youth fútbol worldwide.'
              : 'Your payment has been processed successfully. Thank you for joining the World Cup Fan Challenge.'}
          </p>
        </div>

        {/* DONATION UPSELL */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.08),rgba(255,214,0,0.04))', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '14px', padding: '32px', marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#00C853', letterSpacing: '3px', marginBottom: '8px' }}>BOOST YOUR IMPACT</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: 'white', letterSpacing: '2px', marginBottom: '12px' }}>Add a Donation to Youth Fútbol</div>
          <p style={{ fontFamily: "'Barlow'", fontSize: '0.95rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 24px' }}>
            Every donation supports youth fútbol programs around the world. Add a one-time gift below.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {donateButtons.map(b => (
              <a
                key={b.label}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  minWidth: '100px',
                  background: b.label === 'Custom' ? 'rgba(255,214,0,0.12)' : 'rgba(0,200,83,0.12)',
                  border: `1px solid ${b.label === 'Custom' ? 'rgba(255,214,0,0.3)' : 'rgba(0,200,83,0.3)'}`,
                  color: b.label === 'Custom' ? '#FFD600' : '#00C853',
                  fontFamily: "'Bebas Neue'",
                  fontSize: '1.1rem',
                  letterSpacing: '2px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                {b.label}
              </a>
            ))}
          </div>
        </div>

        {/* NEXT STEPS */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '16px' }}>NEXT STEPS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { n: '1', title: 'Check your email', desc: "We've sent you a link to set your password and complete your fan profile." },
              { n: '2', title: 'Make your picks', desc: 'Once logged in, head to your dashboard to predict every match before June 11 kickoff.' },
              { n: '3', title: 'Spread the word', desc: 'Share with friends and help fund youth fútbol. The more fans, the bigger the impact.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#0a1410', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,214,0,0.15)', border: '1px solid rgba(255,214,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: '#FFD600', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{s.title}</div>
                  <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CTA */}
        <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: 1.8 }}>
            Didn&apos;t get the email?{' '}
            <a href="mailto:thomasjbartley@worldcupfanchallenge.com" style={{ color: '#00C853', textDecoration: 'none' }}>
              contact support →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8ab898', fontFamily: "'Barlow', sans-serif" }}>
        Loading...
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
