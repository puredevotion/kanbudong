import init, { Fsrs } from 'fsrs-browser';

/**
 * Runs `fsrs-browser`'s WASM FSRS-6 optimizer off the main thread. A refit
 * is a nontrivial optimization pass over however many hundred reviews a
 * player has - see `@kanbudong/engine`'s `fsrsRefit.ts` for the minimum-data
 * gate - and must never stall an in-progress review session, so this file
 * only ever runs inside a dedicated Worker (`fsrsRefit.ts` in this
 * directory is the only thing that constructs one).
 */

export interface RefitRequest {
  readonly ratings: Uint32Array;
  readonly deltaTs: Uint32Array;
  readonly lengths: Uint32Array;
}

export type RefitResponse = { readonly ok: true; readonly w: number[] } | { readonly ok: false; readonly error: string };

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  ready ??= init().then(() => undefined);
  return ready;
}

self.onmessage = async (event: MessageEvent<RefitRequest>): Promise<void> => {
  const { ratings, deltaTs, lengths } = event.data;
  try {
    await ensureReady();
    const fsrs = new Fsrs();
    // `enable_short_term` false to match this app's live scheduler config
    // (`packages/engine/src/memory.ts`'s `generatorParameters` call) - a
    // fit trained with a different short-term setting than the one it will
    // schedule with would be fitting the wrong model.
    const fitted = fsrs.computeParameters(ratings, deltaTs, lengths, undefined, false);
    const response: RefitResponse = { ok: true, w: Array.from(fitted) };
    (self as unknown as Worker).postMessage(response);
  } catch (error) {
    const response: RefitResponse = { ok: false, error: error instanceof Error ? error.message : String(error) };
    (self as unknown as Worker).postMessage(response);
  }
};
