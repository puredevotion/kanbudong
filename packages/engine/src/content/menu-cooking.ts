import {
  FIRE_RADICAL,
  KAO_PHONETIC,
  MEN_PHONETIC,
  BAO_PHONETIC,
  FIRE_DOTS_RADICAL,
  WATER_RADICAL,
  HAND_RADICAL,
  BAN_PHONETIC,
} from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * menu-cooking — generated from DESIGN.md §7.1. `freqRank` is Jun Da's Modern
 * Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, data dated
 * 2004-03-30) — a different corpus from the one DESIGN.md's own §7.1 prose
 * cites, so the numbers here do not match DESIGN.md's inline ranks
 * character-for-character; both are legitimate frequency counts that
 * disagree, which is itself DESIGN.md §6.3's point about frequency lists.
 *
 * Six of these methods (炒/炖/烤/烧/焖/爆) carry the ⿰火X fire radical
 * (`FIRE_RADICAL`), verified against the gitignored Make Me a Hanzi scratch
 * copy - a decomposition-backfill pass (Aug 2026) worth flagging: 炸, the
 * seventh left-right fire-radical cooking method on this menu, is
 * deliberately NOT decomposed. Its actual menu reading is zhá, but its
 * phonetic half 乍 is zhà/zuò - a tone-and-reading mismatch, not the exact
 * match this bank requires (see the organ set's 肝/干, 站/占, 城/成). 煮/煎
 * carry ⿱X灬, the four-dot variant of the same radical (`FIRE_DOTS_RADICAL`).
 * 蒸 (steam) and 卤 (master-stock braise) are left undecomposed: 蒸's own Make
 * Me a Hanzi entry calls it ideographic with no clean semantic/phonetic
 * split, and 卤 has no decomposition data in Make Me a Hanzi at all (it is
 * itself a radical). 汤/涮 carry the water radical `WATER_RADICAL`; neither
 * phonetic half (昜/刷) is an exact-tone match, so both ship semantic-only.
 * 拌's phonetic half 半 (bàn) is an exact tone-and-syllable match for 拌
 * (bàn), the same 'exact' bar as `GAN_PHONETIC`.
 */
export const MENU_COOKING: CategoryContent = {
  low: [
    [
      'On the menu. What does this cooking method do to it?',
      ['stir-fry', 'pan-fry', 'beef'],
      0,
      'chǎo · roerbakken (stir-fry). The most common cooking word you will see on menus.',
      { hanzi: '炒', pinyin: 'chǎo', nl: 'roerbakken', en: 'stir-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炒',
        components: [{ componentId: FIRE_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 2590 },
    ],
  ],
  mid: [
    [
      'On the menu. What does this cooking method do to it?',
      ['stir-fry', 'cold dishes', 'market price'],
      0,
      'chǎo · roerbakken (stir-fry). The most common cooking word you will see on menus.',
      { hanzi: '炒', pinyin: 'chǎo', nl: 'roerbakken', en: 'stir-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炒',
        components: [{ componentId: FIRE_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 2590 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['steam', 'beef', 'swish in broth'],
      0,
      'zhēng · stomen (steamed). A safe, mild choice — no added oil.',
      { hanzi: '蒸', pinyin: 'zhēng', nl: 'stomen', en: 'steam' },
      undefined,
      { tier: 1, freqRank: 2358 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['roast, grill', 'hot dishes', 'stir-fry'],
      0,
      'kǎo · roosteren, grillen (roasted, grilled). Dry heat cooking — think skewers and barbecue stalls. Built from 火 (fire) plus 考, which happens to give the whole character its exact reading, kǎo.',
      { hanzi: '烤', pinyin: 'kǎo', nl: 'roosteren, grillen', en: 'roast, grill', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '烤',
        components: [
          { componentId: FIRE_RADICAL.id, role: 'semantic' },
          { componentId: KAO_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 2629 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['deep-fry', 'cold dishes', 'hot dishes'],
      0,
      'zhá · frituren (deep-fried). The same character can also be read zhà, meaning "to explode" — on a menu it always means deep-fried.',
      { hanzi: '炸', pinyin: 'zhá', nl: 'frituren', en: 'deep-fry' },
      undefined,
      { tier: 1, freqRank: 976 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['boil', 'roast, grill', 'chicken'],
      0,
      'zhǔ · koken (boiled). Plain and wet cooking, often combined with other words such as 水煮.',
      { hanzi: '煮', pinyin: 'zhǔ', nl: 'koken', en: 'boil', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '煮',
        components: [{ componentId: FIRE_DOTS_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_DOTS_RADICAL.id,
      },
      { tier: 1, freqRank: 2582 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['braise in soy', 'stir-fry', 'numbing, lip-tingling'],
      0,
      'shāo · braiseren (braised in soy sauce). Often seen as 红烧 — usually one of the mildest dishes on the menu.',
      { hanzi: '烧', pinyin: 'shāo', nl: 'braiseren', en: 'braise in soy', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '烧',
        components: [{ componentId: FIRE_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 1201 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['long-stew', 'house specialty', 'salty'],
      0,
      'dùn · stoven (long-stewed). Usually bones cooked for hours into a soupy dish.',
      { hanzi: '炖', pinyin: 'dùn', nl: 'stoven', en: 'long-stew', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炖',
        components: [{ componentId: FIRE_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 3857 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['covered braise', 'pan-fry', 'pot'],
      0,
      'mèn · smoren (covered braise). A less common character, but a real menu word worth knowing. Built from 火 (fire) plus 闷, which happens to give the whole character its exact reading, mèn.',
      { hanzi: '焖', pinyin: 'mèn', nl: 'smoren', en: 'covered braise', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '焖',
        components: [
          { componentId: FIRE_RADICAL.id, role: 'semantic' },
          { componentId: MEN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 5207 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['pan-fry', '"from" (a price)', 'hot dishes'],
      0,
      'jiān · bakken in de pan (pan-fried). Tells 煎饺 (pan-fried dumplings) apart from 蒸饺 (steamed dumplings).',
      { hanzi: '煎', pinyin: 'jiān', nl: 'bakken in de pan', en: 'pan-fry', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '煎',
        components: [{ componentId: FIRE_DOTS_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_DOTS_RADICAL.id,
      },
      { tier: 1, freqRank: 2893 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['flash-fry', 'soup', 'pan-fry'],
      0,
      'bào · flitsbakken (flash-fried). Cooked for just seconds at very high heat, often used for offal. Built from 火 (fire) plus 暴, which happens to give the whole character its exact reading, bào.',
      { hanzi: '爆', pinyin: 'bào', nl: 'flitsbakken', en: 'flash-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '爆',
        components: [
          { componentId: FIRE_RADICAL.id, role: 'semantic' },
          { componentId: BAO_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 1243 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['tossed, dressed', 'blood, as a set curd', 'master-stock braise'],
      0,
      'bàn · aanmaken (tossed, dressed). Almost always served cold — the one method here that changes the serving temperature. Built from 扌 (hand) plus 半, which happens to give the whole character its exact reading, bàn.',
      { hanzi: '拌', pinyin: 'bàn', nl: 'aanmaken', en: 'tossed, dressed', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '拌',
        components: [
          { componentId: HAND_RADICAL.id, role: 'semantic' },
          { componentId: BAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: HAND_RADICAL.id,
      },
      { tier: 1, freqRank: 3570 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['master-stock braise', 'intestine', 'beef'],
      0,
      'lǔ · in kruidenbouillon gegaard (master-stock braised). Dark and fragrant with star anise, usually served cold, often organ meat.',
      { hanzi: '卤', pinyin: 'lǔ', nl: 'in kruidenbouillon gegaard', en: 'master-stock braise' },
      undefined,
      { tier: 1, freqRank: 3747 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['swish in broth', 'chilli-hot', 'boil'],
      0,
      'shuàn · kort dompelen (swished through broth). This is hotpot — you cook the food yourself at the table.',
      { hanzi: '涮', pinyin: 'shuàn', nl: 'kort dompelen', en: 'swish in broth', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '涮',
        components: [{ componentId: WATER_RADICAL.id, role: 'semantic' }],
        semantic_radical: WATER_RADICAL.id,
      },
      { tier: 1, freqRank: 4527 },
    ],
  ],
  high: [
    [
      'On the menu. What does this cooking method do to it?',
      ['swish in broth', 'pan-fry', 'gizzard'],
      0,
      'shuàn · kort dompelen (swished through broth). This is hotpot — you cook the food yourself at the table.',
      { hanzi: '涮', pinyin: 'shuàn', nl: 'kort dompelen', en: 'swish in broth', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '涮',
        components: [{ componentId: WATER_RADICAL.id, role: 'semantic' }],
        semantic_radical: WATER_RADICAL.id,
      },
      { tier: 1, freqRank: 4527 },
    ],
  ],
};
