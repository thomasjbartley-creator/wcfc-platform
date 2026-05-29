import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'Official Rules \u2014 WCFC',
  description: 'Official rules for the World Cup Fan Challenge 2026. No purchase necessary. Open to fans worldwide. Skill-based competition with real prizes.',
}

export default function RulesPage() {
 return (
 <div style={{ minHeight: '100vh', background: '#050C0A', fontFamily: "'Barlow', sans-serif", color: '#d0ead8' }}>
 <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
 <Nav />

 <div style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 24px 80px' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, color: '#5a8a68', letterSpacing: '3px', marginBottom: '8px' }}>LEGAL DOCUMENT</div>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3rem)', color: 'white', letterSpacing: '2px', lineHeight: 1, marginBottom: '8px' }}>Official Competition Rules</div>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.82rem', color: '#5a8a68', marginBottom: '40px' }}>World Cup Fan Challenge — 2026 FIFA World Cup Tournament · Last updated: May 2026</div>

 {[
 {
 title: '1. No Purchase Necessary',
 body: `NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN. A purchase does not improve your chances of winning. The World Cup Fan Challenge is a skill-based competition. Winners are determined by prediction accuracy and trivia knowledge, not by chance and not by the amount spent on entry fees.

To enter without purchase, visit worldcupfanchallenge.com/auth/signup and create a free account. Free accounts are eligible for non-cash prizes including merchandise and activity books.`,
 },
 {
 title: '2. Eligibility',
 body: `Open to legal residents of the United States and worldwide where not prohibited by law. Participants must be 18 years of age or older to be eligible for cash prizes. Participants under 18 may enter the Junior Fan Challenge and are eligible for non-cash prizes only (merchandise, trophies, activity books).

Participants under 13 require verifiable parental consent (COPPA compliance). A parent or guardian must create the account and add the child's name and date of birth.

Employees of Bartex Enterprise Holdings LLC and their immediate family members are not eligible to win prizes.`,
 },
 {
 title: '3. Tournament Period',
 body: `The competition runs from the platform launch date through July 19, 2026 (the 2026 FIFA World Cup Final).

Bracket picks must be submitted before 12:00 PM Central Time on June 11, 2026. All submitted bracket picks are automatically locked at this time.

Daily match picks must be submitted before the official kickoff time of each individual match. Picks submitted after kickoff will not be accepted.`,
 },
 {
 title: '4. How to Enter',
 body: `1. Visit worldcupfanchallenge.com and create a free account.
2. Submit bracket predictions for World Cup matches before June 11, 2026 at 12:00 PM CT.
3. Submit daily score predictions before each match kickoff.
4. Points are earned based on prediction accuracy as described in Section 5.

Paid entry tiers ($3 Plus, $5 Premium, $10 Champion Founder) unlock eligibility for cash prizes. Payment is processed through PayPal. Entry fees are non-refundable.`,
 },
 {
 title: '5. Scoring System',
 body: `Points are awarded as follows:

Exact score prediction: 8 points
Correct draw prediction: 5 points
Correct winner prediction: 3 points
Correct goal difference: 2 points
Tournament champion correct: 15 points
Runner-up correct: 10 points
Semifinalist correct: 5 points each

Daily bonuses:
Daily streak (consecutive matchdays with picks): +2 points
Underdog pick correct (lower FIFA ranking wins): +3 points
Perfect matchday (all match picks correct): +10 points
Daily point cap: 25 points maximum per matchday (excludes one-time bonuses)

One-time bonuses:
Champion Founder signup: +25 points
Referral bonus: +5 points per paid referral

The Sponsor Operator reserves the right to correct scoring errors. Decisions of the Sponsor Operator regarding scores and standings are final.`,
 },
 {
 title: '6. Prizes',
 body: `All cash prizes are fixed amounts funded directly by Bartex Enterprise Holdings LLC (the Sponsor Operator). Prize amounts are NOT determined by, pooled from, or dependent on entry fees collected.

Premium Entry cash prizes:
Grand Prize: $500 USD (highest total points at tournament end)
Weekly Prize: $100 USD per week (highest points in each tournament week)

Plus Entry cash prizes:
Weekly Prize: $50 USD per week (highest Plus-tier points each tournament week)

Free Entry prizes:
Merchandise prizes, activity books (no cash prizes)

Junior Fan Challenge (under 18) prizes:
Merchandise, trophies, activity books only (no cash prizes)

In the event of a tie, the earliest submission timestamp determines the winner. Cash prizes are paid via PayPal within 7 business days of determination. Winners must provide a valid PayPal account and may be required to provide proof of identity and eligibility.`,
 },
 {
 title: '7. Skill-Based Competition',
 body: `This is a skill-based competition. Winners are determined by the accuracy of predictions, which requires knowledge of soccer, teams, players, and tournament history. The element of skill predominates over chance.

This competition is NOT a lottery, sweepstakes, or game of chance. No random drawing is conducted to determine winners.`,
 },
 {
 title: '8. Disqualification',
 body: `Participants may be disqualified for:
- Using automated tools, bots, or scripts to submit predictions
- Creating multiple accounts to gain unfair advantage
- Colluding with other participants
- Violating these Official Rules
- Providing false eligibility information
- Abusive, threatening, or inappropriate conduct

The Sponsor Operator reserves the right to disqualify any participant at its sole discretion.`,
 },
 {
 title: '9. Privacy & Data',
 body: `Personal information collected during registration (name, email address, date of birth, country) is used solely for competition administration, prize fulfillment, and platform communications. We do not sell personal information to third parties.

For participants under 13, we collect only the minimum necessary information with verifiable parental consent. Parents may request deletion of their child's data at any time by contacting thomasjbartley@worldcupfanchallenge.com.`,
 },
 {
 title: '10. Grassroots Futbol Fund Donations',
 body: `Donations to the Grassroots Futbol Fund are voluntary and separate from competition entry. Donations are not required to enter or win.

Donors may designate which country's youth programs receive their contribution. If no qualifying project exists for the designated country, funds are directed to partner organizations (streetfootballworld, Common Goal) earmarked for that region.

Bartex Enterprise Holdings LLC is applying for 501(c)(3) tax-exempt status. Until status is granted, donations are not tax-deductible. Donors will be notified when 501(c)(3) status is approved.`,
 },
 {
 title: '11. Intellectual Property',
 body: `The World Cup Fan Challenge platform, including all content, design, and scoring systems, is the property of Bartex Enterprise Holdings LLC. This competition is an independent fan competition and is not affiliated with, sponsored by, or endorsed by FIFA, the 2026 FIFA World Cup organizing committee, or any participating national team or federation.`,
 },
 {
 title: '12. Limitation of Liability',
 body: `The Sponsor Operator is not responsible for: technical failures, internet outages, or platform errors that prevent pick submission; incorrect match results published by official sources; acts of God, natural disasters, or events outside reasonable control.

To the maximum extent permitted by law, liability is limited to the value of prizes won.`,
 },
 {
 title: '13. Governing Law & Disputes',
 body: `These Official Rules are governed by the laws of the State of Texas, United States, without regard to conflicts of law principles. Any disputes shall be resolved through binding arbitration in Houston, Texas. By participating, entrants agree to waive the right to a jury trial and to participate in class action lawsuits related to this competition.`,
 },
 {
 title: '14. Contact',
 body: `Sponsor Operator: Bartex Enterprise Holdings LLC
Platform: worldcupfanchallenge.com
Email: thomasjbartley@worldcupfanchallenge.com
Houston, Texas, United States

For questions about these rules, prize claims, or eligibility, contact us at the email above.`,
 },
 ].map(section => (
 <div key={section.title} style={{ marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', color: '#FFD600', letterSpacing: '2px', marginBottom: '12px' }}>{section.title}</div>
 <div style={{ fontFamily: "'Barlow'", fontSize: '0.9rem', color: '#8ab898', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.body}</div>
 </div>
 ))}

 <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', textAlign: 'center' }}>
 <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.8rem', color: '#3a5a42', letterSpacing: '1px', lineHeight: 1.8 }}>Questions? Contact thomasjbartley@worldcupfanchallenge.com<br />
 <Link href="/how-it-works" style={{ color: '#5a8a68' }}>How It Works →</Link>
 &nbsp;·&nbsp;
 <span style={{ color: '#5a8a68' }}>Free entry available →</span>
 </div>
 </div>
 </div>
 </div>
 )
}
