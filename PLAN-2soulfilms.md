# 2soulfilms: Wedding Films Portfolio & Dynamic Wedding Invite Generator
## Build Plan & Technical Specification

**Photographer:** 2soulfilms  
**Tagline:** We Make Wedding Stories | Wedding Films  
**Subtitle:** Beyond The Destination, You Can Always Memorize  
**Owner:** Sreeyam Behera (@sreeyam_behera)  
**Date:** 2026-05-16  
**Scope:** Low-volume (< 100 invites/month), permanent sharable links  
**Complexity Assessment:** Moderate

---

## BRAND & CONTENT SPECIFICATIONS

### Contact Information
- **Phone:** +91 87637 89647
- **Email:** 2solu2018@gmail.com
- **Instagram:** @2soulfilms
- **Facebook:** 2soulfilms
- **Address:** Rashulgarh, Bhubaneswar, India 751010
- **Service Area:** All Over INDIA

### Brand Bio & Values
*"To love or have loved that is enough. There is no other pearl to be found in those souls or in the dark fold of life. 2 Soul gives abundance of memories like mist suspended in the grass of a winter morning."*

### Design Reference
Style inspiration: https://oragraphy.com/ (modern, elegant, minimalist aesthetic)

### Assets Provided
- Logo file (in project folder)
- Photography & film samples (to populate portfolio)

---

## 0. DESIGN SYSTEM & VISUAL LANGUAGE

### Design Philosophy
**"Editorial Cinematic Storytelling"**
- Minimal, high-intention UX: everything funnels visitors to watch a film and inquire/book
- Mobile-first approach (vertical video, thumb-friendly CTAs)
- Categorization to reduce decision fatigue
- "Wow" via micro-interactions (smooth scroll, hover reveals, subtle glow) — not gimmicks
- Heavy emphasis on cinematic visuals + video, light on text

### Color Palette
| Element | Color | Code | Usage |
|---------|-------|------|-------|
| **Primary Text** | Charcoal Ink | `#0B0F19` | Navbar, headlines, body text |
| **Background** | Ivory Paper | `#F8F4EE` | Page background |
| **Accent (Primary CTA)** | Champagne | `#CBB89E` | Buttons, highlights, hover states |
| **Secondary Accent** | Soft Blush | `#E7D4C8` | Secondary CTAs, hover backgrounds |
| **Cards/Containers** | Pure White | `#FFFFFF` | Cards, modals on ivory background |
| **Secondary Text** | Warm Gray | `#2F3A4B` | Subheadings, metadata, labels |

**Rule:** Only 1 accent color across site (champagne). No 3-color schemes.

### Typography
- **Headings:** Modern serif or refined sans-serif (e.g., Playfair Display, Montserrat)
- **Body:** Clean sans-serif (e.g., Inter, Poppins)
- **Hierarchy:** H1 (48-56px) → H2 (36-48px) → H3 (24-28px) → Body (16-18px)

### Micro-interactions & Animation
- Smooth scroll behavior (easing: cubic-bezier(0.25, 0.46, 0.45, 0.94))
- Hover reveals: subtle opacity/scale on buttons, cards
- Subtle background glow on CTAs (champagne shadow)
- Video play button: overlay reveal on hover
- Category chips: smooth underline on selection
- Intersection observer for lazy-load animations (fade in as scroll)

