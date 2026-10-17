"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, Upload, RotateCcw, Check, Sparkles } from "lucide-react";
import { useEditor, createPhoto } from "@/stores/editor-store";
import { getLayout } from "@/lib/layouts";
import { CameraCaptureModal } from "./CameraCaptureModal";

/* ── Mini Frame Preview Component ────────────────────────── */
function MiniFramePreview({
  layoutName,
  photos,
  frameColor,
  bgType,
  bgGradient,
  gradientAngle,
}: {
  layoutName: string;
  photos: { id: string; src: string }[];
  frameColor: string;
  bgType: "solid" | "gradient";
  bgGradient: [string, string];
  gradientAngle: number;
}) {
  const bgStyle =
    bgType === "gradient"
      ? { background: `linear-gradient(${gradientAngle}deg, ${bgGradient[0]}, ${bgGradient[1]})` }
      : { backgroundColor: frameColor || "#FFFFFF" };

  const renderSlotImage = (idx: number, className: string = "") => {
    const photo = photos[idx];
    if (photo) {
      return (
        <div className={`relative overflow-hidden ${className}`}>
          <Image
            src={photo.src}
            alt={`Photo ${idx + 1}`}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      );
    }
    return (
      <div
        className={`bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs ${className}`}
      >
        <span>{idx + 1}</span>
      </div>
    );
  };

  if (layoutName === "classic") {
    return (
      <div
        style={bgStyle}
        className="w-36 rounded-xl shadow-lg border border-border/80 p-2.5 flex flex-col gap-1.5 transition-all"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full aspect-[4/3] rounded-sm overflow-hidden">
            {renderSlotImage(i, "w-full h-full")}
          </div>
        ))}
        <div className="py-1 text-center">
          <span className="text-[8px] font-serif tracking-widest text-neutral-400 uppercase">Abadibooth</span>
        </div>
      </div>
    );
  }

  if (layoutName === "grid") {
    return (
      <div
        style={bgStyle}
        className="w-56 aspect-square rounded-xl shadow-lg border border-border/80 p-3 grid grid-cols-2 gap-2 transition-all"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded-sm overflow-hidden">
            {renderSlotImage(i, "w-full h-full")}
          </div>
        ))}
      </div>
    );
  }

  if (layoutName === "polaroid") {
    return (
      <div
        style={bgStyle}
        className="w-48 rounded-xl shadow-lg border border-border/80 p-3 pb-7 flex flex-col transition-all"
      >
        <div className="w-full aspect-[4/5] rounded-sm overflow-hidden mb-3">
          {renderSlotImage(0, "w-full h-full")}
        </div>
        <div className="text-center">
          <span className="text-[10px] font-serif italic text-neutral-400">our memory</span>
        </div>
      </div>
    );
  }

  if (layoutName === "film") {
    return (
      <div className="w-40 bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 p-2 relative flex flex-col gap-1.5">
        {/* Film holes */}
        <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-1.5 rounded-[1px] bg-white/30" />
          ))}
        </div>
        <div className="absolute right-1 top-2 bottom-2 flex flex-col justify-between pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-1.5 rounded-[1px] bg-white/30" />
          ))}
        </div>
        <div className="px-2 flex flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-full aspect-[16/11] rounded-sm overflow-hidden">
              {renderSlotImage(i, "w-full h-full")}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layoutName === "editorial") {
    return (
      <div
        style={bgStyle}
        className="w-52 rounded-xl shadow-lg border border-border/80 p-2.5 flex flex-col gap-1.5 transition-all"
      >
        <div className="w-full aspect-[16/10] rounded-sm overflow-hidden">
          {renderSlotImage(0, "w-full h-full")}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="aspect-[4/3] rounded-sm overflow-hidden">
            {renderSlotImage(1, "w-full h-full")}
          </div>
          <div className="aspect-[4/3] rounded-sm overflow-hidden">
            {renderSlotImage(2, "w-full h-full")}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Main PhotoReview Component ──────────────────────────── */
export default function PhotoReview() {
  const { state, dispatch } = useEditor();
  const layout = getLayout(state.layout);
  const targetCount = layout.photoCount;

  // State for single-slot retake/replace
  const [retakeSlot, setRetakeSlot] = useState<number | null>(null);
  const [replaceSlot, setReplaceSlot] = useState<number | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);

  const handleContinue = () => {
    dispatch({ type: "SET_HAS_REVIEWED_PHOTOS", value: true });
    dispatch({ type: "SET_HAS_STARTED_EDITING", value: true });
  };

  const handleRetakeAll = () => {
    dispatch({ type: "SET_PHOTOS", photos: [] });
    dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: false });
  };

  const handleBackToInput = () => {
    // Return to layout selection / photo input without deleting photos
    dispatch({ type: "SET_HAS_SELECTED_LAYOUT", value: false });
    dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: false });
    dispatch({ type: "SET_HAS_REVIEWED_PHOTOS", value: false });
    dispatch({ type: "SET_HAS_STARTED_EDITING", value: false });
  };

  const openReplacePicker = (index: number) => {
    setReplaceSlot(index);
    if (singleFileInputRef.current) {
      singleFileInputRef.current.value = "";
      singleFileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || replaceSlot === null) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const photoItem = createPhoto(src);
      if (replaceSlot < state.photos.length) {
        dispatch({ type: "REPLACE_PHOTO", index: replaceSlot, photo: photoItem });
      } else {
        dispatch({ type: "ADD_PHOTO", photo: photoItem });
      }
      setReplaceSlot(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <button
          type="button"
          onClick={handleBackToInput}
          className="flex items-center gap-2 text-muted hover:text-text transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Layout</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-[family-name:var(--font-heading)] text-sm font-semibold">Abadibooth</span>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 3 of 3 • Review Shots</span>
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold tracking-tight mb-1">
            Review Your Photos
          </h1>
          <p className="text-muted text-xs md:text-sm">
            Make sure you are happy with each shot before customizing your frame
          </p>
        </motion.div>

        {/* Layout Preview + Photo Thumbnails Card */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Frame Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <MiniFramePreview
              layoutName={state.layout}
              photos={state.photos}
              frameColor={state.frameColor}
              bgType={state.bgType}
              bgGradient={state.bgGradient}
              gradientAngle={state.gradientAngle}
            />
            <span className="text-xs font-medium text-muted mt-3">
              {layout.label} • {state.photos.length}/{targetCount} photos
            </span>
          </motion.div>

          {/* Individual Photo Slot Thumbnails & Controls */}
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Captured Photos
              </span>
              <span className="text-xs text-muted">
                Hover or tap photo to retake or replace
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: targetCount }).map((_, idx) => {
                const photo = state.photos[idx];
                const hasPhoto = Boolean(photo);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group rounded-xl border border-border bg-white overflow-hidden shadow-sm hover:border-accent/50 transition-all flex flex-col"
                  >
                    {/* Thumbnail box */}
                    <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                      {hasPhoto ? (
                        <>
                          <Image
                            src={photo.src}
                            alt={`Photo slot ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          {/* Hover Overlay with actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 backdrop-blur-[2px]">
                            <button
                              type="button"
                              onClick={() => setRetakeSlot(idx)}
                              className="w-full py-1.5 px-2 bg-white text-neutral-900 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/90 active:scale-95 transition-all shadow-sm"
                            >
                              <Camera className="w-3.5 h-3.5 text-accent" />
                              <span>Retake</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openReplacePicker(idx)}
                              className="w-full py-1.5 px-2 bg-white/20 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/30 active:scale-95 transition-all backdrop-blur-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => openReplacePicker(idx)}
                          className="w-full h-full flex flex-col items-center justify-center text-muted hover:text-accent cursor-pointer transition-colors border-2 border-dashed border-border hover:border-accent"
                        >
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-[11px] font-medium">+ Add Photo</span>
                        </div>
                      )}

                      {/* Slot badge */}
                      <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center pointer-events-none">
                        {idx + 1}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full max-w-md justify-center">
            <button
              type="button"
              onClick={handleRetakeAll}
              className="w-full sm:w-auto px-6 py-3 border border-border bg-white text-muted hover:text-text hover:border-neutral-400 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 hover:bg-neutral-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake All</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto flex-1 px-8 py-3.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Continue to Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input for single photo replacement */}
      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Camera Capture Modal for single retake */}
      <AnimatePresence>
        {retakeSlot !== null && (
          <CameraCaptureModal
            mode="editor-single"
            slotIndex={retakeSlot}
            onCapture={(src, targetIndex) => {
              const photoItem = createPhoto(src);
              if (targetIndex < state.photos.length) {
                dispatch({ type: "REPLACE_PHOTO", index: targetIndex, photo: photoItem });
              } else {
                dispatch({ type: "ADD_PHOTO", photo: photoItem });
              }
              setRetakeSlot(null);
            }}
            onClose={() => setRetakeSlot(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
