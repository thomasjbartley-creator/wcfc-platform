import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program \u2014 WCFC',
  description: 'Earn commissions promoting the World Cup Fan Challenge. Join the WCFC affiliate program and get rewarded for every signup.',
}

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children
}
