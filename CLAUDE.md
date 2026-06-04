# CLAUDE.md — agent onboarding

Read this first. It's the project memory so you don't have to re-scan the whole repo.

## What this is
An interactive **competitive Balatro handbook** (web app) focused on **infinite / endless
scoring** — score simulator, build tier list, scaling charts, ante-by-ante routes, and engine
diagrams. Static SPA, no backend.

- **Live:** https://lucas-pcs.github.io/balatro-web-demo/
- **Repo:** github.com/lucas-pcs/balatro-web-demo (auto-deploys on push to `main`)

## Scope (important)
Target audience is **pro/endless players** (Blueprint, Baron+Mime, Triboulet, Perkeo loops, etc.).
The Spec Kit docs at the root (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`, `resources.md`)
describe an **earlier BEGINNER scope that was SUPERSEDED** — keep them for history but **do not treat
them as current requirements**. The competitive direction is what ships.

## Stack & commands
Vite 6 + React 18 + TypeScript. Charts: Recharts. Drag-reorder: @dnd-kit.

> **PATH:** Node/npm are Homebrew installs. If `npm`/`node` aren't found, run
> `export PATH="/opt/homebrew/bin:$PATH"` first.

```bash
npm install
npm run dev            # http://localhost:5173  (use -- --host for phone testing)
npm run build          # tsc -b + vite build -> dist/  (GitHub Pages ready)
npm run preview        # serve the production build
npx tsx scripts/check.ts   # validate the scoring engine (Flush L1 must = 77 x 4 = 308)
```

Deploy is automatic: push to `main` → `.github/workflows/deploy.yml` builds and publishes to Pages.
`vite.config.ts` sets `base: './'` so assets resolve at the `/balatro-web-demo/` subpath — keep it.

## Layout
```
src/
  main.tsx, App.tsx        # tab shell; default/landing tab = Simulator
  index.css                # ALL styles (dark Balatro theme); appended per feature
  data/                    # typed datasets — the source of truth for the UI
    types.ts               # shared domain + scoring I/O types
    hands.ts, antes.ts     # poker-hand base/planet scaling; ante requirements + endless wall
    jokers.ts              # 50-joker display metadata (name, role, cost, effect, scaling param)
    jokerSprites.ts        # atlas cell positions per joker id (generated)
    archetypes.ts, anteRoutes.ts, bosses.ts
  engine/
    score.ts               # scoreHand() evaluator: Chips x Mult, retriggers, copies, held engines
    jokerEffects.ts        # per-joker mechanics (slot / retriggerPlayed / retriggerHeld fns)
    presets.ts             # ready-made builds loaded by the Simulator
  components/JokerSprite.tsx  # renders a joker face from the CSS atlas (+soul overlay for legendaries)
  sections/                # one file per tab: Simulator, Overview, Builds, Charts, Route, Diagrams
public/
  jokers/Jokers.png        # Balatro joker sprite atlas (710x1520, 71x95 cells, 10x16 grid)
  diagrams/*.svg           # rendered engine diagrams (embedded by the handbook)
  og-image.png             # social/WhatsApp preview banner
diagrams-src/*.excalidraw  # diagram sources
tools/render_svg.py        # dependency-free .excalidraw -> .svg converter (see gotcha below)
research/strategy-corpus.md # all numbers, with sources
balatro-handguide.md       # offline competitive handbook (mirrors the app)
```

## How things connect
- **Scoring:** `Score = Chips × Mult`. `scoreHand()` in `engine/score.ts` runs hand base →
  played cards → held cards → jokers (left→right). ×Mult multiplies everything to its left, so
  **joker order matters**. Blueprint copies the joker to its right; Brainstorm copies the leftmost.
- **A joker lives in 3 places** — to add/change one, update all:
  1. `engine/jokerEffects.ts` (mechanics), 2. `data/jokers.ts` (display metadata),
  3. `data/jokerSprites.ts` (atlas position). `JOKER_BY_ID` and `JOKER_SPRITES` are keyed by the same id.
- **Numbers must be sourced.** Values come from `research/strategy-corpus.md`
  (balatrowiki.org, the Steam scoring guide, and `efhiii/balatro-calculator`'s `cards.js`). Cite when adding.

## Conventions
- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `security:`). Co-author trailer:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Mobile-first: wrap tables in `.tablewrap`; grids collapse to one column under 540px. Test at 375–390px.
- Data-driven UI: add content to `src/data/*`, not hardcoded in components.

## Gotchas
- **Diagram rendering:** the vendored Excalidraw skill's Playwright/esm.sh renderer **does not work
  here** (headless browser can't load the esm.sh bundle). Regenerate diagrams with the local converter:
  `bash render-diagrams.sh` (wraps `tools/render_svg.py`). The vendored skill (`tools/excalidraw-diagram/`)
  is **git-ignored** — not in the repo.
- **Screenshots/validation:** you can rasterize local SVG/HTML or screenshot `localhost` via the
  Playwright Chromium in `tools/excalidraw-diagram/references` (offline file:// + localhost work; external
  network in headless does not — run such Bash with the sandbox disabled).
- **Art is game IP** (© LocalThunk) — attribution is in `README.md` and `LICENSE`; don't relicense it.
- **History was rewritten once** (filter-repo, to scrub a leaked local path). On other clones use
  `git fetch && git reset --hard origin/main`, not `git pull`.

## License & security
MIT (`LICENSE`) for the code; game assets excluded. Report vulns via GitHub private advisories (`SECURITY.md`).
