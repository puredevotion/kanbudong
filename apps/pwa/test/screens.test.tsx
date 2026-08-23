import { createIdentity } from '@kanbudong/engine';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Create } from '../src/screens/Create.jsx';
import { Home } from '../src/screens/Home.jsx';
import { Join } from '../src/screens/Join.jsx';
import { Lobby } from '../src/screens/Lobby.jsx';
import { Onboarding } from '../src/screens/Onboarding.jsx';
import { Results } from '../src/screens/Results.jsx';
import { useApp } from '../src/lib/store.js';

/**
 * Repo-wide Rules-of-Hooks sweep (see Solo/Play's own, higher-value tests for
 * the crash this is guarding against): a real #310 violation throws the
 * moment React tries to render, so simply mounting every screen catches it.
 * These are the cheap screens - no session/snapshot state to fabricate, or a
 * "waiting" render path that needs none. `Play` and `Solo` get their own
 * dedicated test files because reaching their interesting render paths (a
 * live question, a completed session) needs real fixture state.
 */

afterEach(() => {
  cleanup();
  useApp.setState({ identity: null, snapshot: null });
});

describe('screen smoke tests (mount without throwing)', () => {
  it('Onboarding renders with no identity yet', () => {
    const { getByText } = render(<Onboarding />);
    expect(getByText('Start playing')).toBeTruthy();
  });

  it('Home renders once signed in', () => {
    useApp.setState({ identity: createIdentity('Ada') });
    const { getByText } = render(<Home />);
    expect(getByText('Practice')).toBeTruthy();
  });

  it('Create renders the hosting form', () => {
    useApp.setState({ identity: createIdentity('Ada') });
    const { getByText } = render(<Create />);
    expect(getByText('Host a game')).toBeTruthy();
  });

  it('Join renders the scan/type chooser', () => {
    useApp.setState({ identity: createIdentity('Ada') });
    const { getByText } = render(<Join />);
    expect(getByText('Join a game')).toBeTruthy();
  });

  it('Lobby renders its waiting state with no snapshot yet', () => {
    const { getByText } = render(<Lobby />);
    expect(getByText(/Waiting for the game to arrive/)).toBeTruthy();
  });

  it('Results renders nothing (and does not throw) with no snapshot yet', () => {
    const { container } = render(<Results />);
    expect(container.textContent).toBe('');
  });
});
