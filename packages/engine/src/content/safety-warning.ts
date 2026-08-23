import type { CategoryContent } from './row.js';

/**
 * safety-warning — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset throughout: DESIGN.md §7.5.1/§7.5.2 only cite per-character
 * corpus ranks for 心/小 individually, never a word-level rank for 警告,
 * 小心, 注意 or 当心 as spans.
 */
export const SAFETY_WARNING: CategoryContent = {
  low: [
    [
      'On a yellow sign. What is it warning you about?',
      ['warning — yellow triangle, black border', 'be careful, mind', 'prohibition — red circle, diagonal bar'],
      0,
      'jǐnggào · waarschuwing — gele driehoek (warning — yellow triangle). Yellow warns you of a hazard; red (prohibition) tells you what you may not do — worth telling apart.',
      { hanzi: '警告', pinyin: 'jǐnggào', nl: 'waarschuwing — gele driehoek', en: 'warning — yellow triangle, black border' },
      undefined,
      { tier: 0 },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['be careful, mind', 'beware', 'strictly forbidden'],
      0,
      'xiǎoxīn · voorzichtig, pas op (be careful, mind). Common warnings using it: 小心地滑 (mind the slippery floor) and 小心台阶 (mind the step).',
      { hanzi: '小心', pinyin: 'xiǎoxīn', nl: 'voorzichtig, pas op', en: 'be careful, mind' },
      undefined,
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a yellow sign. What is it warning you about?',
      ['attention', 'danger', 'prohibition — red circle, diagonal bar'],
      0,
      'zhùyì · let op (attention). Flags a hazard without saying how serious it is.',
      { hanzi: '注意', pinyin: 'zhùyì', nl: 'let op', en: 'attention' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['beware', 'danger', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op (beware). A more formal version of 小心, often seen on yellow warning signs such as 当心碰头 (mind your head).',
      { hanzi: '当心', pinyin: 'dāngxīn', nl: 'pas op', en: 'beware' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a yellow sign. What is it warning you about?',
      ['beware', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op (beware). A more formal version of 小心, often seen on yellow warning signs such as 当心碰头 (mind your head).',
      { hanzi: '当心', pinyin: 'dāngxīn', nl: 'pas op', en: 'beware' },
      undefined,
      { tier: 1 },
    ],
  ],
};
