import type { CategoryContent } from './row.js';

/** safety-instruction — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const SAFETY_INSTRUCTION: CategoryContent = {
  low: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'please do not', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'tíngyè · closed down for good (gesloten, permanent). Unlike 休息 (temporarily closed, e.g. on a break), this means the business will not reopen — so it is not worth waiting outside for.',
    ],
  ],
  mid: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'please do not', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'tíngyè · closed down for good (gesloten, permanent). Unlike 休息 (temporarily closed, e.g. on a break), this means the business will not reopen — so it is not worth waiting outside for.',
    ],
  ],
  high: [
    [
      '停业 — you see this on a sign. What does it mean?',
      ['closed down, ceased trading', 'be careful, mind', 'prohibition — red circle, diagonal bar', 'mandatory — solid blue circle'],
      0,
      'tíngyè · closed down for good (gesloten, permanent). Unlike 休息 (temporarily closed, e.g. on a break), this means the business will not reopen — so it is not worth waiting outside for.',
    ],
  ],
};
