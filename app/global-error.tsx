"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background: "#FAF7F2",
          padding: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1C1C1E", marginBottom: "0.75rem" }}>
            Critical error
          </h1>
          <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
            The application encountered a critical error. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1C1C1E",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
