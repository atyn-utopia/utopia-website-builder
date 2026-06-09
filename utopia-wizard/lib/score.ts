/**
 * score.ts — The one place that turns raw check counts into a 0–100 score.
 *
 * The score is the percentage of *applicable* checks that pass: passed / (passed
 * + failed). Skipped checks (missing prerequisites — not deployed yet, Supabase
 * env absent, no price keys, etc.) are "not applicable", not "broken", so they
 * are excluded from the denominator and never drag the score down. This matches
 * the UI tier logic (zero failures ⇒ perfect).
 *
 * Always presents on a clean /100 scale no matter how many checks exist (100,
 * 101, 150…) — adding a check never changes the denominator a site is scored on.
 * 100 is reserved for "zero failures" (floor() guarantees any failure caps at 99).
 */
export function scorePct(passed: number, failed: number): number {
  if (failed <= 0) return passed > 0 ? 100 : 0
  return Math.floor((passed / (passed + failed)) * 100)
}
