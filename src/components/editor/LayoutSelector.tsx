"use client";

import { useEditor, LayoutType, createPhoto } from "@/stores/editor-store";
import { getAllLayouts } from "@/lib/layouts";
import { X, ImagePlus, Camera } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CameraCaptureModal } from "./CameraCaptureModal";

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
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [cameraTarget, setCameraTarget] = useState<"add" | number>("add");

  const currentLayout = layouts.find(l => l.name === state.layout) || layouts[0];
  const maxPhotos = currentLayout.photoCount;

  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    );
    const activePhotosCount = Math.min(state.photos.length, maxPhotos);
    const remaining = maxPhotos - activePhotosCount;
    if (remaining <= 0) return;

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

  const handleReplacePhoto = (files: FileList | null, index: number) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      dispatch({ type: "REPLACE_PHOTO", index, photo: createPhoto(src) });
    };
    reader.readAsDataURL(file);
    setReplaceIndex(null);
  };

  const handleCameraCapture = (src: string) => {
    if (cameraTarget === "add") {
      dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) });
    } else {
      dispatch({ type: "REPLACE_PHOTO", index: cameraTarget, photo: createPhoto(src) });
    }
    setShowCamera(false);
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
          Photos ({Math.min(state.photos.length, maxPhotos)}/{maxPhotos})
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Existing photo slots */}
          {Array.from({ length: maxPhotos }).map((_, i) => {
            const photo = state.photos[i];
            return (
              <div
                key={i}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-bg-secondary"
              >
                {photo ? (
                  <>
                    <img src={photo.src} alt="" className="w-full h-full object-cover" />
                    {/* Remove button */}
                    <button
                      onClick={() => dispatch({ type: "REMOVE_PHOTO", id: photo.id })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                      title="Hapus foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {/* Replace buttons row - visible on hover */}
                    <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Replace via upload */}
                      <button
                        onClick={() => {
                          setReplaceIndex(i);
                          replaceInputRef.current?.click();
                        }}
                        className="flex-1 py-1 bg-black/70 text-white text-[9px] flex items-center justify-center gap-0.5 hover:bg-black/90 transition-colors"
                        title="Ganti foto (upload)"
                      >
                        <ImagePlus className="w-2.5 h-2.5" />
                        <span>Ganti</span>
                      </button>
                      {/* Replace via camera */}
                      <button
                        onClick={() => {
                          setCameraTarget(i);
                          setShowCamera(true);
                        }}
                        className="flex-1 py-1 bg-black/70 text-white text-[9px] flex items-center justify-center gap-0.5 hover:bg-black/90 transition-colors"
                        title="Ganti foto (kamera)"
                      >
                        <Camera className="w-2.5 h-2.5" />
                        <span>Kamera</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Empty slot */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="w-8 h-8 rounded-full bg-border/60 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-muted transition-colors"
                      title="Upload foto"
                    >
                      <ImagePlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCameraTarget("add");
                        setShowCamera(true);
                      }}
                      className="w-8 h-8 rounded-full bg-border/60 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-muted transition-colors"
                      title="Ambil foto dengan kamera"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hidden file input for add */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleAddPhotos(e.target.files)}
        />
        {/* Hidden file input for replace */}
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (replaceIndex !== null) handleReplacePhoto(e.target.files, replaceIndex);
          }}
        />
      </div>

      {/* Camera modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCaptureModal
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
