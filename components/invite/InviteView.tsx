"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingInvite, CustomColors, RsvpInfo } from "@/types/database";
import { Calendar, Clock, MapPin, Heart, Share2, Copy, Check, Camera } from "lucide-react";

// Slide layout (6 total):
//   0 → photo_1_url full-bleed  →  names + tagline
//   1 → template bg slide-1-hero →  "You're Invited" / event header
//   2 → template bg slide-2-venue → venue & date details
//   3 → template bg slide-3-story → couple story
//   4 → template bg slide-4-closing → RSVP
//   5 → photo_2_url full-bleed  →  closing message + branding

const BG_FOLDERS: Record<number, string> = {
  1: "template-1-romantic-elegant",
  2: "template-2-modern-cinematic",
  3: "template-3-minimalist-blush",
  4: "template-4-vintage-romantic",
  5: "template-5-bold-geometric",
  6: "template-6-nature-inspired",
};

const SLIDE_BG_FILES = [
  "slide-1-hero",
  "slide-2-venue",
  "slide-3-story",
  "slide-4-closing",
] as const;

const TOTAL_SLIDES = 6;
const TRANSITION_MS = 620;

const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};
const slideTransition = {
  duration: TRANSITION_MS / 1000,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

interface InviteViewProps {
  invite: WeddingInvite;
  colors: CustomColors;
}

export default function InviteView({ invite, colors }: InviteViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copied, setCopied] = useState(false);
  const isAnimating = useRef(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/invites/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: invite.unique_slug }),
    }).catch(() => {});
  }, [invite.unique_slug]);

  const bgFolder = invite.template_id ? (BG_FOLDERS[invite.template_id] ?? null) : null;

  // Slides 1-4 (indices 1-4) map to the 4 template bg images
  function templateBgUrl(slideIndex: number): string | null {
    if (!bgFolder || slideIndex < 1 || slideIndex > 4) return null;
    return `/invite-backgrounds/${bgFolder}/${SLIDE_BG_FILES[slideIndex - 1]}.png`;
  }

  function goTo(next: number) {
    if (isAnimating.current || next < 0 || next >= TOTAL_SLIDES) return;
    isAnimating.current = true;
    setDirection(next > currentSlide ? 1 : -1);
    setCurrentSlide(next);
    setTimeout(() => { isAnimating.current = false; }, TRANSITION_MS + 60);
  }

  function onTouchStart(e: React.TouchEvent) { startY.current = e.touches[0].clientY; }
  function onTouchEnd(e: React.TouchEvent) {
    if (startY.current === null) return;
    const delta = startY.current - e.changedTouches[0].clientY;
    startY.current = null;
    if (Math.abs(delta) < 60) return;
    goTo(delta > 0 ? currentSlide + 1 : currentSlide - 1);
  }
  function onWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaY) < 20) return;
    goTo(e.deltaY > 0 ? currentSlide + 1 : currentSlide - 1);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `You're invited!\n${invite.bride_name} & ${invite.groom_name}'s Wedding\n${window.location.href}`
      )}`,
      "_blank"
    );
  }

  const formattedDate = new Date(invite.event_date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = invite.event_time
    ? new Date(`2000-01-01T${invite.event_time}`).toLocaleTimeString("en-IN", {
        hour: "numeric", minute: "2-digit", hour12: true,
      })
    : null;
  const rsvp = invite.rsvp_info as RsvpInfo | null;

  const sharedProps = { invite, colors, formattedDate, formattedTime, rsvp };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#0B0F19" }}>
      <div
        className="relative overflow-hidden select-none"
        style={{
          width: "min(100vw, 430px)",
          height: "min(100svh, calc(min(100vw, 430px) * 16 / 9))",
          maxHeight: "100svh",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0"
          >
            {currentSlide === 0 && (
              <Slide0Photo {...sharedProps} />
            )}
            {currentSlide >= 1 && currentSlide <= 4 && (
              <SlideTemplate
                slideIndex={currentSlide}
                bgUrl={templateBgUrl(currentSlide)}
                {...sharedProps}
              />
            )}
            {currentSlide === 5 && (
              <Slide5Closing {...sharedProps} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentSlide ? 7 : 4,
                height: i === currentSlide ? 7 : 4,
                background: i === currentSlide ? colors.primary : "rgba(255,255,255,0.35)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div
          className="absolute top-4 left-4 z-20 text-[10px] font-medium tabular-nums tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {currentSlide + 1} / {TOTAL_SLIDES}
        </div>

        {/* Share bar */}
        <div
          className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-6 px-6"
          style={{
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            paddingTop: 14,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
          }}
        >
          <ShareButton icon={<WhatsAppIcon />} label="WhatsApp" onClick={shareWhatsApp} color="#25D366" />
          <ShareButton
            icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            label={copied ? "Copied!" : "Copy Link"}
            onClick={copyLink}
            color={colors.primary}
          />
          <ShareButton
            icon={<Share2 className="h-4 w-4" />}
            label="Share"
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: `${invite.bride_name} & ${invite.groom_name}'s Wedding`,
                  url: window.location.href,
                }).catch(() => {});
              } else copyLink();
            }}
            color="rgba(255,255,255,0.55)"
          />
        </div>

        {/* Swipe hint on slide 0 */}
        {currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="absolute bottom-20 inset-x-0 flex flex-col items-center gap-1 z-20 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronDown style={{ color: colors.primary }} />
            </motion.div>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Swipe to explore
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Shared props ──────────────────────────────────────────────────────────────

interface SharedProps {
  invite: WeddingInvite;
  colors: CustomColors;
  formattedDate: string;
  formattedTime: string | null;
  rsvp: RsvpInfo | null;
}

// ── Slide 0: Photo 1 full-bleed — names + tagline ────────────────────────────

function Slide0Photo({ invite, colors }: SharedProps) {
  const tagline = (() => {
    if (invite.couple_story && invite.couple_story.length <= 65) return invite.couple_story;
    return "Two hearts. One beautiful beginning.";
  })();

  return (
    <div className="absolute inset-0">
      {/* Photo or deep gradient background */}
      {invite.photo_1_url ? (
        <img
          src={invite.photo_1_url}
          alt="Couple"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${colors.primary}66 0%, transparent 55%),
              linear-gradient(160deg, ${colors.accent} 0%, #0B0F19 60%)`,
          }}
        />
      )}

      {/* Gradient darkening — top fade + heavy bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      {/* Names block — bottom anchored */}
      <div className="absolute bottom-28 inset-x-0 flex flex-col items-center text-center px-8 z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] tracking-[0.4em] uppercase mb-5"
          style={{ color: colors.primary }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.6rem, 10vw, 3.8rem)", lineHeight: 1 }}
          className="font-bold text-white"
        >
          {invite.bride_name}
        </motion.h1>

        <motion.span
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="block my-3 italic font-normal"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 6vw, 2.2rem)", color: colors.primary }}
        >
          &amp;
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.6rem, 10vw, 3.8rem)", lineHeight: 1 }}
          className="font-bold text-white"
        >
          {invite.groom_name}
        </motion.h1>

        {/* Ornament divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 mb-4 flex items-center gap-3 w-full justify-center"
        >
          <div className="h-px flex-1 max-w-16" style={{ background: colors.primary, opacity: 0.5 }} />
          <Heart className="h-3 w-3 flex-shrink-0" style={{ color: colors.primary }} fill="currentColor" />
          <div className="h-px flex-1 max-w-16" style={{ background: colors.primary, opacity: 0.5 }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm italic leading-snug max-w-[220px]"
          style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.75)" }}
        >
          {tagline}
        </motion.p>
      </div>
    </div>
  );
}

// ── Slides 1–4: Template backgrounds + content ────────────────────────────────

interface SlideTemplateProps extends SharedProps {
  slideIndex: number;
  bgUrl: string | null;
}

function SlideTemplate({ slideIndex, bgUrl, invite, colors, formattedDate, formattedTime }: SlideTemplateProps) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  const gradientFallbacks = [
    `linear-gradient(160deg, ${darken(colors.primary)} 0%, #0B0F19 100%)`,
    `linear-gradient(145deg, ${colors.secondary} 0%, ${darken(colors.secondary)} 100%)`,
    `linear-gradient(160deg, ${colors.accent} 0%, #0B0F19 100%)`,
    `linear-gradient(145deg, ${colors.primary} 0%, ${darken(colors.primary)} 100%)`,
  ];
  const fallback = gradientFallbacks[slideIndex - 1] ?? gradientFallbacks[0];
  const useBg = bgUrl && !bgFailed;

  return (
    <div
      className="absolute inset-0"
      style={{ background: useBg && bgLoaded ? undefined : fallback }}
    >
      {useBg && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgFailed(true)}
        />
      )}
      {/* Dark overlay for readability */}
      {(useBg && bgLoaded) && (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.62) 100%)" }}
        />
      )}

      <div className="absolute inset-0 z-10">
        {slideIndex === 1 && <TemplateSlide1Content invite={invite} colors={colors} formattedDate={formattedDate} />}
        {slideIndex === 2 && <TemplateSlide2Content invite={invite} colors={colors} formattedDate={formattedDate} formattedTime={formattedTime} />}
        {slideIndex === 3 && <TemplateSlide3Content invite={invite} colors={colors} />}
        {slideIndex === 4 && <TemplateSlide4Content invite={invite} colors={colors} formattedDate={formattedDate} rsvp={invite.rsvp_info as RsvpInfo | null} />}
      </div>
    </div>
  );
}

