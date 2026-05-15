# CardCoach — AI-Powered Amex Benefit Advisor

**Live:** [https://cardcoach.vercel.app](https://cardcoach.vercel.app)

---

## What This Is

Most Amex members know their benefits exist. They don't recall them at the moment of purchase — which is the only moment that changes behavior.

CardCoach is a pre-purchase decision layer. You describe what you're buying. It tells you which card to use, which benefit applies, and what you'd leave on the table by ignoring it. Under 10 seconds. Before you pay.

This is a timing problem, not a knowledge problem. CardCoach solves for timing.

---

## The Problem It's Solving

Billions of dollars in Amex credits, points, and perks go unredeemed every year. Existing tools — benefit dashboards, monthly statements, renewal emails — all arrive too late or require too much effort to act on. The gap is the pre-purchase moment. No product lives there.

For Amex specifically, this matters because their revenue model depends on members feeling the annual fee is worth it. Members who don't use their benefits don't feel that value. Members who don't feel that value don't renew. Low benefit utilization is a churn signal, not a breakage win.

---

## Product Features

### Core
- **AI recommendation engine** — describe any purchase, get the right Amex card + exact benefit in plain language
- **Card selector** — choose from Amex Platinum, Gold, Green, and Blue Cash Everyday
- **Benefit intelligence layer** — manually curated benefit database injected into every AI call as structured ground truth

### Habit Loop
- **Expiring credits banner** — fires in the last 7 days of the month when a monthly credit is unused
- **Optimization score** — shows % of purchase queries confirmed this month, replaces gameable streak counters
- **Monthly optimization panel** — shows queries checked, recommendations acted on, unused credits, and missed opportunity estimate

### Memory & Persistence
- **Full localStorage persistence** — cards, savings, benefit calendar, and query history survive page refresh
- **Personalized greeting** — name stored on first visit, time-aware greeting on return
- **Benefit calendar** — 3-month rolling view, mark monthly credits as used

### PM Artifacts
- **Hidden `/stats` page** — product metrics dashboard with demo data and honest proxy metric disclaimers
- **Pitch tab** — business case for Amex embedded inside the product: problem, insight, V1 constraints, V2 vision, and the metric that matters

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + Vite | Fast iteration, component-based, hot reload |
| AI | Google Gemini API | Free tier via Google AI Studio |
| API proxy | Vercel serverless function | API key never touches the browser |
| Storage | localStorage | Zero cost, zero infrastructure, correct at zero users |
| Deployment | Vercel | Auto-deploy from GitHub, free tier |
| Routing | vercel.json SPA rewrite | Enables /stats without a backend router |

---

## Architecture

```
User types query
      ↓
Browser → POST /api/chat (no key, no credentials)
      ↓
Vercel serverless function adds GEMINI_API_KEY from environment
      ↓
Gemini API responds
      ↓
Response streams back to browser
      ↓
User sees recommendation
```

The API key exists only in Vercel's encrypted environment variables. It never appears in source code, git history, or the browser's network tab.

---

## Key Product Decisions

**localStorage over a database**
Zero real users at launch. A database solves a problem that doesn't exist yet. Revisit when users ask for cross-device sync.

**Manual benefit data over Plaid**
Plaid costs money, requires compliance review, and takes weeks to integrate. Manually curated data for 4 cards is accurate enough to prove the concept. V2 replaces the JSON with a live API.

**Optimization score over a streak counter**
Streaks work for daily behaviors. Checking CardCoach before purchases is contextual, not daily. A streak of "days visited" is gameable and meaningless. The optimization score is tied directly to the core behavior.

**Honest proxy metrics over a fake north star**
The real north star — % of all purchase decisions where the user checks CardCoach — requires transaction data that doesn't exist in V1. Every metric on /stats is labeled accurately with a plain-language explanation of what it measures and what it doesn't.

---

## What This Is Not

- Not connected to any bank or card issuer
- No access to real point balances, transaction history, or actual benefit usage
- Savings figures are self-reported by the user — not verified
- Benefit data is manually maintained — not fetched in real time

These are honest V1 constraints, not hidden limitations. Every one has a documented V2 unlock.

---

## V2 Vision

With Amex transaction data (via Amex API or Plaid):

- Benefits become live and always accurate
- Savings are verified automatically from statements
- The north star metric becomes measurable
- Credits are marked used automatically
- Recommendations are personalized to actual spend patterns
- The product is white-labelable inside Amex's own app

The architecture is designed so adding the data layer is additive — not a rebuild.

---

## Running Locally

```bash
git clone https://github.com/suryaveer-product-geek/cardcoach
cd cardcoach
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npx vercel dev
```

> Use `vercel dev` not `npm run dev` — only Vercel CLI runs the serverless `/api/chat` function locally.

---

## Project Structure

```
cardcoach/
├── api/
│   └── chat.js          ← Serverless function — API key lives here only
├── src/
│   ├── App.jsx          ← Main product — all 6 systems
│   ├── Stats.jsx        ← Hidden /stats metrics dashboard
│   └── main.jsx         ← Entry point + client-side routing
├── index.html
├── vite.config.js
├── vercel.json          ← SPA rewrite rule for /stats
├── package.json
└── .env.example
```

---

## Built By

Suryaveer — Product Analyst moving into Product Management.

This project exists to demonstrate 0→1 product thinking: identifying a real problem, making deliberate tradeoffs under real constraints, shipping something functional, and being honest about what it can and cannot do.

**Live:** [https://cardcoach.vercel.app](https://cardcoach.vercel.app) · **Pitch tab** inside the app shows the full business case.
