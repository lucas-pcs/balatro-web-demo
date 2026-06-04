# Balatro Competitive Strategy Corpus — Infinite / Endless Scaling

> **Audience:** Competitive / pro players chasing INFINITE (endless-mode) scores. This is a scaling-meta reference, not a beginner guide.
>
> **Primary sources** (cited inline as well):
> - **balatrowiki.org** — mechanics, hand tables, ante requirements, editions/seals, vouchers.
> - **Steam guide:** "Score Calculation in Balatro: A Comprehensive Guide" — https://steamcommunity.com/sharedfiles/filedetails/?id=3169032575 (order of operations / scoring phases).
> - **efhiii/balatro-calculator** (open-source scoring model) — https://github.com/efhiii/balatro-calculator — exact joker `config` values, rarity, and cost are read directly from its `cards.js` data file.
> - Tier-list / build community: Switchblade Gaming, GAMES.GG, twoaveragegamers, propelrc/choostgames, mattgreer.dev/blog/balatro-score-growth.
>
> **Note on the Fandom wiki:** balatrogame.fandom.com returns HTTP 403 to automated fetches, so figures here are taken from balatrowiki.org, the Steam guide, and the calculator's data files. Conflicts are flagged in §9.
>
> **Convention used throughout:** `+Chips` = additive chips, `+Mult` = additive mult, `×Mult` (written `X`) = multiplicative mult. "Scored" card = a card that is part of the played poker hand (or every card if Splash is present).

---

## 1. SCORING FORMULA & ORDER OF OPERATIONS

### 1.1 The core identity

```
Hand Score = Chips × Mult
```

Per balatrowiki.org/w/Score: *"The score of a single hand is calculated by multiplying the Chips and Mult the player gained for that hand."* The blind's total is the **sum** of every hand's score played during that blind.

`Chips` and `Mult` are two independent running accumulators. The whole game of scaling is: pump Chips and Mult as high as possible, but because score is their **product**, the dominant lever is almost always **×Mult** (multiplicative), not additive terms.

### 1.2 The four scoring phases (Steam guide order of operations)

Source: Steam "Score Calculation in Balatro: A Comprehensive Guide" (id=3169032575).

**Phase 0 — Hand level / pre-modifiers.** Before base values are read, level changes resolve: Space Joker (1-in-4 to level the played hand), The Arm boss (−1 level to the played hand), Burnt Joker (levels the first discarded hand). The Flint boss then **halves base chips AND base mult, rounded up.**

**Phase 1 — Base hand chips & mult.** The game identifies the poker hand and seeds the accumulators with that hand's **base Chips and base Mult at its current level** (see §2 table).

**Phase 2 — Scored played cards (LEFT → RIGHT in the order they sit in the played hand).** For each scoring card, in order:
1. Card's chip value: 2–10 = face value, **J/Q/K = 10, Ace = 11**.
2. Enhancement: Bonus card +30 chips, Mult card +4 mult, Glass ×1.5 mult, Stone +50 chips, Lucky (1-in-5 +20 mult / 1-in-15 +$20), Steel (only when *held*, see Phase 3), Gold (only $ at end of round).
3. Edition: Foil **+50 chips**, Holographic **+10 mult**, Polychrome **×1.5 mult** (applied when that card scores).
4. Seal: Gold = $3, Red = **retrigger this card once** (re-runs steps 1–4 for that card).
5. Retriggers from jokers fire here (Hack, Sock & Buskin, Hanging Chad, Dusk, Seltzer) — each retrigger re-runs the card's full scoring.

**Phase 3 — Held-in-hand card effects (left → right of cards still in hand).** Steel card **×1.5 mult**; King + Baron **×1.5 mult**; Queen + Shoot the Moon +13 mult; Red seal retriggers the held effect; **Mime retriggers all held-in-hand abilities once.** Debuffed cards do nothing.

**Phase 4 — Jokers (LEFT → RIGHT in joker-tray order).** Each joker resolves in slot order. Edition timing on jokers: **Foil +50 chips and Holographic +10 mult apply *directly before* the joker's own effect; Polychrome ×1.5 applies *directly after* the joker's effect** (balatrowiki.org/w/Editions). Scaling jokers that "gain" value upgrade *before* they pay out that hand.

**Phase 5 (deck-specific).** Plasma Deck averages Chips and Mult *after* all four phases, immediately before the final multiply.

### 1.3 Why joker ORDER is the whole game

Because Mult is one accumulator processed left→right, the rule is:

> **Put `+Mult` and `+Chips` jokers on the LEFT, `×Mult` jokers on the RIGHT.**

A `×Mult` joker multiplies *everything accumulated to its left*. So additive bonuses must already be in the pot before the multipliers hit, and you want multipliers stacked so each one also scales the previous multiplier's output. Example: `+30 mult` then `×4` → (base+30)×4. Reversed → base×4 then +30, far less. With multiple ×Mult jokers, their product is order-independent among themselves, but they must all sit right of every additive source.

