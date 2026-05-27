"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingInvite, CustomColors, RsvpInfo } from "@/types/database";
import { Calendar, Clock, MapPin, Heart, Share2, Copy, Check } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────

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
const ENV_W = 280;
const FLAP_H = 90;
const BODY_H = 158;
const ENV_COLOR = "#F9F3E8";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const TS = "0 2px 14px rgba(0,0,0,0.88), 0 1px 4px rgba(0,0,0,0.55)";
const TS_SM = "0 1px 8px rgba(0,0,0,0.85)";

// Stable seeded pseudo-random (no hydration mismatch)
function sr(seed: number, max = 1, min = 0) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return min + ((x - Math.floor(x)) * (max - min));
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface InviteViewProps {
  invite: WeddingInvite;
  colors: CustomColors;
}

interface SharedProps {
  invite: WeddingInvite;
  colors: CustomColors;
  formattedDate: string;
  formattedTime: string | null;
  rsvp: RsvpInfo | null;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function InviteView({ invite, colors }: InviteViewProps) {
  const [opened, setOpened] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/invites/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: invite.unique_slug }),
    }).catch(() => {});
  }, [invite.unique_slug]);

  const bgFolder = invite.template_id ? (BG_FOLDERS[invite.template_id] ?? null) : null;

  function templateBgUrl(slideIndex: number): string | null {
    if (!bgFolder || slideIndex < 1 || slideIndex > 4) return null;
    return `/invite-backgrounds/${bgFolder}/${SLIDE_BG_FILES[slideIndex - 1]}.png`;
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const slide = Math.round(el.scrollTop / el.clientHeight);
    if (slide !== currentSlide) setCurrentSlide(slide);
  }

  function goTo(index: number) {
    scrollRef.current?.scrollTo({
      top: index * (scrollRef.current.clientHeight),
      behavior: "smooth",
    });
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

  const shared: SharedProps = { invite, colors, formattedDate, formattedTime, rsvp };

  return (
    <>
      {/* Global keyframes injected once */}
      <style>{`
        .invite-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .invite-scroll::-webkit-scrollbar { display: none; }

        @keyframes floatHeart {
          0%   { transform: translateY(0)    translateX(0px)              scale(0.6); opacity: 0;   }
          15%  { opacity: 0.75; }
          85%  { opacity: 0.3; }
          100% { transform: translateY(-420px) translateX(var(--hx, 0px)) scale(0.3); opacity: 0; }
        }
        @keyframes floatStar {
          0%   { transform: translateY(0) scale(0.5) rotate(0deg);   opacity: 0; }
          15%  { opacity: 0.85; }
          100% { transform: translateY(-380px) scale(0.2) rotate(180deg); opacity: 0; }
        }
        @keyframes floatPetal {
          0%   { transform: translateY(0)    rotate(0deg)   scale(0.7); opacity: 0; }
          20%  { opacity: 0.7; }
          100% { transform: translateY(-360px) rotate(120deg) scale(0.3); opacity: 0; }
        }
        @keyframes sealBreath {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0B0F19" }}>
        <div
          className="relative overflow-hidden"
          style={{
            width: "min(100vw, 430px)",
            height: "min(100svh, calc(min(100vw, 430px) * 16 / 9))",
            maxHeight: "100svh",
          }}
        >
          {/* ── Scrollable slide strip ─────────────────────────────── */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="invite-scroll absolute inset-0"
            style={{
              overflowY: opened ? "scroll" : "hidden",
              scrollSnapType: "y mandatory",
              scrollBehavior: "smooth",
            }}
          >
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <div
                key={i}
                style={{
                  height: "100%",
                  scrollSnapAlign: "start",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* Per-slide floating particles */}
                <FloatingParticles slideIndex={i} colors={colors} />

                {i === 0 && <Slide0Photo {...shared} />}
                {i >= 1 && i <= 4 && (
                  <SlideTemplate
                    slideIndex={i}
                    bgUrl={templateBgUrl(i)}
                    {...shared}
                  />
                )}
                {i === 5 && <Slide5Closing {...shared} />}
              </div>
            ))}
          </div>

          {/* ── Dot indicators ─────────────────────────────────────── */}
          {opened && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 pointer-events-auto">
              {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentSlide ? 7 : 4,
                    height: i === currentSlide ? 7 : 4,
                    background: i === currentSlide ? colors.primary : "rgba(255,255,255,0.3)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* ── Share bar ──────────────────────────────────────────── */}
          {opened && (
            <div
              className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-6 px-6"
              style={{
                paddingBottom: "max(16px, env(safe-area-inset-bottom))",
                paddingTop: 14,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
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
                color="rgba(255,255,255,0.5)"
              />
            </div>
          )}

          {/* ── Swipe hint (slide 0 only) ──────────────────────────── */}
          {opened && currentSlide === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
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

          {/* ── Entry / reveal screen ──────────────────────────────── */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                key="entry"
                className="absolute inset-0 z-30"
                exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
                transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
              >
                <EnvelopeEntry
                  invite={invite}
                  colors={colors}
                  onOpen={() => setOpened(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ── Envelope entry screen ─────────────────────────────────────────────────────

type EnvPhase = "idle" | "opening" | "cardOut";

function EnvelopeEntry({
  invite,
  colors,
  onOpen,
}: {
  invite: WeddingInvite;
  colors: CustomColors;
  onOpen: () => void;
}) {
  const [phase, setPhase] = useState<EnvPhase>("idle");

  async function handleTap() {
    if (phase !== "idle") return;
    setPhase("opening");
    await sleep(820);
    setPhase("cardOut");
    await sleep(1000);
    onOpen();
  }

  const initials = (invite.bride_name?.[0] ?? "") + (invite.groom_name?.[0] ?? "");
  const displayDate = new Date(invite.event_date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div
      className="absolute inset-0 flex flex-col items-center"
      style={{ background: "#0B0F19", cursor: phase === "idle" ? "pointer" : "default" }}
      onClick={phase === "idle" ? handleTap : undefined}
    >
      {/* Cinematic radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 44%, ${colors.primary}28 0%, ${colors.primary}0C 42%, transparent 70%)` }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
      />

      {/* Floating particles */}
      <FloatingParticles slideIndex={0} colors={colors} />

      {/* Top branding */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15 }}
        className="absolute top-7 inset-x-0 flex items-center justify-center gap-3 pointer-events-none z-10"
      >
        <div className="h-px w-10" style={{ background: `${colors.primary}40` }} />
        <p className="text-[7.5px] tracking-[0.65em] uppercase" style={{ color: `${colors.primary}75` }}>
          2soulfilms
        </p>
        <div className="h-px w-10" style={{ background: `${colors.primary}40` }} />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10 px-8 pt-14 pb-16">

        {/* Names — hero element */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] tracking-[0.55em] uppercase mb-4"
            style={{ color: colors.primary }}
          >
            Wedding Invitation
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-heading, Georgia, serif)",
              fontSize: "clamp(2rem, 8vw, 2.8rem)",
              lineHeight: 1.1,
              color: "#ffffff",
              fontWeight: 700,
              textShadow: "0 2px 24px rgba(0,0,0,0.65)",
            }}
          >
            {invite.bride_name}
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="block italic my-1"
            style={{
              fontFamily: "var(--font-heading, Georgia, serif)",
              fontSize: "clamp(1.4rem, 5.5vw, 2rem)",
              color: colors.primary,
            }}
          >
            &amp;
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-heading, Georgia, serif)",
              fontSize: "clamp(2rem, 8vw, 2.8rem)",
              lineHeight: 1.1,
              color: "#ffffff",
              fontWeight: 700,
              textShadow: "0 2px 24px rgba(0,0,0,0.65)",
            }}
          >
            {invite.groom_name}
          </motion.h1>
        </div>

        {/* Date with champagne dividers */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.65, delay: 0.78 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-10" style={{ background: `${colors.primary}50` }} />
          <p
            className="text-[10px] tracking-[0.28em]"
            style={{ fontFamily: "Georgia, serif", color: `${colors.primary}CC` }}
          >
            {displayDate}
          </p>
          <div className="h-px w-10" style={{ background: `${colors.primary}50` }} />
        </motion.div>

        {/* Envelope */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ width: ENV_W, height: FLAP_H + BODY_H }}
        >
          {/* Shimmer on open */}
          {phase !== "idle" && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: 0, bottom: 0, left: 0, width: "40%", zIndex: 30,
                background: "linear-gradient(108deg, transparent 10%, rgba(255,255,255,0.6) 50%, transparent 90%)",
                borderRadius: 4,
              }}
              initial={{ x: -ENV_W * 0.5 }}
              animate={{ x: ENV_W * 1.8 }}
              transition={{ duration: 0.58, delay: 0.1, ease: "easeOut" }}
            />
          )}

          {/* Flap */}
          <div style={{ perspective: 900, perspectiveOrigin: "center top", position: "absolute", top: 0, width: ENV_W, zIndex: 10 }}>
            <motion.div
              animate={{ rotateX: phase !== "idle" ? -175 : 0 }}
              transition={{ duration: 0.72, ease: [0.55, 0.05, 0.1, 0.92] }}
              style={{ transformOrigin: "top center" }}
            >
              <svg width={ENV_W} height={FLAP_H} viewBox={`0 0 ${ENV_W} ${FLAP_H}`} display="block">
                <defs>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ENV_COLOR} />
                    <stop offset="100%" stopColor="#EDE4D4" />
                  </linearGradient>
                </defs>
                <polygon points={`0,0 ${ENV_W},0 ${ENV_W / 2},${FLAP_H}`} fill="url(#flapGrad)" />
                <line x1="0" y1="0" x2={ENV_W / 2} y2={FLAP_H}
                  stroke={colors.primary} strokeWidth="0.8" strokeOpacity="0.22" />
                <line x1={ENV_W} y1="0" x2={ENV_W / 2} y2={FLAP_H}
                  stroke={colors.primary} strokeWidth="0.8" strokeOpacity="0.22" />
                <polyline points={`0,0 ${ENV_W},0 ${ENV_W / 2},${FLAP_H}`}
                  fill="none" stroke={colors.primary} strokeWidth="1.1" strokeOpacity="0.38" />
              </svg>

              {/* Wax seal */}
              <motion.div
                animate={phase !== "idle" ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.22, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 42, height: 42, borderRadius: "50%",
                  background: colors.primary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 0 2.5px ${ENV_COLOR}, 0 2px 10px rgba(0,0,0,0.3), 0 0 20px ${colors.primary}55`,
                  animation: "sealBreath 2.6s ease-in-out infinite",
                }}
              >
                <span style={{
                  fontFamily: "Georgia, serif", fontSize: 12,
                  fontWeight: 700, color: "#0B0F19", letterSpacing: "0.03em",
                }}>
                  {initials}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Envelope body */}
          <div
            style={{
              position: "absolute",
              top: FLAP_H,
              width: ENV_W, height: BODY_H,
              background: ENV_COLOR,
              border: `1.2px solid ${colors.primary}40`,
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              zIndex: 2,
              overflow: "hidden",
            }}
          >
            <svg width={ENV_W} height={BODY_H} style={{ position: "absolute", inset: 0 }}>
              <line x1="0" y1="0" x2={ENV_W / 2} y2={BODY_H * 0.5}
                stroke={colors.primary} strokeWidth="0.7" strokeOpacity="0.18" />
              <line x1={ENV_W} y1="0" x2={ENV_W / 2} y2={BODY_H * 0.5}
                stroke={colors.primary} strokeWidth="0.7" strokeOpacity="0.18" />
              <line x1="0" y1={BODY_H} x2={ENV_W / 2} y2={BODY_H * 0.5}
                stroke={colors.primary} strokeWidth="0.7" strokeOpacity="0.18" />
              <line x1={ENV_W} y1={BODY_H} x2={ENV_W / 2} y2={BODY_H * 0.5}
                stroke={colors.primary} strokeWidth="0.7" strokeOpacity="0.18" />
            </svg>
          </div>

          {/* Card rising from envelope — ornamental, no name duplication */}
          <motion.div
            animate={
              phase === "cardOut"
                ? { y: -(FLAP_H + BODY_H + 72), opacity: 1 }
                : { y: 0, opacity: 0 }
            }
            transition={
              phase === "cardOut"
                ? { y: { duration: 0.88, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.28 } }
                : { duration: 0 }
            }
            style={{
              position: "absolute",
              top: FLAP_H + 10,
              left: 12, right: 12,
              height: BODY_H - 18,
              background: "#FFFDF8",
              borderRadius: 4,
              border: `1px solid ${colors.primary}30`,
              zIndex: 5,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "12px 18px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
            }}
          >
            <Heart style={{ color: colors.primary, width: 18, height: 18, marginBottom: 10 }} fill="currentColor" />
            <div style={{ width: 30, height: 1, background: colors.primary, opacity: 0.4, marginBottom: 10 }} />
            <p style={{ fontSize: 7.5, letterSpacing: "0.32em", textTransform: "uppercase", color: colors.primary, marginBottom: 7 }}>
              You are invited
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 10, color: "#6B5441", letterSpacing: "0.04em" }}>
              {displayDate}
            </p>
            <div style={{ width: 30, height: 1, background: colors.primary, opacity: 0.4, marginTop: 10 }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Touch hint — absolute bottom with pulsing rings */}
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 0.8 }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2.5 z-10 pointer-events-none"
        >
          <div className="relative flex items-center justify-center mb-0.5">
            <motion.div
              animate={{ scale: [1, 1.75, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{ width: 48, height: 48, border: `1.5px solid ${colors.primary}` }}
            />
            <motion.div
              animate={{ scale: [1, 1.42, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut", delay: 0.38 }}
              className="absolute rounded-full"
              style={{ width: 34, height: 34, border: `1px solid ${colors.primary}` }}
            />
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 26, height: 26, background: `${colors.primary}1E`, border: `1.5px solid ${colors.primary}90` }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M9 11V6a2 2 0 1 1 4 0v5" stroke={colors.primary} strokeWidth="2.2" strokeLinecap="round" />
                <path d="M13 11V9a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2a2 2 0 1 1 4 0"
                  stroke={colors.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <motion.p
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2.3, repeat: Infinity }}
            className="text-[9px] tracking-[0.45em] uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Touch to open
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}

// ── Floating particles ─────────────────────────────────────────────────────────

const PARTICLE_ANIM = ["floatHeart", "floatHeart", "floatStar", "floatPetal", "floatHeart", "floatHeart"];
const PARTICLE_SIZE = [
  [8, 16], [8, 14], [6, 12], [9, 15], [8, 14], [10, 18],
];

function FloatingParticles({ slideIndex, colors }: { slideIndex: number; colors: CustomColors }) {
  const count = 7;
  const animName = PARTICLE_ANIM[slideIndex] ?? "floatHeart";
  const [sizeMin, sizeMax] = PARTICLE_SIZE[slideIndex] ?? [8, 16];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: count }, (_, i) => {
        const left    = sr(slideIndex * 200 + i * 31, 88, 6);
        const delay   = sr(slideIndex * 200 + i * 17, 5, 0);
        const dur     = sr(slideIndex * 200 + i * 23, 3, 3.5);
        const size    = sr(slideIndex * 200 + i * 37, sizeMax - sizeMin, sizeMin);
        const drift   = sr(slideIndex * 200 + i * 41, 60, -30);
        const opacity = sr(slideIndex * 200 + i * 13, 0.4, 0.55);

        const isHeart = animName === "floatHeart";
        const isStar  = animName === "floatStar";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: -24,
              "--hx": `${drift}px`,
              animationName: animName,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "ease-out",
              animationIterationCount: "infinite",
              animationFillMode: "both",
              opacity,
            } as React.CSSProperties}
          >
            {isHeart && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill={colors.primary}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
            {isStar && (
              <svg width={size} height={size} viewBox="0 0 24 24" fill={colors.primary}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            )}
            {!isHeart && !isStar && (
              // Petal — simple ellipse
              <svg width={size} height={size * 1.4} viewBox="0 0 14 20" fill={colors.primary} opacity="0.7">
                <ellipse cx="7" cy="10" rx="5" ry="9" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Slide 0: Photo 1 full-bleed — names + tagline ─────────────────────────────

function Slide0Photo({ invite, colors }: SharedProps) {
  const tagline = invite.couple_story && invite.couple_story.length <= 65
    ? invite.couple_story
    : "Two hearts. One beautiful beginning.";

  return (
    <div className="absolute inset-0">
      {invite.photo_1_url ? (
        <img src={invite.photo_1_url} alt="Couple" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${colors.primary}66 0%, transparent 55%),
              linear-gradient(160deg, ${colors.accent} 0%, #0B0F19 60%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {invite.photo_1_url && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${colors.primary}18 0%, ${colors.primary}3A 100%)` }}
        />
      )}
      <div className="absolute bottom-28 inset-x-0 flex flex-col items-center text-center px-8 z-10">
        <motion.p {...up(0)} className="text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: colors.primary }}>
          Together with their families
        </motion.p>
        <motion.h1
          {...up(0.1)}
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.6rem, 10vw, 3.8rem)", lineHeight: 1, textShadow: TS }}
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
          {...up(0.3)}
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.6rem, 10vw, 3.8rem)", lineHeight: 1, textShadow: TS }}
          className="font-bold text-white"
        >
          {invite.groom_name}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 mb-4 flex items-center gap-3 justify-center"
        >
          <div className="h-px w-16 max-w-16" style={{ background: colors.primary, opacity: 0.5 }} />
          <Heart className="h-3 w-3 flex-shrink-0" style={{ color: colors.primary }} fill="currentColor" />
          <div className="h-px w-16 max-w-16" style={{ background: colors.primary, opacity: 0.5 }} />
        </motion.div>
        <motion.p
          {...up(0.55)}
          className="text-sm italic leading-snug max-w-[220px]"
          style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.75)" }}
        >
          {tagline}
        </motion.p>
      </div>
    </div>
  );
}

