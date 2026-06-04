import { useMemo, useState } from 'react'
import {
  DndContext, PointerSensor, TouchSensor, KeyboardSensor,
  closestCenter, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, horizontalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type {
  Edition, Enhancement, HandKey, JokerInstance, JokerRole, PlayingCard, Rank, Seal, Suit,
} from '../data/types'
import { HANDS } from '../data/hands'
import { JOKERS, JOKER_BY_ID } from '../data/jokers'
import { scoreHand } from '../engine/score'
import { PRESETS, makeCard } from '../engine/presets'
import { JokerSprite } from '../components/JokerSprite'

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITS: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
const EDITIONS: Edition[] = ['none', 'foil', 'holographic', 'polychrome', 'negative']
const SEALS: Seal[] = ['none', 'red', 'blue', 'gold', 'purple']
const ENHANCEMENTS: Enhancement[] = ['none', 'bonus', 'mult', 'glass', 'steel', 'stone', 'gold', 'lucky']
const SUIT_GLYPH: Record<Suit, string> = { Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦' }
const isRed = (s: Suit) => s === 'Hearts' || s === 'Diamonds'

const ROLE_COLOR: Record<string, string> = {
  chips: 'var(--blue)', addMult: 'var(--red)', scalingAddMult: 'var(--red)',
  xMult: 'var(--gold)', retrigger: 'var(--purple)', copy: 'var(--green)',
  economy: 'var(--green)', legendary: 'var(--purple)', utility: 'var(--ink-dim)',
}
const ROLE_GROUPS: { role: JokerRole; label: string }[] = [
  { role: 'chips', label: 'Chips' },
  { role: 'addMult', label: '+Mult' },
  { role: 'scalingAddMult', label: 'Scaling +Mult' },
  { role: 'xMult', label: '×Mult' },
  { role: 'retrigger', label: 'Retrigger' },
  { role: 'copy', label: 'Copy' },
  { role: 'legendary', label: 'Legendary' },
  { role: 'economy', label: 'Economy' },
]

function fmt(n: number): string {
  if (!isFinite(n)) return '∞'
  if (Math.abs(n) >= 1e6) return n.toExponential(2).replace('e+', 'e')
  return Math.round(n).toLocaleString('en-US')
}

let localUid = 1000
const nid = () => `u${localUid++}`

export function Simulator() {
  const [handKey, setHandKey] = useState<HandKey>('flush')
  const [handLevel, setHandLevel] = useState(8)
  const [played, setPlayed] = useState<PlayingCard[]>(PRESETS[0].playedCards)
  const [held, setHeld] = useState<PlayingCard[]>(PRESETS[0].heldCards)
  const [jokers, setJokers] = useState<JokerInstance[]>(PRESETS[0].jokers)
  const [showSteps, setShowSteps] = useState(false)
  const [libOpen, setLibOpen] = useState(true)

  const result = useMemo(
    () => scoreHand({ handKey, handLevel, playedCards: played, heldCards: held, jokers }),
    [handKey, handLevel, played, held, jokers],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  )

  function loadPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    setHandKey(p.handKey); setHandLevel(p.handLevel)
    setPlayed(p.playedCards); setHeld(p.heldCards); setJokers(p.jokers)
  }
  function addJoker(jokerId: string) {
    setJokers((js) => [...js, { uid: nid(), jokerId, edition: 'none' }])
  }
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setJokers((js) => {
      const from = js.findIndex((j) => j.uid === active.id)
      const to = js.findIndex((j) => j.uid === over.id)
      return arrayMove(js, from, to)
    })
  }

  return (
    <section>
      <div className="panel">
        <h2>Score simulator</h2>
        <p className="muted">
          Build a hand and a left→right joker board and watch{' '}
          <span className="chips">Chips</span> × <span className="mult">Mult</span> resolve.
          Tap a preset, then tweak it to prove the scaling.
        </p>
        <div className="row wrap">
          {PRESETS.map((p) => (
            <button key={p.id} className="btn" title={p.blurb} onClick={() => loadPreset(p.id)}>{p.name}</button>
          ))}
        </div>
      </div>

      <div className="panel result">
        <div className="result-line">
          <span className="chips">{fmt(result.chips)}</span>
          <span className="times">×</span>
          <span className="mult">{fmt(result.mult)}</span>
          <span className="times">=</span>
          <span className="score-big">{fmt(result.total)}</span>
        </div>
        <button className="link" onClick={() => setShowSteps((s) => !s)}>
          {showSteps ? 'Hide' : 'Show'} step-by-step breakdown ({result.steps.length})
        </button>
        {showSteps && (
          <div className="tablewrap">
            <table className="data">
              <thead><tr><th>Step</th><th>Chips</th><th>Mult</th><th>Note</th></tr></thead>
              <tbody>
                {result.steps.map((s, i) => (
                  <tr key={i}><td>{s.label}</td><td className="chips">{fmt(s.chips)}</td><td className="mult">{fmt(s.mult)}</td><td className="muted">{s.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Hand</h3>
        <div className="row wrap">
          <label>Type{' '}
            <select value={handKey} onChange={(e) => setHandKey(e.target.value as HandKey)}>
              {HANDS.map((h) => <option key={h.key} value={h.key}>{h.name}</option>)}
            </select>
          </label>
          <label>Planet level{' '}
            <input type="number" min={1} max={50} value={handLevel}
              onChange={(e) => setHandLevel(Math.max(1, Number(e.target.value) || 1))} style={{ width: 64 }} />
          </label>
        </div>
      </div>

      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ margin: 0 }}>Joker library <span className="muted">— tap a card to add</span></h3>
          <button className="link" onClick={() => setLibOpen((o) => !o)}>{libOpen ? 'Collapse' : 'Expand'}</button>
        </div>
        {libOpen && (
          <div className="joker-library">
            {ROLE_GROUPS.map(({ role, label }) => {
              const items = JOKERS.filter((j) => j.role === role)
              if (!items.length) return null
              return (
                <div key={role} className="lib-group">
                  <div className="lib-role" style={{ color: ROLE_COLOR[role] }}>{label}</div>
                  <div className="joker-grid">
                    {items.map((jm) => (
                      <button key={jm.id} className="joker-pick" title={`${jm.name} — ${jm.effect}`} onClick={() => addJoker(jm.id)}>
                        <JokerSprite id={jm.id} size={56} />
                        <span className="joker-pick-name">{jm.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <h3 style={{ marginTop: 16 }}>Your board <span className="muted">(drag to reorder · scored left → right)</span></h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={jokers.map((j) => j.uid)} strategy={horizontalListSortingStrategy}>
            <div className="joker-board">
              {jokers.map((j) => (
                <SortableJoker key={j.uid} inst={j}
                  onEdition={(ed) => setJokers((js) => js.map((x) => x.uid === j.uid ? { ...x, edition: ed } : x))}
                  onParam={(v) => setJokers((js) => js.map((x) => x.uid === j.uid ? { ...x, param: v } : x))}
                  onRemove={() => setJokers((js) => js.filter((x) => x.uid !== j.uid))} />
              ))}
              {jokers.length === 0 && <p className="muted">No jokers yet — tap cards in the library above to add.</p>}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <CardEditor title="Played cards (the scored hand)" cards={played} setCards={setPlayed} />
      <CardEditor title="Held in hand (Baron / Steel / Mime)" cards={held} setCards={setHeld} />

      <p className="muted small">
        Engine models the documented scoring path (hand level, card chips, enhancements, editions,
        red-seal &amp; joker retriggers, held-card engines, Blueprint/Brainstorm copies). Joker art is
        Balatro game property (© LocalThunk), shown for reference.
      </p>
    </section>
  )
}

function SortableJoker(props: {
  inst: JokerInstance
  onEdition: (e: Edition) => void
  onParam: (v: number) => void
  onRemove: () => void
}) {
  const { inst, onEdition, onParam, onRemove } = props
  const meta = JOKER_BY_ID[inst.jokerId]
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: inst.uid })
  const style = {
    transform: CSS.Transform.toString(transform), transition,
    opacity: isDragging ? 0.6 : 1,
    borderColor: ROLE_COLOR[meta?.role ?? 'utility'],
  }
  return (
    <div ref={setNodeRef} style={style} className="joker-card">
      <div className="joker-grip" {...attributes} {...listeners} title="Drag to reorder">⋮⋮</div>
      <JokerSprite id={inst.jokerId} size={64} />
      <div className="joker-name">{meta?.name ?? inst.jokerId}</div>
      <div className="row wrap tight">
        <select value={inst.edition} onChange={(e) => onEdition(e.target.value as Edition)}>
          {EDITIONS.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
        </select>
        {meta?.scaling && (
          <label className="small">{meta.paramLabel ?? 'value'}{' '}
            <input type="number" value={inst.param ?? 0} style={{ width: 52 }}
              onChange={(e) => onParam(Number(e.target.value) || 0)} />
          </label>
        )}
      </div>
      <button className="x" onClick={onRemove} title="Remove">×</button>
    </div>
  )
}

function CardEditor(props: { title: string; cards: PlayingCard[]; setCards: (c: PlayingCard[]) => void }) {
  const { title, cards, setCards } = props
  const [rank, setRank] = useState<Rank>('K')
  const [suit, setSuit] = useState<Suit>('Spades')
  const [enh, setEnh] = useState<Enhancement>('none')
  const [edition, setEdition] = useState<Edition>('none')
  const [seal, setSeal] = useState<Seal>('none')

  function add() {
    setCards([...cards, makeCard(rank, suit, { enhancement: enh, edition, seal })])
  }

  return (
    <div className="panel">
      <h3>{title} <span className="muted">({cards.length})</span></h3>

      <div className="card-list">
        {cards.map((c) => (
          <div key={c.id} className="mini-card" style={{ color: isRed(c.suit) ? 'var(--red)' : 'var(--ink)' }}>
            <span className="mini-rank">{c.rank}</span>
            <span className="mini-suit">{SUIT_GLYPH[c.suit]}</span>
            {(c.enhancement !== 'none' || c.edition !== 'none' || c.seal !== 'none') && (
              <span className="mini-badges">
                {c.enhancement !== 'none' && <i className="badge enh">{c.enhancement[0].toUpperCase()}</i>}
                {c.edition !== 'none' && <i className="badge ed">{c.edition[0].toUpperCase()}</i>}
                {c.seal !== 'none' && <i className="badge seal">{c.seal[0].toUpperCase()}</i>}
              </span>
            )}
            <button className="x" onClick={() => setCards(cards.filter((x) => x.id !== c.id))} title="Remove">×</button>
          </div>
        ))}
        {cards.length === 0 && <span className="muted small">No cards yet — build one below.</span>}
      </div>

      <div className="card-builder">
        <div className="rank-grid">
          {RANKS.map((r) => (
            <button key={r} className={`chip-btn ${rank === r ? 'on' : ''}`} onClick={() => setRank(r)}>{r}</button>
          ))}
        </div>
        <div className="suit-row">
          {SUITS.map((s) => (
            <button key={s} className={`chip-btn suit ${suit === s ? 'on' : ''}`} style={{ color: isRed(s) ? 'var(--red)' : 'var(--ink)' }} onClick={() => setSuit(s)}>{SUIT_GLYPH[s]}</button>
          ))}
        </div>
        <div className="row wrap tight">
          <select value={enh} onChange={(e) => setEnh(e.target.value as Enhancement)} title="Enhancement">
            {ENHANCEMENTS.map((x) => <option key={x} value={x}>{x === 'none' ? 'no enhance' : x}</option>)}
          </select>
          <select value={edition} onChange={(e) => setEdition(e.target.value as Edition)} title="Edition">
            {EDITIONS.map((x) => <option key={x} value={x}>{x === 'none' ? 'no edition' : x}</option>)}
          </select>
          <select value={seal} onChange={(e) => setSeal(e.target.value as Seal)} title="Seal">
            {SEALS.map((x) => <option key={x} value={x}>{x === 'none' ? 'no seal' : x + ' seal'}</option>)}
          </select>
          <button className="btn" onClick={add}>＋ Add {rank}{SUIT_GLYPH[suit]}</button>
        </div>
      </div>
    </div>
  )
}
