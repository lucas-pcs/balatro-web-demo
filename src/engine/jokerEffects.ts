import type { PlayingCard, Rank, ScoreInput } from '../data/types'
import type { EffectCtx, EffectOut } from './score'

const isFace = (r: Rank) => r === 'J' || r === 'Q' || r === 'K'
const isEven = (r: Rank) => ['2', '4', '6', '8', '10'].includes(r)
const isOdd = (r: Rank) => ['A', '3', '5', '7', '9'].includes(r)
const countPlayed = (ctx: EffectCtx, pred: (c: PlayingCard) => boolean) => ctx.played.filter(pred).length
const heldKings = (input: ScoreInput) => input.heldCards.filter((c) => c.rank === 'K')

// Hand "contains" helpers (simplified: the chosen hand type implies the contained shape)
const handHasPair = (k: string) => ['pair', 'twoPair', 'threeOfAKind', 'fullHouse', 'fourOfAKind', 'fiveOfAKind', 'flushHouse', 'flushFive'].includes(k)
const handHasTwoPair = (k: string) => ['twoPair', 'fullHouse', 'flushHouse'].includes(k)
const handHasThree = (k: string) => ['threeOfAKind', 'fullHouse', 'fourOfAKind', 'fiveOfAKind', 'flushHouse', 'flushFive'].includes(k)
const handHasFour = (k: string) => ['fourOfAKind', 'fiveOfAKind'].includes(k)
const handIsFlush = (k: string) => ['flush', 'straightFlush', 'flushHouse', 'flushFive'].includes(k)
const handIsStraight = (k: string) => ['straight', 'straightFlush'].includes(k)

export interface JokerEffect {
  name: string
  /** Slot effect applied at the joker's board position. */
  slot?: (ctx: EffectCtx, input: ScoreInput) => EffectOut
  /** Extra triggers added to a played card. */
  retriggerPlayed?: (card: PlayingCard, index: number, input: ScoreInput) => number
  /** Extra triggers added to a held card. */
  retriggerHeld?: (card: PlayingCard, input: ScoreInput) => number
}

// param() pulls the user-set accumulated value for scaling jokers.
const paramFor = (input: ScoreInput, jokerId: string, fallback = 0) =>
  input.jokers.find((j) => j.jokerId === jokerId)?.param ?? fallback

