"use client";

import { useEffect, useRef } from "react";

interface CanvasPreviewProps {
  photoUrl: string | null;
  brideName: string;
  groomName: string;
  templateFolder: string;
  primaryColor: string;
}

const CANVAS_W = 270;
const CANVAS_H = 480; // 9:16

export default function CanvasPreview({
  photoUrl,
  brideName,
  groomName,
  templateFolder,
  primaryColor,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    async function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background — try template background image first
      const bgPath = `/invite-backgrounds/${templateFolder}/slide-1-hero.png`;
      await drawImage(ctx, bgPath, 0, 0, CANVAS_W, CANVAS_H).catch(() => {
        // Fallback: dark gradient
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        grad.addColorStop(0, "#0B0F19");
        grad.addColorStop(1, "#1A1F2E");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      });

      if (cancelled) return;

      // Couple photo — top 60% of canvas
      const photoAreaH = Math.round(CANVAS_H * 0.6);
      if (photoUrl) {
        await drawImage(ctx, photoUrl, 0, 0, CANVAS_W, photoAreaH, true).catch(() => {});
        // Gradient overlay to blend photo into bottom text area
        const overlay = ctx.createLinearGradient(0, photoAreaH * 0.5, 0, CANVAS_H);
        overlay.addColorStop(0, "rgba(0,0,0,0)");
        overlay.addColorStop(1, "rgba(0,0,0,0.85)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      } else {
        // Subtle pattern if no photo
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        for (let x = 0; x < CANVAS_W; x += 20) {
          for (let y = 0; y < photoAreaH; y += 20) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      if (cancelled) return;

      // Divider line
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W * 0.2, CANVAS_H * 0.68);
      ctx.lineTo(CANVAS_W * 0.8, CANVAS_H * 0.68);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Names
      const nameY = CANVAS_H * 0.73;
      const nameSize = 22;
      ctx.textAlign = "center";

      ctx.font = `bold ${nameSize}px Georgia, serif`;
      ctx.fillStyle = brideName ? "#ffffff" : "rgba(255,255,255,0.2)";
      ctx.fillText(brideName || "Bride's Name", CANVAS_W / 2, nameY);

      // Ampersand
      ctx.font = `italic ${nameSize * 0.65}px Georgia, serif`;
      ctx.fillStyle = primaryColor;
      ctx.fillText("&", CANVAS_W / 2, nameY + nameSize * 1.1);

      ctx.font = `bold ${nameSize}px Georgia, serif`;
      ctx.fillStyle = groomName ? "#ffffff" : "rgba(255,255,255,0.2)";
      ctx.fillText(groomName || "Groom's Name", CANVAS_W / 2, nameY + nameSize * 2.1);

      // Branding watermark
      ctx.font = "9px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("2soulfilms", CANVAS_W / 2, CANVAS_H - 12);
    }

    draw();

    return () => {
      cancelled = true;
    };
  }, [photoUrl, brideName, groomName, templateFolder, primaryColor]);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-white/50">Live Preview · Slide 1</p>
      <div
        className="rounded-2xl overflow-hidden mx-auto"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0B0F19",
        }}
      >
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
      </div>
      <p className="text-[10px] text-white/25 text-center">
        Final composites generated server-side at full 1080×1920px
      </p>
    </div>
  );
}

function drawImage(
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
  cover = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cover) {
        // object-fit: cover
        const scale = Math.max(w / img.width, h / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = (w - sw) / 2;
        const sy = (h - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}
