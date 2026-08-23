import type { CategoryContent } from './row.js';

/** safety-prohibition — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const SAFETY_PROHIBITION: CategoryContent = {
  low: [
    [
      '请勿 — you see this on a sign. What does it mean?',
      ['please do not', 'mandatory — solid blue circle', 'notice, safe condition — green square', 'warning — yellow triangle, black border'],
      0,
      'qǐngwù · gelieve niet. The polite register. Same force as 禁止 in practice — a traveller who reads 请勿 as a suggestion is wrong. 勿 appears almost nowhere else, which is exactly why it is unambiguous once known.',
    ],
    [
      '小心 — you see this on a sign. What does it mean?',
      ['be careful, mind', 'beware', 'notice, safe condition — green square', 'strictly forbidden'],
      0,
      'xiǎoxīn · voorzichtig, pas op. The most common hazard opener on the ground: 小心地滑, 小心台阶. 心 is rank 86 and 小 rank 87, so the cost is near zero.',
    ],
    [
      '危险 — you see this on a sign. What does it mean?',
      ['danger', 'please do not', 'beware', 'prohibition — red circle, diagonal bar'],
      0,
      'wēixiǎn · gevaar. The word the yellow triangle is usually spelling out. Pairs with §7.5.1\'s warning category so the colour and the characters teach each other.',
    ],
  ],
  mid: [
    [
      '严禁 — you see this on a sign. What does it mean?',
      ['strictly forbidden', 'mandatory — solid blue circle', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'yánjìn · streng verboden. Top of the force ladder; 严 (rank 600) recurs in 严禁烟火.',
    ],
    [
      '注意 — you see this on a sign. What does it mean?',
      ['attention', 'danger', 'prohibition — red circle, diagonal bar', 'closed down, ceased trading'],
      0,
      'zhùyì · let op. Heads a hazard without naming its severity. 注 = ⿰氵主.',
    ],
    [
      '当心 — you see this on a sign. What does it mean?',
      ['beware', 'mandatory — solid blue circle', 'danger', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op. The 小心 variant used on formal yellow triangles: 当心碰头. Same slot, different register.',
    ],
  ],
  high: [
    [
      '当心 — you see this on a sign. What does it mean?',
      ['beware', 'closed down, ceased trading', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op. The 小心 variant used on formal yellow triangles: 当心碰头. Same slot, different register.',
    ],
  ],
};
