import { NextRequest } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const PUBLIC_DIR = path.join(process.cwd(), "public");

interface ComposePayload {
  slug: string;
  template: string;
  bride_name: string;
  groom_name: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  venue_name?: string;
  couple_story?: string;
  rsvp_phone?: string;
  rsvp_email?: string;
  photo_1_url?: string;
  primary_color?: string;
}

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body: ComposePayload = await req.json();
  const {
    slug,
    template,
    bride_name,
    groom_name,
    event_date,
    event_time,
    event_location,
    venue_name,
    couple_story,
    rsvp_phone,
    rsvp_email,
    photo_1_url,
    primary_color = "#C9A84C",
  } = body;

  const bgDir = path.join(PUBLIC_DIR, "invite-backgrounds", template);

  // Compose all 4 slides in parallel
  const [slide1, slide2, slide3, slide4] = await Promise.all([
    composeSlide1({ bgDir, bride_name, groom_name, photo_1_url, primary_color }),
    composeSlide2({ bgDir, event_date, event_time, event_location, venue_name, primary_color }),
    composeSlide3({ bgDir, bride_name, groom_name, couple_story, primary_color }),
    composeSlide4({ bgDir, bride_name, groom_name, rsvp_phone, rsvp_email, primary_color }),
  ]);

  // Upload composites to Supabase Storage
  const admin = createAdminClient();
  const uploadSlide = async (buf: Buffer, slideNum: number): Promise<string | null> => {
    const filePath = `invites/${slug}/slide-${slideNum}.png`;
    const { error } = await admin.storage
      .from("invite-slides")
      .upload(filePath, buf, { contentType: "image/png", upsert: true });
    if (error) {
      console.error(`[compose] upload slide ${slideNum}:`, error.message);
      return null;
    }
    const { data } = admin.storage.from("invite-slides").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const [url1, url2, url3, url4] = await Promise.all([
    uploadSlide(slide1, 1),
    uploadSlide(slide2, 2),
    uploadSlide(slide3, 3),
    uploadSlide(slide4, 4),
  ]);

  return Response.json({
    slides: {
      slide_1: url1,
      slide_2: url2,
      slide_3: url3,
      slide_4: url4,
    },
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────

async function loadBackground(bgDir: string, filename: string): Promise<sharp.Sharp> {
  const filePath = path.join(bgDir, filename);
  if (fs.existsSync(filePath)) {
    return sharp(filePath).resize(CANVAS_W, CANVAS_H, { fit: "cover" });
  }
  // Fallback: solid dark canvas
  return sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: { r: 11, g: 15, b: 25 } },
  });
}

async function fetchRemoteImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function svgText(
  lines: { text: string; y: number; fontSize: number; bold?: boolean; italic?: boolean; color?: string; opacity?: number }[],
  accentColor: string
): Buffer {
  const svgLines = lines.map(({ text, y, fontSize, bold, italic, color, opacity }) => {
    const fill = color ?? "#FFFFFF";
    const fontWeight = bold ? "bold" : "normal";
    const fontStyle = italic ? "italic" : "normal";
    const alpha = opacity !== undefined ? opacity : 1;
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    return `<text x="${CANVAS_W / 2}" y="${y}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${fill}" fill-opacity="${alpha}" text-anchor="middle">${escaped}</text>`;
  });

  return Buffer.from(
    `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>text { font-family: Georgia, Times, serif; }</style>
      </defs>
      ${svgLines.join("\n")}
    </svg>`
  );
}

async function composeSlide1({
  bgDir,
  bride_name,
  groom_name,
  photo_1_url,
  primary_color,
}: {
  bgDir: string;
  bride_name: string;
  groom_name: string;
  photo_1_url?: string;
  primary_color: string;
}): Promise<Buffer> {
  const bg = await loadBackground(bgDir, "slide-1-hero.png");
  const bgBuf = await bg.png().toBuffer();

  const composites: sharp.OverlayOptions[] = [];

  // Couple photo — top 60%
  if (photo_1_url) {
    const photoBuf = await fetchRemoteImage(photo_1_url);
    if (photoBuf) {
      const photoH = Math.round(CANVAS_H * 0.6);
      const resizedPhoto = await sharp(photoBuf)
        .resize(CANVAS_W, photoH, { fit: "cover" })
        .png()
        .toBuffer();
      composites.push({ input: resizedPhoto, top: 0, left: 0 });
    }
  }

  // Gradient overlay for text legibility
  const gradient = await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .png()
    .toBuffer();

  // Text overlay
  const nameY = Math.round(CANVAS_H * 0.72);
  const textSvg = svgText(
    [
      { text: "Together with their families", y: nameY - 80, fontSize: 36, opacity: 0.7, color: primary_color },
      { text: bride_name, y: nameY, fontSize: 96, bold: true, color: "#FFFFFF" },
      { text: "&", y: nameY + 100, fontSize: 72, italic: true, color: primary_color },
      { text: groom_name, y: nameY + 220, fontSize: 96, bold: true, color: "#FFFFFF" },
    ],
    primary_color
  );

  composites.push({ input: gradient, top: 0, left: 0, blend: "over" });
  composites.push({ input: textSvg, top: 0, left: 0 });

  return sharp(bgBuf).composite(composites).png().toBuffer();
}

