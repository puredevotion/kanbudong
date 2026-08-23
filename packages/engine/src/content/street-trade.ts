import { GRASS_RADICAL } from '../components.js';
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
 */
export const STREET_TRADE: CategoryContent = {
  low: [
    [
      'On a shopfront. What is this place?',
      ['toilet (blunt)', 'hotpot', 'laundry'],
      0,
      'cèsuǒ · wc (blunt word for toilet). 厕 shares its reading with 侧 and 测, but the part it\'s built from, 则, is actually read zé — so that part alone won\'t tell you the sound.',
      { hanzi: '厕所', pinyin: 'cèsuǒ', nl: 'wc', en: 'toilet (blunt)' },
      undefined,
      { tier: 0 },
    ],
    [
      'On a shopfront. What is this place?',
      ['washroom (polite)', 'petrol station', 'hotel (larger)'],
      0,
      'xǐshǒujiān · washroom (the polite word for toilet). 手 (hand) and 间 (room) are both very common, but 洗 (wash) is much rarer and worth learning on its own.',
      { hanzi: '洗手间', pinyin: 'xǐshǒujiān', nl: 'toilet', en: 'washroom (polite)' },
      undefined,
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a shopfront. What is this place?',
      ['pharmacy', 'laundry', 'snacks, cheap eats'],
      0,
      'yàodiàn · apotheek (pharmacy). Look for the green cross sign — it marks a pharmacy just like in many European countries.',
      { hanzi: '药店', pinyin: 'yàodiàn', nl: 'apotheek', en: 'pharmacy' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hospital', 'barber, hairdresser', 'restaurant or hotel'],
      0,
      'yīyuàn · ziekenhuis (hospital). Don\'t mix it up with 邮 (mail) — they look similar at a glance. 急诊 means "emergency room."',
      { hanzi: '医院', pinyin: 'yīyuàn', nl: 'ziekenhuis', en: 'hospital' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['bank', 'post office', 'restaurant'],
      0,
      'yínháng · bank. Note that 行 is read háng here, not the more common xíng — it\'s a heteronym worth remembering.',
      { hanzi: '银行', pinyin: 'yínháng', nl: 'bank', en: 'bank' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['post office', 'clinic', 'car park'],
      0,
      'yóujú · postkantoor (post office). Usually marked with green signage.',
      { hanzi: '邮局', pinyin: 'yóujú', nl: 'postkantoor', en: 'post office' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['local police station', 'hotel (mid-range)', 'snacks, cheap eats'],
      0,
      'pàichūsuǒ · politiebureau (local police station). This is where you\'d report a lost passport.',
      { hanzi: '派出所', pinyin: 'pàichūsuǒ', nl: 'politiebureau', en: 'local police station' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['courier, parcel point', 'washroom (polite)', 'barber, hairdresser'],
      0,
      'kuàidì · pakketpunt (courier/parcel pickup point). 递 is pronounced dì, exactly like its 弟 component — a rare case where the shape gives you the full sound. Common signage reads 顺丰 or 菜鸟驿站.',
      { hanzi: '快递', pinyin: 'kuàidì', nl: 'pakketpunt', en: 'courier, parcel point' },
      { kind: 'word', hanzi: '快递', morphemes: [
        { span: '快', gloss: 'fast' },
        { span: '递', gloss: 'to deliver, hand over' },
      ] },
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['petrol station', 'restaurant or hotel', 'hospital'],
      0,
      'jiāyóuzhàn · tankstation (petrol station). 站 (station) also shows up in words for bus and train stations.',
      { hanzi: '加油站', pinyin: 'jiāyóuzhàn', nl: 'tankstation', en: 'petrol station' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront. What is this place?',
      ['car park', 'petrol station', 'hospital'],
      0,
      'tíngchēchǎng · parkeerplaats (car park). Often just marked with a big letter P.',
      { hanzi: '停车场', pinyin: 'tíngchēchǎng', nl: 'parkeerplaats', en: 'car park' },
      undefined,
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
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['barber, hairdresser', 'hotel (mid-range)', 'restaurant'],
      0,
      'lǐfà · kapper (barber/hairdresser). Here 发 is read fà, not the more common fā — worth remembering for this word specifically.',
      { hanzi: '理发', pinyin: 'lǐfà', nl: 'kapper', en: 'barber, hairdresser' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['laundry', 'barber, hairdresser', 'petrol station'],
      0,
      'xǐyī · wasserij (laundry). Same 洗 (wash) character as in 洗手间 — worth recognizing on sight.',
      { hanzi: '洗衣', pinyin: 'xǐyī', nl: 'wasserij', en: 'laundry' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotel (larger)', 'coffee', 'hotpot'],
      0,
      'jiǔdiàn · hotel. 酒 (wine/alcohol) is built from 酉, a component tied to fermentation. Don\'t confuse it with the similar-looking 洒 (sǎ, "to sprinkle").',
      { hanzi: '酒店', pinyin: 'jiǔdiàn', nl: 'hotel', en: 'hotel (larger)' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotel (mid-range)', 'hospital', 'clinic'],
      0,
      'bīnguǎn · hotel (mid-range). 招待所 are cheaper guesthouses that often won\'t accept foreign guests.',
      { hanzi: '宾馆', pinyin: 'bīnguǎn', nl: 'hotel', en: 'hotel (mid-range)' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['restaurant or hotel', 'restaurant', 'snacks, cheap eats'],
      0,
      'fàndiàn · restaurant or hotel — the word itself is genuinely ambiguous, so you need context to tell which one it is.',
      { hanzi: '饭店', pinyin: 'fàndiàn', nl: 'restaurant of hotel', en: 'restaurant or hotel' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['restaurant', 'restaurant or hotel', 'tea'],
      0,
      'cāntīng · restaurant. Unlike 饭店, this word unambiguously means restaurant, not hotel.',
      { hanzi: '餐厅', pinyin: 'cāntīng', nl: 'restaurant', en: 'restaurant' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['snacks, cheap eats', 'restaurant', 'noodle shop'],
      0,
      'xiǎochī · snackbar (cheap eats). Usually the cheapest hot food you\'ll find on the street.',
      { hanzi: '小吃', pinyin: 'xiǎochī', nl: 'snackbar', en: 'snacks, cheap eats' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['noodle shop', 'hotel (mid-range)', 'restaurant or hotel'],
      0,
      'miànguǎn · noedelzaak (noodle shop).',
      { hanzi: '面馆', pinyin: 'miànguǎn', nl: 'noedelzaak', en: 'noodle shop' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront. What is this place?',
      ['hotpot', 'restaurant or hotel', 'restaurant'],
      0,
      'huǒguō · hotpot. 锅 (pot) uses the 钅 (metal) radical, common in words for cookware.',
      { hanzi: '火锅', pinyin: 'huǒguō', nl: 'hotpot', en: 'hotpot' },
      undefined,
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
        components: [{ componentId: GRASS_RADICAL.id, role: 'semantic' }],
        semantic_radical: GRASS_RADICAL.id,
      },
      { tier: 2, freqRank: 1272 },
    ],
  ],
};
