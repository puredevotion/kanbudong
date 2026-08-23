import { categoryById, type CategoryId, type TemplateId } from '@kanbudong/engine';
import type { ReactNode } from 'react';

/**
 * The sign templates.
 *
 * Each scene renders as the kind of physical object you actually meet the
 * characters on, not as one card recoloured by topic. Recognising the object is
 * half of reading the sign: you know a price label is a price label before you
 * can read a character of it, and that knowledge is what makes the characters
 * guessable (DESIGN.md §3.2).
 *
 * Some of them are hard to read on purpose — the fascia is loud and tightly
 * tracked, the price label buries the target under a large number, the QR
 * ordering screen (DESIGN.md §7.1's "sixth card template") runs real 14–16px
 * phone density. That is FIDELITY to the real object, never a difficulty
 * device: perceptual disfluency does not aid learning (§1, "what we will not
 * build on"), and the target glyph clears WCAG AA contrast in every template
 * regardless - the ordering screen is exempt from the type-*size* floor, never
 * from contrast (DESIGN.md §7.1).
 *
 * The invariant: characters are set the way the real object sets them. Never
 * restyled into app chrome, never white-on-violet, never glowing. A learner who
 * can only recognise 出口 in the app's house style has learned the app.
 */

export type SignDomain = 'menu' | 'market' | 'street' | 'safety' | 'transit';

/**
 * A category's `visualTemplate` when it needs its own object rather than its
 * domain's default; otherwise the domain itself doubles as the template id
 * (the {@link TemplateId} union covers both). Never guesses from `category`
 * beyond that one field plus the domain fallback — the mapping lives in
 * `categories.ts`, not here.
 */
export function templateFor(category: CategoryId): TemplateId {
  return categoryById(category)?.visualTemplate ?? domainOf(category);
}

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
  return (
    (['menu', 'market', 'street', 'safety', 'transit'] as const).find((d) => d === head) ??
    'transit'
  );
}

/** Real text the target sits inside on the object; see {@link SignFace.context}. */
export interface SignContext {
  readonly before?: string | undefined;
  readonly after?: string | undefined;
}

interface SignProps {
  readonly template: TemplateId;
  /** Full scene id — the safety templates need it to pick their GB 2894 category. */
  readonly category: CategoryId;
  readonly hanzi: string;
  /** Shown only at the lowest stake, where the bet buys scaffolding. */
  readonly pinyin?: string | undefined;
  /** Genuine surrounding label/sign text the target is embedded in, if authored. */
  readonly context?: SignContext | undefined;
}

/** Scale the characters down as the span gets longer, so a 4-char sign still fits a phone. */
function sizeFor(hanzi: string): string {
  const n = [...hanzi].length;
  if (n <= 1) return '5.5rem';
  if (n === 2) return '4.5rem';
  if (n === 3) return '3.4rem';
  return '2.7rem';
}

export function Sign({ template, category, hanzi, pinyin, context }: SignProps): ReactNode {
  const size = sizeFor(hanzi);
  const body = {
    transit: <TransitPlate hanzi={hanzi} size={size} context={context} />,
    menu: <MenuSection hanzi={hanzi} size={size} context={context} />,
    'menu-order': <MenuOrderScreen hanzi={hanzi} size={size} context={context} />,
    street: <ShopFascia hanzi={hanzi} size={size} context={context} />,
    'street-promo': <PromoBanner hanzi={hanzi} size={size} context={context} />,
    'street-way': <WayfindingSign hanzi={hanzi} size={size} context={context} />,
    market: <PriceLabel hanzi={hanzi} size={size} context={context} />,
    'market-panel': <PackageLabel hanzi={hanzi} size={size} context={context} />,
    'market-checkout': <CheckoutScreen hanzi={hanzi} size={size} context={context} />,
    safety: (
      <SafetyBoard
        hanzi={hanzi}
        size={size}
        context={context}
        kind={SAFETY_KIND[category] ?? 'warning'}
      />
    ),
  }[template];

  return (
    <div>
      <div
        key={hanzi}
        className='anim-sign-in overflow-hidden rounded-[3px] shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]'
      >
        {body}
      </div>
      {pinyin !== undefined && (
        <p className='mt-3 text-center text-lg font-medium text-muted'>{pinyin}</p>
      )}
    </div>
  );
}

interface Face {
  readonly hanzi: string;
  readonly size: string;
  readonly context?: SignContext | undefined;
}

