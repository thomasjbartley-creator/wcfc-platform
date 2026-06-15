'use client'

// AFFILIATE PROGRAM PAUSED — see brief. Page redirects to homepage.
// All original code preserved below the redirect for re-enablement.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Nav from '@/app/components/Nav'

export default function AffiliatePage() {
  const router = useRouter()
  useEffect(() => { router.replace('/') }, [router])
  return <div style={{ minHeight: '100vh', background: '#050C0A' }} />
}

function _OriginalAffiliatePage_PAUSED() {
 const [form, setForm] = useState({ name: '', email: '', platform: '', audience: '', paypal: '' })
 const [submitted, setSubmitted] = useState(false)
 const [affiliateCode, setAffiliateCode] = useState('')
 const [previewCode, setPreviewCode] = useState('')

 const previewLink = previewCode
 ? `https://worldcupfanchallenge.com/ref/${previewCode.toUpperCase().replace(/\s/g, '')}`
 : ''

 const [submitting, setSubmitting] = useState(false)
 const [error, setError] = useState('')

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setSubmitting(true)
 setError('')
 try {
 const res = await fetch('/api/affiliate-apply', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 name: form.name,
 email: form.email,
 platform: form.platform,
 audience: form.audience,
 paypal: form.paypal,
 }),
 })
 const data = await res.json()
 if (!res.ok) {
 setError(data.error || 'Something went wrong. Please try again.')
 setSubmitting(false)
 return
 }
 if (data.code) setAffiliateCode(data.code)
 setSubmitted(true)
 } catch {
 setError('Network error. Please try again.')
 setSubmitting(false)
 }
 }

 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />

 <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 80px' }}>

 {/* HERO */}
 <div style={{ textAlign: 'center', marginBottom: '60px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#FFD600', letterSpacing: '3px', marginBottom: '8px' }}>AFFILIATE PROGRAM</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>Get Paid to Share<br /><span style={{ color: '#FFD600' }}>the World Cup</span>
 </div>
 <p style={{ fontFamily: "'Barlow'", fontSize: '1rem', color: '#8ab898', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto' }}>Share your unique link. Every Champion Founder who signs up through you puts money in your pocket. Hit 100 signups and your rate doubles — retroactive to signup #1.
 </p>
 </div>

 {/* PAYOUT CARDS */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '480px', margin: '0 auto 48px' }}>
 <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', color: 'white', lineHeight: 1 }}>$0.50</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', letterSpacing: '1px', marginTop: '6px' }}>PER SIGNUP<br />SIGNUPS 1–99</div>
 </div>
 <div style={{ background: 'linear-gradient(135deg,rgba(255,214,0,0.1),rgba(255,214,0,0.04))', border: '1.5px solid rgba(255,214,0,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', color: '#FFD600', lineHeight: 1 }}>$1.00</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#FFD600', letterSpacing: '1px', marginTop: '6px' }}>PER SIGNUP<br />100+ RETROACTIVE</div>
 </div>
 </div>

 {/* HOW IT WORKS */}
 <div style={{ marginBottom: '48px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '20px' }}>How It Works</div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 {[
 { n: '1', t: 'Apply below', d: 'Fill out the form. We approve within 24 hours and assign you a unique code.' },
 { n: '2', t: 'Get your link + QR code', d: 'You get a personalized link (worldcupfanchallenge.com/ref/YOURCODE) and a scannable QR code to print or share digitally.' },
 { n: '3', t: 'Share it everywhere', d: 'Post on TikTok, Instagram, YouTube, your podcast, team group chats, at games. Every click is tracked.' },
 { n: '4', t: 'Earn per Champion Founder', d: '$0.50 per signup up to 99. Hit 100 and every signup — going back to #1 — becomes $1.00.' },
 { n: '5', t: 'Get paid monthly via PayPal', d: 'Payouts processed on the 1st of every month. Minimum $25 balance to pay out.' },
 ].map(s => (
 <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#0a1410', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,214,0,0.15)', border: '1px solid rgba(255,214,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: '1rem', color: '#FFD600', flexShrink: 0 }}>{s.n}</div>
 <div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{s.t}</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.88rem', color: '#5a8a68', lineHeight: 1.5 }}>{s.d}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* QR PREVIEW */}
 <div style={{ background: '#0a1410', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px', marginBottom: '48px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>Preview Your QR Code</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '16px' }}>Type a code to see what your affiliate link and QR code will look like:</div>
 <input
 type="text"
 placeholder="YOURCODE (e.g. SOCCERTALK)"
 value={previewCode}
 onChange={e => setPreviewCode(e.target.value)}
 style={{ width: '100%', maxWidth: '320px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none', marginBottom: '20px', textTransform: 'uppercase' }}
 />
 {previewLink && (
 <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
 <div style={{ background: 'white', padding: '12px', borderRadius: '8px', display: 'inline-block' }}>
 <QRCodeSVG value={previewLink} size={140} />
 </div>
 <div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px', marginBottom: '6px' }}>YOUR AFFILIATE LINK</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.95rem', color: '#00C853', wordBreak: 'break-all' }}>{previewLink}</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', marginTop: '8px' }}>Every visit tracked · Cookie lasts 30 days · Pays on Champion Founder signup</div>
 </div>
 </div>
 )}
 </div>

 {/* WHO WE WANT */}
 <div style={{ marginBottom: '48px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>Who Makes a Great Affiliate</div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
 {['Soccer podcast hosts', 'TikTok soccer creators', 'Youth club coaches', 'Fan page accounts', 'Instagram soccer pages', 'YouTube match analysts', 'Fantasy soccer players', 'Houston soccer community'].map(w => (
 <div key={w} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.1)', borderRadius: '8px' }}>
 <span style={{ color: '#00C853' }}>✓</span>
 <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.88rem', color: '#d0ead8' }}>{w}</span>
 </div>
 ))}
 </div>
 </div>

 {/* APPLICATION FORM */}
 <div style={{ background: 'linear-gradient(135deg,rgba(255,214,0,0.06),rgba(0,200,83,0.03))', border: '1px solid rgba(255,214,0,0.2)', borderRadius: '14px', padding: '32px' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', marginBottom: '6px' }}>Apply Now</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', marginBottom: '24px' }}>Your affiliate link and QR code are generated instantly.</div>

 {submitted ? (
 <div style={{ padding: '24px' }}>
 <div style={{ textAlign: 'center', marginBottom: '24px' }}>
 <div style={{ fontSize: '2rem', marginBottom: '8px' }}></div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '2px' }}>You&apos;re In!</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginTop: '4px' }}>Your affiliate link is live. Start sharing now.</div>
 </div>
 {affiliateCode && (
 <div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '8px' }}>YOUR AFFILIATE LINK</div>
 <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '12px 14px', fontFamily: "'Barlow Condensed'", fontSize: '0.95rem', color: '#00C853', wordBreak: 'break-all', marginBottom: '16px' }}>
 https://worldcupfanchallenge.com/ref/{affiliateCode}
 </div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#5a8a68', letterSpacing: '2px', marginBottom: '8px' }}>YOUR CODE</div>
 <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '12px 14px', fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#FFD600', letterSpacing: '3px', marginBottom: '20px' }}>
 {affiliateCode}
 </div>
 <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
 <div style={{ background: 'white', padding: '12px', borderRadius: '8px', display: 'inline-block' }}>
 <QRCodeSVG value={`https://worldcupfanchallenge.com/ref/${affiliateCode}`} size={140} />
 </div>
 <div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68', marginBottom: '4px' }}>Every visit tracked · Cookie lasts 30 days</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', color: '#5a8a68' }}>Pays on Champion Founder signup</div>
 </div>
 </div>
 </div>
 )}
 </div>
 ) : (
 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 {[
 { label: 'Your Name', key: 'name', placeholder: 'Thomas Bartley', type: 'text' },
 { label: 'Email Address', key: 'email', placeholder: 'you@example.com', type: 'email' },
 { label: 'Platform / Channel Name', key: 'platform', placeholder: 'e.g. Soccer Talk Podcast, @soccerfan99', type: 'text' },
 { label: 'Audience / Follower Size', key: 'audience', placeholder: 'e.g. 5,000 followers, 10,000 subscribers', type: 'text' },
 { label: 'PayPal Email for Payouts', key: 'paypal', placeholder: 'your-paypal@email.com', type: 'email' },
 ].map(f => (
 <div key={f.key}>
 <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
 <input
 type={f.type}
 required
 placeholder={f.placeholder}
 value={(form as any)[f.key]}
 onChange={e => setForm({ ...form, [f.key]: e.target.value })}
 style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', fontFamily: "'Barlow'", fontSize: '0.95rem', color: 'white', outline: 'none' }}
 />
 </div>
 ))}
 {error && (
 <div style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '6px', padding: '10px', fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#E53935', textAlign: 'center' }}>{error}</div>
 )}
 <button type="submit" disabled={submitting} style={{ padding: '14px', background: submitting ? '#8a7a30' : '#FFD600', color: '#050C0A', border: 'none', borderRadius: '6px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '3px', cursor: submitting ? 'default' : 'pointer', marginTop: '6px' }}>{submitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION →'}
 </button>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', textAlign: 'center', letterSpacing: '1px' }}>Paid monthly via PayPal · $25 minimum payout · Champion Founder signups only
 </div>
 </form>
 )}
 </div>
 </div>
 </div>
 )
}
