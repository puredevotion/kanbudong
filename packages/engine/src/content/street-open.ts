import type { CategoryContent } from './row.js';

/**
 * street-open — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset: 停业 is a two-character word and DESIGN.md §7.5.3 gives
 * no corpus rank for it at all.
 */
export const STREET_OPEN: CategoryContent = {
  low: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      undefined,
      { tier: 2 },
    ],
  ],
  mid: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      undefined,
      { tier: 2 },
    ],
  ],
  high: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'prohibition — red circle, diagonal bar', 'mandatory — solid blue circle'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      undefined,
      { tier: 2 },
    ],
  ],
};
