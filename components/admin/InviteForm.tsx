"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteSchema, type InviteFormValues } from "@/lib/validators/invite";
import { toast } from "sonner";
import { X, Loader2, Check, ImagePlus, Phone, Mail, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import TemplateSelector, { TEMPLATES, type TemplateConfig } from "./TemplateSelector";
import CanvasPreview from "./CanvasPreview";

interface PhotoPreview { file: File; url: string; }

function validatePhoto(file: File): string | null {
  if (file.size > 5 * 1024 * 1024) return "Photo must be under 5 MB";
  if (!file.type.startsWith("image/")) return "File must be an image";
  return null;
}

const inputClass =
  "w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all outline-none focus:ring-0";
const inputStyle = { background: "#1A1F2E", border: "1px solid rgba(255,255,255,0.1)" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/50">{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "#E05555" }}>{error}</p>}
    </div>
  );
}

const section = "rounded-2xl p-6 space-y-5";
const sectionStyle = { background: "#111520", border: "1px solid rgba(255,255,255,0.07)" };
const sectionTitle = "text-sm font-semibold text-white mb-1";

export default function InviteForm() {
  const router = useRouter();
  const [photo1, setPhoto1] = useState<PhotoPreview | null>(null);
  const [photo2, setPhoto2] = useState<PhotoPreview | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const photo1Ref = useRef<HTMLInputElement>(null);
  const photo2Ref = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { template_id: TEMPLATES[0].id },
  });

  const brideName = useWatch({ control, name: "bride_name", defaultValue: "" });
  const groomName = useWatch({ control, name: "groom_name", defaultValue: "" });

  const setPhoto = useCallback((file: File, setter: (v: PhotoPreview | null) => void) => {
    const err = validatePhoto(file);
    if (err) { toast.error(err); return; }
    setter({ file, url: URL.createObjectURL(file) });
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>, setter: (v: PhotoPreview | null) => void) {
    const file = e.target.files?.[0];
    if (file) setPhoto(file, setter);
  }

  async function uploadPhoto(file: File, slug: string, index: number): Promise<string | null> {
    const form = new FormData();
    form.append("file", file);
    form.append("slug", slug);
    form.append("index", String(index));
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Upload failed");
      return null;
    }
    return (await res.json()).url as string;
  }

  async function onSubmit(values: InviteFormValues) {
    setUploading(true);
    const slug = Array.from(crypto.getRandomValues(new Uint8Array(6)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    let photo1Url: string | null = null;
    let photo2Url: string | null = null;

    if (photo1) {
      photo1Url = await uploadPhoto(photo1.file, slug, 1);
      if (!photo1Url) { setUploading(false); return; }
    }
    if (photo2) {
      photo2Url = await uploadPhoto(photo2.file, slug, 2);
      if (!photo2Url) { setUploading(false); return; }
    }
    setUploading(false);

    // Trigger server-side image composition
    toast.loading("Generating invite slides…", { id: "compose" });
    const composeRes = await fetch("/api/compose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        template: selectedTemplate.bgFolder,
        bride_name: values.bride_name,
        groom_name: values.groom_name,
        event_date: values.event_date,
        event_time: values.event_time,
        event_location: values.event_location,
        venue_name: values.venue_name,
        couple_story: values.couple_story,
        rsvp_phone: values.rsvp_phone,
        rsvp_email: values.rsvp_email,
        photo_1_url: photo1Url,
        primary_color: selectedTemplate.palette.primary,
      }),
    });
    toast.dismiss("compose");

    const composeData = composeRes.ok ? await composeRes.json() : {};
    const slides = composeData?.slides ?? {};

    // Save invite to database
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        unique_slug: slug,
        template_id: selectedTemplate.id,
        photo_1_url: photo1Url,
        photo_2_url: photo2Url,
        slide_1_url: slides.slide_1 ?? null,
        slide_2_url: slides.slide_2 ?? null,
        slide_3_url: slides.slide_3 ?? null,
        slide_4_url: slides.slide_4 ?? null,
        rsvp_info: values.rsvp_phone || values.rsvp_email
          ? { phone: values.rsvp_phone ?? null, email: values.rsvp_email ?? null }
          : null,
        custom_colors: selectedTemplate.palette,
      }),
    });

    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Failed to create invite"); return; }

    toast.success("Invite created! Shareable link is ready.");
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Template selector */}
      <div className={section} style={sectionStyle}>
        <div>
          <p className={sectionTitle}>Choose Template</p>
          <p className="text-xs text-white/35 mt-0.5">
            6 visual styles, each with 4 unique backgrounds (one per slide).
          </p>
        </div>
        <TemplateSelector
          selectedId={selectedTemplate.id}
          onChange={(tpl) => setSelectedTemplate(tpl)}
        />
      </div>

      {/* Couple details */}
      <div className={section} style={sectionStyle}>
        <p className={sectionTitle}>Couple Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Bride's Name *" error={errors.bride_name?.message}>
            <input
              placeholder="e.g. Priya Sharma"
              className={inputClass}
              style={inputStyle}
              {...register("bride_name")}
            />
          </Field>
          <Field label="Groom's Name *" error={errors.groom_name?.message}>
            <input
              placeholder="e.g. Rahul Verma"
              className={inputClass}
              style={inputStyle}
              {...register("groom_name")}
            />
          </Field>
        </div>
      </div>

      {/* Event details */}
      <div className={section} style={sectionStyle}>
        <p className={sectionTitle}>Event Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Wedding Date *" error={errors.event_date?.message}>
            <input
              type="date"
              className={inputClass}
              style={{ ...inputStyle, colorScheme: "dark" }}
              {...register("event_date")}
            />
          </Field>
          <Field label="Ceremony Time">
            <input
              type="time"
              className={inputClass}
              style={{ ...inputStyle, colorScheme: "dark" }}
              {...register("event_time")}
            />
          </Field>
        </div>
        <Field label="Venue Name">
          <input
            placeholder="e.g. The Grand Hyatt Ballroom"
            className={inputClass}
            style={inputStyle}
            {...register("venue_name")}
          />
        </Field>
        <Field label="Full Address / Location">
          <input
            placeholder="e.g. Banjara Hills, Hyderabad, Telangana"
            className={inputClass}
            style={inputStyle}
            {...register("event_location")}
          />
        </Field>
        <Field label="Their Story (optional · max 200 chars)">
          <textarea
            placeholder="A short note about the couple's journey together…"
            rows={3}
            maxLength={200}
            className={cn(inputClass, "resize-none")}
            style={inputStyle}
            {...register("couple_story")}
          />
        </Field>
      </div>

      {/* RSVP Info */}
      <div className={section} style={sectionStyle}>
        <div>
          <p className={sectionTitle}>RSVP Information</p>
          <p className="text-xs text-white/35 mt-0.5">Shown on Slide 4 of the invite.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="RSVP Phone" error={errors.rsvp_phone?.message}>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
              <input
                placeholder="+91 98765 43210"
                className={cn(inputClass, "pl-9")}
                style={inputStyle}
                {...register("rsvp_phone")}
              />
            </div>
          </Field>
          <Field label="RSVP Email" error={errors.rsvp_email?.message}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
              <input
                placeholder="couple@example.com"
                className={cn(inputClass, "pl-9")}
                style={inputStyle}
                {...register("rsvp_email")}
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Photos */}
      <div className={section} style={sectionStyle}>
        <div>
          <p className={sectionTitle}>Couple Photos</p>
          <p className="text-xs text-white/35 mt-0.5">
            Photo 1 → Slide 1 (hero). Photo 2 → Slide 3 (story). Portrait orientation recommended.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PhotoUpload
            label="Slide 1 Photo"
            preview={photo1}
            inputRef={photo1Ref}
            onChange={(e) => handlePhotoChange(e, setPhoto1)}
            onDrop={(file) => setPhoto(file, setPhoto1)}
            onRemove={() => setPhoto1(null)}
          />
          <PhotoUpload
            label="Slide 3 Photo"
            preview={photo2}
            inputRef={photo2Ref}
            onChange={(e) => handlePhotoChange(e, setPhoto2)}
            onDrop={(file) => setPhoto(file, setPhoto2)}
            onRemove={() => setPhoto2(null)}
          />
        </div>
      </div>

      {/* Canvas preview */}
      <div className={section} style={sectionStyle}>
        <div className="flex items-center justify-between">
          <div>
            <p className={sectionTitle}>Slide 1 Live Preview</p>
            <p className="text-xs text-white/35 mt-0.5">
              Canvas preview updates as you type names and choose a template.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: showPreview ? "rgba(203,184,158,0.15)" : "rgba(255,255,255,0.05)",
              color: showPreview ? "#CBB89E" : "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>
        {showPreview && (
          <div className="flex justify-center pt-2">
            <CanvasPreview
              photoUrl={photo1?.url ?? null}
              brideName={brideName ?? ""}
              groomName={groomName ?? ""}
              templateFolder={selectedTemplate.bgFolder}
              primaryColor={selectedTemplate.palette.primary}
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full h-12 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: "#CBB89E", color: "#0B0F19" }}
      >
        {isSubmitting || uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {uploading ? "Uploading photos…" : "Creating invite & compositing slides…"}
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            Create Invite
          </>
        )}
      </button>
    </form>
  );
}

interface PhotoUploadProps {
  label: string;
  preview: PhotoPreview | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (file: File) => void;
  onRemove: () => void;
}

function PhotoUpload({ label, preview, inputRef, onChange, onDrop, onRemove }: PhotoUploadProps) {
  const [dragging, setDragging] = useState(false);

  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function handleDragLeave() { setDragging(false); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onDrop(file);
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/50">{label}</label>
      <div
        className="relative rounded-xl overflow-hidden transition-all"
        style={{
          aspectRatio: "3/4",
          border: dragging
            ? "2px dashed #CBB89E"
            : preview
            ? "2px solid rgba(255,255,255,0.1)"
            : "2px dashed rgba(255,255,255,0.1)",
          background: dragging ? "rgba(203,184,158,0.05)" : "rgba(255,255,255,0.02)",
          transform: dragging ? "scale(1.01)" : "scale(1)",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <img src={preview.url} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 rounded-full p-1 text-white"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ color: dragging ? "#CBB89E" : "rgba(255,255,255,0.3)" }}
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs font-medium">{dragging ? "Drop to upload" : "Click or drag photo"}</span>
            <span className="text-xs opacity-60">JPG, PNG · Max 5 MB</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      </div>
    </div>
  );
}
