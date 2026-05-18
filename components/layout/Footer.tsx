import Link from "next/link";
import { Mail, Phone, MapPin, ChevronRight, ArrowRight, Heart } from "lucide-react";

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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const quickLinks = [
  { href: "/",            label: "Home" },
  { href: "/films",       label: "Films" },
  { href: "/about",       label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact",     label: "Contact" },
  { href: "#",            label: "Blog" },
  { href: "#",            label: "FAQ" },
];

const contactItems = [
  { icon: Mail,  href: "mailto:2solu2018@gmail.com", label: "2solu2018@gmail.com" },
  { icon: Phone, href: "tel:+918763789647",           label: "+91 87637 89647" },
  { icon: MapPin, href: "#", label: "Rashulgarh, Bhubaneswar\nOdisha 751010, India", sub: "Serving all of India" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080B12] text-white overflow-hidden">
      {/* Subtle warm glow top-right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right, rgba(203,184,158,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ── Main grid: 4 columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* ── Col 1: Brand ── */}
          <div className="space-y-5">
            <div>
              <p
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                2soulfilms
              </p>
              <p className="text-[9px] tracking-[0.35em] uppercase text-champagne mt-1">
                Wedding Films
              </p>
            </div>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs">
              To love or have loved, that is enough. 2 Soul gives abundance of memories
              like mist suspended in the grass of a winter morning.
            </p>
            <div className="h-px w-10 bg-champagne/30" />
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { href: "https://instagram.com/2soulfilms", Icon: InstagramIcon, label: "Instagram" },
                { href: "https://facebook.com/2soulfilms",  Icon: FacebookIcon,  label: "Facebook" },
                { href: "https://youtube.com/@2soulfilms",  Icon: YouTubeIcon,   label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white/40 hover:border-champagne hover:text-champagne transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.38em] uppercase text-champagne mb-5">
              Quick Links
            </p>
            <div className="h-px w-6 bg-champagne/40 mb-5" />
            <ul className="space-y-0">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center justify-between py-3 border-b border-white/[0.06] text-sm text-white/45 hover:text-champagne transition-colors duration-200 group"
                  >
                    {label}
                    <ChevronRight className="h-3.5 w-3.5 text-white/15 group-hover:text-champagne/60 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Get In Touch ── */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.38em] uppercase text-champagne mb-5">
              Get In Touch
            </p>
            <div className="h-px w-6 bg-champagne/40 mb-5" />
            <div className="space-y-4">
              {contactItems.map(({ icon: Icon, href, label, sub }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 group py-3 border-b border-white/[0.06] last:border-0"
                >
                  <div className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center flex-shrink-0 group-hover:border-champagne/40 transition-colors mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-white/35 group-hover:text-champagne transition-colors" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm leading-snug group-hover:text-white/80 transition-colors whitespace-pre-line">
                      {label}
                    </p>
                    {sub && (
                      <p className="text-champagne/50 text-xs mt-0.5">{sub}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 4: CTA card ── */}
          <div>
            <div className="rounded-2xl border border-white/[0.1] bg-[#0F1420] p-6 h-full flex flex-col justify-between min-h-[260px]">
              <div>
                <span className="text-champagne text-xl">✦</span>
                <h3
                  className="text-2xl font-bold text-white mt-4 leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Let&apos;s tell<br />your{" "}
                  <span className="text-champagne italic">story.</span>
                </h3>
                <p className="text-white/35 text-sm mt-3 leading-relaxed">
                  We&apos;d love to hear about your vision and plans.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 flex items-center justify-between w-full bg-[#CBB89E] text-[#0B0F19] px-5 py-3.5 rounded-lg font-bold text-sm uppercase tracking-[0.15em] hover:bg-[#C0AB8E] transition-colors"
              >
                Get In Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.07] mb-7" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
          <p>© {new Date().getFullYear()} 2soulfilms · Sreeyam Behera. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="#" className="hover:text-white/40 transition-colors">Terms &amp; Conditions</Link>
          </div>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 text-champagne/60" style={{ fill: "currentColor" }} /> for stories
          </p>
        </div>
      </div>
    </footer>
  );
}
