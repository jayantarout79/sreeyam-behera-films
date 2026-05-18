"use client";

import { Check } from "lucide-react";

export interface TemplateConfig {
  id: number;
  name: string;
  slug: string;
  description: string;
  accentColor: string;
  palette: { primary: string; secondary: string; accent: string };
  bgFolder: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 1,
    name: "Romantic Elegant",
    slug: "template-1-romantic-elegant",
    description: "Soft florals, gold accents, timeless romance",
    accentColor: "#C9A84C",
    palette: { primary: "#C9A84C", secondary: "#FAF7F2", accent: "#1C1C1E" },
    bgFolder: "template-1-romantic-elegant",
  },
  {
    id: 2,
    name: "Modern Cinematic",
    slug: "template-2-modern-cinematic",
    description: "Bold geometry, dramatic contrast, editorial feel",
    accentColor: "#CBB89E",
    palette: { primary: "#CBB89E", secondary: "#0B0F19", accent: "#F8F4EE" },
    bgFolder: "template-2-modern-cinematic",
  },
  {
    id: 3,
    name: "Minimalist Blush",
    slug: "template-3-minimalist-blush",
    description: "Airy whites, soft blush, ultra-clean typography",
    accentColor: "#E7D4C8",
    palette: { primary: "#C0737A", secondary: "#F9EDEF", accent: "#2C2C2E" },
    bgFolder: "template-3-minimalist-blush",
  },
  {
    id: 4,
    name: "Vintage Romantic",
    slug: "template-4-vintage-romantic",
    description: "Botanical sketches, warm sepia, heritage charm",
    accentColor: "#B5956A",
    palette: { primary: "#B5956A", secondary: "#F5EDE0", accent: "#3B2A1A" },
    bgFolder: "template-4-vintage-romantic",
  },
  {
    id: 5,
    name: "Bold Geometric",
    slug: "template-5-bold-geometric",
    description: "Sharp lines, strong contrast, contemporary luxury",
    accentColor: "#1A3461",
    palette: { primary: "#1A3461", secondary: "#F5E8C0", accent: "#C9A84C" },
    bgFolder: "template-5-bold-geometric",
  },
  {
    id: 6,
    name: "Nature Inspired",
    slug: "template-6-nature-inspired",
    description: "Lush greenery, organic textures, earthy serenity",
    accentColor: "#7C9E7C",
    palette: { primary: "#7C9E7C", secondary: "#F0F4F0", accent: "#1C1C1E" },
    bgFolder: "template-6-nature-inspired",
  },
];

const SLIDE_LABELS = ["Hero", "Venue", "Story", "Closing"];

interface TemplateSelectorProps {
  selectedId: number;
  onChange: (template: TemplateConfig) => void;
}

export default function TemplateSelector({ selectedId, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {TEMPLATES.map((tpl) => {
        const isSelected = selectedId === tpl.id;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onChange(tpl)}
            className="relative rounded-2xl overflow-hidden text-left transition-all group"
            style={{
              border: isSelected
                ? "2px solid #CBB89E"
                : "2px solid rgba(255,255,255,0.08)",
              background: "#111520",
            }}
          >
            {/* Slide thumbnail strip */}
            <div className="grid grid-cols-4 gap-0.5 p-2">
              {SLIDE_LABELS.map((label, i) => (
                <SlideThumb
                  key={label}
                  folder={tpl.bgFolder}
                  slideIndex={i + 1}
                  accentColor={tpl.accentColor}
                  label={label}
                />
              ))}
            </div>

            {/* Info */}
            <div className="px-3 pb-3">
              <p className="text-sm font-semibold text-white leading-tight">{tpl.name}</p>
              <p className="text-xs text-white/40 mt-0.5 leading-snug">{tpl.description}</p>
            </div>

            {/* Color palette dots */}
            <div className="px-3 pb-3 flex gap-1.5">
              {Object.values(tpl.palette).map((c) => (
                <div
                  key={c}
                  className="h-3 w-3 rounded-full"
                  style={{ background: c, border: "1px solid rgba(255,255,255,0.15)" }}
                />
              ))}
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <span
                className="absolute top-2 right-2 rounded-full p-0.5"
                style={{ background: "#CBB89E", color: "#0B0F19" }}
              >
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SlideThumb({
  folder,
  slideIndex,
  accentColor,
  label,
}: {
  folder: string;
  slideIndex: number;
  accentColor: string;
  label: string;
}) {
  const slideFiles = ["slide-1-hero", "slide-2-venue", "slide-3-story", "slide-4-closing"];
  const imagePath = `/invite-backgrounds/${folder}/${slideFiles[slideIndex - 1]}.png`;

  return (
    <div
      className="relative rounded overflow-hidden flex items-center justify-center"
      style={{ aspectRatio: "9/16", background: "rgba(255,255,255,0.04)" }}
    >
      {/* Background image — falls back to color swatch if image not yet generated */}
      <img
        src={imagePath}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Fallback color swatch */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: accentColor }}
      />
      <span className="relative text-[6px] font-medium text-white/60 z-10">{label}</span>
    </div>
  );
}
