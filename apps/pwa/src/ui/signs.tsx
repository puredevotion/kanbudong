import type { CategoryId } from '@kanbudong/engine';
import type { ReactNode } from 'react';

/**
 * The five sign templates.
 *
 * Each domain renders as the kind of physical object you actually meet the
 * characters on, not as one card recoloured by topic. Recognising the object is
 * half of reading the sign: you know a price label is a price label before you
 * can read a character of it, and that knowledge is what makes the characters
 * guessable (DESIGN.md §3.2).
 *
 * Two of them are hard to read on purpose — the fascia is loud and tightly
 * tracked, the price label buries the target under a large number. That is
 * FIDELITY to the real object, never a difficulty device: perceptual disfluency
 * does not aid learning (§1, "what we will not build on"), and the target glyph
 * clears WCAG AA contrast in every template regardless.
 *
 * The invariant: characters are set the way the real object sets them. Never
 * restyled into app chrome, never white-on-violet, never glowing. A learner who
 * can only recognise 出口 in the app's house style has learned the app.
 */

export type SignDomain = 'menu' | 'market' | 'street' | 'safety' | 'transit';

/**
 * GB 2894's four categories. The colour and the shape carry the illocutionary
 * force before a single character is decoded — red forbids, yellow warns, blue
 * instructs, green tells you where to go — so getting them right is content, not
 * styling. Drawing 禁止 on a yellow warning board teaches the convention
 * backwards.
 */
export type SafetyKind = 'prohibition' | 'warning' | 'instruction' | 'notice';

const SAFETY_KIND: Record<string, SafetyKind> = {
  'safety-prohibition': 'prohibition',
  'safety-warning': 'warning',
  'safety-instruction': 'instruction',
  'safety-exit': 'notice',
};

export function domainOf(category: CategoryId): SignDomain {
  const head = category.split('-')[0];
  return (['menu', 'market', 'street', 'safety', 'transit'] as const).find((d) => d === head) ?? 'transit';
}

interface SignProps {
  readonly domain: SignDomain;
  /** Full scene id — the safety templates need it to pick their GB 2894 category. */
  readonly category: CategoryId;
  readonly hanzi: string;
  /** Shown only at the lowest stake, where the bet buys scaffolding. */
  readonly pinyin?: string | undefined;
}

/** Scale the characters down as the span gets longer, so a 4-char sign still fits a phone. */
function sizeFor(hanzi: string): string {
  const n = [...hanzi].length;
  if (n <= 1) return '5.5rem';
  if (n === 2) return '4.5rem';
  if (n === 3) return '3.4rem';
  return '2.7rem';
}

export function Sign({ domain, category, hanzi, pinyin }: SignProps): ReactNode {
  const size = sizeFor(hanzi);
  const body = {
    transit: <TransitPlate hanzi={hanzi} size={size} />,
    menu: <MenuSection hanzi={hanzi} size={size} />,
    street: <ShopFascia hanzi={hanzi} size={size} />,
    market: <PriceLabel hanzi={hanzi} size={size} />,
    safety: <SafetyBoard hanzi={hanzi} size={size} kind={SAFETY_KIND[category] ?? 'warning'} />,
  }[domain];

  return (
    <div>
      <div className="overflow-hidden rounded-[3px] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]">
        {body}
      </div>
      {pinyin !== undefined && (
        <p className="mt-3 text-center text-lg font-medium text-muted">{pinyin}</p>
      )}
    </div>
  );
}

interface Face {
  readonly hanzi: string;
  readonly size: string;
}

/** Station wayfinding: enamel plate, blue band, exit letter, arrow. */
function TransitPlate({ hanzi, size }: Face): ReactNode {
  return (
    <>
      <div className="flex items-center justify-between gap-3 bg-[oklch(0.42_0.13_250)] px-3.5 py-2">
        <span className="font-han text-[0.94rem] font-medium tracking-[0.08em] text-white">地铁</span>
        <span className="text-[0.69rem] font-semibold tracking-[0.14em] text-white/80">METRO</span>
      </div>
      <div className="flex items-center justify-center gap-4 bg-[#f4f4f2] px-4 py-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#14140f] text-[1.4rem] font-bold text-[#f4f4f2]">
          B
        </span>
        <span className="font-han font-medium leading-none tracking-[0.04em] text-[#14140f]" style={{ fontSize: size }}>
          {hanzi}
        </span>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#14140f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
          <path d="M4 12h15" /><path d="M13 6l6 6-6 6" />
        </svg>
      </div>
    </>
  );
}

/**
 * A printed menu section. The only template with siblings, because reading a menu
 * is reading a layout before it is reading a character — the section header and
 * the neighbouring rows are what tell you the price column is a price column.
 */
function MenuSection({ hanzi, size }: Face): ReactNode {
  return (
    <div className="bg-[#f6f1e7]">
      <div className="flex items-center justify-between gap-3 bg-[oklch(0.42_0.16_28)] px-4 py-2">
        <span className="font-han-serif text-[1.05rem] font-bold tracking-[0.1em] text-white">热菜</span>
        <span className="text-[0.63rem] font-semibold tracking-[0.16em] text-white/80">HOT DISHES</span>
      </div>
      <div className="py-1.5">
        <MenuRow name="宫保鸡丁" price="42" dim />
        <div className="flex items-baseline gap-2.5 border-l-[3px] border-[oklch(0.52_0.19_28)] bg-[rgba(180,40,30,0.09)] px-4 py-3">
          <span className="font-han-serif font-bold leading-tight text-[#1a1410]" style={{ fontSize: size }}>{hanzi}</span>
          <span className="-translate-y-1 grow border-b border-dotted border-black/30" />
          <span className="font-mono text-[1.05rem] font-semibold text-[#1a1410]">68</span>
        </div>
        <MenuRow name="清蒸鱼" price="88" dim />
      </div>
    </div>
  );
}

