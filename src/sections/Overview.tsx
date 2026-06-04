export function Overview() {
  return (
    <section>
      <div className="panel">
        <h2>The scoring identity: Chips × Mult</h2>
        <p>
          Every played hand scores <span className="chips">Chips</span> ×{' '}
          <span className="mult">Mult</span>. Because it is a product, the cheapest
          way to grow your score is to raise whichever factor is currently smaller —
          and past Ante ~5 the requirement grows so fast that only{' '}
          <strong>×Mult and retriggers</strong> keep pace.
        </p>
        <ol className="muted">
          <li>Base chips (hand) + played-card chips + joker chips → total <span className="chips">Chips</span>.</li>
          <li>Base mult (hand) + additive +Mult → running <span className="mult">Mult</span>.</li>
          <li>×Mult jokers apply <strong>left → right</strong>, each multiplying the running Mult.</li>
        </ol>
        <p className="muted">
          Full breakdown and citations live in the Simulator and{' '}
          <code>balatro-handguide.md</code>.
        </p>
      </div>
    </section>
  )
}
