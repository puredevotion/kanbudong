import { HAND_RADICAL, ZHI_PHONETIC } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * safety-instruction — generated from DESIGN.md §7, filed by GB 2894
 * category. `freqRank` unset: 指令 is a two-character word and DESIGN.md
 * §7.5.1 gives no corpus rank for it.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 指令 ("to point" + "command" -
 * a genuinely transparent compound: pointing out an order) gets a
 * `WordDecomposition`, backed by a new standalone, 指.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 指 gets a verified CharacterDecomposition alongside its existing
 * mnemonic-only prose, which already named both real components (扌 hand,
 * 旨 "purpose/purport"). MMH's own ideographic hint states 旨 "also provides
 * the pronunciation," and 旨 zhǐ is an exact reading match for 指's own zhǐ.
 */
export const SAFETY_INSTRUCTION: CategoryContent = {
  low: [
    [
      'On a blue sign. What is it telling you to do?',
      [
        'mandatory — solid blue circle',
        'prohibition — red circle, diagonal bar',
        'be careful, mind',
      ],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      {
        hanzi: '指令',
        pinyin: 'zhǐlìng',
        nl: 'gebod — blauwe cirkel',
        en: 'mandatory — solid blue circle',
      },
      {
        kind: 'word',
        hanzi: '指令',
        morphemes: [
          { span: '指', gloss: 'to point' },
          { span: '令', gloss: 'command' },
        ],
      },
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a blue sign. What is it telling you to do?',
      [
        'mandatory — solid blue circle',
        'prohibition — red circle, diagonal bar',
        'be careful, mind',
      ],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      {
        hanzi: '指令',
        pinyin: 'zhǐlìng',
        nl: 'gebod — blauwe cirkel',
        en: 'mandatory — solid blue circle',
      },
      {
        kind: 'word',
        hanzi: '指令',
        morphemes: [
          { span: '指', gloss: 'to point' },
          { span: '令', gloss: 'command' },
        ],
      },
      { tier: 0 },
    ],
  ],
  high: [
    [
      'On a blue sign. What is it telling you to do?',
      [
        'mandatory — solid blue circle',
        'prohibition — red circle, diagonal bar',
        'be careful, mind',
      ],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      {
        hanzi: '指令',
        pinyin: 'zhǐlìng',
        nl: 'gebod — blauwe cirkel',
        en: 'mandatory — solid blue circle',
      },
      {
        kind: 'word',
        hanzi: '指令',
        morphemes: [
          { span: '指', gloss: 'to point' },
          { span: '令', gloss: 'command' },
        ],
      },
      { tier: 0 },
    ],
    [
      'On a blue sign. What is it telling you to do?',
      ['to point', 'command', 'mandatory — solid blue circle'],
      0,
      'zhǐ · wijzen (to point). Seen in 指令 (instruction, command). Picture 指 as a hand (扌) pointing straight at its purpose (旨): zhǐ.',
      { hanzi: '指', pinyin: 'zhǐ', nl: 'wijzen', en: 'to point', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '指',
        components: [
          { componentId: HAND_RADICAL.id, role: 'meaning' },
          { componentId: ZHI_PHONETIC.id, role: 'sound' },
        ],
        semantic_radical: HAND_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
