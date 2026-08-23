import { SEED_PACK } from '@kanbudong/engine';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import { Sign, domainOf } from './ui/signs.jsx';
import './styles.css';

/** Dev harness: every sign template with a real item from the bank. */
function Gallery(): ReactNode {
  const picks = ['transit-platform', 'menu-animal', 'street-trade', 'market-weight', 'safety-prohibition', 'safety-exit']
    .map((c) => SEED_PACK.questions.find((q) => q.category === c && q.face !== undefined))
    .filter((q) => q !== undefined);
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-8">
      {picks.map((q) => (
        <div key={q.id}>
          <div className="mb-2 text-[0.7rem] font-bold tracking-[0.16em] text-muted">
            {q.category.toUpperCase()}
          </div>
          <Sign domain={domainOf(q.category)} category={q.category} hanzi={q.face?.hanzi ?? ''} pinyin={q.face?.pinyin} />
          <p className="mt-3 text-lg font-medium leading-snug">{q.prompt}</p>
        </div>
      ))}
    </main>
  );
}
createRoot(document.getElementById('root') as HTMLElement).render(<Gallery />);
