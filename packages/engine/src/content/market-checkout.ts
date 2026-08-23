import type { CategoryContent } from './row.js';

/** market-checkout — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MARKET_CHECKOUT: CategoryContent = {
  low: [
    [
      '超市 — you see this on a sign. What does it mean?',
      ['supermarket', 'o\'clock; time', 'net content', '0.1 yuan (spoken)'],
      0,
      'chāoshì · supermarkt (supermarket).',
    ],
  ],
  mid: [
    [
      '超市 — you see this on a sign. What does it mean?',
      ['supermarket', 'o\'clock; time', 'shelf life, as a duration', 'kilogram = 2 斤'],
      0,
      'chāoshì · supermarkt (supermarket).',
    ],
    [
      '便利店 — you see this on a sign. What does it mean?',
      ['convenience store', '2, capital form', 'long thin things — fish, streets, trousers', 'garments, items, matters'],
      0,
      'biànlìdiàn · buurtwinkel (convenience store). 便 is pronounced biàn here, but pián in 便宜 (cheap) — same character, different reading.',
    ],
    [
      '收银台 — you see this on a sign. What does it mean?',
      ['checkout', 'shelf life, as a duration', 'net content', 'settle up, pay'],
      0,
      'shōuyíntái · kassa (checkout). Often shortened to just 收银 on overhead lane signs.',
    ],
    [
      '结账 — you see this on a sign. What does it mean?',
      ['settle up, pay', 'weigh here', 'special price', '1, capital form'],
      0,
      'jiézhàng · afrekenen (settle up, pay).',
    ],
    [
      '扫码 — you see this on a sign. What does it mean?',
      ['scan the QR code', 'hundred million', 'flat things — tickets, cards, tables', '0.1 yuan (spoken)'],
      0,
      'sǎomǎ · scannen, QR-code scannen (scan the QR code). The standard way to say "scan to pay" in China.',
    ],
    [
      '百 — you see this on a sign. What does it mean?',
      ['hundred', 'refrigerate, 0–4 °C', 'hundred million', 'bottle'],
      0,
      'bǎi · honderd (hundred). Below 10,000, Chinese numbers work just like European ones.',
    ],
    [
      '千 — you see this on a sign. What does it mean?',
      ['thousand', 'settle up, pay', '2, capital form', 'freeze, −18 °C'],
      0,
      'qiān · duizend (thousand). The last unit before Chinese numbers start grouping by 10,000 instead of 1,000.',
    ],
    [
      '万 — you see this on a sign. What does it mean?',
      ['ten thousand', 'freeze, −18 °C', 'garments, items, matters', 'refrigerate, 0–4 °C'],
      0,
      'wàn · tienduizend (ten thousand). Chinese groups numbers by 10,000, not 1,000, so 十万 = 100,000 and 一百万 = 1,000,000 — misreading this is an easy way to be off by a factor of ten.',
    ],
  ],
  high: [
    [
      '亿 — you see this on a sign. What does it mean?',
      ['hundred million', 'o\'clock (spoken)', 'animals, one of a pair, some containers', '2, capital form'],
      0,
      'yì · honderd miljoen (hundred million, 10⁸). Seen on property prices, news tickers, and lottery boards — it\'s the next step up from 万 in China\'s 10,000-based number grouping.',
    ],
    [
      '壹 — you see this on a sign. What does it mean?',
      ['1, capital form', 'production date', 'animals, one of a pair, some containers', 'freeze, −18 °C'],
      0,
      'yī · 1, de formele schrijfwijze voor documenten (the "capital form" used on official documents, to prevent fraud). A 100-yuan note reads 壹佰圆 — recognizing this character is the difference between reading a banknote and just looking at one.',
    ],
    [
      '贰 — you see this on a sign. What does it mean?',
      ['2, capital form', 'settle up, pay', 'kilogram = 2 斤', 'garments, items, matters'],
      0,
      'èr · 2, de formele schrijfwijze voor documenten (capital form). It contains both the ordinary 二 it stands in for and the money radical 贝 — the one capital-form numeral you can partly guess at.',
    ],
    [
      '叁 — you see this on a sign. What does it mean?',
      ['3, capital form', 'half', '50 g, one tenth of a 斤', 'hundred'],
      0,
      'sān · 3, de formele schrijfwijze voor documenten (capital form). It contains its own 三, the same way 贰 contains 二. This is the mainland simplified form; traditional documents use 叄 instead.',
    ],
  ],
};
