"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Camera, LayoutDashboard, PlusCircle, LogOut, Heart, BarChart2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/invites/new", label: "Create Invite", icon: PlusCircle },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "#080C15" }}>
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-full flex-shrink-0"
            style={{ background: "rgba(203,184,158,0.12)" }}
          >
            <Camera className="h-5 w-5" style={{ color: "#CBB89E" }} />
          </div>
          <div>
            <p
              className="font-bold text-sm leading-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#CBB89E" }}
            >
              2soulfilms
            </p>
            <p className="text-xs text-white/30">Admin Studio</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                isActive
                  ? "text-[#CBB89E]"
                  : "text-white/45 hover:text-white hover:bg-white/[0.05]"
              )}
              style={
                isActive
                  ? { background: "rgba(203,184,158,0.08)" }
                  : {}
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                  style={{ background: "#CBB89E" }}
                />
              )}
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 pb-6 border-t border-white/[0.07] pt-4 space-y-3">
        <div className="px-3">
          <p className="text-xs text-white/40 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/45 hover:bg-white/[0.05] hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        <div className="px-3">
          <p className="text-xs text-white/20 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-400 inline mx-0.5" /> by Yuktra AI
          </p>
        </div>
      </div>
    </aside>
  );
}
