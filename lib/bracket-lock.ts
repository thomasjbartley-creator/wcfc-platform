/**
 * Bracket lock time: 1 hour before the first game.
 * First game: June 11, 2026, 1:00 PM CT (CDT = UTC-5)
 * Lock time:  June 11, 2026, 12:00 PM CT = 2026-06-11 17:00:00 UTC
 *
 * This constant is the SINGLE SOURCE OF TRUTH for all lock checks:
 * - API save/submit guard
 * - Auto-submit + lock job
 * - UI lock state
 */
export const BRACKET_LOCK_UTC = '2026-06-11T17:00:00Z'

export function isBracketLocked(): boolean {
  return new Date() >= new Date(BRACKET_LOCK_UTC)
}
