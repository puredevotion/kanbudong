import {
  MEAT_RADICAL,
  GAN_PHONETIC,
  ANIMAL_RADICAL,
  FOOD_RADICAL,
  METAL_RADICAL,
  GUO_PHONETIC,
  GRAIN_RADICAL,
  BIRD_RADICAL,
  INSECT_RADICAL,
  WRAP_PHONETIC,
  BAMBOO_RADICAL,
  SILK_RADICAL_FULL,
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
 *
 * Rest-of-bank coverage pass (Aug 2026): 鸡 gets a verified CharacterDecomposition
 * (semantic 鸟, `BIRD_RADICAL`; MMH's own hint for its other half, 又, is
 * "another kind of", not a phonetic claim, and 又's reading yòu doesn't match
 * jī anyway). 虾/蛋 both carry `INSECT_RADICAL` (虫); neither phonetic half
 * (下/延) is a tone-or-syllable match for xiā/dàn, so both are semantic-only.
 * 包 carries `WRAP_PHONETIC` alone: MMH's own hint says 勹 ("wrap, swaddle")
 * "also provides the pronunciation," and unlike 快's rejected 夬, 勹's actual
 * reading (bāo) is an exact match - no separate semantic component is claimed
 * since MMH names none. 素 carries `SILK_RADICAL_FULL` (糸, the traditional/
 * standalone form of `SILK_RADICAL`'s 纟 - a different id because the
 * rendered shape differs, same rule `FIRE_DOTS_RADICAL` states for 火/灬); MMH
 * records no phonetic component for it. 肉/牛/羊/鱼/血/舌 have no MMH semantic/
 * phonetic split clean enough to ship as a verified decomposition (each is
 * either a bare pictograph with an unresolved sub-shape in MMH's own data, or
 * an ideographic compound with no recognizable reusable radical), so each
 * carries a labelled `glossProvenance: 'mnemonic-only'` story instead - 舌's
 * explanation already
 * named its real 千+口 shape in prose before this pass; the prose is kept,
 * reframed as an invented picture rather than an assertion. 皮 is left exactly
 * as the organ-set backfill already decided: MMH's own decomposition records
 * an unresolved component (⿸？攴), so neither a verified decomposition nor an
 * honest mnemonic is available - unchanged from that phase's call.
 */
export const MENU_ANIMAL: CategoryContent = {
  low: [
    [
      'On the menu. What are you about to eat?',
      ['meat — by default pork', 'brain', 'kidney'],
      0,
      'ròu · vlees (meat) — on menus this means pork unless another meat is specified. Picture 肉 as a rack of ribs seen from the side: the outer frame is the ribcage, and the strokes inside are meat still clinging to the bone: ròu.',
      { hanzi: '肉', pinyin: 'ròu', nl: 'vlees — standaard varkensvlees', en: 'meat — by default pork' },
      undefined,
      { tier: 0, freqRank: 869, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['vegetarian', 'steam', 'house specialty'],
      0,
      'sù · vegetarisch (vegetarian) — though "vegetarian" dishes are often still cooked with oyster sauce or meat stock. Carries the 糸 (silk) radical - plain silk thread, nothing dyed or dressed up.',
      { hanzi: '素', pinyin: 'sù', nl: 'vegetarisch', en: 'vegetarian', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '素',
        components: [{ componentId: SILK_RADICAL_FULL.id, role: 'semantic' }],
        semantic_radical: SILK_RADICAL_FULL.id,
      },
      { tier: 0 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['meat-containing', 'steam', 'standard portion'],
      0,
      'hūn · met vlees (meat-containing) — often used as the "meat" heading paired against 素 ("vegetarian"). Picture 荤 as a military camp (军) hidden under leafy cover (艹), roasting meat over a campfire while the vegetarian camp next door eats greens: hūn.',
      { hanzi: '荤', pinyin: 'hūn', nl: 'met vlees', en: 'meat-containing' },
      undefined,
      { tier: 0, freqRank: 3302, glossProvenance: 'mnemonic-only' },
    ],
  ],
  mid: [
    [
      'On the menu. What are you about to eat?',
      ['chicken', 'intestine', 'flash-fry'],
      0,
      'jī · kip (chicken). Carries the 鸟 (bird) radical.',
      { hanzi: '鸡', pinyin: 'jī', nl: 'kip', en: 'chicken', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '鸡',
        components: [{ componentId: BIRD_RADICAL.id, role: 'semantic' }],
        semantic_radical: BIRD_RADICAL.id,
      },
      { tier: 1, freqRank: 1249 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['beef', 'kidney', 'tendon'],
      0,
      'niú · rund (beef). Picture 牛 as an ox\'s head seen head-on: two horns curving up and out, one line down for the face: niú.',
      { hanzi: '牛', pinyin: 'niú', nl: 'rund', en: 'beef' },
      undefined,
      { tier: 1, freqRank: 881, glossProvenance: 'mnemonic-only' },
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
      'yáng · lam, schaap, geit — one character covers lamb, mutton and goat. Picture 羊 as a sheep\'s head seen head-on: two curling horns on top, a long face underneath: yáng.',
      { hanzi: '羊', pinyin: 'yáng', nl: 'lam, schaap, geit', en: 'lamb, mutton, goat' },
      undefined,
      { tier: 1, freqRank: 1340, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['fish', 'tongue', 'brain'],
      0,
      'yú · vis (fish) — one of the most common proteins you\'ll see on a menu. Picture 鱼 as a fish swimming straight up: the top is its mouth breaking the surface, the middle strokes are its fins, the box below is its scaled body: yú.',
      { hanzi: '鱼', pinyin: 'yú', nl: 'vis', en: 'fish' },
      undefined,
      { tier: 1, freqRank: 452, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['shrimp, prawn', 'chicken', 'brain'],
      0,
      'xiā · garnaal (shrimp, prawn) — worth recognizing if you have a shellfish allergy. Carries the 虫 (insect/small-creature) radical, the same one in 蛋 (egg).',
      { hanzi: '虾', pinyin: 'xiā', nl: 'garnaal', en: 'shrimp, prawn', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '虾',
        components: [{ componentId: INSECT_RADICAL.id, role: 'semantic' }],
        semantic_radical: INSECT_RADICAL.id,
      },
      { tier: 1, freqRank: 2460 },
    ],
    [
      'On the menu. What are you about to eat?',
      ['egg', 'soup', 'shrimp, prawn'],
      0,
      'dàn · ei (egg). Carries the same 虫 (insect/small-creature) radical as 虾 (shrimp).',
      { hanzi: '蛋', pinyin: 'dàn', nl: 'ei', en: 'egg', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '蛋',
        components: [{ componentId: INSECT_RADICAL.id, role: 'semantic' }],
        semantic_radical: INSECT_RADICAL.id,
      },
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
      'miàn · tarwenoedels (wheat noodles; also "flour"). Shows up in compounds like 面馆 (noodle shop). Picture the outer frame of 面 as a flat plate, and the strokes inside as a tangle of noodles piled onto it: miàn.',
      { hanzi: '面', pinyin: 'miàn', nl: 'tarwenoedels', en: 'wheat noodles; also "flour"' },
      undefined,
      { tier: 1, freqRank: 76, glossProvenance: 'mnemonic-only' },
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
      'bāo · gevuld gestoomd broodje (filled steamed bun) — unlike 馒头, which is the plain, unfilled version. 勹 (bāo), the outer wrapping shape, gives the exact sound.',
      { hanzi: '包', pinyin: 'bāo', nl: 'gevuld gestoomd broodje', en: 'filled steamed bun' },
      {
        kind: 'character',
        hanzi: '包',
        components: [{ componentId: WRAP_PHONETIC.id, role: 'phonetic' }],
      },
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
      'xuè · bloed, als gestolde koek (blood, served as a set curd) — as in 鸭血 (duck blood), 毛血旺. Despite sitting beside seven meat-radical characters on this menu, 血 does not carry the meat radical at all - its own radical is 血. Picture 血 as a wide, shallow bowl with a single drop splashed into it - a bowl catching blood: xuè.',
      { hanzi: '血', pinyin: 'xuè', nl: 'bloed, als gestolde koek', en: 'blood, as a set curd' },
      undefined,
      { tier: 2, freqRank: 631, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['tongue', 'egg', 'blood, as a set curd'],
      0,
      'shé · tong (tongue) — as in 牛舌 (beef tongue). Also does not carry the meat radical. Picture 舌 as a tongue sticking straight out of an open mouth (口), with the stroke above it as the tongue itself: shé.',
      { hanzi: '舌', pinyin: 'shé', nl: 'tong', en: 'tongue', structure: 'top-bottom' },
      undefined,
      { tier: 2, freqRank: 1914, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What are you about to eat?',
      ['tendon', 'kidney', 'standard portion'],
      0,
      'jīn · pees (tendon). Carries the 竹 (bamboo) radical on top - tendons pictured as bamboo-like strands.',
      { hanzi: '筋', pinyin: 'jīn', nl: 'pees', en: 'tendon', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '筋',
        components: [{ componentId: BAMBOO_RADICAL.id, role: 'semantic' }],
        semantic_radical: BAMBOO_RADICAL.id,
      },
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
