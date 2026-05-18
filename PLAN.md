# Photographer Portfolio & Dynamic Wedding Invite Generator
## Build Plan & Technical Specification

**Date:** 2026-05-15  
**Scope:** Low-volume (< 100 invites/month), permanent sharable links  
**Complexity Assessment:** Moderate

---

## 1. COMPLEXITY BREAKDOWN

### Feasibility: ✅ FULLY FEASIBLE

**Core Complexity Sources:**
- **Admin authentication & form handling:** Low (standard login + form submission)
- **Image upload & storage:** Low-Medium (Supabase handles this well)
- **Dynamic page generation:** Low (static-generated pages work fine at this volume)
- **Scroll-triggered animations:** Low-Medium (Intersection Observer API is straightforward; Framer Motion simplifies this)
- **Multi-slide layout with responsive design:** Medium (CSS Grid/Flexbox handles variable content lengths)

**Why it's not overly complex:**
- No real-time collaboration needed
- No video processing
- No ML/AI-driven design (yet)
- Supabase abstraction eliminates database ops complexity
- Next.js handles routing and static generation natively

**Risks to mitigate:**
- Image optimization for web (CloudFront CDN caching helps here)
- Database schema mutations after launch (use migrations from day 1)
- Scroll performance with multiple scroll listeners (use single event delegation)

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     Photographer's Website                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐   │
│  │  Public Portfolio    │         │   Admin Dashboard    │   │
│  │  (Marketing site)    │         │  (Invite Creator)    │   │
│  │  - Gallery           │         │  - Create invite     │   │
│  │  - About/Contact     │         │  - Manage invites    │   │
│  └──────────────────────┘         │  - View analytics    │   │
│                                   └──────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │      Next.js App (SSR + Static Generation)            │    │
│  │  - /auth/* (login, register)                          │    │
│  │  - /admin/* (dashboard, form builder)                 │    │
│  │  - /invites/[id] (dynamic invite pages)              │    │
│  │  - /api/* (backend logic)                             │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐   │
│  │   Supabase (Auth)    │         │  Supabase Storage    │   │
│  │  - User credentials  │         │  (Photos + Assets)   │   │
│  │  - Session mgmt      │         │  - Public URL CDN    │   │
│  └──────────────────────┘         └──────────────────────┘   │
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐   │
│  │  PostgreSQL (Invite  │         │   Email Service      │   │
│  │  Metadata)           │         │   (Resend/SendGrid)  │   │
│  │  - invite records    │         │   (optional share)   │   │
│  │  - usage analytics   │         └──────────────────────┘   │
│  └──────────────────────┘                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. TECHNOLOGY STACK

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) | Built-in Image optimization, API routes, Edge Functions ready |
| **UI Components** | shadcn/ui + Tailwind CSS | Production-grade components, minimal setup |
| **Animations** | Framer Motion | Scroll-triggered animations via `useScroll()` hook, smooth performance |
| **Backend/Auth** | Supabase Auth | JWT-based, integrates with Next.js middleware out-of-box |
| **Database** | Supabase PostgreSQL | Relational, JSON fields for invite metadata, triggers for cleanup |
| **File Storage** | Supabase Storage | CDN-backed, integrates with auth, presigned URLs for secure access |
| **Image Processing** | Sharp.js | On-the-fly resizing/optimization, runs on Edge/serverless |
| **Form Management** | React Hook Form + Zod | Type-safe validation, minimal bundle impact |
| **Hosting** | Vercel | Native Next.js deployment, Edge Functions, analytics built-in |

**Why NOT X:**
- ❌ Vue/React only: Next.js gives you file-based routing + API layer for free
- ❌ Firebase: Less control over PostgreSQL; Supabase is Firebase-like but more powerful
- ❌ Raw Canvas/WebGL for animations: Framer Motion is simpler, sufficient for this use case

---

## 4. DATABASE SCHEMA

### Core Tables

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE photographer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  portfolio_url VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invite Templates (predefined designs)
CREATE TABLE invite_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  background_image_url VARCHAR(512),
  color_scheme JSONB, -- { primary, secondary, accent }
  layout_config JSONB, -- { slideCount, animationSpeed, etc }
  created_by UUID REFERENCES photographer_profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wedding Invites (the actual generated invites)
CREATE TABLE wedding_invites (
  id SERIAL PRIMARY KEY,
  unique_slug VARCHAR(32) UNIQUE NOT NULL, -- used in URL: /invites/abc123
  created_by UUID NOT NULL REFERENCES photographer_profiles(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES invite_templates(id) ON DELETE SET NULL,
  
  -- Invite Details (form inputs)
  bride_name VARCHAR(255) NOT NULL,
  groom_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(50),
  event_location VARCHAR(500),
  couple_story TEXT,
  custom_colors JSONB, -- override template colors
  
  -- Photos
  photo_1_url VARCHAR(512),
  photo_2_url VARCHAR(512),
  
  -- Analytics & Lifecycle
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  shared_at TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_created_by (created_by),
  INDEX idx_unique_slug (unique_slug),
  INDEX idx_event_date (event_date)
);

-- Page Views (optional analytics)
CREATE TABLE invite_pageviews (
  id SERIAL PRIMARY KEY,
  invite_id INTEGER NOT NULL REFERENCES wedding_invites(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64), -- privacy-preserving
  user_agent TEXT,
  referrer VARCHAR(512)
);
```

**Design Rationale:**
- `unique_slug` instead of `id` in URLs: `/invites/abc123xyz` is shareable, clean, and secure (random slug ≠ sequential ID)
- JSONB for flexible color schemes & layout configs: avoids schema migrations when adding template variations
- Denormalized `view_count` on invites: fast reads, async increment via trigger (eventual consistency is fine at this scale)
- Cascade deletes: photographer deletion removes their invites automatically (GDPR-friendly)

---

## 5. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure
**Deliverable:** Boilerplate + authentication  
**Tasks:**
- [ ] Scaffold Next.js 14 project (use `create-next-app` with TypeScript)
- [ ] Set up Supabase project (PostgreSQL + Auth + Storage)
- [ ] Configure Next.js middleware for auth protection (`/admin/*` routes)
- [ ] Create login/signup pages with Supabase Auth UI
- [ ] Set up environment variables (`.env.local`, secrets in Vercel)
- [ ] Deploy skeleton to Vercel

**Acceptance Criteria:**
- Photographer can sign up, log in, log out
- Protected routes redirect to login
- No TypeScript errors in build

---

### Phase 2: Admin Dashboard
**Deliverable:** Invite creation form + dashboard  
**Tasks:**
- [ ] Create admin dashboard layout (sidebar nav, main content area)
- [ ] Build invite creation form:
  - Text inputs: bride_name, groom_name, event_date, event_time, location, couple_story
  - Image upload (2 photos) → Supabase Storage
  - Template selector + color customization
  - Form validation (React Hook Form + Zod)
- [ ] API endpoint: `POST /api/invites/create`
  - Validate inputs server-side
  - Generate random `unique_slug`
  - Insert into PostgreSQL
  - Return invite URL
- [ ] Invite list view (dashboard): show all created invites, view count, delete option
- [ ] API endpoint: `DELETE /api/invites/[id]`

**Acceptance Criteria:**
- Form submits successfully, creates database record
- Photos upload to Supabase Storage with public URLs
- Invite list displays all created invites
- Can delete invites

**Tech Notes:**
- Use Next.js `<Image>` component for photo previews (built-in optimization)
- Supabase Storage publishes to: `https://<project>.supabase.co/storage/v1/object/public/invites/...`
- Generate slug via: `crypto.randomBytes(6).toString('hex')` (12-char hex string)

---

### Phase 3: Dynamic Invite Page
**Deliverable:** Animated invite rendering with scroll-triggered reveals  
**Tasks:**
- [ ] Create `app/invites/[slug]/page.tsx` (dynamic route)
  - Server-side fetch invite data from PostgreSQL
  - Render as 404 if not found
  - Increment view_count (via API call)
- [ ] Design invite template layout:
  - Slide 1: Hero (large photo + couple names fade-in)
  - Slide 2: Event details (date, time, location)
  - Slide 3: Secondary photo + couple story
  - Slide 4: RSVP info / closing message
- [ ] Implement scroll-triggered animations using Framer Motion:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: false, amount: 0.3 }}
  >
    {content}
  </motion.div>
  ```
- [ ] Responsive design: mobile-first, works on all devices
- [ ] Apply custom colors from invite record
- [ ] Static generation optimization: use `revalidate: 3600` (ISR - revalidates hourly)

**Acceptance Criteria:**
- Invite renders correctly with all data
- Scroll animations trigger smoothly (no jank)
- Photos display with correct aspect ratio
- Mobile layout is readable

**Performance Notes:**
- ISR (Incremental Static Regeneration) at 1 hour = balance between freshness and cache hits
- Framer Motion `viewport={{ once: false }}` = animation can repeat on scroll (design choice; set to `true` if one-time only)
- Next.js Image optimization automatically serves WebP to supported browsers

---

### Phase 4: Public Portfolio & Polish
**Deliverable:** Marketing website + UI refinement  
**Tasks:**
- [ ] Create landing page (`/`): photographer bio, featured invites showcase
- [ ] Create gallery/portfolio page (`/portfolio`): grid of past invites (samples)
- [ ] Add contact form (optional Resend email integration)
- [ ] Improve form UX:
  - Loading states on upload
  - Success/error toasts
  - Image preview before upload
  - Drag-and-drop photo upload
- [ ] SEO setup:
  - Meta tags on invite pages (Open Graph for link previews)
  - `robots.txt` and `sitemap.xml`
  - Meta description for shared invites
- [ ] Error boundaries + graceful error handling
- [ ] Analytics dashboard (show invite view counts, trends)

**Acceptance Criteria:**
- Landing page looks professional
- Invite link preview shows couple names + event date when shared
- No unhandled errors in production

---

### Phase 5: Testing & Launch
**Deliverable:** Production-ready deployment  
**Tasks:**
- [ ] E2E tests (Playwright):
  - Login → Create invite → View invite flow
  - Delete invite works
  - Shared invite renders for anonymous users
- [ ] Performance audit (Lighthouse):
  - Invite pages: 90+ score target
  - LCP < 2.5s, CLS < 0.1
- [ ] Security audit:
  - No SQL injection (Supabase handles parameterization)
  - Auth routes protected
  - Rate limiting on API endpoints
  - CORS configured correctly
- [ ] Final Vercel deployment
- [ ] Backup Supabase database
- [ ] Set up monitoring (Sentry for errors, basic analytics)

---

## 6. KEY TECHNICAL DECISIONS & TRADE-OFFS

### Decision 1: Static Generation vs. Real-Time Rendering
**Choice:** ISR (Incremental Static Regeneration) at 1-hour revalidate  
**Trade-off:**
- ✅ Invites cached globally on Vercel's Edge, ~100ms response
- ✅ Massively lower database load (one query per hour, not per view)
- ❌ Updates take up to 60 mins to propagate (acceptable for this use case)
- ❌ Can't show real-time view counts on the invite page (but admin dashboard can)

**Alternative:** Full server-side rendering (slower, costs more, but real-time counts)

---

### Decision 2: Supabase PostgreSQL vs. Supabase Vector/NoSQL
**Choice:** PostgreSQL + JSONB columns  
**Trade-off:**
- ✅ Relational structure for invites, photos, users
- ✅ ACID transactions (important for critical data)
- ✅ Native JSON support for flexible color schemes
- ❌ Slight overkill for this use case (simpler than Firebase, more powerful than needed)
- ❌ Schema migrations required if structure changes (manageable with proper versioning)

**Why not NoSQL (Firebase)?** At < 100/month invites, you don't hit Firestore's sweet spot (sharding). PostgreSQL is cleaner.

---

### Decision 3: Scroll-Triggered vs. Auto-Play Carousel
**Choice:** Scroll-triggered (user-driven pacing)  
**Trade-off:**
- ✅ Better accessibility (user controls pace)
- ✅ Works with screen readers & keyboard nav
- ✅ Lower CPU usage (animations only when needed)
- ❌ Requires explicit scroll behavior (some guests might not scroll)
- ❌ Mobile UX can feel slower on small screens

**Mitigation:** Add subtle visual cues (arrows, "Scroll for more") on first load.

---

### Decision 4: Image Storage & CDN
**Choice:** Supabase Storage + Supabase-managed CDN  
**Trade-off:**
- ✅ Integrated with auth (can set public/private)
- ✅ Automatic CDN caching via `storage-cdn` domain
- ✅ No additional cost (included in Supabase plan)
- ❌ Single region (data sovereignty concern if scaling internationally)
- ❌ Less control than raw S3 + CloudFront

**At scale:** Consider moving to S3 + CloudFront for multi-region replication.

---

## 7. SECURITY & GOVERNANCE

### Authentication & Authorization
```
┌─ Photographer Login (Supabase Auth + JWT)
│  ├─ Access Token (15 min expiry)
│  └─ Refresh Token (7 day expiry)
│
├─ Middleware Verification (/admin/* routes)
│  └─ Validate JWT, extract photographer_id
│
├─ Row-Level Security (RLS) on PostgreSQL
│  └─ wedding_invites: UPDATE/DELETE only if created_by == current_user_id
│
└─ API Rate Limiting
   ├─ POST /api/invites/create: 10 req/min per user
   └─ GET /invites/:slug: 1000 req/min per IP (public)
```

### Data Privacy
- No PII stored in logs (use IP hash for analytics)
- Invite URLs are unguessable (crypto-random slug)
- Optional: Add password protection to invites (future feature)
- GDPR: Account deletion cascades to remove all invites

---

## 8. FAILURE MODES & MITIGATIONS

| Failure Mode | Impact | Mitigation |
|--------------|--------|-----------|
| Supabase Storage outage | Photos can't upload | Graceful error message, retry button, fallback default images |
| PostgreSQL connection fails | Can't create/view invites | Connection pooling (Supabase handles), exponential backoff on API |
| Large photo upload (20MB+) | Slow upload, timeout | Client-side validation (max 5MB), image compression before upload (TinyPNG API) |
| Photographer forgets password | Locked out of admin | Password reset flow (Supabase Auth handles), no recovery via email fallback needed |
| Accidental delete of invite | Data loss | Soft deletes (optional): add `deleted_at` column instead of hard delete, implement restore endpoint |

---

## 9. SCALABILITY ROADMAP (IF NEEDED)

**Current Setup:** < 100 invites/month = ~1 invite/day  
**Cost:** ~$25/month (Supabase free tier overages + Vercel)

**When to scale (100→1000 invites/month):**
- Add analytics dashboard (Vercel Analytics / PostHog)
- Implement caching for invite view counts (Redis layer)
- Move to Supabase paid tier (increases concurrent connections)
- Consider multi-region deployment (Vercel offers this natively)

**When to scale (1000→10K+ invites/month):**
- Implement image resizing queue (AWS Lambda + SQS)
- Consider custom template engine (Handlebars) for rendering invites as HTML templates
- Add background job queue (Bull/BullMQ) for bulk operations
- Separate read replicas for analytics queries

---

## 10. DELIVERABLES FOR CLAUDE CODE

Use this plan to instruct Claude Code with a prompt like:

```
Build a dynamic wedding invite generator for photographers based on this plan:
- Next.js 14 with TypeScript
- Supabase for auth, database, storage
- Framer Motion for scroll-triggered animations
- shadcn/ui for admin dashboard
- ISR with 1-hour revalidate for invite pages
- Follow all security & database schema specifications
- Prioritize Phase 1-3; defer Phase 4 analytics to later
- Use this plan as source of truth for architecture
```

---

## 11. QUICK START CHECKLIST

- [ ] Create Supabase project (free tier, upgrade storage if needed)
- [ ] Create Vercel project (GitHub integration)
- [ ] Clone template: `npm create next-app@latest photographer-invites --typescript`
- [ ] Install dependencies: `framer-motion`, `@supabase/supabase-js`, `shadcn/ui`
- [ ] Copy DB schema from this plan into Supabase SQL editor
- [ ] Set up environment variables in Vercel
- [ ] Begin Phase 1 implementation

---

**Questions before starting?**
- Any additional invite details (RSVP link, gift registry URL, etc.)?
- Should photographer have portfolio analytics (which templates/colors work best)?
- Need QR code on invite linking to RSVP form?
- Language support (international couples)?

