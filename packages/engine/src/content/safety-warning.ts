import type { CategoryContent } from './row.js';

/**
 * safety-warning — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset throughout: DESIGN.md §7.5.1/§7.5.2 only cite per-character
 * corpus ranks for 心/小 individually, never a word-level rank for 警告,
 * 小心, 注意 or 当心 as spans.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 警告/小心/注意/当心 all get
 * `WordDecomposition`s - four standard, transparent Chinese warning
 * constructions. New standalones: 警 (警告), 心 (shared by 小心, 当心 and
 * transit-ticket.ts's 中心) and 注 (注意). 告/小/意/当 are not separately
 * authored - each word already resolves via its other newly-authored
 * morpheme.
 */
export const SAFETY_WARNING: CategoryContent = {
  low: [
    [
      'On a yellow sign. What is it warning you about?',
      ['warning — yellow triangle, black border', 'be careful, mind', 'prohibition — red circle, diagonal bar'],
      0,
      'jǐnggào · waarschuwing — gele driehoek (warning — yellow triangle). Yellow warns you of a hazard; red (prohibition) tells you what you may not do — worth telling apart.',
      { hanzi: '警告', pinyin: 'jǐnggào', nl: 'waarschuwing — gele driehoek', en: 'warning — yellow triangle, black border' },
      { kind: 'word', hanzi: '警告', morphemes: [
        { span: '警', gloss: 'to alert' },
        { span: '告', gloss: 'to tell, inform' },
      ] },
      { tier: 0 },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['be careful, mind', 'beware', 'strictly forbidden'],
      0,
      'xiǎoxīn · voorzichtig, pas op (be careful, mind). Common warnings using it: 小心地滑 (mind the slippery floor) and 小心台阶 (mind the step).',
      { hanzi: '小心', pinyin: 'xiǎoxīn', nl: 'voorzichtig, pas op', en: 'be careful, mind' },
      { kind: 'word', hanzi: '小心', morphemes: [
        { span: '小', gloss: 'small' },
        { span: '心', gloss: 'heart' },
      ] },
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
      { kind: 'word', hanzi: '注意', morphemes: [
        { span: '注', gloss: 'to pour, focus' },
        { span: '意', gloss: 'meaning, intent' },
      ] },
      { tier: 1 },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['beware', 'danger', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op (beware). A more formal version of 小心, often seen on yellow warning signs such as 当心碰头 (mind your head).',
      { hanzi: '当心', pinyin: 'dāngxīn', nl: 'pas op', en: 'beware' },
      { kind: 'word', hanzi: '当心', morphemes: [
        { span: '当', gloss: 'to face, this' },
        { span: '心', gloss: 'heart' },
      ] },
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
      { kind: 'word', hanzi: '当心', morphemes: [
        { span: '当', gloss: 'to face, this' },
        { span: '心', gloss: 'heart' },
      ] },
      { tier: 1 },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['to alert', 'to tell, inform', 'attention'],
      0,
      'jǐng · waarschuwen (to alert). Seen in 警告 (warning). Picture 警 as respectful (敬) words (言) raised loud enough to put everyone on alert: jǐng.',
      { hanzi: '警', pinyin: 'jǐng', nl: 'waarschuwen', en: 'to alert' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['heart', 'to alert', 'to pour, focus'],
      0,
      'xīn · hart (heart). Seen in 小心 (be careful, literally "small heart") and 当心 (beware). Picture 心 as a heart drawn as three drops curling around a single stroke: xīn.',
      { hanzi: '心', pinyin: 'xīn', nl: 'hart', en: 'heart' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a yellow sign. What is it warning you about?',
      ['to pour, focus', 'heart', 'to alert'],
      0,
      'zhù · gieten, richten (to pour, focus). Seen in 注意 (attention, literally "pour in meaning"). Picture 注 as water (氵) poured by its own master\'s (主) hand, aimed exactly where it\'s needed: zhù.',
      { hanzi: '注', pinyin: 'zhù', nl: 'gieten, richten', en: 'to pour, focus' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
