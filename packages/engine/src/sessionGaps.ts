/**
 * DESIGN.md §12.2's falsification instrument: "instrument `sessions_per_week`
 * and `days_between_sessions` split by mode from the first cohort. If the
 * median multiplayer gap exceeds ~7 days while solo sits under ~3, invert
 * the architecture." This module only computes the gap from a stream of
 * session-start timestamps the caller records - per PLAN.md Phase 9, "get it
 * logging early even if nothing consumes it yet."
 */

import type { AttemptMode } from './attemptLog.js';

const MS_PER_DAY = 86_400_000;

export interface SessionEvent {
  readonly mode: AttemptMode;
  /** When this session began, per the caller's clock. */
  readonly startedAt: number;
}

/**
 * Gaps in days between consecutive session starts of one mode, oldest pair
 * first. A single session (or none) has no gap to report, so the result is
 * empty rather than `[0]` or `[NaN]`.
 */
export function daysBetweenSessions(events: readonly SessionEvent[], mode: AttemptMode): number[] {
  const starts = events
    .filter((e) => e.mode === mode)
    .map((e) => e.startedAt)
    .sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i += 1) {
    gaps.push(((starts[i] as number) - (starts[i - 1] as number)) / MS_PER_DAY);
  }
  return gaps;
}

/** The median of a list of day-gaps, or `null` when there are none - never coerced to 0. */
export function medianDays(gaps: readonly number[]): number | null {
  if (gaps.length === 0) return null;
  const sorted = [...gaps].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
    : (sorted[mid] as number);
}