export const JOKER_EFFECTS: Record<string, JokerEffect> = {
  // ── Flat / conditional +mult ──
  joker: { name: 'Joker', slot: () => ({ addMult: 4 }) },
  jollyJoker: { name: 'Jolly Joker', slot: (c) => ({ addMult: handHasPair(c.handKey) ? 8 : 0 }) },
  zanyJoker: { name: 'Zany Joker', slot: (c) => ({ addMult: handHasThree(c.handKey) ? 12 : 0 }) },
  madJoker: { name: 'Mad Joker', slot: (c) => ({ addMult: handHasTwoPair(c.handKey) ? 10 : 0 }) },
  crazyJoker: { name: 'Crazy Joker', slot: (c) => ({ addMult: handIsStraight(c.handKey) ? 12 : 0 }) },
  drollJoker: { name: 'Droll Joker', slot: (c) => ({ addMult: handIsFlush(c.handKey) ? 10 : 0 }) },
  evenSteven: { name: 'Even Steven', slot: (c) => ({ addMult: 4 * countPlayed(c, (x) => isEven(x.rank)) }) },

  // ── Conditional +chips ──
  slyJoker: { name: 'Sly Joker', slot: (c) => ({ addChips: handHasPair(c.handKey) ? 50 : 0 }) },
  wilyJoker: { name: 'Wily Joker', slot: (c) => ({ addChips: handHasThree(c.handKey) ? 100 : 0 }) },
  cleverJoker: { name: 'Clever Joker', slot: (c) => ({ addChips: handHasTwoPair(c.handKey) ? 80 : 0 }) },
  deviousJoker: { name: 'Devious Joker', slot: (c) => ({ addChips: handIsStraight(c.handKey) ? 100 : 0 }) },
  craftyJoker: { name: 'Crafty Joker', slot: (c) => ({ addChips: handIsFlush(c.handKey) ? 80 : 0 }) },
  oddTodd: { name: 'Odd Todd', slot: (c) => ({ addChips: 31 * countPlayed(c, (x) => isOdd(x.rank)) }) },
  bull: { name: 'Bull', slot: (_c, input) => ({ addChips: 2 * paramFor(input, 'bull'), note: '+2 chips per $' }) },

  // ── Scaling +mult (user sets accumulated value via param) ──
  greenJoker: { name: 'Green Joker', slot: (_c, input) => ({ addMult: paramFor(input, 'greenJoker'), note: 'accumulated +mult' }) },
  rideTheBus: { name: 'Ride the Bus', slot: (_c, input) => ({ addMult: paramFor(input, 'rideTheBus'), note: 'accumulated +mult' }) },
  supernova: { name: 'Supernova', slot: (_c, input) => ({ addMult: paramFor(input, 'supernova'), note: '+mult = times hand played' }) },
  fibonacci: { name: 'Fibonacci', slot: (c) => ({ addMult: 8 * countPlayed(c, (x) => ['A', '2', '3', '5', '8'].includes(x.rank)) }) },

  // ── ×Mult ──
  theDuo: { name: 'The Duo', slot: (c) => ({ xMult: handHasPair(c.handKey) ? 2 : 1 }) },
  theTrio: { name: 'The Trio', slot: (c) => ({ xMult: handHasThree(c.handKey) ? 3 : 1 }) },
  theFamily: { name: 'The Family', slot: (c) => ({ xMult: handHasFour(c.handKey) ? 4 : 1 }) },
  theOrder: { name: 'The Order', slot: (c) => ({ xMult: handIsStraight(c.handKey) ? 3 : 1 }) },
  theTribe: { name: 'The Tribe', slot: (c) => ({ xMult: handIsFlush(c.handKey) ? 2 : 1 }) },
  cavendish: { name: 'Cavendish', slot: () => ({ xMult: 3 }) },
  photograph: { name: 'Photograph', slot: (c) => ({ xMult: ctxHasFace(c) ? 2 : 1, note: 'first face card ×2' }) },
  hologram: { name: 'Hologram', slot: (_c, input) => ({ xMult: 1 + 0.25 * paramFor(input, 'hologram'), note: '×(1 + 0.25 × cards added)' }) },
  glassJoker: { name: 'Glass Joker', slot: (_c, input) => ({ xMult: 1 + 0.75 * paramFor(input, 'glassJoker'), note: '×(1 + 0.75 × glass destroyed)' }) },
  baseballCard: { name: 'Baseball Card', slot: (_c, input) => ({ xMult: Math.pow(1.5, paramFor(input, 'baseballCard')), note: '×1.5 per Uncommon joker' }) },
  constellation: { name: 'Constellation', slot: (_c, input) => ({ xMult: 1 + 0.1 * paramFor(input, 'constellation'), note: '×0.1 per Planet card used' }) },
  steelJoker: { name: 'Steel Joker', slot: (_c, input) => ({ xMult: 1 + 0.2 * paramFor(input, 'steelJoker'), note: '×0.2 per Steel card in deck' }) },
  luckyCat: { name: 'Lucky Cat', slot: (_c, input) => ({ xMult: 1 + 0.25 * paramFor(input, 'luckyCat'), note: '×0.25 per Lucky trigger' }) },
  vampire: { name: 'Vampire', slot: (_c, input) => ({ xMult: 1 + 0.1 * paramFor(input, 'vampire'), note: '×0.1 per enhanced card scored' }) },
  obelisk: { name: 'Obelisk', slot: (_c, input) => ({ xMult: 1 + 0.2 * paramFor(input, 'obelisk'), note: '×0.2 per non-most-played hand' }) },
  campfire: { name: 'Campfire', slot: (_c, input) => ({ xMult: 1 + 0.25 * paramFor(input, 'campfire'), note: '×0.25 per card sold' }) },

  // ── Held-in-hand engines ──
  baron: {
    name: 'Baron',
    slot: (ctx, input) => {
      // Each held King = ×1.5; Mime-type held retriggers make each King count again.
      let exp = 0
      for (const c of heldKings(input)) exp += 1 + ctx.heldRetriggersFor(c)
      return { xMult: Math.pow(1.5, exp), note: `×1.5 per King held (${exp} effective)` }
    },
  },
  mime: { name: 'Mime', retriggerHeld: () => 1 },

  // ── Retrigger (played) ──
  sockAndBuskin: { name: 'Sock and Buskin', retriggerPlayed: (card) => (isFace(card.rank) ? 1 : 0) },
  hangingChad: { name: 'Hanging Chad', retriggerPlayed: (_card, index) => (index === 0 ? 2 : 0) },
  hack: { name: 'Hack', retriggerPlayed: (card) => (['2', '3', '4', '5'].includes(card.rank) ? 1 : 0) },
  seltzer: { name: 'Seltzer', retriggerPlayed: () => 1 },
  dusk: { name: 'Dusk', retriggerPlayed: () => 1 },

  // ── Legendary ──
  triboulet: {
    name: 'Triboulet',
    // ×2 per King/Queen scored; retriggers (Sock & Buskin, Hanging Chad) make each fire again.
    slot: (ctx) => {
      let exp = 0
      ctx.played.forEach((card, i) => {
        if (card.rank === 'K' || card.rank === 'Q') exp += 1 + ctx.retriggersFor(card, i)
      })
      return { xMult: Math.pow(2, exp), note: `×2 per King/Queen scored (${exp} effective)` }
    },
  },
  canio: { name: 'Canio', slot: (_c, input) => ({ xMult: paramFor(input, 'canio', 1), note: '×mult grows when a face card is destroyed' }) },
  perkeo: { name: 'Perkeo', slot: (_c, input) => ({ xMult: Math.pow(1.5, paramFor(input, 'perkeo')), note: 'with Observatory: ×1.5 per held Planet copy (grows each shop)' }) },
  yorick: { name: 'Yorick', slot: (_c, input) => ({ xMult: paramFor(input, 'yorick', 1), note: '×mult grows per cards discarded' }) },
  chicot: { name: 'Chicot', slot: () => ({ note: 'disables boss blind effect' }) },

  // ── Copy (handled by the engine resolver; identity here) ──
  blueprint: { name: 'Blueprint' },
  brainstorm: { name: 'Brainstorm' },

  // ── Economy / utility (no score effect) ──
  goldenJoker: { name: 'Golden Joker', slot: () => ({ note: '+$4 each round' }) },
  rocket: { name: 'Rocket', slot: () => ({ note: '+$ each round, grows on boss defeat' }) },
}

// Photograph: scores when at least one face card is played (first face → ×2).
function ctxHasFace(ctx: EffectCtx): boolean {
  return ctx.played.some((c) => isFace(c.rank))
}
