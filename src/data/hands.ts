import type { PokerHand } from './types'

// Base values + per-level planet increments.
// L1 base values verified via Switchblade Gaming; per-level increments are the
// widely-documented Balatro planet values (cross-checked against the Flush case:
// 35×4 at L1 → 95×12 at L5 ⇒ +15 chips / +2 mult per level). Final numbers are
// reconciled against research/strategy-corpus.md (balatrowiki.org).
export const HANDS: PokerHand[] = [
  { key: 'highCard',     name: 'High Card',      planet: 'Pluto',    baseChips: 5,   baseMult: 1,  chipsPerLevel: 10, multPerLevel: 1, source: 'balatrowiki.org' },
  { key: 'pair',         name: 'Pair',           planet: 'Mercury',  baseChips: 10,  baseMult: 2,  chipsPerLevel: 15, multPerLevel: 1, source: 'balatrowiki.org' },
  { key: 'twoPair',      name: 'Two Pair',       planet: 'Uranus',   baseChips: 20,  baseMult: 2,  chipsPerLevel: 20, multPerLevel: 1, source: 'balatrowiki.org' },
  { key: 'threeOfAKind', name: 'Three of a Kind',planet: 'Venus',    baseChips: 30,  baseMult: 3,  chipsPerLevel: 20, multPerLevel: 2, source: 'balatrowiki.org' },
  { key: 'straight',     name: 'Straight',       planet: 'Saturn',   baseChips: 30,  baseMult: 4,  chipsPerLevel: 30, multPerLevel: 3, source: 'balatrowiki.org' },
  { key: 'flush',        name: 'Flush',          planet: 'Jupiter',  baseChips: 35,  baseMult: 4,  chipsPerLevel: 15, multPerLevel: 2, source: 'Switchblade' },
  { key: 'fullHouse',    name: 'Full House',     planet: 'Earth',    baseChips: 40,  baseMult: 4,  chipsPerLevel: 25, multPerLevel: 2, source: 'balatrowiki.org' },
  { key: 'fourOfAKind',  name: 'Four of a Kind', planet: 'Mars',     baseChips: 60,  baseMult: 7,  chipsPerLevel: 30, multPerLevel: 3, source: 'Switchblade' },
  { key: 'straightFlush',name: 'Straight Flush', planet: 'Neptune',  baseChips: 100, baseMult: 8,  chipsPerLevel: 40, multPerLevel: 4, source: 'Switchblade' },
  { key: 'fiveOfAKind',  name: 'Five of a Kind', planet: 'Planet X',  baseChips: 120, baseMult: 12, chipsPerLevel: 35, multPerLevel: 3, source: 'balatrowiki.org' },
  { key: 'flushHouse',   name: 'Flush House',    planet: 'Ceres',    baseChips: 140, baseMult: 14, chipsPerLevel: 40, multPerLevel: 4, source: 'balatrowiki.org' },
  { key: 'flushFive',    name: 'Flush Five',     planet: 'Eris',     baseChips: 160, baseMult: 16, chipsPerLevel: 50, multPerLevel: 3, source: 'balatrowiki.org' },
]

export const HAND_BY_KEY: Record<string, PokerHand> = Object.fromEntries(
  HANDS.map((h) => [h.key, h]),
)

/** Hand chips & mult at a given planet level (level 1 = base). */
export function handAtLevel(key: string, level: number): { chips: number; mult: number } {
  const h = HAND_BY_KEY[key]
  const n = Math.max(1, level) - 1
  return { chips: h.baseChips + h.chipsPerLevel * n, mult: h.baseMult + h.multPerLevel * n }
}
