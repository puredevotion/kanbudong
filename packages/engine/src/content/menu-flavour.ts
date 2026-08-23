import type { CategoryContent } from './row.js';

/** menu-flavour — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MENU_FLAVOUR: CategoryContent = {
  low: [
    [
      '辣 — you see this on a sign. What does it mean?',
      ['chilli-hot', 'cold dishes', 'sweet', 'liver'],
      0,
      'là · pittig, heet (chilli-hot, spicy). The most important warning character to recognize.',
    ],
    [
      '麻 — you see this on a sign. What does it mean?',
      ['numbing, lip-tingling', 'sour', '"from" (a price)', 'soft drinks'],
      0,
      'má · verdovend, tintelend (numbing, lip-tingling). This is not spicy heat — it is a tingling, numbing sensation with no exact Dutch or English word.',
    ],
  ],
  mid: [
    [
      '咸 — you see this on a sign. What does it mean?',
      ['salty', 'vegetarian', 'soft drinks', 'numbing, lip-tingling'],
      0,
      'xián · zout (salty). Dishes labelled this way tend to be saltier than "salty" usually implies in Dutch or English.',
    ],
    [
      '酸 — you see this on a sign. What does it mean?',
      ['sour', 'tossed, dressed', 'kidney', 'cold dishes'],
      0,
      'suān · zuur (sour). Also marks pickled-vegetable dishes.',
    ],
    [
      '甜 — you see this on a sign. What does it mean?',
      ['sweet', 'house specialty', 'egg', 'brain'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added.',
    ],
  ],
  high: [
    [
      '甜 — you see this on a sign. What does it mean?',
      ['sweet', 'tendon', 'skin, crackling', 'lamb, mutton, goat'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added.',
    ],
  ],
};
