import { LayoutType } from "@/stores/editor-store";

/* ── Layout definitions ──────────────────── */
export interface SlotRect {
  x: number; y: number; w: number; h: number;
}

export interface LayoutDef {
  name: string;
  label: string;
  photoCount: number;
  /** canvas aspect ratio w/h */
  aspect: number;
  /** returns slot rects normalised 0-1 within inner area */
  slots: (gap: number) => SlotRect[];
  hasFilmHoles?: boolean;
}

const LAYOUTS: Record<LayoutType, LayoutDef> = {
  classic: {
    name: "classic",
    label: "Classic Strip",
    photoCount: 4,
    aspect: 0.35,
    slots: (g) => {
      const h = (1 - 3 * g) / 4;
      return Array.from({ length: 4 }, (_, i) => ({
        x: 0, y: i * (h + g), w: 1, h,
      }));
    },
  },
  grid: {
    name: "grid",
    label: "2×2 Grid",
    photoCount: 4,
    aspect: 1,
    slots: (g) => {
      const s = (1 - g) / 2;
      return [
        { x: 0, y: 0, w: s, h: s },
        { x: s + g, y: 0, w: s, h: s },
        { x: 0, y: s + g, w: s, h: s },
        { x: s + g, y: s + g, w: s, h: s },
      ];
    },
  },
  polaroid: {
    name: "polaroid",
    label: "Polaroid",
    photoCount: 1,
    aspect: 0.82,
    slots: () => [{ x: 0, y: 0, w: 1, h: 0.78 }],
  },
  film: {
    name: "film",
    label: "Film Strip",
    photoCount: 3,
    aspect: 0.4,
    hasFilmHoles: true,
    slots: (g) => {
      const h = (1 - 2 * g) / 3;
      return Array.from({ length: 3 }, (_, i) => ({
        x: 0.08, y: i * (h + g), w: 0.84, h,
      }));
    },
  },
  editorial: {
    name: "editorial",
    label: "Editorial",
    photoCount: 3,
    aspect: 0.75,
    slots: (g) => [
      { x: 0, y: 0, w: 1, h: 0.55 },
      { x: 0, y: 0.55 + g, w: 0.5 - g / 2, h: 0.45 - g },
      { x: 0.5 + g / 2, y: 0.55 + g, w: 0.5 - g / 2, h: 0.45 - g },
    ],
  },
};

export function getLayout(type: LayoutType): LayoutDef {
  return LAYOUTS[type];
}

export function getAllLayouts(): LayoutDef[] {
  return Object.values(LAYOUTS);
}

export const LAYOUT_KEYS: LayoutType[] = ["classic", "grid", "polaroid", "film", "editorial"];
