import type { CategoryContent } from './row.js';

/**
 * market-weight — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` is Jun Da's Modern Chinese Character
 * Frequency List (lingua.mtsu.edu/chinese-computing, 193,504,018-character
 * corpus, 9,933 distinct characters, dated 2004-03-30) — a different corpus
 * from the one DESIGN.md's own prose cites, so numbers here do not match
 * DESIGN.md's inline ranks character-for-character.
 */
export const MARKET_WEIGHT: CategoryContent = {
  low: [
    [
      'On a price label. What does it mean?',
      ['yuan (written)', 'shelf life, as a duration', 'special price'],
      0,
      'yuán · yuan. This is the written form of the currency unit, as printed on price tags. Picture 元 as two stacked lines (二) topped by a pair of legs (儿) — a little money-man standing on two banknotes: yuán.',
      { hanzi: '元', pinyin: 'yuán', nl: 'yuan', en: 'yuan (written)' },
      undefined,
      { tier: 0, freqRank: 370, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['yuan (spoken)', '0.1 yuan (spoken)', '2, capital form'],
      0,
      'kuài · yuan (spoken). This is what people say out loud, even though 元 is what gets printed. Picture 块 as 土 earth with a shovel-blade shape (夬) cutting into it — a shovel digging a solid chunk out of the ground: kuài, a "piece" or "chunk" of money.',
      { hanzi: '块', pinyin: 'kuài', nl: 'yuan (spreektaal)', en: 'yuan (spoken)' },
      undefined,
      { tier: 0, freqRank: 793, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['catty = 500 g', 'yuan (written)', 'kilogram = 2 斤'],
      0,
      'jīn · catty = 500 grams. This unit shows up constantly on market signs, worth memorizing early. Picture 斤 as the side-view of an axe blade on its handle — hefting one hand-axe of meat onto the scale comes to about a jīn.',
      { hanzi: '斤', pinyin: 'jīn', nl: 'catty = 500 gram', en: 'catty = 500 g' },
      undefined,
      { tier: 0, freqRank: 1866, glossProvenance: 'mnemonic-only' },
    ],
  ],
  mid: [
    [
      'On a price label. What does it mean?',
      ['50 g, one tenth of a 斤', 'loose, sold by weight', '1, capital form'],
      0,
      'liǎng · 50 grams, one tenth of a 斤. Note: this same character also means "two" in other contexts. Picture 两 as a lid (冂) covering two small weights (the two strokes below it) hanging level on a balance — two equal portions on the scale: liǎng.',
      { hanzi: '两', pinyin: 'liǎng', nl: '50 gram', en: '50 g, one tenth of a 斤' },
      undefined,
      { tier: 1, freqRank: 133, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['gram', 'shelf life, as a duration', 'discount as the fraction you pay'],
      0,
      'kè · gram, the standard metric unit printed on packaged goods. Picture 克 as 十 ten stacked on top of 兄 an older brother straining to lift it — even he can only budge a few grams at a time: kè.',
      { hanzi: '克', pinyin: 'kè', nl: 'gram', en: 'gram' },
      undefined,
      { tier: 1, freqRank: 262, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['kilogram = 2 斤', 'general measure word', 'ten thousand'],
      0,
      'qiānkè · kilogram. Also written 公斤; you will see both forms used on the same shelf.',
      { hanzi: '千克', pinyin: 'qiānkè', nl: 'kilogram', en: 'kilogram = 2 斤' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a price label. What does it mean?',
      ['0.1 yuan (written)', '0.01 yuan', 'day of month (spoken); number'],
      0,
      'jiǎo · 10 cent (written). Still appears on receipts and price labels ending in one decimal. Note: this character is read jiǎo here, but jué in the word 角色 (role/character). Picture 角 as an ox horn sliced (刀) into wedge-shaped sections — one wedge-shaped slice of a yuan: jiǎo.',
      { hanzi: '角', pinyin: 'jiǎo', nl: '10 cent (geschreven)', en: '0.1 yuan (written)' },
      undefined,
      { tier: 2, freqRank: 736, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['0.1 yuan (spoken)', 'discount as the fraction you pay', 'members\' price'],
      0,
      'máo · 10 cent (spoken). This is the spoken partner to 角, just like 块 is the spoken partner to 元. Picture 毛 as a few wispy hairs — loose change so small it is worth about as much as a stray hair: máo.',
      { hanzi: '毛', pinyin: 'máo', nl: '10 cent (spreektaal)', en: '0.1 yuan (spoken)' },
      undefined,
      { tier: 2, freqRank: 623, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a price label. What does it mean?',
      ['0.01 yuan', 'o\'clock (spoken)', 'day of month (spoken); number'],
      0,
      'fēn · cent. Rarely used as cash anymore, but still printed on itemized receipts. Note: this character is also read fèn in other words (like 部分, 分量), and fēn is likewise the word for "minute." Picture 分 as a knife (刀) cutting something into eight (八) equal slivers — slicing a yuan down to its smallest piece: fēn.',
      { hanzi: '分', pinyin: 'fēn', nl: 'cent', en: '0.01 yuan' },
      undefined,
      { tier: 2, freqRank: 79, glossProvenance: 'mnemonic-only' },
    ],
  ],
};
