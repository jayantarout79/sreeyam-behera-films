"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Calendar, Heart, Film } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const badges = [
  { icon: Calendar, label: "Limited Dates",      sub: "Book Early" },
  { icon: Heart,    label: "Personal Approach",  sub: "Not Just A Film" },
  { icon: Film,     label: "Timeless Memories",  sub: "That Last Forever" },
];

export default function FinalCTA() {
  return (
    <section className="relative bg-[#080B12] py-20 px-6 overflow-hidden">
      {/* Warm radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 70% at 65% 50%, rgba(203,184,158,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT: Text ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Headline */}
            <h2
              className="font-bold text-white leading-[1.0]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 6vw, 6rem)",
              }}
            >
              Ready to tell<br />
              your{" "}
              <span className="text-champagne italic">love story?</span>
            </h2>

            {/* Body */}
            <p className="text-white/45 text-lg leading-relaxed max-w-md">
              Dates fill quickly — reach out early to check availability for your wedding day.
              We&apos;d love to hear your story.
            </p>

            {/* Single CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-white/25 text-white font-bold text-sm uppercase tracking-[0.18em] hover:bg-white/8 hover:border-white/50 transition-all duration-300 min-h-[56px]"
            >
              Get In Touch
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-8 pt-2">
              {badges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-white/25 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-white/35">{label}</p>
                    <p className="text-[9px] tracking-[0.22em] uppercase text-white/20">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Photo collage ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative hidden lg:block h-[540px]"
          >
            {/* Main tall photo — left ~55% */}
            <div className="absolute left-0 top-0 bottom-0 w-[56%] rounded-2xl overflow-hidden border border-white/[0.1]">
              <Image
                src="/photos/couple-lake.png"
                alt="Couple at the lake"
                fill
                className="object-cover object-center"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/30 to-transparent" />
            </div>

            {/* Top-right photo */}
            <div className="absolute right-0 top-0 h-[49%] left-[59%] rounded-2xl overflow-hidden border border-white/[0.1]">
              <Image
                src="/photos/bride-portrait.png"
                alt="Bride portrait"
                fill
                className="object-cover object-top"
                sizes="18vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/20 to-transparent" />
            </div>

            {/* Bottom-right photo */}
            <div className="absolute right-0 bottom-0 h-[49%] left-[59%] rounded-2xl overflow-hidden border border-white/[0.1]">
              <Image
                src="/photos/couple-portrait.png"
                alt="Couple portrait"
                fill
                className="object-cover object-top"
                sizes="18vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/20 to-transparent" />
            </div>

            {/* "STORIES WORTH REMEMBERING" badge — in the gap between photos */}
            <div
              className="absolute z-20"
              style={{ left: "53%", top: "48%", transform: "translate(-50%, -50%)" }}
            >
              <div className="relative w-[84px] h-[84px]">
                <div className="absolute inset-0 rounded-full bg-[#080B12] border border-champagne/50 flex items-center justify-center shadow-lg">
                  <span className="text-champagne text-lg">✦</span>
                </div>
                <svg
                  viewBox="0 0 84 84"
                  className="absolute inset-0 w-full h-full"
                  style={{ animation: "spin 20s linear infinite" }}
                  aria-hidden="true"
                >
                  <defs>
                    <path id="badge-path" d="M42,42 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0" />
                  </defs>
                  <text
                    fill="#CBB89E"
                    fontSize="7"
                    fontWeight="600"
                    letterSpacing="3"
                    style={{ textTransform: "uppercase" }}
                  >
                    <textPath href="#badge-path">
                      STORIES WORTH · REMEMBERING ·
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* Decorative arc */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 540"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 80 20 Q 310 170 350 490"
                stroke="rgba(203,184,158,0.12)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
