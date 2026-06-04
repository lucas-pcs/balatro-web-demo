# Plan — Balatro Beginner Handguide (HOW)

> How we'll satisfy `spec.md` within `constitution.md`. Implementation decisions only.

## Deliverable
A single file: `balatro-handguide.md`.

## Structure (~8–12 sections, mapped to spec topics)
1. How to read this guide (30-second orientation)
2. The core loop
3. How scoring works (Chips × Mult)
4. Pick your hand (poker hands ranked + commit to 1–2)
5. Planet cards (level your hand)
6. Jokers: the scoring engine (3-part template + ordering rule)
7. Money & the shop (economy)
8. Thinning your deck
9. Beating boss blinds
10. 2–3 starter builds (archetypes with joker priorities)
11. Common mistakes → quick fixes
12. **Appendix: one-page cheat sheet**

Each section: a 1–3 sentence intro, then a **table or checklist**. Bold the decision triggers.

## Voice & format
- Plain, second-person ("you"), beginner-safe. No assumed vocabulary.
- Markdown tables for rankings/thresholds; checklists for per-round decisions.
- Keep each section short enough to glance at mid-game.

## Sourcing approach
- Ground content in `resources.md`.
- For **mechanics** (formulas, hand base values, interest), prefer the **Balatro Wiki**.
- For **strategy** (which jokers, build order, common mistakes), prefer **Balatro University / SteelSeries / GAMES.GG**.
- If sources conflict on a number, note it briefly and take the wiki's value.
- Pull only **beginner-relevant** jokers from tier lists — ignore high-stakes meta combos.

## Cheat-sheet appendix must contain
- The scoring formula.
- Hand-priority shortlist.
- The joker-ordering rule (+chips/+mult left of ×mult).
- Economy thresholds ($1/$5 interest, ≥$25 entering blinds, cap ~$5).
- A per-round decision checklist (build → buy → hold).

## Validation step (before declaring done)
Re-read the draft against `constitution.md` scope rules and `spec.md` acceptance criteria; **trim anything out of scope** (endless, high-score scaling, advanced decks/stakes, full joker catalog).
