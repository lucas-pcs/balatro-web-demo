// ── Shared domain contracts ───────────────────────────────────────────────
// One source of truth for the data layer, the scoring engine, and the UI.
// Numbers that fill these structures must trace to a source (see `source`
// fields and research/strategy-corpus.md).

export type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'
export type Rank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A'

export type Edition = 'none' | 'foil' | 'holographic' | 'polychrome' | 'negative'
export type Seal = 'none' | 'red' | 'blue' | 'gold' | 'purple'
export type Enhancement =
  | 'none' | 'bonus' | 'mult' | 'wild' | 'glass' | 'steel'
  | 'stone' | 'gold' | 'lucky'

export interface PlayingCard {
  id: string
  rank: Rank
  suit: Suit
  edition: Edition
  seal: Seal
  enhancement: Enhancement
}

export type HandKey =
  | 'highCard' | 'pair' | 'twoPair' | 'threeOfAKind' | 'straight'
  | 'flush' | 'fullHouse' | 'fourOfAKind' | 'straightFlush'
  | 'fiveOfAKind' | 'flushHouse' | 'flushFive'

export interface PokerHand {
  key: HandKey
  name: string
  /** Planet card that levels this hand. */
  planet: string
  baseChips: number
  baseMult: number
  /** Per-level increments applied by the planet card. */
  chipsPerLevel: number
  multPerLevel: number
  source: string
}

export type JokerRole =
  | 'chips' | 'addMult' | 'scalingAddMult' | 'xMult'
  | 'retrigger' | 'copy' | 'economy' | 'utility' | 'legendary'

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary'

export interface Joker {
  id: string
  name: string
  role: JokerRole
  rarity: Rarity
  cost: number
  /** Short human-readable effect text. */
  effect: string
  /** Why it matters for infinite scaling. */
  scalingNote: string
  source: string
}

/** A joker placed on the board, with order = scoring order (left→right). */
export interface JokerInstance {
  uid: string
  jokerId: string
  edition: Edition
  /** Accumulated value for scaling jokers (e.g. Green Joker mult, Hologram stacks). */
  param?: number
}

// ── Scoring engine I/O ─────────────────────────────────────────────────────

export interface ScoreInput {
  handKey: HandKey
  handLevel: number
  playedCards: PlayingCard[]
  /** Cards held in hand (matter for Baron/Mime-style engines). */
  heldCards: PlayingCard[]
  jokers: JokerInstance[]
}

export interface ScoreStep {
  label: string
  chips: number
  mult: number
  note?: string
}

export interface ScoreResult {
  chips: number
  mult: number
  total: number
  steps: ScoreStep[]
}

// ── Strategy content ───────────────────────────────────────────────────────

export type Tier = 'S' | 'A' | 'B'

export interface ArchetypeRating {
  ceiling: number       // 1–5
  consistency: number   // 1–5
  setupSpeed: number    // 1–5 (5 = comes online fast)
  fragility: number     // 1–5 (5 = very fragile)
}

export interface Archetype {
  id: string
  name: string
  tier: Tier
  coreJokers: string[]
  summary: string
  rating: ArchetypeRating
  pros: string[]
  cons: string[]
  /** Where the (near-)infinite growth comes from. */
  engine: string
  diagram?: string      // path under /diagrams
  source: string
}

export interface AnteStep {
  ante: number
  label: string         // e.g. "Ante 1–2 (setup)"
  goal: string
  buy: string[]
  play: string
  reroll: string
}

export interface AnteRoute {
  archetypeId: string
  steps: AnteStep[]
}

export interface AnteRequirement {
  ante: number
  small: number
  big: number
  boss: number
}

export interface BossBlind {
  name: string
  debuff: string
  threatensEngines: string[]
  counterplay: string
  source: string
}
