import type { CategoryContent } from './row.js';

/** safety-instruction — generated from DESIGN.md §7. IDS notation is verbatim; ui/glyphs.tsx draws it. */
export const SAFETY_INSTRUCTION: CategoryContent = {
  low: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'please do not', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
    ],
  ],
  mid: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'please do not', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
    ],
  ],
  high: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'be careful, mind', 'prohibition — red circle, diagonal bar', 'mandatory — solid blue circle'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
    ],
  ],
};
