import type { AnteRequirement } from './types'

// White-Stake base ante requirements. Within an ante: Small = 1×, Big = 1.5×,
// Boss = 2× the ante base (some bosses override — see bosses.ts).
// Source: balatrowiki.org/w/Ante, cross-checked in research/strategy-corpus.md §3.
const ANTE_BASE: Record<number, number> = {
  1: 300, 2: 800, 3: 2000, 4: 5000, 5: 11000, 6: 20000, 7: 35000, 8: 50000,
}

export const ANTE_REQUIREMENTS: AnteRequirement[] = Object.entries(ANTE_BASE).map(
  ([ante, base]) => ({
    ante: Number(ante),
    small: base,
    big: Math.round(base * 1.5),
    boss: base * 2,
  }),
)

// Endless requirement checkpoints (the values the game actually checks).
// Source: balatrowiki.org §3; growth runs ~×5/ante early-endless toward ×10–×100+.
// Ante 39 (~4.8e309) overflows double precision → "naneinf" = the hard endless cap.
export const ENDLESS_REQUIREMENTS: { ante: number; required: number }[] = [
  { ante: 8, required: 50000 },
  { ante: 9, required: 110000 },
  { ante: 10, required: 560000 },
  { ante: 12, required: 3.0e8 },
  { ante: 16, required: 8.6e20 },
  { ante: 20, required: 4.3e43 },
  { ante: 30, required: 2.1e149 },
  // True value ~4.8e309 overflows the 64-bit float ceiling to Infinity ("naneinf").
  // Stored at the float max (~1.8e308) so the log chart can plot the cap point.
  { ante: 39, required: 1.8e308 },
]

export const ANTE_39_NOTE =
  'Ante 39 (~4.8×10³⁰⁹) exceeds the 64-bit float ceiling (~1.8×10³⁰⁸) and overflows to "naneinf" — the practical hard cap of endless mode. Reaching Ante 39 is the community "infinite" win.'
