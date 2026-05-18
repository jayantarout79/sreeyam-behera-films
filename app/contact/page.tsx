"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Loader2, Check, User, ArrowRight, Edit3, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const serviceTypes = [
  "Wedding Film",
  "Pre-Wedding Film",
  "Ceremony Edit",
  "Reel",
  "Wedding + Pre-Wedding",
  "Other",
];

const inputBase =
  "w-full bg-[#1A1F2E] border border-white/[0.1] rounded-xl px-4 py-3.5 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-champagne/50 focus:bg-[#1F2435] transition-all duration-200";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    serviceType: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        event_date: form.eventDate,
        location: form.location,
        service_type: form.serviceType,
        message: form.message,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } else {
      toast.error("Failed to send. Please email us at 2solu2018@gmail.com");
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <main className="pt-[58px]">

        {/* ══════════════════════════════════════════
            HERO — split layout, text left, photo right
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">

            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-[#0B0F19] relative z-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne">
                  Let&apos;s Connect
                </p>
                <div className="h-px w-10 bg-champagne/40" />
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.02]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Tell us about<br />your{" "}
                <span className="text-champagne italic">vision</span>
              </h1>

              <p className="text-white/40 text-base mt-6 max-w-sm leading-relaxed">
                Every great film starts with a conversation.<br />
                Share your story with us — we&apos;d love to be part of it.
              </p>
            </motion.div>

            {/* Right photo */}
            <div className="relative hidden lg:block">
              <Image
                src="/photos/couple-golden.png"
                alt="Wedding couple"
                fill
                className="object-cover object-center"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FORM + CONTACT INFO
        ══════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-start">

            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7 }}
            >
              {sent ? (
                <div className="bg-[#111520] rounded-2xl border border-white/[0.08] p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center mx-auto mb-5">
                    <Check className="h-7 w-7 text-champagne" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    Message sent!
                  </h3>
                  <p className="text-white/40">
                    Thank you for reaching out. We&apos;ll get back to you within 24–48 hours.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne mb-6">
                    Share Your Story
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Name *</label>
                        <div className="relative">
                          <input
                            name="name"
                            placeholder="Bride & Groom"
                            value={form.name}
                            onChange={handleChange}
                            className={inputBase + " pr-10"}
                          />
                          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Email *</label>
                        <input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Phone / WhatsApp *</label>
                        <div className="relative">
                          <input
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={handleChange}
                            className={inputBase + " pr-10"}
                          />
                          <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Wedding Date</label>
                        <div className="relative">
                          <input
                            name="eventDate"
                            type="date"
                            value={form.eventDate}
                            onChange={handleChange}
                            className={inputBase + " text-white/40 [color-scheme:dark]"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Venue / Location</label>
                        <div className="relative">
                          <input
                            name="location"
                            placeholder="City, State or venue name"
                            value={form.location}
                            onChange={handleChange}
                            className={inputBase + " pr-10"}
                          />
                          <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5 pl-1">Service Type</label>
                        <div className="relative">
                          <select
                            name="serviceType"
                            value={form.serviceType}
                            onChange={handleChange}
                            className={inputBase + " appearance-none pr-10 cursor-pointer"}
                          >
                            <option value="" className="bg-[#1A1F2E]">Select service…</option>
                            {serviceTypes.map((s) => (
                              <option key={s} value={s} className="bg-[#1A1F2E]">{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 mb-1.5 pl-1">Tell us about your vision *</label>
                      <div className="relative">
                        <textarea
                          name="message"
                          placeholder="What's your wedding like? What feeling do you want to walk away with when you watch your film years from now?"
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          className={inputBase + " resize-none pr-10"}
                        />
                        <Edit3 className="absolute right-3.5 bottom-4 h-4 w-4 text-white/15" />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-3 px-7 py-4 bg-[#CBB89E] text-[#0B0F19] font-bold text-sm uppercase tracking-[0.15em] rounded-lg hover:bg-[#C0AB8E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                      <p className="text-white/20 text-xs mt-3 flex items-center gap-1.5">
                        <span className="text-base">🔒</span>
                        Your information is safe with us. We never share your details.
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>

            {/* ── Contact info ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-3"
            >
              <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-champagne mb-6">
                Or Reach Us Directly
              </p>

              {/* Email */}
              <a
                href="mailto:2solu2018@gmail.com"
                className="flex items-center gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08] hover:border-champagne/30 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-champagne/40 transition-colors">
                  <Mail className="h-4 w-4 text-white/40 group-hover:text-champagne transition-colors" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Email</p>
                  <p className="text-white/70 text-sm group-hover:text-champagne transition-colors">2solu2018@gmail.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+918763789647"
                className="flex items-center gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08] hover:border-champagne/30 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-champagne/40 transition-colors">
                  <Phone className="h-4 w-4 text-white/40 group-hover:text-champagne transition-colors" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Phone / WhatsApp</p>
                  <p className="text-white/70 text-sm group-hover:text-champagne transition-colors">+91 87637 89647</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/2soulfilms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08] hover:border-champagne/30 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-champagne/40 transition-colors">
                  <InstagramIcon className="h-4 w-4 text-white/40 group-hover:text-champagne transition-colors" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Instagram</p>
                  <p className="text-white/70 text-sm group-hover:text-champagne transition-colors">@2soulfilms</p>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/2soulfilms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08] hover:border-champagne/30 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-champagne/40 transition-colors">
                  <FacebookIcon className="h-4 w-4 text-white/40 group-hover:text-champagne transition-colors" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Facebook</p>
                  <p className="text-white/70 text-sm group-hover:text-champagne transition-colors">2soulfilms</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08]">
                <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Address</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Rashulgarh, Bhubaneswar<br />
                    Odisha 751010, India
                  </p>
                  <p className="text-champagne text-xs mt-1">Serving all over India</p>
                </div>
              </div>

              {/* Response time */}
              <div className="flex items-center gap-4 p-4 bg-[#111520] rounded-xl border border-white/[0.08]">
                <div className="w-9 h-9 rounded-full border border-champagne/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-champagne/60" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-0.5">Response Time</p>
                  <p className="text-white/70 text-sm">Usually within 24–48 hours</p>
                  <p className="text-white/25 text-xs mt-0.5">For urgent inquiries, WhatsApp is fastest.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
