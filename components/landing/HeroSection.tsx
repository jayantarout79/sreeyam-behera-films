"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "var(--charcoal)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--cream))" }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-semibold tracking-[0.4em] uppercase mb-6"
            style={{ color: "var(--gold)" }}
          >
            Capturing Timeless Moments
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Love Stories,
          <span
            className="block italic"
            style={{ color: "var(--gold)" }}
          >
            Told Forever.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-lg sm:text-xl text-white/65 mt-8 max-w-xl mx-auto leading-relaxed"
        >
          Wedding photography and cinematic films that preserve the emotions,
          laughter, and tears of your most important day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "px-8 text-base font-semibold text-charcoal"
            )}
            style={{ background: "var(--gold)" }}
          >
            Book a Session
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8 text-base font-medium border-white/20 text-white hover:bg-white/10 hover:text-white"
            )}
          >
            View Services
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex items-center justify-center gap-2 text-white/40 text-sm"
        >
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Heart key={i} className="h-3.5 w-3.5 text-rose fill-current" />
            ))}
          </div>
          <span>Trusted by 100+ couples across India</span>
        </motion.div>
      </div>
    </section>
  );
}
