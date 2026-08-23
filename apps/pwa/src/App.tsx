import { useEffect, type ReactNode } from 'react';

import { useRoute } from './lib/router.js';
import { useApp } from './lib/store.js';
import { Create } from './screens/Create.jsx';
import { Home } from './screens/Home.jsx';
import { Join } from './screens/Join.jsx';
import { Lobby } from './screens/Lobby.jsx';
import { Onboarding } from './screens/Onboarding.jsx';
import { Play } from './screens/Play.jsx';
import { Results } from './screens/Results.jsx';
import { Notice } from './ui/atoms.jsx';

const IN_GAME_PATHS = new Set(['/lobby', '/play', '/results']);

/**
 * Routing, such as it is.
 *
 * The in-game screen is chosen from the game's phase rather than the URL, so a
 * peer pressing "start" moves every device forward without anyone navigating
 * anywhere. That also means no screen ever has to call navigate() while
 * rendering, which is the usual way this kind of app tears itself.
 */
export function App(): ReactNode {
  const route = useRoute();
  const identity = useApp((s) => s.identity);
  const session = useApp((s) => s.session);
  const state = useApp((s) => s.snapshot?.state ?? null);
  const resume = useApp((s) => s.resume);
  const storageDegraded = useApp((s) => s.storageDegraded);

  // A reload clears the in-memory session (Zustand starts fresh every load),
  // but the URL hash still says #/lobby or #/play from before the refresh -
  // without this, that combination renders Lobby's bare "waiting for the
  // game to arrive" placeholder forever, with no way to get back in short of
  // navigating to Home and finding the "rejoin" button there by hand.
  useEffect(() => {
    if (identity !== null && session === null && IN_GAME_PATHS.has(route.path)) {
      void resume();
    }
    // Only ever worth trying once per load: a resume that fails (no saved
    // game) isn't going to start succeeding because something else changed.
  }, []);

  // The single most common cause of a "bleeped out" connection reported
  // against trystero itself (github.com/dmotz/trystero/issues/29) is the
  // screen locking mid-game: the OS suspends the page, WebRTC has nothing to
  // service, and trystero's own per-peer disconnect timer - a fixed 5
  // seconds of grace after 'disconnected' with no ICE-restart attempt in
  // between (confirmed against the installed version's peer.mjs) - declares
  // the peer gone almost immediately once that happens. Holding a screen
  // wake lock while a game is in progress prevents the suspension outright,
  // which is the only lever available here: trystero itself never retries.
  // The lock is released by the OS on backgrounding regardless (switching
  // apps, not just screen-off), so it is re-acquired on visibilitychange
  // rather than assumed to still hold.
  useEffect(() => {
    if (session === null || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const acquire = (): void => {
      void navigator.wakeLock.request('screen').then(
        (sentinel) => {
          if (cancelled) {
            void sentinel.release();
            return;
          }
          lock = sentinel;
          // The OS can revoke the lock for reasons that never touch
          // document.visibilityState (e.g. low-power mode) - without this,
          // `lock` keeps pointing at an already-dead sentinel forever, and
          // the visibilitychange handler's `lock === null` guard then never
          // sees a reason to ask for a new one.
          sentinel.addEventListener('release', () => {
            if (lock !== sentinel) return;
            lock = null;
            if (!cancelled && document.visibilityState === 'visible') acquire();
          });
        },
        () => {
          /* not available right now (e.g. backgrounded); fine, we retry on visibilitychange */
        },
      );
    };
    const onVisibility = (): void => {
      if (document.visibilityState === 'visible' && lock === null) acquire();
    };
    acquire();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void lock?.release();
    };
  }, [session === null]);

  const degradedBanner = storageDegraded && (
    <div className="mx-auto w-full max-w-md px-5 pt-3">
      <Notice tone="warn">
        Nothing is saving right now - private browsing or storage being blocked, most likely.
        Reloading this tab will lose your place in the game.
      </Notice>
    </div>
  );

  if (identity === null) {
    return (
      <>
        {degradedBanner}
        <Onboarding />
      </>
    );
  }

  const screen = (() => {
    switch (route.path) {
      case '/create':
        return <Create />;
      case '/join':
        return <Join />;
      case '/lobby':
      case '/play':
      case '/results':
        if (state === null || state.phase === 'lobby') return <Lobby />;
        return state.phase === 'playing' ? <Play /> : <Results />;
      default:
        return <Home />;
    }
  })();

  return (
    <>
      {degradedBanner}
      {screen}
    </>
  );
}
