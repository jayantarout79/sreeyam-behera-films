# 2soulfilms Mobile Invitation System - Complete Overview

## Quick Summary

You now have a **mobile-only (9:16 vertical) 4-slide invitation system** where:
- Each template has **4 different backgrounds** (one per slide)
- All 4 slides within a template **maintain the same visual theme** but have different designs
- **Slide 2 is venue-focused** (location, date, time emphasized)
- **All text is dynamically overlaid** (no text baked into images)
- Users upload couple photos which get composited only on **Slide 1**
- System generates 4 separate composite images (one per slide)
- Final invite is a **scrollable/swipeable mobile experience**

---

## The 24 Background Images You Need to Generate

### File Structure
```
/public/invite-backgrounds/
├── template-1-romantic-elegant/
│   ├── slide-1-hero.png (couple photo area + names)
│   ├── slide-2-venue.png (VENUE-FOCUSED: date, time, location design)
│   ├── slide-3-story.png (couple story/narrative text space)
│   └── slide-4-closing.png (RSVP/closing message)
├── template-2-modern-cinematic/ (same 4 slides)
├── template-3-minimalist-blush/ (same 4 slides)
├── template-4-vintage-romantic/ (same 4 slides)
├── template-5-bold-geometric/ (same 4 slides)
└── template-6-nature-inspired/ (same 4 slides)
```

**Total: 24 images (6 templates × 4 slides)**

