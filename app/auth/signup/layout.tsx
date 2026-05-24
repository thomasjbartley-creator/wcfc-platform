import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up \u2014 WCFC',
  description: 'Create your World Cup Fan Challenge account. Join fans worldwide in predicting every match of the 2026 FIFA World Cup.',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
