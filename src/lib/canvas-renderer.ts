import { EditorState } from "@/stores/editor-store";
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

  // Scale factor to translate from preview width to high-res canvas
  const previewW = 280 * (layout.aspect < 0.6 ? 0.85 : 1);
  const scale = canvasW / previewW;

  // Scale dimensions
  const border = state.borderThickness * scale;
  const radius = state.cornerRadius * scale;
  const spacing = state.innerSpacing * scale;

  // Inner area width/height — derived from aspect ratio (same math as PhotoCanvas.tsx)
  const innerW = canvasW - border * 2;
  const innerH = innerW / layout.aspect;

  // Caption area — only outside polaroid
  const isPolaroid = state.layout === "polaroid";
  const captionAreaH = state.captionText && !isPolaroid
    ? Math.max(border, state.captionSize * scale + 14 * scale)
    : border;

  // Bleed margin for stickers extending beyond frame
  const BLEED_PX = 40;
  const bleed = BLEED_PX * scale;

  const baseCanvasH = innerH + border * 2;
  const canvasH = Math.round(baseCanvasH + (captionAreaH - border));

  // Export canvas includes bleed on all 4 sides
  const canvas = document.createElement("canvas");
  canvas.width = canvasW + bleed * 2;
  canvas.height = canvasH + bleed * 2;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Offset everything by bleed so frame sits centered
  ctx.save();
  ctx.translate(bleed, bleed);

  // Frame background
  if (state.bgType === "gradient") {
    let x0 = 0, y0 = 0, x1 = 0, y1 = canvasH;
    const angle = state.gradientAngle || 180;
    
    // Map common CSS gradient angles to canvas coordinates
    if (angle === 0) { x0 = 0; y0 = canvasH; x1 = 0; y1 = 0; }
    else if (angle === 45) { x0 = 0; y0 = canvasH; x1 = canvasW; y1 = 0; }
    else if (angle === 90) { x0 = 0; y0 = 0; x1 = canvasW; y1 = 0; }
    else if (angle === 135) { x0 = 0; y0 = 0; x1 = canvasW; y1 = canvasH; }
    else if (angle === 180) { x0 = 0; y0 = 0; x1 = 0; y1 = canvasH; }
    else if (angle === 225) { x0 = canvasW; y0 = 0; x1 = 0; y1 = canvasH; }
    else if (angle === 270) { x0 = canvasW; y0 = 0; x1 = 0; y1 = 0; }
    else if (angle === 315) { x0 = canvasW; y0 = canvasH; x1 = 0; y1 = 0; }
    
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
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

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const photo = state.photos[i];

    const sx = border + spacing + slot.x * (innerW - spacing * 2);
    const sy = border + spacing + slot.y * (innerH - spacing * 2);
    const sw = slot.w * (innerW - spacing * 2);
    const sh = slot.h * (innerH - spacing * 2);
    const sr = Math.max(0, radius - 4 * scale);

    ctx.save();
    roundRect(ctx, sx, sy, sw, sh, sr);
    ctx.clip();

    if (photo) {
      const img = await loadImage(photo.src);
      const filterCSS = getFilterCSS(photo.filter || state.globalFilter);
      ctx.filter = filterCSS === "none" ? "none" : filterCSS;
      // object-fit: cover
      const imgAspect = img.width / img.height;
      const slotAspect = sw / sh;
      let dw: number, dh: number;
      if (imgAspect > slotAspect) {
        dh = sh;
        dw = dh * imgAspect;
      } else {
        dw = sw;
        dh = dw / imgAspect;
      }
      const dx = sx + (sw - dw) / 2;
      const dy = sy + (sh - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.filter = "none";
    } else {
      ctx.fillStyle = "#e5e5e5";
      ctx.fillRect(sx, sy, sw, sh);
    }
    ctx.restore();
  }

  // Caption text
  if (state.captionText) {
    const fontSize = state.captionSize * scale;
    ctx.font = `${fontSize}px '${state.captionFont}', sans-serif`;

    if (state.captionColor && state.captionColor !== "auto") {
      ctx.fillStyle = state.captionColor;
    } else {
      ctx.fillStyle = getContrastColor(state.bgType === "gradient" ? state.bgGradient[1] : state.frameColor);
    }
    ctx.textAlign = state.captionAlign as CanvasTextAlign;
    ctx.textBaseline = "middle";

    const textX = state.captionAlign === "left"
      ? border + spacing
      : state.captionAlign === "right"
        ? canvasW - border - spacing
        : canvasW / 2;

    let textY: number;
    if (isPolaroid) {
      // In polaroid, caption sits in the 78%-100% gap of inner photo area
      const gapTop = border + spacing + 0.78 * (innerH - 2 * spacing);
      const gapBottom = border + innerH;
      textY = (gapTop + gapBottom) / 2;
    } else {
      textY = baseCanvasH + (captionAreaH - border) / 2;
    }
    ctx.fillText(state.captionText, textX, textY);
  }

  // End frame offset — stickers are drawn relative to this same offset
  ctx.restore();

  // Draw stickers (in bleed-offset space so they can extend beyond frame)
  if (state.stickers && state.stickers.length > 0) {
    const loadedStickers = await Promise.all(
      state.stickers.map((s) => loadImage(s.src).catch(() => null))
    );

    const baseStickerPx = 80 * scale;

    for (let i = 0; i < state.stickers.length; i++) {
      const sticker = state.stickers[i];
      const img = loadedStickers[i];
      if (!img) continue;

      // sticker.x/y are fractions of inner area; map to export coords (with bleed offset)
      const cx = bleed + border + sticker.x * innerW;
      const cy = bleed + border + sticker.y * innerH;

      const stickerSize = baseStickerPx * (sticker.scale || 1);

      ctx.save();
      ctx.translate(cx, cy);
      if (sticker.rotation) {
        ctx.rotate((sticker.rotation * Math.PI) / 180);
      }
      ctx.drawImage(img, -stickerSize / 2, -stickerSize / 2, stickerSize, stickerSize);
      ctx.restore();
    }
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

  ctx.save();
  ctx.fillStyle = getContrastColor(color) === "#171717" ? "#000000" : "#ffffff";
  ctx.globalAlpha = 0.2;

  for (let i = 0; i < count; i++) {
    const y = gap / 2 + i * gap;
    ctx.beginPath();
    ctx.arc(4 * scale, y, holeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - (4 * scale), y, holeR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
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
