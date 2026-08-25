"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, Upload, X, ImagePlus, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEditor, createPhoto } from "@/stores/editor-store";

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
                      <img
                        src={p.src}
                        alt=""
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
                  <button onClick={() => setMode("select")} className="text-accent underline">
                    Continue to editor →
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {mode === "camera" && (
            <CameraCapture
              onCapture={(src) => {
                dispatch({ type: "ADD_PHOTO", photo: createPhoto(src) });
                setMode("select");
              }}
              onBack={() => setMode("select")}
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

/* ── Camera Capture ─────────────────────── */
function CameraCapture({ onCapture, onBack }: { onCapture: (src: string) => void; onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = s;
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setError(null);
    } catch {
      setError("Camera unavailable. Please allow camera access or upload photos instead.");
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, startCamera]);

  const capture = () => {
    setCountdown(3);
    let c = 3;
    const interval = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(interval);
        setCountdown(null);
        // Capture
        const video = videoRef.current!;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d")!;
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        stream?.getTracks().forEach((t) => t.stop());
        onCapture(dataUrl);
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  const switchCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  };

  if (error) {
    return (
      <motion.div
        key="cam-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-muted mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="px-6 py-2.5 border border-border rounded-full text-sm hover:bg-bg-secondary transition-colors">
            Upload Photos
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="camera"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl"
    >
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />
        {/* Countdown */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-white text-8xl font-[family-name:var(--font-heading)] font-bold drop-shadow-lg">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-muted hover:text-text border border-border rounded-full transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={switchCamera}
          className="px-5 py-2.5 text-sm border border-border rounded-full hover:bg-bg-secondary transition-colors"
        >
          Switch Camera
        </button>
        <button
          onClick={capture}
          disabled={countdown !== null}
          className="w-14 h-14 bg-accent rounded-full border-4 border-white shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
        />
      </div>
    </motion.div>
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
