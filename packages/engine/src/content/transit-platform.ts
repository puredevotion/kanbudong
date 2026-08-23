import type { CategoryContent } from './row.js';

/** transit-platform — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const TRANSIT_PLATFORM: CategoryContent = {
  low: [
    [
      '站 — you see this on a sign. What does it mean?',
      ['station, stop', 'high-speed rail (G)', 'exit', 'platform'],
      0,
      'zhàn · station, stop. Appears in compounds like 加油站 (gas station) and 火车站 (train station).',
    ],
    [
      '出口 — you see this on a sign. What does it mean?',
      ['exit', 'station, stop', 'large retail complex', 'metro'],
      0,
      'chūkǒu · uitgang (exit). Blue or black signage marks a regular exit; a green 安全出口 sign marks an emergency exit.',
    ],
    [
      '入口 — you see this on a sign. What does it mean?',
      ['entrance', 'line number', 'metro', 'single-journey ticket'],
      0,
      'rùkǒu · ingang (entrance). 入 (rù) looks almost identical to 人 (rén, "person") — just one stroke apart, so watch out for mixing them up.',
    ],
    [
      '号线 — you see this on a sign. What does it mean?',
      ['line number', 'high-speed rail (G)', 'metro', 'shop (older, smaller)'],
      0,
      'hào xiàn · lijnnummer (line number), as in 4号线 = "Line 4". The colored roundel on the sign usually matches the line\'s official color, so you can double-check yourself.',
    ],
    [
      '换乘 — you see this on a sign. What does it mean?',
      ['transfer, change lines', 'train', 'ticket check', 'carriage, coach'],
      0,
      'huànchéng · overstappen (transfer, change lines). 换 (huàn) sounds the same as 唤 and 焕, all read huàn; 乘 (chéng) is the harder character to remember here.',
    ],
  ],
  mid: [
    [
      '地铁 — you see this on a sign. What does it mean?',
      ['metro', 'ticket check', 'train', 'trade house'],
      0,
      'dìtiě · metro. 铁 (tiě, "metal/iron") carries the metal radical 钅, also seen in 银 (silver), 铺 (shop) and 锅 (pot).',
    ],
    [
      '安检 — you see this on a sign. What does it mean?',
      ['security check', 'line number', 'train', 'centre'],
      0,
      'ānjiǎn · veiligheidscontrole (security check). Expect a screening line before boarding. The character 检 used here is the simplified form; the old traditional form is 檢.',
    ],
    [
      '方向 — you see this on a sign. What does it mean?',
      ['direction', 'centre', 'transfer, change lines', 'bound for'],
      0,
      'fāngxiàng · richting (direction). 方 (fāng) can be read differently in other words, but on platform signs it is always fāng.',
    ],
    [
      '票 — you see this on a sign. What does it mean?',
      ['ticket', 'centre', 'bound for', 'carriage, coach'],
      0,
      'piào · kaartje (ticket). Shows up in many related terms: 单程票 (single ticket), 检票 (ticket check), 取票 (collect ticket), 售票 (sell tickets), 补票 (top up fare), 退票 (refund ticket).',
    ],
  ],
  high: [
    [
      '开往 — you see this on a sign. What does it mean?',
      ['bound for', 'establishment, house of', 'direction', 'collect a printed ticket'],
      0,
      'kāi wǎng · richting, naar (bound for). This phrase is followed by the destination city or station name, which is the part you actually need to read.',
    ],
    [
      '单程票 — you see this on a sign. What does it mean?',
      ['single-journey ticket', 'venue, ground', 'centre', 'high-speed rail (G)'],
      0,
      'dānchéngpiào · enkeltje (single-journey ticket). 单 (dān) can be read differently elsewhere, but here it is dān; note 程 in this word sounds the same as the chéng in 换乘 (transfer), even though they are different characters.',
    ],
    [
      '站台 — you see this on a sign. What does it mean?',
      ['platform', 'ticket', 'carriage, coach', 'centre'],
      0,
      'zhàntái · perron (platform). 台 (tái) can be read differently in other words, but on platform signs it is always tái.',
    ],
  ],
};
