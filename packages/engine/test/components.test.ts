import { describe, expect, it } from 'vitest';

import { COMPONENTS } from '../src/index.js';

describe('COMPONENTS', () => {
  it('gives every component a non-empty meaning gloss', () => {
    for (const [id, component] of Object.entries(COMPONENTS)) {
      expect(component.meaning, `${id} is missing a meaning`).toBeTruthy();
      expect(component.meaning.trim().length, `${id}'s meaning is blank`).toBeGreaterThan(0);
    }
  });
});
