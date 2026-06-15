import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'

export const metadata: Metadata = {
  title: 'Official Rules \u2014 WCFC',
  description: 'Official rules for the World Cup Fan Challenge 2026. Free to play. No purchase necessary. Skill-based competition open to fans worldwide.',
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
 body: `Entry is free. NO PURCHASE OR DONATION IS NECESSARY TO ENTER OR WIN, AND DONATING DOES NOT IMPROVE YOUR CHANCES. The World Cup Fan Challenge is a free, skill-based competition. Winners are determined solely by prediction accuracy under the published scoring rules.

To enter, visit worldcupfanchallenge.com/auth/signup and create a free account.`,
 },
 {
 title: '2. Eligibility',
 body: `Open to legal residents of the United States and worldwide where not prohibited by law. Participants under 18 may enter the Junior Fan Challenge.

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

All features and prize eligibility are available to every registered user at no cost. Optional donations support youth soccer programs but do not affect scoring, standings, or prize eligibility.`,
 },
 {
 title: '5. Scoring System',
 body: `Points are awarded as follows. All skill-based categories are uncapped.

Match predictions (per match, no cap):
Correct winner prediction: 10 points
Correct draw prediction: 12 points
Correct goal margin (bonus): +5 points
Exact final score (total including above): 25 points

Group-stage bonus (derived from group match picks, no cap):
Correct group winner: +3 points
Correct group runner-up: +2 points

Knockout bracket (no cap):
Each correct Round-of-32 pick: 3 points
Each correct Round-of-16 pick: 5 points
Each correct quarterfinalist: 8 points
Each correct semifinalist: 12 points
Correct runner-up (finalist): 25 points
Correct champion: 50 points

Consistency bonuses (no cap):
Perfect matchday (all match picks correct): +20 points
Correct upset/underdog pick (lower FIFA ranking wins): +5 points

Soft bonuses:
Daily login streak (consecutive matchdays with picks): +2 points per day
Referral bonus: +2 points per referred signup (capped at 10 points per day)
No overall daily point cap.

No points, bonuses, or competitive advantages are granted in exchange for payment or donation. Winners are determined solely by skill (prediction accuracy under the published scoring rules).

The Sponsor Operator reserves the right to correct scoring errors. Decisions of the Sponsor Operator regarding scores and standings are final.`,
 },
 {
 title: '6. Prizes',
 body: `The World Cup Fan Challenge is free to play. The Champion will receive an official Thunder FC jersey and a custom WCFC Champion shirt, plus the Champion badge and placement on the Winners Wall. The winning country earns the "Best World Cup Fans" title.

Additional prizes may be provided by sponsors and donors and will be announced as confirmed. The total value of all prizes awarded will not exceed $5,000.

In the event of a tie, the earliest submission timestamp determines the winner. Winners may be required to provide proof of identity and eligibility. No purchase or donation is necessary to enter or win, and donating does not improve your chances.`,
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
 body: `Donations to the Grassroots Futbol Fund are voluntary and separate from competition entry. Donations are not required to enter or win, and donating does not improve your chances. Donors may receive recognition (badge, Founding Wall placement) but never points, bonuses, or any competitive advantage.

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
 <Link href="/auth/signup" style={{ color: '#5a8a68' }}>Play Free →</Link>
 </div>
 </div>
 </div>
 </div>
 )
}
