"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Camera, Clock, MapPin, ArrowRight, Heart, Star, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const values = [
  {
    icon: Eye,
    title: "Documentary Storytelling",
    description:
      "We observe, we don't orchestrate. Authentic moments — not staged poses — are what make your film worth rewatching 20 years later.",
  },
  {
    icon: Camera,
    title: "Cinematic Quality",
    description:
      "Professional color grading, cinema-grade sound, and careful editing that treats your wedding like the film it deserves to be.",
  },
  {
    icon: Clock,
    title: "Timeless Memories",
    description:
      "We frame every shot with the question: will this still feel real in a decade? If yes, we keep it. If it's just pretty, we reconsider.",
  },
];

const stats = [
  { icon: Heart, value: "100+", label: "Happy Couples" },
  { icon: MapPin, value: "20+", label: "Cities Covered" },
  { icon: Calendar, value: "7+", label: "Years of Experience" },
  { icon: Star, value: "4.9/5", label: "Client Rating" },
];

// Subtle botanical/floral SVG watermark for each card
function FloralWatermark() {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-4 right-4 w-16 h-20 opacity-[0.07] pointer-events-none"
      aria-hidden="true"
    >
      <path d="M40 90 C40 90 20 70 20 50 C20 30 35 20 40 10 C45 20 60 30 60 50 C60 70 40 90 40 90Z" stroke="#CBB89E" strokeWidth="1" fill="none" />
      <path d="M40 60 C30 55 20 45 25 35" stroke="#CBB89E" strokeWidth="0.8" fill="none" />
      <path d="M40 60 C50 55 60 45 55 35" stroke="#CBB89E" strokeWidth="0.8" fill="none" />
      <path d="M40 75 C32 68 22 58 28 48" stroke="#CBB89E" strokeWidth="0.8" fill="none" />
      <path d="M40 75 C48 68 58 58 52 48" stroke="#CBB89E" strokeWidth="0.8" fill="none" />
      <circle cx="40" cy="10" r="2" fill="#CBB89E" />
      <circle cx="25" cy="35" r="1.5" fill="#CBB89E" />
      <circle cx="55" cy="35" r="1.5" fill="#CBB89E" />
      <circle cx="28" cy="48" r="1.5" fill="#CBB89E" />
      <circle cx="52" cy="48" r="1.5" fill="#CBB89E" />
    </svg>
  );
}

