import type { CategoryContent } from './row.js';

/** street-trade — generated from DESIGN.md §7. IDS notation is verbatim; ui/glyphs.tsx draws it. */
export const STREET_TRADE: CategoryContent = {
  low: [
    [
      '厕所 — you see this on a sign. What does it mean?',
      ['toilet (blunt)', 'tea', 'hotpot', 'laundry'],
      0,
      'cèsuǒ · wc. ⿸厂则; 厕 侧 测 all read cè, though 则 itself is zé — the series predicts across derivatives, not from the phonetic. 所 = ⿰户斤, rank 100.',
    ],
    [
      '洗手间 — you see this on a sign. What does it mean?',
      ['washroom (polite)', 'coffee', 'petrol station', 'hotel (larger)'],
      0,
      'xǐshǒujiān · toilet. Band 1. 手 (138) and 间 (144) are top-150, but 洗 is rank 1,376 and needs its own exposure. The register gap from 厕所 is the taught content.',
    ],
  ],
  mid: [
    [
      '药店 — you see this on a sign. What does it mean?',
      ['pharmacy', 'car park', 'laundry', 'snacks, cheap eats'],
      0,
      'yàodiàn · apotheek. Band 2. ⿱艹约, 9 strokes; traditional 藥 is 19 and never ships. Green cross livery arrives before the characters.',
    ],
    [
      '医院 — you see this on a sign. What does it mean?',
      ['hospital', 'snacks, cheap eats', 'barber, hairdresser', 'restaurant or hotel'],
      0,
      'yīyuàn · ziekenhuis. Band 1. ⿰阝完, 阝 on the left (mound, 阜). Contrast 邮. 急诊 is A&E.',
    ],
    [
      '银行 — you see this on a sign. What does it mean?',
      ['bank', 'noodle shop', 'post office', 'restaurant'],
      0,
      'yínháng · bank. Band 2, the 行 = háng exemplar. ⿰钅艮 — but 根 gēn, 很 hěn, 跟 gēn scatter on initials and 银 yín fits worst: a shape cue, not a rule.',
    ],
    [
      '邮局 — you see this on a sign. What does it mean?',
      ['post office', 'snacks, cheap eats', 'clinic', 'car park'],
      0,
      'yóujú · postkantoor. Band 4. ⿰由阝, 阝 on the right (settlement, 邑) — a different component from the 阝 in 院 despite identical rendering and codepoint, U+961D. Store per item. Green livery.',
    ],
    [
      '派出所 — you see this on a sign. What does it mean?',
      ['local police station', 'noodle shop', 'hotel (mid-range)', 'snacks, cheap eats'],
      0,
      'pàichūsuǒ · politiebureau. Absent from every band. Where a lost passport is reported; 出入境管理 handles visas.',
    ],
    [
      '快递 — you see this on a sign. What does it mean?',
      ['courier, parcel point', 'washroom (polite)', 'barber, hairdresser', 'hotpot'],
      0,
      'kuàidì · pakketpunt. Band 4. ⿺辶弟, 弟 dì giving 递 dì, tone and all — the one fully transparent phonetic here. Fascias read 顺丰, 菜鸟驿站.',
    ],
    [
      '加油站 — you see this on a sign. What does it mean?',
      ['petrol station', 'local police station', 'restaurant or hotel', 'hospital'],
      0,
      'jiāyóuzhàn · tankstation. Band 4. Reuses 站 from 7.3 in a different sense — a contexts entry for the graduation gate.',
    ],
    [
      '停车场 — you see this on a sign. What does it mean?',
      ['car park', 'petrol station', 'washroom (polite)', 'hospital'],
      0,
      'tíngchēchǎng · parkeerplaats. Band 2. Reuses 场 and 车. Signed P.',
    ],
  ],
  high: [
    [
      '诊所 — you see this on a sign. What does it mean?',
      ['clinic', 'laundry', 'hotel (larger)', 'local police station'],
      0,
      'zhěnsuǒ · huisartsenpraktijk. Band 7–9, rank 1,906. 讠 on the left (speech); 讠 recurs in 证, 话, 语.',
    ],
    [
      '理发 — you see this on a sign. What does it mean?',
      ['barber, hairdresser', 'washroom (polite)', 'hotel (mid-range)', 'restaurant'],
      0,
      'lǐfà · kapper. Band 3. 发 reads fà here, not fā, stored per item. Lint case: 理发 → 理髮, not 理發.',
    ],
    [
      '洗衣 — you see this on a sign. What does it mean?',
      ['laundry', 'barber, hairdresser', 'local police station', 'petrol station'],
      0,
      'xǐyī · wasserij. Absent from HSK. Reuses 洗 from 洗手间, and at rank 1,376 that reuse does real work.',
    ],
    [
      '酒店 — you see this on a sign. What does it mean?',
      ['hotel (larger)', 'snacks, cheap eats', 'coffee', 'hotpot'],
      0,
      'jiǔdiàn · hotel. Band 2. ⿰氵酉, radical of record 酉 (fermented). Foil: 洒 sǎ = ⿰氵西.',
    ],
    [
      '宾馆 — you see this on a sign. What does it mean?',
      ['hotel (mid-range)', 'post office', 'hospital', 'clinic'],
      0,
      'bīnguǎn · hotel. Band 5. ⿱宀兵, rank 1,630. 招待所 is basic and often refuses foreigners.',
    ],
    [
      '饭店 — you see this on a sign. What does it mean?',
      ['restaurant or hotel', 'restaurant', 'clinic', 'snacks, cheap eats'],
      0,
      'fàndiàn · restaurant of hotel. The trap item. Band 1 word, band 1 characters, ambiguous compound.',
    ],
    [
      '餐厅 — you see this on a sign. What does it mean?',
      ['restaurant', 'restaurant or hotel', 'bank', 'tea'],
      0,
      'cāntīng · restaurant. Band 5. 餐 = ⿱⿰歺又食 (the 食 form, not 饣); 厅 = ⿸厂丁. Unambiguous where 饭店 is not.',
    ],
    [
      '小吃 — you see this on a sign. What does it mean?',
      ['snacks, cheap eats', 'restaurant', 'noodle shop', 'hospital'],
      0,
      'xiǎochī · snackbar. Band 4. Not a head but a specialiser appearing alone on a fascia. The cheapest hot food in China.',
    ],
    [
      '面馆 — you see this on a sign. What does it mean?',
      ['noodle shop', 'barber, hairdresser', 'hotel (mid-range)', 'restaurant or hotel'],
      0,
      'miànguǎn · noedelzaak. Absent from HSK. Lint case: 面馆 → 麵館, never 面館.',
    ],
    [
      '火锅 — you see this on a sign. What does it mean?',
      ['hotpot', 'restaurant or hotel', 'local police station', 'restaurant'],
      0,
      'huǒguō · hotpot. Band 7–9. ⿰钅呙 — 钅 a fourth time across the two sections.',
    ],
    [
      '咖啡 — you see this on a sign. What does it mean?',
      ['coffee', 'hotel (mid-range)', 'laundry', 'snacks, cheap eats'],
      0,
      'kāfēi · koffie. Band 3, ranks 2,620 and 2,581. ⿰口加 and ⿰口非: the semantic read fails, the phonetic read works (非 fēi → 啡 fēi), and 口 on a rare character flags a transcription.',
    ],
    [
      '茶 — you see this on a sign. What does it mean?',
      ['tea', 'petrol station', 'pharmacy', 'hotel (mid-range)'],
      0,
      'chá · thee. ⿱艹⿱人木, rank 851, band 1. 茶楼 teahouse, 奶茶 bubble tea.',
    ],
  ],
};
