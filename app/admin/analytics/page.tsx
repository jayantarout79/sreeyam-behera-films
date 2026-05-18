import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Eye, TrendingUp, Heart, Calendar, Film } from "lucide-react";
import type { WeddingInvite } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: rawInvites } = await admin
    .from("wedding_invites")
    .select("*")
    .eq("created_by", user!.id)
    .order("view_count", { ascending: false });

  const invites = (rawInvites ?? []) as unknown as WeddingInvite[];

  const totalViews = invites.reduce((s, i) => s + (i.view_count ?? 0), 0);
  const topInvite = invites[0] ?? null;
  const thisMonth = invites.filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const monthMap: Record<string, { invites: number; views: number }> = {};
  for (const inv of invites) {
    const key = new Date(inv.created_at).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    if (!monthMap[key]) monthMap[key] = { invites: 0, views: 0 };
    monthMap[key].invites++;
    monthMap[key].views += inv.view_count ?? 0;
  }
  const months = Object.entries(monthMap).slice(-6).reverse();
  const maxViews = Math.max(...months.map(([, v]) => v.views), 1);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-2" style={{ color: "#CBB89E" }}>
          Performance
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Analytics
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Film}      label="Total Invites" value={invites.length} />
        <StatCard icon={Eye}       label="Total Views"   value={totalViews} />
        <StatCard icon={Calendar}  label="This Month"    value={thisMonth} />
        <StatCard
          icon={TrendingUp}
          label="Avg Views"
          value={invites.length ? Math.round(totalViews / invites.length) : 0}
        />
      </div>

      {/* Bar chart */}
      {months.length > 0 && (
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-sm font-semibold text-white mb-6">Views by Month</p>
          <div className="flex items-end gap-3 h-40">
            {months.map(([month, { views }]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-white/35 font-mono">{views}</span>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.max((views / maxViews) * 120, 4)}px`,
                    background: "#CBB89E",
                    opacity: 0.85,
                  }}
                />
                <span className="text-xs text-white/35 whitespace-nowrap">{month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top invite */}
      {topInvite && (
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-sm font-semibold text-white mb-5">Most Viewed Invite</p>
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {topInvite.bride_name} &amp; {topInvite.groom_name}
              </p>
              <p className="text-white/45 text-sm mt-1">
                {new Date(topInvite.event_date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
                {topInvite.event_location && ` · ${topInvite.event_location}`}
              </p>
              <p className="text-xs font-mono text-white/25 mt-1">
                /invites/{topInvite.unique_slug}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "#CBB89E" }}
              >
                {topInvite.view_count ?? 0}
              </p>
              <p className="text-xs text-white/35">views</p>
            </div>
          </div>
        </div>
      )}

      {/* All invites ranked */}
      {invites.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm font-semibold text-white">All Invites by Views</p>
          </div>
          <div>
            {invites.map((inv, idx) => {
              const pct = totalViews > 0 ? ((inv.view_count ?? 0) / totalViews) * 100 : 0;
              return (
                <div
                  key={inv.id}
                  className="px-6 py-4"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white/25 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {inv.bride_name} &amp; {inv.groom_name}
                        </p>
                        <p className="text-xs text-white/35">
                          {new Date(inv.event_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-white/60">
                      <Eye className="h-3.5 w-3.5 text-white/30" />
                      {inv.view_count ?? 0}
                    </div>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden ml-8" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: "#CBB89E" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {invites.length === 0 && (
        <div className="text-center py-16 text-white/30 text-sm">
          No invites yet. Create your first invite to see analytics here.
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg" style={{ background: "rgba(203,184,158,0.1)" }}>
          <Icon className="h-4 w-4" style={{ color: "#CBB89E" }} />
        </div>
        <p className="text-xs text-white/45 font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
