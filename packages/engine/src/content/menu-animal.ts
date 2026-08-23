import {
  MEAT_RADICAL,
  GAN_PHONETIC,
  ANIMAL_RADICAL,
  FOOD_RADICAL,
  METAL_RADICAL,
  GUO_PHONETIC,
  GRAIN_RADICAL,
} from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * menu-animal — generated from DESIGN.md §7.1. IDS notation verbatim;
 * ui/glyphs.tsx draws it. The organ/texture rows are the flagship worked
 * example for the ⺼/月 ruling (§7.1 "the organ and texture set - where ⺼
 * earns its keep"): eight of these twelve characters (肠肚肝腰脑肺肾胗) carry
 * the flesh radical ⺼ U+2EBC, and 血/舌/皮 explicitly do NOT - both facts are
 * only ever expressed as a stored `semantic_radical`/`structure` field here,
 * never as a match against the rendered glyph.
 *
 * A decomposition-backfill pass (Aug 2026) added four more, all verified
 * against the gitignored Make Me a Hanzi scratch copy: 猪 carries the animal
 * radical `ANIMAL_RADICAL` (犭, MMH's own hint is 'animal', not 'dog' — a
 * generic beast radical, not a claim that pigs are dogs); 饭/饺 carry the
 * food radical `FOOD_RADICAL` (饣), both semantic-only — their phonetic
 * halves (反/交) are tone-only near misses (fǎn/fàn, jiāo/jiǎo), not the
 * exact match this bank requires; 锅's phonetic half, 呙 (guō), IS an exact
 * tone-and-syllable match for guō, the same 'exact' bar as `GAN_PHONETIC`;
 * 粉 carries the grain radical `GRAIN_RADICAL` (米, MMH's hint is 'grain'),
 * semantic-only since its phonetic half 分 (fēn) is a tone-only near miss for
 * fěn. 面 (noodles) is left undecomposed: Make Me a Hanzi has no
 * decomposition data for it at all (it is itself a pictograph, "a person's
 * face", with no component breakdown recorded).
 */
export const MENU_ANIMAL: CategoryContent = {
  low: [
    [
      'On the menu. What are you about to eat?',
      ['meat — by default pork', 'brain', 'kidney'],
      0,
      'ròu · vlees (meat) — on menus this means pork unless another meat is specified.',
      { hanzi: '肉', pinyin: 'ròu', nl: 'vlees — standaard varkensvlees', en: 'meat — by default pork' },
      undefined,
      { tier: 0, freqRank: 869 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['vegetarian', 'steam', 'house specialty'],
      0,
      'sù · vegetarisch (vegetarian) — though "vegetarian" dishes are often still cooked with oyster sauce or meat stock.',
      { hanzi: '素', pinyin: 'sù', nl: 'vegetarisch', en: 'vegetarian' },
      undefined,
      { tier: 0 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['meat-containing', 'steam', 'standard portion'],
      0,
      'hūn · met vlees (meat-containing) — often used as the "meat" heading paired against 素 ("vegetarian").',
      { hanzi: '荤', pinyin: 'hūn', nl: 'met vlees', en: 'meat-containing' },
      undefined,
      { tier: 0, freqRank: 3302 },
    ],
  ],
  mid: [
    [
      'On the menu. What are you about to eat?',
      ['chicken', 'intestine', 'flash-fry'],
      0,
      'jī · kip (chicken).',
      { hanzi: '鸡', pinyin: 'jī', nl: 'kip', en: 'chicken' },
      undefined,
      { tier: 1, freqRank: 1249 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['beef', 'kidney', 'tendon'],
      0,
      'niú · rund (beef).',
      { hanzi: '牛', pinyin: 'niú', nl: 'rund', en: 'beef' },
      undefined,
      { tier: 1, freqRank: 881 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['pig', 'tongue', 'beef'],
      0,
      'zhū · varken (pig).',
      { hanzi: '猪', pinyin: 'zhū', nl: 'varken', en: 'pig', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '猪',
        components: [{ componentId: ANIMAL_RADICAL.id, role: 'semantic' }],
        semantic_radical: ANIMAL_RADICAL.id,
      },
      { tier: 1, freqRank: 1633 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['lamb, mutton, goat', 'vegetarian', 'shrimp, prawn'],
      0,
      'yáng · lam, schaap, geit — one character covers lamb, mutton and goat.',
      { hanzi: '羊', pinyin: 'yáng', nl: 'lam, schaap, geit', en: 'lamb, mutton, goat' },
      undefined,
      { tier: 1, freqRank: 1340 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['fish', 'tongue', 'brain'],
      0,
      'yú · vis (fish) — one of the most common proteins you\'ll see on a menu.',
      { hanzi: '鱼', pinyin: 'yú', nl: 'vis', en: 'fish' },
      undefined,
      { tier: 1, freqRank: 452 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['shrimp, prawn', 'chicken', 'brain'],
      0,
      'xiā · garnaal (shrimp, prawn) — worth recognizing if you have a shellfish allergy.',
      { hanzi: '虾', pinyin: 'xiā', nl: 'garnaal', en: 'shrimp, prawn' },
      undefined,
      { tier: 1, freqRank: 2460 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['egg', 'soup', 'shrimp, prawn'],
      0,
      'dàn · ei (egg).',
      { hanzi: '蛋', pinyin: 'dàn', nl: 'ei', en: 'egg' },
      undefined,
      { tier: 1, freqRank: 1157 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['cooked rice; also "meal"', 'stir-fry', 'tossed, dressed'],
      0,
      'fàn · rijst, maaltijd (cooked rice; also "meal") — as in 炒饭 (fried rice), 米饭 (steamed rice).',
      { hanzi: '饭', pinyin: 'fàn', nl: 'rijst, maaltijd', en: 'cooked rice; also "meal"', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '饭',
        components: [{ componentId: FOOD_RADICAL.id, role: 'semantic' }],
        semantic_radical: FOOD_RADICAL.id,
      },
      { tier: 1 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['wheat noodles; also "flour"', 'pan-fry', 'shrimp, prawn'],
      0,
      'miàn · tarwenoedels (wheat noodles; also "flour"). Shows up in compounds like 面馆 (noodle shop).',
      { hanzi: '面', pinyin: 'miàn', nl: 'tarwenoedels', en: 'wheat noodles; also "flour"' },
      undefined,
      { tier: 1, freqRank: 76 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['rice noodles; also "powder"', 'swish in broth', 'staples: rice, noodles, buns'],
      0,
      'fěn · rijstnoedels (rice noodles) — the same character can also mean "powder", but on a menu it means noodles.',
      { hanzi: '粉', pinyin: 'fěn', nl: 'rijstnoedels', en: 'rice noodles; also "powder"', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '粉',
        components: [{ componentId: GRAIN_RADICAL.id, role: 'semantic' }],
        semantic_radical: GRAIN_RADICAL.id,
      },
      { tier: 1 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['dumpling', 'rice noodles; also "powder"', 'boil'],
      0,
      'jiǎo · dumpling.',
      { hanzi: '饺', pinyin: 'jiǎo', nl: 'dumpling', en: 'dumpling', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '饺',
        components: [{ componentId: FOOD_RADICAL.id, role: 'semantic' }],
        semantic_radical: FOOD_RADICAL.id,
      },
      { tier: 1, freqRank: 3891 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['filled steamed bun', 'swish in broth', 'gizzard'],
      0,
      'bāo · gevuld gestoomd broodje (filled steamed bun) — unlike 馒头, which is the plain, unfilled version.',
      { hanzi: '包', pinyin: 'bāo', nl: 'gevuld gestoomd broodje', en: 'filled steamed bun' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['pot', 'large portion', 'small portion'],
      0,
      'guō · pan, pot (pot) — as in 火锅 (hotpot), 砂锅 (clay pot), 干锅 (dry pot). Built from 钅 (metal) plus 呙, which happens to give the whole character its exact reading, guō.',
      { hanzi: '锅', pinyin: 'guō', nl: 'pan', en: 'pot', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '锅',
        components: [
          { componentId: METAL_RADICAL.id, role: 'semantic' },
          { componentId: GUO_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: METAL_RADICAL.id,
      },
      { tier: 1, freqRank: 1520 },
    ],
  ],
  high: [
    [
      'On the menu. What are you about to eat?',
      ['intestine', 'pan-fry', 'master-stock braise'],
      0,
      'cháng · darm (intestine) — as in 肥肠, 大肠.',
      { hanzi: '肠', pinyin: 'cháng', nl: 'darm', en: 'intestine', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '肠',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 1512 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['tripe, stomach', 'liver', 'tendon'],
      0,
      'dǔ · pens, maag (tripe, stomach) — as in 毛肚 on hotpot menus. Read with a different tone, dù, it instead means "belly".',
      { hanzi: '肚', pinyin: 'dǔ', nl: 'pens, maag', en: 'tripe, stomach', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '肚',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['liver', 'cold dishes', 'lung'],
      0,
      'gān · lever (liver) — as in 猪肝 (pork liver), 鹅肝 (foie gras). Built from 肉 (meat, bound as the shape 月 inside this character) plus 干, which happens to give the whole character its exact reading, gān.',
      { hanzi: '肝', pinyin: 'gān', nl: 'lever', en: 'liver', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '肝',
        components: [
          { componentId: MEAT_RADICAL.id, role: 'semantic' },
          { componentId: GAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: MEAT_RADICAL.id,
      },
      // DESIGN.md §5.1's confer beat: 肝/腰/肺 are equivalent-difficulty
      // alternatives of each other - same category, same tier, same
      // left-right meat-radical-semantic structure, same "which organ"
      // question shape, and close freqRanks (1829/1489/2140) - so any one of
      // them stands in for "did the peer-instruction conversation transfer,"
      // not "is this specific character now known."
      { tier: 2, freqRank: 1829, isomorph_group_id: 'menu-animal-organ-meat-radical' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['kidney', 'boil', 'cold dishes'],
      0,
      'yāo · nier (kidney) — as in 腰花. The same character also means "waist".',
      { hanzi: '腰', pinyin: 'yāo', nl: 'nier', en: 'kidney', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '腰',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 1489, isomorph_group_id: 'menu-animal-organ-meat-radical' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['lung', 'pot', 'wheat noodles; also "flour"'],
      0,
      'fèi · long (lung) — despite its name, 夫妻肺片 no longer actually contains lung.',
      { hanzi: '肺', pinyin: 'fèi', nl: 'long', en: 'lung', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '肺',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 2140, isomorph_group_id: 'menu-animal-organ-meat-radical' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['kidney', 'swish in broth', 'gizzard'],
      0,
      'shèn · nier (kidney).',
      { hanzi: '肾', pinyin: 'shèn', nl: 'nier', en: 'kidney', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '肾',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 2131 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['brain', 'steam', 'master-stock braise'],
      0,
      'nǎo · hersenen (brain) — as in 脑花.',
      { hanzi: '脑', pinyin: 'nǎo', nl: 'hersenen', en: 'brain', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '脑',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 909 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['gizzard', 'large portion', 'signature dish'],
      0,
      'zhēn · spiermaag (gizzard). By frequency alone this is unreachable - rank 7,674 in a hundred-million-token corpus - but on a hotpot order sheet it is one of the most consequential characters on the page.',
      { hanzi: '胗', pinyin: 'zhēn', nl: 'spiermaag', en: 'gizzard', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '胗',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
      { tier: 2, freqRank: 7674 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['blood, as a set curd', 'swish in broth', 'liver'],
      0,
      'xuè · bloed, als gestolde koek (blood, served as a set curd) — as in 鸭血 (duck blood), 毛血旺. Despite sitting beside seven meat-radical characters on this menu, 血 does not carry the meat radical at all - its own radical is 血.',
      { hanzi: '血', pinyin: 'xuè', nl: 'bloed, als gestolde koek', en: 'blood, as a set curd' },
      undefined,
      { tier: 2, freqRank: 631 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['tongue', 'egg', 'blood, as a set curd'],
      0,
      'shé · tong (tongue) — as in 牛舌 (beef tongue). Also does not carry the meat radical: it is 千 over 口.',
      { hanzi: '舌', pinyin: 'shé', nl: 'tong', en: 'tongue', structure: 'top-bottom' },
      undefined,
      { tier: 2, freqRank: 1914 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['tendon', 'kidney', 'standard portion'],
      0,
      'jīn · pees (tendon).',
      { hanzi: '筋', pinyin: 'jīn', nl: 'pees', en: 'tendon' },
      undefined,
      { tier: 2 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['skin, crackling', 'pig', 'kidney'],
      0,
      'pí · huid, zwoerd (skin, crackling) — as in 猪皮 (pork skin), 皮蛋 (preserved egg). A third organ-set character with no meat radical - 皮 is its own radical.',
      { hanzi: '皮', pinyin: 'pí', nl: 'huid, zwoerd', en: 'skin, crackling', structure: 'atomic' },
      undefined,
      { tier: 2, freqRank: 739 },
    ],
  ],
};
