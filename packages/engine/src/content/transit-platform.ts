import { EARTH_SEMANTIC, STAND_SEMANTIC, ZHAN_PHONETIC } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * transit-platform — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` (single characters only) is Jun Da's
 * Modern Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so numbers
 * here do not match DESIGN.md's inline ranks character-for-character. 站's
 * decomposition is verified against the gitignored Make Me a Hanzi scratch
 * copy (see `STAND_SEMANTIC`/`ZHAN_PHONETIC` in components.ts). 票 is
 * structurally an ideographic compound ("flames over an altar") rather than
 * a clean semantic/phonetic split, so it ships `structure: 'atomic'` with no
 * decomposition claim, same treatment as 皮 in the organ set.
 *
 * 首末车/末班车 (context-authoring phase, Aug 2026) are the real posted
 * operating-hours vocabulary at every metro platform. Neither has a verified
 * `tier` or Jun Da rank, so both are left unset.
 *
 * 地铁 (word-decomposition backfill, Aug 2026) is a genuinely transparent
 * compound - 地 "ground" + 铁 "rail/iron" - and this file's own explanation
 * already calls out 铁's metal radical before this field existed.
 *
 * 地 (eligibility-gap backfill, Aug 2026): a standalone item for 地铁's first
 * morpheme, so `deriveComponentCharIds` can resolve it - see the audit note
 * in content/index.ts. Reuses `EARTH_SEMANTIC` from transit-ticket.ts's 城,
 * verified against the same gitignored Make Me a Hanzi scratch copy; its
 * phonetic half 也 (yě/yí) is not a tone-or-syllable match for dì, so
 * semantic-only.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 出口/入口 get `WordDecomposition`s
 * resolving via a new standalone, 口, authored here (also unlocks market-
 * panel.ts's 进口). 号线 resolves via the existing 号 (market-panel.ts).
 * 换乘/方向/开往 each get one backed by a new standalone (乘, 向, 开). 安检
 * resolves via a new standalone, 检, also reused by transit-ticket.ts's
 * 检票/检票口. 首末车/末班车/单程票/站台 all resolve fully via existing
 * standalones (车, 票, 台) with no new authoring needed.
 */
export const TRANSIT_PLATFORM: CategoryContent = {
  low: [
    [
      'In the metro. What does it mean?',
      ['station, stop', 'exit', 'platform'],
      0,
      'zhàn · station, stop. Appears in compounds like 加油站 (gas station) and 火车站 (train station).',
      { hanzi: '站', pinyin: 'zhàn', nl: 'station, halte', en: 'station, stop', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '站',
        components: [
          { componentId: STAND_SEMANTIC.id, role: 'semantic' },
          { componentId: ZHAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: STAND_SEMANTIC.id,
      },
      { tier: 0, freqRank: 544 },
    ],
    [
      'In the metro. What does it mean?',
      ['exit', 'station, stop', 'metro'],
      0,
      'chūkǒu · uitgang (exit). Blue or black signage marks a regular exit; a green 安全出口 sign marks an emergency exit.',
      { hanzi: '出口', pinyin: 'chūkǒu', nl: 'uitgang', en: 'exit' },
      { kind: 'word', hanzi: '出口', morphemes: [
        { span: '出', gloss: 'to exit' },
        { span: '口', gloss: 'mouth, opening' },
      ] },
      {
        tier: 0,
        // DESIGN.md §2.3/§3.4's own named shared-morpheme example: 出口/入口
        // share 口 and the opposite heads 出/入, real siblings rather than an
        // invented pair.
        confusion_type: 'shared-morpheme',
        confusable_with: ['transit-platform-low-3'],
      },
    ],
    [
      'In the metro. What does it mean?',
      ['entrance', 'line number', 'metro'],
      0,
      'rùkǒu · ingang (entrance). 入 (rù) looks almost identical to 人 (rén, "person") — just one stroke apart, so watch out for mixing them up.',
      { hanzi: '入口', pinyin: 'rùkǒu', nl: 'ingang', en: 'entrance' },
      { kind: 'word', hanzi: '入口', morphemes: [
        { span: '入', gloss: 'to enter' },
        { span: '口', gloss: 'mouth, opening' },
      ] },
      { tier: 0, confusion_type: 'shared-morpheme', confusable_with: ['transit-platform-low-2'] },
    ],
    [
      'In the metro. What does it mean?',
      ['line number', 'high-speed rail (G)', 'metro'],
      0,
      'hào xiàn · lijnnummer (line number), as in 4号线 = "Line 4". The colored roundel on the sign usually matches the line\'s official color, so you can double-check yourself.',
      { hanzi: '号线', pinyin: 'hào xiàn', nl: 'lijnnummer', en: 'line number' },
      { kind: 'word', hanzi: '号线', morphemes: [
        { span: '号', gloss: 'number' },
        { span: '线', gloss: 'line, thread' },
      ] },
      { tier: 0 },
    ],
    [
      'In the metro. What does it mean?',
      ['transfer, change lines', 'train', 'ticket check'],
      0,
      'huànchéng · overstappen (transfer, change lines). 换 (huàn) sounds the same as 唤 and 焕, all read huàn; 乘 (chéng) is the harder character to remember here.',
      { hanzi: '换乘', pinyin: 'huànchéng', nl: 'overstappen', en: 'transfer, change lines' },
      { kind: 'word', hanzi: '换乘', morphemes: [
        { span: '换', gloss: 'to exchange' },
        { span: '乘', gloss: 'to ride' },
      ] },
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'In the metro. What does it mean?',
      ['metro', 'ticket check', 'train'],
      0,
      'dìtiě · metro. 铁 (tiě, "metal/iron") carries the metal radical 钅, also seen in 银 (silver), 铺 (shop) and 锅 (pot).',
      { hanzi: '地铁', pinyin: 'dìtiě', nl: 'metro', en: 'metro' },
      { kind: 'word', hanzi: '地铁', morphemes: [
        { span: '地', gloss: 'ground' },
        { span: '铁', gloss: 'rail, iron' },
      ] },
      { tier: 1 },
    ],
    [
      'In the metro. What does it mean?',
      ['security check', 'line number', 'train'],
      0,
      'ānjiǎn · veiligheidscontrole (security check). Expect a screening line before boarding.',
      { hanzi: '安检', pinyin: 'ānjiǎn', nl: 'veiligheidscontrole', en: 'security check' },
      { kind: 'word', hanzi: '安检', morphemes: [
        { span: '安', gloss: 'safe' },
        { span: '检', gloss: 'to inspect' },
      ] },
      { tier: 1 },
    ],
    [
      'In the metro. What does it mean?',
      ['direction', 'transfer, change lines', 'bound for'],
      0,
      'fāngxiàng · richting (direction). 方 (fāng) can be read differently in other words, but on platform signs it is always fāng.',
      { hanzi: '方向', pinyin: 'fāngxiàng', nl: 'richting', en: 'direction' },
      { kind: 'word', hanzi: '方向', morphemes: [
        { span: '方', gloss: 'direction, square' },
        { span: '向', gloss: 'toward' },
      ] },
      { tier: 1 },
    ],
    [
      'In the metro. What does it mean?',
      ['ticket', 'bound for', 'carriage, coach'],
      0,
      'piào · kaartje (ticket). Shows up in many related terms: 单程票 (single ticket), 检票 (ticket check), 取票 (collect ticket), 售票 (sell tickets), 补票 (top up fare), 退票 (refund ticket).',
      { hanzi: '票', pinyin: 'piào', nl: 'kaartje', en: 'ticket', structure: 'atomic' },
      undefined,
      { tier: 1, freqRank: 910 },
    ],
    [
      'In the metro. What does it mean?',
      ['first/last train', 'wait for the train', 'bound for'],
      0,
      'shǒumòchē · eerste/laatste trein (first/last train). 首末车时间 posted at every platform gives the day\'s operating hours.',
      {
        hanzi: '首末车',
        pinyin: 'shǒumòchē',
        nl: 'eerste/laatste trein',
        en: 'first/last train',
        context: { after: '时间：06:00–23:00' },
      },
      { kind: 'word', hanzi: '首末车', morphemes: [
        { span: '首', gloss: 'first, head' },
        { span: '末', gloss: 'last, end' },
        { span: '车', gloss: 'vehicle' },
      ] },
    ],
    [
      'In the metro. What does it mean?',
      ['last train', 'first/last train', 'transfer, change lines'],
      0,
      'mòbānchē · laatste trein (last train) — the specific departure you don\'t want to miss; 首班车 is its opposite, the first train of the day.',
      {
        hanzi: '末班车',
        pinyin: 'mòbānchē',
        nl: 'laatste trein',
        en: 'last train',
        context: { before: '本站', after: '22:30发车' },
      },
      { kind: 'word', hanzi: '末班车', morphemes: [
        { span: '末', gloss: 'last, end' },
        { span: '车', gloss: 'vehicle' },
      ] },
    ],
    [
      'In the metro. What does it mean?',
      ['ground, land', 'metro', 'transfer, change lines'],
      0,
      'dì · grond, land (ground, land). Seen in 地铁 (metro, literally "ground/underground railway") and 地图 (map). Carries the 土 (earth) radical, the same one in 场 (venue, ground) and 城 (large retail complex).',
      { hanzi: '地', pinyin: 'dì', nl: 'grond, land', en: 'ground, land', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '地',
        components: [{ componentId: EARTH_SEMANTIC.id, role: 'semantic' }],
        semantic_radical: EARTH_SEMANTIC.id,
      },
      { freqRank: 21 },
    ],
  ],
  high: [
    [
      'In the metro. What does it mean?',
      ['bound for', 'direction', 'collect a printed ticket'],
      0,
      'kāi wǎng · richting, naar (bound for). This phrase is followed by the destination city or station name, which is the part you actually need to read.',
      { hanzi: '开往', pinyin: 'kāi wǎng', nl: 'richting, naar', en: 'bound for' },
      { kind: 'word', hanzi: '开往', morphemes: [
        { span: '开', gloss: 'to open, start' },
        { span: '往', gloss: 'toward, past' },
      ] },
      { tier: 2 },
    ],
    [
      'In the metro. What does it mean?',
      ['single-journey ticket', 'centre', 'high-speed rail (G)'],
      0,
      'dānchéngpiào · enkeltje (single-journey ticket). 单 (dān) can be read differently elsewhere, but here it is dān; note 程 in this word sounds the same as the chéng in 换乘 (transfer), even though they are different characters.',
      { hanzi: '单程票', pinyin: 'dānchéngpiào', nl: 'enkeltje', en: 'single-journey ticket' },
      { kind: 'word', hanzi: '单程票', morphemes: [
        { span: '单', gloss: 'single' },
        { span: '票', gloss: 'ticket, note' },
      ] },
      { tier: 2 },
    ],
    [
      'In the metro. What does it mean?',
      ['platform', 'ticket', 'carriage, coach'],
      0,
      'zhàntái · perron (platform). 台 (tái) can be read differently in other words, but on platform signs it is always tái.',
      { hanzi: '站台', pinyin: 'zhàntái', nl: 'perron', en: 'platform' },
      { kind: 'word', hanzi: '站台', morphemes: [
        { span: '站', gloss: 'station' },
        { span: '台', gloss: 'counter, platform' },
      ] },
      { tier: 2 },
    ],
    [
      'In the metro. What does it mean?',
      ['mouth, opening', 'entrance', 'exit'],
      0,
      'kǒu · mond, opening (mouth, opening). Seen in 出口/入口 (exit/entrance) - on a food packet the same character instead marks 进口 (imported). Picture 口 as a simple open mouth, drawn as a small square: kǒu.',
      { hanzi: '口', pinyin: 'kǒu', nl: 'mond, opening', en: 'mouth, opening' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'In the metro. What does it mean?',
      ['to ride', 'to exchange', 'mouth, opening'],
      0,
      'chéng · rijden, nemen (to ride). Seen in 换乘 (transfer, change lines). Picture 乘 as a person climbing right up into the branches of a tree, getting up and riding along: chéng.',
      { hanzi: '乘', pinyin: 'chéng', nl: 'rijden, nemen', en: 'to ride' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'In the metro. What does it mean?',
      ['to inspect', 'to ride', 'safe'],
      0,
      'jiǎn · controleren (to inspect). Seen in 安检 (security check); the same character also appears in 检票/检票口 (ticket check/ticket gate) at the ticket hall. Picture 检 as a wooden gauge (木) checking that everyone (佥) matches the standard: jiǎn.',
      { hanzi: '检', pinyin: 'jiǎn', nl: 'controleren', en: 'to inspect' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'In the metro. What does it mean?',
      ['toward', 'direction, square', 'to inspect'],
      0,
      'xiàng · naar toe (toward). Seen in 方向 (direction). Picture 向 as a little window cut into the side of a house, facing outward in one direction: xiàng.',
      { hanzi: '向', pinyin: 'xiàng', nl: 'naar toe', en: 'toward' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'In the metro. What does it mean?',
      ['to open, start', 'toward', 'to ride'],
      0,
      'kāi · openen, starten (to open, start). Seen in 开往 (bound for, literally "starts toward"). Picture 开 as a gate\'s crossbar (一) lifted straight up and off by two hands (廾), swinging it open: kāi.',
      { hanzi: '开', pinyin: 'kāi', nl: 'openen, starten', en: 'to open, start' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