function MenuRow({ name, price, dim }: { name: string; price: string; dim?: boolean }): ReactNode {
  return (
    <div className={`flex items-baseline gap-2.5 px-4 py-2.5 ${dim === true ? 'opacity-45' : ''}`}>
      <span className="font-han-serif text-[1.25rem] text-[#1a1410]">{name}</span>
      <span className="-translate-y-1 grow border-b border-dotted border-black/30" />
      <span className="font-mono text-[0.94rem] text-[#1a1410]">{price}</span>
    </div>
  );
}

/** A fascia board: gold on red, display weight, inset rule. Loud, like the real thing. */
function ShopFascia({ hanzi, size }: Face): ReactNode {
  return (
    <div className="bg-[oklch(0.40_0.15_28)] p-[7px]">
      <div className="border-2 border-[oklch(0.78_0.13_85)] px-4 py-7 text-center">
        <div
          className="font-han font-bold leading-none tracking-[0.1em] text-[oklch(0.84_0.14_88)] [text-shadow:0_2px_0_rgba(0,0,0,0.25)]"
          style={{ fontSize: size }}
        >
          {hanzi}
        </div>
      </div>
    </div>
  );
}

/**
 * A shelf-edge label. The character you must read is the smallest thing on it and
 * the price shouts over it — which is the trap, so it is reproduced rather than
 * corrected.
 */
function PriceLabel({ hanzi, size }: Face): ReactNode {
  return (
    <div className="bg-[#fdf7dd]">
      <div className="flex items-center justify-between bg-[oklch(0.52_0.20_28)] px-3.5 py-1">
        <span className="font-han text-[1.05rem] font-bold tracking-[0.14em] text-white">特价</span>
        <span className="font-mono text-[0.69rem] text-white/85">08-22 → 08-29</span>
      </div>
      <div className="flex items-end justify-between gap-3 px-4 pb-2.5 pt-4">
        <div className="min-w-0">
          <div className="font-han font-medium leading-tight text-[#14140f]" style={{ fontSize: size }}>{hanzi}</div>
          <div className="mt-1.5 font-mono text-[0.8rem] text-[#6b6b5e]">原价 <span className="line-through">12.80</span></div>
        </div>
        <div className="shrink-0 whitespace-nowrap text-right text-[oklch(0.50_0.20_28)]">
          <span className="font-mono text-[1.2rem] font-bold">¥</span>
          <span className="font-mono text-[2.6rem] font-bold leading-none">9.90</span>
          <span className="font-han text-[1.3rem] font-bold">/斤</span>
        </div>
      </div>
      <svg viewBox="0 0 300 24" preserveAspectRatio="none" className="block h-6 w-full px-4 pb-3" aria-hidden="true">
        <g fill="#14140f">
          {[0, 5, 9, 16, 20, 26, 31, 38, 44, 48, 55, 60, 66, 73, 78, 84, 89, 96].map((x, i) => (
            <rect key={x} x={x} y="0" width={[2, 1, 3][i % 3]} height="24" />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * A safety sign, in its GB 2894 category. The colour and the shape are the first
 * thing a player can act on — a brand-new learner reads "do not" off a red circle
 * with a bar through it before they can read a character, which is why Safety is
 * over-weighted in the deck relative to its share of real signage.
 */
const SAFETY: Record<SafetyKind, { bg: string; ink: string; label: string; icon: ReactNode }> = {
  prohibition: {
    bg: 'oklch(0.52 0.21 27)', ink: '#fff', label: 'PROHIBITION',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></>,
  },
  warning: {
    bg: 'oklch(0.86 0.17 96)', ink: '#14140f', label: 'WARNING',
    icon: <><path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  },
  instruction: {
    bg: 'oklch(0.48 0.16 255)', ink: '#fff', label: 'INSTRUCTION',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  },
  notice: {
    bg: 'oklch(0.52 0.15 152)', ink: '#fff', label: 'NOTICE',
    icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="1" /><path d="M8 12l3 3 5-6" /></>,
  },
};

function SafetyBoard({ hanzi, size, kind }: Face & { kind: SafetyKind }): ReactNode {
  const s = SAFETY[kind];
  return (
    <div className="border-[5px] border-[#14140f]" style={{ background: s.bg }}>
      <div className="flex items-center gap-4 px-5 py-6">
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={s.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
          {s.icon}
        </svg>
        <div className="min-w-0">
          <div className="font-han font-bold leading-tight tracking-[0.04em]" style={{ fontSize: size, color: s.ink }}>
            {hanzi}
          </div>
          <div className="mt-1.5 text-[0.69rem] font-bold tracking-[0.16em] opacity-70" style={{ color: s.ink }}>
            {s.label}
          </div>
        </div>
      </div>
    </div>
  );
}
