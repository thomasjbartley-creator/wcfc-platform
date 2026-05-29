'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const W = 450
const H = 800
const DURATION = 5.5

const FLAGS: Record<string, string> = {
  AU: 'AU', IR: 'IR', IQ: 'IQ', JP: 'JP', JO: 'JO', KR: 'KR',
  QA: 'QA', SA: 'SA', UZ: 'UZ', DZ: 'DZ', CV: 'CV', CD: 'CD',
  CI: 'CI', EG: 'EG', GH: 'GH', MA: 'MA', SN: 'SN', ZA: 'ZA',
  TN: 'TN', CA: 'CA', CW: 'CW', HT: 'HT', MX: 'MX', PA: 'PA',
  US: 'US', AR: 'AR', BR: 'BR', CO: 'CO', EC: 'EC', PY: 'PY',
  UY: 'UY', NZ: 'NZ', AT: 'AT', BE: 'BE', BA: 'BA', HR: 'HR',
  CZ: 'CZ', GB: 'ENG', FR: 'FR', DE: 'DE', NL: 'NL', NO: 'NO',
  PT: 'PT', SCO: 'SCO', ES: 'ES', SE: 'SE', CH: 'CH', TR: 'TR',
}

const NAMES: Record<string, string> = {
  AU: 'Australia', IR: 'Iran', IQ: 'Iraq', JP: 'Japan', JO: 'Jordan',
  KR: 'South Korea', QA: 'Qatar', SA: 'Saudi Arabia', UZ: 'Uzbekistan',
  DZ: 'Algeria', CV: 'Cabo Verde', CD: 'Congo DR', CI: "Côte d'Ivoire",
  EG: 'Egypt', GH: 'Ghana', MA: 'Morocco', SN: 'Senegal', ZA: 'South Africa',
  TN: 'Tunisia', CA: 'Canada', CW: 'Curaçao', HT: 'Haiti', MX: 'Mexico',
  PA: 'Panama', US: 'United States', AR: 'Argentina', BR: 'Brazil',
  CO: 'Colombia', EC: 'Ecuador', PY: 'Paraguay', UY: 'Uruguay',
  NZ: 'New Zealand', AT: 'Austria', BE: 'Belgium', BA: 'Bosnia & Herzegovina',
  HR: 'Croatia', CZ: 'Czechia', GB: 'England', FR: 'France', DE: 'Germany',
  NL: 'Netherlands', NO: 'Norway', PT: 'Portugal', SCO: 'Scotland',
  ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', TR: 'Türkiye',
}

const TIER_COLORS: Record<string, string> = {
  champion: '#FFD600', founder: '#FF9800', premium: '#00C853',
  free: '#5a8a68',
}
const TIER_LABELS: Record<string, string> = {
  champion: 'CHAMPION FOUNDER', founder: 'FOUNDER FAN', premium: 'PREMIUM',
  free: 'FREE FAN',
}

function eo(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3) }
function ph(p: number, s: number, e: number) { return eo((p - s) / (e - s)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)) }