**Edition placement:** a Polychrome (×1.5) is best on your **right-most / biggest ×Mult joker** (or on a played card you retrigger), because ×1.5 multiplies the running total at that point.

### 1.4 Retriggers — exact behavior

| Joker | Effect | Rarity / Cost |
|---|---|---|
| **Hack** | Retrigger each played **2, 3, 4, 5** one extra time | Uncommon / $6 |
| **Sock and Buskin** | Retrigger all played **face cards** one extra time | Uncommon / $6 |
| **Hanging Chad** | Retrigger the **first** scored card **2 additional** times (3 total) | Common / $4 |
| **Dusk** | Retrigger all played cards on the **final hand of the round** | Uncommon / $5 |
| **Seltzer** | Retrigger all played cards for the next **10 hands**, then self-destructs | Uncommon / $6 |
| **Mime** | Retrigger all **held-in-hand** abilities once | Uncommon / $5 |
| **Red Seal** (on a card) | Retrigger that card once (both scored and held effects) | — |

Retriggers stack multiplicatively with everything: a retriggered Glass card applies its ×1.5 again; a retriggered held King under Baron applies ×1.5 again. This is the backbone of the held-card engines (§5).

---

## 2. POKER HAND TABLE (base values + planet scaling)

Source: balatrowiki.org/w/Poker_Hands. Each hand's planet card adds a fixed chip/mult increment per level.

| Hand | L1 Chips × Mult | Planet card | Per-level +Chips / +Mult |
|---|---|---|---|
| High Card | 5 × 1 | **Pluto** | +10 / +1 |
| Pair | 10 × 2 | **Mercury** | +15 / +1 |
| Two Pair | 20 × 2 | **Uranus** | +20 / +1 |
| Three of a Kind | 30 × 3 | **Venus** | +20 / +2 |
| Straight | 30 × 4 | **Saturn** | +30 / +3 |
| Flush | 35 × 4 | **Jupiter** | +15 / +2 |
| Full House | 40 × 4 | **Earth** | +25 / +2 |
| Four of a Kind | 60 × 7 | **Mars** | +30 / +3 |
| Straight Flush | 100 × 8 | **Neptune** | +40 / +4 |
| Royal Flush | 100 × 8 | (levels with Straight Flush via Neptune) | +40 / +4 |
| **Five of a Kind** † | 120 × 12 | **Planet X** | +35 / +3 |
| **Flush House** † | 140 × 14 | **Ceres** | +40 / +4 |
| **Flush Five** † | 160 × 16 | **Eris** | +50 / +3 |

† Secret hands. They require enhancement/deck tricks (e.g. a deck of one rank + one suit, or Wild cards) but are the **highest base-value hands in the game** and are the preferred scoring hand for top endless builds because they start at 160×16 and scale fastest in raw chips.

**Worked example (Flush, the classic mid-game vehicle):** L1 = 35 × 4. Per level +15/+2. So **L5 = 95 × 12**, L10 = 170 × 22. Levels are uncapped — endless builds routinely push a single hand to level 30–50+ via Telescope-targeted Celestial packs, the Observatory voucher, and Constellation/Astronomer.

**Why hand level is half the engine:** leveling raises *both* the chip seed and the additive base mult. A high hand level feeds a large pre-multiplier pot that your ×Mult jokers then explode. Endless runs win by leveling **one** hand relentlessly (usually Flush or a secret Flush-X) rather than spreading planets.

---

## 3. ANTE SCORE REQUIREMENTS

Source: balatrowiki.org/w/Ante and /w/Blinds. **Within an ante:** Small Blind = 1× the ante base, Big Blind = 1.5×, Boss Blind = 2× (some bosses override — see §8).

### Base ante requirement (White Stake)

| Ante | Base chips |
|---|---|
| 1 | 300 |
| 2 | 800 |
| 3 | 2,000 |
| 4 | 5,000 |
| 5 | 11,000 |
| 6 | 20,000 |
| 7 | 35,000 |
| 8 | 50,000 |

Higher stakes raise antes 2–8 (e.g. Green+ → Ante 8 = 100,000; Purple+ → Ante 8 = 200,000). The base table above is the White-Stake reference.

### Endless scaling (Ante 9+)

balatrowiki.org states the requirement as a function of the Ante-8 value, rounded to two significant digits:

```
Chip Requirement = (Ante-8 Requirement) · ( 1.6 + (0.75·(Ante−8))^(1 + 0.2·(Ante−8)) )^(Ante−8)
```

Authoritative output values (the numbers the game actually checks against):

