import type { BossBlind } from './types'

// Engine-disrupting boss blinds + counterplay. Source: research/strategy-corpus.md §8
// (effects from balatrowiki.org/w/Blinds).
export const BOSSES: BossBlind[] = [
  { name: 'The Wall', debuff: 'Requires 4× base chips (instead of 2×)', threatensEngines: ['under-scaled builds'], counterplay: 'Pure score check — S engines ignore it; weaker builds pre-level a hand or hold a saved Planet/×Mult to spike.', source: 'balatrowiki.org' },
  { name: 'The Needle', debuff: 'Only 1 hand allowed (needs just 1× base)', threatensEngines: ['multi-hand grinders'], counterplay: 'Rewards one-big-hand engines — often the easiest boss for Baron/Triboulet/Perkeo.', source: 'balatrowiki.org' },
  { name: 'The Manacle', debuff: '−1 hand size', threatensEngines: ['baron-mime'], counterplay: 'Hits Baron hardest (one fewer King held). Carry a hand-size buffer or Chicot/Luchador.', source: 'balatrowiki.org' },
  { name: 'The Psychic', debuff: 'Must play 5 cards', threatensEngines: ['baron-mime'], counterplay: 'Commits cards you would rather hold. Hold what you can, or Chicot.', source: 'balatrowiki.org' },
  { name: 'Verdant Leaf', debuff: 'All cards debuffed until you sell a Joker (2×)', threatensEngines: ['baron-mime', 'triboulet-sock', 'flush-backbone'], counterplay: 'Catastrophic for card-scoring. Keep one sacrificial joker to sell, or Chicot disables it.', source: 'balatrowiki.org' },
  { name: 'The Plant', debuff: 'Debuffs all face cards', threatensEngines: ['triboulet-sock', 'baron-mime'], counterplay: 'Kills face/King scoring. Chicot, Luchador, or play a non-face hand that round.', source: 'balatrowiki.org' },
  { name: 'The Mark', debuff: 'All face cards drawn face-down', threatensEngines: ['triboulet-sock'], counterplay: 'Chicot/Luchador, or play a non-face hand.', source: 'balatrowiki.org' },
  { name: 'The Ox', debuff: 'Playing your most-played hand sets money to $0', threatensEngines: ['perkeo-observatory'], counterplay: 'Play a different hand once; a single-hand engine can eat the $0 once.', source: 'balatrowiki.org' },
  { name: 'The Flint', debuff: 'Halves base chips & mult of every hand', threatensEngines: ['baron-mime'], counterplay: 'Keep your scoring hand leveled so half of a big base still clears; ×Mult engines barely notice.', source: 'balatrowiki.org' },
  { name: 'The Eye / The Mouth', debuff: 'No repeat hand types / one hand type all blind', threatensEngines: ['single-hand leveling builds'], counterplay: 'Have a second viable hand, or one-shot the blind before it matters.', source: 'balatrowiki.org' },
]
