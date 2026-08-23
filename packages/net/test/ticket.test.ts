import { encodeJoinCode, PROTOCOL_VERSION, randomJoinCode, SEED_PACK_HASH } from '@kanbudong/engine';
import { describe, expect, it } from 'vitest';

import {
  buildTicket,
  checkTicket,
  decodeTicket,
  encodeTicket,
  explainRefusal,
  parseScanned,
  ticketUrl,
} from '../src/ticket.js';

// Built from the real vocabulary rather than hand-picked words: the wordlist is
// generated, so a plausible-looking code is not necessarily a valid one.
const FIXED_CODE = encodeJoinCode(123_456_789);

const ticketFor = (overrides: Partial<Parameters<typeof buildTicket>[0]> = {}) =>
  buildTicket({
    gameId: 'game_abcdefghij',
    joinCode: FIXED_CODE,
    packHash: SEED_PACK_HASH,
    ...overrides,
  });

describe('join tickets', () => {
  it('round-trips', () => {
    const ticket = ticketFor({ joinCode: randomJoinCode() });
    expect(decodeTicket(encodeTicket(ticket))).toEqual(ticket);
  });

  it('stays small enough for a QR code somebody will actually scan', () => {
    // The whole reason for the compact format: a 250-character payload produced
    // a symbol so dense that scanning it across a table was a fight, and the
    // scan is the one interaction this product is built around.
    const encoded = encodeTicket(ticketFor());
    expect(encoded.length).toBeLessThan(70);
    expect(encoded).toMatch(/^[A-Za-z0-9_.-]+$/);
    // And the URL a generic camera app would open stays modest too.
    expect(ticketUrl('https://dohhh.example', ticketFor()).length).toBeLessThan(120);
  });

  it('truncates the pack hash rather than carrying all 64 hex chars', () => {
    const ticket = ticketFor();
    expect(ticket.packHash).toHaveLength(16);
    expect(SEED_PACK_HASH.startsWith(ticket.packHash)).toBe(true);
  });

  it('rejects junk instead of throwing', () => {
    expect(decodeTicket('')).toBeNull();
    expect(decodeTicket('gibberish')).toBeNull();
    expect(decodeTicket(encodeTicket(ticketFor()).slice(0, 8))).toBeNull();
    expect(decodeTicket('dh1.notagame.otter.abcdef01')).toBeNull();
    expect(parseScanned('https://example.com/nothing-here')).toBeNull();
  });

  it('carries the protocol version only when it is not 1, the fixed no-suffix anchor', () => {
    // 1 is not "today's default" - it is the value decodeTicket assumes for
    // any ticket with no suffix, forever, regardless of where
    // PROTOCOL_VERSION moves. A same-version ticket today still gets an
    // explicit suffix once the real default has moved past 1.
    const legacy = { ...ticketFor(), protocol: 1 };
    expect(encodeTicket(legacy)).not.toContain('.p');
    expect(encodeTicket(ticketFor())).toContain(`.p${PROTOCOL_VERSION}`);
    const future = { ...ticketFor(), protocol: 7 };
    expect(encodeTicket(future)).toContain('.p7');
    expect(decodeTicket(encodeTicket(future))?.protocol).toBe(7);
  });

  it('rejects a ticket whose join code is not a real code', () => {
    const wire = encodeTicket({ ...ticketFor(), joinCode: 'zzz-zzz-zzz-zzz' });
    expect(decodeTicket(wire)).toBeNull();
  });
});

describe('scanning', () => {
  it('reads a ticket out of a URL, a fragment or a bare blob', () => {
    const ticket = ticketFor();
    const url = ticketUrl('https://dohhh.example/', ticket);
    expect(url).toContain('#/join?t=');
    expect(parseScanned(url)).toEqual(ticket);
    expect(parseScanned(encodeTicket(ticket))).toEqual(ticket);
    expect(parseScanned(`  ${url}  `)).toEqual(ticket);
  });

  it('keeps the ticket in the fragment, where no server can see it', () => {
    const url = ticketUrl('https://dohhh.example/some/path?utm=1#stale', ticketFor());
    expect(url.startsWith('https://dohhh.example/some/path/#/join?t=')).toBe(true);
    expect(url.indexOf('?t=')).toBeGreaterThan(url.indexOf('#'));
  });
});

describe('refusal at the door', () => {
  it('accepts a matching ticket', () => {
    expect(checkTicket(ticketFor(), { packHash: SEED_PACK_HASH })).toBeNull();
  });

  it('refuses a different content pack (R-11)', () => {
    const refusal = checkTicket(ticketFor(), { packHash: 'f'.repeat(64) });
    expect(refusal).toBe('pack-mismatch');
    expect(explainRefusal(refusal ?? 'pack-mismatch')).toMatch(/question pack/);
  });

  it('refuses a different wire protocol', () => {
    const refusal = checkTicket(ticketFor(), {
      packHash: SEED_PACK_HASH,
      protocol: PROTOCOL_VERSION + 1,
    });
    expect(refusal).toBe('protocol-mismatch');
    expect(explainRefusal(refusal ?? 'protocol-mismatch')).toMatch(/update/);
  });
});
