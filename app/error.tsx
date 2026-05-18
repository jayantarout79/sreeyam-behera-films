"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1
          className="text-2xl font-bold text-charcoal mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          An unexpected error occurred. Please try again, or contact us if the
          problem persists.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="text-white"
            style={{ background: "var(--charcoal)" }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
