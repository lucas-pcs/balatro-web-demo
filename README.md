# Balatro Pro Handbook — Infinite Scaling

An interactive, mobile-friendly competitive **Balatro** handbook focused on infinite/endless
scoring. Built with Vite + React + TypeScript.

**Features**
- 🧮 **Score simulator** — build a hand + a drag-ordered joker board and watch `Chips × Mult`
  resolve step by step (validated against a hand-computed baseline and the documented scoring order).
- 🏆 **Build tier list** — S/A/B archetypes with a sortable ceiling / consistency / setup / fragility matrix.
- 📈 **Scaling charts** — ante score-requirement curve, the endless "naneinf" wall (log scale),
  and additive-vs-×Mult-vs-retrigger growth shapes.
- 🗺️ **Ante-by-ante survival routes** for the top engines + a boss-threat reference.
- 🖼️ **Engine diagrams** generated with the Excalidraw diagram skill.

A full offline write-up lives in [`balatro-handguide.md`](./balatro-handguide.md). Numbers are
sourced in [`research/strategy-corpus.md`](./research/strategy-corpus.md).

## Run locally

Requires Node ≥ 18 (built on Node 26).

```bash
npm install
npm run dev      # http://localhost:5173
```

Open the printed URL on your phone (same Wi-Fi, use your machine's LAN IP, e.g.
`http://192.168.x.x:5173`) to test the mobile layout.

## Build & preview

```bash
npm run build    # type-checks then emits static files to dist/
npm run preview  # serve the production build locally
```

## Deploy to GitHub Pages

`vite.config.ts` sets `base: './'`, so the static build works from any subpath (including
`https://<user>.github.io/<repo>/`).

1. Push this repo to GitHub.
2. `npm run build` and publish the `dist/` folder — either with the **GitHub Pages → Deploy from
   branch** option pointing at a `gh-pages` branch, or an action such as
   [`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages) uploading `dist`.

Because the bundle is fully static there is no server to run.

## Engine diagrams (Excalidraw skill, optional)

Diagrams are produced with the [`coleam00/excalidraw-diagram`](https://github.com/coleam00/excalidraw-diagram-skill)
skill, vendored under `tools/excalidraw-diagram/`. The skill renders each diagram to PNG/SVG and
visually self-validates via a headless Chromium. One-time renderer setup:

```bash
cd tools/excalidraw-diagram/references
uv sync
uv run playwright install chromium
```

Rendered assets are exported to `public/diagrams/*.svg`. Until then the Diagrams tab shows a
graceful placeholder per diagram.

## Project structure

```
src/
  engine/        score.ts (evaluator), jokerEffects.ts (joker mechanics), presets.ts
  data/          types.ts + hands, jokers, antes, archetypes, anteRoutes, bosses
  sections/      Overview, Simulator, Builds, Charts, Route, Diagrams
research/         strategy-corpus.md (sourced numbers)
tools/            excalidraw-diagram (vendored skill, not part of the app bundle)
balatro-handguide.md   offline handbook
```

## Joker art

Joker faces are drawn from the Balatro sprite atlas (`public/jokers/Jokers.png`, 71×95 cells)
rendered via CSS background-position — see `src/data/jokerSprites.ts` (positions sourced from the
open-source `efhiii/balatro-calculator`) and `src/components/JokerSprite.tsx`. The artwork is
Balatro game property (© LocalThunk), included only for this non-commercial fan reference.

## Disclaimer

Fan-made strategy reference. Not affiliated with Balatro or LocalThunk. Numbers reflect the live
meta as cited; verify against the in-game calculator for your exact build.
