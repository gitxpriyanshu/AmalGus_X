# AmalGus Glass Marketplace

> World's First B2B2C Glass & Allied Products Niche Marketplace

Built as an internship assignment prototype demonstrating a full-stack AI-powered marketplace for the ₹150B+ global glass industry.

---

## Why AmalGus Exists

The global glass construction market is worth $150–190 Billion, yet the industry runs on WhatsApp, phone calls, and handshake deals. There is zero transparency in pricing — glass rates change daily and no platform tracks them. AmalGus fixes this.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR, fast routing, Vercel-native |
| Styling | Tailwind CSS | Rapid responsive UI |
| AI | Gemini 1.5 Flash API | Permanent Free Tier, 1M context window |
| Database | Supabase (PostgreSQL) | Real-time, REST API built-in, free tier |
| Deployment | Vercel | One-click, env var management |

---

## Features

### Core (Required)
- **Glass Product Catalog** — 8 glass types with filtering by type, application, process, and price
- **AI Smart Matching** — Natural language query → Claude API → expert glass recommendation with industry reasoning
- **Quote Generator** — Dimension input → live area calculation → price estimate with GST → saved to Supabase

### Bonus
- **Daily Rate Ticker** — Scrolling live price feed on homepage like a stock ticker
- **Daily Rates Dashboard** — Full rate cards with 7-day sparklines for all 8 glass types
- **Multi-Vendor Comparison** — Same product from 3 vendors with price, delivery, rating comparison
- **Allied Products Cross-sell** — Hardware, sealants, frames suggested alongside glass
- **Service Partner Listings** — Verified installers filterable by city and service type
- **Customer Role Selector** — Homeowner / Architect / Builder / Dealer with tailored UI copy

---

## AI Matching — How It Works

The AI matching engine sends the user&apos;s natural language query to **Gemini 1.5 Flash** with a structured system prompt encoding real glass industry rules:

- Shower/wet areas → always Toughened (tempered) — mandatory safety
- Railing above 2 floors → Laminated (PVB holds shards together)
- Soundproofing → Laminated or DGU (mass + air gap dampen sound)
- South-facing / energy codes → Low-E DGU (reduces solar heat gain coefficient)
- Privacy with light → Frosted acid etched
- Decorative / colored → Back-Painted lacquered

The model returns structured JSON with glass type, thickness, process, expert reasoning, safety notes, and a follow-up clarifying question. The response is then enriched with product IDs from the database for direct linking.

---

## Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/amalgus
cd amalgus
npm install
```

### 2. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → New Project
- Go to SQL Editor → paste contents of `supabase/schema.sql` → Run

### 3. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Repository → Select `amalgus`
3. Add environment variables in Vercel dashboard (same 3 keys as above)
4. Deploy → live URL ready in ~2 minutes

---

## Architecture
User → Next.js Frontend (Vercel)
↓
API Routes (Next.js)
├── /api/products  → Supabase: glass_products table
├── /api/rates     → Supabase: daily_rates table
├── /api/quote     → calculateQuote() + Supabase: quotes table
└── /api/ai-match  → Anthropic Claude API → enriched with Supabase product IDs
↓
Supabase PostgreSQL
(glass_products, vendors, vendor_products,
daily_rates, allied_products, service_partners, quotes)

---

## Sample AI Queries to Test

| Query | Expected Top Recommendation |
|---|---|
| "bathroom shower glass" | 8mm Toughened (Tempered) |
| "soundproof office cabin" | 10mm Laminated (PVB) |
| "balcony railing 15th floor" | 12mm Laminated (height = safety) |
| "south facing energy efficient" | Low-E DGU |
| "kitchen backsplash color" | 8mm Back-Painted (Lacquered) |
| "conference room privacy" | 6mm Frosted (Acid Etched) |

---
