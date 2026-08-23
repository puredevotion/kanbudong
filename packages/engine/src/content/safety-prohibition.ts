import type { CategoryContent } from './row.js';

/** safety-prohibition — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const SAFETY_PROHIBITION: CategoryContent = {
  low: [
    [
      '请勿 — you see this on a sign. What does it mean?',
      ['please do not', 'mandatory — solid blue circle', 'notice, safe condition — green square', 'warning — yellow triangle, black border'],
      0,
      'qǐngwù · gelieve niet (please do not). It sounds polite, but carries the same force as a strict prohibition — treat it as a rule, not a suggestion.',
    ],
    [
      '小心 — you see this on a sign. What does it mean?',
      ['be careful, mind', 'beware', 'notice, safe condition — green square', 'strictly forbidden'],
      0,
      'xiǎoxīn · voorzichtig, pas op (be careful, mind). Common warnings using it: 小心地滑 (mind the slippery floor) and 小心台阶 (mind the step).',
    ],
    [
      '危险 — you see this on a sign. What does it mean?',
      ['danger', 'please do not', 'beware', 'prohibition — red circle, diagonal bar'],
      0,
      'wēixiǎn · gevaar (danger). Usually the word written inside a yellow warning triangle.',
    ],
  ],
  mid: [
    [
      '严禁 — you see this on a sign. What does it mean?',
      ['strictly forbidden', 'mandatory — solid blue circle', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'yánjìn · streng verboden (strictly forbidden). The strongest prohibition wording; also appears in 严禁烟火 (fire and smoking strictly forbidden).',
    ],
    [
      '注意 — you see this on a sign. What does it mean?',
      ['attention', 'danger', 'prohibition — red circle, diagonal bar', 'closed down, ceased trading'],
      0,
      'zhùyì · let op (attention). Flags a hazard without saying how serious it is.',
    ],
    [
      '当心 — you see this on a sign. What does it mean?',
      ['beware', 'mandatory — solid blue circle', 'danger', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op (beware). A more formal version of 小心, often seen on yellow warning signs such as 当心碰头 (mind your head).',
    ],
  ],
  high: [
    [
      '当心 — you see this on a sign. What does it mean?',
      ['beware', 'closed down, ceased trading', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'dāngxīn · pas op (beware). A more formal version of 小心, often seen on yellow warning signs such as 当心碰头 (mind your head).',
    ],
  ],
};
