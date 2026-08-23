import { METAL_RADICAL, SHELL_RADICAL, SILK_RADICAL, TAP_RADICAL } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * market-checkout — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` (single characters only) is Jun Da's
 * Modern Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so numbers
 * here do not match DESIGN.md's inline ranks character-for-character.
 */
// 储值卡/发票 (context-authoring phase, Aug 2026) are real checkout-counter
// vocabulary, not curriculum-table entries, so `tier`/`freqRank` are left
// unset rather than guessed.
//
// 收银台/结账 (word-decomposition backfill, Aug 2026) are genuinely
// transparent compounds: 收银台 "collect" + "silver, money" + "counter" (the
// explanation already notes the shortened 收银 form); 结账 "settle" +
// "account".
//
// 收/银/台/结/账 (eligibility-gap backfill, Aug 2026): standalone items for
// every morpheme 收银台/结账 name, so `deriveComponentCharIds` has a
// single-character question to resolve each morpheme against - without
// these, both words' WordDecomposition was structurally inert (see
// content/index.ts). 收/银/结/账 carry a verified CharacterDecomposition
// against the gitignored Make Me a Hanzi scratch copy; 银 reuses
// `METAL_RADICAL` from menu-animal.ts's 锅/transit-ticket.ts's 铺. 台 has no
// MMH etymology entry at all, so it ships `glossProvenance: 'mnemonic-only'`
// instead of a fabricated decomposition claim.
export const MARKET_CHECKOUT: CategoryContent = {
  low: [
    [
      'On the checkout screen. What does it mean?',
      ['supermarket', 'net content', '0.1 yuan (spoken)'],
      0,
      'chāoshì · supermarkt (supermarket).',
      { hanzi: '超市', pinyin: 'chāoshì', nl: 'supermarkt', en: 'supermarket' },
      undefined,
      { tier: 1 },
    ],
  ],
  mid: [
    [
      'On the checkout screen. What does it mean?',
      ['supermarket', 'shelf life, as a duration', 'kilogram = 2 斤'],
      0,
      'chāoshì · supermarkt (supermarket).',
      { hanzi: '超市', pinyin: 'chāoshì', nl: 'supermarkt', en: 'supermarket' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['convenience store', 'long thin things — fish, streets, trousers', 'garments, items, matters'],
      0,
      'biànlìdiàn · buurtwinkel (convenience store). 便 is pronounced biàn here, but pián in 便宜 (cheap) — same character, different reading.',
      { hanzi: '便利店', pinyin: 'biànlìdiàn', nl: 'buurtwinkel', en: 'convenience store' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['checkout', 'shelf life, as a duration', 'settle up, pay'],
      0,
      'shōuyíntái · kassa (checkout). Often shortened to just 收银 on overhead lane signs.',
      { hanzi: '收银台', pinyin: 'shōuyíntái', nl: 'kassa', en: 'checkout' },
      { kind: 'word', hanzi: '收银台', morphemes: [
        { span: '收', gloss: 'to collect' },
        { span: '银', gloss: 'silver, money' },
        { span: '台', gloss: 'counter' },
      ] },
      { tier: 1 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['settle up, pay', 'weigh here', 'special price'],
      0,
      'jiézhàng · afrekenen (settle up, pay).',
      { hanzi: '结账', pinyin: 'jiézhàng', nl: 'afrekenen', en: 'settle up, pay' },
      { kind: 'word', hanzi: '结账', morphemes: [
        { span: '结', gloss: 'to settle, tie off' },
        { span: '账', gloss: 'account' },
      ] },
      { tier: 1 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['scan the QR code', 'flat things — tickets, cards, tables', '0.1 yuan (spoken)'],
      0,
      'sǎomǎ · scannen, QR-code scannen (scan the QR code). The standard way to say "scan to pay" in China.',
      { hanzi: '扫码', pinyin: 'sǎomǎ', nl: 'scannen, QR-code scannen', en: 'scan the QR code' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['hundred', 'hundred million', 'bottle'],
      0,
      'bǎi · honderd (hundred). Below 10,000, Chinese numbers work just like European ones. Picture 百 as the number 一 (one) capping a wide, wide mouth (白 shape) stretched open to shout out a big round number: bǎi.',
      { hanzi: '百', pinyin: 'bǎi', nl: 'honderd', en: 'hundred' },
      undefined,
      { tier: 1, freqRank: 407, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['thousand', 'settle up, pay', '2, capital form'],
      0,
      'qiān · duizend (thousand). The last unit before Chinese numbers start grouping by 10,000 instead of 1,000. Picture 千 as a single stroke driven straight down through 十 (ten) — pushing "ten" up a whole order of magnitude: qiān.',
      { hanzi: '千', pinyin: 'qiān', nl: 'duizend', en: 'thousand' },
      undefined,
      { tier: 1, freqRank: 599, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['ten thousand', 'freeze, −18 °C', 'refrigerate, 0–4 °C'],
      0,
      'wàn · tienduizend (ten thousand). Chinese groups numbers by 10,000, not 1,000, so 十万 = 100,000 and 一百万 = 1,000,000 — misreading this is an easy way to be off by a factor of ten. Picture 万 as a single stroke (一) capping a bent hook hauling in an enormous net — hauling in ten thousand at once: wàn.',
      { hanzi: '万', pinyin: 'wàn', nl: 'tienduizend', en: 'ten thousand' },
      undefined,
      { tier: 1, freqRank: 322, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['stored-value card', "members' price", 'settle up, pay'],
      0,
      'chǔzhíkǎ · tegoedkaart (stored-value card) — a prepaid card topped up in advance, distinct from a 会员卡 (membership card), which tracks discounts rather than a balance.',
      {
        hanzi: '储值卡',
        pinyin: 'chǔzhíkǎ',
        nl: 'oplaadkaart, tegoedkaart',
        en: 'stored-value card',
        context: { after: '余额查询' },
      },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['official receipt, fapiao', 'settle up, pay', 'checkout'],
      0,
      'fāpiào · officiële kwitantie (fapiao) — the official tax receipt needed for expense claims; ask for it before paying, since most shops won\'t print one afterwards.',
      {
        hanzi: '发票',
        pinyin: 'fāpiào',
        nl: 'officiële kwitantie (fapiao)',
        en: 'official receipt, fapiao',
        context: { after: '请在结账前告知收银员' },
      },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['to collect, receive', 'settle up, pay', 'stored-value card'],
      0,
      'shōu · innen, ontvangen (to collect, receive). Seen in 收银台 (checkout counter, literally "collect money counter") and 收据 (receipt).',
      { hanzi: '收', pinyin: 'shōu', nl: 'innen, ontvangen', en: 'to collect, receive', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '收',
        components: [{ componentId: TAP_RADICAL.id, role: 'semantic' }],
        semantic_radical: TAP_RADICAL.id,
      },
      { freqRank: 351 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['silver, money', 'to collect, receive', 'settle up, pay'],
      0,
      'yín · zilver, geld (silver, money). The character behind 银行 (bank) and 收银台 (checkout counter). Carries the 钅 (metal) radical, the same one in 锅 (pot) and 铺 (shop).',
      { hanzi: '银', pinyin: 'yín', nl: 'zilver, geld', en: 'silver, money', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '银',
        components: [{ componentId: METAL_RADICAL.id, role: 'semantic' }],
        semantic_radical: METAL_RADICAL.id,
      },
      { freqRank: 757 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['counter, platform, stand', 'silver, money', 'account, bill'],
      0,
      'tái · toonbank, platform (counter, platform, stand). Seen in 收银台 (checkout counter) and 站台 (train platform). Picture 台 as a little stool set above an open, mouth-shaped stage - a small platform to stand and speak from: tái.',
      { hanzi: '台', pinyin: 'tái', nl: 'toonbank, platform', en: 'counter, platform, stand' },
      undefined,
      { freqRank: 388, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['to tie, settle', 'to collect, receive', 'account, bill'],
      0,
      'jié · afronden, knopen (to tie off, settle). Seen in 结账 (settle the bill) and 结婚 (get married, literally "tie the knot"). Carries the 纟 (silk/thread) radical, common in words about binding things together.',
      { hanzi: '结', pinyin: 'jié', nl: 'afronden, knopen', en: 'to tie, settle', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '结',
        components: [{ componentId: SILK_RADICAL.id, role: 'semantic' }],
        semantic_radical: SILK_RADICAL.id,
      },
      { freqRank: 236 },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['account, bill', 'to tie, settle', 'counter, platform, stand'],
      0,
      'zhàng · rekening (account, bill). Seen in 结账 (settle the bill). Carries the 贝 (shell) radical - cowrie shells were ancient currency, so it marks money-related characters.',
      { hanzi: '账', pinyin: 'zhàng', nl: 'rekening', en: 'account, bill', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '账',
        components: [{ componentId: SHELL_RADICAL.id, role: 'semantic' }],
        semantic_radical: SHELL_RADICAL.id,
      },
      { freqRank: 2179 },
    ],
  ],
  high: [
    [
      'On the checkout screen. What does it mean?',
      ['hundred million', 'animals, one of a pair, some containers', '2, capital form'],
      0,
      'yì · honderd miljoen (hundred million, 10⁸). Seen on property prices, news tickers, and lottery boards — it\'s the next step up from 万 in China\'s 10,000-based number grouping. Picture 亿 as a person (亻) standing beside a tiny swallow-shaped squiggle (乙) that has multiplied into an enormous flock — one person surrounded by a hundred million birds: yì.',
      { hanzi: '亿', pinyin: 'yì', nl: 'honderd miljoen', en: 'hundred million' },
      undefined,
      { tier: 2, freqRank: 1057, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['1, capital form', 'production date', 'animals, one of a pair, some containers'],
      0,
      'yī · 1, de formele schrijfwijze voor documenten (the "capital form" used on official documents, to prevent fraud). A 100-yuan note reads 壹佰圆 — recognizing this character is the difference between reading a banknote and just looking at one. Picture 壹 as a whole treasury (士 + 冖 + 豆) locked away just to protect a single "1" from being forged: yī.',
      { hanzi: '壹', pinyin: 'yī', nl: '1, schrijfwijze op documenten', en: '1, capital form' },
      undefined,
      { tier: 2, freqRank: 4652, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['2, capital form', 'kilogram = 2 斤', 'garments, items, matters'],
      0,
      'èr · 2, de formele schrijfwijze voor documenten (capital form). It contains both the ordinary 二 it stands in for and the money radical 贝 — the one capital-form numeral you can partly guess at. Picture 贰 as a money pouch (贝) stitched shut around a plain "2" (二), locked up with extra stitching so nobody can quietly turn it into another number: èr.',
      { hanzi: '贰', pinyin: 'èr', nl: '2, schrijfwijze op documenten', en: '2, capital form' },
      undefined,
      { tier: 2, freqRank: 3894, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the checkout screen. What does it mean?',
      ['3, capital form', '50 g, one tenth of a 斤', 'hundred'],
      0,
      'sān · 3, de formele schrijfwijze voor documenten (capital form). It contains its own 三, the same way 贰 contains 二. Picture 叁 as a plain "3" (三) stacked up under two extra strokes on top, like a wax seal pressed down to stop anyone adding another line and turning it into a bigger number: sān.',
      { hanzi: '叁', pinyin: 'sān', nl: '3, schrijfwijze op documenten', en: '3, capital form' },
      undefined,
      { tier: 2, freqRank: 4396, glossProvenance: 'mnemonic-only' },
    ],
  ],
};
