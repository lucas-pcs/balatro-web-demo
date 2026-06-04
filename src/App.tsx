import { useState } from 'react'
import { Overview } from './sections/Overview'
import { Simulator } from './sections/Simulator'
import { Builds } from './sections/Builds'
import { Charts } from './sections/Charts'
import { Route } from './sections/Route'
import { Diagrams } from './sections/Diagrams'

type TabId = 'overview' | 'simulator' | 'builds' | 'charts' | 'route' | 'diagrams'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'simulator', label: 'Simulator', icon: '🧮' },
  { id: 'overview', label: 'Scoring', icon: '🎯' },
  { id: 'builds', label: 'Tier List', icon: '🏆' },
  { id: 'charts', label: 'Charts', icon: '📈' },
  { id: 'route', label: 'Ante Route', icon: '🗺️' },
  { id: 'diagrams', label: 'Diagrams', icon: '🖼️' },
]

export default function App() {
  const [tab, setTab] = useState<TabId>('simulator')

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <span className="logo-chip">Balatro</span> Pro Handbook
        </h1>
        <p className="tagline">Infinite-scaling strategy · score simulator · ante route</p>
      </header>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
          >
            <span className="tab-icon" aria-hidden>{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'overview' && <Overview />}
        {tab === 'simulator' && <Simulator />}
        {tab === 'builds' && <Builds />}
        {tab === 'charts' && <Charts />}
        {tab === 'route' && <Route />}
        {tab === 'diagrams' && <Diagrams />}
      </main>

      <footer className="app-footer">
        <span>Numbers cite sources in <code>balatro-handguide.md</code>. Not affiliated with Balatro / LocalThunk.</span>
      </footer>
    </div>
  )
}