| Ante | Required score |
|---|---|
| 9 | 110,000 |
| 10 | 560,000 |
| 12 | 3.0 × 10⁸ (300 million) |
| 16 | 8.6 × 10²⁰ |
| 20 | 4.3 × 10⁴³ |
| 30 | 2.1 × 10¹⁴⁹ |
| 39 | 4.8 × 10³⁰⁹ |

> **The Ante 39 wall.** At Ante 39 the requirement (~4.8e309) exceeds the double-precision float ceiling (~1.8e308) and overflows to **"naneinf"** (NaN). Because any score < NaN comparison fails, **Ante 39 is the practical hard cap of endless mode** — the community "win" condition for an infinite build is reaching/surviving to Ante 39, not an arbitrary score. Growth is roughly **×5 per ante early-endless rising toward ×10–×100+ per ante** by the late 20s/30s, so a build must scale *super-exponentially per round* to keep pace (this is why only truly compounding engines — §5 — survive deep endless).

---

## 4. COMPETITIVE JOKER REFERENCE

All `config` numbers, rarity, and cost below are read from **efhiii/balatro-calculator `cards.js`** unless noted. Rarity: Common(1)/Uncommon(2)/Rare(3)/Legendary(4).

### 4.1 Flat / conditional CHIP jokers (Phase-4 additive chips — left side)
| Joker | Effect | Rarity / Cost |
|---|---|---|
| Sly / Wily / Clever / Devious / Crafty | +50 / +100 / +80 / +100 / +80 chips if hand contains Pair / 3oaK / 2-Pair / Straight / Flush | Common / $3–4 |
| Banner | +30 chips per **remaining discard** | Common / $5 |
| Bull | +2 chips per **dollar** held | Uncommon / $6 |
| Blue Joker | +2 chips per card remaining in deck (full deck ≈ +104) | Common / — |
| Stone Joker | +25 chips per Stone card in full deck | Uncommon / $6 |
| Stuntman | **+250 chips**, −2 hand size | Rare / $7 |

### 4.2 Flat / conditional ADDITIVE-MULT jokers (left side)
| Joker | Effect | Rarity / Cost |
|---|---|---|
| Joker | +4 mult | Common / $2 |
| Jolly / Zany / Mad / Crazy / Droll | +8 / +12 / +10 / +12 / +10 mult on Pair / 3oaK / 2-Pair / Straight / Flush | Common / $3–4 |
| Half Joker | +20 mult if hand ≤ 3 cards | Common / $5 |
| Mystic Summit | +15 mult if 0 discards remaining | Common / $5 |
| Fibonacci | +8 mult per played A/2/3/5/8 | Uncommon |
| Even Steven / Odd Todd | +4 mult per even card / +31 chips per odd card | Common / $4 |
| Scary Face / Smiley Face | +30 chips / +5 mult per played face card | Common / $4 |
| Walkie Talkie | +10 chips & +4 mult per played 10 or 4 | Common / $4 |
| Bootstraps | +2 mult per $5 held | Uncommon / $7 |

### 4.3 SCALING additive-mult jokers (grow over the run — left side, but they feed the multipliers)
| Joker | Scaling rule | Rarity / Cost |
|---|---|---|
| **Supernova** | +Mult equal to the number of times this poker hand has been played | Common / $5 |
| **Ride the Bus** | +1 mult per consecutive hand with **no** face card (resets on a face card) | Common / $6 |
| **Green Joker** | +1 mult per hand played, −1 per discard | Common / $4 |
| **Spare Trousers** | +2 mult each time a Two Pair is played | Uncommon / $6 |
| **Flash Card** | +2 mult per shop **reroll** | Uncommon / $5 |
| **Fortune Teller** | +1 mult per Tarot used this run | Common / $6 |
| **Runner** | +15 chips each time a Straight is played | Common / $5 |
| **Square Joker** | +4 chips each time a hand is exactly 4 cards | Common / $4 |
| **Castle** | +3 chips per discarded card of a (rotating) suit | Uncommon / $6 |
| **Wee Joker** | +8 chips each time a 2 is scored | Rare / $8 |
| **Hiker** | every scored card permanently gains +5 chips | Uncommon |
| **Ice Cream / Popcorn** | decaying +chips/+mult (anti-scaling; ramp deck only) | Common/Uncommon |

