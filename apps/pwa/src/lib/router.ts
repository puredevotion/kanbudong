import { useEffect, useState } from 'react';

/**
 * Hash routing, hand-rolled in thirty lines.
 *
 * Not austerity for its own sake: the app has six screens, must run from a
 * `file://` URL or any static subpath, and a QR code puts the join ticket in
 * the fragment so no server ever sees it. A history-API router would fight all
 * three of those.
 */
export interface Route {
  readonly path: string;
  readonly params: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '');
  const [path = '', query = ''] = raw.split('?');
  return {
    path: normalise(path),
    params: new URLSearchParams(query),
  };
}

export function navigate(path: string, params?: Record<string, string>): void {
  const query = params === undefined ? '' : `?${new URLSearchParams(params).toString()}`;
  const next = `#${normalise(path)}${query}`;
  if (globalThis.location.hash === next) return;
  globalThis.location.hash = next;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(globalThis.location?.hash ?? ''));
  useEffect(() => {
    const onChange = (): void => setRoute(parseHash(globalThis.location.hash));
    globalThis.addEventListener('hashchange', onChange);
    return () => globalThis.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

function normalise(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  if (trimmed === '' || trimmed === '/') return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
