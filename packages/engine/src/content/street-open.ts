import { FIRE_DOTS_RADICAL, PERSON_RADICAL, SUN_RADICAL, TING_PHONETIC } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * street-open — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset: 停业 is a two-character word and DESIGN.md §7.5.3 gives
 * no corpus rank for it at all.
 *
 * 时/点 moved here from market-panel: both were authored with the packet-label
 * prompt and rendered inside PackageLabel's fixed shelf-life chrome even
 * though neither is a package field - a confirmed content bug. Reading a
 * clock/business-hours character genuinely happens on a shop door's opening-
 * hours plaque, which is what this category already models, so they are
 * relocated rather than forced back into a mismatched template.
 *
 * 全年无休/暂停营业 (context-authoring phase, Aug 2026) are real shop-door
 * notice phrases, not curriculum-table entries, so `tier`/`freqRank` are left
 * unset rather than guessed.
 *
 * 停业/暂停营业 are tagged `confusion_type: 'shared-morpheme'` against each
 * other (confusable-pair backfill, Aug 2026): both share 停, and 暂停营业's own
 * explanation already named 停业 as the thing it is distinguished from before
 * this field existed. 停业 appears three times in this file (low/mid/high);
 * all three carry the tag.
 *
 * 停 (eligibility-gap backfill, Aug 2026): a standalone item for 停业's/
 * street-trade.ts's 停车场's first morpheme, so `deriveComponentCharIds` can
 * resolve both words - see the audit note in content/index.ts. Verified
 * against the gitignored Make Me a Hanzi scratch copy: semantic 亻 (person)
 * plus an exact-tone phonetic match on 亭 (tíng = tíng).
 *
 * Rest-of-bank coverage pass (Aug 2026): 时 gets a verified
 * CharacterDecomposition (semantic 日, `SUN_RADICAL`; MMH's own entry records
 * no phonetic component for this character at all). 点 reuses
 * `FIRE_DOTS_RADICAL` (灬, from menu-cooking.ts's 煮/煎); its phonetic half 占
 * (zhàn) is not a tone-or-syllable match for diǎn, so semantic-only.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 停业/暂停营业 get `WordDecomposition`s
 * resolving fully via the existing 停 standalone (this same file's high tier).
 * 全年无休 gets one resolving via the existing 无 (street-way.ts). No new
 * standalones were needed for any of the three.
 */
export const STREET_OPEN: CategoryContent = {
  low: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      { kind: 'word', hanzi: '停业', morphemes: [
        { span: '停', gloss: 'to stop' },
        { span: '业', gloss: 'business' },
      ] },
      {
        tier: 2,
        confusion_type: 'shared-morpheme',
        confusable_with: ['street-open-mid-4'],
      },
    ],
    [
      'On a shop door. What does it mean?',
      ['o\'clock; time', 'members\' price', 'scan the QR code'],
      0,
      'shí · uur; tijd (o\'clock; time). Opening-hours plaques show 营业时间 09:00–22:00 in 24-hour numbers, so mostly you just need to read the digits. Carries the 日 (sun/day) radical.',
      {
        hanzi: '时',
        pinyin: 'shí',
        nl: 'uur; tijd',
        en: 'o\'clock; time',
        context: { before: '营业', after: '间 09:00–22:00' },
        structure: 'left-right',
      },
      {
        kind: 'character',
        hanzi: '时',
        components: [{ componentId: SUN_RADICAL.id, role: 'semantic' }],
        semantic_radical: SUN_RADICAL.id,
      },
      { tier: 1, freqRank: 25 },
    ],
  ],
  mid: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      { kind: 'word', hanzi: '停业', morphemes: [
        { span: '停', gloss: 'to stop' },
        { span: '业', gloss: 'business' },
      ] },
      {
        tier: 2,
        confusion_type: 'shared-morpheme',
        confusable_with: ['street-open-mid-4'],
      },
    ],
    [
      'On a shop door. What does it mean?',
      ['o\'clock (spoken)', 'day of month (spoken); number', 'yuan (spoken)'],
      0,
      'diǎn · uur (spreektaal, o\'clock). E.g. 晚上十点打烊 = closes at 10pm — the characters don\'t say morning or afternoon on their own, so you get that from context. Often paired with 半. Carries the 灬 (fire) radical, the same one under 煮/煎 (boil/pan-fry) on a menu.',
      {
        hanzi: '点',
        pinyin: 'diǎn',
        nl: 'uur (spreektaal)',
        en: 'o\'clock (spoken)',
        context: { before: '晚上十', after: '打烊' },
        structure: 'top-bottom',
      },
      {
        kind: 'character',
        hanzi: '点',
        components: [{ componentId: FIRE_DOTS_RADICAL.id, role: 'semantic' }],
        semantic_radical: FIRE_DOTS_RADICAL.id,
      },
      { tier: 1, freqRank: 128 },
    ],
    [
      'On a shop door. What does it mean?',
      ['open year-round, no rest days', 'closed down, ceased trading', "o'clock; time"],
      0,
      'quánnián wúxiū · het hele jaar geen rustdag (open year-round, no rest days). The opposite of 节假日休息 (closed on public holidays).',
      {
        hanzi: '全年无休',
        pinyin: 'quánnián wúxiū',
        nl: 'het hele jaar geen rustdag',
        en: 'open year-round, no rest days',
        context: { after: '，节假日照常营业' },
      },
      { kind: 'word', hanzi: '全年无休', morphemes: [
        { span: '全', gloss: 'entire' },
        { span: '年', gloss: 'year' },
        { span: '无', gloss: 'without' },
        { span: '休', gloss: 'to rest' },
      ] },
    ],
    [
      'On a shop door. What does it mean?',
      ['temporarily closed', 'closed down, ceased trading', 'open year-round, no rest days'],
      0,
      'zàntíng yíngyè · tijdelijk gesloten (temporarily closed). Distinguished from 停业 (permanently closed) by 暂 "temporarily" — worth checking back.',
      {
        hanzi: '暂停营业',
        pinyin: 'zàntíng yíngyè',
        nl: 'tijdelijk gesloten',
        en: 'temporarily closed',
        context: { after: '，装修中，敬请谅解' },
      },
      { kind: 'word', hanzi: '暂停营业', morphemes: [
        { span: '暂', gloss: 'temporarily' },
        { span: '停', gloss: 'to stop' },
        { span: '营', gloss: 'to operate' },
        { span: '业', gloss: 'business' },
      ] },
      {
        confusion_type: 'shared-morpheme',
        confusable_with: ['street-open-low-1', 'street-open-mid-1', 'street-open-high-1'],
      },
    ],
  ],
  high: [
    [
      'On a shop door. What does it mean?',
      ['closed down, ceased trading', 'prohibition — red circle, diagonal bar', 'mandatory — solid blue circle'],
      0,
      'tíngyè · gesloten (permanent). The third state, distinguished from 休息 because the consequence differs — one is worth waiting for.',
      { hanzi: '停业', pinyin: 'tíngyè', nl: 'gesloten (permanent)', en: 'closed down, ceased trading' },
      { kind: 'word', hanzi: '停业', morphemes: [
        { span: '停', gloss: 'to stop' },
        { span: '业', gloss: 'business' },
      ] },
      {
        tier: 2,
        confusion_type: 'shared-morpheme',
        confusable_with: ['street-open-mid-4'],
      },
    ],
    [
      'On a shop door. What does it mean?',
      ['to stop', 'fast, quick', 'account, bill'],
      0,
      'tíng · stoppen (to stop). Seen in 停业 (closed down) and 停车场 (car park). 亭 (tíng), the shape on the right, gives the exact sound - a rare case where the phonetic half is a perfect match.',
      { hanzi: '停', pinyin: 'tíng', nl: 'stoppen', en: 'to stop', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '停',
        components: [
          { componentId: PERSON_RADICAL.id, role: 'semantic' },
          { componentId: TING_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: PERSON_RADICAL.id,
      },
      { freqRank: 693 },
    ],
  ],
};