### 4.4 ×MULT jokers (right side — the payoff)
| Joker | Effect | Rarity / Cost |
|---|---|---|
| The Duo / Trio / Family / Order / Tribe | **×2 / ×3 / ×4 / ×3 / ×2** if hand contains Pair / 3oaK / 4oaK / Straight / Flush | Rare / $8 |
| Card Sharp | ×3 mult if this hand type already played this round | Uncommon / $6 |
| Cavendish | ×3 mult (1-in-1000 self-destruct/round) | Common / $4 |
| Seeing Double | ×2 mult if a scoring Club + a scoring card of any other suit | Uncommon / $6 |
| Photograph | first scored face card gives ×2 mult | Common / $5 |
| Baseball Card | each **Uncommon** joker gives ×1.5 mult | Rare / $8 |
| Ramen | ×2 mult, loses ×0.01 per card discarded | Uncommon / $6 |
| **Hologram** | gains **×0.25 mult per playing card added to deck** | Uncommon / $7 |
| **Constellation** | gains **×0.1 mult per Planet card used** | Uncommon / $6 |
| **Vampire** | gains **×0.1 mult per scoring enhanced card** (strips its enhancement) | Uncommon / $7 |
| **Obelisk** | gains **×0.2 mult per consecutive hand that is NOT your most-played** (resets when you do) | Rare / $8 |
| **Lucky Cat** | gains **×0.25 mult per successful Lucky-card trigger** | Uncommon / $6 |
| **Glass Joker** | gains **×0.75 mult per Glass card destroyed** | Uncommon / $6 |
| **Campfire** | gains **×0.25 per card sold**, resets when Boss defeated | Rare / $9 |
| **Hit the Road** | gains **×0.5 per Jack discarded** (per round) | Rare / $8 |
| **Madness** | gains ×0.5 per Small/Big blind selected (destroys a random joker) | Uncommon / $7 |
| **Ancient Joker** | ×1.5 mult per played card of a rotating suit | Rare / $8 |
| **The Idol** | ×2 mult per played specific (rotating) rank+suit | Uncommon / $6 |
| **Baron** | each **King held in hand** gives **×1.5 mult** | Rare / $8 |
| **Steel Joker** | ×0.2 mult per Steel card in full deck (i.e. ×(1+0.2·n)) | Uncommon / $7 |
| **Throwback** | ×0.25 mult per blind skipped this run | Uncommon / $6 |

### 4.5 Retrigger jokers — see §1.4 table (Hack, Sock & Buskin, Hanging Chad, Dusk, Seltzer, Mime).

### 4.6 COPY jokers
| Joker | Effect | Rarity / Cost |
|---|---|---|
| **Blueprint** | Copies the ability of the joker **to its RIGHT** | Rare / **$10** |
| **Brainstorm** | Copies the ability of the **left-most** joker | Rare / **$10** |
| Joker Stencil | ×1 mult per empty joker slot (itself counts) | Uncommon / $8 |

Copies inherit the copied joker's *current* scaled value (a Blueprint on a ×9 Hologram is itself ×9). They are the cheapest way to **double or triple** an engine joker's effect — central to every infinite build.

### 4.7 ECONOMY / enabler jokers (buy time to assemble the engine)
| Joker | Effect | Rarity / Cost |
|---|---|---|
| To the Moon | +$1 interest per $5 held (raises the $25 interest cap) | Uncommon / $5 |
| Rocket | $1 + $2 per Boss defeated, end of round | Uncommon / $6 |
| Cloud 9 | $1 per 9 in full deck per round | Uncommon / $7 |
| Golden Ticket / Gold cards | $4 per scored Gold card | Common |
| Egg | +$3 sell value per round | Common |
| Credit Card | go up to −$20 in debt | Common / $1 |
| Reserved Parking / Business Card | $ from held/played face cards | Common |
| **Perkeo** | (legendary, also economy via consumables) — see §4.8 | Legendary / $20 |

### 4.8 LEGENDARY jokers (Soul-card only, rarity 4, base cost $20)
| Joker | Exact effect (cards.js) | Why it matters for infinite |
|---|---|---|
| **Triboulet** | Played **Kings and Queens each give ×2 mult** when scored | With Sock & Buskin (face retrigger) each K/Q applies ×2 twice → ×4 per card; multiple K/Q + copies = explosive multiplicative scaling on a single hand. |
| **Perkeo** | At end of shop, creates a **Negative copy of 1 random consumable** you hold | The engine of the #1 infinite loop (§5.4): duplicate a Planet/Tarot every shop at no slot cost. |
| **Yorick** | Gains **×1 mult per 23 cards discarded** (lifetime) | Slow but unbounded ×Mult; pairs with high-discard / Burnt builds. |
| **Canio** | Gains **×1 mult per face card destroyed** | Unbounded ×Mult fed by Glass/face-destruction (Hanging Chad + Glass faces, The Tooth, etc.). |
| **Chicot** | **Disables the effect of every Boss Blind** | Not a scaler, but it neutralizes The Wall / Verdant Leaf / debuff bosses entirely — the universal endless safety valve (§8). |

---

## 5. INFINITE-SCALING ENGINES (the core)

The distinction that matters: a joker that gains a *fixed* amount per action is **linear**; two such jokers feeding each other, or one that grows per-round in a compounding way, becomes **quadratic/exponential**; a loop that **multiplies a quantity that itself grows each shop** is **super-exponential / truly infinite** and is the only thing that keeps pace with the §3 ante curve into the 30s.

