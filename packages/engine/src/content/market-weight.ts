import type { CategoryContent } from './row.js';

/** market-weight — generated from DESIGN.md §7. IDS notation verbatim; ui/glyphs.tsx draws it. */
export const MARKET_WEIGHT: CategoryContent = {
  low: [
    [
      'On a price label. What does it mean?',
      ['yuan (written)', 'animals, one of a pair, some containers', 'shelf life, as a duration', 'special price'],
      0,
      'yuán · yuan. This is the written form of the currency unit, as printed on price tags.',
      { hanzi: '元', pinyin: 'yuán', nl: 'yuan' },
    ],
    [
      'On a price label. What does it mean?',
      ['yuan (spoken)', '0.1 yuan (spoken)', 'imported', '2, capital form'],
      0,
      'kuài · yuan (spoken). This is what people say out loud, even though 元 is what gets printed.',
      { hanzi: '块', pinyin: 'kuài', nl: 'yuan (spreektaal)' },
    ],
    [
      'On a price label. What does it mean?',
      ['catty = 500 g', 'yuan (written)', 'kilogram = 2 斤', 'special price'],
      0,
      'jīn · catty = 500 grams. This unit shows up constantly on market signs, worth memorizing early.',
      { hanzi: '斤', pinyin: 'jīn', nl: 'catty = 500 gram' },
    ],
  ],
  mid: [
    [
      'On a price label. What does it mean?',
      ['50 g, one tenth of a 斤', 'checkout', 'loose, sold by weight', '1, capital form'],
      0,
      'liǎng · 50 grams, one tenth of a 斤. Note: this same character also means "two" in other contexts.',
      { hanzi: '两', pinyin: 'liǎng', nl: '50 gram' },
    ],
    [
      'On a price label. What does it mean?',
      ['gram', 'bowl', 'shelf life, as a duration', 'discount as the fraction you pay'],
      0,
      'kè · gram, the standard metric unit printed on packaged goods.',
      { hanzi: '克', pinyin: 'kè', nl: 'gram' },
    ],
    [
      'On a price label. What does it mean?',
      ['kilogram = 2 斤', 'general measure word', 'pairs', 'ten thousand'],
      0,
      'qiānkè · kilogram. Also written 公斤; you will see both forms used on the same shelf.',
      { hanzi: '千克', pinyin: 'qiānkè', nl: 'kilogram' },
    ],
  ],
  high: [
    [
      'On a price label. What does it mean?',
      ['0.1 yuan (written)', 'checkout', '0.01 yuan', 'day of month (spoken); number'],
      0,
      'jiǎo · 10 cent (written). Still appears on receipts and price labels ending in one decimal. Note: this character is read jiǎo here, but jué in the word 角色 (role/character).',
      { hanzi: '角', pinyin: 'jiǎo', nl: '10 cent (geschreven)' },
    ],
    [
      'On a price label. What does it mean?',
      ['0.1 yuan (spoken)', 'discount as the fraction you pay', 'net content', 'members\' price'],
      0,
      'máo · 10 cent (spoken). This is the spoken partner to 角, just like 块 is the spoken partner to 元.',
      { hanzi: '毛', pinyin: 'máo', nl: '10 cent (spreektaal)' },
    ],
    [
      'On a price label. What does it mean?',
      ['0.01 yuan', 'convenience store', 'o\'clock (spoken)', 'day of month (spoken); number'],
      0,
      'fēn · cent. Rarely used as cash anymore, but still printed on itemized receipts. Note: this character is also read fèn in other words (like 部分, 分量), and fēn is likewise the word for "minute."',
      { hanzi: '分', pinyin: 'fēn', nl: 'cent' },
    ],
  ],
};