// ── Slides 1–4: Template backgrounds ─────────────────────────────────────────

interface SlideTemplateProps extends SharedProps {
  slideIndex: number;
  bgUrl: string | null;
}

function SlideTemplate({ slideIndex, bgUrl, invite, colors, formattedDate, formattedTime, rsvp }: SlideTemplateProps) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  const fallbacks = [
    `linear-gradient(160deg, ${darken(colors.primary)} 0%, #0B0F19 100%)`,
    `linear-gradient(145deg, ${colors.secondary} 0%, ${darken(colors.secondary)} 100%)`,
    `linear-gradient(160deg, ${colors.accent} 0%, #0B0F19 100%)`,
    `linear-gradient(145deg, ${colors.primary} 0%, ${darken(colors.primary)} 100%)`,
  ];
  const useBg = bgUrl && !bgFailed;

  return (
    <div className="absolute inset-0" style={{ background: useBg && bgLoaded ? undefined : fallbacks[slideIndex - 1] }}>
      {useBg && (
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgFailed(true)}
        />
      )}
      {useBg && bgLoaded && (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)" }}
        />
      )}
      <div className="absolute inset-0 z-10">
        {slideIndex === 1 && <TSlide1 invite={invite} colors={colors} formattedDate={formattedDate} />}
        {slideIndex === 2 && <TSlide2 invite={invite} colors={colors} formattedDate={formattedDate} formattedTime={formattedTime} />}
        {slideIndex === 3 && <TSlide3 invite={invite} colors={colors} />}
        {slideIndex === 4 && <TSlide4 invite={invite} colors={colors} formattedDate={formattedDate} rsvp={rsvp} />}
      </div>
    </div>
  );
}