### 5.1 Baron + Mime (Kings-in-hand) engine
**Pieces:** Baron (each held King = ×1.5 mult), Mime (retrigger held-in-hand abilities), ideally **Steel Kings** (held Steel = ×1.5 too), plus Blueprint/Brainstorm copying Baron, and Red seals on Kings.

**Math.** Hold *k* Kings. Per King, Baron gives ×1.5. Mime retriggers the held effect once → each King contributes **×1.5 × ×1.5 = ×2.25**. Total from Baron alone ≈ **×2.25^k**. Add Blueprint→Baron and Brainstorm→Baron (two more ×1.5 instances per King) and Steel enhancement on those Kings (another ×1.5, also Mime-doubled), and each King is worth ×1.5 raised to (number of Baron-effects + steel) × (1 + retriggers). With a full hand of Steel Kings + Baron + Mime + both copies + Red seals, a single hand multiplies by **×1.5 to a double-digit exponent** — easily ×10⁴–×10⁶ from holds alone.

**Where the growth comes from:** *exponential in the number of Kings held* (×1.5^k) and in the number of retriggers. It is enormous but **per-round static** unless you keep adding Steel Kings (DNA, Glass/Steel tarots) or hand-size. To make it *endless* you pair it with relentless **hand-leveling** (Telescope/Observatory on your scoring hand) so the multiplied base keeps climbing each ante. Best with a small/optimized deck so you draw Kings reliably.

**Joker order:** all the held-card multipliers resolve in Phase 3 before jokers, so Baron/Mime slot order among themselves doesn't matter; place any Phase-4 ×Mult jokers to the right as usual, and put a Polychrome on your biggest ×Mult.

### 5.2 Triboulet + Sock & Buskin (face-card) engine
**Pieces:** Triboulet (K/Q each ×2 when scored), Sock & Buskin (retrigger played face cards), plus Photograph/Smiley, Blueprint/Brainstorm copying Triboulet, Pareidolia (all cards count as faces) and Hanging Chad (retrigger first card ×2 more).

**Math.** Play a hand of all Kings/Queens (e.g. Five of a Kind of Kings, or Flush House K/Q). Each scored K/Q = ×2. Sock & Buskin retriggers each face once → each K/Q = ×2 × ×2 = **×4**. Five scored K/Q → ×4⁵ = **×1024** just from Triboulet, before Blueprint (copy Triboulet → another ×2/×4 per card) and edition multipliers. With Blueprint→Triboulet + Brainstorm→Triboulet you get **three** ×2 instances per face per trigger; with Sock & Buskin (×2 triggers) and Hanging Chad (×3 triggers on the first card) the exponents stack to astronomical single-hand multipliers.

**Where the growth comes from:** *exponential in (number of scored K/Q) × (number of Triboulet copies) × (number of retriggers)*. Like Baron it's per-hand static, so it is paired with hand-leveling and with **Pareidolia** (turns every card into a face so a Flush Five all counts as ×4 each) to push the card count. Extremely high ceiling; the canonical "screenshot" build.

### 5.3 Blueprint / Brainstorm copy mechanics & placement
- **Blueprint copies the joker immediately to its RIGHT.** **Brainstorm copies the LEFT-MOST joker.**
- A copy inherits the target's **current scaled state** (a copy of a ×12 Hologram is ×12; a copy of Baron multiplies held Kings again).
- **Chaining:** Blueprint can copy another Blueprint/Brainstorm that copies a third joker, so two copy-jokers + one engine joker = **three** instances of that engine.
- **Placement rule for max value:** put your strongest engine joker where both copies can reach it — e.g. `[Brainstorm] … [engine] [Blueprint]` so Blueprint copies `engine` from the right and Brainstorm copies `engine` (as the left-most) — but in practice you set `engine` as left-most for Brainstorm and put Blueprint directly left of `engine`'s twin. The standard infinite layout is **Brainstorm in slot 1 copying the left-most engine, engine joker, Blueprint directly to its left** — verify in-run which adjacency the calculator shows highest.
- Copy jokers are *Rare, $10 each* and are the single biggest force-multiplier in the game: they convert one good engine joker into 2–3×.

### 5.4 Perkeo + Observatory (the true infinite loop) ⭐
**Pieces:** Perkeo (legendary), **Observatory voucher** (Planet cards held in your consumable area give **×1.5 mult** to their named hand), **Telescope voucher** (Celestial packs always contain the planet for your most-played hand), ideally Crystal Ball (+1 consumable slot) and Astronomer.

