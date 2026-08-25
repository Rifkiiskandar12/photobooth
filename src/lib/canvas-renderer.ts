import { EditorState, PhotoItem } from "@/stores/editor-store";
import { getLayout } from "./layouts";
import { getFilterCSS } from "./filters";

/* ── Canvas Renderer ──────────────────────── */

const BASE_W = 1200;

export async function renderCanvas(state: EditorState): Promise<HTMLCanvasElement> {
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }
  const layout = getLayout(state.layout);
  const canvasW = BASE_W;
  const canvasH = Math.round(canvasW / layout.aspect);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // Scale factor to translate from preview (280px or 238px wide) to high-res canvas (1200px wide)
  const previewW = 280 * (layout.aspect < 0.6 ? 0.85 : 1);
  const scale = canvasW / previewW;

  // Scale dimensions
  const border = state.borderThickness * scale;
  const innerW = canvasW - border * 2;
  const innerH = canvasH - border * 2;
  const radius = state.cornerRadius * scale;
  const spacing = state.innerSpacing * scale;

  // Frame shape (with Solid Color or Gradient background)
  if (state.bgType === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
    grad.addColorStop(0, state.bgGradient[0]);
    grad.addColorStop(1, state.bgGradient[1]);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = state.frameColor;
  }
  roundRect(ctx, 0, 0, canvasW, canvasH, radius);
  ctx.fill();

  // Film strip holes
  if (layout.hasFilmHoles) {
    drawFilmHoles(ctx, canvasW, canvasH, state.bgType === "gradient" ? state.bgGradient[0] : state.frameColor, scale);
  }

  // Draw photos in slots
  const gap = state.photoGap / 300;
  const slots = layout.slots(gap);

  const loadedImages = await Promise.all(
    state.photos.slice(0, layout.photoCount).map((p) => loadImage(p.src))
  );

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const photo = state.photos[i];
    const img = loadedImages[i];

    const sx = border + spacing + slot.x * (innerW - spacing * 2);
    const sy = border + spacing + slot.y * (innerH - spacing * 2);
    const sw = slot.w * (innerW - spacing * 2);
    const sh = slot.h * (innerH - spacing * 2);

    // Slot background
    ctx.fillStyle = "#e0e0e0";
    roundRect(ctx, sx, sy, sw, sh, Math.max(0, radius - (4 * scale)));
    ctx.fill();

    if (img && photo) {
      ctx.save();
      // Clip to slot
      ctx.beginPath();
      roundRect(ctx, sx, sy, sw, sh, Math.max(0, radius - (4 * scale)));
      ctx.clip();

      // Apply filter
      const filterCSS = photo.filter !== "none" ? getFilterCSS(photo.filter) : (state.globalFilter !== "none" ? getFilterCSS(state.globalFilter) : "none");
      if (filterCSS !== "none") {
        ctx.filter = filterCSS;
      }

      // Apply brightness/contrast/saturation
      const adjustments = [];
      if (photo.brightness !== 100) adjustments.push(`brightness(${photo.brightness / 100})`);
      if (photo.contrast !== 100) adjustments.push(`contrast(${photo.contrast / 100})`);
      if (photo.saturation !== 100) adjustments.push(`saturate(${photo.saturation / 100})`);
      if (adjustments.length > 0) {
        ctx.filter = ctx.filter === "none" ? adjustments.join(" ") : ctx.filter + " " + adjustments.join(" ");
      }

      // Draw image covering slot (object-fit: cover)
      const zoom = photo.zoom;
      const imgAspect = img.width / img.height;
      const slotAspect = sw / sh;
      let dw: number, dh: number;
      if (imgAspect > slotAspect) {
        dh = sh * zoom;
        dw = dh * imgAspect;
      } else {
        dw = sw * zoom;
        dh = dw / imgAspect;
      }
      const dx = sx + (sw - dw) / 2 + photo.cropX * sw;
      const dy = sy + (sh - dh) / 2 + photo.cropY * sh;

      if (photo.rotation !== 0) {
        ctx.translate(sx + sw / 2, sy + sh / 2);
        ctx.rotate((photo.rotation * Math.PI) / 180);
        ctx.translate(-(sx + sw / 2), -(sy + sh / 2));
      }

      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }
  }

  // Caption
  if (state.captionText) {
    const fontSize = state.captionSize * scale;
    ctx.font = `${fontSize}px '${state.captionFont}', sans-serif`;
    ctx.fillStyle = getContrastColor(state.bgType === "gradient" ? state.bgGradient[1] : state.frameColor);
    ctx.textAlign = state.captionAlign as CanvasTextAlign;
    ctx.textBaseline = "middle";
    
    const textX = state.captionAlign === "left" 
      ? border + spacing 
      : state.captionAlign === "right" 
        ? canvasW - border - spacing 
        : canvasW / 2;
        
    const isPolaroid = state.layout === "polaroid";
    const textY = isPolaroid ? canvasH - (border * 0.9) : canvasH - (border / 2);
    ctx.fillText(state.captionText, textX, textY);
  }

  return canvas;
}

export function exportCanvas(canvas: HTMLCanvasElement, format: "png" | "jpg" = "png"): string {
  return canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
}

export function downloadCanvas(canvas: HTMLCanvasElement, format: "png" | "jpg" = "png") {
  const data = exportCanvas(canvas, format);
  const a = document.createElement("a");
  a.href = data;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `photobooth-${date}.${format}`;
  a.click();
}

/* ── Helpers ───────────────────────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFilmHoles(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, scale: number) {
  const holeR = 1.5 * scale;
  const gap = 20 * scale;
  const count = Math.floor(h / gap);
  ctx.fillStyle = darkenColor(color, 30);
  for (let i = 0; i < count; i++) {
    const y = gap / 2 + i * gap;
    // Left holes
    ctx.beginPath();
    ctx.arc(4 * scale, y, holeR, 0, Math.PI * 2);
    ctx.fill();
    // Right holes
    ctx.beginPath();
    ctx.arc(w - (4 * scale), y, holeR, 0, Math.PI * 2);
    ctx.fill();
  }
}

function normalizeHex(hex: string): string {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  return `#${clean}`;
}

function getContrastColor(hex: string): string {
  const norm = normalizeHex(hex);
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "#171717" : "#FAFAF7";
}

function darkenColor(hex: string, amount: number): string {
  const norm = normalizeHex(hex);
  const r = Math.max(0, parseInt(norm.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(norm.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(norm.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
