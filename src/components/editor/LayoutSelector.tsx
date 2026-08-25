"use client";

import { useEditor, LayoutType } from "@/stores/editor-store";
import { getAllLayouts } from "@/lib/layouts";
import { X, ImagePlus } from "lucide-react";
import { useRef } from "react";
import { createPhoto } from "@/stores/editor-store";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    );
    const remaining = 6 - state.photos.length;
    Promise.all(
      valid.slice(0, remaining).map(
        (f) => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(f);
        })
      )
    ).then((srcs) => {
      srcs.forEach((src) => dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) }));
    });
  };

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

      {/* Photo management */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
          Photos ({state.photos.length}/6)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {state.photos.map((p) => (
            <div key={p.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img src={p.src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => dispatch({ type: "REMOVE_PHOTO", id: p.id })}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {state.photos.length < 6 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent flex items-center justify-center text-muted hover:text-accent transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleAddPhotos(e.target.files)}
        />
      </div>
    </div>
  );
}
