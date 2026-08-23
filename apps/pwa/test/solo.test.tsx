import { createIdentity, SEED_PACK } from '@kanbudong/engine';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Solo } from '../src/screens/Solo.jsx';
import { useApp } from '../src/lib/store.js';

/**
 * Mirrors soloMemory.ts's private storage key format (it exports no
 * constant) - this is the only way to seed the queue from outside that
 * module without adding new engine-side test-only exports.
 */
function soloMemoryKey(playerId: string): string {
  return `kanbudong.soloMemory.v2.${playerId}`;
}

/** Marks every pack item as reviewed and comfortably not due, so the solo queue treats it as satisfied. */
function seedSatisfiedMemory(playerId: string, now: number, exceptId?: string): void {
  const memory: Record<string, { stability: number; difficulty: number; lastReview: number }> = {};
  for (const question of SEED_PACK.questions) {
    if (question.id === exceptId) continue;
    memory[question.id] = { stability: 36_500, difficulty: 1, lastReview: now };
  }
  globalThis.localStorage.setItem(soloMemoryKey(playerId), JSON.stringify(memory));
}

beforeEach(() => {
  globalThis.localStorage.clear();
});

afterEach(() => {
  cleanup();
  useApp.setState({ identity: null });
  globalThis.localStorage.clear();
  vi.useRealTimers();
});

describe('Solo', () => {
  it('renders the practice screen without throwing when the queue has due items', () => {
    const identity = createIdentity('Ada');
    useApp.setState({ identity });

    const { getByText } = render(<Solo />);
    expect(getByText(/of up to/)).toBeTruthy();
  });

  it('reaches session-complete on first render without throwing when nothing is due', () => {
    const identity = createIdentity('Ada');
    seedSatisfiedMemory(identity.id, Date.now());
    useApp.setState({ identity });

    const { getByText } = render(<Solo />);
    expect(getByText('Session complete')).toBeTruthy();
    expect(getByText("Nothing was due — you're caught up.")).toBeTruthy();
  });

  /**
   * Reproduces the actual crash from commit f0e0859: the `siblings`/
   * `confusables` `useMemo` calls landed after Solo.tsx's early returns, so
   * they ran on every mid-session render but were silently skipped the
   * instant a session transitioned into "Session complete" - a hook-count
   * mismatch between two renders of the *same* mounted instance, which is
   * what React error #310 actually detects. A session that starts already
   * complete (the test above) never re-renders across that boundary and so
   * cannot catch this class of bug; only driving a real due-item through to
   * completion does. One fresh item is seeded so the session ends after a
   * single answer.
   */
  it('does not crash transitioning from an active question to session-complete (regression: f0e0859)', async () => {
    vi.useFakeTimers();
    const identity = createIdentity('Ada');
    const lastItem = SEED_PACK.questions.at(-1);
    if (lastItem === undefined) throw new Error('SEED_PACK has no questions');
    seedSatisfiedMemory(identity.id, Date.now(), lastItem.id);
    useApp.setState({ identity });

    const { getByText, getByRole, getAllByRole } = render(<Solo />);
    expect(getByText(lastItem.prompt)).toBeTruthy();

    const optionButtons = getAllByRole('button').filter(
      (button) => button.textContent !== 'Stop for now',
    );
    const firstOption = optionButtons[0];
    if (firstOption === undefined) throw new Error('no answer options rendered');
    fireEvent.click(firstOption);

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });

    fireEvent.click(getByRole('button', { name: 'Next' }));

    expect(getByText('Session complete')).toBeTruthy();
  });

  /**
   * StrokeOrderPanel (apps/pwa/src/ui/reveal.tsx) is wired in right after
   * DecompositionPanel inside the tap-gated breakdown - this drives all the
   * way to that tap so a regression in its coverage fetch or hanzi-writer
   * mount (jsdom has no layout engine, but hanzi-writer's SVG renderer must
   * not throw constructing one) would actually be exercised, not just the
   * panel's own no-op "not shown yet" branch every other reveal test stops
   * before reaching.
   */
  it('does not crash opening the breakdown, where StrokeOrderPanel now mounts', async () => {
    vi.useFakeTimers();
    const identity = createIdentity('Ada');
    const lastItem = SEED_PACK.questions.at(-1);
    if (lastItem === undefined) throw new Error('SEED_PACK has no questions');
    seedSatisfiedMemory(identity.id, Date.now(), lastItem.id);
    useApp.setState({ identity });

    const { getByText, queryByText, getAllByRole } = render(<Solo />);
    const optionButtons = getAllByRole('button').filter(
      (button) => button.textContent !== 'Stop for now',
    );
    const firstOption = optionButtons[0];
    if (firstOption === undefined) throw new Error('no answer options rendered');
    fireEvent.click(firstOption);

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });

    fireEvent.click(getByText('Show the breakdown'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryByText('Show the breakdown')).toBeNull();
    expect(getByText('Next')).toBeTruthy();
  });
});
