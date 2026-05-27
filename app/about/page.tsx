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

// City pins over the coverage map — positions as % of the container
const MAP_PINS = [
  { name: "Bhubaneswar", top: "57%", left: "63%", main: true,  delay: 0    },
  { name: "Delhi",       top: "28%", left: "42%", main: false, delay: 0.4  },
  { name: "Mumbai",      top: "55%", left: "24%", main: false, delay: 0.8  },
  { name: "Kolkata",     top: "46%", left: "70%", main: false, delay: 1.2  },
  { name: "Bengaluru",   top: "72%", left: "40%", main: false, delay: 1.6  },
  { name: "Chennai",     top: "74%", left: "52%", main: false, delay: 2.0  },
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
              className="hidden lg:flex h-[420px] gap-3"
            >
              {/* Large main image */}
              <div className="relative flex-[3] rounded-2xl overflow-hidden border border-[#E2D9CE]">
                <Image
                  src="/photos/whoweare1.png"
                  alt="Wedding couple"
                  fill
                  className="object-cover object-center"
                  sizes="30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/20 to-transparent" />
              </div>
              {/* 3 stacked images on the right */}
              <div className="flex-[2] flex flex-col gap-3">
                <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#E2D9CE]">
                  <Image src="/photos/whoweare2.png" alt="Wedding moment" fill className="object-cover object-center" sizes="20vw" />
                </div>
                <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#E2D9CE]">
                  <Image src="/photos/whoweare3.png" alt="Wedding moment" fill className="object-cover object-center" sizes="20vw" />
                </div>
                <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#E2D9CE]">
                  <Image src="/photos/whoweare4.png" alt="Wedding moment" fill className="object-cover object-center" sizes="20vw" />
                </div>
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
              {/* Coverage map with animated city pins */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-72 h-[360px] bg-[#F8F4EE]">
                  <Image
                    src="/photos/coveragemap.png"
                    alt="India coverage map"
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="288px"
                  />
                  {MAP_PINS.map(({ name, top, left, main, delay }) => (
                    <div
                      key={name}
                      className="absolute"
                      style={{ top, left, transform: "translate(-50%, -50%)" }}
                    >
                      {/* Outer pulse ring */}
                      <motion.div
                        className="absolute rounded-full border border-champagne/50"
                        style={{
                          width: main ? 36 : 24,
                          height: main ? 36 : 24,
                          top: "50%", left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
                      />
                      {/* Inner pulse ring (offset timing) */}
                      <motion.div
                        className="absolute rounded-full border border-champagne/30"
                        style={{
                          width: main ? 24 : 16,
                          height: main ? 24 : 16,
                          top: "50%", left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, delay: delay + 0.5, repeat: Infinity, ease: "easeOut" }}
                      />
                      {/* Dot */}
                      <div
                        className={`rounded-full ${main ? "w-3 h-3 bg-champagne shadow-[0_0_8px_2px_rgba(203,184,158,0.6)]" : "w-2 h-2 bg-champagne/80"}`}
                      />
                      {/* Label for main city only */}
                      {main && (
                        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.3em] uppercase text-champagne whitespace-nowrap font-semibold">
                          Bhubaneswar
                        </span>
                      )}
                    </div>
                  ))}
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
