# CardCoach — Amex Edition

> Google Maps for your spending. AI-powered benefit advisor for American Express cardholders.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "CardCoach initial commit"
gh repo create cardcoach --public --push
```

### Step 2 — Import on Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `cardcoach` repo
4. Framework Preset: **Vite**
5. Click **Deploy** (first deploy will fail — that's fine, key isn't set yet)

### Step 3 — Add your API key
1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-actual-key`
   - Environment: ✅ Production ✅ Preview ✅ Development
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

Your app is live. Key is safe on Vercel's servers. Browser never sees it.

---

## Run Locally

```bash
# Install dependencies
npm install

# Create local env file
cp .env.example .env.local
# Edit .env.local and paste your actual API key

# Run dev server (Vercel CLI handles the /api/chat route locally)
npx vercel dev
```

> Use `vercel dev` not `npm run dev` — only Vercel CLI runs the serverless functions locally.

---

## Project Structure

```
cardcoach/
├── api/
│   └── chat.js          ← Serverless function (API key lives here, server-side only)
├── src/
│   ├── App.jsx          ← Main React app
│   └── main.jsx         ← React entry point
├── index.html
├── vite.config.js
├── package.json
└── .env.example         ← Copy to .env.local for local dev
```

---

## How the API key stays secure

```
Browser → POST /api/chat (no key) → Vercel Function → Anthropic API (key added server-side)
```

The key is set as a Vercel environment variable. It never appears in:
- Your source code
- Your git history  
- The browser's network tab
- The built JS bundle

---

Built as a PM portfolio project. Pitchable to Mastercard, Visa, and American Express.
