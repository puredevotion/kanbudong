import type { CategoryContent } from './row.js';

/** market-checkout — generated from DESIGN.md §7. IDS notation is verbatim; ui/glyphs.tsx draws it. */
export const MARKET_CHECKOUT: CategoryContent = {
  low: [
    [
      '超市 — you see this on a sign. What does it mean?',
      ['supermarket', 'o\'clock; time', 'net content', '0.1 yuan (spoken)'],
      0,
      'chāoshì · supermarkt. Both characters top-1000; the compound is the shopfront',
    ],
  ],
  mid: [
    [
      '超市 — you see this on a sign. What does it mean?',
      ['supermarket', 'o\'clock; time', 'shelf life, as a duration', 'kilogram = 2 斤'],
      0,
      'chāoshì · supermarkt. Both characters top-1000; the compound is the shopfront',
    ],
    [
      '便利店 — you see this on a sign. What does it mean?',
      ['convenience store', '2, capital form', 'long thin things — fish, streets, trousers', 'garments, items, matters'],
      0,
      'biànlìdiàn · buurtwinkel. 便 is biàn here, pián in 便宜 — a per-string pinyin case',
    ],
    [
      '收银台 — you see this on a sign. What does it mean?',
      ['checkout', 'shelf life, as a duration', 'net content', 'settle up, pay'],
      0,
      'shōuyíntái · kassa. Overhead lane signs shorten to bare 收银',
    ],
    [
      '结账 — you see this on a sign. What does it mean?',
      ['settle up, pay', 'weigh here', 'special price', '1, capital form'],
      0,
      'jiézhàng · afrekenen. 账 at 2,178 is one of only three out-of-bank characters here',
    ],
    [
      '扫码 — you see this on a sign. What does it mean?',
      ['scan the QR code', 'hundred million', 'flat things — tickets, cards, tables', '0.1 yuan (spoken)'],
      0,
      'sǎomǎ · scannen, QR-code scannen. The universal payment verb; rank 1,625 for 扫',
    ],
    [
      '百 — you see this on a sign. What does it mean?',
      ['hundred', 'refrigerate, 0–4 °C', 'hundred million', 'bottle'],
      0,
      'bǎi · honderd. ⿱一白. Below the myriad break, so it behaves as a European reader expects.',
    ],
    [
      '千 — you see this on a sign. What does it mean?',
      ['thousand', 'settle up, pay', '2, capital form', 'freeze, −18 °C'],
      0,
      'qiān · duizend. ⿱丿十. Last unit before the break.',
    ],
    [
      '万 — you see this on a sign. What does it mean?',
      ['ten thousand', 'freeze, −18 °C', 'garments, items, matters', 'refrigerate, 0–4 °C'],
      0,
      'wàn · tienduizend. The genuine obstacle. Chinese groups by 10⁴, not 10³: 十万 = 100,000, 一百万 = 1,000,000. The failure mode is an order-of-magnitude error and it costs money.',
    ],
  ],
  high: [
    [
      '亿 — you see this on a sign. What does it mean?',
      ['hundred million', 'o\'clock (spoken)', 'animals, one of a pair, some containers', '2, capital form'],
      0,
      'yì · honderd miljoen. 10⁸. Property prices, news tickers, lottery boards. Low encounter rate, but it is the second myriad step and the system is incoherent without it.',
    ],
    [
      '壹 — you see this on a sign. What does it mean?',
      ['1, capital form', 'production date', 'animals, one of a pair, some containers', 'freeze, −18 °C'],
      0,
      'yī · 1, schrijfwijze op documenten. ⿱士⿱冖豆. A 100-yuan note reads 壹佰圆 — recognising this is the difference between reading a banknote and looking at one.',
    ],
    [
      '贰 — you see this on a sign. What does it mean?',
      ['2, capital form', 'settle up, pay', 'kilogram = 2 斤', 'garments, items, matters'],
      0,
      'èr · 2, schrijfwijze op documenten. ⿹弋⿱二贝 — carries both the 二 it replaces and the money component 贝, the only capital form that is partly guessable.',
    ],
    [
      '叁 — you see this on a sign. What does it mean?',
      ['3, capital form', 'half', '50 g, one tenth of a 斤', 'hundred'],
      0,
      'sān · 3, schrijfwijze op documenten. ⿱⿱厶大三 — likewise contains its own 三. Mainland form; documents set in traditional type use 叄. After these three, 肆伍陆柒捌玖 follow the same logic and are deferred.',
    ],
  ],
};
