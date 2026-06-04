import { useMemo, useState } from 'react'
import { ARCHETYPES } from '../data/archetypes'
import { JOKER_BY_ID } from '../data/jokers'
import { JOKER_SPRITES } from '../data/jokerSprites'
import { JokerSprite } from '../components/JokerSprite'
import type { Archetype, Tier } from '../data/types'

const TIER_ORDER: Tier[] = ['S', 'A', 'B']

function CoreJokers({ ids }: { ids: string[] }) {
  return (
    <div className="core-jokers">
      {ids.map((id) => (
        <span key={id} className="core-joker" title={JOKER_BY_ID[id]?.effect ?? id}>
          {JOKER_SPRITES[id] && <JokerSprite id={id} size={40} />}
          <span>{JOKER_BY_ID[id]?.name ?? id}</span>
        </span>
      ))}
    </div>
  )
}

/** Render a 1–5 rating as filled/empty stars. */
function Stars({ value, invert = false }: { value: number; invert?: boolean }) {
  const filled = Math.max(0, Math.min(5, value))
  // For "lower is better" stats (fragility) a good score is few filled stars,
  // so colour the bar green when low and red when high; normal stats are gold.
  const tone = invert
    ? value <= 2
      ? 'var(--green)'
      : value >= 4
        ? 'var(--red)'
        : 'var(--gold)'
    : 'var(--gold)'
  return (
    <span aria-label={`${value} of 5`} style={{ color: tone, letterSpacing: '1px', whiteSpace: 'nowrap' }}>
      {'★'.repeat(filled)}
      <span style={{ color: 'var(--line)' }}>{'★'.repeat(5 - filled)}</span>
    </span>
  )
}

type SortKey = 'name' | 'tier' | 'ceiling' | 'consistency' | 'setupSpeed' | 'fragility'

const COLUMNS: { key: SortKey; label: string; hint?: string }[] = [
  { key: 'name', label: 'Build' },
  { key: 'tier', label: 'Tier' },
  { key: 'ceiling', label: 'Ceiling' },
  { key: 'consistency', label: 'Consistency' },
  { key: 'setupSpeed', label: 'Setup' },
  { key: 'fragility', label: 'Fragility', hint: 'lower is better' },
]

function sortValue(a: Archetype, key: SortKey): number | string {
  switch (key) {
    case 'name':
      return a.name
    case 'tier':
      return TIER_ORDER.indexOf(a.tier)
    default:
      return a.rating[key]
  }
}

export function Builds() {
  const [sortKey, setSortKey] = useState<SortKey>('tier')
  const [dir, setDir] = useState<1 | -1>(1)

  const grouped = useMemo(
    () => TIER_ORDER.map((tier) => ({ tier, items: ARCHETYPES.filter((a) => a.tier === tier) })),
    [],
  )

  const sorted = useMemo(() => {
    const rows = [...ARCHETYPES]
    rows.sort((a, b) => {
      const va = sortValue(a, sortKey)
      const vb = sortValue(b, sortKey)
      if (va < vb) return -1 * dir
      if (va > vb) return 1 * dir
      return 0
    })
    return rows
  }, [sortKey, dir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setDir((d) => (d === 1 ? -1 : 1))
    } else {
      setSortKey(key)
      setDir(1)
    }
  }

  return (
    <section>
      <div className="panel">
        <h2>Build tier list</h2>
        <p className="muted">
          Infinite-scaling archetypes ranked S → B, rated on ceiling, consistency, setup speed,
          and fragility. Source: strategy-corpus §6.
        </p>
      </div>

      {grouped.map(({ tier, items }) => (
        <div className="panel" key={tier}>
          <h3 style={{ marginTop: 0 }}>
            <span className={`pill ${tier}`}>{tier}</span>{' '}
            <span className="muted">{tier === 'S' ? 'Tier — endless-capable' : tier === 'A' ? 'Tier — strong, needs a top core' : 'Tier — scaffolding'}</span>
          </h3>
          {items.map((a) => (
            <div key={a.id} className="build-card">
              <div className="build-head">
                <span className={`pill ${a.tier}`}>{a.tier}</span>
                <strong>{a.name}</strong>
              </div>
              <p style={{ margin: '6px 0' }}>{a.summary}</p>
              <p className="muted" style={{ margin: '6px 0' }}>
                <strong>Engine:</strong> {a.engine}
              </p>
              <div className="build-grid">
                <div>
                  <div className="build-label" style={{ color: 'var(--green)' }}>Pros</div>
                  <ul className="build-list">
                    {a.pros.map((p, i) => (
                      <li key={i} style={{ color: 'var(--green)' }}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="build-label" style={{ color: 'var(--red)' }}>Cons</div>
                  <ul className="build-list">
                    {a.cons.map((c, i) => (
                      <li key={i} style={{ color: 'var(--red)' }}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="build-label" style={{ marginTop: 8, color: 'var(--ink-dim)' }}>Core jokers</div>
              <CoreJokers ids={a.coreJokers} />
            </div>
          ))}
        </div>
      ))}

      <div className="panel">
        <h2>Comparison matrix</h2>
        <p className="muted">
          Tap a column header to sort. Ratings are 1–5; ★ = stronger. Note: for{' '}
          <strong>Fragility</strong>, lower is better (green = robust, red = fragile).
        </p>
        <div className="tablewrap">
          <table className="data">
            <thead>
              <tr>
                {COLUMNS.map((col) => {
                  const active = col.key === sortKey
                  return (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      style={{ cursor: 'pointer', userSelect: 'none', color: active ? 'var(--ink)' : undefined }}
                    >
                      {col.label}
                      {active ? (dir === 1 ? ' ▲' : ' ▼') : ' ⋄'}
                      {col.hint ? <span className="muted" style={{ fontWeight: 400 }}> ({col.hint})</span> : null}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td><span className={`pill ${a.tier}`}>{a.tier}</span></td>
                  <td><Stars value={a.rating.ceiling} /></td>
                  <td><Stars value={a.rating.consistency} /></td>
                  <td><Stars value={a.rating.setupSpeed} /></td>
                  <td><Stars value={a.rating.fragility} invert /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
