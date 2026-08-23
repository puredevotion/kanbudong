import type { CategoryContent } from './row.js';

/**
 * street-way — DESIGN.md §6.2's "fascia wayfinding" scene, the second of the
 * two categories `categories.ts` used to carry as a documented content gap.
 * Street-level directional signage, distinct from safety-exit's 出口/入口
 * pair and transit-platform's metro plates.
 */
export const STREET_WAY: CategoryContent = {
  low: [
    [
      'On a street sign. What does this mean?',
      ['go straight ahead', 'turn back', 'no through road'],
      0,
      'zhíxíng · rechtdoor (go straight ahead) — the same 直 as "straight, direct" elsewhere.',
      { hanzi: '直行', pinyin: 'zhíxíng', nl: 'rechtdoor', en: 'go straight ahead' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a street sign. What does this mean?',
      ['no through road, dead end', 'go straight ahead', 'lift, elevator'],
      0,
      'cǐ lù bù tōng · doodlopende weg (no through road) — literally "this road does not go through."',
      { hanzi: '此路不通', pinyin: 'cǐ lù bù tōng', nl: 'doodlopende weg', en: 'no through road, dead end' },
      undefined,
      { tier: 1 },
    ],
  ],
  mid: [
    [
      'On a street sign. What does this mean?',
      ['pedestrian street', 'no through road, dead end', 'go straight ahead'],
      0,
      'bùxíngjiē · voetgangersstraat (pedestrian street) — no vehicles, usually the shopping strip.',
      { hanzi: '步行街', pinyin: 'bùxíngjiē', nl: 'voetgangersstraat', en: 'pedestrian street' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a mall directory. What does this mean?',
      ['lift, elevator', 'information desk', 'no through road, dead end'],
      0,
      'diàntī · lift (lift, elevator) — the same character covers escalators too; context or an icon tells you which.',
      { hanzi: '电梯', pinyin: 'diàntī', nl: 'lift', en: 'lift, elevator' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a mall directory. What does this mean?',
      ['information desk', 'lift, elevator', 'go straight ahead'],
      0,
      'wènxùnchù · informatiebalie (information desk) — 问 (ask) + 讯 (inquire) + 处 (place): a "place for asking."',
      { hanzi: '问讯处', pinyin: 'wènxùnchù', nl: 'informatiebalie', en: 'information desk' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a street sign. What does this mean?',
      ['one-way street', 'pedestrian street', 'no through road, dead end'],
      0,
      'dānxíngdào · eenrichtingsstraat (one-way street) — traffic moves one direction only; 单 (single) + 行 (go, here xíng) + 道 (road).',
      { hanzi: '单行道', pinyin: 'dānxíngdào', nl: 'eenrichtingsstraat', en: 'one-way street' },
      undefined,
      { tier: 2 },
    ],
  ],
};
