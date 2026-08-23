import type { ReactNode } from 'react';

/**
 * Glyph shim for codepoints no CJK webfont draws.
 *
 * Content stores canonical Unicode — `⿰阝完`, not a prose paraphrase — because the
 * content layer should not be bent around a font's coverage. The shim swaps the
 * unrenderable codepoints for inline SVG at display time, so the data stays
 * correct and the screen stays legible.
 *
 * The twelve Ideographic Description Characters (U+2FF0–U+2FFB) are absent from
 * Noto Sans SC and Noto Serif SC. They are notation rather than characters anyone
 * reads in the wild, so drawing them costs nothing pedagogically: a reader who
 * does not know the notation still sees the shape of the composition.
 *
 * NOT shimmed, deliberately: ⺼ U+2EBC, the bound form of 肉. It is also absent
 * from every Noto SC file, but drawing a distinctive glyph for it would teach a
 * shape that does not appear on a real sign — in the PRC 新字形 forms this app
 * uses, the component inside 肝 肠 肚 腰 脑 is drawn exactly like 月. The
 * distinction is one of identity, not of rendering: it is carried by the stored
 * component id and the label ("flesh"), never by the picture. Substituting the
 * *character* 月 in data would be the error; showing its *shape* is what a learner
 * must actually recognise.
 */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const O = 'M3 2.5h18v19H3z';

/** Unicode's own reference glyphs: a box, divided the way the composition divides. */
const IDC: Record<string, ReactNode> = {
  '⿰': <><path d={O} {...S} /><path d="M12 2.5v19" {...S} /></>,
  '⿱': <><path d={O} {...S} /><path d="M3 12h18" {...S} /></>,
  '⿲': <><path d={O} {...S} /><path d="M9 2.5v19M15 2.5v19" {...S} /></>,
  '⿳': <><path d={O} {...S} /><path d="M3 8.8h18M3 15.2h18" {...S} /></>,
  '⿴': <><path d={O} {...S} /><path d="M7.5 7h9v10h-9z" {...S} /></>,
  '⿵': <><path d="M3 21.5v-19h18v19" {...S} /><path d="M8 8.5h8v9H8z" {...S} /></>,
  '⿶': <><path d="M3 2.5v19h18v-19" {...S} /><path d="M8 6.5h8v9H8z" {...S} /></>,
  '⿷': <><path d="M21 2.5H3v19h18" {...S} /><path d="M8.5 7.5h8v9h-8z" {...S} /></>,
  '⿸': <><path d="M3 21.5v-19h18" {...S} /><path d="M9 9h8v8.5H9z" {...S} /></>,
  '⿹': <><path d="M21 21.5v-19H3" {...S} /><path d="M7 9h8v8.5H7z" {...S} /></>,
  '⿺': <><path d="M3 2.5v19h18" {...S} /><path d="M8.5 6h8v8.5h-8z" {...S} /></>,
  '⿻': <><path d="M3 2.5h13v13H3z" {...S} /><path d="M8 8.5h13v13H8z" {...S} /></>,
};

function Idc({ ch }: { ch: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={IDC_LABEL[ch] ?? 'composition'}
      style={{ display: 'inline-block', width: '0.82em', height: '0.82em', verticalAlign: '-0.08em', margin: '0 0.12em', opacity: 0.85 }}
    >
      {IDC[ch]}
    </svg>
  );
}

/** Read aloud, so the notation is not silence to a screen reader. */
const IDC_LABEL: Record<string, string> = {
  '⿰': 'left and right', '⿱': 'above and below',
  '⿲': 'three across', '⿳': 'three stacked',
  '⿴': 'fully enclosed', '⿵': 'enclosed from above',
  '⿶': 'enclosed from below', '⿷': 'enclosed from the left',
  '⿸': 'enclosed from the upper left', '⿹': 'enclosed from the upper right',
  '⿺': 'enclosed from the lower left', '⿻': 'overlaid',
};

/**
 * Split a string on shimmed codepoints, returning text and inline SVG. Safe on
 * text containing none, which is almost all of it.
 */
export function withGlyphs(text: string): ReactNode {
  if (!/[⿰-⿻]/.test(text)) return text;
  const out: ReactNode[] = [];
  let buf = '';
  for (const [i, ch] of [...text].entries()) {
    if (IDC[ch] !== undefined) {
      if (buf !== '') { out.push(buf); buf = ''; }
      out.push(<Idc key={i} ch={ch} />);
    } else {
      buf += ch;
    }
  }
  if (buf !== '') out.push(buf);
  return out;
}