function TSlide1({ invite, colors, formattedDate }: { invite: WeddingInvite; colors: CustomColors; formattedDate: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.5em] uppercase mb-6" style={{ color: colors.primary }}>
        You are cordially invited
      </motion.p>
      <motion.h2 {...up(0.1)} className="text-4xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>
        {invite.bride_name}
      </motion.h2>
      <motion.span {...up(0.18)} className="block italic text-2xl font-normal my-1" style={{ fontFamily: "Georgia, serif", color: colors.primary, textShadow: TS_SM }}>
        &amp;
      </motion.span>
      <motion.h2 {...up(0.26)} className="text-4xl font-bold text-white leading-tight mb-8" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>
        {invite.groom_name}
      </motion.h2>
      <motion.div {...up(0.38)} className="space-y-1">
        <p className="text-lg font-semibold text-white" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>{formattedDate}</p>
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Celebrate love with us</p>
      </motion.div>
      <motion.div {...up(0.5)} className="mt-10 flex items-center gap-3">
        <div className="h-px w-10" style={{ background: colors.primary, opacity: 0.5 }} />
        <Heart className="h-3.5 w-3.5" style={{ color: colors.primary }} fill="currentColor" />
        <div className="h-px w-10" style={{ background: colors.primary, opacity: 0.5 }} />
      </motion.div>
    </div>
  );
}

