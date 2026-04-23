# Recipe Box & "What Can I Cook?" App — Implementation Plan

## Overview

A full-stack recipe management application where users can save, categorize, and search recipes. The standout feature is an **ingredient-matching engine** that answers: *"What can I cook with what's in my fridge?"* — synced across all devices.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 14** (App Router, Server Components, Server Actions) |
| Language | **JavaScript** (ES2024) |
| Database | **MongoDB Atlas** (cloud-synced, free tier) |
| ODM | **Mongoose** |
| Auth | **NextAuth.js (Auth.js v5)** — Google + Credentials providers |
| Styling | **Vanilla CSS** with CSS custom properties design system |
| Icons | **Lucide React** |
| Deployment | **Vercel** (frontend) + **MongoDB Atlas** (database) |

---

## Proposed Changes

### Phase 1 — Project Scaffolding

#### [NEW] Next.js project via `create-next-app`
- Initialize with App Router, no Tailwind, JavaScript, src directory
- Directory: `c:\Users\HP\Desktop\recipe`

#### [NEW] Project structure
```
recipe/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout + font + metadata
│   │   ├── page.js                # Landing page (hero + CTA)
│   │   ├── globals.css            # Full design system
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.js
│   │   ├── dashboard/
│   │   │   └── page.js            # Main dashboard after login
│   │   ├── recipes/
│   │   │   ├── page.js            # Browse all saved recipes
│   │   │   ├── new/page.js        # Add new recipe form
│   │   │   └── [id]/page.js       # Single recipe detail
│   │   ├── cook/
│   │   │   └── page.js            # "What Can I Cook?" — ingredient matcher
│   │   └── fridge/
│   │       └── page.js            # Manage fridge inventory
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── RecipeCard.js
│   │   ├── IngredientTag.js
│   │   ├── MatchScore.js
│   │   ├── CategoryFilter.js
│   │   ├── FridgeInput.js
│   │   ├── AuthProvider.js
│   │   └── LoadingSpinner.js
│   ├── lib/
│   │   ├── mongodb.js             # Singleton DB connection
│   │   ├── auth.js                # NextAuth config
│   │   └── matchAlgorithm.js      # Jaccard similarity engine
│   └── models/
│       ├── User.js
│       ├── Recipe.js
│       └── Fridge.js
├── public/
│   └── images/                    # Generated hero images
├── .env.local                     # Secrets (Mongo URI, auth keys)
├── next.config.mjs
└── package.json
```

---

### Phase 2 — Design System (globals.css)

Premium dark-mode-first design with:
- **Color Palette**: Deep charcoal backgrounds (`#0a0a0f`), warm amber/orange accents (`#f59e0b`, `#ef4444`), soft greens for freshness tags
- **Typography**: Google Font **"Inter"** for body, **"Playfair Display"** for headings
- **Glassmorphism**: Semi-transparent cards with `backdrop-filter: blur()`
- **Micro-animations**: Hover lifts, fade-in on scroll, shimmer loading skeletons
- **Responsive grid**: CSS Grid + Flexbox, mobile-first breakpoints

---

### Phase 3 — Database Models (Mongoose)

#### [NEW] `models/User.js`
```js
{
  name: String,
  email: { type: String, unique: true },
  image: String,
  passwordHash: String,       // for credentials login
  createdAt: Date
}
```

