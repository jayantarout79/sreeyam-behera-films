"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function AboutTeaser() {
  return (
    <section className="relative py-20 px-6 bg-[#080B12] overflow-hidden">

      {/* Ghost "2S" watermark — behind the card */}
      <div
        className="pointer-events-none absolute left-[-2rem] top-[-1rem] select-none leading-none font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(16rem, 25vw, 28rem)",
          lineHeight: 1,
          color: "rgba(255,255,255,0.025)",
        }}
        aria-hidden="true"
      >
        2S
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: Sreeyam Behera portrait card ── */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.85 }}
          className="order-2 lg:order-1"
        >
          <div className="relative max-w-[360px] mx-auto lg:mx-0">
            {/* Card */}
            <div className="relative rounded-2xl overflow-hidden border border-champagne/20 bg-[#0F1218]" style={{ aspectRatio: "3/4" }}>

              {/* Real photo */}
              <Image
                src="/photos/sreeyambehera.png"
                alt="Sreeyam Behera — Wedding Filmmaker"
                fill
                className="object-cover object-top"
                sizes="360px"
              />

              {/* Gradient: bottom dark for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/20 to-transparent" />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-champagne/60 rounded-tl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-champagne/60 rounded-br pointer-events-none" />

              {/* "SB" circle badge — mid-lower area of photo */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "38%" }}>
                <div className="w-14 h-14 rounded-full border-2 border-champagne/70 bg-[#080B12]/70 backdrop-blur-sm flex items-center justify-center">
                  <span
                    className="text-champagne font-bold text-lg"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    SB
                  </span>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                <p
                  className="text-white font-bold text-xl text-center mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Sreeyam Behera
                </p>
                <p className="text-champagne/60 text-[10px] tracking-[0.3em] uppercase text-center mb-4">
                  Filmmaker · @sreeyam_behera
                </p>

                {/* Location strip */}
                <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-4 py-2.5 border border-white/[0.08]">
                  <MapPin className="h-3.5 w-3.5 text-champagne flex-shrink-0" />
                  <div>
                    <p className="text-white text-xs font-semibold tracking-[0.2em] uppercase">
                      All Over India
                    </p>
                    <p className="text-white/40 text-xs">Based in Bhubaneswar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: text ── */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.85, delay: 0.15 }}
          className="order-1 lg:order-2 space-y-7"
        >
          {/* Eyebrow */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.42em] uppercase text-champagne mb-2">
              About 2soulfilms
            </p>
            <div className="h-px w-10 bg-champagne/50" />
          </div>

          {/* Headline */}
          <h2
            className="font-bold text-white leading-[1.05]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
            }}
          >
            We don&apos;t film weddings.<br />
            <span className="text-champagne italic">We tell love stories.</span>
          </h2>

          {/* Champagne rule */}
          <div className="h-px w-10 bg-champagne" />

          {/* Blockquote */}
          <blockquote className="border-l-2 border-champagne/30 pl-5">
            <p
              className="text-white/50 italic text-base leading-relaxed"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              &ldquo;To love or have loved, that is enough. There is no other pearl to be found
              in those souls or in the dark fold of life. 2 soul gives abundance of memories
              like mist suspended in the grass of a winter morning.&rdquo;
            </p>
          </blockquote>

          {/* Body */}
          <p className="text-white/55 leading-relaxed text-base">
            Hi, I&apos;m Sreeyam. I&apos;ve spent years learning that the best moments at a
            wedding are the ones nobody planned — a grandmother wiping a tear, the groom&apos;s
            hands trembling at the altar, two families becoming one. I&apos;m here to catch all of it.
          </p>

          {/* CTA button */}
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg border border-[#CBB89E]/40 text-white text-sm font-semibold hover:bg-[#CBB89E] hover:text-[#0B0F19] hover:border-[#CBB89E] transition-all duration-300"
          >
            <Users className="h-4 w-4" />
            <span className="tracking-[0.15em] uppercase text-xs font-bold">Meet The Team</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
