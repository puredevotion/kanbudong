import {
  CITY_RADICAL,
  DI_PHONETIC,
  GRASS_RADICAL,
  HEART_RADICAL,
  WALK_RADICAL,
  WATER_RADICAL,
  YOU_PHONETIC,
} from '../components.js';
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
 *
 * 洗/手/间/药/邮/局/快/递 (eligibility-gap backfill, Aug 2026): standalone items
 * for every morpheme street-trade.ts's 洗手间/药店/邮局/快递 name, so
 * `deriveComponentCharIds` can resolve all four words - see the audit note in
 * content/index.ts. 洗 reuses `WATER_RADICAL` (menu-cooking.ts's 汤/涮); 药
 * reuses `GRASS_RADICAL` (street-trade.ts's own 茶); 邮 and 递 each carry a
 * verified semantic radical plus an exact-tone phonetic match (由/弟); 快
 * carries a verified semantic radical (忄) with no phonetic claim, since its
 * MMH-listed phonetic half 夬 is not a tone-or-syllable match for kuài. 手/间/
 * 局 have no semantic/phonetic split Make Me a Hanzi records cleanly enough
 * to ship as a verified `CharacterDecomposition`, so each carries a labelled
 * `glossProvenance: 'mnemonic-only'` story instead.
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
    [
      'On a street sign. What does this mean?',
      ['to wash', 'room; between', 'hand'],
      0,
      'xǐ · wassen (to wash). Seen in 洗手间 (washroom) and 洗衣 (laundry). Carries the 氵 (water) radical, the same one in 汤 (soup) and 涮 (to swish, hotpot).',
      { hanzi: '洗', pinyin: 'xǐ', nl: 'wassen', en: 'to wash', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '洗',
        components: [{ componentId: WATER_RADICAL.id, role: 'semantic' }],
        semantic_radical: WATER_RADICAL.id,
      },
      { freqRank: 1247 },
    ],
    [
      'On a street sign. What does this mean?',
      ['hand', 'to wash', 'fast, quick'],
      0,
      'shǒu · hand (hand). Seen in 洗手间 (washroom, literally "wash-hand room") and 手机 (mobile phone). Picture 手 as an open hand: fingers splayed across the top, one long stroke for the wrist below: shǒu.',
      { hanzi: '手', pinyin: 'shǒu', nl: 'hand', en: 'hand' },
      undefined,
      { freqRank: 143, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a street sign. What does this mean?',
      ['room; between', 'to wash', 'office, bureau'],
      0,
      'jiān · kamer; tussen (room; between). Seen in 洗手间 (washroom) and 房间 (room). Picture 间 as a gate with a sliver of daylight caught between its doors - the gap between two things, or a room of its own: jiān.',
      { hanzi: '间', pinyin: 'jiān', nl: 'kamer; tussen', en: 'room; between' },
      undefined,
      { freqRank: 135, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a street sign. What does this mean?',
      ['medicine', 'office, bureau', 'mail, post'],
      0,
      'yào · medicijn (medicine). Seen in 药店 (pharmacy). Carries the 艹 (grass/plant) radical, the same one in 茶 (tea) - most early medicine came from plants.',
      { hanzi: '药', pinyin: 'yào', nl: 'medicijn', en: 'medicine', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '药',
        components: [{ componentId: GRASS_RADICAL.id, role: 'semantic' }],
        semantic_radical: GRASS_RADICAL.id,
      },
      { freqRank: 662 },
    ],
    [
      'On a street sign. What does this mean?',
      ['mail, post', 'office, bureau', 'fast, quick'],
      0,
      'yóu · post (mail, post). Seen in 邮局 (post office) and 邮件 (mail). 由 (yóu), the shape on the right, gives the exact sound.',
      { hanzi: '邮', pinyin: 'yóu', nl: 'post', en: 'mail, post', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '邮',
        components: [
          { componentId: CITY_RADICAL.id, role: 'semantic' },
          { componentId: YOU_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: CITY_RADICAL.id,
      },
      { freqRank: 1652 },
    ],
    [
      'On a street sign. What does this mean?',
      ['office, bureau', 'mail, post', 'to deliver, hand over'],
      0,
      'jú · kantoor, bureau (office, bureau). Seen in 邮局 (post office). Picture 局 as a ruler laid flat over an open doorway - a place where measurements and rules get settled: jú.',
      { hanzi: '局', pinyin: 'jú', nl: 'kantoor, bureau', en: 'office, bureau' },
      undefined,
      { freqRank: 483, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a street sign. What does this mean?',
      ['fast, quick', 'to stop', 'to deliver, hand over'],
      0,
      'kuài · snel (fast, quick). Seen in 快递 (courier, literally "fast delivery"). Carries the 忄 (heart) radical - being quick to act was pictured as a quality of the heart.',
      { hanzi: '快', pinyin: 'kuài', nl: 'snel', en: 'fast, quick', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '快',
        components: [{ componentId: HEART_RADICAL.id, role: 'semantic' }],
        semantic_radical: HEART_RADICAL.id,
      },
      { freqRank: 366 },
    ],
    [
      'On a street sign. What does this mean?',
      ['to deliver, hand over', 'fast, quick', 'mail, post'],
      0,
      'dì · afleveren, overhandigen (to deliver, hand over). Seen in 快递 (courier). 弟 (dì), the shape on the right, gives the exact sound - the same pairing street-trade.ts\'s own 快递 explanation already points out.',
      { hanzi: '递', pinyin: 'dì', nl: 'afleveren, overhandigen', en: 'to deliver, hand over', structure: 'enclosure' },
      {
        kind: 'character',
        hanzi: '递',
        components: [
          { componentId: WALK_RADICAL.id, role: 'semantic' },
          { componentId: DI_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: WALK_RADICAL.id,
      },
      { freqRank: 1538 },
    ],
  ],
};