**The loop:**
1. You hold the Planet card for your scoring hand (say Jupiter for Flush). Observatory makes that held Planet worth **×1.5 mult** every time you play that hand.
2. **Perkeo, at the end of every shop, creates a Negative copy of a random held consumable.** Negative consumables **take no slot**. If your only/likely consumable is that Planet card, Perkeo keeps minting **negative copies of it**.
3. Each held copy of the Planet = another **×1.5** from Observatory. After *n* shops you hold ~*n* copies → **×1.5ⁿ mult**, compounding every shop, **forever, at zero slot cost.**

**Where the infinite comes from:** the multiplier is **×1.5^(number of Planet copies held)** and the number of copies **increases every shop without bound and without consuming resources.** Unlike Baron/Triboulet (per-hand static), this grows *per-shop multiplicatively*, which is exactly the shape needed to outrun the §3 ante curve into Ante 30+. It is the community-consensus #1 genuinely-infinite engine. (Pairs naturally with continued hand-leveling, and you can seed it: hold a Tarot you want, let Perkeo go Negative on it, etc.)

### 5.5 Other genuinely scaling loops
- **Yorick:** ×1 mult per 23 cards discarded — unbounded but slow; needs a high-discard, deck-thinning shell (Burnt Joker, extra discards from Petroglyph/Drunkard). Multiplicative and uncapped.
- **Canio:** ×1 mult per **face card destroyed** — feed it with Glass face cards that shatter, The Tooth, Hanging Chad on glass, Immolate. Unbounded ×Mult.
- **Hologram + Constellation (polynomial/"quadratic" engine):** Hologram gains ×0.25 per card *added to deck*; Constellation gains ×0.1 per *Planet used*. Run a deck-adding + planet-using shell (Certificate, DNA, Cartomancer, lots of Celestial packs) and both climb every round. Multiply them together (and copy with Blueprint) for a polynomial-in-rounds ×Mult. mattgreer.dev/blog/balatro-score-growth classifies these as the bridge between linear and exponential growth.
- **Glass-card build:** Glass Joker gains ×0.75 per Glass card destroyed. Play many Glass cards (each also ×1.5 when scored) and let them break (1-in-4 per use) → Glass Joker climbs while the cards themselves multiply. Self-limiting (deck shrinks) but pairs with Marble/DNA replenishment.
- **Lucky / Bloodstone:** Lucky Cat gains ×0.25 per successful Lucky trigger; Bloodstone is 2-in-3 chance for ×1.5 mult per Heart. With **Oops! All 6s** (doubles all probabilities) + retriggers (Hack/Seltzer) + many Lucky/Heart cards, triggers per hand multiply and Lucky Cat ramps fast. Strong, high-variance.
- **Steel Joker + Baron synergy:** Steel Joker is ×(1+0.2·n) for *n* Steel cards in deck; in a Steel-King Baron deck it doubles as a passive multiplier that grows as you add Steel cards.

---

## 6. TIER LIST OF BUILDS / ARCHETYPES

Ceiling = how deep into endless it scales; Consistency = how reliably it comes online; Setup = how fast; Fragility = how easily a boss/RNG breaks it. (Synthesis of Switchblade, GAMES.GG, twoaveragegamers, propelrc tier lists + the scaling math above.)

### S-Tier (genuinely infinite — clears Ante 20+ → 39)
| Build | Ceiling | Consistency | Setup | Fragility |
|---|---|---|---|---|
| **Perkeo + Observatory + Telescope** | Infinite (×1.5/shop compounding) | High once assembled | Slow (needs legendary + 2 vouchers) | Low — Chicot/sell-immune; safest infinite |
| **Baron + Mime (+ Blueprint/Brainstorm, Steel Kings)** | Near-infinite (×1.5^k holds + leveling) | High (small deck draws Kings) | Medium | Med — hand-size & face-debuff bosses, Verdant Leaf |
| **Triboulet + Sock & Buskin (+ copies, Pareidolia)** | Near-infinite (×4 per face, exponential) | Med-High | Slow (needs legendary) | Med-High — face-card debuff bosses (The Plant/The Mark) |

### A-Tier (clears Ante 8 comfortably, scales well into low endless)
| Build | Notes |
|---|---|
| **Flush / Secret-Flush leveling + Tribe/Droll/Crafty** | Telescope on Flush, Jupiter spam; reliable chip+mult vehicle, great backbone for any S engine. |
| **Hologram + Constellation polynomial** | Strong polynomial ×Mult; needs deck-add + planet shell; consistent, copy-friendly. |
| **Glass-cannon (Glass Joker + Glass deck)** | High ceiling, self-limiting; needs replenishment. |
| **Lucky Cat + Oops All 6s + retriggers** | Fast-ramping ×Mult; high variance. |
| **Vampire / Campfire ×Mult scalers** | Solid uncapped ×Mult if fed (enhanced cards / selling). |

