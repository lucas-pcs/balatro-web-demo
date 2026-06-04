import type {
  PlayingCard, Rank, ScoreInput, ScoreResult, ScoreStep,
} from '../data/types'
import { handAtLevel, HAND_BY_KEY } from '../data/hands'
import { JOKER_EFFECTS, type JokerEffect } from './jokerEffects'

// ── Card constants ─────────────────────────────────────────────────────────
const RANK_CHIPS: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  J: 10, Q: 10, K: 10, A: 11,
}
export const isFace = (r: Rank) => r === 'J' || r === 'Q' || r === 'K'

const ENH_CHIPS: Record<string, number> = { bonus: 30, stone: 50 }
const ENH_MULT: Record<string, number> = { mult: 4 }
const ENH_XMULT: Record<string, number> = { glass: 2 }

// ── Context handed to each joker effect ────────────────────────────────────
export interface EffectCtx {
  handKey: string
  handLevel: number
  played: PlayingCard[]
  held: PlayingCard[]
  retriggersFor: (card: PlayingCard, index: number) => number
  heldRetriggersFor: (card: PlayingCard) => number
}

export interface EffectOut { addChips?: number; addMult?: number; xMult?: number; note?: string }

const EDITION_CHIPS = (e: string) => (e === 'foil' ? 50 : 0)
const EDITION_MULT = (e: string) => (e === 'holographic' ? 10 : 0)
const suitGlyph = (s: string) =>
  s === 'Spades' ? '♠' : s === 'Hearts' ? '♥' : s === 'Clubs' ? '♣' : '♦'
const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Resolve the effect that a board slot actually uses, following copy jokers:
 * Blueprint copies the joker to its right; Brainstorm copies the leftmost.
 * Guarded against copy → copy loops.
 */
function resolveEffect(input: ScoreInput, index: number, seen = new Set<number>()): JokerEffect | undefined {
  if (index < 0 || index >= input.jokers.length || seen.has(index)) return undefined
  seen.add(index)
  const id = input.jokers[index].jokerId
  if (id === 'blueprint') return resolveEffect(input, index + 1, seen)
  if (id === 'brainstorm') return resolveEffect(input, 0, seen)
  return JOKER_EFFECTS[id]
}

function playedRetriggers(card: PlayingCard, cardIndex: number, input: ScoreInput): number {
  let extra = card.seal === 'red' ? 1 : 0
  for (let i = 0; i < input.jokers.length; i++) {
    const eff = resolveEffect(input, i)
    if (eff?.retriggerPlayed) extra += eff.retriggerPlayed(card, cardIndex, input)
  }
  return extra
}

function heldRetriggers(card: PlayingCard, input: ScoreInput): number {
  let extra = card.seal === 'red' ? 1 : 0
  for (let i = 0; i < input.jokers.length; i++) {
    const eff = resolveEffect(input, i)
    if (eff?.retriggerHeld) extra += eff.retriggerHeld(card, input)
  }
  return extra
}

export function scoreHand(input: ScoreInput): ScoreResult {
  const steps: ScoreStep[] = []
  const hand = HAND_BY_KEY[input.handKey]
  const base = handAtLevel(input.handKey, input.handLevel)

  let chips = base.chips
  let mult = base.mult
  steps.push({ label: `${hand?.name ?? input.handKey} (lvl ${input.handLevel})`, chips, mult, note: 'hand base' })

  // ── Phase 1: played cards (each, with retriggers) ──
  for (let i = 0; i < input.playedCards.length; i++) {
    const c = input.playedCards[i]
    const triggers = 1 + playedRetriggers(c, i, input)
    for (let t = 0; t < triggers; t++) {
      const addChips = RANK_CHIPS[c.rank] + (ENH_CHIPS[c.enhancement] ?? 0) + EDITION_CHIPS(c.edition)
      chips += addChips
      const addMult = (ENH_MULT[c.enhancement] ?? 0) + EDITION_MULT(c.edition)
      mult += addMult
      if (ENH_XMULT[c.enhancement]) mult *= ENH_XMULT[c.enhancement]
      if (c.edition === 'polychrome') mult *= 1.5
      steps.push({
        label: `${c.rank}${suitGlyph(c.suit)}${t > 0 ? ` ↻${t}` : ''}`,
        chips, mult,
        note: [addChips ? `+${addChips} chips` : '', addMult ? `+${addMult} mult` : '',
          ENH_XMULT[c.enhancement] ? `×${ENH_XMULT[c.enhancement]}` : '', c.edition === 'polychrome' ? '×1.5' : '']
          .filter(Boolean).join(' '),
      })
    }
  }

  // ── Phase 2: held cards (steel) ──
  for (const c of input.heldCards) {
    const triggers = 1 + heldRetriggers(c, input)
    if (c.enhancement === 'steel') {
      for (let t = 0; t < triggers; t++) {
        mult *= 1.5
        steps.push({ label: `hold ${c.rank}${suitGlyph(c.suit)} steel${t ? ' ↻' : ''}`, chips, mult, note: '×1.5 mult' })
      }
    }
  }

  // ── Phase 3: jokers, left → right (copies resolved) ──
  const ctx: EffectCtx = {
    handKey: input.handKey,
    handLevel: input.handLevel,
    played: input.playedCards,
    held: input.heldCards,
    retriggersFor: (card, index) => playedRetriggers(card, index, input),
    heldRetriggersFor: (card) => heldRetriggers(card, input),
  }
  for (let i = 0; i < input.jokers.length; i++) {
    const ji = input.jokers[i]
    const eff = resolveEffect(input, i)
    const out: EffectOut = eff?.slot ? eff.slot(ctx, input) : {}
    if (out.addChips) chips += out.addChips
    if (out.addMult) mult += out.addMult
    if (out.xMult && out.xMult !== 1) mult *= out.xMult

    // joker edition bonuses
    if (ji.edition === 'foil') chips += 50
    if (ji.edition === 'holographic') mult += 10
    if (ji.edition === 'polychrome') mult *= 1.5

    const did = out.addChips || out.addMult || (out.xMult && out.xMult !== 1) || ji.edition !== 'none'
    if (did) {
      const copied = ji.jokerId === 'blueprint' || ji.jokerId === 'brainstorm'
      steps.push({
        label: `${JOKER_EFFECTS[ji.jokerId]?.name ?? ji.jokerId}${copied && eff ? ` → ${eff.name}` : ''}`,
        chips, mult,
        note: [
          out.addChips ? `+${out.addChips} chips` : '',
          out.addMult ? `+${out.addMult} mult` : '',
          out.xMult && out.xMult !== 1 ? `×${round2(out.xMult)} mult` : '',
          ji.edition !== 'none' ? `(${ji.edition})` : '',
          out.note ?? '',
        ].filter(Boolean).join(' '),
      })
    }
  }

  const finalChips = Math.round(chips)
  const total = finalChips * mult
  return { chips: finalChips, mult: round2(mult), total: Math.floor(total), steps }
}