### Image Specifications (ALL slides)
- **Format:** PNG with transparency
- **Aspect Ratio:** 9:16 (Mobile vertical only, portrait)
- **Resolution:** 1080×1920px minimum
- **Color Palette:** Charcoal (#0B0F19), Ivory (#F8F4EE), Champagne (#CBB89E), Soft Blush (#E7D4C8), Pure White, Warm Gray
- **NO text baked into any image** (all text overlaid dynamically)
- **Reserved text areas** clearly visible in design

---

## How the System Works (Step-by-Step)

### Step 1: Photographer Creates Invite (Admin Dashboard)
```
1. Selects template (e.g., "Romantic Elegant")
2. Fills form:
   - Bride name, Groom name
   - Event date, Event time
   - Event location
   - Couple story (narrative text)
3. Uploads 1-2 couple photos (JPG/PNG, max 5MB)
4. System shows live preview of Slide 1 (real-time canvas preview)
5. Clicks "Create Invite"
```

### Step 2: System Generates 4 Composite Images
```
SLIDE 1 (Hero):
  ├─ Load: template-1-romantic-elegant/slide-1-hero.png
  ├─ Composite: Couple photos (top 60% area)
  └─ Overlay: Bride name + Groom name (large, elegant text)

SLIDE 2 (Venue Details):
  ├─ Load: template-1-romantic-elegant/slide-2-venue.png (VENUE-CENTRIC DESIGN)
  └─ Overlay: Event date + Event time + Event location + Venue name

SLIDE 3 (Story):
  ├─ Load: template-1-romantic-elegant/slide-3-story.png
  └─ Overlay: Couple story (italic, flowing text)

SLIDE 4 (Closing):
  ├─ Load: template-1-romantic-elegant/slide-4-closing.png
  └─ Overlay: RSVP message + Contact info + Closing statement
```

### Step 3: Upload & Store
```
- All 4 composite images → Supabase Storage
- URLs stored in wedding_invites table:
  - slide_1_url
  - slide_2_url
  - slide_3_url
  - slide_4_url
- Generate unique slug: /invites/{unique_slug}
- Create shareable link
```

### Step 4: Guest Views Invite
```
Guest receives link: https://2soulfilms.com/invites/abc123xyz
  ↓
Mobile-only 9:16 format displays:
  ├─ Slide 1: Couple photo + names (scroll down)
  ├─ Slide 2: Date, time, location, venue (scroll down)
  ├─ Slide 3: Couple story (scroll down)
  └─ Slide 4: RSVP info, closing message
  
Navigation: Scroll/swipe on mobile, scroll on desktop
Slide indicators: Shows which slide (1/4, 2/4, etc.)
```

---

## Key Design Points

### Slide 2: Venue-Focused Design
**Why separate, special design for Slide 2?**
- Guests care most about: WHERE (location) + WHEN (date/time)
- Venue slide has architectural/location elements in background
- Makes location/logistics crystal clear
- Different from Slide 1 (couple) + Slide 3 (story) + Slide 4 (action)

**Slide 2 Background Examples:**
- **Romantic Elegant:** Ornate architectural elements, garden gazebo illustration
- **Modern Cinematic:** Geometric venue silhouette, modern building lines
- **Minimalist Blush:** Abstract architectural suggestion (ultra-minimal)
- **Vintage Romantic:** Garden/historic building botanical style
- **Bold Geometric:** Bold architectural geometric shapes
- **Nature-Inspired:** Landscape/venue setting (mountains, beach, garden)

### Visual Continuity Within Template
All 4 slides use:
- Same color palette (#0B0F19, #F8F4EE, #CBB89E, #E7D4C8)
- Same typographic style (Playfair Display for headings, Inter for body)
- Same aesthetic (romantic OR modern OR minimalist, etc.)
- But DIFFERENT background designs to keep scrolling engaging

### Mobile-Only Format
- **Always 9:16 aspect ratio** (no responsive scaling)
- Desktop display: Centered frame, mobile-sized (1080px width)
- Mobile display: Full-screen, edge-to-edge
- No breakpoints needed (single fixed size)
- Touch gestures: Swipe to next slide (on mobile)

---

## Documents You Have

### 1. **INVITE-BACKGROUNDS-MOBILE-ONLY-PROMPT.md**
   - **Use this to generate your 24 background images**
   - 6 detailed template prompts (one per template)
   - Each prompt has 4 sub-prompts (one per slide)
   - Detailed specifications for each slide design
   - File organization structure

### 2. **PLAN-2soulfilms.md** (Updated)
   - Complete build plan with mobile-only invite system
   - Database schema (storing 4 slide URLs per template)
   - Image composition logic (client-side + server-side code examples)
   - Phase 3: Admin dashboard + template system + image composition
   - Phase 4: Multi-slide mobile invite pages
   - Design guidelines for Claude Code

---

## Your Workflow Now

### 1. Generate Background Images
```
For each of the 6 templates:
  For each of the 4 slides:
    Use the prompt to generate image with DALL-E/Midjourney
    Aspect ratio: 9:16 (1080×1920px)
    Format: PNG with transparency
    Download + save to folder structure
```

### 2. Organize Files
```
/public/invite-backgrounds/
├── template-1-romantic-elegant/
│   ├── slide-1-hero.png
│   ├── slide-2-venue.png
│   ├── slide-3-story.png
│   └── slide-4-closing.png
... (repeat for templates 2-6)
```

### 3. Send to Claude Code
**Use this prompt:**
```
Build a mobile-only wedding invitation system for 2soulfilms based on PLAN-2soulfilms.md:

MOBILE-ONLY INVITES:
- Aspect ratio: 9:16 vertical (1080×1920px)
- Format: 4-slide scrollable/swipeable experience
- Slide 1: Couple photo + names
- Slide 2: Venue/event details (VENUE-FOCUSED design)
- Slide 3: Couple story/narrative
- Slide 4: RSVP/closing message

TEMPLATE SYSTEM:
- 6 pre-designed templates with 4 backgrounds each (24 total images)
- All backgrounds at /public/invite-backgrounds/
- Database stores 4 URLs per template (slide_1, slide_2, slide_3, slide_4)

WORKFLOW:
1. Admin selects template
2. Uploads couple photos
3. System composites photos on Slide 1 only
4. System overlays text on all 4 slides
5. Generates 4 composite images
6. Stores in Supabase Storage
7. Creates scrollable invite page

TECH:
- Next.js 14, TypeScript
- Supabase (auth, database, storage)
- Sharp.js for server-side image composition
- Canvas API for client-side preview (Slide 1 only)
- Framer Motion for subtle animations
- Mobile-first responsive design

PRIORITY:
- Phase 1: Core infra
- Phase 2: Public website
- Phase 3: Admin + template system + image composition
- Phase 4: Multi-slide mobile invite pages
- Phase 5: Testing & launch

Follow all specifications in PLAN-2soulfilms.md section 3B (Invite Composition System) and Phase 3-4.
```

---

## Database Updates (Claude Code Will Handle)

### invite_templates table
- Stores 4 background URLs per template:
  - `slide_1_hero_bg_url`
  - `slide_2_venue_bg_url`
  - `slide_3_story_bg_url`
  - `slide_4_closing_bg_url`

### wedding_invites table
- Stores 4 composite image URLs per invite:
  - `slide_1_url` (couple photo + names)
  - `slide_2_url` (venue details)
  - `slide_3_url` (couple story)
  - `slide_4_url` (RSVP/closing)

---

## Design Notes

### Why This Approach?

**Mobile-Only (9:16):**
- Guests view invites on phones (90%+ mobile traffic)
- Vertical format is natural for phones
- Full-screen immersive experience
- No responsive headaches (single fixed size)

**4 Slides Instead of Single Page:**
- More engaging than long scroll
- Each slide has purpose (who, where, story, action)
- Swipeable/scrollable feels like app experience
- Guests can share individual slides if desired

**Separate Backgrounds Per Slide:**
- Keeps visual interest high
- Prevents monotony during scroll
- Slide 2 venue-focus makes location clear
- Design variety within cohesive theme

**No Text Baked Into Images:**
- Fully customizable (photographer can adjust)
- Dynamic updates (change dates, names, locations)
- Reusable backgrounds (same template for 100 invites)
- Smaller file sizes (backgrounds, not full composites)

---

## Timeline

1. **Generate 24 images** (using provided prompts) → ~2-4 hours
2. **Organize files** → ~30 minutes
3. **Send to Claude Code** → ~1-2 hours (depends on vibe coding pace)
4. **Test & refine** → ~1 hour
5. **Ready for photographer** → Total ~4-8 hours

---

## Questions Before Generating?

- Color palette correct? (#0B0F19, #F8F4EE, #CBB89E, #E7D4C8)
- Slide 2 venue-focus makes sense?
- Any adjustment to slide 1 photo area (top 60%)?
- Any specific venue types to emphasize (e.g., church, garden, beach)?
- RSVP info preference (email, phone, both)?

**Ready to generate the 24 background images!**
