import type { CategoryContent } from './row.js';

/** transit-platform — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const TRANSIT_PLATFORM: CategoryContent = {
  low: [
    [
      '站 — you see this on a sign. What does it mean?',
      ['station, stop', 'high-speed rail (G)', 'exit', 'platform'],
      0,
      'zhàn · station, halte. Rank 531. ⿰立占, 占 zhàn a transparent phonetic. Tail of 加油站, 火车站.',
    ],
    [
      '出口 — you see this on a sign. What does it mean?',
      ['exit', 'station, stop', 'large retail complex', 'metro'],
      0,
      'chūkǒu · uitgang. 出 26, 口 157. Atomic, never decomposed. Blue or black is the way out; green 安全出口 is an emergency exit.',
    ],
    [
      '入口 — you see this on a sign. What does it mean?',
      ['entrance', 'line number', 'metro', 'single-journey ticket'],
      0,
      'rùkǒu · ingang. 入 is rank 188 — not rare — but one stroke from 人: the confusion is graphic. Ship 人 as the foil.',
    ],
    [
      '号线 — you see this on a sign. What does it mean?',
      ['line number', 'high-speed rail (G)', 'metro', 'shop (older, smaller)'],
      0,
      'hào xiàn · lijnnummer. 4号线 = Line 4. 号 337, 线 378 and band 3. Absent from HSK; the roundel colour lets the player self-check.',
    ],
    [
      '换乘 — you see this on a sign. What does it mean?',
      ['transfer, change lines', 'train', 'ticket check', 'carriage, coach'],
      0,
      'huànchéng · overstappen. Absent from all bands. 换 = ⿰扌奂, and 换 唤 焕 are uniformly huàn. But 乘 is band 5, rank 1,238 — a character card first.',
    ],
  ],
  mid: [
    [
      '地铁 — you see this on a sign. What does it mean?',
      ['metro', 'ticket check', 'train', 'trade house'],
      0,
      'dìtiě · metro. Band 2. 铁 = ⿰钅失; 钅 anchors 铁 银 铺 锅 across both sections.',
    ],
    [
      '安检 — you see this on a sign. What does it mean?',
      ['security check', 'line number', 'train', 'centre'],
      0,
      'ānjiǎn · veiligheidscontrole. Band 6, behaviourally Tier 1: screening is standard and the unprepared queue wrong. 检 is 11 strokes; 17-stroke 檢 never ships.',
    ],
    [
      '方向 — you see this on a sign. What does it mean?',
      ['direction', 'centre', 'transfer, change lines', 'bound for'],
      0,
      'fāngxiàng · richting. Band 2. 方 is rank 55, six listed readings, always fāng here. Parses the platform strip.',
    ],
    [
      '票 — you see this on a sign. What does it mean?',
      ['ticket', 'centre', 'bound for', 'carriage, coach'],
      0,
      'piào · kaartje. Rank 948. ⿱覀示. Head of 单程票, 检票, 取票, 售票, 补票, 退票 — 6:1, the best ratio in the strand.',
    ],
  ],
  high: [
    [
      '开往 — you see this on a sign. What does it mean?',
      ['bound for', 'establishment, house of', 'direction', 'collect a printed ticket'],
      0,
      'kāi wǎng · richting, naar. 开 91, 往 442, both trivial; the terminus after them carries the information and is in no wordlist. Generate from city station packs.',
    ],
    [
      '单程票 — you see this on a sign. What does it mean?',
      ['single-journey ticket', 'venue, ground', 'centre', 'high-speed rail (G)'],
      0,
      'dānchéngpiào · enkeltje. 单 has three readings, dān here. 单程 ⿰禾呈 and 换乘 ⿻禾北 share chéng — pair deliberately.',
    ],
    [
      '站台 — you see this on a sign. What does it mean?',
      ['platform', 'ticket', 'carriage, coach', 'centre'],
      0,
      'zhàntái · perron. Band 6. 台 rank 372, four listed readings, tái here.',
    ],
  ],
};
