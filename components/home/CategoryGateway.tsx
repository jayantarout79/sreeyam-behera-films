"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Heart, Play, Sparkles, ArrowRight } from "lucide-react";

const categories = [
  {
    num: "01",
    icon: Film,
    label: "Wedding Films",
    subtitle: "Full-length cinematic edits",
    description: "Complete storytelling from morning prep to the final dance.",
    href: "/films?category=wedding",
    photo: "/photos/wedding-ceremony.png",
    photoAlt: "Wedding ceremony couple",
    objectPos: "center top",
  },
  {
    num: "02",
    icon: Heart,
    label: "Pre-Wedding Films",
    subtitle: "Romance & connection",
    description: "Intimate narratives that capture your love before the big day.",
    href: "/films?category=pre-wedding",
    photo: "/photos/prewedding-streets.png",
    photoAlt: "Pre-wedding couple in streets",
    objectPos: "center center",
  },
  {
    num: "03",
    icon: Play,
    label: "Ceremony Edits",
    subtitle: "Sacred moments",
    description: "The rituals, vows, and emotions that define your ceremony.",
    href: "/films?category=ceremony",
    photo: "/photos/ceremony-traditional.png",
    photoAlt: "Traditional ceremony couple",
    objectPos: "center top",
  },
  {
    num: "04",
    icon: Sparkles,
    label: "Reels",
    subtitle: "Short-form highlights",
    description: "Shareable 60-second stories crafted for Instagram.",
    href: "/films?category=reels",
    photo: "/photos/couple-portrait.png",
    photoAlt: "Intimate couple portrait",
    objectPos: "center center",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
};

export default function CategoryGateway() {
  return (
    <section className="relative bg-[#0B0F19] py-24 px-6 overflow-hidden">

      {/* ── Ghost watermark "2S" ── */}
      <div
        className="pointer-events-none absolute -left-6 top-0 select-none leading-none font-bold text-white/[0.04]"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(14rem, 20vw, 22rem)",
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        2S
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold tracking-[0.42em] uppercase text-champagne mb-5">
            Our Work
          </p>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Every story, beautifully told
          </h2>
          <div className="flex justify-center mb-5">
            <div className="h-px w-12 bg-champagne" />
          </div>
          <p className="text-white/45 text-base max-w-md mx-auto leading-relaxed">
            From timeless wedding films to intimate pre-wedding stories,
            we capture emotions that stay with you forever.
          </p>
        </motion.div>

        {/* ── 4-card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(
            ({ num, icon: Icon, label, subtitle, description, href, photo, photoAlt, objectPos }, i) => (
              <motion.div
                key={label}
                {...fadeUp}
                transition={{ duration: 0.65, delay: i * 0.1 }}
              >
                <Link
                  href={href}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] hover:border-champagne/40 transition-all duration-400 bg-[#111318]"
                  style={{
                    boxShadow: "0 0 0 0 transparent",
                    transition: "border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
                  }}
                >
                  {/* ── Photo area ── */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <Image
                      src={photo}
                      alt={photoAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: objectPos }}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-[#111318]/80 backdrop-blur-sm border border-champagne/30 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-champagne" />
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <span className="text-white/30 text-sm font-mono font-medium">{num}</span>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-col flex-1 p-5 pt-4">
                    <h3
                      className="text-xl font-bold text-white mb-1.5 group-hover:text-champagne transition-colors duration-300"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {label}
                    </h3>

                    <div className="h-px w-6 bg-champagne/50 mb-2.5 group-hover:w-10 transition-all duration-300" />

                    <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-champagne/70 mb-3">
                      {subtitle}
                    </p>

                    <p className="text-white/40 text-sm leading-relaxed flex-1">
                      {description}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.07]">
                      <span className="text-champagne text-sm font-medium">
                        View films
                      </span>
                      <div className="w-8 h-8 rounded-full border border-[#CBB89E]/40 flex items-center justify-center group-hover:bg-[#CBB89E] group-hover:border-[#CBB89E] transition-all duration-300">
                        <ArrowRight className="h-3.5 w-3.5 text-[#CBB89E] group-hover:text-[#0B0F19] transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
