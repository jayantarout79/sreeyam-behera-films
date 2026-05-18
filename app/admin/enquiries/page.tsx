import { createAdminClient } from "@/lib/supabase/admin";
import { Mail, Phone, MapPin, Calendar, Film, MessageSquare, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  location: string | null;
  service_type: string | null;
  message: string;
  created_at: string;
};

export default async function EnquiriesPage() {
  const supabase = createAdminClient();
  const { data: enquiries, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (enquiries ?? []) as Enquiry[];

  const thisMonth = list.filter((e) => {
    const d = new Date(e.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-2" style={{ color: "#CBB89E" }}>
          Enquiries
        </p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Booking Requests
        </h1>
        <p className="text-white/40 text-sm mt-1">
          All enquiries submitted via the Book Your Date form
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Enquiries",  value: list.length },
          { label: "This Month",       value: thisMonth },
          { label: "Wedding Films",    value: list.filter((e) => e.service_type?.toLowerCase().includes("wedding")).length },
          { label: "With Event Dates", value: list.filter((e) => e.event_date).length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs text-white/40 mb-2">{label}</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div
          className="p-4 rounded-xl text-sm mb-6"
          style={{ background: "rgba(224,85,85,0.1)", color: "#E05555", border: "1px solid rgba(224,85,85,0.2)" }}
        >
          Failed to load enquiries. Please refresh.
        </div>
      )}

      {!error && list.length === 0 && (
        <div
          className="text-center py-20 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <MessageSquare className="h-10 w-10 text-white/15 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            No enquiries yet
          </h3>
          <p className="text-white/35 text-sm">Enquiries submitted via the website will appear here.</p>
        </div>
      )}

      {list.length > 0 && (
        <div className="space-y-4">
          {list.map((enq) => (
            <div
              key={enq.id}
              className="rounded-2xl p-6 transition-colors"
              style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  {/* Name + badge */}
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h2
                      className="text-base font-bold text-white"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {enq.name}
                    </h2>
                    {enq.service_type && (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{ background: "rgba(203,184,158,0.1)", color: "#CBB89E", border: "1px solid rgba(203,184,158,0.2)" }}
                      >
                        <Film className="h-3 w-3" />
                        {enq.service_type}
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/45 mb-4">
                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" style={{ color: "#CBB89E" }} />
                      {enq.email}
                    </a>
                    {enq.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" style={{ color: "#CBB89E" }} />
                        {enq.phone}
                      </span>
                    )}
                    {enq.event_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" style={{ color: "#CBB89E" }} />
                        {enq.event_date}
                      </span>
                    )}
                    {enq.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" style={{ color: "#CBB89E" }} />
                        {enq.location}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <p
                    className="text-sm text-white/55 leading-relaxed px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {enq.message}
                  </p>
                </div>

                {/* Right: timestamp */}
                <div className="flex items-center gap-1.5 text-xs text-white/25 whitespace-nowrap flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {new Date(enq.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                  {" · "}
                  {new Date(enq.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
