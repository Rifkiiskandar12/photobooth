"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, Upload, X, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEditor, createPhoto } from "@/stores/editor-store";
import { CameraCaptureModal } from "./CameraCaptureModal";

type Mode = "select" | "camera" | "upload";

export default function PhotoInput() {
  const { state, dispatch } = useEditor();
  const [mode, setMode] = useState<Mode>("select");

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-muted hover:text-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>
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
              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
                Add your photos
              </h1>
              <p className="text-muted mb-10">Take photos or upload from your device</p>

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
                  {state.photos.length < 6 && (
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
                  onClick={() => setMode("camera")}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span className="font-medium">Take a Photo</span>
                </button>
                <button
                  onClick={() => setMode("upload")}
                  className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-border rounded-2xl hover:border-accent hover:bg-accent/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Photos</span>
                </button>
              </div>

              {state.photos.length > 0 && (
                <p className="text-muted text-sm mt-6">
                  {state.photos.length}/6 photos added.{" "}
                  <button onClick={() => {
                    dispatch({ type: "SET_HAS_STARTED_EDITING", value: true });
                  }} className="text-accent underline">
                    Continue to editor →
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {mode === "camera" && (
            <CameraCaptureModal
              onCapture={(src) => {
                dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) });
                dispatch({ type: "SET_HAS_STARTED_EDITING", value: true });
              }}
              onClose={() => setMode("select")}
            />
          )}

          {mode === "upload" && (
            <UploadArea
              onUpload={(files) => {
                const remaining = 6 - state.photos.length;
                const toAdd = files.slice(0, remaining);
                toAdd.forEach((src) => {
                  dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) });
                });
                dispatch({ type: "SET_HAS_STARTED_EDITING", value: true });
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
function UploadArea({ onUpload, onBack }: { onUpload: (files: string[]) => void; onBack: () => void }) {
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
        <p className="text-muted text-xs mt-3">JPG, PNG, WebP · Max 6 photos</p>
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
