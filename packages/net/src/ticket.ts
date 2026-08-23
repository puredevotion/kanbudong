import { normalizeJoinCode, PROTOCOL_VERSION, type GameId } from '@kanbudong/engine';

/**
 * What a QR code actually contains.
 *
 * The first version of this was base64'd JSON with the host id and the game
 * name in it: about 250 characters, which produced a QR symbol so dense that
 * scanning it across a table was a struggle. A code nobody can scan defeats the
 * one interaction the whole product is built around, so the format is now a
 * pipe-free, URL-safe, dot-delimited token of about sixty characters:
 *
 *     dh1.game_abcdefghij.amber-otter-glass-tide.ca4131af381d9cd0
 *
 * Everything dropped from it (host id, game name) is discoverable from the peers
 * once connected. Everything kept is needed *before* connecting: the game to
 * join, the room to join it in, and the two facts that decide whether joining
 * is even sensible.
 */
export interface JoinTicket {
  /** Ticket format version, independent of the wire protocol version. */
  readonly v: number;
  readonly gameId: GameId;
  readonly joinCode: string;
  /** First 16 hex chars of the content-pack hash: 64 bits, plenty to spot a mismatch. */
  readonly packHash: string;
  /** Wire protocol version the host is speaking. */
  readonly protocol: number;
}

export const TICKET_VERSION = 1;
export const PACK_HASH_PREFIX_LENGTH = 16;
const PREFIX = 'dh';
const SEPARATOR = '.';

export function buildTicket(input: {
  readonly gameId: GameId;
  readonly joinCode: string;
  readonly packHash: string;
}): JoinTicket {
  return {
    v: TICKET_VERSION,
    gameId: input.gameId,
    joinCode: input.joinCode,
    packHash: input.packHash.slice(0, PACK_HASH_PREFIX_LENGTH),
    protocol: PROTOCOL_VERSION,
  };
}

export function encodeTicket(ticket: JoinTicket): string {
  return [
    `${PREFIX}${ticket.v}`,
    ticket.gameId,
    ticket.joinCode,
    ticket.packHash,
    // The protocol version is only appended when it is not 1 - a fixed
    // historical anchor, not "today's default": decodeTicket below reads a
    // missing suffix as literally 1, so this comparison has to stay pinned
    // to 1 forever regardless of where PROTOCOL_VERSION moves, or an old
    // ticket with no suffix (from back when 1 really was current) would
    // silently decode as whatever the new default is instead.
    ...(ticket.protocol === 1 ? [] : [`p${ticket.protocol}`]),
  ].join(SEPARATOR);
}

export function decodeTicket(encoded: string): JoinTicket | null {
  const parts = encoded.trim().split(SEPARATOR);
  const [tag, gameId, rawCode, packHash, protocolPart] = parts;
  if (tag === undefined || !tag.startsWith(PREFIX)) return null;

  const version = Number.parseInt(tag.slice(PREFIX.length), 10);
  if (!Number.isInteger(version) || version < 1) return null;
  if (gameId === undefined || !gameId.startsWith('game_')) return null;
  if (rawCode === undefined) return null;
  const joinCode = normalizeJoinCode(rawCode);
  if (joinCode === null) return null;
  if (packHash === undefined || !/^[0-9a-f]{8,64}$/.test(packHash)) return null;

  let protocol = 1;
  if (protocolPart !== undefined) {
    if (!protocolPart.startsWith('p')) return null;
    protocol = Number.parseInt(protocolPart.slice(1), 10);
    if (!Number.isInteger(protocol) || protocol < 1) return null;
  }

  return { v: version, gameId, joinCode, packHash, protocol };
}

/**
 * The QR encodes a URL, not a bare token, so a phone with nothing installed
 * still lands somewhere useful. The ticket rides in the fragment, which never
 * reaches a server even when one is serving the page.
 */
export function ticketUrl(origin: string, ticket: JoinTicket): string {
  const base = origin.replace(/[#?].*$/, '').replace(/\/+$/, '');
  return `${base}/#/join?t=${encodeTicket(ticket)}`;
}

/** Accepts a bare token, a full URL, or anything with `t=` in it. */
export function parseScanned(input: string): JoinTicket | null {
  const text = input.trim();
  const direct = decodeTicket(text);
  if (direct !== null) return direct;
  const match = /[?&#]t=([A-Za-z0-9_.-]+)/.exec(text);
  if (match?.[1] !== undefined) return decodeTicket(match[1]);
  return null;
}

/**
 * The refusal-at-the-door vocabulary: a closed set of reasons a *join
 * attempt itself* never gets to happen, paired with {@link explainRefusal}
 * to turn a code into a sentence. This is the sibling of `explainRejection`
 * (packages/engine/src/events.ts) for the other half of the codebase's
 * error surface - that one explains why an *already-connected* peer's
 * event got refused; this one explains why a peer never got in at all.
 * Two shapes, not one, because they answer different questions - see the
 * comment above `explainRejection` for why forcing them into a single
 * shape would cost more than it buys.
 */
export type TicketRefusal = 'protocol-mismatch' | 'pack-mismatch';

/**
 * Check a scanned ticket before joining, so an incompatibility is a readable
 * message at the door rather than a desync on turn nine (R-11).
 *
 * `local.protocol` defaults to this build's real `PROTOCOL_VERSION` - every
 * production call site relies on that default. It stays overridable so a
 * test can simulate "our own build is running a different protocol version"
 * without needing two actual builds to do it.
 */
export function checkTicket(
  ticket: { readonly protocol: number; readonly packHash: string },
  local: { readonly packHash: string; readonly protocol?: number },
): TicketRefusal | null {
  if (ticket.protocol !== (local.protocol ?? PROTOCOL_VERSION)) return 'protocol-mismatch';
  if (!local.packHash.startsWith(ticket.packHash)) return 'pack-mismatch';
  return null;
}

export function explainRefusal(refusal: TicketRefusal): string {
  return refusal === 'protocol-mismatch'
    ? 'That game is running a different version of Dohhh. One of you needs to update before you can play.'
    : 'That game is using a different question pack, so you would be asked different questions. Match packs first.';
}
