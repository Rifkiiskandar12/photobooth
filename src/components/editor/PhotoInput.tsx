"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, Upload, X, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEditor, createPhoto } from "@/stores/editor-store";
import { CameraCaptureModal } from "./CameraCaptureModal";
import { getLayout } from "@/lib/layouts";

type Mode = "select" | "camera" | "upload";

export default function PhotoInput() {
  const { state, dispatch } = useEditor();
  const [mode, setMode] = useState<Mode>("select");
  const captureCountRef = useRef(0);
  const layoutDef = getLayout(state.layout);
  const targetCount = layoutDef.photoCount;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_HAS_SELECTED_LAYOUT", value: false })}
          className="flex items-center gap-2 text-muted hover:text-text transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Layout</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-[family-name:var(--font-heading)] text-sm font-semibold">Abadibooth</span>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-lg w-full"
            >
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-2">
                Add your photos
              </h1>
              <p className="text-muted text-sm mb-5">Take photos or upload from your device</p>

              {/* Layout Info Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs md:text-sm mb-8">
                <span className="font-semibold text-text">{layoutDef.label}</span>
                <span className="text-muted">•</span>
                <span className="text-muted">{targetCount} {targetCount === 1 ? "photo" : "photos"} needed</span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_HAS_SELECTED_LAYOUT", value: false })}
                  className="text-accent hover:underline ml-1 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Photo thumbnails if any */}
              {state.photos.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {state.photos.map((p) => (
                    <div key={p.id} className="relative group">
                      <Image
                        src={p.src}
                        alt=""
                        width={80}
                        height={80}
                        unoptimized
                        className="w-20 h-20 object-cover rounded-xl border border-border"
                      />
                      <button
                        onClick={() => dispatch({ type: "REMOVE_PHOTO", id: p.id })}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {state.photos.length < targetCount && (
                    <button
                      onClick={() => setMode("upload")}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-accent flex items-center justify-center text-muted hover:text-accent transition-colors"
                    >
                      <ImagePlus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    captureCountRef.current = 0;
                    setMode("camera");
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span className="font-medium">Take a Photo</span>
                </button>
                <button
                  onClick={() => setMode("upload")}
                  className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-border rounded-2xl hover:border-accent hover:bg-accent/5 transition-all hover:scale-[1.02] active:scale-[0.98] bg-white shadow-sm"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Photos</span>
                </button>
              </div>

              {state.photos.length > 0 && (
                <p className="text-muted text-sm mt-6">
                  {state.photos.length}/{targetCount} photos added.{" "}
                  <button
                    onClick={() => {
                      dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: true });
                    }}
                    className="text-accent underline font-medium"
                  >
                    Review photos →
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {mode === "camera" && (
            <CameraCaptureModal
              mode="initial-multi"
              targetCount={targetCount}
              onCapture={(src, captureIndex) => {
                captureCountRef.current += 1;
                const photoItem = createPhoto(src);
                if (state.photos.length > captureIndex) {
                  dispatch({ type: "REPLACE_PHOTO", index: captureIndex, photo: photoItem });
                } else {
                  dispatch({ type: "ADD_PHOTO", photo: photoItem });
                }
              }}
              onClose={() => {
                setMode("select");
                if (captureCountRef.current > 0 || state.photos.length > 0) {
                  dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: true });
                }
              }}
            />
          )}

          {mode === "upload" && (
            <UploadArea
              maxPhotos={targetCount}
              onUpload={(files) => {
                const remaining = targetCount - state.photos.length;
                const toAdd = files.slice(0, Math.max(0, remaining));
                toAdd.forEach((src) => {
                  dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) });
                });
                if (toAdd.length > 0 || state.photos.length > 0) {
                  dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: true });
                }
                setMode("select");
              }}
              onBack={() => setMode("select")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



/* ── Upload Area ────────────────────────── */
function UploadArea({ onUpload, onBack, maxPhotos = 4 }: { onUpload: (files: string[]) => void; onBack: () => void; maxPhotos?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    );
    if (valid.length === 0) return;

    const urls = valid.map((f) => URL.createObjectURL(f));
    onUpload(urls);
  };

  return (
    <motion.div
      key="upload"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg"
    >
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
          dragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="w-10 h-10 text-muted mx-auto mb-4" />
        <p className="font-medium mb-1">Drop your photos here</p>
        <p className="text-muted text-sm">or click to browse</p>
        <p className="text-muted text-xs mt-3">JPG, PNG, WebP · Max {maxPhotos} {maxPhotos === 1 ? "photo" : "photos"}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-muted hover:text-text border border-border rounded-full transition-colors"
        >
          ← Back
        </button>
      </div>
    </motion.div>
  );
}
