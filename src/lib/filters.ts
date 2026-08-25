/* ── Filter presets ─────────────────────── */
export interface FilterDef {
  name: string;
  label: string;
  css: string;
}

export const FILTERS: FilterDef[] = [
  { name: "none", label: "Original", css: "none" },
  { name: "warm", label: "Warm", css: "sepia(0.2) saturate(1.3) brightness(1.05)" },
  { name: "cool", label: "Cool", css: "saturate(0.9) hue-rotate(15deg) brightness(1.05)" },
  { name: "vintage", label: "Vintage", css: "sepia(0.35) contrast(0.9) brightness(1.1) saturate(0.8)" },
  { name: "film", label: "Film", css: "contrast(1.1) saturate(0.85) brightness(1.05) sepia(0.1)" },
  { name: "bw", label: "B&W", css: "grayscale(1) contrast(1.1)" },
  { name: "soft", label: "Soft", css: "brightness(1.08) contrast(0.92) saturate(0.9)" },
  { name: "fade", label: "Fade", css: "brightness(1.1) contrast(0.85) saturate(0.75)" },
];

export function getFilterCSS(name: string): string {
  return FILTERS.find((f) => f.name === name)?.css ?? "none";
}
