import type { CategoryContent } from './row.js';

/**
 * street-way — DESIGN.md §6.2's "fascia wayfinding" scene, the second of the
 * two categories `categories.ts` used to carry as a documented content gap.
 * Street-level directional signage, distinct from safety-exit's 出口/入口
 * pair and transit-platform's metro plates.
 *
 * 胡同/城中村 (context-authoring phase, Aug 2026) are a genuine regional pair,
 * not an invented contrast: 胡同 (hutong) names old Beijing's narrow
 * courtyard-lined lanes, a housing stock Shenzhen — built up almost entirely
 * since the 1980s — never had; 城中村 (urban village) names the dense,
 * informally built villages a fast-growing city absorbed rather than
 * replaced, and Shenzhen has an unusually large number of them precisely
 * because of how quickly it grew (白石洲 is one of the best documented).
 * 人行天桥/无障碍 also new this phase, region-neutral. None of the four has a
 * verified `tier` or Jun Da rank, so all are left unset.
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
    [
      'On a street sign. What does this mean?',
      ['hutong, old Beijing lane', 'urban village', 'pedestrian street'],
      0,
      'hútòng · hutong (a traditional narrow lane lined with courtyard housing) — tied to old Beijing; Shenzhen, built up mostly since the 1980s, has no equivalent old-lane housing stock.',
      {
        hanzi: '胡同',
        pinyin: 'hútòng',
        nl: 'hutong, oude Pekinese steeg',
        en: 'hutong, old Beijing lane',
        context: { before: '史家', after: '博物馆' },
      },
    ],
    [
      'On a street sign. What does this mean?',
      ['urban village', 'hutong, old Beijing lane', 'pedestrian street'],
      0,
      'chéngzhōngcūn · dorp-in-de-stad (urban village) — a dense, informally built neighbourhood left over from a village the city grew around; Shenzhen has an unusually large number of them because it grew from a small town to a megacity in a few decades. 白石洲 is one of the best known.',
      {
        hanzi: '城中村',
        pinyin: 'chéngzhōngcūn',
        nl: 'dorp-in-de-stad',
        en: 'urban village',
        context: { before: '白石洲', after: '改造项目' },
      },
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
    [
      'On a street sign. What does this mean?',
      ['pedestrian overpass', 'pedestrian street', 'lift, elevator'],
      0,
      'rénxíng tiānqiáo · voetgangersbrug (pedestrian overpass) — crosses busy roads above traffic; 天桥, "sky bridge," is the part worth remembering.',
      {
        hanzi: '人行天桥',
        pinyin: 'rénxíng tiānqiáo',
        nl: 'voetgangersbrug',
        en: 'pedestrian overpass',
        context: { after: ' 200米' },
      },
    ],
    [
      'On a street sign. What does this mean?',
      ['accessible, barrier-free', 'no through road, dead end', 'one-way street'],
      0,
      'wúzhàng\'ài · toegankelijk (accessible, barrier-free) — marks a ramp or wide gate for wheelchairs and pushchairs, as in 无障碍通道 (accessible passage).',
      {
        hanzi: '无障碍',
        pinyin: 'wúzhàng\'ài',
        nl: 'toegankelijk, drempelvrij',
        en: 'accessible, barrier-free',
        context: { after: '通道入口' },
      },
    ],
  ],
};
