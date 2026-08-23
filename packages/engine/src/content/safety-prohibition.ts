import { ALTAR_RADICAL, SPEECH_RADICAL } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * safety-prohibition — generated from DESIGN.md §7, filed by GB 2894
 * category. `freqRank` unset throughout: DESIGN.md §7.5.2 only cites
 * per-character corpus ranks for 禁/止/严/勿 individually, never a rank for
 * the two-character words 禁止/请勿/严禁 as spans, so no word-level figure is
 * available to cite honestly.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 禁止/请勿/严禁 all get
 * `WordDecomposition`s - each a standard, transparent Chinese prohibition
 * construction. 禁止 and 严禁 share a new standalone, 禁; 请勿 gets its own new
 * standalone, 请. 止/勿/严 are not separately authored - each word already
 * resolves via its other, newly-authored morpheme.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 禁/请 both get a verified CharacterDecomposition alongside their existing
 * mnemonic-only prose - both mnemonics already named a real component (禁's
 * 示, "shrine"; 请's 讠, "speech") before this pass added a matching
 * decomposition field. Neither rejected phonetic half (禁's 林, 请's 青) is an
 * exact tone-and-syllable match, so both ship semantic-only.
 */
export const SAFETY_PROHIBITION: CategoryContent = {
  low: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'strictly forbidden', 'beware'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      {
        hanzi: '禁止',
        pinyin: 'jìnzhǐ',
        nl: 'verbod — rode cirkel met streep',
        en: 'prohibition — red circle, diagonal bar',
      },
      {
        kind: 'word',
        hanzi: '禁止',
        morphemes: [
          { span: '禁', gloss: 'to forbid' },
          { span: '止', gloss: 'to stop' },
        ],
      },
      { tier: 0 },
    ],
    [
      'On a sign. What is forbidden?',
      ['please do not', 'mandatory — solid blue circle', 'warning — yellow triangle, black border'],
      0,
      'qǐngwù · gelieve niet. The polite register. Same force as 禁止 in practice — a traveller who reads 请勿 as a suggestion is wrong. 勿 appears almost nowhere else, which is exactly why it is unambiguous once known.',
      { hanzi: '请勿', pinyin: 'qǐngwù', nl: 'gelieve niet', en: 'please do not' },
      {
        kind: 'word',
        hanzi: '请勿',
        morphemes: [
          { span: '请', gloss: 'please' },
          { span: '勿', gloss: 'do not' },
        ],
      },
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'beware', 'please do not'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      {
        hanzi: '禁止',
        pinyin: 'jìnzhǐ',
        nl: 'verbod — rode cirkel met streep',
        en: 'prohibition — red circle, diagonal bar',
      },
      {
        kind: 'word',
        hanzi: '禁止',
        morphemes: [
          { span: '禁', gloss: 'to forbid' },
          { span: '止', gloss: 'to stop' },
        ],
      },
      { tier: 0 },
    ],
    [
      'On a sign. What is forbidden?',
      [
        'strictly forbidden',
        'warning — yellow triangle, black border',
        'prohibition — red circle, diagonal bar',
      ],
      0,
      'yánjìn · streng verboden (strictly forbidden). The strongest prohibition wording; also appears in 严禁烟火 (fire and smoking strictly forbidden).',
      { hanzi: '严禁', pinyin: 'yánjìn', nl: 'streng verboden', en: 'strictly forbidden' },
      {
        kind: 'word',
        hanzi: '严禁',
        morphemes: [
          { span: '严', gloss: 'strict' },
          { span: '禁', gloss: 'to forbid' },
        ],
      },
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'notice, safe condition — green square', 'danger'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      {
        hanzi: '禁止',
        pinyin: 'jìnzhǐ',
        nl: 'verbod — rode cirkel met streep',
        en: 'prohibition — red circle, diagonal bar',
      },
      {
        kind: 'word',
        hanzi: '禁止',
        morphemes: [
          { span: '禁', gloss: 'to forbid' },
          { span: '止', gloss: 'to stop' },
        ],
      },
      { tier: 0 },
    ],
    [
      'On a sign. What is forbidden?',
      ['to forbid', 'to stop', 'strictly forbidden'],
      0,
      'jìn · verbieden (to forbid). Seen in 禁止 (prohibition) and 严禁 (strictly forbidden). Picture 禁 as two trees (林) fenced off in front of a shrine (示) - forbidden ground: jìn.',
      { hanzi: '禁', pinyin: 'jìn', nl: 'verbieden', en: 'to forbid', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '禁',
        components: [{ componentId: ALTAR_RADICAL.id, role: 'meaning' }],
        semantic_radical: ALTAR_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a sign. What is forbidden?',
      ['please', 'do not', 'to forbid'],
      0,
      'qǐng · alstublieft (please). Seen in 请勿 (please do not). Picture 请 as fresh, young (青) words (讠), spoken as politely as anyone can manage: qǐng.',
      { hanzi: '请', pinyin: 'qǐng', nl: 'alstublieft', en: 'please', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '请',
        components: [{ componentId: SPEECH_RADICAL.id, role: 'meaning' }],
        semantic_radical: SPEECH_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