// Slide 1 of 6 (template bg 1): "You're Invited" — event highlight
function TemplateSlide1Content({ invite, colors, formattedDate }: {
  invite: WeddingInvite; colors: CustomColors; formattedDate: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.5em] uppercase mb-6"
        style={{ color: colors.primary }}>
        You are cordially invited
      </motion.p>
      <motion.h2 {...up(0.1)}
        className="text-4xl font-bold text-white leading-tight mb-2"
        style={{ fontFamily: "Georgia, serif" }}>
        {invite.bride_name}
      </motion.h2>
      <motion.span {...up(0.18)}
        className="block italic text-2xl font-normal my-1"
        style={{ fontFamily: "Georgia, serif", color: colors.primary }}>
        &amp;
      </motion.span>
      <motion.h2 {...up(0.26)}
        className="text-4xl font-bold text-white leading-tight mb-8"
        style={{ fontFamily: "Georgia, serif" }}>
        {invite.groom_name}
      </motion.h2>

      <motion.div {...up(0.38)} className="space-y-1">
        <p className="text-lg font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>
          {formattedDate}
        </p>
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          Celebrate love with us
        </p>
      </motion.div>

      <motion.div {...up(0.5)} className="mt-10 flex items-center gap-3">
        <div className="h-px w-10" style={{ background: colors.primary, opacity: 0.5 }} />
        <Heart className="h-3.5 w-3.5" style={{ color: colors.primary }} fill="currentColor" />
        <div className="h-px w-10" style={{ background: colors.primary, opacity: 0.5 }} />
      </motion.div>
    </div>
  );
}

