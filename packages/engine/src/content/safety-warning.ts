import type { CategoryContent } from './row.js';

/** safety-warning — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const SAFETY_WARNING: CategoryContent = {
  low: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'be careful, mind', 'strictly forbidden', 'beware'],
      0,
      'jìnzhǐ · verbod (strictly forbidden). Look for a red circle with a diagonal bar — red always means something is forbidden.',
    ],
    [
      '警告 — you see this on a sign. What does it mean?',
      ['warning — yellow triangle, black border', 'be careful, mind', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'jǐnggào · waarschuwing (warning). A yellow triangle with a black border means "you could get hurt here" — different from a red circle, which means "you may not do this."',
    ],
    [
      '指令 — you see this on a sign. What does it mean?',
      ['mandatory — solid blue circle', 'prohibition — red circle, diagonal bar', 'closed down, ceased trading', 'be careful, mind'],
      0,
      'zhǐlìng · gebod (mandatory instruction). A solid blue circle is an order — you must do this, not just a suggestion.',
    ],
    [
      '提示 — you see this on a sign. What does it mean?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'be careful, mind', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing (safety notice). A green square points to something safe, such as an exit — green marks where safety is, not where danger is.',
    ],
  ],
  mid: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'beware', 'please do not', 'attention'],
      0,
      'jìnzhǐ · verbod (strictly forbidden). Look for a red circle with a diagonal bar — red always means something is forbidden.',
    ],
  ],
  high: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'notice, safe condition — green square', 'danger', 'closed down, ceased trading'],
      0,
      'jìnzhǐ · verbod (strictly forbidden). Look for a red circle with a diagonal bar — red always means something is forbidden.',
    ],
  ],
};
