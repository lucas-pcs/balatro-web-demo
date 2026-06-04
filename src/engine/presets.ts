import type { Edition, Enhancement, HandKey, JokerInstance, PlayingCard, Rank, Seal, Suit } from '../data/types'

let uid = 0
const nid = () => `c${uid++}`

export function makeCard(
  rank: Rank, suit: Suit,
  opts: { edition?: Edition; seal?: Seal; enhancement?: Enhancement } = {},
): PlayingCard {
  return {
    id: nid(), rank, suit,
    edition: opts.edition ?? 'none',
    seal: opts.seal ?? 'none',
    enhancement: opts.enhancement ?? 'none',
  }
}

const j = (jokerId: string, opts: { edition?: Edition; param?: number } = {}): JokerInstance => ({
  uid: `j${uid++}`, jokerId, edition: opts.edition ?? 'none', param: opts.param,
})

export interface Preset {
  id: string
  name: string
  blurb: string
  handKey: HandKey
  handLevel: number
  playedCards: PlayingCard[]
  heldCards: PlayingCard[]
  jokers: JokerInstance[]
}

export const PRESETS: Preset[] = [
  {
    id: 'flush',
    name: 'Flush backbone (Lvl 8)',
    blurb: 'A leveled Flush with Crafty + Droll + The Tribe — the reliable A-tier vehicle.',
    handKey: 'flush',
    handLevel: 8,
    playedCards: [
      makeCard('A', 'Hearts'), makeCard('K', 'Hearts'), makeCard('10', 'Hearts'),
      makeCard('7', 'Hearts'), makeCard('4', 'Hearts'),
    ],
    heldCards: [],
    jokers: [j('craftyJoker'), j('drollJoker'), j('theTribe', { edition: 'polychrome' })],
  },
  {
    id: 'baron',
    name: 'Baron + Mime (Steel Kings ×3 copies)',
    blurb: 'Blueprint + Brainstorm both copy Baron; Mime doubles every held King. Hold 5 Steel Kings.',
    handKey: 'pair',
    handLevel: 5,
    playedCards: [makeCard('K', 'Spades'), makeCard('K', 'Hearts')],
    heldCards: [
      makeCard('K', 'Spades', { enhancement: 'steel' }),
      makeCard('K', 'Hearts', { enhancement: 'steel' }),
      makeCard('K', 'Clubs', { enhancement: 'steel' }),
      makeCard('K', 'Diamonds', { enhancement: 'steel' }),
      makeCard('K', 'Spades', { enhancement: 'steel', seal: 'red' }),
    ],
    // [blueprint, baron, mime, brainstorm]: blueprint→baron, brainstorm→blueprint→baron ⇒ 3× Baron.
    jokers: [j('blueprint'), j('baron'), j('mime'), j('brainstorm')],
  },
  {
    id: 'triboulet',
    name: 'Triboulet + Sock & Buskin (×3 copies)',
    blurb: 'Five scored Kings, each ×2, retriggered by Sock & Buskin, tripled by Blueprint + Brainstorm.',
    handKey: 'fiveOfAKind',
    handLevel: 3,
    playedCards: [
      makeCard('K', 'Spades'), makeCard('K', 'Hearts'), makeCard('K', 'Clubs'),
      makeCard('K', 'Diamonds'), makeCard('K', 'Spades'),
    ],
    heldCards: [],
    // [blueprint, triboulet, sockAndBuskin, brainstorm]: 3× Triboulet, faces retriggered.
    jokers: [j('blueprint'), j('triboulet'), j('sockAndBuskin'), j('brainstorm')],
  },
  {
    id: 'perkeo',
    name: 'Perkeo + Observatory (20 shops in)',
    blurb: 'A leveled Flush; Perkeo has minted 20 Negative Jupiters, so Observatory gives ×1.5²⁰ — the compounding infinite loop.',
    handKey: 'flush',
    handLevel: 12,
    playedCards: [
      makeCard('A', 'Spades'), makeCard('J', 'Spades'), makeCard('9', 'Spades'),
      makeCard('6', 'Spades'), makeCard('3', 'Spades'),
    ],
    heldCards: [],
    jokers: [j('craftyJoker'), j('drollJoker'), j('theTribe'), j('perkeo', { param: 20 })],
  },
]