function TSlide2({ invite, colors, formattedDate, formattedTime }: { invite: WeddingInvite; colors: CustomColors; formattedDate: string; formattedTime: string | null }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-7 text-center">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-3" style={{ color: colors.primary }}>The Celebration</motion.p>
      <motion.h2 {...up(0.1)} className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>Join Us</motion.h2>
      <div className="space-y-3 w-full max-w-[260px]">
        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date" value={formattedDate} primary={colors.primary} delay={0.15} />
        {formattedTime && <DetailRow icon={<Clock className="h-4 w-4" />} label="Time" value={formattedTime} primary={colors.primary} delay={0.25} />}
        {invite.venue_name && <DetailRow icon={<MapPin className="h-4 w-4" />} label="Venue" value={invite.venue_name} primary={colors.primary} delay={0.35} />}
        {invite.event_location && <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={invite.event_location} primary={colors.primary} delay={0.45} />}
      </div>
    </div>
  );
}

function TSlide3({ invite, colors }: { invite: WeddingInvite; colors: CustomColors }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-4" style={{ color: colors.primary }}>Our Story</motion.p>
      <motion.h2 {...up(0.1)} className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>
        {invite.bride_name} &amp; {invite.groom_name}
      </motion.h2>
      <motion.p {...up(0.22)} className="text-base leading-relaxed italic max-w-xs text-white/85" style={{ fontFamily: "Georgia, serif", textShadow: TS_SM }}>
        &ldquo;{invite.couple_story || "Where two paths crossed and became one beautiful journey."}&rdquo;
      </motion.p>
      <motion.div {...up(0.38)} className="mt-8 flex items-center gap-3">
        <div className="h-px w-8" style={{ background: colors.primary, opacity: 0.5 }} />
        <Heart className="h-3 w-3" style={{ color: colors.primary }} fill="currentColor" />
        <div className="h-px w-8" style={{ background: colors.primary, opacity: 0.5 }} />
      </motion.div>
    </div>
  );
}