async function composeSlide2({
  bgDir,
  event_date,
  event_time,
  event_location,
  venue_name,
  primary_color,
}: {
  bgDir: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  venue_name?: string;
  primary_color: string;
}): Promise<Buffer> {
  const bg = await loadBackground(bgDir, "slide-2-venue.png");
  const bgBuf = await bg.png().toBuffer();

  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = event_time
    ? new Date(`2000-01-01T${event_time}`).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  type TextLine = { text: string; y: number; fontSize: number; bold?: boolean; italic?: boolean; color?: string; opacity?: number };
  const centerY = CANVAS_H / 2;
  const lines: TextLine[] = [
    { text: "You Are Invited", y: centerY - 320, fontSize: 52, italic: true, color: primary_color },
    { text: "━━━━━━━━━━━━━━━━━", y: centerY - 230, fontSize: 28, color: primary_color, opacity: 0.4 },
  ];
  if (venue_name) lines.push({ text: venue_name, y: centerY - 140, fontSize: 72, bold: true, color: "#FFFFFF" });
  if (formattedDate) lines.push({ text: formattedDate, y: centerY - 20, fontSize: 44, color: "#FFFFFF", opacity: 0.9 });
  if (formattedTime) lines.push({ text: formattedTime, y: centerY + 80, fontSize: 52, bold: true, color: primary_color });
  if (event_location) lines.push({ text: event_location, y: centerY + 200, fontSize: 38, color: "#FFFFFF", opacity: 0.75 });

  const textSvg = svgText(lines, primary_color);
  return sharp(bgBuf).composite([{ input: textSvg, top: 0, left: 0 }]).png().toBuffer();
}

async function composeSlide3({
  bgDir,
  bride_name,
  groom_name,
  couple_story,
  primary_color,
}: {
  bgDir: string;
  bride_name: string;
  groom_name: string;
  couple_story?: string;
  primary_color: string;
}): Promise<Buffer> {
  const bg = await loadBackground(bgDir, "slide-3-story.png");
  const bgBuf = await bg.png().toBuffer();

  const centerY = CANVAS_H / 2;
  const lines: Parameters<typeof svgText>[0] = [
    { text: "Our Story", y: centerY - 300, fontSize: 52, italic: true, color: primary_color },
    { text: `${bride_name} & ${groom_name}`, y: centerY - 180, fontSize: 72, bold: true, color: "#FFFFFF" },
    { text: "━━━━━━━━━━━━━━━━━", y: centerY - 80, fontSize: 28, color: primary_color, opacity: 0.4 },
  ];

  if (couple_story) {
    // Word-wrap into 2 lines of ~45 chars each
    const words = couple_story.split(" ");
    const line1: string[] = [];
    const line2: string[] = [];
    let charCount = 0;
    for (const word of words) {
      if (charCount + word.length < 42) {
        line1.push(word);
        charCount += word.length + 1;
      } else {
        line2.push(word);
      }
    }
    if (line1.length > 0) lines.push({ text: line1.join(" "), y: centerY + 40, fontSize: 38, italic: true, color: "#FFFFFF", opacity: 0.85 });
    if (line2.length > 0) lines.push({ text: line2.join(" "), y: centerY + 100, fontSize: 38, italic: true, color: "#FFFFFF", opacity: 0.85 });
  }

  const textSvg = svgText(lines, primary_color);
  return sharp(bgBuf).composite([{ input: textSvg, top: 0, left: 0 }]).png().toBuffer();
}

async function composeSlide4({
  bgDir,
  bride_name,
  groom_name,
  rsvp_phone,
  rsvp_email,
  primary_color,
}: {
  bgDir: string;
  bride_name: string;
  groom_name: string;
  rsvp_phone?: string;
  rsvp_email?: string;
  primary_color: string;
}): Promise<Buffer> {
  const bg = await loadBackground(bgDir, "slide-4-closing.png");
  const bgBuf = await bg.png().toBuffer();

  const centerY = CANVAS_H / 2;
  const lines: Parameters<typeof svgText>[0] = [
    { text: "We can't wait", y: centerY - 200, fontSize: 80, bold: true, color: "#FFFFFF" },
    { text: "to celebrate with you.", y: centerY - 80, fontSize: 56, italic: true, color: "#FFFFFF", opacity: 0.85 },
    { text: "━━━━━━━━━━━━━━━━━", y: centerY + 40, fontSize: 28, color: primary_color, opacity: 0.4 },
    { text: `${bride_name} & ${groom_name}`, y: centerY + 140, fontSize: 48, italic: true, color: primary_color },
  ];

  if (rsvp_phone || rsvp_email) {
    lines.push({ text: "RSVP", y: centerY + 300, fontSize: 36, color: primary_color, opacity: 0.7 });
  }
  if (rsvp_phone) {
    lines.push({ text: rsvp_phone, y: centerY + 380, fontSize: 44, bold: true, color: "#FFFFFF" });
  }
  if (rsvp_email) {
    lines.push({ text: rsvp_email, y: centerY + 460, fontSize: 36, color: "#FFFFFF", opacity: 0.75 });
  }

  lines.push({ text: "2soulfilms · Sreeyam Behera", y: CANVAS_H - 80, fontSize: 32, color: primary_color, opacity: 0.5 });

  const textSvg = svgText(lines, primary_color);
  return sharp(bgBuf).composite([{ input: textSvg, top: 0, left: 0 }]).png().toBuffer();
}
