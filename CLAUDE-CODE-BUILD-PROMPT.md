# 2soulfilms Wedding Invitation Platform - Claude Code Build Prompt

## PROJECT OVERVIEW

Build a complete wedding photographer platform for **2soulfilms** (owner: Sreeyam Behera) with:
- Public marketing website showcasing films and photography
- Admin dashboard for photographers to create dynamic wedding invitations
- Mobile-only (9:16 vertical) 4-slide scrollable invitation system
- Real-time photo composition preview and generation
- Shareable invitation links with analytics

**Brand:** Editorial cinematic storytelling approach. Premium luxury wedding filmmaking.

---

## BRAND DETAILS

**Company:** 2soulfilms
**Owner:** Sreeyam Behera
**Phone:** +91 87637 89647
**Email:** 2solu2018@gmail.com
**Instagram:** @2soulfilms
**Address:** [To be added - Bangalore based]

**Design Philosophy:** 
- Editorial cinematic storytelling
- Emotional, intimate, luxury focus
- Scroll-triggered subtle animations
- Mobile-first (invitations desktop responsive, but mobile primary)

---

## TECHNOLOGY STACK

**Frontend:**
- Next.js 14 with TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (scroll animations, micro-interactions)
- Canvas API (client-side preview)
- React Query (data fetching)

**Backend:**
- Next.js API routes (SSR/ISR)
- Supabase (PostgreSQL, Auth, Storage)
- Sharp.js (server-side image composition)
- Zod (validation)

**Infrastructure:**
- Vercel deployment
- Supabase Cloud
- Supabase Storage (image CDN)

---

## DATABASE SCHEMA

### PostgreSQL Tables (Supabase)

#### 1. photographer_profiles
```sql
CREATE TABLE photographer_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  email VARCHAR(255),
  bio TEXT,
  instagram_handle VARCHAR(255),
  website_url VARCHAR(255),
  logo_url VARCHAR(255),
  color_scheme JSONB, -- {primary, secondary, accent}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. invite_templates
```sql
CREATE TABLE invite_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255), -- "Romantic Elegant", "Modern Cinematic", etc
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  category VARCHAR(100), -- aesthetic category
  color_palette JSONB, -- {charcoal, ivory, champagne, blush}
  slide_1_hero_bg_url VARCHAR(500),
  slide_2_venue_bg_url VARCHAR(500),
  slide_3_story_bg_url VARCHAR(500),
  slide_4_closing_bg_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. wedding_invites
