"use client";

import { useEditor, LayoutType } from "@/stores/editor-store";
import { getAllLayouts } from "@/lib/layouts";

const LAYOUT_ICONS: Record<string, React.ReactNode> = {
  classic: (
    <div className="w-6 flex flex-col gap-0.5">
      {[...Array(4)].map((_, i) => <div key={i} className="w-full h-2 rounded-[1px] bg-current opacity-60" />)}
    </div>
  ),
  grid: (
    <div className="w-7 grid grid-cols-2 gap-0.5">
      {[...Array(4)].map((_, i) => <div key={i} className="aspect-square rounded-[1px] bg-current opacity-60" />)}
    </div>
  ),
  polaroid: (
    <div className="w-6 bg-current opacity-60 rounded-[1px]">
      <div className="w-full aspect-[4/5]" />
      <div className="h-1.5" />
    </div>
  ),
  film: (
    <div className="w-6 flex flex-col gap-0.5 relative">
      {[...Array(3)].map((_, i) => <div key={i} className="w-full h-2.5 rounded-[1px] bg-current opacity-60" />)}
    </div>
  ),
  editorial: (
    <div className="w-7 flex flex-col gap-0.5">
      <div className="w-full h-3 rounded-[1px] bg-current opacity-60" />
      <div className="flex gap-0.5">
        <div className="flex-1 h-2 rounded-[1px] bg-current opacity-60" />
        <div className="flex-1 h-2 rounded-[1px] bg-current opacity-60" />
      </div>
    </div>
  ),
};

export default function LayoutSelector() {
  const { state, dispatch } = useEditor();
  const layouts = getAllLayouts();

  return (
    <div className="space-y-6">
      {/* Layout selection */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Layout</h3>
        <div className="grid grid-cols-5 gap-2">
          {layouts.map((l) => (
            <button
              key={l.name}
              onClick={() => dispatch({ type: "SET_LAYOUT", layout: l.name as LayoutType })}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                state.layout === l.name
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border hover:border-accent/40 text-muted hover:text-text"
              }`}
            >
              {LAYOUT_ICONS[l.name]}
              <span className="text-[9px] leading-tight">{l.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
