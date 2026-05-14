'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Profile {
  username: string
  tier: string
  points_total: number
}

interface Match {
  id: string
  match_number: number
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  kickoff_time: string
  stage: string
  group_name: string | null
  stadium: string
  city: string
  status: string
}

const TWEMOJI = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72'
const FLAGS: Record<string, string> = {
  MX:'1f1f2-1f1fd', ZA:'1f1ff-1f1e6', KR:'1f1f0-1f1f7', CZ:'1f1e8-1f1ff',
  CA:'1f1e8-1f1e6', BA:'1f1e7-1f1e6', QA:'1f1f6-1f1e6', CH:'1f1e8-1f1ed',
  BR:'1f1e7-1f1f7', MA:'1f1f2-1f1e6', HT:'1f1ed-1f1f9', GB:'1f1ec-1f1e7',
  US:'1f1fa-1f1f8', PY:'1f1f5-1f1fe', AU:'1f1e6-1f1fa', TR:'1f1f9-1f1f7',
  DE:'1f1e9-1f1ea', CW:'1f1e8-1f1fc', CI:'1f1e8-1f1ee', EC:'1f1ea-1f1e8',
  NL:'1f1f3-1f1f1', JP:'1f1ef-1f1f5', SE:'1f1f8-1f1ea', TN:'1f1f9-1f1f3',
  BE:'1f1e7-1f1ea', EG:'1f1ea-1f1ec', IR:'1f1ee-1f1f7', NZ:'1f1f3-1f1ff',
  ES:'1f1ea-1f1f8', CV:'1f1e8-1f1fb', SA:'1f1f8-1f1e6', UY:'1f1fa-1f1fe',
  FR:'1f1eb-1f1f7', SN:'1f1f8-1f1f3', IQ:'1f1ee-1f1f6', NO:'1f1f3-1f1f4',
  AR:'1f1e6-1f1f7', DZ:'1f1e9-1f1ff', AT:'1f1e6-1f1f9', JO:'1f1ef-1f1f4',
  PT:'1f1f5-1f1f9', CD:'1f1e8-1f1e9', UZ:'1f1fa-1f1ff', CO:'1f1e8-1f1f4',
  HR:'1f1ed-1f1f7', GH:'1f1ec-1f1ed', PA:'1f1f5-1f1e6',
}

function FlagImg({ code, size = 24 }: { code: string, size?: number }) {
  const cp = FLAGS[code]
  if (!cp) return <span style={{ fontSize: size * 0.7 }}>🌍</span>
  return <img src={`${TWEMOJI}/${cp}.png`} width={size} height={size} style={{ borderRadius: 4, objectFit: 'cover', display: 'block' }} alt={code} />
}