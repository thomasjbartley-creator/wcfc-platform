import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fan Clubs \u2014 WCFC',
  description: 'Create or join a fan club on the World Cup Fan Challenge. Compete on private leaderboards and earn 30% revenue share.',
}

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  return children
}
