import type { AnteRoute } from './types'

// Per-build ante-by-ante survival routes. Source: research/strategy-corpus.md §7.
export const ANTE_ROUTES: AnteRoute[] = [
  {
    archetypeId: 'perkeo-observatory',
    steps: [
      { ante: 1, label: 'Antes 1–3 · economy + a hand', goal: 'Survive on raw hand value while banking cash.', buy: ['A cheap +Mult joker (Joker/Jolly/Crafty)', 'An economy joker (To the Moon / Rocket)', 'Telescope the moment it appears'], play: 'Your most-frequent hand (Pair → Flush)', reroll: 'Only with spare cash above $25' },
      { ante: 4, label: 'Antes 4–6 · lock voucher + level', goal: 'Level your scoring hand to ~L5–8 and secure Observatory.', buy: ['Celestial packs (Telescope makes them hand-targeted)', 'Observatory voucher', 'Crystal Ball (+1 consumable slot)'], play: 'The hand you are leveling', reroll: 'Sparingly; keep $25 interest floor' },
      { ante: 7, label: 'Antes 7–8 · find Perkeo', goal: 'Open Arcana/Spectral/Soul chasing Perkeo; go live.', buy: ['Spectral/Hieroglyph packs', 'Perkeo (Soul)'], play: 'Your leveled hand, now multiplied by held Planets', reroll: 'To dig for Perkeo if flush with cash' },
      { ante: 9, label: 'Endless 9→39 · compound', goal: 'Let the ×1.5/shop loop outrun the curve to the Ante-39 cap.', buy: ['Celestial packs to keep leveling', 'Blueprint/Brainstorm to copy a secondary ×Mult', 'Keep Chicot/Luchador for bosses'], play: 'One leveled hand; hold your Planet every shop', reroll: 'Whenever cash allows — more packs = more levels' },
    ],
  },
  {
    archetypeId: 'baron-mime',
    steps: [
      { ante: 1, label: 'Antes 1–3 · thin toward Kings', goal: 'Thin the deck and bank money; watch for Baron.', buy: ['Any early mult joker', 'Economy joker', 'Arcana packs (Steel on Kings)'], play: 'Pairs / High Card', reroll: 'Low; thin and save' },
      { ante: 4, label: 'Antes 4–6 · land the engine', goal: 'Get Baron + Mime online; convert Kings to Steel.', buy: ['Baron (Rare)', 'Mime', 'Steel tarots on Kings; Red seals if available'], play: 'A cheap hand — the holds do the lifting', reroll: 'To find Baron' },
      { ante: 7, label: 'Antes 7–8 · copy + optimize', goal: 'Triple the held-King multiplier and hold max Kings.', buy: ['Blueprint (copy Baron)', 'Brainstorm (copy Baron)'], play: 'Hand that lets you hold a full set of Steel Kings', reroll: 'For copies' },
      { ante: 9, label: 'Endless · keep leveling', goal: 'Add Steel Kings and keep leveling the played hand.', buy: ['DNA / more Steel', 'Celestial packs to level the played hand', 'Chicot for hand-size/face bosses'], play: 'Max Kings held every hand', reroll: 'As cash allows' },
    ],
  },
  {
    archetypeId: 'triboulet-sock',
    steps: [
      { ante: 1, label: 'Antes 1–4 · face shell', goal: 'Play face-heavy hands; steer deck to K/Q.', buy: ['Photograph / Smiley', 'Economy', 'Rank-changing tarots toward K/Q'], play: 'Face-heavy hands', reroll: 'Low early' },
      { ante: 5, label: 'Antes 5–7 · land Triboulet', goal: 'Get Triboulet + Sock & Buskin; add Pareidolia.', buy: ['Triboulet (Soul)', 'Sock & Buskin (face retrigger)', 'Pareidolia (all cards count as faces)'], play: 'All-face hands (K/Q)', reroll: 'To dig for the Legendary' },
      { ante: 8, label: 'Ante 8 → endless · copy', goal: 'Three ×2 instances per face; level the face hand.', buy: ['Blueprint + Brainstorm (copy Triboulet)', 'Telescope/Celestial to level Five of a Kind / Flush House'], play: 'Highest-base face hand', reroll: 'For copies' },
      { ante: 9, label: 'Endless · insure bosses', goal: 'Keep leveling; neutralize face-debuff bosses.', buy: ['Chicot (The Plant / The Mark insurance)'], play: 'Your leveled face hand', reroll: 'As cash allows' },
    ],
  },
]