function drawFrame(
  ctx: CanvasRenderingContext2D,
  p: number,
  username: string,
  country: string,
  tier: string,
  refCode: string,
  scoreline: string,
) {
  const flag = FLAGS[country] || country
  const name = (NAMES[country] || country).toUpperCase()
  const tc = TIER_COLORS[tier] || '#5a8a68'
  const tl = TIER_LABELS[tier] || 'FAN'
  const hasScore = scoreline.trim().length > 0

  ctx.fillStyle = '#050C0A'
  ctx.fillRect(0, 0, W, H)

  const glowA = ph(p, 0, 0.15)
  const g = ctx.createRadialGradient(W / 2, H * 0.44, 0, W / 2, H * 0.44, W * 0.9)
  g.addColorStop(0, `rgba(0,200,83,${0.18 * glowA})`)
  g.addColorStop(0.6, `rgba(0,200,83,${0.05 * glowA})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.09)'
    ctx.fillRect(0, y, W, 1)
  }

  const bA = ph(p, 0.02, 0.22)
  if (bA > 0) {
    ctx.save()
    ctx.globalAlpha = bA * 0.55
    ctx.strokeStyle = '#00C853'
    ctx.lineWidth = 2
    const sz = 38, m = 20
    ctx.beginPath()
    ctx.moveTo(m, m + sz); ctx.lineTo(m, m); ctx.lineTo(m + sz, m)
    ctx.moveTo(W - m - sz, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + sz)
    ctx.moveTo(m, H - m - sz); ctx.lineTo(m, H - m); ctx.lineTo(m + sz, H - m)
    ctx.moveTo(W - m - sz, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - sz)
    ctx.stroke()
    ctx.restore()
  }

  if (p > 0.08) {
    const lA = ph(p, 0.08, 0.28)
    const lW = lerp(0, W * 0.62, ph(p, 0.08, 0.28))
    ctx.save()
    ctx.globalAlpha = lA * 0.28
    ctx.strokeStyle = '#00C853'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(W / 2 - lW / 2, 120); ctx.lineTo(W / 2 + lW / 2, 120)
    ctx.moveTo(W / 2 - lW / 2, H - 120); ctx.lineTo(W / 2 + lW / 2, H - 120)
    ctx.stroke()
    ctx.restore()
  }

  const logoA = ph(p, 0.05, 0.22)
  if (logoA > 0) {
    ctx.save()
    ctx.globalAlpha = logoA
    ctx.textAlign = 'center'
    ctx.font = `700 34px 'Bebas Neue', serif`
    ctx.fillStyle = '#ffffff'
    ctx.fillText('WCFC', W / 2 - 9, 78)
    ctx.fillStyle = '#00C853'
    ctx.fillText('.', W / 2 + 48, 78)
    ctx.font = `600 10px 'Barlow Condensed', sans-serif`
    ctx.fillStyle = '#3a5a42'
    ctx.letterSpacing = '3px'
    ctx.fillText('WORLD CUP FAN CHALLENGE', W / 2, 96)
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  const callA = ph(p, 0.18, 0.36)
  const callY = lerp(H * 0.25 + 28, H * 0.25, ph(p, 0.18, 0.34))
  if (callA > 0) {
    ctx.save()
    ctx.globalAlpha = callA
    ctx.textAlign = 'center'
    ctx.font = `700 17px 'Barlow Condensed', sans-serif`
    ctx.fillStyle = '#5a8a68'
    ctx.letterSpacing = '7px'
    ctx.fillText("I'M CALLING IT", W / 2, callY)
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  const flagA = ph(p, 0.32, 0.50)
  const flagSize = lerp(55, 98, ph(p, 0.32, 0.50))
  const flagY = lerp(H * 0.43 + 55, H * 0.43, ph(p, 0.32, 0.48))
  if (flagA > 0) {
    ctx.save()
    ctx.globalAlpha = flagA
    ctx.textAlign = 'center'
    ctx.font = `${Math.round(flagSize)}px serif`
    ctx.fillText(flag, W / 2, flagY)
    ctx.restore()
  }

  const nameA = ph(p, 0.46, 0.62)
  const nameY = lerp(H * 0.595 + 38, H * 0.595, ph(p, 0.46, 0.61))
  if (nameA > 0) {
    ctx.save()
    ctx.globalAlpha = nameA
    ctx.textAlign = 'center'
    ctx.shadowColor = '#00C853'
    ctx.shadowBlur = 28 * nameA
    const fs = name.length > 12 ? 46 : name.length > 9 ? 56 : 66
    ctx.font = `${fs}px 'Bebas Neue', serif`
    ctx.fillStyle = '#ffffff'
    ctx.letterSpacing = '2px'
    ctx.fillText(name, W / 2, nameY)
    ctx.shadowBlur = 0
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  const winsA = ph(p, 0.60, 0.76)
  if (winsA > 0) {
    ctx.save()
    ctx.globalAlpha = winsA
    ctx.textAlign = 'center'
    if (hasScore) {
      ctx.font = `700 13px 'Barlow Condensed', sans-serif`
      ctx.fillStyle = '#5a8a68'
      ctx.letterSpacing = '4px'
      ctx.fillText('MY SCORE PREDICTION', W / 2, H * 0.642)
      ctx.letterSpacing = '0px'
      ctx.shadowColor = '#FFD600'
      ctx.shadowBlur = 20 * winsA
      const scoreText = scoreline.trim().toUpperCase()
      const scoreFontSize = scoreText.length > 14 ? 40 : scoreText.length > 10 ? 48 : 56
      ctx.font = `${scoreFontSize}px 'Bebas Neue', serif`
      ctx.fillStyle = '#FFD600'
      ctx.letterSpacing = '2px'
      ctx.fillText(scoreText, W / 2, H * 0.684)
      ctx.shadowBlur = 0
      ctx.letterSpacing = '0px'
    } else {
      ctx.font = `700 20px 'Barlow Condensed', sans-serif`
      ctx.fillStyle = '#FFD600'
      ctx.letterSpacing = '5px'
      ctx.fillText('WINS THE WORLD CUP', W / 2, H * 0.665)
      ctx.letterSpacing = '0px'
    }
    ctx.restore()
  }

  const divA = ph(p, 0.72, 0.83)
  if (divA > 0) {
    const dw = lerp(0, W * 0.58, ph(p, 0.72, 0.83))
    ctx.save()
    ctx.globalAlpha = divA * 0.32
    ctx.strokeStyle = '#00C853'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(W / 2 - dw / 2, H * 0.724)
    ctx.lineTo(W / 2 + dw / 2, H * 0.724)
    ctx.stroke()
    ctx.restore()
  }

  const userA = ph(p, 0.78, 0.92)
  if (userA > 0) {
    ctx.save()
    ctx.globalAlpha = userA
    ctx.textAlign = 'center'
    ctx.font = `600 12px 'Barlow Condensed', sans-serif`
    ctx.fillStyle = tc
    ctx.letterSpacing = '2px'
    ctx.fillText(tl, W / 2, H * 0.762)
    ctx.letterSpacing = '0px'
    ctx.shadowColor = '#00C853'
    ctx.shadowBlur = 16 * userA
    ctx.font = `44px 'Bebas Neue', serif`
    ctx.fillStyle = '#00C853'
    ctx.letterSpacing = '2px'
    ctx.fillText('@' + username, W / 2, H * 0.808)
    ctx.shadowBlur = 0
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  const siteA = ph(p, 0.90, 1.0)
  if (siteA > 0) {
    ctx.save()
    ctx.globalAlpha = siteA * 0.7
    ctx.textAlign = 'center'
    ctx.font = `600 10px 'Barlow Condensed', sans-serif`
    ctx.fillStyle = '#3a5a42'
    ctx.letterSpacing = '2px'
    ctx.fillText('MAKE YOUR PICK AT', W / 2, H * 0.862)
    ctx.font = `18px 'Bebas Neue', serif`
    ctx.fillStyle = '#ffffff'
    ctx.letterSpacing = '1px'
    ctx.fillText('WORLDCUPFANCHALLENGE.COM', W / 2, H * 0.883)
    if (refCode) {
      ctx.font = `600 10px 'Barlow Condensed', sans-serif`
      ctx.fillStyle = '#2a4a32'
      ctx.letterSpacing = '1.5px'
      ctx.fillText(`USE CODE: ${refCode}`, W / 2, H * 0.902)
    }
    ctx.letterSpacing = '0px'
    ctx.restore()
  }

  if (p > 0.92) {
    const pulse = (Math.sin(((p - 0.92) / 0.08) * Math.PI * 4) * 0.5 + 0.5) * ph(p, 0.92, 1.0)
    const pg = ctx.createRadialGradient(W / 2, H * 0.44, 0, W / 2, H * 0.44, W * 0.7)
    pg.addColorStop(0, `rgba(0,200,83,${0.06 * pulse})`)
    pg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = pg
    ctx.fillRect(0, 0, W, H)
  }
}

interface Profile {
  username: string
  tier: string
  country_supported: string
  referral_code: string
}

type Platform = 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'snapchat'

const PLATFORMS: { id: Platform; label: string; color: string; icon: string }[] = [
  { id: 'tiktok', label: 'TikTok', color: '#69C9D0', icon: 'TT' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: 'IG' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', icon: 'FB' },
  { id: 'twitter', label: 'X / Twitter', color: '#1DA1F2', icon: 'X' },
  { id: 'snapchat', label: 'Snapchat', color: '#FFFC00', icon: 'SC' },
]

const PLATFORM_INSTRUCTIONS: Record<Platform, { title: string; steps: string[]; note: string }> = {
  tiktok: {
    title: 'HOW TO POST ON TIKTOK',
    steps: [
      'Download your video above',
      'Open TikTok and tap the + button',
      'Upload the video from your camera roll',
      'Tap Sounds → search "World Cup" and add the official song',
      'Caption: "I\'m calling it —Can you beat my pick? Link in bio" + #WorldCup2026',
      'Post and tag us @wcfc',
    ],
    note: 'TikTok\'s official music library has the World Cup song fully licensed — adding it inside TikTok is always legal.',
  },
  instagram: {
    title: 'HOW TO POST ON INSTAGRAM REELS',
    steps: [
      'Download your video above',
      'Open Instagram → tap + → select Reel',
      'Upload the video from your camera roll',
      'Tap Add Audio → search "World Cup" and add the official song',
      'Caption: "I\'m calling it —Can you beat my pick? Link in bio" + #WorldCup2026',
      'Share to your Feed & Story for maximum reach',
    ],
    note: 'Instagram Reels has the World Cup song fully licensed — adding it natively inside Instagram is always legal.',
  },
  facebook: {
    title: 'HOW TO POST ON FACEBOOK',
    steps: [
      'Download your video above',
      'Open Facebook and tap Photo/Video in the post box',
      'Select the video from your camera roll',
      'Caption: "I\'m calling it —Who do YOU think wins? #WorldCup2026"',
      'Tag your friends and challenge them to make their own pick',
      'Post publicly so your friends can share it further',
    ],
    note: 'Post as a Facebook Reel for best reach — it gets pushed to more people than regular video posts.',
  },
  twitter: {
    title: 'HOW TO POST ON X / TWITTER',
    steps: [
      'Download your video above',
      'Open X (Twitter) and tap the compose button',
      'Attach the video from your camera roll',
      'Tweet: "I\'m calling it —[Country] wins the World Cup. Fight me. #WorldCup2026 worldcupfanchallenge.com"',
      'Tag @wcfc and your friends to challenge them',
      'Quote-tweet your rivals\' picks for extra engagement',
    ],
    note: 'X supports .webm video — your download will upload directly. For best quality use Chrome or Edge to generate the video.',
  },
  snapchat: {
    title: 'HOW TO POST ON SNAPCHAT',
    steps: [
      'Download your video above to your camera roll',
      'Open Snapchat and tap the camera roll icon (bottom left)',
      'Select the video → tap Send → My Story',
      'Add a sticker or text: "I\'m calling it! —#WorldCup2026"',
      'Share to your Story so all your friends can see',
      'Challenge your friends to post their own picks',
    ],
    note: 'Save your video to Photos first — Snapchat imports best from your camera roll.',
  },
}

export default function SharePage() {
  const router = useRouter()
  const supabase = createClient()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const startRef = useRef<number | null>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fontsReady, setFontsReady] = useState(false)
  const [scoreline, setScoreline] = useState('')
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [step, setStep] = useState<'preview' | 'done'>('preview')
  const [platform, setPlatform] = useState<Platform>('tiktok')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('username, tier, country_supported, referral_code')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setLoading(false)
      await document.fonts.ready
      await Promise.all([
        document.fonts.load('44px "Bebas Neue"'),
        document.fonts.load('600 14px "Barlow Condensed"'),
      ]).catch(() => {})
      setFontsReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!profile || !fontsReady || recording) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    startRef.current = null

    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts
      const elapsed = (ts - startRef.current) / 1000
      if (elapsed > DURATION + 1.2) startRef.current = ts
      const p = Math.min(elapsed / DURATION, 1)
      drawFrame(ctx, p, profile!.username || 'Fan', profile!.country_supported, profile!.tier, profile!.referral_code, scoreline)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [profile, fontsReady, recording, scoreline])

  const handleRecord = useCallback(async () => {
    if (!profile) return
    const canvas = canvasRef.current
    if (!canvas) return
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setRecording(true)
    setVideoBlob(null)
    setStep('preview')

    const stream = (canvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(30)
    const mimeType = typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9' : 'video/webm'
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 })
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      setVideoBlob(blob)
      setRecording(false)
      setStep('done')
    }

    recorder.start()
    const ctx = canvas.getContext('2d')!
    const recStart = performance.now()

    function recTick(ts: number) {
      const elapsed = (ts - recStart) / 1000
      const p = Math.min(1, elapsed / DURATION)
      drawFrame(ctx, p, profile!.username || 'Fan', profile!.country_supported, profile!.tier, profile!.referral_code, scoreline)
      if (elapsed < DURATION + 0.4) {
        requestAnimationFrame(recTick)
      } else {
        recorder.stop()
      }
    }
    requestAnimationFrame(recTick)
  }, [profile, scoreline])

  const handleDownload = useCallback(() => {
    if (!videoBlob || !profile) return
    const url = URL.createObjectURL(videoBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wcfc-${profile.username || 'pick'}-worldcup.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [videoBlob, profile])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: '#00C853', letterSpacing: '3px' }}>LOADING...</div>
    </div>
  )

  const platformInfo = PLATFORM_INSTRUCTIONS[platform]
  const activePlatform = PLATFORMS.find(pl => pl.id === platform)!

  return (
    <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(5,12,10,0.95)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/dashboard" style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', color: '#5a8a68', textDecoration: 'none', letterSpacing: '1px' }}>
          &larr; BACK TO DASHBOARD
        </a>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: 'white', letterSpacing: '3px' }}>
          WCFC<span style={{ color: '#00C853' }}>.</span>
        </div>
      </nav>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', letterSpacing: '3px', textTransform: 'uppercase' }}>
            {recording ? '⏺ Recording...' : 'Live Preview'}
          </div>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{
              width: 'min(260px, 90vw)',
              height: 'auto',
              borderRadius: '12px',
              border: '1px solid rgba(0,200,83,0.2)',
              boxShadow: '0 0 40px rgba(0,200,83,0.08)',
              display: 'block',
            }}
          />
          {!fontsReady && (
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', letterSpacing: '1px' }}>
              Loading fonts...
            </div>
          )}
        </div>

        <div style={{ paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: 'white', letterSpacing: '2px', lineHeight: 1 }}>
              Create Your Share Card
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.9rem', color: '#5a8a68', marginTop: '6px', lineHeight: '1.5' }}>
              Your animated pick card — generate it, download it, and post it everywhere.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'Barlow Condensed'", fontSize: '0.78rem', fontWeight: 700, color: '#8ab898', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Score Prediction <span style={{ color: '#3a5a42', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text"
              value={scoreline}
              onChange={e => { setScoreline(e.target.value); setStep('preview'); setVideoBlob(null) }}
              placeholder="e.g. Argentina 2 – 1 France"
              maxLength={24}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontFamily: "'Barlow'",
                fontSize: '1rem',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#3a5a42', marginTop: '5px', letterSpacing: '0.5px' }}>
              Leave blank to show &quot;WINS THE WORLD CUP&quot; — or type any score. Updates the preview live.
            </div>
          </div>

          {step === 'preview' && (
            <button
              onClick={handleRecord}
              disabled={recording || !fontsReady}
              style={{
                padding: '15px 24px',
                background: recording ? 'rgba(0,200,83,0.3)' : '#00C853',
                color: '#050C0A',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Bebas Neue'",
                fontSize: '1.1rem',
                letterSpacing: '3px',
                cursor: recording || !fontsReady ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {recording ? 'RECORDING... (5 seconds)' : fontsReady ? 'GENERATE MY VIDEO' : 'LOADING...'}
            </button>
          )}

          {step === 'done' && videoBlob && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={handleDownload}
                style={{
                  padding: '15px 24px',
                  background: '#FFD600',
                  color: '#050C0A',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Bebas Neue'",
                  fontSize: '1.1rem',
                  letterSpacing: '3px',
                  cursor: 'pointer',
                }}
              >
                DOWNLOAD VIDEO
              </button>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PLATFORMS.map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => setPlatform(pl.id)}
                    style={{
                      padding: '7px 14px',
                      background: platform === pl.id ? pl.color : 'rgba(255,255,255,0.04)',
                      color: platform === pl.id ? '#050C0A' : pl.color,
                      border: `1px solid ${platform === pl.id ? pl.color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '6px',
                      fontFamily: "'Barlow Condensed'",
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {pl.icon} {pl.label}
                  </button>
                ))}
              </div>

              <div style={{ background: '#0a1410', border: `1px solid ${activePlatform.color}33`, borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: activePlatform.color, letterSpacing: '3px', marginBottom: '14px' }}>
                  {platformInfo.title}
                </div>
                {platformInfo.steps.map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1rem', color: activePlatform.color, minWidth: '20px', lineHeight: 1.4 }}>{i + 1}</div>
                    <div style={{ fontFamily: "'Barlow'", fontSize: '0.85rem', color: '#5a8a68', lineHeight: '1.5' }}>{text}</div>
                  </div>
                ))}
                <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(0,200,83,0.05)', borderRadius: '6px', border: '1px solid rgba(0,200,83,0.12)', fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', color: '#3a5a42', lineHeight: '1.5' }}>
                  {platformInfo.note}
                </div>
              </div>

              <button
                onClick={() => { setStep('preview'); setVideoBlob(null) }}
                style={{
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  fontFamily: "'Barlow Condensed'",
                  fontSize: '0.85rem',
                  color: '#5a8a68',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                }}
              >
                REGENERATE
              </button>
            </div>
          )}

          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.72rem', color: '#2a4a32', lineHeight: '1.6', letterSpacing: '0.3px' }}>
            Video exports as .webm (Chrome/Edge/Firefox). On Safari, use the Share button instead.
            All major platforms have the official World Cup song fully licensed — always add it natively inside the app, never upload audio separately.
          </div>

        </div>
      </div>
    </div>
  )
}