function TSlide4({ invite, colors, formattedDate, rsvp }: { invite: WeddingInvite; colors: CustomColors; formattedDate: string; rsvp: RsvpInfo | null }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase mb-4" style={{ color: colors.primary }}>RSVP</motion.p>
      <motion.h2 {...up(0.1)} className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>We can&apos;t wait</motion.h2>
      <motion.p {...up(0.18)} className="text-base italic text-white/70 mb-8" style={{ fontFamily: "Georgia, serif", textShadow: TS_SM }}>to celebrate with you.</motion.p>
      <motion.div {...up(0.3)} className="space-y-1 text-sm text-white/75 mb-8">
        <p style={{ fontFamily: "Georgia, serif" }}>{formattedDate}</p>
        {invite.venue_name && <p className="font-semibold text-white">{invite.venue_name}</p>}
        {invite.event_location && <p className="text-white/60 text-xs">{invite.event_location}</p>}
      </motion.div>
      {(rsvp?.phone || rsvp?.email) && (
        <motion.div {...up(0.45)}
          className="rounded-2xl px-7 py-5 space-y-1.5 w-full max-w-[240px]"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", border: `1px solid ${colors.primary}33` }}>
          <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: colors.primary }}>Kindly respond</p>
          {rsvp.phone && <p className="text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{rsvp.phone}</p>}
          {rsvp.email && <p className="text-xs text-white/60">{rsvp.email}</p>}
        </motion.div>
      )}
    </div>
  );
}

