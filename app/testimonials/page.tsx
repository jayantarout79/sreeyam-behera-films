"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Film, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const filters = ["All", "Wedding", "Pre-Wedding", "Ceremony"];

const testimonials = [
  {
    quote:
      "2soulfilms didn't just film our wedding — they captured what it felt like to be there. Every time we watch it, we cry the same happy tears.",
    name: "Meera & Rohan",
    event: "Wedding",
    location: "Puri, Odisha",
    date: "December 2024",
    photo: "/photos/couple-meera-rohan.png",
    photoPos: "center top",
    stars: 5,
  },
  {
    quote:
      "Sreeyam has a rare gift for being invisible while capturing everything. We forgot the camera was there and that's exactly how the film feels.",
    name: "Anjali & Vikram",
    event: "Wedding",
    location: "Bhubaneswar",
    date: "November 2024",
    photo: "/photos/couple-golden.png",
    photoPos: "center center",
    stars: 5,
  },
  {
    quote:
      "Our pre-wedding film is the most beautiful thing anyone has ever made for us. Friends keep asking who filmed it.",
    name: "Priyanka & Arjun",
    event: "Pre-Wedding",
    location: "Cuttack, Odisha",
    date: "October 2024",
    photo: "/photos/prewedding-streets.png",
    photoPos: "center center",
    stars: 5,
  },
  {
    quote:
      "We were blown away. Every detail, every emotion — the editing is cinematic but never overdone. It feels honest. It feels like us.",
    name: "Sunita & Raj",
    event: "Wedding",
    location: "Bhubaneswar",
    date: "January 2025",
    photo: "/photos/couple-silhouette.png",
    photoPos: "center center",
    stars: 5,
  },
  {
    quote:
      "The ceremony edit was perfect. It was the one thing we showed our families who couldn't attend, and everyone was in tears.",
    name: "Kavita & Suresh",
    event: "Ceremony",
    location: "Rourkela, Odisha",
    date: "February 2025",
    photo: "/photos/ceremony-traditional.png",
    photoPos: "center top",
    stars: 5,
  },
  {
    quote:
      "Worth every rupee and more. This isn't just a video — it's time travel back to the best day of our lives.",
    name: "Deepa & Kiran",
    event: "Wedding",
    location: "Bhubaneswar",
    date: "March 2025",
    photo: "/photos/couple-intimate.png",
    photoPos: "center top",
    stars: 5,
  },
];

// ── 5-star SVG row ──
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="w-3 h-3" fill="#CBB89E">
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8l-2.78 1.56.53-3.1L1.5 4.27l3.11-.45z" />
        </svg>
      ))}
    </div>
  );
}

// ── Big decorative double-quote mark ──
function BigQuote() {
  return (
    <svg viewBox="0 0 32 24" className="w-8 h-6" fill="none">
      <text
        x="0" y="22"
        fontSize="32"
        fontWeight="700"
        fill="#CBB89E"
        fontFamily="Georgia, serif"
      >
        &ldquo;
      </text>
    </svg>
  );
}

export default function TestimonialsPage() {
  const [active, setActive] = useState("All");
  const [page, setPage] = useState(0);

  const filtered =
    active === "All" ? testimonials : testimonials.filter((t) => t.event === active);

  // Pagination: 6 per page
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  function handleFilter(f: string) {
    setActive(f);
    setPage(0);
  }

  return (
    <div className="min-h-screen bg-[#F5EDE2]">
      <Navbar />
      <main className="pt-[58px] pb-24">

        {/* ── Header ── */}
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne mb-4">
              Couple Stories
            </p>
            <h1
              className="font-bold text-[#0B0F19] leading-tight mb-5"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
              }}
            >
              What Couples Say
            </h1>
            <p className="text-[#6B6560] text-lg max-w-lg mx-auto leading-relaxed">
              The highest compliment we receive:{" "}
              <span className="italic">&ldquo;We felt like we were back there.&rdquo;</span>
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center gap-2 flex-wrap mt-8"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  active === f
                    ? "bg-[#0B0F19] text-white border-[#0B0F19]"
                    : "bg-transparent border-[#C8BDB4] text-[#6B6560] hover:border-[#0B0F19] hover:text-[#0B0F19]"
                )}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Cards grid ── */}
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
            >
              {paged.map(({ quote, name, event, location, date, photo, photoPos, stars }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E4D9CF] hover:border-champagne hover:shadow-lg transition-all duration-300 flex"
                  style={{ minHeight: 200 }}
                >
                  {/* Left photo — square */}
                  <div className="relative flex-shrink-0 w-[180px]">
                    <Image
                      src={photo}
                      alt={name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: photoPos }}
                      sizes="180px"
                    />
                    {/* Subtle right-side fade */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                  </div>

                  {/* Right content */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Top row: quote icon + stars */}
                    <div className="flex items-start justify-between mb-3">
                      <BigQuote />
                      <Stars count={stars} />
                    </div>

                    {/* Quote text */}
                    <p
                      className="text-[#3D3830] text-sm leading-relaxed flex-1 mb-4"
                      style={{ fontFamily: "var(--font-heading)", fontStyle: "italic" }}
                    >
                      &ldquo;{quote}&rdquo;
                    </p>

                    {/* Name + meta */}
                    <div>
                      <p
                        className="font-bold text-[#0B0F19] text-base mb-1.5"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {name}
                      </p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Film className="h-3 w-3 text-[#9B9082]" />
                        <span className="text-[11px] text-[#9B9082]">{event}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-[#9B9082]">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#9B9082]">
                          <Calendar className="h-3 w-3" />
                          {date}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Trusted by + Pagination ── */}
          <div className="flex flex-col items-center gap-5">
            {/* Trusted badge */}
            <div className="flex items-center gap-2 text-sm text-[#9B9082]">
              <Heart className="h-4 w-4 text-champagne" style={{ fill: "currentColor" }} />
              Trusted by 100+ couples across India
            </div>

            {/* Dots pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === page ? "2rem" : "0.625rem",
                      height: "0.625rem",
                      backgroundColor: i === page ? "#0B0F19" : "#C8BDB4",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
