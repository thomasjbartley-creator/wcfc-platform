import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In \u2014 WCFC',
  description: 'Log in to your World Cup Fan Challenge account. Access your picks, track your score, and climb the leaderboard.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
