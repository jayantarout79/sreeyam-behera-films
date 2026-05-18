import Link from "next/link";
import { Heart } from "lucide-react";

export default function InviteNotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Heart
          className="mx-auto mb-6 h-12 w-12 text-rose opacity-40"
          fill="currentColor"
        />
        <h1
          className="text-4xl font-bold text-charcoal mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Invite Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          This invite link may have expired or been removed. Please check with
          the photographer who shared it with you.
        </p>
        <Link
          href="/"
          className="text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-charcoal transition-colors"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