// Slide 2 of 6 (template bg 2): Venue & ceremony details
function TemplateSlide2Content({ invite, colors, formattedDate, formattedTime }: {
  invite: WeddingInvite; colors: CustomColors; formattedDate: string; formattedTime: string | null;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-7 text-center">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-3"
        style={{ color: colors.primary }}>
        The Celebration
      </motion.p>
      <motion.h2 {...up(0.1)}
        className="text-3xl font-bold text-white mb-8"
        style={{ fontFamily: "Georgia, serif" }}>
        Join Us
      </motion.h2>

      <div className="space-y-3 w-full max-w-[260px]">
        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date" value={formattedDate} primary={colors.primary} delay={0.15} />
        {formattedTime && (
          <DetailRow icon={<Clock className="h-4 w-4" />} label="Time" value={formattedTime} primary={colors.primary} delay={0.25} />
        )}
        {invite.venue_name && (
          <DetailRow icon={<MapPin className="h-4 w-4" />} label="Venue" value={invite.venue_name} primary={colors.primary} delay={0.35} />
        )}
        {invite.event_location && (
          <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={invite.event_location} primary={colors.primary} delay={0.45} />
        )}
      </div>
    </div>
  );
}

// Slide 3 of 6 (template bg 3): Couple story
function TemplateSlide3Content({ invite, colors }: {
  invite: WeddingInvite; colors: CustomColors;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-4"
        style={{ color: colors.primary }}>
        Our Story
      </motion.p>
      <motion.h2 {...up(0.1)}
        className="text-2xl font-bold text-white mb-6"
        style={{ fontFamily: "Georgia, serif" }}>
        {invite.bride_name} &amp; {invite.groom_name}
      </motion.h2>

      {invite.couple_story ? (
        <motion.p {...up(0.22)}
          className="text-base leading-relaxed italic max-w-xs text-white/85"
          style={{ fontFamily: "Georgia, serif" }}>
          &ldquo;{invite.couple_story}&rdquo;
        </motion.p>
      ) : (
        <motion.p {...up(0.22)}
          className="text-base leading-relaxed italic max-w-xs"
          style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.6)" }}>
          &ldquo;Where two paths crossed and became one beautiful journey.&rdquo;
        </motion.p>
      )}

      <motion.div {...up(0.38)} className="mt-8 flex items-center gap-3">
        <div className="h-px w-8" style={{ background: colors.primary, opacity: 0.5 }} />
        <Heart className="h-3 w-3" style={{ color: colors.primary }} fill="currentColor" />
        <div className="h-px w-8" style={{ background: colors.primary, opacity: 0.5 }} />
      </motion.div>
    </div>
  );
}

