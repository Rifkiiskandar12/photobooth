"use client";

import { useEditor } from "@/stores/editor-store";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const FONTS = [
  { name: "Inter", label: "Modern Sans (Inter)" },
  { name: "Playfair Display", label: "Editorial Serif" },
  { name: "Courier New", label: "Typewriter / Mono" },
  { name: "Georgia", label: "Classic Serif" },
];

export default function TextEditor() {
  const { state, dispatch } = useEditor();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Caption Text
        </h3>
        <input
          type="text"
          placeholder="e.g. Summer Memories 2026 ✨"
          value={state.captionText}
          onChange={(e) => dispatch({ type: "SET_CAPTION_TEXT", text: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-accent"
          maxLength={40}
        />
        <div className="flex justify-between text-[11px] text-muted mt-1.5 px-1">
          <span>Printed on the bottom of the frame</span>
          <span>{state.captionText.length}/40</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Font Style
        </h3>
        <div className="space-y-2">
          {FONTS.map((f) => (
            <button
              key={f.name}
              onClick={() => dispatch({ type: "SET_CAPTION_FONT", font: f.name })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${
                state.captionFont === f.name
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-border hover:border-accent/40 text-text"
              }`}
              style={{ fontFamily: f.name }}
            >
              <span>{f.label}</span>
              <span className="text-xs opacity-60">Abc</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Text Alignment
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => dispatch({ type: "SET_CAPTION_ALIGN", align: "left" })}
            className={`py-2 rounded-lg border flex justify-center items-center ${
              state.captionAlign === "left"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted"
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch({ type: "SET_CAPTION_ALIGN", align: "center" })}
            className={`py-2 rounded-lg border flex justify-center items-center ${
              state.captionAlign === "center"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted"
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch({ type: "SET_CAPTION_ALIGN", align: "right" })}
            className={`py-2 rounded-lg border flex justify-center items-center ${
              state.captionAlign === "right"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted"
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted">Font Size</span>
          <span className="text-text font-medium">{state.captionSize}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={24}
          value={state.captionSize}
          onChange={(e) => dispatch({ type: "SET_CAPTION_SIZE", size: Number(e.target.value) })}
          className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
