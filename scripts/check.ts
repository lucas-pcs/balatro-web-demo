import { scoreHand } from '../src/engine/score'
import { PRESETS, makeCard } from '../src/engine/presets'

// 1) Hand-verifiable baseline: Flush L1, hearts A K 10 7 4, no jokers.
//    base 35×4=140 chips/4 mult; card chips 11+10+10+7+4=42 ⇒ 77 chips × 4 = 308.
const base = scoreHand({
  handKey: 'flush', handLevel: 1,
  playedCards: [makeCard('A', 'Hearts'), makeCard('K', 'Hearts'), makeCard('10', 'Hearts'), makeCard('7', 'Hearts'), makeCard('4', 'Hearts')],
  heldCards: [], jokers: [],
})
console.log('Flush L1 no jokers:', base.chips, '×', base.mult, '=', base.total, '(expect 77 × 4 = 308)')

for (const p of PRESETS) {
  const r = scoreHand({ handKey: p.handKey, handLevel: p.handLevel, playedCards: p.playedCards, heldCards: p.heldCards, jokers: p.jokers })
  console.log(`\n${p.name}\n  ${r.chips} × ${r.mult} = ${r.total.toExponential(2)}`)
}
