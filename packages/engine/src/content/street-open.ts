import type { CategoryContent } from './row.js';

/**
 * street-open — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset: 停业 is a two-character word and DESIGN.md §7.5.3 gives
 * no corpus rank for it at all.
 *
 * 时/点 moved here from market-panel: both were authored with the packet-label
 * prompt and rendered inside PackageLabel's fixed shelf-life chrome even
 * though neither is a package field - a confirmed content bug. Reading a
 * clock/business-hours character genuinely happens on a shop door's opening-
 * hours plaque, which is what this category already models, so they are
 * relocated rather than forced back into a mismatched template.
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
    [
      'On a shop door. What does it mean?',
      ['o\'clock; time', 'members\' price', 'scan the QR code'],
      0,
      'shí · uur; tijd (o\'clock; time). Opening-hours plaques show 营业时间 09:00–22:00 in 24-hour numbers, so mostly you just need to read the digits.',
      {
        hanzi: '时',
        pinyin: 'shí',
        nl: 'uur; tijd',
        en: 'o\'clock; time',
        context: { before: '营业', after: '间 09:00–22:00' },
      },
      undefined,
      { tier: 1, freqRank: 25 },
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
    [
      'On a shop door. What does it mean?',
      ['o\'clock (spoken)', 'day of month (spoken); number', 'yuan (spoken)'],
      0,
      'diǎn · uur (spreektaal, o\'clock). E.g. 晚上十点打烊 = closes at 10pm — the characters don\'t say morning or afternoon on their own, so you get that from context. Often paired with 半.',
      {
        hanzi: '点',
        pinyin: 'diǎn',
        nl: 'uur (spreektaal)',
        en: 'o\'clock (spoken)',
        context: { before: '晚上十', after: '打烊' },
      },
      undefined,
      { tier: 1, freqRank: 128 },
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
