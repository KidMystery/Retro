# The Legend of Valuaria: Myth & Margin 🛡️⚔️

A **16-bit SNES mythical options RPG** inspired by *A Link to the Past*. You play **Valen**, a village orphan who finds the Oracle's lost Ledger and must master the ancient arts of options across five fractured realms before the Liquidation Lord's kingdom of unhedged greed swallows the world.

> *Not saving a princess. Learning to invest.*

## The Core Mechanic: Fail → Learn Value Investing
- A bad/losing trade cracks your hearts and pulls you into the **Sanctuary of the Quiet Oracle** (Graham's *The Intelligent Investor*).
- Answer one Graham reflection question (margin of safety, Mr. Market, investment vs. speculation). You cannot leave until correct.
- Answering correctly **permanently unlocks protection** against that mistake.

## Multiple Paths, One Crown
- **Trader-path** (aggressive, defined-risk spreads & condors) · **Investor-path** (slow, value-first, covered calls) · **Hybrid**.
- Different quests, different bosses — but the **true end is the same**: the crown of the richest investor, reached by whichever discipline you actually practiced.

## Content
- **5 realms** (Origin / Time / Range / Vol / Citadel) with bosses from the Delta Grizzly to **Marduk Vex, the Liquidation Lord**.
- **Olmstead** strategies (each unlock = a chapter) + **Graham** failure-philosophy.
- Scam NPCs and a crypto-bait trap that tempts then destroys.
- Live options Greeks engine (Black-Scholes) as your hero's life force.
- Synthesized **16-bit mythical OST** (no audio files — generated live).
- **Mobile-first**: touch D-pad, action button, oracle-circle ledger as a bottom-sheet. **Installable PWA** — play offline on your phone.

## Run Locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build / Deploy
```bash
npm run build      # outputs to dist/ (pure static site)
```

> **Railway note:** this project uses **npm** (a valid `package-lock.json`). Do **not** drop an empty/broken `bun.lock` into the repo — Railpack sees bun and fails `bun install --frozen-lockfile`. No lockfile = railway falls back to npm cleanly.

## Stack
Vite + React 19 + TypeScript + Tailwind CSS 4 · pixel art canvas rendering · Web Audio synthesizer.