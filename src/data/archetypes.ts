import type { Archetype } from './types'

// Ratings 1–5. Source: research/strategy-corpus.md §6 (synthesis of Switchblade,
// GAMES.GG, twoaveragegamers, propelrc tier lists + the scaling math).
export const ARCHETYPES: Archetype[] = [
  {
    id: 'perkeo-observatory',
    name: 'Perkeo + Observatory + Telescope',
    tier: 'S',
    coreJokers: ['perkeo', 'blueprint'],
    summary:
      'Perkeo mints a Negative copy of a held Planet card every shop; Observatory makes each held Planet give ×1.5 Mult to your hand. The multiplier compounds ×1.5 per shop, forever, at zero slot cost.',
    rating: { ceiling: 5, consistency: 4, setupSpeed: 2, fragility: 1 },
    pros: [
      'Genuinely infinite: ×1.5 per shop compounding outruns the ante curve to Ante 39',
      'Negative copies cost no joker/consumable slots',
      'Low fragility — Chicot/Luchador covers bosses; nothing strips held Planets',
    ],
    cons: [
      'Slow to assemble — needs a Legendary (Perkeo) + two vouchers',
      'Relies on consistently leveling one hand alongside the loop',
    ],
    engine: 'Super-exponential (×1.5^n where n = Planet copies, n grows every shop).',
    diagram: 'diagrams/perkeo-observatory.svg',
    source: 'strategy-corpus.md §5.4, §6',
  },
  {
    id: 'baron-mime',
    name: 'Baron + Mime (Steel Kings)',
    tier: 'S',
    coreJokers: ['baron', 'mime', 'blueprint', 'brainstorm'],
    summary:
      'Each King held = ×1.5; Mime retriggers held effects so every King counts twice (×2.25 each). Blueprint + Brainstorm copy Baron and Steel Kings add more ×1.5 — a full hand of Steel Kings multiplies by ×1.5 to a double-digit exponent.',
    rating: { ceiling: 5, consistency: 4, setupSpeed: 3, fragility: 3 },
    pros: [
      'Exponential in Kings held (×1.5^k), enormous single-hand burst',
      'Small/thinned deck draws Kings reliably',
      'Holds do the work — the played hand barely needs to be strong',
    ],
    cons: [
      'Per-hand static — needs hand-leveling to stay endless',
      'Hurt by hand-size bosses (The Manacle) and face-debuff bosses (Verdant Leaf)',
    ],
    engine: 'Exponential (×1.5^(effective Kings held), doubled by Mime + copies).',
    diagram: 'diagrams/baron-mime.svg',
    source: 'strategy-corpus.md §5.1, §6',
  },
  {
    id: 'triboulet-sock',
    name: 'Triboulet + Sock & Buskin',
    tier: 'S',
    coreJokers: ['triboulet', 'sockAndBuskin', 'blueprint', 'brainstorm'],
    summary:
      'Triboulet gives ×2 per King/Queen scored; Sock & Buskin retriggers faces so each K/Q is ×4. Five scored K/Q = ×4⁵ = ×1024 before copies. Pareidolia turns every card into a face.',
    rating: { ceiling: 5, consistency: 4, setupSpeed: 2, fragility: 4 },
    pros: [
      'Highest visible single-hand ceiling (the "screenshot" build)',
      'Exponential in (scored K/Q) × (copies) × (retriggers)',
    ],
    cons: [
      'Needs a Legendary (Triboulet) and a face-heavy deck',
      'Face-debuff bosses (The Plant, The Mark) turn it off without Chicot',
    ],
    engine: 'Exponential (×2^(faces) compounded by retriggers and copies).',
    diagram: 'diagrams/triboulet-sock.svg',
    source: 'strategy-corpus.md §5.2, §6',
  },
  {
    id: 'flush-backbone',
    name: 'Flush / Secret-Flush leveling',
    tier: 'A',
    coreJokers: ['craftyJoker', 'drollJoker', 'theTribe'],
    summary:
      'Telescope on Flush, spam Jupiter to level it, support with Crafty/Droll/Tribe. A reliable chip+mult vehicle and the backbone any S engine is built on top of.',
    rating: { ceiling: 3, consistency: 5, setupSpeed: 4, fragility: 2 },
    pros: ['Extremely consistent', 'Comes online fast', 'Foundation for Perkeo/Baron leveling'],
    cons: ['Caps out in mid-endless without an S-tier multiplicative core'],
    engine: 'Linear-to-polynomial (hand level + flat/×Mult support).',
    diagram: 'diagrams/flush-backbone.svg',
    source: 'strategy-corpus.md §6',
  },
  {
    id: 'hologram-constellation',
    name: 'Hologram + Constellation (polynomial)',
    tier: 'A',
    coreJokers: ['hologram', 'blueprint'],
    summary:
      'Hologram gains ×0.25 per card added to deck; Constellation gains ×0.1 per Planet used. Run a deck-adding + planet-using shell and multiply the two, copied by Blueprint.',
    rating: { ceiling: 4, consistency: 4, setupSpeed: 3, fragility: 2 },
    pros: ['Strong polynomial ×Mult', 'Copy-friendly', 'No Legendary required'],
    cons: ['Needs a deck-add + planet shell to climb', 'Slower than the S engines deep in endless'],
    engine: 'Polynomial-in-rounds ×Mult (Hologram × Constellation).',
    diagram: 'diagrams/hologram-constellation.svg',
    source: 'strategy-corpus.md §5.5, §6',
  },
  {
    id: 'additive-ramp',
    name: 'Supernova / Ride the Bus / Green Joker ramp',
    tier: 'B',
    coreJokers: ['supernova', 'rideTheBus', 'greenJoker'],
    summary:
      'Linear additive-mult scalers. Great early scaffolding that clears Ante 8, but additive growth falls off hard against the exponential ante curve — upgrade out of it into an S engine.',
    rating: { ceiling: 2, consistency: 4, setupSpeed: 5, fragility: 2 },
    pros: ['Cheap and fast', 'Reliable through Ante 8'],
    cons: ['Linear — stalls in mid-endless', 'Must be replaced by a multiplicative core'],
    engine: 'Linear (additive +Mult per action).',
    diagram: 'diagrams/scaling-shapes.svg',
    source: 'strategy-corpus.md §6',
  },
]
