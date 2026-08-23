import { describe, expect, it } from 'vitest';

import { buildSoloQueue, nextSoloItem, reviewItem, SEED_PACK } from '../src/index.js';
import type { ItemMemory, QuestionId } from '../src/index.js';

const DAY = 86_400_000;

function memoryMap(entries: Record<QuestionId, ItemMemory>) {
  return (id: QuestionId): ItemMemory | null => entries[id] ?? null;
}

describe('buildSoloQueue', () => {
  it('treats every item as fresh with no memory at all', () => {
    const now = Date.now();
    const queue = buildSoloQueue(SEED_PACK, () => null, now);
    expect(queue.due).toHaveLength(0);
    expect(queue.fresh).toHaveLength(SEED_PACK.questions.length);
  });

  it('puts an overdue item in the due queue and a just-reviewed one in neither', () => {
    const now = Date.now();
    const [a, b] = SEED_PACK.questions;
    if (a === undefined || b === undefined) throw new Error('pack too small for this test');

    const overdue = reviewItem(null, 'good', now - 100 * DAY)!;
    const fresh = reviewItem(null, 'good', now)!;

    const queue = buildSoloQueue(SEED_PACK, memoryMap({ [a.id]: overdue, [b.id]: fresh }), now);

    expect(queue.due.map((q) => q.id)).toContain(a.id);
    expect(queue.due.map((q) => q.id)).not.toContain(b.id);
    expect(queue.fresh.map((q) => q.id)).not.toContain(a.id);
    expect(queue.fresh.map((q) => q.id)).not.toContain(b.id);
  });
});

describe('buildSoloQueue morning-after queue (§6.5)', () => {
  it('puts an item seeded by a group session ahead of other due items the next day', () => {
    const now = Date.now();
    const [a, b] = SEED_PACK.questions;
    if (a === undefined || b === undefined) throw new Error('pack too small for this test');

    // Both are due; `b` is the more overdue one by construction.
    const seededYesterday = reviewItem(null, 'hard', now - 2 * DAY)!;
    const overdueForLonger = reviewItem(null, 'good', now - 100 * DAY)!;

    const queue = buildSoloQueue(
      SEED_PACK,
      memoryMap({ [a.id]: seededYesterday, [b.id]: overdueForLonger }),
      now,
      new Set([a.id]),
    );

    expect(queue.due[0]?.id).toBe(a.id);
  });

  it('with an empty seeded set, falls back to due-ness ordering exactly as before', () => {
    const now = Date.now();
    const [a, b] = SEED_PACK.questions;
    if (a === undefined || b === undefined) throw new Error('pack too small for this test');
    const overdue = reviewItem(null, 'good', now - 100 * DAY)!;
    const lessOverdue = reviewItem(null, 'good', now - 50 * DAY)!;
    const queue = buildSoloQueue(
      SEED_PACK,
      memoryMap({ [a.id]: overdue, [b.id]: lessOverdue }),
      now,
    );
    expect(queue.due[0]?.id).toBe(a.id);
  });
});

describe('nextSoloItem', () => {
  it('prefers due items over fresh ones', () => {
    const now = Date.now();
    const [a, b] = SEED_PACK.questions;
    if (a === undefined || b === undefined) throw new Error('pack too small for this test');
    const overdue = reviewItem(null, 'good', now - 100 * DAY)!;
    const queue = buildSoloQueue(SEED_PACK, memoryMap({ [a.id]: overdue }), now);
    const next = nextSoloItem(queue, new Set());
    expect(next?.id).toBe(a.id);
  });

  it('skips items already presented this session', () => {
    const now = Date.now();
    const queue = buildSoloQueue(SEED_PACK, () => null, now);
    const first = nextSoloItem(queue, new Set());
    expect(first).not.toBeNull();
    const second = nextSoloItem(queue, new Set([first!.id]));
    expect(second?.id).not.toBe(first!.id);
  });

  it('returns null once every candidate has been presented', () => {
    const now = Date.now();
    const queue = buildSoloQueue(SEED_PACK, () => null, now);
    const all = new Set(queue.fresh.map((q) => q.id));
    expect(nextSoloItem(queue, all)).toBeNull();
  });
});
