"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, MapPin, Clock, Tag } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function FeaturedFilm() {
  return (
    <section className="relative py-24 px-6 bg-[#0B0F19] overflow-hidden">
      {/* Ghost "2S" watermark */}
      <div
        className="pointer-events-none absolute right-0 top-0 select-none leading-none font-bold text-white/[0.03]"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(12rem, 18vw, 20rem)",
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        2S
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold tracking-[0.42em] uppercase text-champagne mb-4">
            Featured Film
          </p>
          {/* Champagne divider with star */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-champagne/40" />
            <span className="text-champagne text-xs">✦</span>
            <div className="h-px w-10 bg-champagne/40" />
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A story we love telling
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Thumbnail with real photo */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-video cursor-pointer border border-champagne/20">
              <Image
                src="/photos/couple-golden.png"
                alt="Priya & Arjun wedding film"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {/* Cinematic dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19]/60 via-transparent to-[#0B0F19]/40" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-champagne/80 bg-[#0B0F19]/60 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 text-champagne fill-champagne ml-1" />
                </div>
              </div>

              {/* Location tag */}
              <div className="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 bg-[#0B0F19]/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                <MapPin className="h-3 w-3 text-champagne" />
                <span className="text-white text-xs">Bhubaneswar, Odisha</span>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3
                className="text-4xl sm:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Priya &amp; Arjun
              </h3>
              <div className="flex items-center gap-5 text-xs text-white/40 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-champagne" />
                  8 min
                </span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-champagne" />
                  Romantic · Cinematic
                </span>
              </div>
            </div>

            {/* Champagne divider */}
            <div className="h-px w-10 bg-champagne/40" />

            <div className="flex flex-wrap gap-2">
              {["Wedding Film", "Traditional", "Documentary"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded text-[10px] font-semibold tracking-[0.2em] uppercase border border-white/20 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-white/55 leading-relaxed text-base">
              Their love story began in the narrow lanes of old Bhubaneswar — two souls who found each other across temples and traditions. On a golden December morning, we followed Priya and Arjun through every ritual, every glance, every quiet moment that no staged shot could ever recreate.
            </p>

            <p
              className="text-champagne/70 text-base italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              &ldquo;&ldquo; What you feel watching this is what we felt filming it.&rdquo;
            </p>

            <Link
              href="/films"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-lg border border-[#CBB89E]/40 text-white text-sm font-semibold hover:bg-[#CBB89E] hover:text-[#0B0F19] hover:border-[#CBB89E] transition-all duration-300"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch full film
            </Link>
          </motion.div>
        </div>

        {/* Bottom champagne divider */}
        <div className="flex items-center justify-center gap-3 mt-16">
          <div className="h-px w-16 bg-champagne/20" />
          <span className="text-champagne/40 text-xs">✦</span>
          <div className="h-px w-16 bg-champagne/20" />
        </div>
      </div>
    </section>
  );
}
