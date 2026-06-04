import { useMemo, useState } from 'react'
import { ANTE_ROUTES } from '../data/anteRoutes'
import { ARCHETYPES } from '../data/archetypes'
import { BOSSES } from '../data/bosses'

function archetypeName(id: string): string {
  return ARCHETYPES.find((a) => a.id === id)?.name ?? id
}

export function Route() {
  const routes = ANTE_ROUTES
  const [activeId, setActiveId] = useState<string>(routes[0]?.archetypeId ?? '')

  const route = useMemo(
    () => routes.find((r) => r.archetypeId === activeId) ?? routes[0],
    [routes, activeId],
  )

  return (
    <section>
      <div className="panel">
        <h2>Ante-by-ante survival route</h2>
        <p className="muted">
          What to buy, play, and reroll each ante so the engine assembles before the blinds
          outscale you. Source: strategy-corpus §7.
        </p>
        <div className="route-picker">
          {routes.map((r) => (
            <button
              key={r.archetypeId}
              className={`tab${r.archetypeId === activeId ? ' active' : ''}`}
              onClick={() => setActiveId(r.archetypeId)}
            >
              {archetypeName(r.archetypeId)}
            </button>
          ))}
        </div>
      </div>

      {route?.steps.map((step) => (
        <div className="panel" key={`${route.archetypeId}-${step.ante}`}>
          <h3 style={{ marginTop: 0 }}>{step.label}</h3>
          <p style={{ margin: '4px 0 10px' }}>
            <span className="muted">Goal:</span> {step.goal}
          </p>
          <div className="route-grid">
            <div>
              <div className="build-label chips">Buy</div>
              <ul className="build-list">
                {step.buy.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="build-label" style={{ color: 'var(--gold)' }}>Play</div>
              <p style={{ margin: '2px 0' }}>{step.play}</p>
              <div className="build-label mult" style={{ marginTop: 8 }}>Reroll</div>
              <p style={{ margin: '2px 0' }}>{step.reroll}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="panel">
        <h2>Boss threats reference</h2>
        <p className="muted">
          Engine-disrupting boss blinds and how to play around them. Source: strategy-corpus §8.
        </p>
        <div className="tablewrap">
          <table className="data">
            <thead>
              <tr>
                <th>Boss</th>
                <th>Debuff</th>
                <th>Counterplay</th>
              </tr>
            </thead>
            <tbody>
              {BOSSES.map((b) => (
                <tr key={b.name}>
                  <td><strong>{b.name}</strong></td>
                  <td className="mult">{b.debuff}</td>
                  <td>{b.counterplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