// India map SVG with location pins
function IndiaMap() {
  return (
    <svg
      viewBox="0 0 340 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* India outline — simplified but recognizable */}
      <path
        d="M170 18
           L188 22 L205 28 L220 36 L234 46 L242 58 L248 70
           L258 78 L268 82 L275 90 L272 102 L278 112 L282 124
           L280 136 L276 148 L268 158 L272 170 L270 182
           L262 194 L252 204 L258 216 L256 228 L248 240
           L238 252 L228 264 L218 276 L210 288 L204 302
           L198 316 L192 330 L186 344 L180 358 L174 370
           L170 380
           L166 370 L160 358 L154 344 L148 330 L142 316
           L136 302 L130 288 L122 276 L112 264 L102 252
           L92 240 L84 228 L82 216 L88 204 L78 194
           L70 182 L68 170 L72 158 L64 148 L60 136
           L58 124 L62 112 L68 102 L65 90 L72 82
           L82 78 L92 70 L98 58 L112 46 L126 36
           L141 28 L158 22 Z"
        stroke="#CBB89E"
        strokeWidth="1.2"
        fill="rgba(203,184,158,0.06)"
        strokeLinejoin="round"
      />
      {/* North-east bump */}
      <path
        d="M258 78 L272 65 L285 60 L295 68 L290 80 L278 82 L272 90"
        stroke="#CBB89E"
        strokeWidth="1.2"
        fill="rgba(203,184,158,0.04)"
        strokeLinejoin="round"
      />
      {/* Punjab/Kashmir area */}
      <path
        d="M170 18 L188 10 L198 18 L205 28"
        stroke="#CBB89E"
        strokeWidth="1"
        fill="none"
      />

      {/* Location pin — Bhubaneswar (main, larger) */}
      <g transform="translate(218,222)">
        <circle cx="0" cy="0" r="5" fill="#CBB89E" />
        <circle cx="0" cy="0" r="8" stroke="#CBB89E" strokeWidth="1" fill="none" opacity="0.4" />
      </g>

      {/* Delhi */}
      <g transform="translate(158,115)">
        <circle cx="0" cy="0" r="3.5" fill="#CBB89E" opacity="0.65" />
        <circle cx="0" cy="0" r="6" stroke="#CBB89E" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>

      {/* Mumbai */}
      <g transform="translate(110,210)">
        <circle cx="0" cy="0" r="3.5" fill="#CBB89E" opacity="0.65" />
        <circle cx="0" cy="0" r="6" stroke="#CBB89E" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>

      {/* Bengaluru */}
      <g transform="translate(162,285)">
        <circle cx="0" cy="0" r="3.5" fill="#CBB89E" opacity="0.65" />
        <circle cx="0" cy="0" r="6" stroke="#CBB89E" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>

      {/* Kolkata */}
      <g transform="translate(238,178)">
        <circle cx="0" cy="0" r="3.5" fill="#CBB89E" opacity="0.65" />
        <circle cx="0" cy="0" r="6" stroke="#CBB89E" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>

      {/* Chennai */}
      <g transform="translate(200,298)">
        <circle cx="0" cy="0" r="3.5" fill="#CBB89E" opacity="0.65" />
        <circle cx="0" cy="0" r="6" stroke="#CBB89E" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />
      <main className="pt-[58px]">

        {/* ══════════════════════════════════════════
            HERO — ivory, left text, right photo collage
        ══════════════════════════════════════════ */}
        <section className="bg-[#F8F4EE] py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] font-semibold tracking-[0.42em] uppercase text-champagne mb-5">
                About 2soulfilms
              </p>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0B0F19] leading-tight mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Who We Are
              </h1>
              <div className="h-px w-12 bg-[#CBB89E] mb-7" />
              <p className="text-[#6B6560] text-lg leading-relaxed max-w-lg">
                2soulfilms is a wedding film studio founded by Sreeyam Behera — a filmmaker who believes
                every wedding has a story that deserves to be told with honesty, beauty, and heart.
              </p>
            </motion.div>

            {/* Right — photo collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative hidden lg:block h-[420px]"
            >
              <div className="absolute left-0 top-0 w-[58%] h-full rounded-2xl overflow-hidden border border-[#E2D9CE]">
                <Image
                  src="/photos/couple-golden.png"
                  alt="Wedding couple"
                  fill
                  className="object-cover object-center"
                  sizes="30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/20 to-transparent" />
              </div>
              <div className="absolute right-0 top-0 w-[40%] h-[48%] rounded-2xl overflow-hidden border border-[#E2D9CE]">
                <Image
                  src="/photos/wedding-ceremony.png"
                  alt="Wedding ceremony"
                  fill
                  className="object-cover object-top"
                  sizes="20vw"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[40%] h-[48%] rounded-2xl overflow-hidden border border-[#E2D9CE]">
                <Image
                  src="/photos/couple-meera-rohan.png"
                  alt="Couple portrait"
                  fill
                  className="object-cover object-top"
                  sizes="20vw"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            OUR STORY — dark section, 2 columns
        ══════════════════════════════════════════ */}
        <section className="bg-[#0F1218] py-20 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(203,184,158,0.06) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p className="text-[10px] font-semibold tracking-[0.42em] uppercase text-champagne">
                  Our Story
                </p>
                <div className="h-px w-8 bg-[#CBB89E]/40" />
              </div>
              <blockquote
                className="text-2xl sm:text-3xl text-white/80 italic leading-relaxed"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                &ldquo;To love or have loved, that is enough. There is no other pearl to be found
                in those souls or in the dark fold of life. A soul gives abundance of memories
                like mist suspended in the grass of a winter morning.&rdquo;
              </blockquote>
              <div className="h-px w-10 bg-[#CBB89E]/50 mt-8" />
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }} className="space-y-5">
              {[
                "2soulfilms started with a simple belief: every wedding has a story worth telling, and most of those stories were being told wrong. Too polished, too posed, too rehearsed — beautiful to look at, but hollow to feel.",
                "Sreeyam Behera started filming weddings the way great journalists cover stories — by disappearing into the room, building trust, and waiting for the moments that reveal who people really are. A grandmother wiping a tear during the pheras. The groom's hands trembling as he ties the mangalsutra. Two families who've never met, laughing together by the end of the evening.",
                "These are the moments 2soulfilms lives for. And we've spent years perfecting the art of catching them without disturbing them.",
              ].map((para, i) => (
                <p key={i} className="text-white/50 leading-relaxed text-sm">
                  {para}
                </p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            OUR PHILOSOPHY — 3 cards with round icons + floral watermark
        ══════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-[#F8F4EE]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7 }}
              className="text-center mb-14"
            >
              <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-[#CBB89E] mb-4">
                How We Work
              </p>
              <h2
                className="text-5xl sm:text-6xl font-bold text-[#0B0F19]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Philosophy
              </h2>
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="h-px w-10 bg-[#CBB89E]/50" />
                <span style={{ color: "#CBB89E", fontSize: "0.6rem" }}>✦</span>
                <div className="h-px w-10 bg-[#CBB89E]/50" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative bg-white rounded-2xl p-8 border border-[#E8E0D6] hover:border-[#CBB89E]/40 transition-colors duration-300 overflow-hidden"
                >
                  {/* Round dark circle icon — matches reference */}
                  <div className="w-14 h-14 rounded-full bg-[#0B0F19] flex items-center justify-center mb-6 flex-shrink-0">
                    <Icon className="h-5 w-5" style={{ color: "#CBB89E" }} />
                  </div>

                  <h3
                    className="text-xl font-bold text-[#0B0F19] mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>

                  {/* Short champagne underline */}
                  <div className="h-[2px] w-8 bg-[#CBB89E] mb-4 rounded-full" />

                  <p className="text-[#7A746E] text-sm leading-relaxed relative z-10">
                    {description}
                  </p>

                  {/* Floral watermark — bottom right */}
                  <FloralWatermark />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SERVICE AREA — map + text + stats
        ══════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-[#F8F4EE]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
            >
              {/* India map */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-72 h-[360px]">
                  <IndiaMap />
                </div>
              </div>

              {/* Text */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <MapPin className="h-4 w-4" style={{ color: "#CBB89E" }} />
                  <p className="text-[10px] font-semibold tracking-[0.42em] uppercase" style={{ color: "#CBB89E" }}>
                    Service Area
                  </p>
                </div>
                <h2
                  className="text-4xl sm:text-5xl font-bold text-[#0B0F19] mb-5 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Serving couples<br />across India
                </h2>
                <div className="h-[2px] w-10 bg-[#CBB89E] mx-auto lg:mx-0 mb-6 rounded-full" />
                <p className="text-[#7A746E] mb-3 leading-relaxed">
                  Based in Rashulgarh, Bhubaneswar · Available pan-India
                  and for destination weddings
                </p>
                <p className="text-[#7A746E]/60 text-sm">
                  Odisha &nbsp;·&nbsp; Delhi &nbsp;·&nbsp; Mumbai &nbsp;·&nbsp; Bengaluru &nbsp;·&nbsp; Kolkata &nbsp;·&nbsp; Chennai
                  <br />Anywhere you say &ldquo;I do&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-[#E2D9CE]"
            >
              {stats.map(({ icon: Icon, value, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 py-8 px-6 ${i < stats.length - 1 ? "border-b md:border-b-0 md:border-r border-[#E2D9CE]" : ""}`}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" style={{ color: "#CBB89E", fill: "none", strokeWidth: 1.5 }} />
                  <div>
                    <p
                      className="text-2xl font-bold text-[#0B0F19] leading-none"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {value}
                    </p>
                    <p className="text-xs text-[#7A746E] mt-1 tracking-wide">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA — dark
        ══════════════════════════════════════════ */}
        <section className="relative py-20 px-6 bg-[#0B0F19] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(203,184,158,0.06) 0%, transparent 70%)" }}
          />
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-2xl mx-auto text-center"
          >
            <h2
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to work together?
            </h2>
            <p className="text-white/40 mb-8 text-lg">
              We&apos;d love to hear about your story and your plans.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-[#CBB89E]/50 text-white font-semibold text-sm hover:bg-[#CBB89E] hover:text-[#0B0F19] hover:border-[#CBB89E] transition-all duration-300"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