```sql
CREATE TABLE wedding_invites (
  id UUID PRIMARY KEY,
  photographer_id UUID REFERENCES photographer_profiles(id),
  template_id UUID REFERENCES invite_templates(id),
  slug VARCHAR(255) UNIQUE,
  bride_name VARCHAR(255),
  groom_name VARCHAR(255),
  event_date DATE,
  event_time VARCHAR(50),
  event_location VARCHAR(500),
  venue_name VARCHAR(255),
  couple_story TEXT,
  couple_photo_1_url VARCHAR(500),
  couple_photo_2_url VARCHAR(500),
  slide_1_url VARCHAR(500), -- final composite
  slide_2_url VARCHAR(500),
  slide_3_url VARCHAR(500),
  slide_4_url VARCHAR(500),
  rsvp_info JSONB, -- {phone, email, website}
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. invite_pageviews
```sql
CREATE TABLE invite_pageviews (
  id UUID PRIMARY KEY,
  invite_id UUID REFERENCES wedding_invites(id),
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer VARCHAR(500),
  country VARCHAR(100)
);
```

---

## IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure (Foundation)
**Priority: 1** | **Effort: 2 days** | **Owner: Claude Code**

Tasks:
- [ ] Next.js 14 project setup with TypeScript, Tailwind, shadcn/ui
- [ ] Supabase project setup (PostgreSQL, Auth, Storage)
- [ ] Database schema creation (all 4 tables above)
- [ ] Authentication flow (email/password, Google OAuth)
- [ ] Environment configuration (.env.local, secrets)
- [ ] Basic project structure (app/, components/, lib/, etc)
- [ ] Utility functions (image handling, composition helpers)

Deliverables:
- Working Next.js app with auth
- Supabase connected and operational
- Database seeded with 6 invite templates

---

### Phase 2: Public Website & Marketing Pages
**Priority: 2** | **Effort: 3 days** | **Owner: Claude Code**

**Design System Implementation:**
- Color palette: Charcoal (#0B0F19), Ivory (#F8F4EE), Champagne (#CBB89E), Soft Blush (#E7D4C8)
- Typography: Playfair Display (headings), Inter (body)
- Micro-interactions: Scroll-triggered reveals, smooth transitions

**6-Page Structure:**

1. **Home Page** (`/`)
   - Hero section: Cinematic video background, tagline "Editorial Cinematic Storytelling"
   - Category gateway: 6 film category buttons (navigation)
   - Featured film showcase: Latest/featured wedding film with preview
   - Testimonials section: 3-4 client quotes + photos
   - Process overview: 4-step photographer-to-guest workflow
   - CTA buttons: "Explore Our Work", "Book a Consultation"

2. **Films Gallery** (`/films`)
   - Filter chips: By category, duration, style
   - Featured row: Top 3 most-viewed films
   - Film grid: All films with thumbnails, titles, category tags
   - Hover state: Preview video, view details CTA
   - Load more / Pagination

3. **Film Detail Page** (`/films/[slug]`)
   - Video player: Embedded wedding film
   - Story section: Couple story narrative (typography-focused)
   - Stills gallery: Photo highlights from film
   - Related films: 3-4 similar films
   - CTA: "Create Your Invitation", "Book 2soulfilms"

4. **About Page** (`/about`)
   - Founder portrait: Sreeyam Behera
   - Personal story: Philosophy, approach, why cinematography
   - Team section: (If applicable; can be founder-focused initially)
   - Values/philosophy callout

5. **Testimonials Page** (`/testimonials`)
   - Filter chips: By year, occasion type, venue
   - Testimonial cards: Client quote, couple photo, film link
   - Video testimonials (optional): Embedded video statements
   - Call-to-action: "Book Us"

6. **Contact Page** (`/contact`)
   - Contact form: Name, email, phone, date, message
   - Contact info: Phone (+91 87637 89647), email (2solu2018@gmail.com)
   - Instagram link, location map
   - Form submission → Supabase DB + Email notification

Deliverables:
- 6 fully functional pages with responsive design
- Design system tokens (colors, typography, spacing)
- Scroll animations (Framer Motion)
- Contact form integration
- Image optimization (Next.js Image component)

---

### Phase 3: Admin Dashboard & Invite Template System
**Priority: 3** | **Effort: 2 days** | **Owner: Claude Code**

**Admin Dashboard** (`/admin`)
- Authentication wall (photographer login required)
- Dashboard overview: Total invites, views, recent activity

**Template Management:**
- Browse all 6 templates with preview thumbnails
- Template selector: Display 6 template previews in grid
- Each template shows all 4 slide background previews

**Image Composition System:**

**Client-Side Canvas Preview (Slide 1 Only):**
```typescript
// Real-time preview while photographer inputs data
- Load slide-1-hero.png background
- Load couple photo(s) from input
- Composite photo on canvas (top 60% area, centered)
- Overlay couple names (large, elegant text)
- Display on screen as live preview
- Allow photographer to approve before generating
```

**Server-Side Image Composition (All 4 Slides):**
```typescript
// Sharp.js - server-side generation after form submission
SLIDE 1:
  - Load slide-1-hero.png
  - Composite couple photos (top 60%)
  - Overlay bride name + groom name
  - Export PNG → Supabase Storage

SLIDE 2:
  - Load slide-2-venue.png (venue-focused design)
  - Overlay event date + event time + event location + address
  - Overlay venue name (prominent)
  - Export PNG → Supabase Storage

SLIDE 3:
  - Load slide-3-story.png
  - Overlay couple story text (italic, flowing)
  - Export PNG → Supabase Storage

SLIDE 4:
  - Load slide-4-closing.png
  - Overlay RSVP message + contact info + closing statement
  - Export PNG → Supabase Storage
```

**Photo Upload & Composition:**
- Form fields: Bride name, Groom name, Event date, Event time, Event location, Venue name, Couple story, RSVP phone, RSVP email
- Photo upload: 1-2 couple photos (JPG/PNG, max 5MB each)
- Canvas preview: Real-time Slide 1 preview
- Submission: "Create Invite" button
- Processing: Server generates 4 composites in parallel

**Text Overlay Specifications:**
- Bride/Groom names: Playfair Display, 48-56px, Charcoal (#0B0F19), centered
- Couple story: Inter, 16-18px, italic, Charcoal, centered, max 200 characters
- Event details (date, time, location): Inter, 18-22px, Charcoal, centered/organized layout
- RSVP info: Inter, 16px, Charcoal, bottom area, clear hierarchy

Deliverables:
- Admin dashboard with template selector
- Photo upload and validation
- Client-side Canvas preview (Slide 1)
- Server-side Sharp.js composition (all 4 slides)
- Image storage in Supabase Storage
- Invite URL generation with unique slug

---

### Phase 4: Multi-Slide Mobile Invite Pages
**Priority: 4** | **Effort: 2 days** | **Owner: Claude Code**

**Invite Display Page** (`/invites/[slug]`)
- Mobile-only (9:16 vertical format)
- 4-slide scrollable/swipeable experience
- Each slide: Full-screen 1080×1920px image

**Slide Structure:**
```
Slide 1: Couple photo + names
         [Generated composite - slide_1_url from DB]