/**
 * Renders the target either alone at hero size — today's layout, kept as the
 * fallback for every item that has not yet been authored with `context` — or,
 * when the item's own `SignFace.context` supplies real surrounding text,
 * inline inside that text at the object's own print size with a highlight
 * marking exactly which span the question is about.
 *
 * The highlight is a sharp-cornered outline in the template's own ink, not a
 * rounded app-chrome pill: design/cards/README.md's invariant is that a sign
 * looks like the real object, never like the app, so this has to read as
 * something drawn *on* the object — a price-gun circle, a proofreading box —
 * not a UI affordance.
 */
function TargetSpan({
  hanzi,
  size,
  context,
  fontClass,
  ink,
  mark,
  heroWeight = 'font-medium',
}: {
  readonly hanzi: string;
  readonly size: string;
  readonly context: SignContext | undefined;
  /** Font family/tracking classes, without weight (weight differs hero vs. inline). */
  readonly fontClass: string;
  readonly ink: string;
  /** Highlight outline colour — must read as belonging to this object, not the app accent. */
  readonly mark: string;
  readonly heroWeight?: string;
}): ReactNode {
  if (context === undefined || (context.before === undefined && context.after === undefined)) {
    return (
      <span
        className={`${fontClass} ${heroWeight} leading-none`}
        style={{ fontSize: size, color: ink }}
      >
        {hanzi}
      </span>
    );
  }
  return (
    <span
      className={`${fontClass} inline leading-snug`}
      style={{ fontSize: `calc(${size} * 0.4)`, color: ink }}
    >
      {context.before}
      <span
        className='font-bold'
        style={{
          outline: `2px solid ${mark}`,
          outlineOffset: '0.1em',
          padding: '0 0.05em',
          borderRadius: 0,
        }}
      >
        {hanzi}
      </span>
      {context.after}
    </span>
  );
}

