"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DeleteInviteButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/invites/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Invite deleted");
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete invite");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            className="p-2 rounded-lg transition-colors text-white/30 hover:text-red-400 hover:bg-red-500/10"
            aria-label="Delete invite"
          />
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent
        className="rounded-2xl border-0 p-0 overflow-hidden"
        style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Delete invite?
            </DialogTitle>
            <DialogDescription className="text-white/45 text-sm mt-2">
              This will permanently delete the invite and its link. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter
          className="px-6 pb-6 flex gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "#C0392B" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
