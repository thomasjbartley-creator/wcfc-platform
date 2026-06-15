import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Share \u2014 WCFC',
  description: 'Share the World Cup Fan Challenge with friends. Download promo content for TikTok, Instagram, Facebook, X, and Snapchat.',
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children
}
