import type { CategoryContent } from './row.js';

/** safety-warning — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const SAFETY_WARNING: CategoryContent = {
  low: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'be careful, mind', 'strictly forbidden', 'beware'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
    ],
    [
      '警告 — you see this on a sign. What does it mean?',
      ['warning — yellow triangle, black border', 'be careful, mind', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'jǐnggào · waarschuwing — gele driehoek. Yellow warns. Distinguishing "you may be hurt" from "you may not do this" is the highest-value discrimination in the bank.',
    ],
    [
      '指令 — you see this on a sign. What does it mean?',
      ['mandatory — solid blue circle', 'prohibition — red circle, diagonal bar', 'closed down, ceased trading', 'be careful, mind'],
      0,
      'zhǐlìng · gebod — blauwe cirkel. The one category Europeans systematically misread as informational. Blue is an order.',
    ],
    [
      '提示 — you see this on a sign. What does it mean?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'be careful, mind', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing — groen vierkant. Green is where safety is, not where danger is. Sets up 安全出口 below.',
    ],
  ],
  mid: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'beware', 'please do not', 'attention'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
    ],
  ],
  high: [
    [
      '禁止 — you see this on a sign. What does it mean?',
      ['prohibition — red circle, diagonal bar', 'notice, safe condition — green square', 'danger', 'closed down, ceased trading'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
    ],
  ],
};
