import { notFound } from "next/navigation";
import Link from "next/link";
import { Play, MapPin, Clock, Tag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Film = {
  title: string;
  location: string;
  duration: string;
  category: string;
  tags: string[];
  story: string;
  testimonial?: { quote: string; name: string };
  gradient: string;
  instagramUrl?: string;
};

const films: Record<string, Film> = {
  "priya-arjun-wedding": {
    title: "Priya & Arjun",
    location: "Bhubaneswar, Odisha",
    duration: "8 min",
    category: "Wedding",
    tags: ["Romantic", "Cinematic", "Traditional"],
    story:
      "Their love story began in the narrow lanes of old Bhubaneswar — two souls who found each other across temples and traditions. On a golden December morning, we followed Priya and Arjun through every ritual, every glance, every quiet moment that no staged shot could ever recreate. This is a film about presence. About the courage it takes to love fully, openly, and forever.",
    testimonial: {
      quote:
        "2soulfilms didn't just film our wedding — they captured what it felt like to be there. Every time we watch it, we cry the same happy tears.",
      name: "Priya & Arjun",
    },
    gradient: "from-[#1a1420] to-[#0B0F19]",
  },
  "meera-rohan-wedding": {
    title: "Meera & Rohan",
    location: "Puri, Odisha",
    duration: "6 min",
    category: "Wedding",
    tags: ["Traditional", "Documentary"],
    story:
      "With the sea breeze of Puri as witness, Meera and Rohan wove together two families, two worlds, one future. A documentary approach that honors every sacred ritual while finding the human moments within them.",
    gradient: "from-[#12181A] to-[#0B0F19]",
  },
  "anjali-vikram-pre-wedding": {
    title: "Anjali & Vikram",
    location: "Bhubaneswar",
    duration: "4 min",
    category: "Pre-Wedding",
    tags: ["Romantic", "Modern"],
    story:
      "Before the chaos of the wedding day, we carved out golden hours for Anjali and Vikram — just them, the city they grew up in, and the quiet electricity of two people deeply in love.",
    testimonial: {
      quote:
        "Sreeyam has a rare gift for being invisible while capturing everything. We forgot the camera was there.",
      name: "Anjali & Vikram",
    },
    gradient: "from-[#1A1A12] to-[#0B0F19]",
  },
  "sunita-raj-ceremony": {
    title: "Sunita & Raj",
    location: "Cuttack, Odisha",
    duration: "5 min",
    category: "Ceremony",
    tags: ["Traditional", "Cinematic"],
    story:
      "A ceremony edit that focuses purely on the sacred — the fire, the vows, the seven steps. Every ritual distilled into its most honest, beautiful form.",
    gradient: "from-[#1A1218] to-[#0B0F19]",
  },
  "sonal-deepak-wedding": {
    title: "Sonal & Deepak",
    location: "Rourkela, Odisha",
    duration: "10 min",
    category: "Wedding",
    tags: ["Romantic", "Documentary"],
    story:
      "Ten minutes across two days, three rituals, and one extraordinary love. Sonal and Deepak opened their wedding to us completely — and what emerged is one of our most honest films to date.",
    gradient: "from-[#12181A] to-[#1A1A12]",
  },
  "reel-1": {
    title: "Reel — Dec 2024",
    location: "Bhubaneswar",
    duration: "60 sec",
    category: "Reels",
    tags: ["Cinematic", "Highlights"],
    story: "A cinematic highlights reel capturing the emotion and beauty of a December wedding.",
    gradient: "from-[#1a1420] to-[#0B0F19]",
    instagramUrl: "https://www.instagram.com/reel/DVc5a49D1Oy/",
  },
  "reel-2": {
    title: "Reel — Nov 2024",
    location: "Odisha",
    duration: "60 sec",
    category: "Reels",
    tags: ["Romantic", "Modern"],
    story: "A romantic reel — love, laughter, and everything in between.",
    gradient: "from-[#12181A] to-[#0B0F19]",
    instagramUrl: "https://www.instagram.com/reel/DUxVV8ID1dz/",
  },
  "reel-3": {
    title: "Reel — Oct 2024",
    location: "Bhubaneswar",
    duration: "60 sec",
    category: "Reels",
    tags: ["Traditional", "Cinematic"],
    story: "Traditional rituals, modern storytelling. A sixty-second window into a timeless ceremony.",
    gradient: "from-[#1A1A12] to-[#0B0F19]",
    instagramUrl: "https://www.instagram.com/reel/DUdJXp8iW4h_VS05bfr40UftfLi94-iumcGrVw0/",
  },
  "reel-4": {
    title: "Reel — Sep 2024",
    location: "Cuttack",
    duration: "60 sec",
    category: "Reels",
    tags: ["Emotional", "Highlights"],
    story: "Pure emotion captured in sixty seconds. The moments that made everyone cry.",
    gradient: "from-[#1A1218] to-[#0B0F19]",
    instagramUrl: "https://www.instagram.com/reel/DTPVSwyDzR6/",
  },
  "reel-5": {
    title: "Reel — Aug 2024",
    location: "Odisha",
    duration: "60 sec",
    category: "Reels",
    tags: ["High Energy", "Modern"],
    story: "High energy. Pure joy. The kind of reel that makes you want to get married.",
    gradient: "from-[#1a1420] to-[#12181A]",
    instagramUrl: "https://www.instagram.com/reel/DQv7VqMjTpX/",
  },
};

export function generateStaticParams() {
  return Object.keys(films).map((slug) => ({ slug }));
}

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const film = films[slug];
  if (!film) notFound();

  const isReel = film.category === "Reels";
  const reelId = film.instagramUrl
    ? film.instagramUrl.replace("https://www.instagram.com/reel/", "").replace(/\/$/, "")
    : null;

  const related = Object.entries(films)
    .filter(([s, f]) => s !== slug && f.category === film.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />
      <main className="pt-20">
        {/* Video / Reel player area */}
        <div className="bg-[#0B0F19]">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Films
            </Link>

            {isReel && reelId ? (
              /* ── Instagram reel embed ── */
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-sm mx-auto">
                  <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-[#111520]" style={{ aspectRatio: "9/16" }}>
                    <iframe
                      src={`https://www.instagram.com/reel/${reelId}/embed/`}
                      className="w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency
                      allowFullScreen
                      title={film.title}
                    />
                  </div>
                </div>
                <a
                  href={film.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#CBB89E] hover:text-white transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>
                  View on Instagram
                </a>
              </div>
            ) : (
              /* ── Regular film player placeholder ── */
              <div
                className={`relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br ${film.gradient} mb-8`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/40 bg-[#0B0F19]/60 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform">
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <span className="text-white text-8xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    2souls
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-[#0B0F19]/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <MapPin className="h-3.5 w-3.5 text-[#CBB89E]" />
                  <span className="text-white text-sm">{film.location}</span>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-start justify-between gap-6 mt-8">
              <div>
                <h1
                  className="text-4xl sm:text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {film.title}
                </h1>
                <div className="flex items-center gap-5 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {film.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    {film.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {film.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#CBB89E]/10 text-[#CBB89E] border border-[#CBB89E]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Story + sidebar */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-[#E7D4C8] rounded-2xl p-8 mb-10">
                <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#CBB89E] mb-4">
                  {isReel ? "About This Reel" : "Their Love Story"}
                </p>
                <p
                  className="text-[#2F3A4B] leading-relaxed text-lg italic"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {film.story}
                </p>
              </div>

              {/* Related reels grid — all 5 embed thumbnails for reel pages */}
              {isReel && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#2F3A4B]/60 mb-5">
                    More Reels
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(films)
                      .filter(([s, f]) => s !== slug && f.category === "Reels" && f.instagramUrl)
                      .map(([relSlug, relFilm]) => {
                        const relReelId = relFilm.instagramUrl!
                          .replace("https://www.instagram.com/reel/", "")
                          .replace(/\/$/, "");
                        return (
                          <Link key={relSlug} href={`/films/${relSlug}`}>
                            <div className="rounded-xl overflow-hidden border border-[#E0D8CE] hover:border-[#CBB89E]/50 transition-colors bg-[#0B0F19]" style={{ aspectRatio: "9/16" }}>
                              <iframe
                                src={`https://www.instagram.com/reel/${relReelId}/embed/`}
                                className="w-full h-full pointer-events-none"
                                frameBorder="0"
                                scrolling="no"
                                allowTransparency
                                title={relFilm.title}
                              />
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Film stills (non-reel) */}
              {!isReel && (
                <>
                  <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#2F3A4B]/60 mb-5">
                    Film Stills
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xl aspect-square bg-gradient-to-br ${film.gradient} opacity-80`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {film.testimonial && (
                <div className="bg-white rounded-2xl p-6 border border-[#E0D8CE]">
                  <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#CBB89E] mb-4">
                    What They Said
                  </p>
                  <p
                    className="text-[#2F3A4B] italic text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    &ldquo;{film.testimonial.quote}&rdquo;
                  </p>
                  <p className="text-[#0B0F19] font-semibold text-sm">— {film.testimonial.name}</p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-[#0B0F19] rounded-2xl p-6 text-center">
                <p
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Let&apos;s tell your story too.
                </p>
                <p className="text-white/50 text-sm mb-5">
                  Dates fill up fast. Reach out early.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-3 rounded-lg text-sm font-semibold text-center bg-[#CBB89E] text-[#0B0F19] hover:bg-[#C0AB8E] transition-colors"
                >
                  Book Your Date
                </Link>
              </div>

              {/* Instagram follow */}
              {isReel && (
                <a
                  href="https://www.instagram.com/2soulfilms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-2xl p-5 border border-[#E0D8CE] hover:border-[#CBB89E]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B0F19] text-sm group-hover:text-[#CBB89E] transition-colors">
                      Follow on Instagram
                    </p>
                    <p className="text-xs text-[#9B9082]">@2soulfilms</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Related films (non-reel) */}
          {!isReel && related.length > 0 && (
            <div className="mt-16">
              <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#2F3A4B]/60 mb-6">
                Related Films
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(([relSlug, relFilm]) => (
                  <Link
                    key={relSlug}
                    href={`/films/${relSlug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-[#E0D8CE] hover:border-[#CBB89E]/50 transition-colors"
                  >
                    <div className={`aspect-video bg-gradient-to-br ${relFilm.gradient} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white/60" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p
                        className="font-semibold text-[#0B0F19] text-sm group-hover:text-[#CBB89E] transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {relFilm.title}
                      </p>
                      <p className="text-xs text-[#2F3A4B]/60 mt-1">{relFilm.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
