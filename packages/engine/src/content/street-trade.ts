import {
  AXE_RADICAL,
  BUILDING_RADICAL,
  DOOR_RADICAL,
  GRASS_RADICAL,
  MOUND_RADICAL,
} from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * street-trade — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` (single characters only) is Jun Da's Modern Chinese Character
 * Frequency List (lingua.mtsu.edu/chinese-computing, 193,504,018-character
 * corpus, 9,933 distinct characters, dated 2004-03-30) — a different corpus
 * from the one DESIGN.md's own prose cites, so numbers here do not match
 * DESIGN.md's inline ranks character-for-character. 咖啡 is marked
 * `transparency: 'opaque'`: it is a phonetic transliteration loanword (its
 * own explanation already says so), not a compound that comes apart into
 * component meanings. 快递's word-level decomposition (快 "fast" + 递
 * "deliver, hand over") is genuinely transparent and does not need
 * phonetic verification. 茶's semantic-only CharacterDecomposition is
 * verified against the gitignored Make Me a Hanzi scratch copy (see
 * `GRASS_RADICAL` in components.ts).
 *
 * A decomposition-backfill pass (Aug 2026) added three more transparent
 * WordDecompositions, same bar as 快递: 洗手间 "wash" + "hand" + "room";
 * 药店 "medicine" + "shop"; 邮局 "mail" + "office/bureau"; and 停车场
 * "stop" + "vehicle" + "ground" (a car park). 厕所 and 洗手间 are tagged
 * `confusion_type: 'meaning-visually-distinct'` against each other - both
 * name the toilet, one blunt and one polite, but the two words share no
 * characters and look nothing alike, so they can be shown together from day
 * one rather than staged.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 银行/加油站/酒店/宾馆/饭店/面馆/火锅
 * all get `WordDecomposition`s resolving fully via existing standalones
 * (银+行, 站, 店, 馆, 店, 馆, 锅 — all already authored elsewhere in the bank).
 * 派出所/诊所 resolve via a new standalone, 所, shared with 厕所. 理发 resolves
 * via a new standalone, 发, also reused by market-checkout.ts's 发票. 医院/
 * 餐厅 each get one new standalone of their own (院/厅). 洗衣 resolves via the
 * existing 洗 (street-way.ts). 小吃 resolves via a new standalone, 小, also
 * reused by safety-warning.ts's 小心.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 所/院/厅 all get a verified CharacterDecomposition alongside their existing
 * mnemonic-only prose - every mnemonic already named the real components
 * (所's 户/斤, 院's 阝, 厅's 广) before this pass added a matching
 * decomposition field. 所 ships both halves of its ideographic pair (户
 * door, 斤 axe) as semantic, the same "two real meaningful parts" pattern
 * `FEN_SEMANTIC` uses for 份. 院's 阝 is the LEFT-side mound/hill radical
 * (阜, Kangxi 170) - a different Kangxi radical from `CITY_RADICAL`'s
 * RIGHT-side 阝 (邑, Kangxi 163, used for 邮), even though both render as the
 * identical glyph; see `MOUND_RADICAL`'s doc comment in components.ts. 厅
 * ships `BUILDING_RADICAL` (广) per MMH's own etymology, not the literal 厂
 * shown in its bare decomposition tree - a simplified-glyph artifact, not a
 * real second component. Neither 所's nor 院's nor 厅's phonetic candidate
 * (斤/完/丁) is an exact tone-and-syllable match, so all three ship
 * semantic-only. 发/小 stay bare mnemonic-only: 发's MMH decomposition
 * contains an unresolved placeholder component; 小 is a self-radical
 * pictograph with no separable component.
 */
export const STREET_TRADE: CategoryContent = {
  low: [
    [
      'On a shopfront. What is this place?',
      ['toilet (blunt)', 'hotpot', 'laundry'],
      0,
      "cèsuǒ · wc (blunt word for toilet). 厕 shares its reading with 侧 and 测, but the part it's built from, 则, is actually read zé — so that part alone won't tell you the sound.",
      { hanzi: '厕所', pinyin: 'cèsuǒ', nl: 'wc', en: 'toilet (blunt)' },
      {
        kind: 'word',
        hanzi: '厕所',
        morphemes: [
          { span: '厕', gloss: 'toilet' },
          { span: '所', gloss: 'place' },
        ],
      },
      {
        tier: 0,
        confusion_type: 'meaning-visually-distinct',
        confusable_with: ['street-trade-low-2'],
      },
    ],
    [
      'On a shopfront. What is this place?',
      ['washroom (polite)', 'petrol station', 'hotel (larger)'],
      0,
      'xǐshǒujiān · washroom (the polite word for toilet). 手 (hand) and 间 (room) are both very common, but 洗 (wash) is much rarer and worth learning on its own.',
      { hanzi: '洗手间', pinyin: 'xǐshǒujiān', nl: 'toilet', en: 'washroom (polite)' },
      {
        kind: 'word',
        hanzi: '洗手间',
        morphemes: [
          { span: '洗', gloss: 'to wash' },
          { span: '手', gloss: 'hand' },
          { span: '间', gloss: 'room' },
        ],
      },
      {
        tier: 0,
        confusion_type: 'meaning-visually-distinct',
        confusable_with: ['street-trade-low-1'],
      },
    ],
  ],
  mid: [
    [
      'On a shopfront. What is this place?',
      ['pharmacy', 'laundry', 'snacks, cheap eats'],
      0,
      'yàodiàn · apotheek (pharmacy). Look for the green cross sign — it marks a pharmacy just like in many European countries.',
      { hanzi: '药店', pinyin: 'yàodiàn', nl: 'apotheek', en: 'pharmacy' },
      {
        kind: 'word',
        hanzi: '药店',
        morphemes: [
          { span: '药', gloss: 'medicine' },
          { span: '店', gloss: 'shop' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hospital', 'barber, hairdresser', 'restaurant or hotel'],
      0,
      'yīyuàn · ziekenhuis (hospital). Don\'t mix it up with 邮 (mail) — they look similar at a glance. 急诊 means "emergency room."',
      { hanzi: '医院', pinyin: 'yīyuàn', nl: 'ziekenhuis', en: 'hospital' },
      {
        kind: 'word',
        hanzi: '医院',
        morphemes: [
          { span: '医', gloss: 'medicine, doctor' },
          { span: '院', gloss: 'institution, courtyard' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['bank', 'post office', 'restaurant'],
      0,
      "yínháng · bank. Note that 行 is read háng here, not the more common xíng — it's a heteronym worth remembering.",
      { hanzi: '银行', pinyin: 'yínháng', nl: 'bank', en: 'bank' },
      {
        kind: 'word',
        hanzi: '银行',
        morphemes: [
          { span: '银', gloss: 'silver, money' },
          { span: '行', gloss: 'trade house' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['post office', 'clinic', 'car park'],
      0,
      'yóujú · postkantoor (post office). Usually marked with green signage.',
      { hanzi: '邮局', pinyin: 'yóujú', nl: 'postkantoor', en: 'post office' },
      {
        kind: 'word',
        hanzi: '邮局',
        morphemes: [
          { span: '邮', gloss: 'mail, post' },
          { span: '局', gloss: 'office, bureau' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['local police station', 'hotel (mid-range)', 'snacks, cheap eats'],
      0,
      "pàichūsuǒ · politiebureau (local police station). This is where you'd report a lost passport.",
      { hanzi: '派出所', pinyin: 'pàichūsuǒ', nl: 'politiebureau', en: 'local police station' },
      {
        kind: 'word',
        hanzi: '派出所',
        morphemes: [
          { span: '派', gloss: 'to dispatch' },
          { span: '出', gloss: 'to exit' },
          { span: '所', gloss: 'place' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['courier, parcel point', 'washroom (polite)', 'barber, hairdresser'],
      0,
      'kuàidì · pakketpunt (courier/parcel pickup point). 递 is pronounced dì, exactly like its 弟 component — a rare case where the shape gives you the full sound. Common signage reads 顺丰 or 菜鸟驿站.',
      { hanzi: '快递', pinyin: 'kuàidì', nl: 'pakketpunt', en: 'courier, parcel point' },
      {
        kind: 'word',
        hanzi: '快递',
        morphemes: [
          { span: '快', gloss: 'fast' },
          { span: '递', gloss: 'to deliver, hand over' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['petrol station', 'restaurant or hotel', 'hospital'],
      0,
      'jiāyóuzhàn · tankstation (petrol station). 站 (station) also shows up in words for bus and train stations.',
      { hanzi: '加油站', pinyin: 'jiāyóuzhàn', nl: 'tankstation', en: 'petrol station' },
      {
        kind: 'word',
        hanzi: '加油站',
        morphemes: [
          { span: '加', gloss: 'to add' },
          { span: '油', gloss: 'oil' },
          { span: '站', gloss: 'station' },
        ],
      },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['car park', 'petrol station', 'hospital'],
      0,
      'tíngchēchǎng · parkeerplaats (car park). Often just marked with a big letter P.',
      { hanzi: '停车场', pinyin: 'tíngchēchǎng', nl: 'parkeerplaats', en: 'car park' },
      {
        kind: 'word',
        hanzi: '停车场',
        morphemes: [
          { span: '停', gloss: 'to stop' },
          { span: '车', gloss: 'vehicle' },
          { span: '场', gloss: 'ground, venue' },
        ],
      },
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a shopfront. What is this place?',
      ['clinic', 'hotel (larger)', 'local police station'],
      0,
      'zhěnsuǒ · huisartsenpraktijk (clinic). 诊 uses the 讠 (speech) radical, also seen in 证 and 话.',
      { hanzi: '诊所', pinyin: 'zhěnsuǒ', nl: 'huisartsenpraktijk', en: 'clinic' },
      {
        kind: 'word',
        hanzi: '诊所',
        morphemes: [
          { span: '诊', gloss: 'to diagnose' },
          { span: '所', gloss: 'place' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['barber, hairdresser', 'hotel (mid-range)', 'restaurant'],
      0,
      'lǐfà · kapper (barber/hairdresser). Here 发 is read fà, not the more common fā — worth remembering for this word specifically.',
      { hanzi: '理发', pinyin: 'lǐfà', nl: 'kapper', en: 'barber, hairdresser' },
      {
        kind: 'word',
        hanzi: '理发',
        morphemes: [
          { span: '理', gloss: 'to manage, reason' },
          { span: '发', gloss: 'hair' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['laundry', 'barber, hairdresser', 'petrol station'],
      0,
      'xǐyī · wasserij (laundry). Same 洗 (wash) character as in 洗手间 — worth recognizing on sight.',
      { hanzi: '洗衣', pinyin: 'xǐyī', nl: 'wasserij', en: 'laundry' },
      {
        kind: 'word',
        hanzi: '洗衣',
        morphemes: [
          { span: '洗', gloss: 'to wash' },
          { span: '衣', gloss: 'clothing' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotel (larger)', 'coffee', 'hotpot'],
      0,
      'jiǔdiàn · hotel. 酒 (wine/alcohol) is built from 酉, a component tied to fermentation. Don\'t confuse it with the similar-looking 洒 (sǎ, "to sprinkle").',
      { hanzi: '酒店', pinyin: 'jiǔdiàn', nl: 'hotel', en: 'hotel (larger)' },
      {
        kind: 'word',
        hanzi: '酒店',
        morphemes: [
          { span: '酒', gloss: 'wine, alcohol' },
          { span: '店', gloss: 'shop' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotel (mid-range)', 'hospital', 'clinic'],
      0,
      "bīnguǎn · hotel (mid-range). 招待所 are cheaper guesthouses that often won't accept foreign guests.",
      { hanzi: '宾馆', pinyin: 'bīnguǎn', nl: 'hotel', en: 'hotel (mid-range)' },
      {
        kind: 'word',
        hanzi: '宾馆',
        morphemes: [
          { span: '宾', gloss: 'guest' },
          { span: '馆', gloss: 'establishment' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['restaurant or hotel', 'restaurant', 'snacks, cheap eats'],
      0,
      'fàndiàn · restaurant or hotel — the word itself is genuinely ambiguous, so you need context to tell which one it is.',
      { hanzi: '饭店', pinyin: 'fàndiàn', nl: 'restaurant of hotel', en: 'restaurant or hotel' },
      {
        kind: 'word',
        hanzi: '饭店',
        morphemes: [
          { span: '饭', gloss: 'cooked rice, meal' },
          { span: '店', gloss: 'shop' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['restaurant', 'restaurant or hotel', 'tea'],
      0,
      'cāntīng · restaurant. Unlike 饭店, this word unambiguously means restaurant, not hotel.',
      { hanzi: '餐厅', pinyin: 'cāntīng', nl: 'restaurant', en: 'restaurant' },
      {
        kind: 'word',
        hanzi: '餐厅',
        morphemes: [
          { span: '餐', gloss: 'meal' },
          { span: '厅', gloss: 'hall' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['snacks, cheap eats', 'restaurant', 'noodle shop'],
      0,
      "xiǎochī · snackbar (cheap eats). Usually the cheapest hot food you'll find on the street.",
      { hanzi: '小吃', pinyin: 'xiǎochī', nl: 'snackbar', en: 'snacks, cheap eats' },
      {
        kind: 'word',
        hanzi: '小吃',
        morphemes: [
          { span: '小', gloss: 'small' },
          { span: '吃', gloss: 'to eat' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['noodle shop', 'hotel (mid-range)', 'restaurant or hotel'],
      0,
      'miànguǎn · noedelzaak (noodle shop).',
      { hanzi: '面馆', pinyin: 'miànguǎn', nl: 'noedelzaak', en: 'noodle shop' },
      {
        kind: 'word',
        hanzi: '面馆',
        morphemes: [
          { span: '面', gloss: 'wheat noodles' },
          { span: '馆', gloss: 'establishment' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotpot', 'restaurant or hotel', 'restaurant'],
      0,
      'huǒguō · hotpot. 锅 (pot) uses the 钅 (metal) radical, common in words for cookware.',
      { hanzi: '火锅', pinyin: 'huǒguō', nl: 'hotpot', en: 'hotpot' },
      {
        kind: 'word',
        hanzi: '火锅',
        morphemes: [
          { span: '火', gloss: 'fire' },
          { span: '锅', gloss: 'pot' },
        ],
      },
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['coffee', 'hotel (mid-range)', 'snacks, cheap eats'],
      0,
      'kāfēi · koffie (coffee). Both characters share the 口 (mouth) radical, a hint that this word is a sound-based borrowing from a foreign language rather than a word built from meaning.',
      { hanzi: '咖啡', pinyin: 'kāfēi', nl: 'koffie', en: 'coffee', transparency: 'opaque' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['tea', 'pharmacy', 'hotel (mid-range)'],
      0,
      'chá · thee (tea). Look for it in 茶楼 (teahouse) and 奶茶 (bubble tea).',
      { hanzi: '茶', pinyin: 'chá', nl: 'thee', en: 'tea', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '茶',
        components: [{ componentId: GRASS_RADICAL.id, role: 'meaning' }],
        semantic_radical: GRASS_RADICAL.id,
      },
      { tier: 2, freqRank: 1272 },
    ],
    [
      'On a shopfront. What is this place?',
      ['place', 'clinic', 'local police station'],
      0,
      'suǒ · plek (place). Seen in 厕所 (toilet), 派出所 (police station) and 诊所 (clinic) - a generic "place" suffix for institutions. Picture 所 as a door (户) guarded by an axe (斤) - only the place you\'re allowed to be: suǒ.',
      { hanzi: '所', pinyin: 'suǒ', nl: 'plek', en: 'place', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '所',
        components: [
          { componentId: DOOR_RADICAL.id, role: 'sound' },
          { componentId: AXE_RADICAL.id, role: 'unknown' },
        ],
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront. What is this place?',
      ['institution, courtyard', 'place', 'to diagnose'],
      0,
      'yuàn · instelling, binnenplaats (institution, courtyard). Seen in 医院 (hospital). Picture 院 as a walled mound (阝) enclosing a complete (完), tidy courtyard: yuàn.',
      {
        hanzi: '院',
        pinyin: 'yuàn',
        nl: 'instelling, binnenplaats',
        en: 'institution, courtyard',
        structure: 'left-right',
      },
      {
        kind: 'character',
        hanzi: '院',
        components: [{ componentId: MOUND_RADICAL.id, role: 'meaning' }],
        semantic_radical: MOUND_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront. What is this place?',
      ['hair, to issue', 'to manage, reason', 'place'],
      0,
      'fà · haar, uitgeven (hair; to issue). Seen in 理发 (haircut); the same character also means "to issue", as in 发票 (receipt), where it is read fā instead. Picture 发 as hair flying loose the moment it\'s cut free: fà.',
      { hanzi: '发', pinyin: 'fà', nl: 'haar, uitgeven', en: 'hair, to issue' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront. What is this place?',
      ['hall', 'restaurant', 'institution, courtyard'],
      0,
      'tīng · zaal (hall). Seen in 餐厅 (restaurant, literally "meal hall"). Picture 厅 as a single person (丁) standing under a wide-open shelter roof (广) - a hall roomy enough to gather in: tīng.',
      { hanzi: '厅', pinyin: 'tīng', nl: 'zaal', en: 'hall', structure: 'enclosure' },
      {
        kind: 'character',
        hanzi: '厅',
        components: [{ componentId: BUILDING_RADICAL.id, role: 'meaning' }],
        semantic_radical: BUILDING_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront. What is this place?',
      ['small', 'hall', 'place'],
      0,
      'xiǎo · klein (small). Seen in 小吃 (snacks, cheap eats). Picture 小 as a single upright stroke flanked by two tiny drops, small enough to fit right between them: xiǎo.',
      { hanzi: '小', pinyin: 'xiǎo', nl: 'klein', en: 'small' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
