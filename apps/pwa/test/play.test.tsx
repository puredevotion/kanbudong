import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Play } from '../src/screens/Play.jsx';
import { useApp } from '../src/lib/store.js';

import { buildLiveQuestionGame } from './gameFixture.js';

afterEach(() => {
  cleanup();
  useApp.setState({ identity: null, snapshot: null });
});

describe('Play', () => {
  it('renders the loading state with no throw when there is no session yet', () => {
    const { container } = render(<Play />);
    expect(container).toBeTruthy();
  });

  it('renders a live question mid-turn without throwing (Rules-of-Hooks smoke test)', () => {
    const { state, me } = buildLiveQuestionGame();
    useApp.setState({
      identity: me,
      snapshot: {
        state,
        status: 'connected',
        peerCount: 3,
        diverged: false,
        peerVersionMismatch: false,
        everConnected: true,
        logSize: 0,
      },
    });

    const { getByText } = render(<Play />);
    expect(state.active?.questionId).not.toBeNull();
    expect(getByText('Something stuck? Call time')).toBeTruthy();
  });
});
