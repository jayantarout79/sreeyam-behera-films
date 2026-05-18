"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "This magic link has expired. Links are valid for 60 minutes — please request a new one.",
  otp_disabled: "Magic link sign-in is currently disabled. Contact support.",
  access_denied: "Sign-in was denied. Please request a new link.",
  auth_failed: "Sign-in failed. Please try again.",
};

import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.auth_failed) : null;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createClient();

    // Use the explicit app URL env var in production, fall back to current origin for local dev
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to send magic link. Please try again.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-full" style={{ background: "var(--gold)" }}>
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1
            className="text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sreeyam Behera
            <span className="block text-gold">Films</span>
          </h1>
          <p className="text-white/70 text-lg max-w-sm mx-auto leading-relaxed">
            Capturing love stories through timeless photography and cinematic moments.
          </p>
          <div className="mt-10 gold-divider" />
          <p className="mt-8 text-white/50 text-sm italic">
            "Every frame tells a story."
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="p-2 rounded-full bg-charcoal">
              <Camera className="h-5 w-5 text-gold" />
            </div>
            <span
              className="text-xl font-bold text-charcoal"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sreeyam Behera Films
            </span>
          </div>

          {!sent ? (
            <>
              <h2
                className="text-3xl font-bold text-charcoal mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Admin Access
              </h2>
              <p className="text-muted-foreground mb-8">
                Enter your email to receive a magic link.
              </p>

              {errorMessage && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 leading-snug">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-charcoal font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 border-border focus:border-gold focus:ring-gold"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-medium text-white"
                  style={{ background: "var(--charcoal)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send magic link
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Only authorized photographers can access the admin panel.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
                <Mail className="h-8 w-8 text-gold" />
              </div>
              <h2
                className="text-2xl font-bold text-charcoal mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Check your inbox
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We sent a magic link to{" "}
                <span className="font-medium text-charcoal">{email}</span>.
                Click it to sign in.
              </p>
              <Button
                variant="ghost"
                onClick={() => setSent(false)}
                className="text-muted-foreground"
              >
                Use a different email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
