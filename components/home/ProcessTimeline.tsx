"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Camera, Film, Package } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Inquiry & Discovery",
    bullets: ["Share your vision & date", "15-min discovery call to understand your story"],
    photo: "/photos/Inquiry_Discovery.png",
    photoAlt: "Inquiry conversation",
    objectPos: "center center",
  },
  {
    icon: Camera,
    step: "02",
    title: "Pre-Wedding Shoot",
    bullets: ["Optional romance session", "We learn how you move, how you laugh, how you love"],
    photo: "/photos/Pre-Wedding.png",
    photoAlt: "Pre-wedding shoot",
    objectPos: "center center",
  },
  {
    icon: Film,
    step: "03",
    title: "Your Wedding Day",
    bullets: ["Unobtrusive documentary approach", "Every ritual, every candid moment captured"],
    photo: "/photos/weddingday.png",
    photoAlt: "Wedding ceremony",
    objectPos: "center center",
  },
  {
    icon: Package,
    step: "04",
    title: "Delivery",
    bullets: ["Full cinematic film + social cuts", "Ceremony edits + behind-the-scenes highlights"],
    photo: "/photos/delivery.png",
    photoAlt: "Film delivery",
    objectPos: "center center",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
};

export default function ProcessTimeline() {
  return (
    <section className="relative py-24 px-6 bg-[#0B0F19] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold tracking-[0.42em] uppercase text-champagne mb-4">
            How It Works
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-champagne/40" />
            <span className="text-champagne text-xs">✦</span>
            <div className="h-px w-10 bg-champagne/40" />
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What you <span className="text-champagne">get</span>
          </h2>
        </motion.div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ icon: Icon, step, title, bullets, photo, photoAlt, objectPos }, i) => (
            <motion.div
              key={step}
              {...fadeUp}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="flex flex-col"
            >
              {/* Photo card with icon at top-left corner — NOT on face */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={photo}
                  alt={photoAlt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: objectPos }}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                />
                {/* Darker top area so icon badge is readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/70 via-transparent to-[#0B0F19]/50" />

                {/* Icon badge — TOP LEFT, not on face */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-[#0B0F19]/80 backdrop-blur-sm border border-champagne/40 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-champagne" />
                </div>
              </div>

              {/* Step number circle — below the photo */}
              <div className="flex justify-center my-4">
                <div className="w-10 h-10 rounded-full border border-white/20 bg-[#0B0F19] flex items-center justify-center">
                  <span className="text-white/50 text-xs font-bold font-mono">{step}</span>
                </div>
              </div>

              {/* Title + divider + bullets */}
              <h3
                className="text-lg font-bold text-white text-center mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h3>
              <div className="flex justify-center mb-3">
                <div className="h-px w-8 bg-champagne/40" />
              </div>
              <ul className="space-y-1.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/50">
                    <span className="text-champagne mt-0.5 flex-shrink-0 text-base leading-none">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne/50">
            Timeless Stories. &nbsp; Beautifully Told.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-10 bg-champagne/15" />
            <span className="text-champagne/25 text-xs">✦</span>
            <div className="h-px w-10 bg-champagne/15" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