/** Station wayfinding: enamel plate, blue band, exit letter, arrow. */
function TransitPlate({ hanzi, size, context }: Face): ReactNode {
  return (
    <>
      <div className='flex items-center justify-between gap-3 bg-[oklch(0.42_0.13_250)] px-3.5 py-2'>
        <span className='font-han text-[0.94rem] font-medium tracking-[0.08em] text-white'>
          地铁
        </span>
        <span className='text-[0.69rem] font-semibold tracking-[0.14em] text-white/80'>METRO</span>
      </div>
      <div className='flex items-center justify-center gap-4 bg-[#f4f4f2] px-4 py-8'>
        <span className='flex h-10 w-10 shrink-0 items-center justify-center bg-[#14140f] text-[1.4rem] font-bold text-[#f4f4f2]'>
          B
        </span>
        <TargetSpan
          hanzi={hanzi}
          size={size}
          context={context}
          fontClass='font-han tracking-[0.04em]'
          ink='#14140f'
          mark='oklch(0.42 0.13 250)'
        />
        <svg
          width='40'
          height='40'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#14140f'
          strokeWidth='1.7'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='shrink-0'
          aria-hidden='true'
        >
          <path d='M4 12h15' />
          <path d='M13 6l6 6-6 6' />
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
function MenuSection({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='bg-[#f6f1e7]'>
      <div className='flex items-center justify-between gap-3 bg-[oklch(0.42_0.16_28)] px-4 py-2'>
        <span className='font-han-serif text-[1.05rem] font-bold tracking-[0.1em] text-white'>
          热菜
        </span>
        <span className='text-[0.63rem] font-semibold tracking-[0.16em] text-white/80'>
          HOT DISHES
        </span>
      </div>
      <div className='py-1.5'>
        <MenuRow name='宫保鸡丁' price='42' dim />
        <div className='flex items-baseline gap-2.5 border-l-[3px] border-[oklch(0.52_0.19_28)] bg-[rgba(180,40,30,0.09)] px-4 py-3'>
          <TargetSpan
            hanzi={hanzi}
            size={size}
            context={context}
            fontClass='font-han-serif leading-tight'
            ink='#1a1410'
            mark='oklch(0.42 0.16 28)'
            heroWeight='font-bold'
          />
          <span className='-translate-y-1 grow border-b border-dotted border-black/30' />
          <span className='font-mono text-[1.05rem] font-semibold text-[#1a1410]'>68</span>
        </div>
        <MenuRow name='清蒸鱼' price='88' dim />
      </div>
    </div>
  );
}

function MenuRow({ name, price, dim }: { name: string; price: string; dim?: boolean }): ReactNode {
  return (
    <div className={`flex items-baseline gap-2.5 px-4 py-2.5 ${dim === true ? 'opacity-45' : ''}`}>
      <span className='font-han-serif text-[1.25rem] text-[#1a1410]'>{name}</span>
      <span className='-translate-y-1 grow border-b border-dotted border-black/30' />
      <span className='font-mono text-[0.94rem] text-[#1a1410]'>{price}</span>
    </div>
  );
}

/**
 * The QR/mini-programme ordering screen — DESIGN.md §7.1's "sixth card
 * template". Table service now mostly routes through 扫码点餐: a phone inside
 * the phone, at the real 14–16px density of that UI, ignoring `size` entirely
 * because small type *is* the difficulty here, not a defect elsewhere fixed.
 * Still clears WCAG AA contrast (§7.1: the exemption is from the type-size
 * floor, never from contrast).
 */
function MenuOrderScreen({ hanzi, context }: Face): ReactNode {
  const hasContext =
    context !== undefined && (context.before !== undefined || context.after !== undefined);
  return (
    <div className='bg-[#efefef]'>
      <div className='flex items-center justify-between bg-[#1a1a1a] px-3.5 py-2 text-white'>
        <span className='text-[13px] font-medium'>扫码点餐</span>
        <span className='text-[11px] opacity-70'>桌号 A12</span>
      </div>
      <div className='flex flex-col gap-[1px] bg-[#dcdcdc] py-[1px]'>
        <MenuOrderRow name='宫保鸡丁' price='42' />
        <div className='flex items-center justify-between gap-3 bg-[#fff8e8] px-3.5 py-2.5'>
          {hasContext ? (
            <span className='font-han text-[15px] leading-tight text-[#14140f]'>
              {context.before}
              <span
                className='font-bold'
                style={{
                  outline: '2px solid oklch(0.42 0.16 28)',
                  outlineOffset: '0.08em',
                  padding: '0 0.05em',
                }}
              >
                {hanzi}
              </span>
              {context.after}
            </span>
          ) : (
            <span className='font-han text-[15px] font-medium leading-tight text-[#14140f]'>
              {hanzi}
            </span>
          )}
          <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[oklch(0.52_0.20_28)] text-[13px] font-bold leading-none text-white'>
            +
          </span>
        </div>
        <MenuOrderRow name='清蒸鱼' price='88' />
      </div>
      <div className='flex items-center justify-between gap-3 bg-white px-3.5 py-2.5'>
        <span className='text-[11px] text-[#8a8a8a]'>备注：不要香菜</span>
        <span className='whitespace-nowrap rounded-[3px] bg-[#8a8a8a] px-3 py-1.5 text-[11px] font-medium text-white'>
          去结算
        </span>
      </div>
    </div>
  );
}

function MenuOrderRow({ name, price }: { name: string; price: string }): ReactNode {
  return (
    <div className='flex items-center justify-between gap-3 bg-white px-3.5 py-2.5 opacity-60'>
      <span className='font-han text-[15px] text-[#14140f]'>{name}</span>
      <span className='font-mono text-[12px] text-[#5a5a52]'>¥{price}</span>
    </div>
  );
}

/** A fascia board: gold on red, display weight, inset rule. Loud, like the real thing. */
function ShopFascia({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='bg-[oklch(0.40_0.15_28)] p-[7px]'>
      <div className='border-2 border-[oklch(0.78_0.13_85)] px-4 py-7 text-center [text-shadow:0_2px_0_rgba(0,0,0,0.25)]'>
        <TargetSpan
          hanzi={hanzi}
          size={size}
          context={context}
          fontClass='font-han tracking-[0.1em]'
          ink='oklch(0.84 0.14 88)'
          mark='oklch(0.92 0.19 96)'
          heroWeight='font-bold'
        />
      </div>
    </div>
  );
}

/**
 * A clearance/sale poster taped or painted across a shopfront window — the
 * loud red-and-yellow burst, not the shop's own name plate. Distinct from
 * {@link ShopFascia}: a fascia identifies the shop, a promo poster is
 * disposable and gets torn down and replaced every week.
 */
function PromoBanner({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='relative overflow-hidden bg-[oklch(0.58_0.22_28)] p-[10px]'>
      <svg
        className='pointer-events-none absolute inset-0 h-full w-full opacity-25'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
        aria-hidden='true'
      >
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={i}
            x1={-20 + i * 20}
            y1='120'
            x2={20 + i * 20}
            y2='-20'
            stroke='#fff'
            strokeWidth='6'
          />
        ))}
      </svg>
      <div className='relative border-[3px] border-dashed border-[oklch(0.92_0.19_96)] px-4 py-6 text-center [text-shadow:0_2px_0_rgba(0,0,0,0.3)]'>
        <TargetSpan
          hanzi={hanzi}
          size={size}
          context={context}
          fontClass='font-han tracking-[0.06em]'
          ink='oklch(0.96 0.05 96)'
          mark='#14140f'
          heroWeight='font-bold'
        />
      </div>
    </div>
  );
}

