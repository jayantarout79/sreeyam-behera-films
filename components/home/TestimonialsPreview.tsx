"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Calendar, Users, Film } from "lucide-react";

// Olive/sage green matching the reference design
const OLIVE = "#6B7857";
const OLIVE_DARK = "#5A6648";

const testimonials = [
  {
    coupleNames: "Meera & Rohan",
    paragraphs: [
      "Working with 2soulfilms was the best decision we made for our wedding. I've always admired Sreeyam's work online, and when we finally saw our own film, we couldn't stop crying happy tears.",
      "Every frame felt intentional — like someone who truly understood what our wedding meant to us, not just a vendor doing a job.",
      "To every bride and groom reading this: don't overthink it. Just trust 2soulfilms and let them tell your story.",
    ],
    event: "Wedding · Puri, Odisha",
    date: "Dec 2024",
    photo: "/photos/couple-meera-rohan.png",
  },
  {
    coupleNames: "Anjali & Vikram",
    paragraphs: [
      "Sreeyam has a rare gift for being invisible while capturing everything. We completely forgot the camera was there — and that's exactly how the film feels. Natural, honest, deeply emotional.",
      "The moment we watched it the first time, we were transported right back to our wedding day. Every small detail was there — even the moments we didn't think anyone noticed.",
      "Our families have watched it more than twenty times already. That says everything.",
    ],
    event: "Wedding · Bhubaneswar",
    date: "Nov 2024",
    photo: "/photos/couple-beach.png",
  },
  {
    coupleNames: "Priyanka & Arjun",
    paragraphs: [
      "Our pre-wedding film is the most beautiful thing anyone has ever made for us. Friends from across India keep asking who our filmmaker was.",
      "Sreeyam has this amazing ability to make you feel completely at ease on camera. We just laughed and were ourselves, and he captured something magical from that.",
      "Worth every moment and every rupee. We are forever grateful to 2soulfilms.",
    ],
    event: "Pre-Wedding · Cuttack",
    date: "Oct 2024",
    photo: "/photos/couple-lake.png",
  },
];

const stats = [
  { icon: Calendar, number: "5+",   label: "Years in Wedding Films" },
  { icon: Users,    number: "150+", label: "Couples Served" },
  { icon: Film,     number: "300+", label: "Films Delivered" },
];

export default function TestimonialsPreview() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  const total = testimonials.length;

  function next() {
    setActive((prev) => (prev + 1) % total);
  }

  return (
    <section className="bg-[#F0EBE3]">
      <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-[#DDD5C8]">

        {/* ── Column 1: CLIENT LOVE ── */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#DDD5C8] flex flex-col bg-white">
          <div className="flex items-center gap-3 px-8 py-5 border-b border-[#DDD5C8]">
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#9B9082] whitespace-nowrap">
              Client Love
            </span>
            <div className="flex-1 h-px bg-[#DDD5C8]" />
            <span className="text-[9px] tracking-[0.2em] text-[#C0B8AE] font-mono whitespace-nowrap">
              0{active + 1}/0{total}
            </span>
          </div>

          <div className="flex-1 flex flex-col px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col"
              >
                {/* Large quote mark */}
                <div
                  className="text-7xl leading-none font-bold mb-2 select-none"
                  style={{ fontFamily: "var(--font-heading)", color: "#EDE5DA" }}
                >
                  "
                </div>

                <div className="flex items-end gap-2.5 mb-6">
                  <h2
                    className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.coupleNames}
                  </h2>
                  <Heart
                    className="h-5 w-5 mb-1.5 flex-shrink-0"
                    style={{ color: "#9B9082", fill: "currentColor" }}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  {t.paragraphs.map((para, i) => (
                    <p key={i} className="text-[#4A4540] text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                <p className="text-xs tracking-widest uppercase text-[#9B9082] mt-5">
                  {t.event} &nbsp;·&nbsp; {t.date}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between pt-5 border-t border-[#EDE5DA]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-bold tracking-tight">2S</span>
                </div>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#9B9082]">
                  2soulfilms
                </span>
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                style={{ backgroundColor: OLIVE }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = OLIVE_DARK)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = OLIVE)}
                aria-label="Next testimonial"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "1.5rem" : "0.375rem",
                    backgroundColor: i === active ? "#1A1A1A" : "#DDD5C8",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Column 2: BEHIND THE SCENES ── */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#DDD5C8] flex flex-col min-h-[520px] lg:min-h-0">
          <div className="flex items-center gap-3 px-8 py-5 border-b border-[#DDD5C8] bg-white">
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#9B9082] whitespace-nowrap">
              Behind The Scenes
            </span>
            <div className="flex-1 h-px bg-[#DDD5C8]" />
            <span className="text-[9px] tracking-[0.2em] text-[#C0B8AE] font-mono whitespace-nowrap">
              02/0{total}
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.photo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={t.photo}
                  alt="2soulfilms behind the scenes"
                  fill
                  className="object-cover object-top"
                  sizes="33vw"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-[#0B0F19]/10 to-transparent pointer-events-none" />

            <div className="absolute bottom-8 left-7 right-7">
              <p
                className="text-white text-2xl leading-snug"
                style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}
              >
                Real moments.<br />Real people.<br />Real memories.
              </p>
              {/* Script-style underline */}
              <div className="mt-3 h-px w-20 bg-white/30" />
            </div>
          </div>
        </div>

        {/* ── Column 3: THE 2SOULFILMS EXPERIENCE ── */}
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-8 py-5 border-b border-[#DDD5C8]">
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#9B9082] whitespace-nowrap">
              The 2soulfilms Experience
            </span>
            <div className="flex-1 h-px bg-[#DDD5C8]" />
            <span className="text-[9px] tracking-[0.2em] text-[#C0B8AE] font-mono whitespace-nowrap">
              03/0{total}
            </span>
          </div>

          {/* Stats */}
          <div className="flex-1 px-8 py-8 space-y-6">
            {stats.map(({ icon: Icon, number, label }) => (
              <div key={label} className="flex items-center gap-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: OLIVE }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p
                    className="text-4xl font-bold text-[#1A1A1A] leading-none"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {number}
                  </p>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#9B9082] mt-1">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Thank you card — olive green matching reference */}
          <div className="mx-4 mb-4 rounded-xl p-8 text-center" style={{ backgroundColor: OLIVE }}>
            <p
              className="text-2xl font-bold text-white flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}
            >
              Thank you
              <Heart className="h-4 w-4 text-white/60 flex-shrink-0" style={{ fill: "currentColor" }} />
            </p>
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/60 mt-3 leading-relaxed">
              For trusting us with your<br />beautiful journey!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
