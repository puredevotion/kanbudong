import type { ReactNode } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/** How often to poll for a new deploy while a tab sits open. */
const UPDATE_CHECK_INTERVAL_MS = 60_000;

/**
 * The default registration only checks for a new service worker on a fresh
 * navigation, which a lobby that sits open for a while never gets. Poll on an
 * interval and surface a banner instead of reloading out from under anyone -
 * a redeploy mid-game is exactly what the README says never to do (R-15), so
 * the player decides when, not the app.
 */
export function UpdatePrompt(): ReactNode {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration === undefined) return;
      setInterval(() => {
        void registration.update();
      }, UPDATE_CHECK_INTERVAL_MS);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-default-200/40 bg-default-100 px-4 py-3 text-sm shadow-lg">
      <span className="text-default-foreground">
        A newer version is ready. Everyone should update before you start.
      </span>
      <button
        type="button"
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 font-medium text-white"
        onClick={() => void updateServiceWorker(true)}
      >
        Update now
      </button>
    </div>
  );
}