### B-Tier (reliable to Ante 8, stalls in mid-endless without an S/A core)
| Build | Notes |
|---|---|
| Supernova / Ride the Bus / Green Joker additive-mult ramp | Linear; great early, falls off vs the exponential ante curve. |
| Economy/Flint-tax decks (Bull, Bootstraps) | Money→chips; needs a multiplier to convert. |
| Stuntman / big-chips no-multiplier | Chips without ×Mult plateaus hard. |
| Half Joker / Stone / "fat chip" piles | Fine to Ante 8, no endless legs. |

**Universal rule:** every endless winner is **(a) a multiplicative engine that compounds per round + (b) a single hand leveled relentlessly + (c) Blueprint/Brainstorm to double the engine.** Additive-mult builds (B-tier) are early-game scaffolding you upgrade *out of*.

---

## 7. ANTE-BY-ANTE SURVIVAL ROUTES (top S-tier builds)

General economy spine for all routes: **keep $25+ for the +$5/round interest cap** (To the Moon raises it), reroll only with spare cash above $25 early, and **prioritize one scoring hand to level** from Ante 1.

### 7.1 Route A — Perkeo + Observatory (the safe infinite)
- **Antes 1–3 (build economy + a hand):** Play your most-frequent hand (Pair→Flush). Buy any cheap +mult joker (Joker, Jolly, a Crafty) and an economy joker (To the Moon / Rocket). **Take Telescope** the moment it appears in the shop. Bank money; survive on raw hand value. Skip blinds for Tags only if you can still clear the boss.
- **Antes 4–6 (lock the voucher + leveling):** Buy Celestial packs (Telescope makes them hand-targeted) and level your scoring hand to ~L5–8. **Take Observatory** (requires Telescope's slot / 25 planets used to unlock). Pick up Crystal Ball (+1 consumable slot) so you can hold the Planet card. Keep a backup defensive joker for boss antes.
- **Ante 7–8 (find Perkeo):** Open Arcana/Spectral/buy Soul cards (Hieroglyph/Spectral packs) chasing **Perkeo**. The instant you have Perkeo + Observatory + a held scoring Planet, the loop is live: each shop Perkeo mints a Negative Planet copy → Observatory ×1.5 per copy. Clear Ante 8 boss with the now-multiplied hand.
- **Endless (9→39):** Do nothing but **buy/open Celestial packs to keep leveling the hand, hold your Planet, let Perkeo compound every shop.** Add Blueprint/Brainstorm to copy any secondary ×Mult. Keep **Chicot** (or Luchador) on hand for nasty bosses. The ×1.5^n shop-compounding outruns the ante curve to the Ante-39 float cap.

### 7.2 Route B — Baron + Mime (Kings-in-hand)
- **Antes 1–3:** Thin the deck toward Kings; play Pairs/High-card. Grab any early mult joker and **economy**. Watch for **Baron** (Rare). Start collecting Steel via Arcana (The World/Justice → Steel) on Kings.
- **Antes 4–6:** Land **Baron**; add **Mime** (held retrigger doubles every King). Convert Kings to **Steel** (held Steel ×1.5, also Mime-doubled). Add Red seals to Kings if Spectral allows. Level a cheap hand (even High Card / Pair works since the holds do the lifting).
- **Ante 7–8:** Add **Blueprint** directly to copy Baron, and **Brainstorm** copying Baron — now 3× the held-King multiplier. Optimize hand to draw a full hand of Steel Kings; play, holding max Kings. One hand now scores into the millions.
- **Endless:** Keep adding Steel Kings (DNA, more Steel tarots) and **keep leveling the played hand** so the multiplied base climbs. Manage hand-size bosses (The Manacle) and the Psychic (must play 5) — see §8. Aim to hold the maximum Kings every hand.

### 7.3 Route C — Triboulet + Sock & Buskin (face engine)
- **Antes 1–4:** Play face-heavy hands; collect **Photograph / Smiley**. Build economy. Begin steering deck toward Kings/Queens (Tarots that change rank, or a one-rank deck plan for Flush House/Five of a Kind of K/Q).
- **Antes 5–7:** Chase **Triboulet** (Soul cards). Add **Sock & Buskin** (face retrigger → each K/Q ×4). Add **Pareidolia** so every card counts as a face (turns a Flush Five into five ×4 faces).
- **Ante 8 → endless:** Add **Blueprint + Brainstorm** copying Triboulet (three ×2 instances per face). Play your highest-base face hand (Five of a Kind / Flush House of Kings) and level it with Telescope. Hold **Chicot** for The Plant/The Mark face-debuff bosses (they otherwise turn the whole engine off).

---

## 8. BOSS BLIND THREATS & ROUTING

Source: balatrowiki.org/w/Blinds for effects; routing is build-specific.

| Boss | Effect | Who it hurts / how to route |
|---|---|---|
| **The Wall** | Requires **4× base chips** (instead of 2×) | Pure score check — only hurts under-scaled builds. S-tier engines ignore it; weaker builds pre-level a hand or hold a saved Planet/×Mult to spike. |
| **The Needle** | Only **1 hand** allowed; needs just **1× base** | Rewards one-big-hand engines (Baron/Triboulet/Perkeo all play one nuke hand anyway) — often the *easiest* boss for S-tier. Death to multi-hand grinders. |
| **The Manacle** | **−1 hand size** | Hits **Baron+Mime** hardest (one fewer King held = lose a ×1.5–×2.25 factor). Route: have hand-size buffer (Turtle Bean, Stuntman avoided), or Chicot/Luchador. |
| **The Psychic** | Must play **5 cards** | Reduces Kings *held* in Baron build (more cards committed). Hold what you can; or Chicot. |
| **Verdant Leaf** (Showdown) | All cards **debuffed until you sell a Joker**; 2× | Catastrophic for **every** card-scoring build (debuffed Kings/faces = no mult). Route: sell a throwaway joker to clear it, or **Chicot** disables it outright. Keep one sacrificial joker. |
| **The Plant** | Debuffs all **face cards** (Ante 4+) | Kills **Triboulet/Baron** (Kings/Queens score nothing). Route: **Chicot**, Luchador (sell to disable), or play a non-face scoring hand that round. |
| **The Mark** | All face cards drawn **face-down** | Same victims as The Plant — Chicot/Luchador, or Pareidolia doesn't help (still hidden). Play around with a non-face hand. |
| **The Head** | Debuffs all **Heart** cards | Hurts Heart-suit Flush/Bloodstone builds; reroute suit or Chicot. |
| **The Ox** | Playing your **most-played hand** sets money to **$0** | Hurts economy timing, and Perkeo's shop loop indirectly (no $ to buy packs that round). Play a different hand once; engines that score on a single fixed hand can eat the $0 once. |
| **The Eye / The Mouth** | No repeat hand types / only one hand type all blind | Forces hand diversity — punishes single-hand leveling builds. Route: have a second viable hand, or it's a non-issue once your one hand one-shots the blind. |
| **The Flint** | **Halves base chips & mult** of every hand | Hurts low-level-hand, holds-only builds (Baron with unleveled hand). Route: keep your scoring hand leveled so half of a big base still clears; ×Mult engines barely notice. |
| **The Water** | Start with **0 discards** | Hurts discard-scalers (Yorick, Green Joker, deck-thinning). Route around with hand-only play. |
| **The Arm** | **−1 level** to the played hand | Minor for highly-leveled hands; avoid by playing a different (also-leveled) hand. |
| **The Tooth** | Lose $1 per card played | Economy tax; trivial for assembled engines. |

**Universal boss insurance for endless:** carry **Chicot** (legendary — disables *all* boss effects) or **Luchador** (sell to disable the *current* boss) and keep **one sacrificial Joker** for Verdant Leaf. These three options neutralize essentially every engine-disrupting boss, which is why deep-endless S-tier builds reserve a slot for boss insurance.

---

## 9. SOURCE CONFLICTS & UNRESOLVED NUMBERS

1. **Endless ante formula transcription.** balatrowiki.org renders the formula as `Ante-8 Req · (1.6 + (0.75(Ante−8))^(1+0.2(Ante−8)))^(Ante−8)`. Plugging in does not perfectly reproduce the wiki's own example values (110k, 560k, 3.0e8, 8.6e20, …). The **example value table is authoritative** (it matches in-game checks); treat the printed formula as an approximation of the game's internal `get_blind_amount` piecewise scaling. The **Ante-39 "naneinf" float-overflow cap** is consistently reported and is the real endless ceiling.

2. **Wiki 403.** The Fandom wiki (balatrogame.fandom.com) could not be fetched; all values here come from balatrowiki.org, the Steam guide, and efhiii/balatro-calculator `cards.js`. Where the calculator's `config` numbers and balatrowiki agree (Baron ×1.5, Triboulet ×2, Hologram ×0.25, Constellation ×0.1, Glass Joker ×0.75, Lucky Cat ×0.25, etc.), confidence is high.

3. **Secret-hand planets (Planet X / Ceres / Eris) base values.** Sourced from balatrowiki.org. These hands are gated behind enhancement/deck setups; the base figures (120×12 / 140×14 / 160×16) are consistent across the wiki and community calculators.

4. **Joker costs** are *base* shop prices from `cards.js`; in-run prices vary with shop modifiers, editions, and stake. Rarity tiers are exact.

5. **Observatory ×1.5.** balatrowiki.org states "Planet cards in your consumable area give **×1.5 Mult** for their specified poker hand." This is the figure used in the Perkeo loop math; it is the consensus value.