Slide 2: Venue & event details
         [Generated composite - slide_2_url from DB]

Slide 3: Couple story
         [Generated composite - slide_3_url from DB]

Slide 4: RSVP & closing message
         [Generated composite - slide_4_url from DB]
```

**Features:**
- Scroll/swipe navigation (mobile touch-friendly)
- Slide indicators: "1/4", "2/4", "3/4", "4/4" (current/total)
- Smooth scroll animation (Framer Motion)
- Desktop display: Centered mobile-sized frame (1080px width, 1920px height) with scroll bar
- Mobile display: Full-screen edge-to-edge
- Pagination dots: Show which slide guest is viewing
- Share buttons: Share invite link (WhatsApp, Facebook, Email, Copy Link)
- Back button: Return to home

**Animations:**
- Slide transitions: Smooth vertical scroll
- On-scroll reveals: Text/UI elements fade/slide in on scroll
- Hover states: Buttons, icons responsive
- Loading state: Skeleton while images load

**Analytics:**
- Track page views (pageviews table)
- Collect IP, user agent, referrer, country
- Display view count on admin dashboard (future feature)

**Desktop Fallback:**
- Center mobile frame (1080px width)
- Scroll within frame on desktop
- Maintain 9:16 aspect ratio
- No responsive breakpoints (fixed size)

**Error Handling:**
- 404 page: Invite not found
- 500 page: Server error (generic)
- Image loading timeout: Fallback placeholder
- Missing data: Display placeholder text

Deliverables:
- `/invites/[slug]` route with dynamic rendering
- 4-slide scrollable/swipeable component
- Mobile-optimized presentation
- Analytics tracking
- Share functionality
- Error pages

---

### Phase 5: Testing & Launch
**Priority: 5** | **Effort: 1 day** | **Owner: Claude Code**

Tasks:
- [ ] End-to-end testing: Admin flow → invite creation → guest view
- [ ] Image composition testing: All 6 templates × 4 slides
- [ ] Responsive testing: Mobile (iPhone 12, iPhone 14), Tablet (iPad), Desktop
- [ ] Performance testing: Image load times, page render speed
- [ ] Accessibility: WCAG 2.1 AA compliance (headings, contrast, keyboard nav)
- [ ] Security: Input validation, SQL injection prevention, CORS
- [ ] Deployment: Vercel production deployment
- [ ] Domain setup: DNS configuration
- [ ] Monitoring: Error tracking (Sentry), analytics (Vercel Analytics)

Deliverables:
- Production-ready application
- All tests passing
- Live at production domain
- Monitoring enabled

---

## FILE ORGANIZATION

### Background Images (Pre-generated)
```
/public/invite-backgrounds/
├── template-1-romantic-elegant/
│   ├── slide-1-hero.png
│   ├── slide-2-venue.png
│   ├── slide-3-story.png
│   └── slide-4-closing.png
├── template-2-modern-cinematic/
│   ├── slide-1-hero.png
│   ├── slide-2-venue.png
│   ├── slide-3-story.png
│   └── slide-4-closing.png
├── template-3-minimalist-blush/
├── template-4-vintage-romantic/
├── template-5-bold-geometric/
└── template-6-nature-inspired/
    ├── slide-1-hero.png
    ├── slide-2-venue.png
    ├── slide-3-story.png
    └── slide-4-closing.png
```

### Code Structure
```
/app
  /layout.tsx (main layout)
  /page.tsx (home page)
  /films
    /page.tsx (films gallery)
    /[slug]
      /page.tsx (film detail)
  /admin
    /layout.tsx (admin auth wall)
    /page.tsx (dashboard)
    /create-invite
      /page.tsx (invite creation form)
  /about
    /page.tsx
  /testimonials
    /page.tsx
  /contact
    /page.tsx
  /invites
    /[slug]
      /page.tsx (invite display)
  /api
    /auth
    /invites
      /route.ts (create invite)
      /[id]/route.ts (get invite, update analytics)
    /compose
      /route.ts (server-side image composition)

/components
  /ui (shadcn/ui components)
  /sections (Hero, Testimonials, etc)
  /admin (Dashboard, TemplateSelector, FormSection)
  /invites (SlideContainer, SlideNavigation, ShareButtons)

/lib
  /supabase.ts (client setup)
  /db.ts (database queries)
  /image-compose.ts (Sharp.js helpers)
  /canvas-preview.ts (Canvas API helpers)
  /validation.ts (Zod schemas)

/public
  /invite-backgrounds/ (all 24 template images)
  /images/ (brand assets, logos, photos)

/styles
  /globals.css (Tailwind)