/**
 * Street-level wayfinding — a mall directory or pedestrian-street board, blue
 * on white with a directional arrow, distinct from the transit plate's black
 * enamel: this is the sign that points *between* buildings, not into a
 * station.
 */
function WayfindingSign({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='bg-white'>
      <div className='flex items-center justify-center gap-4 border-b-4 border-[oklch(0.48_0.16_255)] px-4 py-8'>
        <svg
          width='34'
          height='34'
          viewBox='0 0 24 24'
          fill='none'
          stroke='oklch(0.48 0.16 255)'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='shrink-0'
          aria-hidden='true'
        >
          <path d='M12 19V6' />
          <path d='M6 12l6-6 6 6' />
        </svg>
        <TargetSpan
          hanzi={hanzi}
          size={size}
          context={context}
          fontClass='font-han tracking-[0.04em]'
          ink='oklch(0.30 0.10 255)'
          mark='oklch(0.48 0.16 255)'
        />
      </div>
    </div>
  );
}

/**
 * A shelf-edge label. The character you must read is the smallest thing on it and
 * the price shouts over it — which is the trap, so it is reproduced rather than
 * corrected.
 */
function PriceLabel({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='bg-[#fdf7dd]'>
      <div className='flex items-center justify-between bg-[oklch(0.52_0.20_28)] px-3.5 py-1'>
        <span className='font-han text-[1.05rem] font-bold tracking-[0.14em] text-white'>特价</span>
        <span className='font-mono text-[0.69rem] text-white/85'>08-22 → 08-29</span>
      </div>
      <div className='flex items-end justify-between gap-3 px-4 pb-2.5 pt-4'>
        <div className='min-w-0'>
          <TargetSpan
            hanzi={hanzi}
            size={size}
            context={context}
            fontClass='font-han leading-tight'
            ink='#14140f'
            mark='oklch(0.52 0.20 28)'
          />
          <div className='mt-1.5 font-mono text-[0.8rem] text-[#6b6b5e]'>
            原价 <span className='line-through'>12.80</span>
          </div>
        </div>
        <div className='shrink-0 whitespace-nowrap text-right text-[oklch(0.50_0.20_28)]'>
          <span className='font-mono text-[1.2rem] font-bold'>¥</span>
          <span className='font-mono text-[2.6rem] font-bold leading-none'>9.90</span>
          <span className='font-han text-[1.3rem] font-bold'>/斤</span>
        </div>
      </div>
      <svg
        viewBox='0 0 300 24'
        preserveAspectRatio='none'
        className='block h-6 w-full px-4 pb-3'
        aria-hidden='true'
      >
        <g fill='#14140f'>
          {[0, 5, 9, 16, 20, 26, 31, 38, 44, 48, 55, 60, 66, 73, 78, 84, 89, 96].map((x, i) => (
            <rect key={x} x={x} y='0' width={[2, 1, 3][i % 3]} height='24' />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * The back-of-package label — GB 7718's mandatory production-date/shelf-life
 * block, small print in a dense grid. Distinct from {@link PriceLabel}: a
 * shelf tag is one big number you read across a shop floor, a back panel is
 * several small fields you read holding the packet in your hand.
 *
 * The 净含量/生产日期/保质期 rows this used to render were fixed placeholders,
 * regardless of what the item actually was — the confirmed bug (号/时/点 shown
 * inside shelf-life chrome that has nothing to do with any of them). When
 * `context` supplies the real field the target sits in (e.g. 号 inside a
 * genuine "产品批号" line), that replaces the placeholder row entirely; when
 * it is absent, the label shows only what is true of every package — the
 * header and the barcode — rather than inventing specifics for a term that
 * may not be a package field at all.
 */
function PackageLabel({ hanzi, size, context }: Face): ReactNode {
  const hasContext =
    context !== undefined && (context.before !== undefined || context.after !== undefined);
  return (
    <div className='bg-white'>
      <div className='border-b border-[#d8d8d0] px-3.5 py-1.5 text-center'>
        <span className='text-[0.6rem] font-semibold tracking-[0.2em] text-[#8a8a7e]'>
          食品标签 · LABEL
        </span>
      </div>
      <div className='flex flex-col gap-1.5 px-4 py-3.5'>
        {hasContext ? (
          <div className='flex items-baseline gap-2.5 border-y border-[#e8e8e0] py-2.5 text-[0.78rem]'>
            <span className='font-han text-[#14140f]'>
              {context.before}
              <span
                className='font-bold'
                style={{
                  outline: '2px solid oklch(0.52 0.20 28)',
                  outlineOffset: '0.08em',
                  padding: '0 0.05em',
                }}
              >
                {hanzi}
              </span>
              {context.after}
            </span>
          </div>
        ) : (
          <div className='flex items-baseline gap-2.5 py-2'>
            <span
              className='font-han font-medium leading-tight text-[#14140f]'
              style={{ fontSize: size }}
            >
              {hanzi}
            </span>
          </div>
        )}
      </div>
      <svg
        viewBox='0 0 300 20'
        preserveAspectRatio='none'
        className='block h-5 w-full px-4 pb-2.5'
        aria-hidden='true'
      >
        <g fill='#14140f'>
          {[0, 4, 7, 13, 16, 21, 25, 31, 36, 39, 45, 49, 54, 60, 64, 69, 73, 79].map((x, i) => (
            <rect key={x} x={x} y='0' width={[2, 1, 3][i % 3]} height='20' />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * The checkout counter — a till screen with the running total and the QR
 * payment code, not a price tag. Distinct from {@link PriceLabel}: this is
 * where the number gets paid, not where it's advertised.
 */
function CheckoutScreen({ hanzi, size, context }: Face): ReactNode {
  return (
    <div className='bg-[#0f1410]'>
      <div className='flex items-center justify-between px-3.5 py-2'>
        <span className='font-han text-[0.85rem] font-medium text-[#8fdba0]'>收银台 3</span>
        <span className='h-2.5 w-2.5 rounded-full bg-[#8fdba0]' />
      </div>
      <div className='flex flex-col items-center gap-2 px-4 py-6'>
        <TargetSpan
          hanzi={hanzi}
          size={size}
          context={context}
          fontClass='font-han tracking-[0.04em]'
          ink='#e4fbe9'
          mark='#8fdba0'
        />
        <span className='font-mono text-[1.6rem] font-bold text-[#8fdba0]'>¥ 32.80</span>
      </div>
      <div className='flex items-center justify-center gap-2 border-t border-[#1f2b22] px-4 py-2.5'>
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#8fdba0'
          strokeWidth='2'
          aria-hidden='true'
        >
          <rect x='3' y='3' width='7' height='7' />
          <rect x='14' y='3' width='7' height='7' />
          <rect x='3' y='14' width='7' height='7' />
          <rect x='14' y='14' width='3' height='3' />
        </svg>
        <span className='text-[0.7rem] font-medium tracking-[0.1em] text-[#8fdba0]'>扫码支付</span>
      </div>
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
    bg: 'oklch(0.52 0.21 27)',
    ink: '#fff',
    label: 'PROHIBITION',
    icon: (
      <>
        <circle cx='12' cy='12' r='9' />
        <path d='M5.6 5.6l12.8 12.8' />
      </>
    ),
  },
  warning: {
    bg: 'oklch(0.86 0.17 96)',
    ink: '#14140f',
    label: 'WARNING',
    icon: (
      <>
        <path d='M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z' />
        <path d='M12 9v4' />
        <path d='M12 17h.01' />
      </>
    ),
  },
  instruction: {
    bg: 'oklch(0.48 0.16 255)',
    ink: '#fff',
    label: 'INSTRUCTION',
    icon: (
      <>
        <circle cx='12' cy='12' r='9' />
        <path d='M12 8v8M8 12h8' />
      </>
    ),
  },
  notice: {
    bg: 'oklch(0.52 0.15 152)',
    ink: '#fff',
    label: 'NOTICE',
    icon: (
      <>
        <rect x='3.5' y='3.5' width='17' height='17' rx='1' />
        <path d='M8 12l3 3 5-6' />
      </>
    ),
  },
};

function SafetyBoard({ hanzi, size, context, kind }: Face & { kind: SafetyKind }): ReactNode {
  const s = SAFETY[kind];
  return (
    <div className='border-[5px] border-[#14140f]' style={{ background: s.bg }}>
      <div className='flex items-center gap-4 px-5 py-6'>
        <svg
          width='54'
          height='54'
          viewBox='0 0 24 24'
          fill='none'
          stroke={s.ink}
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='shrink-0'
          aria-hidden='true'
        >
          {s.icon}
        </svg>
        <div className='min-w-0'>
          <TargetSpan
            hanzi={hanzi}
            size={size}
            context={context}
            fontClass='font-han tracking-[0.04em]'
            ink={s.ink}
            mark={s.ink}
            heroWeight='font-bold'
          />
          <div
            className='mt-1.5 text-[0.69rem] font-bold tracking-[0.16em] opacity-70'
            style={{ color: s.ink }}
          >
            {s.label}
          </div>
        </div>
      </div>
    </div>
  );
}
