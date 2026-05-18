"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/films",        label: "Films" },
  { href: "/about",        label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact",      label: "Book Your Date" },
];

// Pages that have a dark background — navbar stays dark
const DARK_PAGES = ["/films", "/contact", "/testimonials"];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isHome     = pathname === "/";
  const isDarkPage = DARK_PAGES.includes(pathname) || pathname.startsWith("/films/");

  // Determine navbar style:
  // home + not scrolled  → transparent (white text)
  // home + scrolled      → ivory opaque (dark text)
  // dark page            → always dark translucent (white text)
  // light page (!isHome) → always ivory opaque (dark text)
  const isTransparentDark = (isHome && !scrolled) || isDarkPage;
  const isIvory           = !isTransparentDark;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          isDarkPage
            ? "bg-[#080B12]/85 backdrop-blur-md border-b border-white/[0.06]"
            : isHome && !scrolled
              ? "bg-transparent border-b border-transparent"
              : "bg-[#F8F4EE]/96 backdrop-blur-md border-b border-[#E2D9CE]"
        )}
      >
        <div className="px-6 lg:px-8 h-[58px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" aria-label="2soulfilms home" className="flex flex-col leading-none flex-shrink-0 group">
            <span
              className={cn(
                "font-bold tracking-tight transition-colors leading-none",
                isIvory ? "text-[#0B0F19]" : "text-white"
              )}
              style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}
            >
              2soulfilms
            </span>
            <span
              className={cn(
                "text-[7px] tracking-[0.28em] uppercase mt-0.5 transition-colors",
                isIvory ? "text-[#9B8E82]" : "text-white/35"
              )}
            >
              Wedding Films
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 ml-auto">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href === "/films" && pathname.startsWith("/films/"));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
                    isIvory
                      ? active
                        ? "text-[#0B0F19]"
                        : "text-[#8C8176] hover:text-[#0B0F19]"
                      : active
                        ? "text-white font-semibold"
                        : "text-white/55 hover:text-white"
                  )}
                >
                  {label}
                  {active && (
                    <span
                      className={cn(
                        "absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full",
                        isIvory ? "bg-champagne" : "bg-champagne"
                      )}
                    />
                  )}
                </Link>
              );
            })}

          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors ml-auto",
              isIvory ? "text-[#0B0F19] hover:bg-[#E7D4C8]" : "text-white hover:bg-white/10"
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div
            className={cn(
              "md:hidden border-t px-6 py-4 space-y-0.5",
              isDarkPage
                ? "bg-[#0B0F19] border-white/[0.08]"
                : "bg-[#F8F4EE] border-[#E2D9CE]"
            )}
          >
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "block py-3 text-sm font-medium border-b last:border-0 transition-colors",
                    isDarkPage
                      ? active
                        ? "text-champagne border-white/[0.06]"
                        : "text-white/50 hover:text-white border-white/[0.06]"
                      : active
                        ? "text-champagne border-[#EDE5DA]"
                        : "text-[#8C8176] hover:text-[#0B0F19] border-[#EDE5DA]"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