```

---

## KEY TECHNICAL DECISIONS

### Why Mobile-Only (9:16)?
- 90%+ of wedding invitation views are mobile
- Vertical format natural for phones
- Full-screen immersive experience
- Single fixed aspect ratio = no responsive headaches

### Why 4 Slides?
- More engaging than long scroll
- Each slide has purpose: who (Slide 1), where (Slide 2), story (Slide 3), action (Slide 4)
- Swipeable feels like app experience
- Guests can share individual slides if desired

### Why Separate Backgrounds Per Slide?
- Keeps visual interest during scroll
- Prevents monotony
- Slide 2 venue-focus makes location clear
- Design variety within cohesive theme

### Why Server-Side Composition (Sharp.js)?
- Generates high-quality final images once
- Reusable backgrounds (same template for 100 invites)
- Smaller storage footprint (backgrounds + composites, not full images per invite)
- Fast delivery to guests (pre-generated static images)

### Why Supabase Storage?
- Integrated CDN delivery
- Fast image delivery globally
- Automatic cache invalidation
- Easy integration with Next.js Image component

---

## PERFORMANCE TARGETS

- Home page: < 2s load time (Lighthouse > 85)
- Admin form: < 1s interaction response (Canvas preview instant)
- Image composition: < 3s server-side (Sharp.js optimization)
- Invite display: < 1.5s load (static image delivery via CDN)
- Mobile First Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## SECURITY CONSIDERATIONS

- Input validation: Zod on all forms (names, text, emails)
- SQL injection: Parameterized queries (Supabase client handles)
- CORS: Next.js API routes only accept from same origin
- CSRF: Next.js built-in protection
- XSS: React escaping + Content Security Policy headers
- Authentication: Supabase Auth (email/password + OAuth)
- File upload: Validate MIME type + size (max 5MB per photo)
- Rate limiting: API routes rate-limited per IP (future)

---

## DEPLOYMENT

**Hosting:** Vercel (Next.js optimized)
**Database:** Supabase Cloud (PostgreSQL)
**Storage:** Supabase Storage (images)
**Domain:** TBD (2soulfilms.com or similar)
**SSL:** Automatic (Vercel)
**Environment:** Production, staging branches

---

## MONITORING & ANALYTICS

**Sentry Integration:**
- Error tracking (exceptions, API failures)
- Performance monitoring
- Source map uploads

**Vercel Analytics:**
- Web Vitals tracking
- Route performance
- Build/deployment metrics

**Custom Analytics:**
- Pageview tracking (invite_pageviews table)
- Invitation creation success rate
- Admin dashboard metrics

---

## FUTURE ENHANCEMENTS (Post-MVP)

- Multi-language support (Hindi, English)
- Additional invitation templates (12+ total)
- Photographer custom backgrounds (upload own designs)
- Advanced analytics dashboard (views by device, geography)
- A/B testing for invitation designs
- Email invitation delivery (Sendgrid integration)
- WhatsApp integration for sharing
- Video invitations (embed short film clip)
- Guest RSVP tracking (form responses)
- Invitation expiration (time-limited links)

---

## SUCCESS CRITERIA

✅ Photographer can login to admin dashboard
✅ Photographer can create invitation in < 2 minutes (form + preview)
✅ Guest receives shareable link and can view 4-slide invitation
✅ All 6 templates × 4 slides render correctly
✅ Mobile experience is smooth and engaging
✅ Analytics tracking works (pageviews tracked)
✅ Public website showcases 2soulfilms brand effectively
✅ No errors in production (Sentry clean)
✅ Performance meets targets (Lighthouse > 80 on all pages)
✅ Photographer comfortable using admin (UX tested)

---

## GETTING STARTED

1. **Ensure all 24 background images are generated** and organized in `/public/invite-backgrounds/`
2. **Review PLAN-2soulfilms.md** for full architectural details
3. **Use this prompt as the primary build specification**
4. **Follow the 5-phase implementation in order**
5. **Test each phase before moving to next**
6. **Deploy Phase 1-2 early to validate infrastructure**

---

## SUPPORT RESOURCES

- **Architecture Details:** PLAN-2soulfilms.md
- **Image Prompts:** INVITE-BACKGROUNDS-MOBILE-ONLY-PROMPT.md or 24-IMAGE-GENERATION-PROMPTS-ORGANIZED.md
- **System Overview:** MOBILE-INVITE-SYSTEM-OVERVIEW.md
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## CONTACT & CLARIFICATIONS

**Brand Owner:** Sreeyam Behera (@2soulfilms)
**Email:** 2solu2018@gmail.com
**Phone:** +91 87637 89647

**For clarifications during build:**
- Reference this prompt + PLAN-2soulfilms.md
- Ask about specific template interpretations
- Validate design decisions early
- Test with real photographer workflow

---

**Ready to build. All specifications finalized. Proceeding with Phase 1.**
