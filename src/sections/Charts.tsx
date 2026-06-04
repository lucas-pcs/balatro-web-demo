import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ANTE_39_NOTE, ANTE_REQUIREMENTS, ENDLESS_REQUIREMENTS } from '../data/antes'

/** Compact scientific-ish formatter so big numbers stay mobile-readable. */
function fmt(n: number): string {
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e6 || abs < 1e-3) {
    const exp = Math.floor(Math.log10(abs))
    const mantissa = n / 10 ** exp
    return `${mantissa.toFixed(1)}e${exp}`
  }
  if (abs >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(n)
}

/** Tick formatter that only labels exact powers of ten on a log axis. */
function powerOfTen(n: number): string {
  if (n <= 0) return ''
  const exp = Math.log10(n)
  const rounded = Math.round(exp)
  if (Math.abs(exp - rounded) > 1e-6) return ''
  return `1e${rounded}`
}

const ante18 = ANTE_REQUIREMENTS.map((r) => ({
  ante: r.ante,
  Small: r.small,
  Big: r.big,
  Boss: r.boss,
}))

const endless = ENDLESS_REQUIREMENTS.map((r) => ({ ante: r.ante, required: r.required }))

// Synthetic growth shapes over 12 rounds. Source: strategy-corpus §3, §5.
const growth = Array.from({ length: 12 }, (_, i) => {
  const r = i + 1
  return {
    round: r,
    Additive: 4 + 4 * r,
    'xMult (×1.5/r)': 4 * 1.5 ** r,
    'Retrigger (×2/r)': 4 * 2 ** r,
  }
})

const tooltipStyle = {
  background: '#0d0f13',
  border: '1px solid var(--line)',
  borderRadius: 8,
  color: 'var(--ink)',
} as const

const COLORS = {
  small: 'var(--green)',
  big: 'var(--gold)',
  boss: 'var(--red)',
  wall: 'var(--purple)',
  additive: 'var(--green)',
  xmult: 'var(--blue)',
  retrigger: 'var(--red)',
}

export function Charts() {
  return (
    <section>
      <div className="panel">
        <h2>Scaling charts</h2>
        <p className="muted">
          The ante requirement is exponential, so only multiplicative and retrigger engines keep
          pace deep into endless. Numbers are the real White-Stake checks (strategy-corpus §3).
        </p>
      </div>

      <div className="panel">
        <h3>Ante score requirements (1–8)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={ante18} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="ante" stroke="var(--ink-dim)" tick={{ fontSize: 12 }} label={{ value: 'Ante', position: 'insideBottom', offset: -2, fill: 'var(--ink-dim)', fontSize: 12 }} />
            <YAxis stroke="var(--ink-dim)" tick={{ fontSize: 11 }} tickFormatter={fmt} width={48} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Small" stroke={COLORS.small} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Big" stroke={COLORS.big} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Boss" stroke={COLORS.boss} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <p className="muted" style={{ marginBottom: 0 }}>
          Even within Antes 1–8 the boss check climbs from 600 to 100,000 chips.
        </p>
      </div>

      <div className="panel">
        <h3>Endless wall (log scale)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={endless} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="ante" stroke="var(--ink-dim)" tick={{ fontSize: 12 }} label={{ value: 'Ante', position: 'insideBottom', offset: -2, fill: 'var(--ink-dim)', fontSize: 12 }} />
            <YAxis
              scale="log"
              domain={['auto', 'auto']}
              stroke="var(--ink-dim)"
              tick={{ fontSize: 11 }}
              tickFormatter={powerOfTen}
              width={52}
              allowDataOverflow
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Line type="monotone" dataKey="required" name="Required score" stroke={COLORS.wall} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="muted" style={{ marginBottom: 0 }}>{ANTE_39_NOTE}</p>
      </div>

      <div className="panel">
        <h3>Growth shapes: additive vs ×Mult vs retrigger</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={growth} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="round" stroke="var(--ink-dim)" tick={{ fontSize: 12 }} label={{ value: 'Round', position: 'insideBottom', offset: -2, fill: 'var(--ink-dim)', fontSize: 12 }} />
            <YAxis scale="log" domain={['auto', 'auto']} stroke="var(--ink-dim)" tick={{ fontSize: 11 }} tickFormatter={powerOfTen} width={52} allowDataOverflow />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Additive" stroke={COLORS.additive} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="xMult (×1.5/r)" stroke={COLORS.xmult} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Retrigger (×2/r)" stroke={COLORS.retrigger} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <p className="muted" style={{ marginBottom: 0 }}>
          On a log axis additive growth bends flat while ×Mult and retrigger stay straight lines —
          only multiplicative/retrigger engines keep pace with the ante curve (strategy-corpus §3, §5).
        </p>
      </div>
    </section>
  )
}
