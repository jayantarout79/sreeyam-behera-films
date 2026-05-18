"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Warm-toned photos that complement each other
const SIDE_PHOTOS = [
  { src: "/photos/bride-portrait.png",      alt: "Bride portrait",     pos: "center top" },
  { src: "/photos/couple-intimate.png",     alt: "Couple intimate",    pos: "center center" },
  { src: "/photos/couple-meera-rohan.png",  alt: "Couple golden hour", pos: "center top" },
];

const HERO_BG   = "/photos/couple-golden.png";
const VIDEO_SRC = "/videos/YTDown_YouTube_Nua-Nua-Prema-Motion-Poster-2-New-Romant_Media_zTx_rZ43yE0_001_1080p.mp4";

export default function HeroSection() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [playing,   setPlaying]   = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  }

  return (
    <section className="relative h-screen bg-[#080B12] flex overflow-hidden select-none">

      {/* ════════════════════════════════════════
          LEFT SIDEBAR — "TIMELESS STORIES" text
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-shrink-0 w-8 relative z-30">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-champagne/30 to-transparent" />
        <p
          className="text-[8px] font-semibold tracking-[0.55em] uppercase whitespace-nowrap text-white/20"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Timeless Stories
        </p>
      </div>

      {/* ════════════════════════════════════════
          PHOTO STRIP — 3 stacked, starts below navbar
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col flex-shrink-0 w-[19%] gap-[2px] relative z-20 pt-[58px]">
        {SIDE_PHOTOS.map(({ src, alt, pos }, i) => (
          <motion.div
            key={src}
            className="flex-1 relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              style={{ objectPosition: pos }}
              sizes="20vw"
              priority={i === 0}
            />
            {/* Right-side fade into dark center */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#080B12]" />
            {/* Subtle vignette on left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080B12]/60 to-transparent" />
          </motion.div>
        ))}
        {/* Bottom champagne accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-champagne/40 to-transparent" />
      </div>

      {/* ════════════════════════════════════════
          CENTER — HEADLINE + CTA
      ════════════════════════════════════════ */}
      <div className="relative flex-1 flex flex-col justify-center px-10 lg:px-14 xl:px-20 z-20 min-w-0">

        {/* Mobile full-bleed background */}
        <div className="absolute inset-0 lg:hidden">
          <Image src={HERO_BG} alt="Wedding" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080B12]/96 via-[#080B12]/80 to-[#080B12]/30" />
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-6 h-px bg-champagne/60" />
            <span className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne/80">
              2soulfilms &nbsp;·&nbsp; Bhubaneswar
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold text-white leading-[0.95] mb-8 tracking-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.8rem, 6.5vw, 7.5rem)",
            }}
          >
            We Make<br />
            Wedding<br />
            <span className="text-champagne italic">Stories</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/35 mb-12 leading-relaxed italic"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
            }}
          >
            Beyond The Destination,<br />
            You Can Always Memorize
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.84 }}
            className="flex items-center gap-5 flex-wrap"
          >
            {/* Watch a film */}
            <Link href="/films" className="group flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#CBB89E]/50 flex items-center justify-center bg-[#CBB89E]/5 group-hover:bg-[#CBB89E] group-hover:border-[#CBB89E] transition-all duration-300 flex-shrink-0">
                <Play
                  className="h-4 w-4 text-[#CBB89E] group-hover:text-[#0B0F19] transition-colors duration-300 ml-0.5"
                  style={{ fill: "currentColor" }}
                />
              </div>
              <span className="text-sm font-medium text-white/70 group-hover:text-champagne transition-colors duration-300">
                Watch a film
              </span>
            </Link>

            {/* Divider */}
            <div className="h-5 w-px bg-white/15" />

            {/* Book date */}
            <Link
              href="/contact"
              className="text-sm font-semibold px-6 py-3 border border-white/20 text-white/70 hover:border-champagne/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              style={{ borderRadius: "3px" }}
            >
              Book your date
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-10 lg:left-14 xl:left-20 hidden lg:flex items-center gap-2.5"
        >
          <div className="flex flex-col gap-1">
            <div
              className="w-[1px] h-8 bg-gradient-to-b from-champagne/60 to-transparent mx-auto"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
          </div>
          <span className="text-[8px] tracking-[0.5em] uppercase text-white/20">Scroll</span>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL — FULL HEIGHT VIDEO
      ════════════════════════════════════════ */}
      <div className="hidden lg:block flex-shrink-0 w-[38%] relative overflow-hidden">
        {/* Fallback photo while video loads */}
        <Image
          src={HERO_BG}
          alt="Wedding film"
          fill
          className="object-cover object-center"
          style={{ opacity: videoReady ? 0 : 1, transition: "opacity 1.2s ease" }}
          priority
        />

        {/* Video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 1.2s ease" }}
        />

        {/* Left-edge blend into dark center */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/25 to-transparent pointer-events-none" />
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080B12]/70 to-transparent pointer-events-none" />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080B12]/50 to-transparent pointer-events-none" />

        {/* Play/Pause — bottom-right corner, subtle */}
        <button
          onClick={togglePlay}
          className="absolute bottom-7 right-7 z-20 w-10 h-10 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-white/60 transition-all duration-200"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <div className="flex items-center gap-[3px]">
              <div className="w-[2.5px] h-4 bg-white rounded-full" />
              <div className="w-[2.5px] h-4 bg-white rounded-full" />
            </div>
          ) : (
            <Play className="h-4 w-4 text-white ml-0.5" style={{ fill: "currentColor" }} />
          )}
        </button>

        {/* "FILM PLAYING" label — bottom right */}
        <div className="absolute bottom-8 right-[52px] z-20 flex items-center gap-2 pointer-events-none">
          <span
            className="w-1.5 h-1.5 rounded-full bg-champagne flex-shrink-0"
            style={{ animation: playing ? "pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite" : "none", opacity: playing ? 1 : 0.3 }}
          />
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/25 font-medium">
            Film Playing
          </span>
        </div>

        {/* Decorative top-right champagne corner */}
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
          <div className="w-6 h-6 border-t border-r border-champagne/30" />
        </div>
        <div className="absolute bottom-14 left-0 z-20 pointer-events-none">
          <div className="w-px h-16 bg-gradient-to-b from-champagne/20 to-transparent" />
        </div>
      </div>

    </section>
  );
}
