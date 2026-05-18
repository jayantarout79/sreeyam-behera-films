import InviteForm from "@/components/admin/InviteForm";

export default function NewInvitePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-2" style={{ color: "#CBB89E" }}>
          New Invite
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Create Wedding Invite
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Fill in the couple&apos;s details and upload photos to generate a shareable invite.
        </p>
      </div>
      <InviteForm />
    </div>
  );
}
