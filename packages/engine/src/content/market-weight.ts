import type { CategoryContent } from './row.js';

/** market-weight — generated from DESIGN.md §7. IDS notation is verbatim; ui/glyphs.tsx draws it. */
export const MARKET_WEIGHT: CategoryContent = {
  low: [
    [
      '元 — you see this on a sign. What does it mean?',
      ['yuan (written)', 'animals, one of a pair, some containers', 'shelf life, as a duration', 'special price'],
      0,
      'yuán · yuan. Rank 211; the printed currency unit',
    ],
    [
      '块 — you see this on a sign. What does it mean?',
      ['yuan (spoken)', '0.1 yuan (spoken)', 'imported', '2, capital form'],
      0,
      'kuài · yuan (spreektaal). Rank 815; what you hear, never what you read',
    ],
    [
      '斤 — you see this on a sign. What does it mean?',
      ['catty = 500 g', 'yuan (written)', 'kilogram = 2 斤', 'special price'],
      0,
      'jīn · catty = 500 gram. The single highest-value arithmetic fact in the app',
    ],
  ],
  mid: [
    [
      '两 — you see this on a sign. What does it mean?',
      ['50 g, one tenth of a 斤', 'checkout', 'loose, sold by weight', '1, capital form'],
      0,
      'liǎng · 50 gram. Rank 113 as "two" — the unit sense is invisible to frequency',
    ],
    [
      '克 — you see this on a sign. What does it mean?',
      ['gram', 'bowl', 'shelf life, as a duration', 'discount as the fraction you pay'],
      0,
      'kè · gram. Rank 406; the honest unit, printed on packaged goods',
    ],
    [
      '千克 — you see this on a sign. What does it mean?',
      ['kilogram = 2 斤', 'general measure word', 'pairs', 'ten thousand'],
      0,
      'qiānkè · kilogram. Also written 公斤; both forms appear on the same shelf',
    ],
  ],
  high: [
    [
      '角 — you see this on a sign. What does it mean?',
      ['0.1 yuan (written)', 'checkout', '0.01 yuan', 'day of month (spoken); number'],
      0,
      'jiǎo · 10 cent (geschreven). Survives on receipts and price labels ending in a single decimal. Heteronym flag: jiǎo here, jué in 角色 — token-level pinyin.',
    ],
    [
      '毛 — you see this on a sign. What does it mean?',
      ['0.1 yuan (spoken)', 'discount as the fraction you pay', 'net content', 'members\' price'],
      0,
      'máo · 10 cent (spreektaal). The spoken partner to 角, exactly parallel to 元/块.',
    ],
    [
      '分 — you see this on a sign. What does it mean?',
      ['0.01 yuan', 'convenience store', 'o\'clock (spoken)', 'day of month (spoken); number'],
      0,
      'fēn · cent. Effectively extinct as cash, still printed on itemised receipts. Heteronym flag: 分 is fēn and fèn (部分, 分量) — a genuine two-reading character, not merely polysemous. Also "minute" in §7.6.4, at the same fēn reading.',
    ],
  ],
};
