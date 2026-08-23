import type { CategoryContent } from './row.js';

/** market-panel — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MARKET_PANEL: CategoryContent = {
  low: [
    [
      '个 — you see this on a sign. What does it mean?',
      ['general measure word', 'garments, items, matters', 'half', 'settle up, pay'],
      0,
      'gè · algemeen maatwoord. Rank 16. The fallback that is never wrong enough to fail a transaction, and the first thing to teach so the player can transact before learning the rest.',
    ],
  ],
  mid: [
    [
      '生产日期 — you see this on a sign. What does it mean?',
      ['production date', 'loose, sold by weight', '3, capital form', 'scan the QR code'],
      0,
      'shēngchǎn rìqī · productiedatum. All four characters rank 28–214; the field is still unreadable without instruction',
    ],
    [
      '保质期 — you see this on a sign. What does it mean?',
      ['shelf life, as a duration', 'refrigerate, 0–4 °C', '3, capital form', 'yuan (spoken)'],
      0,
      'bǎozhìqī · houdbaarheidsduur. 保质期12个月 is not a date. Contains 期 — the 月 homoglyph trap',
    ],
    [
      '净含量 — you see this on a sign. What does it mean?',
      ['net content', 'buy one get one free', '2, capital form', 'freeze, −18 °C'],
      0,
      'jìnghánliàng · netto-inhoud. 量 is liàng, not liáng — pinyin is a property of the string',
    ],
    [
      '冷藏 — you see this on a sign. What does it mean?',
      ['refrigerate, 0–4 °C', 'members\' price', '0.1 yuan (written)', 'special price'],
      0,
      'lěngcáng · gekoeld bewaren. Authored distractor for 冷冻 — same first character, opposite instruction',
    ],
    [
      '冷冻 — you see this on a sign. What does it mean?',
      ['freeze, −18 °C', 'loose, sold by weight', 'bowl', 'yuan (written)'],
      0,
      'lěngdòng · diepvries. Getting this pair wrong ruins the food either way',
    ],
    [
      '进口 — you see this on a sign. What does it mean?',
      ['imported', 'kilogram = 2 斤', 'supermarket', 'special price'],
      0,
      'jìnkǒu · geïmporteerd. Rank 80/157; on a metro sign the same glyphs mean "entrance"',
    ],
    [
      '号 — you see this on a sign. What does it mean?',
      ['day of month (spoken); number', 'production date', 'special price', 'weigh here'],
      0,
      'hào · dag (spreektaal); nummer. 日 written, 号 spoken — the same split as 元/块. Also the "number" on doors, platforms and bus stops.',
    ],
    [
      '时 — you see this on a sign. What does it mean?',
      ['o\'clock; time', 'bowl', 'members\' price', 'scan the QR code'],
      0,
      'shí · uur; tijd. 营业时间 09:00–22:00. Signage times are 24-hour and numeric, so 时 is read more than it is calculated.',
    ],
    [
      '点 — you see this on a sign. What does it mean?',
      ['o\'clock (spoken)', 'day of month (spoken); number', 'yuan (spoken)', 'long thin things — fish, streets, trousers'],
      0,
      'diǎn · uur (spreektaal). 三点半 = 3:30 — the characters do not say morning or afternoon, and the player must get that from context. Pairs with 半.',
    ],
    [
      '半 — you see this on a sign. What does it mean?',
      ['half', 'kilogram = 2 斤', 'hundred', '3, capital form'],
      0,
      'bàn · half. Half past; also 半份 (half portion) and 半斤 (250 g) in the market and menu strands. One character, three strands.',
    ],
    [
      '份 — you see this on a sign. What does it mean?',
      ['portion, serving', 'shelf life, as a duration', 'half', 'buy one get one free'],
      0,
      'fèn · portie. 大份 / 中份 / 小份 / 半份. Confusable with 分, which supplies its phonetic — and note that tone does not separate them, since 分 itself reads fèn in other words. They sit next to each other on menus; teach the job, not the tone.',
    ],
    [
      '杯 — you see this on a sign. What does it mean?',
      ['cup, glass', 'checkout', 'ten thousand', '1, capital form'],
      0,
      'bēi · kopje, glas. Drinks. ⿰木不.',
    ],
    [
      '碗 — you see this on a sign. What does it mean?',
      ['bowl', 'pairs', 'loose, sold by weight', 'day of month (spoken); number'],
      0,
      'wǎn · kom. Noodles, rice, congee. Rank 1,621 and indispensable — the clearest single case against frequency ordering in the bank.',
    ],
    [
      '瓶 — you see this on a sign. What does it mean?',
      ['bottle', 'weigh here', 'yuan (spoken)', 'long thin things — fish, streets, trousers'],
      0,
      'píng · fles. Water, beer, sauce. Also a shelf-label unit.',
    ],
    [
      '张 — you see this on a sign. What does it mean?',
      ['flat things — tickets, cards, tables', 'garments, items, matters', 'hundred', 'gram'],
      0,
      'zhāng · platte dingen — kaartjes, tafels. 一张票. The measure word that gets you through a ticket window.',
    ],
  ],
  high: [
    [
      '散装 — you see this on a sign. What does it mean?',
      ['loose, sold by weight', 'shelf life, as a duration', 'animals, one of a pair, some containers', 'freeze, −18 °C'],
      0,
      'sǎnzhuāng · los, per gewicht. Flags that 元/斤 applies. 散 carries ⺼ — a highlighter false positive',
    ],
    [
      '称重 — you see this on a sign. What does it mean?',
      ['weigh here', '2, capital form', 'bottle', 'gram'],
      0,
      'chēngzhòng · hier afwegen. You must weigh produce and get a barcode sticker before the till',
    ],
    [
      '只 — you see this on a sign. What does it mean?',
      ['animals, one of a pair, some containers', 'supermarket', 'net content', 'members\' price'],
      0,
      'zhī · dieren, één van een paar. Note the reading: zhī as a measure word, zhǐ as "only". Two distinct traditional characters (隻 and 只) merged into one simplified form — token-level pinyin again.',
    ],
    [
      '件 — you see this on a sign. What does it mean?',
      ['garments, items, matters', 'freeze, −18 °C', '1, capital form', 'general measure word'],
      0,
      'jiàn · kledingstukken, artikelen. 第二件半价 — second item half price. Retail, not conversation.',
    ],
    [
      '双 — you see this on a sign. What does it mean?',
      ['pairs', '0.01 yuan', 'general measure word', '2, capital form'],
      0,
      'shuāng · paar. Shoes, chopsticks, socks. ⿰又又.',
    ],
    [
      '条 — you see this on a sign. What does it mean?',
      ['long thin things — fish, streets, trousers', 'settle up, pay', 'supermarket', 'special price'],
      0,
      'tiáo · lange dunne dingen — vis, straten. 一条鱼 on a market board.',
    ],
  ],
};
