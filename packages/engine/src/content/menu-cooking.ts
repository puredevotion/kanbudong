import {
  FIRE_RADICAL,
  KAO_PHONETIC,
  MEN_PHONETIC,
  BAO_PHONETIC,
  FIRE_DOTS_RADICAL,
  WATER_RADICAL,
  HAND_RADICAL,
  BAN_PHONETIC,
  SHAO_PHONETIC,
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
 * copy. 炸, the seventh left-right fire-radical cooking method on this menu,
 * also reuses `FIRE_RADICAL` (mnemonic-only decomposition-gap audit, Aug
 * 2026, the 价 bug's aftermath - a rejected phonetic claim is not a reason to
 * withhold the real semantic half too). Its actual menu reading is zhá, but
 * its phonetic half 乍 is zhà/zuò - a tone-and-reading mismatch, not the exact
 * match this bank requires (see the organ set's 肝/干, 站/占, 城/成), so 炸
 * ships semantic-only. 煮/煎
 * carry ⿱X灬, the four-dot variant of the same radical (`FIRE_DOTS_RADICAL`).
 * 蒸 (steam) and 卤 (master-stock braise) are left undecomposed: 蒸's own Make
 * Me a Hanzi entry calls it ideographic with no clean semantic/phonetic
 * split, and 卤 has no decomposition data in Make Me a Hanzi at all (it is
 * itself a radical). 汤/涮 carry the water radical `WATER_RADICAL`; neither
 * phonetic half (昜/刷) is an exact-tone match, so both ship semantic-only.
 * 拌's phonetic half 半 (bàn) is an exact tone-and-syllable match for 拌
 * (bàn), the same 'exact' bar as `GAN_PHONETIC`. 炒's phonetic half 少 was
 * initially dropped the same way 乍/昜/刷 were (checked only against the
 * 'exact' bar, chǎo vs shǎo/shào differ in initial) - corrected after a
 * Dong Chinese cross-check flagged it: real phonetic components landing
 * outside the 'exact' tier are the norm, not the exception (DESIGN.md
 * §1.4/§3.3.2c's own P24 finding), so 炒 now ships `SHAO_PHONETIC` at
 * `reliability: 'rime-only'` rather than being dropped to semantic-only.
 */
export const MENU_COOKING: CategoryContent = {
  low: [
    [
      'On the menu. What does this cooking method do to it?',
      ['stir-fry', 'pan-fry', 'beef'],
      0,
      'chǎo · roerbakken (stir-fry). The most common cooking word you will see on menus. Built from 火 (fire) plus 少, which rhymes with the whole character\'s reading (shǎo/chǎo) without being an exact match.',
      { hanzi: '炒', pinyin: 'chǎo', nl: 'roerbakken', en: 'stir-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炒',
        components: [
          { componentId: FIRE_RADICAL.id, role: 'semantic' },
          { componentId: SHAO_PHONETIC.id, role: 'phonetic' },
        ],
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
      'chǎo · roerbakken (stir-fry). The most common cooking word you will see on menus. Built from 火 (fire) plus 少, which rhymes with the whole character\'s reading (shǎo/chǎo) without being an exact match.',
      { hanzi: '炒', pinyin: 'chǎo', nl: 'roerbakken', en: 'stir-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炒',
        components: [
          { componentId: FIRE_RADICAL.id, role: 'semantic' },
          { componentId: SHAO_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 2590 },
    ],
    [
      'On the menu. What does this cooking method do to it?',
      ['steam', 'beef', 'swish in broth'],
      0,
      'zhēng · stomen (steamed). A safe, mild choice — no added oil. Picture 蒸 as a steamer basket over four little flames (灬), with vegetables (艹) rising up through a pair of lifting hands (丞) in a cloud of vapor: zhēng.',
      { hanzi: '蒸', pinyin: 'zhēng', nl: 'stomen', en: 'steam' },
      undefined,
      { tier: 1, freqRank: 2358, glossProvenance: 'mnemonic-only' },
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
      'zhá · frituren (deep-fried). The same character can also be read zhà, meaning "to explode" — on a menu it always means deep-fried. Picture 炸 as fire (火) that suddenly (乍) flares up the instant the food hits the hot oil: zhá.',
      { hanzi: '炸', pinyin: 'zhá', nl: 'frituren', en: 'deep-fry', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '炸',
        components: [{ componentId: FIRE_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_RADICAL.id,
      },
      { tier: 1, freqRank: 976, glossProvenance: 'mnemonic-only' },
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
      'lǔ · in kruidenbouillon gegaard (master-stock braised). Dark and fragrant with star anise, usually served cold, often organ meat. Picture 卤 as a covered pot — the outer frame is the lid, and inside it sits a dark pool of spiced braising liquid: lǔ.',
      { hanzi: '卤', pinyin: 'lǔ', nl: 'in kruidenbouillon gegaard', en: 'master-stock braise' },
      undefined,
      { tier: 1, freqRank: 3747, glossProvenance: 'mnemonic-only' },
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
