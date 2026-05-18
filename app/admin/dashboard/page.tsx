import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle, Eye, ExternalLink, Heart, Film, Users, TrendingUp } from "lucide-react";
import DeleteInviteButton from "@/components/admin/DeleteInviteButton";
import type { WeddingInvite } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawInvites, error } = await supabase
    .from("wedding_invites")
    .select("*")
    .eq("created_by", user!.id)
    .order("created_at", { ascending: false });

  const invites = (rawInvites ?? []) as unknown as WeddingInvite[];
  const totalViews = invites.reduce((sum, inv) => sum + (inv.view_count ?? 0), 0);
  const thisMonth = invites.filter((inv) => {
    const d = new Date(inv.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-2" style={{ color: "#CBB89E" }}>
            Overview
          </p>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/invites/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
          style={{ background: "#CBB89E", color: "#0B0F19" }}
        >
          <PlusCircle className="h-4 w-4" />
          Create Invite
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Film} label="Total Invites" value={invites.length} />
        <StatCard icon={Eye} label="Total Views" value={totalViews} />
        <StatCard icon={TrendingUp} label="This Month" value={thisMonth} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/30">Wedding Invites</p>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm mb-6" style={{ background: "rgba(224,85,85,0.1)", color: "#E05555", border: "1px solid rgba(224,85,85,0.2)" }}>
          Failed to load invites. Please refresh.
        </div>
      )}

      {!error && invites.length === 0 && (
        <div
          className="text-center py-20 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Heart className="h-10 w-10 mx-auto mb-4 opacity-20 text-white" />
          <h3
            className="text-lg font-semibold text-white mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No invites yet
          </h3>
          <p className="text-white/40 text-sm mb-6">Create your first wedding invite to share with couples.</p>
          <Link
            href="/admin/invites/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#CBB89E", color: "#0B0F19" }}
          >
            <PlusCircle className="h-4 w-4" />
            Create first invite
          </Link>
        </div>
      )}

      {invites.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full text-sm">
            <thead style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white/35">Couple</th>
                <th className="text-left px-6 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white/35">Event Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white/35">Views</th>
                <th className="text-left px-6 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white/35">Created</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {invites.map((invite, i) => (
                <tr
                  key={invite.id}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p
                      className="font-semibold text-white text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {invite.bride_name} &amp; {invite.groom_name}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5 font-mono">
                      /invites/{invite.unique_slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {new Date(invite.event_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(203,184,158,0.1)", color: "#CBB89E", border: "1px solid rgba(203,184,158,0.2)" }}
                    >
                      <Eye className="h-3 w-3" />
                      {invite.view_count ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/35 text-xs">
                    {new Date(invite.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/invites/${invite.unique_slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <DeleteInviteButton id={invite.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(203,184,158,0.1)" }}>
          <Icon className="h-4 w-4" style={{ color: "#CBB89E" }} />
        </div>
        <p className="text-xs font-medium text-white/45">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
