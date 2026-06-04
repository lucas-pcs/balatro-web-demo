import type { Joker } from './types'

// Curated competitive joker reference. `id` matches engine effects in
// src/engine/jokerEffects.ts. Values from research/strategy-corpus.md §4
// (efhiii/balatro-calculator cards.js + balatrowiki.org). `scaling: true`
// jokers grow over a run — the simulator lets you set their current value.
export interface JokerMeta extends Joker { scaling?: boolean; paramLabel?: string }

export const JOKERS: JokerMeta[] = [
  // chips / additive mult (left side)
  { id: 'joker', name: 'Joker', role: 'addMult', rarity: 'Common', cost: 2, effect: '+4 Mult', scalingNote: 'Baseline flat mult; filler early.', source: 'cards.js' },
  { id: 'jollyJoker', name: 'Jolly Joker', role: 'addMult', rarity: 'Common', cost: 3, effect: '+8 Mult if hand has a Pair', scalingNote: 'Cheap conditional mult.', source: 'cards.js' },
  { id: 'zanyJoker', name: 'Zany Joker', role: 'addMult', rarity: 'Common', cost: 4, effect: '+12 Mult if Three of a Kind', scalingNote: 'Conditional mult for set builds.', source: 'cards.js' },
  { id: 'madJoker', name: 'Mad Joker', role: 'addMult', rarity: 'Common', cost: 4, effect: '+10 Mult if Two Pair', scalingNote: 'Two-pair vehicle support.', source: 'cards.js' },
  { id: 'crazyJoker', name: 'Crazy Joker', role: 'addMult', rarity: 'Common', cost: 4, effect: '+12 Mult if Straight', scalingNote: 'Straight support.', source: 'cards.js' },
  { id: 'drollJoker', name: 'Droll Joker', role: 'addMult', rarity: 'Common', cost: 4, effect: '+10 Mult if Flush', scalingNote: 'Core of the Flush backbone.', source: 'cards.js' },
  { id: 'evenSteven', name: 'Even Steven', role: 'addMult', rarity: 'Common', cost: 4, effect: '+4 Mult per even card played', scalingNote: 'Scales with even-heavy hands.', source: 'cards.js' },
  { id: 'fibonacci', name: 'Fibonacci', role: 'addMult', rarity: 'Uncommon', cost: 8, effect: '+8 Mult per played A/2/3/5/8', scalingNote: 'Big additive on tuned decks.', source: 'cards.js' },
  { id: 'slyJoker', name: 'Sly Joker', role: 'chips', rarity: 'Common', cost: 3, effect: '+50 Chips if hand has a Pair', scalingNote: 'Early chip pad.', source: 'cards.js' },
  { id: 'wilyJoker', name: 'Wily Joker', role: 'chips', rarity: 'Common', cost: 4, effect: '+100 Chips if Three of a Kind', scalingNote: 'Chip pad for set builds.', source: 'cards.js' },
  { id: 'cleverJoker', name: 'Clever Joker', role: 'chips', rarity: 'Common', cost: 4, effect: '+80 Chips if Two Pair', scalingNote: 'Two-pair chips.', source: 'cards.js' },
  { id: 'deviousJoker', name: 'Devious Joker', role: 'chips', rarity: 'Common', cost: 4, effect: '+100 Chips if Straight', scalingNote: 'Straight chips.', source: 'cards.js' },
  { id: 'craftyJoker', name: 'Crafty Joker', role: 'chips', rarity: 'Common', cost: 4, effect: '+80 Chips if Flush', scalingNote: 'Flush backbone chips.', source: 'cards.js' },
  { id: 'oddTodd', name: 'Odd Todd', role: 'chips', rarity: 'Common', cost: 4, effect: '+31 Chips per odd card played', scalingNote: 'Chip pad for odd decks.', source: 'cards.js' },
  { id: 'bull', name: 'Bull', role: 'chips', rarity: 'Uncommon', cost: 6, effect: '+2 Chips per dollar held', scalingNote: 'Money→chips; set $ via its param.', source: 'cards.js', scaling: true, paramLabel: 'Dollars held' },

  // scaling additive mult (set current value)
  { id: 'greenJoker', name: 'Green Joker', role: 'scalingAddMult', rarity: 'Common', cost: 4, effect: '+1 Mult per hand, −1 per discard', scalingNote: 'Linear ramp; early scaffolding.', source: 'cards.js', scaling: true, paramLabel: 'Accumulated +Mult' },
  { id: 'rideTheBus', name: 'Ride the Bus', role: 'scalingAddMult', rarity: 'Common', cost: 6, effect: '+1 Mult per consecutive no-face hand', scalingNote: 'Linear ramp; resets on a face card.', source: 'cards.js', scaling: true, paramLabel: 'Accumulated +Mult' },
  { id: 'supernova', name: 'Supernova', role: 'scalingAddMult', rarity: 'Common', cost: 5, effect: '+Mult = times this hand played', scalingNote: 'Linear with hand reps.', source: 'cards.js', scaling: true, paramLabel: 'Times hand played' },

  // ×mult (right side)
  { id: 'theDuo', name: 'The Duo', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×2 Mult if hand has a Pair', scalingNote: 'Cheap reliable ×Mult.', source: 'cards.js' },
  { id: 'theTrio', name: 'The Trio', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×3 Mult if Three of a Kind', scalingNote: 'Set-build ×Mult.', source: 'cards.js' },
  { id: 'theFamily', name: 'The Family', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×4 Mult if Four of a Kind', scalingNote: 'Huge on 4oaK/5oaK hands.', source: 'cards.js' },
  { id: 'theOrder', name: 'The Order', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×3 Mult if Straight', scalingNote: 'Straight ×Mult.', source: 'cards.js' },
  { id: 'theTribe', name: 'The Tribe', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×2 Mult if Flush', scalingNote: 'Core of the Flush backbone.', source: 'cards.js' },
  { id: 'cavendish', name: 'Cavendish', role: 'xMult', rarity: 'Common', cost: 4, effect: '×3 Mult', scalingNote: 'Unconditional ×3; great copy target.', source: 'cards.js' },
  { id: 'photograph', name: 'Photograph', role: 'xMult', rarity: 'Common', cost: 5, effect: 'First scored face card ×2 Mult', scalingNote: 'Cheap ×2 for face builds.', source: 'cards.js' },
  { id: 'hologram', name: 'Hologram', role: 'xMult', rarity: 'Uncommon', cost: 7, effect: '×(1 + 0.25 × cards added to deck)', scalingNote: 'Polynomial ×Mult; copy it.', source: 'cards.js', scaling: true, paramLabel: 'Cards added to deck' },
  { id: 'glassJoker', name: 'Glass Joker', role: 'xMult', rarity: 'Uncommon', cost: 6, effect: '×(1 + 0.75 × Glass destroyed)', scalingNote: 'Climbs as Glass shatters.', source: 'cards.js', scaling: true, paramLabel: 'Glass cards destroyed' },
  { id: 'baseballCard', name: 'Baseball Card', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×1.5 Mult per Uncommon joker', scalingNote: 'Multiplies with an Uncommon-heavy tray.', source: 'cards.js', scaling: true, paramLabel: 'Uncommon jokers' },
  { id: 'constellation', name: 'Constellation', role: 'xMult', rarity: 'Uncommon', cost: 6, effect: '×(1 + 0.1 × Planet cards used)', scalingNote: 'Polynomial ×Mult; pairs with Hologram.', source: 'cards.js', scaling: true, paramLabel: 'Planet cards used' },
  { id: 'steelJoker', name: 'Steel Joker', role: 'xMult', rarity: 'Uncommon', cost: 7, effect: '×(1 + 0.2 × Steel cards in deck)', scalingNote: 'Passive ×Mult for Steel-King Baron decks.', source: 'cards.js', scaling: true, paramLabel: 'Steel cards in deck' },
  { id: 'luckyCat', name: 'Lucky Cat', role: 'xMult', rarity: 'Uncommon', cost: 6, effect: '×(1 + 0.25 × Lucky triggers)', scalingNote: 'Ramps fast with Oops! All 6s + retriggers.', source: 'cards.js', scaling: true, paramLabel: 'Lucky triggers' },
  { id: 'vampire', name: 'Vampire', role: 'xMult', rarity: 'Uncommon', cost: 7, effect: '×(1 + 0.1 × enhanced cards scored)', scalingNote: 'Unbounded ×Mult; strips enhancements.', source: 'cards.js', scaling: true, paramLabel: 'Enhanced cards scored' },
  { id: 'obelisk', name: 'Obelisk', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×(1 + 0.2 × non-most-played hands)', scalingNote: 'Rewards hand variety; resets on most-played.', source: 'cards.js', scaling: true, paramLabel: 'Consecutive non-most-played hands' },
  { id: 'campfire', name: 'Campfire', role: 'xMult', rarity: 'Rare', cost: 9, effect: '×(1 + 0.25 × cards sold)', scalingNote: 'Resets when Boss defeated; sell to feed.', source: 'cards.js', scaling: true, paramLabel: 'Cards sold' },

  // held engines
  { id: 'baron', name: 'Baron', role: 'xMult', rarity: 'Rare', cost: 8, effect: '×1.5 Mult per King held in hand', scalingNote: 'Exponential in Kings held; doubled by Mime.', source: 'cards.js' },
  { id: 'mime', name: 'Mime', role: 'retrigger', rarity: 'Uncommon', cost: 5, effect: 'Retrigger all held-in-hand abilities once', scalingNote: 'Doubles Baron/Steel held effects.', source: 'cards.js' },

  // retrigger (played)
  { id: 'sockAndBuskin', name: 'Sock and Buskin', role: 'retrigger', rarity: 'Uncommon', cost: 6, effect: 'Retrigger played face cards once', scalingNote: 'Doubles Triboulet per face.', source: 'cards.js' },
  { id: 'hangingChad', name: 'Hanging Chad', role: 'retrigger', rarity: 'Common', cost: 4, effect: 'Retrigger first scored card 2 extra times', scalingNote: 'Triples the lead card.', source: 'cards.js' },
  { id: 'hack', name: 'Hack', role: 'retrigger', rarity: 'Uncommon', cost: 6, effect: 'Retrigger played 2/3/4/5 once', scalingNote: 'Low-card retrigger engines.', source: 'cards.js' },
  { id: 'seltzer', name: 'Seltzer', role: 'retrigger', rarity: 'Uncommon', cost: 6, effect: 'Retrigger all played cards (10 hands)', scalingNote: 'Temporary universal retrigger.', source: 'cards.js' },
  { id: 'dusk', name: 'Dusk', role: 'retrigger', rarity: 'Uncommon', cost: 5, effect: 'Retrigger all played cards on final hand', scalingNote: 'Last-hand burst.', source: 'cards.js' },

  // copy
  { id: 'blueprint', name: 'Blueprint', role: 'copy', rarity: 'Rare', cost: 10, effect: 'Copies the joker to its RIGHT', scalingNote: 'Doubles your best engine joker.', source: 'cards.js' },
  { id: 'brainstorm', name: 'Brainstorm', role: 'copy', rarity: 'Rare', cost: 10, effect: 'Copies the LEFT-MOST joker', scalingNote: 'Second copy of the engine.', source: 'cards.js' },

  // legendary
  { id: 'triboulet', name: 'Triboulet', role: 'legendary', rarity: 'Legendary', cost: 20, effect: 'Played Kings & Queens each ×2 Mult', scalingNote: 'Exponential per face; the face engine.', source: 'cards.js' },
  { id: 'yorick', name: 'Yorick', role: 'legendary', rarity: 'Legendary', cost: 20, effect: '×1 Mult per 23 cards discarded', scalingNote: 'Unbounded ×Mult; slow.', source: 'cards.js', scaling: true, paramLabel: 'Current ×Mult' },
  { id: 'canio', name: 'Canio', role: 'legendary', rarity: 'Legendary', cost: 20, effect: '×1 Mult per face card destroyed', scalingNote: 'Unbounded ×Mult; feed with Glass faces.', source: 'cards.js', scaling: true, paramLabel: 'Current ×Mult' },
  { id: 'chicot', name: 'Chicot', role: 'legendary', rarity: 'Legendary', cost: 20, effect: 'Disables every Boss Blind effect', scalingNote: 'Universal endless boss insurance.', source: 'cards.js' },
  { id: 'perkeo', name: 'Perkeo', role: 'legendary', rarity: 'Legendary', cost: 20, effect: 'Negative copy of a held consumable each shop', scalingNote: 'With Observatory: ×1.5 per held Planet copy, compounding every shop — the true infinite loop. Set copies held.', source: 'cards.js', scaling: true, paramLabel: 'Planet copies held' },

  // economy
  { id: 'goldenJoker', name: 'Golden Joker', role: 'economy', rarity: 'Common', cost: 6, effect: '+$4 each round', scalingNote: 'Buys time to assemble the engine.', source: 'cards.js' },
  { id: 'rocket', name: 'Rocket', role: 'economy', rarity: 'Uncommon', cost: 6, effect: '$ per round, grows on Boss defeat', scalingNote: 'Scaling income.', source: 'cards.js' },
]

export const JOKER_BY_ID: Record<string, JokerMeta> = Object.fromEntries(
  JOKERS.map((j) => [j.id, j]),
)
