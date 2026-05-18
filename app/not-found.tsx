import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p
          className="text-8xl font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)", color: "#CBB89E" }}
        >
          404
        </p>
        <h1
          className="text-2xl font-bold text-[#0B0F19] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Page not found
        </h1>
        <p className="text-[#2F3A4B] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-[#CBB89E] text-[#0B0F19] hover:bg-[#C0AB8E] transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
