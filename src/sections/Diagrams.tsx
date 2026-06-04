import { Children, Fragment, type ReactNode } from 'react'
import { JOKER_BY_ID } from '../data/jokers'
import { JokerSprite } from '../components/JokerSprite'

// ── Building blocks ────────────────────────────────────────────────────────
function Flow({ children }: { children: ReactNode }) {
  const items = Children.toArray(children)
  return (
    <div className="flow">
      {items.map((c, i) => (
        <Fragment key={i}>
          {c}
          {i < items.length - 1 && <span className="flow-arrow" aria-hidden>→</span>}
        </Fragment>
      ))}
    </div>
  )
}

function JokerFig({ id, sub }: { id: string; sub?: string }) {
  const m = JOKER_BY_ID[id]
  return (
    <div className="fig">
      <JokerSprite id={id} size={64} />
      <b>{m?.name ?? id}</b>
      {sub && <span className="fig-sub">{sub}</span>}
    </div>
  )
}

function CardFig({ rank, suit, red, count, sub }: { rank: string; suit: string; red?: boolean; count?: string; sub?: string }) {
  return (
    <div className="fig">
      <div className="cards-fig">
        <div className="mini-card sm" style={{ color: red ? 'var(--red)' : 'var(--ink)' }}>
          <span className="mini-rank">{rank}</span>
          <span className="mini-suit">{suit}</span>
        </div>
        {count && <span className="count-badge">{count}</span>}
      </div>
      {sub && <span className="fig-sub">{sub}</span>}
    </div>
  )
}

const Mult = ({ children }: { children: ReactNode }) => <span className="mult-pill">{children}</span>
const Result = ({ children }: { children: ReactNode }) => <span className="result-pill">{children}</span>

// ── Page ───────────────────────────────────────────────────────────────────
export function Diagrams() {
  return (
    <section>
      <div className="panel">
        <h2>Engine diagrams</h2>
        <p className="muted">
          The infinite engines, shown with the actual joker cards and the math chain. Each ×Mult
          step multiplies everything to its left — see the Simulator to prove any of these live.
        </p>
      </div>

      {/* Scoring sequence */}
      <div className="panel">
        <h3>Scoring activation sequence</h3>
        <Flow>
          <div className="fig"><div className="phase-chip base">Hand base</div><span className="fig-sub">chips & mult @ level</span></div>
          <div className="fig"><div className="phase-chip chipsbg">Played cards</div><span className="fig-sub">+chips, +mult, ×edition · retriggers</span></div>
          <div className="fig"><div className="phase-chip multbg">Held cards</div><span className="fig-sub">Steel ×1.5 · Baron ×1.5/King</span></div>
          <div className="fig"><div className="phase-chip xmultbg">Jokers L→R</div><span className="fig-sub">+chips · +mult · ×mult</span></div>
          <Result>Chips × Mult</Result>
        </Flow>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Put <span className="chips">+Chips</span>/<span className="mult">+Mult</span> jokers LEFT and{' '}
          <span style={{ color: 'var(--gold)' }}>×Mult</span> jokers RIGHT — a ×Mult multiplies the whole running total to its left.
        </p>
      </div>

      {/* Baron + Mime */}
      <div className="panel">
        <h3>Baron + Mime <span className="muted">— exponential in Kings held</span></h3>
        <Flow>
          <CardFig rank="K" suit="♠" count="×5" sub="Steel Kings held" />
          <JokerFig id="baron" sub="×1.5 per King" />
          <JokerFig id="mime" sub="retrigger → ×2.25/King" />
          <JokerFig id="blueprint" sub="copy Baron" />
          <JokerFig id="brainstorm" sub="copy Baron" />
          <Result>×1.5³⁰</Result>
        </Flow>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Each held King is ×1.5; Mime makes it count twice (×2.25), and the two copies triple Baron.
          Per-hand static — pair with relentless hand-leveling.
        </p>
      </div>

      {/* Triboulet + Sock */}
      <div className="panel">
        <h3>Triboulet + Sock &amp; Buskin <span className="muted">— exponential in faces played</span></h3>
        <Flow>
          <CardFig rank="K" suit="♠" count="×5" sub="Kings / Queens played" />
          <JokerFig id="triboulet" sub="×2 per K/Q" />
          <JokerFig id="sockAndBuskin" sub="retrigger → ×4 each" />
          <JokerFig id="blueprint" sub="copy Triboulet" />
          <JokerFig id="brainstorm" sub="copy Triboulet" />
          <Result>≈ ×10⁹</Result>
        </Flow>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Five K/Q at ×4 each = ×4⁵ = ×1024 from one Triboulet — tripled by the copies. Pareidolia makes
          every card count as a face.
        </p>
      </div>

      {/* Perkeo loop */}
      <div className="panel">
        <h3>Perkeo + Observatory <span className="muted">— the compounding infinite loop</span></h3>
        <Flow>
          <JokerFig id="perkeo" sub="mint a Negative Planet each shop" />
          <CardFig rank="♆" suit="Planet" count="×n" sub="held copies (0 slots)" />
          <Mult>Observatory ×1.5 / copy</Mult>
          <Result>×1.5ⁿ ↻</Result>
        </Flow>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Every shop adds one Negative Planet, so n grows without bound and the multiplier compounds
          ×1.5 per shop — forever, at zero slot cost. The only shape that reaches the Ante-39 cap.
        </p>
      </div>

      {/* Copy placement */}
      <div className="panel">
        <h3>Blueprint / Brainstorm <span className="muted">— copy placement</span></h3>
        <Flow>
          <JokerFig id="brainstorm" sub="copies the LEFT-MOST" />
          <JokerFig id="baron" sub="your engine joker" />
          <JokerFig id="blueprint" sub="copies the joker to its RIGHT" />
        </Flow>
        <p className="muted small" style={{ marginBottom: 0 }}>
          With the engine left-most, Brainstorm copies it directly and Blueprint copies it from the left —
          three instances of one joker, the biggest force-multiplier in the game.
        </p>
      </div>

      <div className="panel">
        <p className="muted" style={{ margin: 0 }}>
          For the scaling curves (additive vs ×Mult vs retrigger, and the ante wall), see the{' '}
          <strong>Charts</strong> tab.
        </p>
      </div>
    </section>
  )
}
