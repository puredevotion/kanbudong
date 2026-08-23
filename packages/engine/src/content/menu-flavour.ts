import type { CategoryContent } from './row.js';

/** menu-flavour — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MENU_FLAVOUR: CategoryContent = {
  low: [
    [
      '辣 — you see this on a sign. What does it mean?',
      ['chilli-hot', 'cold dishes', 'sweet', 'liver'],
      0,
      'là · pittig, heet. The one warning that must be readable on day one',
    ],
    [
      '麻 — you see this on a sign. What does it mean?',
      ['numbing, lip-tingling', 'sour', '"from" (a price)', 'soft drinks'],
      0,
      'má · verdovend, tintelend. Not heat. "Pittig" is wrong. No Dutch or English word exists',
    ],
  ],
  mid: [
    [
      '咸 — you see this on a sign. What does it mean?',
      ['salty', 'vegetarian', 'soft drinks', 'numbing, lip-tingling'],
      0,
      'xián · zout. Rank 1,688; Chinese "salty" is saltier',
    ],
    [
      '酸 — you see this on a sign. What does it mean?',
      ['sour', 'tossed, dressed', 'kidney', 'cold dishes'],
      0,
      'suān · zuur. Rank 1,002; also the pickled-vegetable marker',
    ],
    [
      '甜 — you see this on a sign. What does it mean?',
      ['sweet', 'house specialty', 'egg', 'brain'],
      0,
      'tián · zoet. Rank 1,749; 甜 in a savoury dish name means sugar in the sauce',
    ],
  ],
  high: [
    [
      '甜 — you see this on a sign. What does it mean?',
      ['sweet', 'tendon', 'skin, crackling', 'lamb, mutton, goat'],
      0,
      'tián · zoet. Rank 1,749; 甜 in a savoury dish name means sugar in the sauce',
    ],
  ],
};
