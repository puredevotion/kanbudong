import { ed25519 } from '@noble/curves/ed25519.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';

import { sha256Bytes, toBase32 } from './canonical.js';
import type { Player, PlayerId } from './types.js';

/**
 * There is no account server, so identity is a keypair the device generates and
 * never sends anywhere. The player id is a hash of the public key, which makes
 * it self-certifying: any peer can check that a signature, a public key and an
 * id belong together without ever having been told so by an authority.
 */
export interface Identity {
  readonly id: PlayerId;
  readonly username: string;
  readonly publicKey: string;
  /** Hex Ed25519 secret key. Never leaves the device; never enters an event. */
  readonly secretKey: string;
}

/** Serialisable identity minus the secret - safe to log, ship or display. */
export type PublicIdentity = Player;

export const PLAYER_ID_PREFIX = 'dh_';
const PLAYER_ID_BODY_LENGTH = 12;

export function playerIdFromPublicKey(publicKey: string | Uint8Array): PlayerId {
  const bytes = typeof publicKey === 'string' ? hexToBytes(publicKey) : publicKey;
  return PLAYER_ID_PREFIX + toBase32(sha256Bytes(bytes)).slice(0, PLAYER_ID_BODY_LENGTH);
}

export function createIdentity(username: string, secretKeyHex?: string): Identity {
  const secretKey = secretKeyHex ? hexToBytes(secretKeyHex) : ed25519.utils.randomSecretKey();
  const publicKey = ed25519.getPublicKey(secretKey);
  return {
    id: playerIdFromPublicKey(publicKey),
    username: normalizeUsername(username),
    publicKey: bytesToHex(publicKey),
    secretKey: bytesToHex(secretKey),
  };
}

export function withUsername(identity: Identity, username: string): Identity {
  return { ...identity, username: normalizeUsername(username) };
}

export function toPublicIdentity(identity: Identity): PublicIdentity {
  return { id: identity.id, username: identity.username, publicKey: identity.publicKey };
}

export function sign(message: string, secretKeyHex: string): string {
  return bytesToHex(ed25519.sign(utf8ToBytes(message), hexToBytes(secretKeyHex)));
}

export function verify(signatureHex: string, message: string, publicKeyHex: string): boolean {
  try {
    return ed25519.verify(hexToBytes(signatureHex), utf8ToBytes(message), hexToBytes(publicKeyHex));
  } catch {
    // Malformed hex, wrong length, non-canonical point: all of these mean "not
    // a valid signature", and none of them is worth crashing a game loop over.
    return false;
  }
}

/**
 * Characters whose entire purpose is to change how surrounding text is
 * *displayed* rather than add anything to read: zero-width joiners/
 * non-joiners, bidi embedding/override/isolate controls, and the rest of
 * Unicode's Cf ("format") category, plus raw control characters (Cc). None
 * of these have any legitimate role in a display name, and left in they can
 * make one name render as another - a right-to-left override can flip which
 * end of a name reads first, which is exactly the kind of thing worth
 * stripping at the one point every username passes through rather than
 * trusting every renderer downstream to handle it safely.
 */
const FORMAT_AND_CONTROL_CHARS = /[\p{Cf}\p{Cc}]/gu;

/**
 * Usernames are decoration - the id is the identity (R-17) - so this only has
 * to stop layout-breaking or visually-deceptive input, not enforce
 * uniqueness. NFKC first so visually-identical variants (full-width Latin,
 * ligatures, other compatibility forms) collapse to one canonical form
 * before anything else runs.
 */
export function normalizeUsername(raw: string): string {
  const trimmed = raw
    .normalize('NFKC')
    .replace(FORMAT_AND_CONTROL_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (trimmed.length === 0) return 'Anonymous';
  return trimmed.slice(0, 24);
}

/**
 * A curated, intentionally partial set of the most common Latin-lookalike
 * letters in Cyrillic and Greek - not the full multi-thousand-entry Unicode
 * Confusables table (UTR #39), which this codebase has no dependency on and
 * isn't taking on for this. This covers the realistic threat at a game
 * table: someone typing a name that *reads* identical to another player's
 * but is a different string underneath (different code points, so a
 * different-looking id would be the only tell) - not a defense against a
 * determined, exhaustive spoofing attempt.
 */
const CONFUSABLE_TO_LATIN: Readonly<Record<string, string>> = {
  // Cyrillic
  а: 'a', А: 'a', е: 'e', Е: 'e', ё: 'e', о: 'o', О: 'o', р: 'p', Р: 'p',
  с: 'c', С: 'c', х: 'x', Х: 'x', у: 'y', У: 'y', і: 'i', І: 'i', ј: 'j',
  ѕ: 's', Ѕ: 's', В: 'b', Н: 'h', К: 'k', М: 'm', Т: 't', Ѵ: 'v',
  // Greek
  Α: 'a', α: 'a', Β: 'b', Ε: 'e', ε: 'e', Ζ: 'z', Η: 'h', η: 'n', Ι: 'i',
  ι: 'i', Κ: 'k', κ: 'k', Μ: 'm', μ: 'u', Ν: 'n', Ο: 'o', ο: 'o', Ρ: 'p',
  ρ: 'p', Τ: 't', τ: 't', Υ: 'y', υ: 'u', Χ: 'x', χ: 'x', ν: 'v',
};

/**
 * Collapses a name to the form used only for confusable comparison - never
 * for display, storage, or identity. Lowercased and stripped of spaces on
 * top of the lookalike substitution, since "Al Ex" and "Alex" read the same
 * at a glance too.
 */
export function confusableSkeleton(username: string): string {
  let out = '';
  for (const char of username.toLowerCase()) {
    out += CONFUSABLE_TO_LATIN[char] ?? char;
  }
  return out.replace(/\s+/g, '');
}

/** True when two *different* names would look the same at a glance. */
export function usernamesConfusable(a: string, b: string): boolean {
  if (a === b) return false;
  return confusableSkeleton(a) === confusableSkeleton(b);
}