// Slide 4 of 6 (template bg 4): RSVP
function TemplateSlide4Content({ invite, colors, formattedDate, rsvp }: {
  invite: WeddingInvite; colors: CustomColors; formattedDate: string; rsvp: RsvpInfo | null;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-4"
        style={{ color: colors.primary }}>
        RSVP
      </motion.p>
      <motion.h2 {...up(0.1)}
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: "Georgia, serif" }}>
        We can&apos;t wait
      </motion.h2>
      <motion.p {...up(0.18)}
        className="text-base italic text-white/70 mb-8"
        style={{ fontFamily: "Georgia, serif" }}>
        to celebrate with you.
      </motion.p>

      <motion.div {...up(0.3)} className="space-y-1 text-sm text-white/75 mb-8">
        <p style={{ fontFamily: "Georgia, serif" }}>{formattedDate}</p>
        {invite.venue_name && <p className="font-semibold text-white">{invite.venue_name}</p>}
        {invite.event_location && <p className="text-white/60 text-xs">{invite.event_location}</p>}
      </motion.div>

      {(rsvp?.phone || rsvp?.email) && (
        <motion.div {...up(0.45)}
          className="rounded-2xl px-7 py-5 space-y-1.5 w-full max-w-[240px]"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", border: `1px solid ${colors.primary}33` }}>
          <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: colors.primary }}>
            Kindly respond
          </p>
          {rsvp.phone && (
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
              {rsvp.phone}
            </p>
          )}
          {rsvp.email && (
            <p className="text-xs text-white/60">{rsvp.email}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── Slide 5: Photo 2 full-bleed — closing ────────────────────────────────────

function Slide5Closing({ invite, colors }: SharedProps) {
  return (
    <div className="absolute inset-0">
      {invite.photo_2_url ? (
        <img
          src={invite.photo_2_url}
          alt="Couple"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${colors.primary} 0%, ${darken(colors.primary)} 100%)`,
          }}
        />
      )}

      {/* Top + bottom gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Top — names reminder */}
      <div className="absolute top-16 inset-x-0 text-center z-10 px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[9px] tracking-[0.45em] uppercase"
          style={{ color: colors.primary }}
        >
          {invite.bride_name} &amp; {invite.groom_name}
        </motion.p>
      </div>

      {/* Bottom — closing message + branding */}
      <div className="absolute bottom-24 inset-x-0 flex flex-col items-center text-center px-8 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <Heart className="h-8 w-8 text-white/80 mx-auto" fill="currentColor" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-bold text-white leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          See you there.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 text-base italic"
          style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.7)" }}
        >
          With love &amp; joy
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex items-center gap-1.5 text-white/30 text-[10px]"
        >
          <Camera className="h-3 w-3" />
          <span>2soulfilms · Sreeyam Behera</span>
        </motion.div>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function DetailRow({ icon, label, value, primary, delay = 0 }: {
  icon: React.ReactNode; label: string; value: string; primary: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 text-left p-3 rounded-xl"
      style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)" }}
    >
      <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: primary + "28" }}>
        <div style={{ color: primary }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: primary }}>
          {label}
        </p>
        <p className="text-sm font-medium leading-snug" style={{ color: "#ffffff", fontFamily: "Georgia, serif" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function ShareButton({ icon, label, onClick, color }: {
  icon: React.ReactNode; label: string; onClick: () => void; color: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
      <div className="rounded-full p-2.5" style={{ background: "rgba(255,255,255,0.12)", color }}>
        {icon}
      </div>
      <span className="text-[10px] text-white/45">{label}</span>
    </button>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChevronDown({ style }: { style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function darken(hex: string): string {
  const c = hex.replace("#", "");
  const r = Math.round(parseInt(c.slice(0, 2), 16) * 0.65);
  const g = Math.round(parseInt(c.slice(2, 4), 16) * 0.65);
  const b = Math.round(parseInt(c.slice(4, 6), 16) * 0.65);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