### Mobile-First Principles
- Touch-friendly CTAs: min 48px height
- Vertical video priority (9:16 aspect ratio)
- Single column layouts below 768px
- Thumb-accessible navigation (bottom CTA bar on mobile)

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                   2soulfilms Website                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐   │
│  │  Public Portfolio    │         │   Admin Dashboard    │   │
│  │  - Hero Section      │         │  (Invite Creator)    │   │
│  │  - Films Gallery     │         │  - Create invite     │   │
│  │  - Testimonials      │         │  - Manage invites    │   │
│  │  - About/Contact     │         │  - View analytics    │   │
│  └──────────────────────┘         └──────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │      Next.js App (SSR + Static Generation)            │    │
│  │  - /auth/* (login, register)                          │    │
│  │  - /admin/* (dashboard, form builder)                 │    │
│  │  - /invites/[id] (dynamic invite pages)              │    │
│  │  - /api/* (backend logic)                             │    │
│  │  - / (landing page with 2soulfilms branding)         │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐   │
│  │   Supabase (Auth)    │         │  Supabase Storage    │   │
│  │  - User credentials  │         │  (Photos + Assets)   │   │
│  │  - Session mgmt      │         │  - Logo, samples     │   │
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

## 2. TECHNOLOGY STACK

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) | Built-in Image optimization, API routes, Edge Functions ready |
| **UI Components** | shadcn/ui + Tailwind CSS | Production-grade components, modern aesthetic matching oragraphy.com style |
| **Animations** | Framer Motion | Scroll-triggered animations via `useScroll()` hook, smooth performance |
| **Backend/Auth** | Supabase Auth | JWT-based, integrates with Next.js middleware |
| **Database** | Supabase PostgreSQL | Relational, JSON fields for invite metadata |
| **File Storage** | Supabase Storage | CDN-backed, integrates with auth |
| **Image Processing** | Sharp.js | On-the-fly resizing/optimization |
| **Form Management** | React Hook Form + Zod | Type-safe validation |
| **Hosting** | Vercel | Native Next.js deployment |

---

## 3. DATABASE SCHEMA

### Core Tables

```sql
-- Users (managed by Supabase Auth)
CREATE TABLE photographer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  business_name VARCHAR(255) NOT NULL DEFAULT '2soulfilms',
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  logo_url VARCHAR(512),
  cover_image_url VARCHAR(512),
  instagram_handle VARCHAR(100),
  facebook_handle VARCHAR(100),
  service_areas TEXT[], -- ARRAY type for multiple regions
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invite Templates
CREATE TABLE invite_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  background_image_url VARCHAR(512),
  color_scheme JSONB,
  layout_config JSONB,
  created_by UUID REFERENCES photographer_profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wedding Invites
CREATE TABLE wedding_invites (
  id SERIAL PRIMARY KEY,
  unique_slug VARCHAR(32) UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES photographer_profiles(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES invite_templates(id) ON DELETE SET NULL,
  
  -- Invite Details
  bride_name VARCHAR(255) NOT NULL,
  groom_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(50),
  event_location VARCHAR(500),
  couple_story TEXT,
  custom_colors JSONB,
  
  -- Photos
  photo_1_url VARCHAR(512),
  photo_2_url VARCHAR(512),
  
  -- Analytics & Lifecycle
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  shared_at TIMESTAMP,
  
  INDEX idx_created_by (created_by),
  INDEX idx_unique_slug (unique_slug),
  INDEX idx_event_date (event_date)
);

-- Page Views Analytics
CREATE TABLE invite_pageviews (
  id SERIAL PRIMARY KEY,
  invite_id INTEGER NOT NULL REFERENCES wedding_invites(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64),
  user_agent TEXT,
  referrer VARCHAR(512)
);
```

---

## 3B. PAGE STRUCTURE & LAYOUTS (Information Architecture)

### Global Layout (All Pages)

**Sticky Navbar**
- Logo (left) + minimal nav (Home, Films, About, Testimonials, Contact) + "Book your date" CTA button (right)
- Background: Ivory with subtle border-bottom
- Mobile: Logo + hamburger menu, CTA button stacks

**Footer**
- Email, phone, address (Rashulgarh, Bhubaneswar, India)
- Social links (Instagram @2soulfilms, Facebook)
- Quick links: Home, Films, About, Testimonials, Contact
- Copyright

---

### A) HOME PAGE (Primary Conversion Page)

**1. Hero Section (Above fold)**
- Full-width cinematic background (muted video loop or stunning still image)
- Overlay text (center-aligned):
  - H1: "We Make Wedding Stories | Wedding Films"
  - Subheading (1-2 lines): "Beyond The Destination, You Can Always Memorize"
  - CTA row (stacked on mobile):
    - Button 1 (Champagne): "Watch a film" (links to /films)
    - Button 2 (outline): "Book your date" (links to /contact)
- Mobile: Video/image fills viewport, text larger, buttons centered

**2. Category Gateway (3-4 cards)**
- Grid layout (3 cols desktop, 1 col mobile)
- Cards: Thumbnail + category title + duration metadata + "View" CTA
- Categories: Wedding Films | Pre-Wedding Films | Ceremony Edits | Reels
- Hover: Subtle scale, image overlay reveal

**3. Featured Film Spotlight**
- Hero thumbnail (16:9) with centered play button
- Title + location + duration + tags (e.g., "Romantic, Documentary, Cinematic")
- Below: "Story teaser" (2-3 emotional sentences)
- CTA: "Watch full film"

**4. Photography Teaser (optional cross-sell)**
- 2-3 sentence intro: "Complementing wedding films with timeless photography"
- Grid of 6-8 photos (3 cols desktop, 2 col mobile)
- CTA: "Explore photography" (future feature)

**5. Testimonials Preview**
- 2-4 quote cards (Champagne accents, name + event type)
- Simple layout: Quote text + author name
- CTA: "Read all testimonials"

**6. About Teaser**
- Founder portrait (left, responsive to stack)
- 2-3 lines about Sreeyam Behera + brand philosophy
- CTA: "Meet the team"

**7. What You Get (Process Timeline)**
- 4-step horizontal timeline (Inquiry → Pre-wedding Shoot → Wedding Day → Delivery)
- Each step: icon + title + 1-2 bullet points
- Highlight: Final deliverables (Full film, Social cuts, Ceremony edits, Behind-the-scenes)

**8. Final CTA Section**
- "Ready to tell your love story?"
- Two buttons: "Browse films" + "Get in touch"
- Optional: Short contact form (Name, Email, Event Date) or "Schedule a call" button

---

### B) FILMS PAGE (Gallery Index / Category Browser)

**Header**
- Page title: "Our Films"
- Short intro (1-2 sentences): "Each wedding has a unique story. Browse our curated collection."

**Filter/Category Chips** (sticky on scroll)
- Chips: "All / Wedding / Pre-Wedding / Ceremony / Reels"
- Optional secondary filter: "Romantic / High Energy / Traditional / Modern"
- Active state: Champagne background

**Sections (by category)**
- **Featured Row:** 1-2 hero films (larger cards, 16:9 aspect)
- **Grid of Films:** Cards in 3-col layout (desktop), 2 col (tablet), 1 col (mobile)
  - Card structure:
    - Thumbnail (16:9 or 9:16 depending on content)
    - Overlay on hover: Play button + location tag
    - Below thumbnail: Title + Location + Duration + Tags
    - CTA: "Watch film" (links to detail page)

---

### C) FILM DETAIL PAGE (Conversion/Storytelling Page)

**1. Hero Video Player**
- Full-width video embed (Vimeo/YouTube)
- Play button overlay (if thumbnail)
- Below: Title + Location + Duration + Tags (Champagne color)

**2. The Story Section**
- H2: "Their Love Story"
- 3-5 emotional sentences (narrative intro to the film)
- Soft blush background card

**3. Film Stills Gallery**
- 8-20 curated stills from the wedding
- Masonry or grid layout (3-4 cols desktop, 2 col mobile)
- Lightbox on click

**4. Behind-the-Scenes / Credits (optional)**
- Minimal: 1-2 sentences about filmmaking approach
- Team + camera gear (very brief)

**5. Testimonial**
- If available: Quote card with couple name, event date, location
- Champagne accent border

**6. Related Films**
- 3-4 similar films (carousel or grid)
- Same card structure as Films page

**7. CTA Block (High-intention)**
- Two buttons:
  - Primary: "Book your date" (Champagne, links to /contact)
  - Secondary: "Request pricing" (outline, modal or form)
- Copy: "Let's tell your story too."

---

### D) ABOUT PAGE

**Hero Section**
- Large founder portrait + minimal text overlay

**Story Section**
- H2: "Who We Are"
- 1-2 paragraphs about Sreeyam Behera + 2soulfilms journey
- Quote: "To love or have loved that is enough..." (from brand bio)

**Philosophy / Values**
- 3 bullets with icons:
  - "Documentary Storytelling" – Authentic moments, not staged
  - "Cinematic Quality" – Professional color grading, cinema-grade sound
  - "Timeless Memories" – Films that resonate 20 years later

**Team (optional)**
- 2-3 team member cards (portrait, name, role, 1-line bio)

**Service Areas**
- "Serving couples across INDIA"
- Optional map or list of key cities

**CTA**
- "Ready to work together?" button

---

### E) TESTIMONIALS PAGE

**Header**
- Page title + short intro
- Filter chips: "All / Wedding / Pre-Wedding / Ceremony" (optional location filter)

**Testimonial Cards Grid**
- 2-3 cols (desktop), 1 col (mobile)
- Card structure:
  - Quote text (italic, large)
  - Author name + event type (e.g., "Bride & Groom" or "Wedding, Dec 2023")
  - Star rating (optional)
  - Location tag
- Hover: Subtle glow, Champagne border highlight

**CTA at bottom**
- "See your wedding on our portfolio" + "Book now" button

---

### F) CONTACT PAGE

**Hero Section**
- Cinematic hero image or video
- H1: "Let's Connect"
- Subheading: "Tell us about your vision"

**Content Grid** (2 cols, responsive)

**Left Column: Contact Form**
- Fields:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Event Date (date picker)
  - Location (text, "All over India")
  - Service Type (dropdown: Wedding / Pre-Wedding / Both / Other)
  - Message (textarea)
  - Submit button (Champagne)
- Form state: Loading spinner, success toast, error handling

**Right Column: Contact Info**
- Email: 2solu2018@gmail.com (clickable mailto)
- Phone: +91 87637 89647 (clickable tel)
- WhatsApp: (optional CTA)
- Address: Rashulgarh, Bhubaneswar, India 751010
- Social: Instagram @2soulfilms, Facebook 2soulfilms
- Availability note: "Usually responds within 24-48 hours"
- Google Maps embed (optional)

**Mobile:** Stack form on top, contact info below

**CTA at bottom**
- "Or book a quick call" + Calendar link (if using Calendly)

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure
**Deliverable:** Boilerplate + authentication + 2soulfilms branding setup
**Tasks:**
- [ ] Scaffold Next.js 14 project with TypeScript
- [ ] Set up Supabase project (PostgreSQL + Auth + Storage)
- [ ] Configure Next.js middleware for auth protection (`/admin/*` routes)
- [ ] Create global branding/theming:
  - Import 2soulfilms logo
  - Define color palette (ref: oragraphy.com aesthetic)
  - Create reusable header/footer components with contact info
  - Social links (Instagram @2soulfilms, Facebook)
- [ ] Create login/signup pages with Supabase Auth UI
- [ ] Set up environment variables (`.env.local`, secrets in Vercel)
- [ ] Deploy skeleton to Vercel

**Acceptance Criteria:**
- Photographer can sign up, log in, log out
- Logo and branding visible on all pages
- Protected routes redirect to login
- Contact info (phone, email, address) accessible in footer
- No TypeScript errors in build

---

### Phase 2: Design System & Public Portfolio Website
**Deliverable:** Full-stack website with editorial cinematic storytelling approach
**Tasks:**

**2A. Design System & Global Components**
- [ ] Set up Tailwind configuration with custom color palette:
  - Charcoal (#0B0F19), Ivory (#F8F4EE), Champagne (#CBB89E), Soft Blush (#E7D4C8), Pure White, Warm Gray
- [ ] Create reusable components:
  - Button (primary/secondary/outline with hover states)
  - Card (film, testimonial, category)
  - CTA Block (with dual buttons)
  - Navigation (sticky navbar with mobile hamburger)
  - Footer (contact info + socials)
- [ ] Set up typography system (headings, body, metadata)
- [ ] Implement micro-interactions:
  - Smooth scroll behavior
  - Hover reveals on cards/buttons
  - Subtle glow shadows on CTAs (Champagne)
  - Fade-in animations on scroll (Intersection Observer)
  - Play button overlay on video thumbnails

**2B. Home Page**
- [ ] Hero section (full-width, responsive)
  - Cinematic background image/video loop
  - Centered text: H1 + subtitle + dual CTAs
  - Mobile: Stack layout, full-height, touch-friendly buttons
- [ ] Category gateway (3-4 cards)
  - Cards: Film category + thumbnail + duration + CTA
  - Responsive grid (3 → 2 → 1 cols)
- [ ] Featured film spotlight
  - Hero thumbnail + play button
  - Title + location + tags + story teaser
  - CTA: "Watch full film"
- [ ] Testimonials preview (2-4 cards)
- [ ] About teaser (founder portrait + story snippet)
- [ ] What you get (4-step timeline)
- [ ] Final CTA section (dual buttons)

**2C. Films Page**
- [ ] Page header with intro text
- [ ] Category filter chips (All, Wedding, Pre-Wedding, Ceremony, Reels)
- [ ] Featured row (hero films)
- [ ] Responsive grid of film cards (3 → 2 → 1 cols)
  - Card structure: Thumbnail + overlay on hover + title + metadata + CTA
  - Links to `/films/[slug]` detail page

**2D. Film Detail Page**
- [ ] Dynamic routing: `app/films/[slug]/page.tsx`
  - Fetch film data from database/CMS
  - Video player (Vimeo embed or custom player)
- [ ] Story section (narrative intro)
- [ ] Film stills gallery (masonry or grid, 8-20 images)
- [ ] Testimonial block (if available)
- [ ] Related films (carousel or grid, 3-4 films)
- [ ] High-intention CTA block ("Book your date" + "Request pricing")

**2E. About Page**
- [ ] Founder portrait hero
- [ ] Story section (brand narrative)
- [ ] Philosophy section (3 bullets with icons)
- [ ] Service areas highlight
- [ ] CTA

**2F. Testimonials Page**
- [ ] Filter chips (All, Wedding, Pre-Wedding, Ceremony)
- [ ] Testimonial cards grid (2-3 cols responsive)
  - Card: Quote + author + event type + location
  - Hover: Champagne border highlight
- [ ] CTA at bottom

**2G. Contact Page**
- [ ] Hero section
- [ ] 2-column layout (form left, contact info right; stack on mobile)
  - Contact form: Name, Email, Phone, Event Date, Location, Service Type, Message
  - Form validation (React Hook Form + Zod)
  - Submit endpoint: `POST /api/contact`
  - Success toast + email notification
  - Contact info: Email (mailto), Phone (tel), Address, Socials, Availability note
  - Google Maps embed (optional)

**2H. Global Components & Utilities**
- [ ] Set up Vimeo/YouTube embed component
- [ ] Image optimization (Next.js Image component)
- [ ] Responsive image ratios (16:9 for films, portrait for photos, 9:16 for mobile vertical)
- [ ] Mobile nav dropdown menu
- [ ] Form handling + validation
- [ ] Toast notifications (success/error)

**Acceptance Criteria:**
- Design system fully implemented (colors, typography, components)
- All 6 pages built and responsive (desktop, tablet, mobile)
- Hero sections cinematic and high-impact
- CTAs prominent and accessible (thumb-friendly, 48px+ height)
- All contact information easily accessible and functional
- Images optimized and lazy-loaded
- Micro-interactions smooth and non-distracting
- Lighthouse score: 85+ for all pages
- Mobile-first UX verified on real devices

---

### Phase 3: Admin Dashboard & Invite Creator
**Deliverable:** Admin panel for creating dynamic wedding invites
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
- [ ] Copy-to-clipboard button for invite sharing

**Acceptance Criteria:**
- Form submits successfully, creates database record
- Photos upload to Supabase Storage with public URLs
- Invite list displays all created invites with view counts
- Can delete invites
- Share URL is easily copyable

**Tech Notes:**
- Use Next.js `<Image>` component for photo previews
- Supabase Storage publishes to: `https://<project>.supabase.co/storage/v1/object/public/invites/...`
- Generate slug via: `crypto.randomBytes(6).toString('hex')` (12-char hex string)

---

### Phase 4: Dynamic Invite Page with Animations
**Deliverable:** Animated invite rendering with scroll-triggered reveals
**Tasks:**
- [ ] Create `app/invites/[slug]/page.tsx` (dynamic route)
  - Server-side fetch invite data from PostgreSQL
  - Render as 404 if not found
  - Increment view_count (via API call)
- [ ] Design invite template layout (inspired by 2soulfilms aesthetic):
  - Slide 1: Hero (large couple photo + bride/groom names fade-in)
  - Slide 2: Event details (date, time, location) with elegant typography
  - Slide 3: Secondary photo + couple story (poetic formatting)
  - Slide 4: RSVP info / closing message with 2soulfilms branding
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
- [ ] Static generation optimization: use `revalidate: 3600` (ISR)
- [ ] Open Graph meta tags (for link preview when shared)

**Acceptance Criteria:**
- Invite renders correctly with all data
- Scroll animations trigger smoothly (no jank)
- Photos display with correct aspect ratio
- Mobile layout is readable
- Link preview shows couple names + event date when shared on social

**Performance Notes:**
- ISR (Incremental Static Regeneration) at 1 hour = cached at Edge, ~100ms response
- Framer Motion `viewport={{ once: false }}` = animations repeat on scroll
- Next.js Image optimization automatically serves WebP

---

### Phase 5: Testing, Analytics & Launch
**Deliverable:** Production-ready deployment with monitoring
**Tasks:**
- [ ] E2E tests (Playwright):
  - Login → Create invite → View invite flow
  - Delete invite works
  - Shared invite renders for anonymous users
  - Contact form submission
- [ ] Performance audit (Lighthouse):
  - Invite pages: 90+ score target
  - LCP < 2.5s, CLS < 0.1
  - Gallery images fast-loading
- [ ] Security audit:
  - No SQL injection (Supabase parameterization)
  - Auth routes protected
  - Rate limiting on API endpoints
  - CORS configured correctly
- [ ] Analytics setup:
  - Track invite views, shares
  - Contact form submissions
  - Gallery engagement (optional heat map)
- [ ] Final Vercel deployment
- [ ] Backup Supabase database
- [ ] Set up monitoring (Sentry for errors, Vercel Analytics)
- [ ] Create admin documentation for photographer

**Acceptance Criteria:**
- All pages load without errors
- Contact info is current and working
- Invite generation and viewing workflow is smooth
- No performance issues or security vulnerabilities
- Analytics dashboard shows usage data

---

## 5. KEY TECHNICAL DECISIONS & TRADE-OFFS

### Decision 1: Static Generation vs. Real-Time Rendering
**Choice:** ISR (Incremental Static Regeneration) at 1-hour revalidate  
**Trade-off:**
- ✅ Invites cached globally on Vercel's Edge, ~100ms response
- ✅ Massively lower database load
- ❌ Updates take up to 60 mins to propagate (acceptable for this use case)

---

### Decision 2: Scroll-Triggered Animations
**Choice:** Scroll-triggered (user-driven pacing)  
**Trade-off:**
- ✅ Better accessibility and control
- ✅ Lower CPU usage
- ❌ Requires explicit scroll (some guests might not scroll)
- **Mitigation:** Add subtle visual cues (arrows, "Scroll for more") on first load

---

### Decision 3: Image Storage & CDN
**Choice:** Supabase Storage + Supabase-managed CDN  
**Trade-off:**
- ✅ Integrated with auth, no additional cost
- ✅ Automatic CDN caching
- ❌ Single region (can add CloudFront later if scaling internationally)

---

## 6. SECURITY & GOVERNANCE

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
- GDPR-compliant: Account deletion cascades to remove all invites

---

## 7. FAILURE MODES & MITIGATIONS

| Failure Mode | Impact | Mitigation |
|--------------|--------|-----------|
| Supabase Storage outage | Photos can't upload | Graceful error message, retry button |
| PostgreSQL connection fails | Can't create invites | Connection pooling + exponential backoff |
| Large photo upload (20MB+) | Slow upload, timeout | Client-side validation (max 5MB), image compression |
| Photographer forgets password | Locked out | Password reset flow (Supabase Auth) |
| Accidental delete of invite | Data loss | Consider soft deletes with restore option |

---

## 8. DEPLOYMENT & HOSTING

**Platform:** Vercel (native Next.js hosting)  
**Database:** Supabase PostgreSQL (free tier sufficient for < 100 invites/month)  
**Storage:** Supabase Storage (images/logo)  
**Domain:** Configure custom domain (TBD)  
**Email:** Optional Resend/SendGrid for contact form & invite sharing

**Estimated Monthly Cost:**
- Vercel: $0-20 (hobby-pro tier)
- Supabase: $25-50 (free tier + storage overage)
- **Total: ~$25-70/month**

---

## 9. DELIVERABLES FOR CLAUDE CODE

Use this plan to instruct Claude Code with a prompt like:

```
Build a production-ready wedding photographer website for 2soulfilms using an "Editorial Cinematic Storytelling" approach.

BRAND DETAILS:
- Photographer: 2soulfilms
- Tagline: "We Make Wedding Stories | Wedding Films"
- Subtitle: "Beyond The Destination, You Can Always Memorize"
- Owner: Sreeyam Behera (@sreeyam_behera)
- Phone: +91 87637 89647
- Email: 2solu2018@gmail.com
- Instagram: @2soulfilms, Facebook: 2soulfilms
- Service Area: All Over INDIA
- Address: Rashulgarh, Bhubaneswar, India 751010
- Bio: "To love or have loved that is enough. There is no other pearl to be found in those souls or in the dark fold of life. 2 Soul gives abundance of memories like mist suspended in the grass of a winter morning."

DESIGN SYSTEM:
Color Palette:
  - Primary Text: Charcoal Ink (#0B0F19)
  - Background: Ivory Paper (#F8F4EE)
  - Accent (CTAs): Champagne (#CBB89E)
  - Secondary Accent: Soft Blush (#E7D4C8)
  - Cards: Pure White (#FFFFFF)
  - Secondary Text: Warm Gray (#2F3A4B)

Design Philosophy:
  - Minimal, high-intention UX: funnels to film viewing + booking
  - Mobile-first (vertical video, thumb-friendly CTAs)
  - Categorization to reduce decision fatigue
  - Micro-interactions (smooth scroll, hover reveals, subtle glow) — no gimmicks
  - Heavy visuals, light text

PAGES TO BUILD:
  1. Home (hero + category gateway + featured film + testimonials + process + CTAs)
  2. Films (category filter chips + featured row + film grid)
  3. Film Detail (video player + story + stills gallery + testimonial + related films + CTA)
  4. About (founder portrait + story + philosophy + service areas)
  5. Testimonials (filterable cards + CTA)
  6. Contact (contact form + contact info + socials)

TECHNICAL STACK:
  - Next.js 14 with TypeScript
  - Tailwind CSS (with custom color tokens)
  - Framer Motion for micro-animations (scroll reveals, hover effects)
  - React Hook Form + Zod for form validation
  - Supabase (Auth, PostgreSQL, Storage)
  - Next.js Image optimization
  - Vercel deployment

IMPLEMENTATION PRIORITY:
  1. Phase 1: Core Infrastructure (Next.js boilerplate, Supabase, auth)
  2. Phase 2: Design System & Public Portfolio (all 6 pages + design tokens)
  3. Phase 3: Admin Dashboard & Invite Creator
  4. Phase 4: Dynamic Wedding Invite Pages
  5. Phase 5: Testing & Launch

DESIGN SPECIFICATIONS:
  - Mobile-first responsive design
  - Sticky navbar with logo + nav + CTA button
  - Hero sections: full-width cinematic background, centered text overlay
  - Cards: hover reveals, subtle shadows, Champagne accents
  - CTAs: Primary (Champagne), Secondary (outline), minimum 48px height for touch
  - Animations: cubic-bezier(0.25, 0.46, 0.45, 0.94) for smooth scroll
  - Images: Lazy-loaded, optimized for web, responsive aspect ratios
  - Lighthouse target: 85+ score on all pages

Follow all page structure specifications and micro-interaction details from the plan.
Focus on vibe coding — iterate and refine as you build.
```

---

## 10. QUICK START CHECKLIST

- [ ] Create Supabase project (free tier)
- [ ] Create Vercel project (GitHub integration)
- [ ] Scaffold Next.js 14 with TypeScript
- [ ] Install dependencies: `framer-motion`, `@supabase/supabase-js`, `shadcn/ui`
- [ ] Copy DB schema into Supabase SQL editor
- [ ] Set up environment variables in Vercel
- [ ] Upload 2soulfilms logo to project folder
- [ ] Begin Phase 1 implementation

---

## 11. DESIGN GUIDELINES FOR VIBE CODING

### Component Patterns

**Buttons**
- Primary: Champagne background, Charcoal text, hover → slight scale + glow
- Secondary/Outline: Charcoal text, Ivory/white border, hover → Soft Blush background
- All buttons: min-height 48px, rounded-lg, font-medium

**Cards**
- Background: Pure White (#FFFFFF) on Ivory background
- Border: None or subtle warm-gray border
- Hover: Scale 1.02, subtle shadow expand, play button reveal (for films)
- Padding: 24px (desktop), 16px (mobile)

**Text Hierarchy**
- H1: 56px / 48px (mobile), Charcoal, heading font
- H2: 36px / 28px, Charcoal, heading font
- H3: 24px / 20px, Charcoal, body font, weight 600
- Body: 16px / 14px, Warm Gray, leading 1.6
- Metadata (tags, dates): 12px / 11px, Warm Gray, uppercase letter-spacing

**Images & Videos**
- Use Next.js Image component for optimization
- Aspect ratios: 16:9 (landscape), 9:16 (mobile vertical), 1:1 (profile/team)
- Lazy-load with blur placeholder or skeleton
- Video thumbnails: Play button centered, semi-transparent overlay

**Forms**
- Input fields: Border Warm Gray, focus → Champagne border + glow
- Labels: Charcoal, 14px, weight 500
- Error text: Red or warm accent, 12px
- Success state: Green or Champagne checkmark

**Micro-interactions Checklist**
- ✅ Smooth scroll (document-level)
- ✅ Card hover → scale + shadow + play button overlay
- ✅ Button hover → scale + glow (Champagne shadow)
- ✅ Category chip select → Champagne underline
- ✅ Fade-in on scroll (Intersection Observer, opacity + y: 20px)
- ✅ Video play button → appears on thumbnail hover
- ✅ Form submit → loading spinner → toast notification
- ❌ Avoid: Flash animations, 3D transforms, disorienting transitions

**Mobile-First Approach**
- Start with single-column layouts
- Touch targets: min 48px x 48px
- Buttons: Full-width stacked on mobile
- Navigation: Hamburger menu (sticky), CTA stays visible
- Spacing: 16px (mobile), 24px (tablet), 32px (desktop)

---

## 12. QUICK START CHECKLIST

- [ ] Create Supabase project (free tier)
- [ ] Create Vercel project (GitHub integration)
- [ ] Scaffold Next.js 14 with TypeScript
- [ ] Install dependencies:
  - UI: `shadcn/ui`, `tailwindcss`
  - Forms: `react-hook-form`, `zod`
  - Animations: `framer-motion`
  - Auth: `@supabase/supabase-js`
  - Utils: `next/image`, `react-intersection-observer`
- [ ] Set up Tailwind config with custom color palette
- [ ] Create Supabase tables (photographer_profiles, invite_templates, wedding_invites, invite_pageviews)
- [ ] Set up environment variables in Vercel
- [ ] Upload 2soulfilms logo to project folder
- [ ] Prepare 3-5 sample wedding film thumbnails/samples
- [ ] Begin Phase 1 implementation

---

**Notes for Claude:**
- This is a vibe-coding project — prioritize feel & UX over perfection
- Iterate: Build Phase 2 (public site) first; it's the conversion engine
- Test on real mobile devices (not just browser dev tools)
- Lighthouse 85+ is the bar; optimize images aggressively
- Champagne is the only accent color — use it sparingly for maximum impact
