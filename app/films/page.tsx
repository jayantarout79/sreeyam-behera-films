"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, MapPin, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const categories = ["All", "Wedding", "Pre-Wedding", "Ceremony", "Reels"];

const films = [
  {
    slug: "priya-arjun-wedding",
    title: "Priya & Arjun",
    location: "Bhubaneswar, Odisha",
    duration: "8 min",
    category: "Wedding",
    tags: ["Romantic", "Cinematic"],
    photo: "/photos/couple-golden.png",
    objectPos: "center center",
    featured: true,
  },
  {
    slug: "sonal-deepak-wedding",
    title: "Sonal & Deepak",
    location: "Rourkela, Odisha",
    duration: "10 min",
    category: "Wedding",
    tags: ["Romantic", "Documentary"],
    photo: "/photos/couple-silhouette.png",
    objectPos: "center center",
    featured: true,
  },
  {
    slug: "meera-rohan-wedding",
    title: "Meera & Rohan",
    location: "Puri, Odisha",
    duration: "6 min",
    category: "Wedding",
    tags: ["Traditional", "Documentary"],
    photo: "/photos/couple-meera-rohan.png",
    objectPos: "center top",
    featured: false,
  },
  {
    slug: "anjali-vikram-pre-wedding",
    title: "Anjali & Vikram",
    location: "Bhubaneswar",
    duration: "4 min",
    category: "Pre-Wedding",
    tags: ["Romantic", "Modern"],
    photo: "/photos/prewedding-streets.png",
    objectPos: "center center",
    featured: false,
  },
  {
    slug: "sunita-raj-ceremony",
    title: "Sunita & Raj",
    location: "Cuttack, Odisha",
    duration: "5 min",
    category: "Ceremony",
    tags: ["Traditional", "Cinematic"],
    photo: "/photos/ceremony-traditional.png",
    objectPos: "center top",
    featured: false,
  },
  {
    slug: "reel-1",
    title: "Reel — Dec 2024",
    location: "Bhubaneswar",
    duration: "60 sec",
    category: "Reels",
    tags: ["Cinematic", "Highlights"],
    photo: "/photos/couple-golden.png",
    objectPos: "center center",
    featured: false,
  },
  {
    slug: "reel-2",
    title: "Reel — Nov 2024",
    location: "Odisha",
    duration: "60 sec",
    category: "Reels",
    tags: ["Romantic", "Modern"],
    photo: "/photos/couple-silhouette.png",
    objectPos: "center center",
    featured: false,
  },
  {
    slug: "reel-3",
    title: "Reel — Oct 2024",
    location: "Bhubaneswar",
    duration: "60 sec",
    category: "Reels",
    tags: ["Traditional", "Cinematic"],
    photo: "/photos/couple-meera-rohan.png",
    objectPos: "center top",
    featured: false,
  },
  {
    slug: "reel-4",
    title: "Reel — Sep 2024",
    location: "Cuttack",
    duration: "60 sec",
    category: "Reels",
    tags: ["Emotional", "Highlights"],
    photo: "/photos/ceremony-traditional.png",
    objectPos: "center top",
    featured: false,
  },
  {
    slug: "reel-5",
    title: "Reel — Aug 2024",
    location: "Odisha",
    duration: "60 sec",
    category: "Reels",
    tags: ["High Energy", "Modern"],
    photo: "/photos/couple-portrait.png",
    objectPos: "center center",
    featured: false,
  },
];

export default function FilmsPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? films : films.filter((f) => f.category === active);
  const featured = filtered.filter((f) => f.featured);
  const rest = filtered.filter((f) => !f.featured);

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <main className="pt-20 pb-24">

        {/* ── Page header ── */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.45em] uppercase text-champagne mb-5">
              Our Work
            </p>
            <h1
              className="text-6xl sm:text-7xl font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Films
            </h1>
            <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
              Each wedding has a unique story.<br />Browse our curated collection of cinematic films.
            </p>
          </motion.div>
        </div>

        {/* ── Filter pills ── */}
        <div className="px-6 mb-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                  active === cat
                    ? "bg-[#CBB89E] text-[#0B0F19] border-[#CBB89E]"
                    : "bg-transparent border-white/15 text-white/50 hover:border-champagne/50 hover:text-white/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider with star */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-white/10" />
            <span className="text-champagne/50 text-xs">✦</span>
            <div className="h-px w-16 bg-white/10" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8">

          {/* ── Featured films ── */}
          <AnimatePresence mode="wait">
            {featured.length > 0 && (
              <motion.div
                key={`featured-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-10"
              >
                <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-champagne mb-5">
                  Featured
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.map((film, i) => (
                    <FilmCard key={film.slug} film={film} large delay={i * 0.08} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── More films ── */}
          <AnimatePresence mode="wait">
            {rest.length > 0 && (
              <motion.div
                key={`rest-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-champagne">
                    {featured.length > 0 ? "More Films" : "All Films"}
                  </p>
                  <Link href="/contact" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-champagne transition-colors">
                    View all films <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rest.map((film, i) => (
                    <FilmCard key={film.slug} film={film} delay={i * 0.06} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/30">
              No films in this category yet — check back soon.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilmCard({
  film,
  large = false,
  delay = 0,
}: {
  film: (typeof films)[0];
  large?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={`/films/${film.slug}`} className="group block rounded-2xl overflow-hidden border border-white/[0.08] hover:border-champagne/30 transition-all duration-300 bg-[#111318]">
        {/* Thumbnail */}
        <div className={cn("relative overflow-hidden", large ? "aspect-[16/9]" : "aspect-[4/3]")}>
          <Image
            src={film.photo}
            alt={film.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: film.objectPos }}
            sizes={large ? "(max-width:768px) 100vw, 50vw" : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/80 via-transparent to-transparent" />

          {/* Category badge — top right */}
          <div className="absolute top-3 right-4">
            <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/60">
              {film.category}
            </span>
          </div>

          {/* Play button — center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-white/60 bg-[#0B0F19]/50 backdrop-blur-sm flex items-center justify-center group-hover:border-champagne group-hover:bg-[#0B0F19]/70 transition-all duration-300">
              <Play className="h-5 w-5 text-white fill-white ml-0.5 group-hover:text-champagne group-hover:fill-champagne transition-colors duration-300" />
            </div>
          </div>

          {/* Location — bottom left */}
          <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-champagne/80 flex-shrink-0" />
            <span className="text-white/70 text-xs">{film.location}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="px-5 py-4">
          <h3
            className="font-bold text-white mb-1.5 group-hover:text-champagne transition-colors duration-300"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: large ? "1.4rem" : "1.1rem",
            }}
          >
            {film.title}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-white/35 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-champagne/50" />
              {film.duration}
            </span>
            <span className="text-white/15">|</span>
            <span>{film.tags.join(" · ")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
