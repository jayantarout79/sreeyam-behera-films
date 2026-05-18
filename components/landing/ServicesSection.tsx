"use client";

import { motion } from "framer-motion";
import { Camera, Film, Heart, Link as LinkIcon } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description:
      "Candid and traditional photography that captures every emotion — from the first look to the last dance.",
    highlight: "Full day coverage",
  },
  {
    icon: Film,
    title: "Cinematic Films",
    description:
      "Short films and full-length wedding documentaries crafted with a storyteller's eye and a filmmaker's heart.",
    highlight: "4K cinematic quality",
  },
  {
    icon: Heart,
    title: "Pre-Wedding Shoots",
    description:
      "Romantic, creative sessions in locations that reflect your story together.",
    highlight: "Location scouting included",
  },
  {
    icon: LinkIcon,
    title: "Digital Invitations",
    description:
      "Beautiful, animated wedding invitations your guests can open on any device — no app required.",
    highlight: "Shareable link, forever",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-4 text-gold"
          >
            What We Offer
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="inline-flex p-3 rounded-xl mb-5"
                style={{ background: "var(--gold-light)" }}
              >
                <service.icon className="h-5 w-5 text-gold" />
              </div>
              <h3
                className="text-xl font-bold text-charcoal mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {service.description}
              </p>
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--gold-light)", color: "var(--charcoal)" }}
              >
                {service.highlight}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
