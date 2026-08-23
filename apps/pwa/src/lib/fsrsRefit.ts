import {
  acceptFittedParameters,
  buildFsrsTrainingSet,
  resolveFsrsParameters,
  shouldAttemptRefit,
  totalTrainingReviews,
  type FsrsTrainingItem,
  type PersonalFsrsFit,
  type PlayerId,
} from '@kanbudong/engine';

import { loadRawSoloAttempts } from './attemptLog.js';
import { getFsrsFit, putFsrsFit } from './fsrsFit.js';
import type { RefitRequest, RefitResponse } from './fsrsRefit.worker.js';

/**
 * Owns the one thing `@kanbudong/engine`'s `fsrsRefit.ts` deliberately
 * cannot: actually calling the WASM optimizer (`fsrs-browser`) and
 * persisting what it returns. Runs the fit in a dedicated Worker
 * (`fsrsRefit.worker.ts`) so a nontrivial optimization pass over hundreds of
 * reviews never blocks an active review session's UI thread.
 */

/** The `w` a session should schedule with: the player's fit if one is on record, `default_w` otherwise. */
export function currentFsrsParameters(playerId: PlayerId): readonly number[] {
  return resolveFsrsParameters(getFsrsFit(playerId));
}

function flatten(trainingSet: readonly FsrsTrainingItem[]): RefitRequest {
  const total = totalTrainingReviews(trainingSet);
  const ratings = new Uint32Array(total);
  const deltaTs = new Uint32Array(total);
  const lengths = new Uint32Array(trainingSet.length);
  let cursor = 0;
  trainingSet.forEach((item, index) => {
    lengths[index] = item.reviews.length;
    for (const review of item.reviews) {
      ratings[cursor] = review.rating;
      deltaTs[cursor] = review.elapsedDays;
      cursor += 1;
    }
  });
  return { ratings, deltaTs, lengths };
}

function runInWorker(request: RefitRequest): Promise<RefitResponse> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./fsrsRefit.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<RefitResponse>) => {
      resolve(event.data);
      worker.terminate();
    };
    worker.onerror = (event: ErrorEvent) => {
      reject(new Error(event.message));
      worker.terminate();
    };
    worker.postMessage(request satisfies RefitRequest);
  });
}

/**
 * Called at a point that cannot stall a review (the session-complete
 * screen, not mid-grading - see `Solo.tsx`) so the Worker hop and WASM call
 * are free to take their time. A no-op below the minimum-data floor or
 * before enough new reviews have accumulated since the last fit - see
 * `@kanbudong/engine`'s `fsrsRefit.ts` for both thresholds and their
 * citations - so this is safe to call after every solo session.
 */
export async function maybeRefitFsrsParameters(playerId: PlayerId): Promise<void> {
  const attempts = loadRawSoloAttempts(playerId);
  const trainingSet = buildFsrsTrainingSet(attempts);
  const total = totalTrainingReviews(trainingSet);
  const lastFit = getFsrsFit(playerId);

  if (!shouldAttemptRefit(total, lastFit === null ? null : { reviewCountAtFit: lastFit.reviewCount })) return;

  try {
    const response = await runInWorker(flatten(trainingSet));
    if (!response.ok) return;
    const accepted = acceptFittedParameters(response.w);
    if (accepted === null) return;
    const fit: PersonalFsrsFit = { w: accepted, fittedAt: Date.now(), reviewCount: total };
    putFsrsFit(playerId, fit);
  } catch {
    // A refit is a nice-to-have improvement, not a requirement to keep
    // playing - if the Worker/WASM path fails (unsupported browser, out of
    // memory), the player just keeps scheduling on whatever w they had.
  }
}
