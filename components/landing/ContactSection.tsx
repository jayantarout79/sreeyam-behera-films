"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Camera as InstagramIcon, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } else {
      toast.error("Failed to send. Please try again or reach out directly.");
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-4 text-gold">
            Let&apos;s Work Together
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book Your Date
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Dates fill quickly — reach out early to check availability for your wedding day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact channels */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-4">
            <a
              href="mailto:sreeyam@example.com"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 hover:border-gold/40 hover:bg-white/5 transition-all"
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.15)" }}>
                <Mail className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-white text-sm font-medium group-hover:text-gold transition-colors">
                  sreeyam@example.com
                </p>
              </div>
            </a>

            <a
              href="tel:+919999999999"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 hover:border-gold/40 hover:bg-white/5 transition-all"
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.15)" }}>
                <Phone className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Phone / WhatsApp</p>
                <p className="text-white text-sm font-medium group-hover:text-gold transition-colors">
                  +91 99999 99999
                </p>
              </div>
            </a>

            <a
              href="https://instagram.com/sreeyambeherafilms"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 hover:border-gold/40 hover:bg-white/5 transition-all"
            >
              <div className="p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.15)" }}>
                <InstagramIcon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Instagram</p>
                <p className="text-white text-sm font-medium group-hover:text-gold transition-colors">
                  @sreeyambeherafilms
                </p>
              </div>
            </a>

            <div
              className="h-px mt-2"
              style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)" }}
            />
            <p className="text-white/30 text-sm text-center">
              Based in Odisha, India · Available pan-India and internationally
            </p>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
            {sent ? (
              <div className="rounded-2xl border border-white/10 p-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: "rgba(201,168,76,0.2)" }}
                >
                  <Check className="h-7 w-7 text-gold" />
                </div>
                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Message sent!
                </h3>
                <p className="text-white/60 text-sm">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-white/70 text-xs">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Priya & Rahul"
                      value={form.name}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-white/70 text-xs">Phone / WhatsApp</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-white/70 text-xs">Email *</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-white/70 text-xs">
                    Tell us about your wedding *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Wedding date, venue, what you're looking for…"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 font-semibold text-charcoal"
                  style={{ background: "var(--gold)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