#### [NEW] `models/Recipe.js`
```js
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: String,           // "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"
  cuisine: String,            // "Italian", "Indian", "Mexican", etc.
  ingredients: [{
    name: String,             // normalized lowercase
    quantity: String,
    unit: String
  }],
  ingredientNames: [String],  // pre-extracted for fast matching
  instructions: [String],     // step-by-step
  prepTime: Number,           // minutes
  cookTime: Number,
  servings: Number,
  difficulty: String,         // "Easy", "Medium", "Hard"
  image: String,
  tags: [String],
  isFavorite: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### [NEW] `models/Fridge.js`
```js
{
  userId: ObjectId (ref: User),
  ingredients: [{
    name: String,             // normalized lowercase
    quantity: String,
    unit: String,
    addedAt: Date,
    expiresAt: Date           // optional expiry tracking
  }],
  updatedAt: Date
}
```

---

### Phase 4 — Ingredient Matching Algorithm

#### [NEW] `lib/matchAlgorithm.js`

**Jaccard Similarity** approach with enhancements:

```
Match Score = |FridgeIngredients ∩ RecipeIngredients| / |RecipeIngredients|
```

The algorithm will:
1. **Normalize** all ingredient names (lowercase, stem common variants like "tomatoes" → "tomato")
2. **Calculate coverage**: What percentage of a recipe's ingredients do you already have?
3. **Rank results** by match score (highest first)
4. **Show missing ingredients**: List exactly what you'd need to buy
5. **Filter modes**:
   - "Perfect Match" (100% coverage)
   - "Almost There" (≥ 80% — missing 1-2 items)
   - "Worth a Trip" (≥ 50% coverage)

---

### Phase 5 — Authentication & Cloud Sync

#### [NEW] `lib/auth.js` + `api/auth/[...nextauth]/route.js`

- **Google OAuth** for one-click sign-in
- **Credentials provider** (email + password) as fallback
- Session stored in JWT → user data fetched from MongoDB
- All recipe/fridge data tied to `userId` → automatic cloud sync across any device

---

### Phase 6 — Pages & Features

#### Landing Page (`/`)
- Animated hero section with food imagery
- Feature showcase cards (3 pillars: Save, Match, Sync)
- CTA buttons → Sign Up / Sign In

#### Dashboard (`/dashboard`)
- Welcome message + stats (total recipes, fridge items, matches found)
- Quick action cards (Add Recipe, Open Fridge, What Can I Cook?)
- Recent recipes carousel

#### Recipe Pages (`/recipes`, `/recipes/new`, `/recipes/[id]`)
- **Browse**: Filterable grid by category/cuisine/difficulty with search bar
- **Add New**: Multi-section form with ingredient builder (add/remove rows dynamically)
- **Detail View**: Full recipe page with ingredients checklist, step-by-step instructions, cook timer

#### Fridge Manager (`/fridge`)
- Auto-complete ingredient input with common ingredient database
- Visual grid of current fridge contents as removable tags
- Optional expiry date badges

#### What Can I Cook? (`/cook`)
- **The hero page** — runs matching algorithm against fridge + all saved recipes
- Results displayed as cards with match percentage bar
- Color-coded: 🟢 Perfect match, 🟡 Almost there, 🔴 Missing several
- Each card shows missing ingredients with "Add to shopping list" option

---

### Phase 7 — Seed Data

Pre-populate with **20+ curated recipes** across categories so the app feels alive on first use. Categories include:
- Breakfast (Pancakes, Omelette, Smoothie Bowl)
- Lunch (Caesar Salad, Grilled Cheese, Pasta)
- Dinner (Butter Chicken, Stir Fry, Tacos)
- Desserts (Brownies, Tiramisu, Fruit Salad)
- Snacks (Guacamole, Bruschetta, Trail Mix)

---

### Phase 8 — Deployment

- **Vercel**: `vercel deploy` with environment variables
- **MongoDB Atlas**: Free M0 cluster, connection string in `.env.local`
- **Domain**: Optional custom domain via Vercel

---

## User Review Required

> [!IMPORTANT]
> **Authentication Provider**: The plan uses Google OAuth + email/password. Do you want GitHub OAuth added as well, or are these two sufficient?

> [!IMPORTANT]
> **Pre-seeded Recipes**: Should the 20+ seed recipes be available to all users globally (shared library), or should each user start with an empty box and add their own?

> [!NOTE]
> MongoDB Atlas free tier (M0) supports up to **512MB storage** and **100 connections** — more than sufficient for a personal/portfolio app. No credit card needed.

---

## Verification Plan

### Automated Tests
- `npm run build` — ensure no build errors
- `npm run dev` — verify all routes render correctly
- Test matching algorithm with known ingredient sets

### Browser Testing
- Navigate all pages, verify responsive design on mobile/tablet/desktop
- Test full user flow: Sign Up → Add Recipe → Add Fridge Items → Run Matcher
- Verify cloud sync by checking MongoDB Atlas data panel

### Manual Verification
- Cross-device test (open on phone + desktop, confirm same data)
- Test edge cases: empty fridge, recipe with 1 ingredient, duplicate ingredients