// ── Slide 5: Photo 2 closing ───────────────────────────────────────────────────

function Slide5Closing({ invite, colors }: SharedProps) {
  return (
    <div className="absolute inset-0">
      {invite.photo_2_url ? (
        <img src={invite.photo_2_url} alt="Couple" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${colors.primary} 0%, ${darken(colors.primary)} 100%)` }} />
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.04) 55%, rgba(0,0,0,0.9) 100%)" }}
      />
      {invite.photo_2_url && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${colors.primary}18 0%, ${colors.primary}3A 100%)` }}
        />
      )}
      <div className="absolute top-14 inset-x-0 text-center z-10 px-6">
        <motion.p {...up(0)} className="text-[9px] tracking-[0.45em] uppercase" style={{ color: colors.primary }}>
          {invite.bride_name} &amp; {invite.groom_name}
        </motion.p>
      </div>
      <div className="absolute bottom-24 inset-x-0 flex flex-col items-center text-center px-8 z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-5">
          <Heart className="h-8 w-8 text-white/80 mx-auto" fill="currentColor" />
        </motion.div>
        <motion.h2 {...up(0.1)} className="text-3xl font-bold text-white leading-tight" style={{ fontFamily: "Georgia, serif", textShadow: TS }}>
          See you there.
        </motion.h2>
        <motion.p {...up(0.22)} className="mt-2 text-base italic" style={{ fontFamily: "Georgia, serif", color: "rgba(255,255,255,0.7)", textShadow: TS_SM }}>
          With love &amp; joy
        </motion.p>
        <motion.div {...up(0.45)} className="mt-8">
          <a
            href="https://www.2soulfilms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-widest"
            style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
          >
            www.2soulfilms.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

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
        <p className="text-[9px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: primary }}>{label}</p>
        <p className="text-sm font-medium leading-snug" style={{ color: "#ffffff", fontFamily: "Georgia, serif" }}>{value}</p>
      </div>
    </motion.div>
  );
}

function ShareButton({ icon, label, onClick, color }: {
  icon: React.ReactNode; label: string; onClick: () => void; color: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
      <div className="rounded-full p-2.5" style={{ background: "rgba(255,255,255,0.12)", color }}>{icon}</div>
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
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function darken(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const r = Math.round(parseInt(c.slice(0, 2), 16) * 0.65);
  const g = Math.round(parseInt(c.slice(2, 4), 16) * 0.65);
  const b = Math.round(parseInt(c.slice(4, 6), 16) * 0.65);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
