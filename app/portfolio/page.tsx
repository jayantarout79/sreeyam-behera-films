"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, ArrowLeft, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    couple: "Priya & Rahul",
    location: "The Leela Palace, Mumbai",
    date: "March 2026",
    theme: "Gold & Ivory",
    colors: { primary: "#C9A84C", secondary: "#FAF7F2", accent: "#1C1C1E" },
    aspect: "portrait",
  },
  {
    id: 2,
    couple: "Ananya & Vikram",
    location: "Udaipur Lake Palace",
    date: "February 2026",
    theme: "Rose & Cream",
    colors: { primary: "#C0737A", secondary: "#F9EDEF", accent: "#2C2C2E" },
    aspect: "landscape",
  },
  {
    id: 3,
    couple: "Sneha & Arjun",
    location: "ITC Grand Chola, Chennai",
    date: "January 2026",
    theme: "Navy & Gold",
    colors: { primary: "#1A3461", secondary: "#F5E8C0", accent: "#C9A84C" },
    aspect: "portrait",
  },
  {
    id: 4,
    couple: "Meera & Karan",
    location: "Taj Falaknuma, Hyderabad",
    date: "December 2025",
    theme: "Sage & White",
    colors: { primary: "#7C9E7C", secondary: "#F0F4F0", accent: "#1C1C1E" },
    aspect: "landscape",
  },
  {
    id: 5,
    couple: "Riya & Sameer",
    location: "Aamby Valley, Pune",
    date: "November 2025",
    theme: "Gold & Ivory",
    colors: { primary: "#C9A84C", secondary: "#FAF7F2", accent: "#1C1C1E" },
    aspect: "portrait",
  },
  {
    id: 6,
    couple: "Divya & Aditya",
    location: "Oberoi Amarvilas, Agra",
    date: "October 2025",
    theme: "Rose & Cream",
    colors: { primary: "#C0737A", secondary: "#F9EDEF", accent: "#2C2C2E" },
    aspect: "landscape",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10">
              <Camera className="h-4 w-4 text-gold" />
            </div>
            <span
              className="text-white font-semibold text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sreeyam Behera Films
            </span>
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-white/60 hover:text-white"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-charcoal text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.35em] uppercase text-gold mb-4"
          >
            Our Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold text-white mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Digital Wedding
            <span className="block italic text-gold">Invitations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/60 text-lg leading-relaxed"
          >
            Beautifully designed, animated invitations shared as a link — no
            app required.
          </motion.p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-charcoal text-center">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-lg mx-auto"
        >
          <Heart
            className="mx-auto mb-5 h-8 w-8 text-rose"
            fill="currentColor"
          />
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Create yours today
          </h2>
          <p className="text-white/60 mb-8">
            Each invite is uniquely crafted for the couple with custom colours,
            photos, and their love story.
          </p>
          <Link
            href="/#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "px-8 font-semibold text-charcoal"
            )}
            style={{ background: "var(--gold)" }}
          >
            Book a session
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-white/5 py-8 px-6 text-center">
        <p className="text-white/30 text-sm">
          © {new Date().getFullYear()} Sreeyam Behera Films
        </p>
      </footer>
    </div>
  );
}

function PortfolioCard({
  item,
  index,
}: {
  item: (typeof PORTFOLIO_ITEMS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="group rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Mock invite preview */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: item.colors.accent,
          aspectRatio: item.aspect === "portrait" ? "3/4" : "4/3",
        }}
      >
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${item.colors.primary} 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
        {/* Names */}
        <div className="relative z-10 text-center px-8">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-3 opacity-70"
            style={{ color: item.colors.primary }}
          >
            Wedding Invitation
          </p>
          <p
            className="text-2xl font-bold leading-snug"
            style={{ fontFamily: "var(--font-heading)", color: item.colors.primary }}
          >
            {item.couple.split(" & ")[0]}
            <span className="block text-lg font-normal italic my-1 opacity-80">
              &amp;
            </span>
            {item.couple.split(" & ")[1]}
          </p>
          <div
            className="mx-auto mt-4"
            style={{
              background: `linear-gradient(to right, transparent, ${item.colors.primary}, transparent)`,
              height: "1px",
              width: "80px",
            }}
          />
          <p
            className="mt-3 text-xs opacity-60"
            style={{ color: item.colors.primary }}
          >
            {item.date}
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <p
          className="font-semibold text-charcoal text-sm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.couple}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5 truncate">
          {item.location}
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          {[item.colors.primary, item.colors.secondary, item.colors.accent].map(
            (c) => (
              <div
                key={c}
                className="h-4 w-4 rounded-full border border-border"
                style={{ background: c }}
              />
            )
          )}
          <span className="text-xs text-muted-foreground ml-1">
            {item.theme}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
