"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CameraCaptureModal({
  onCapture,
  onClose,
}: {
  onCapture: (src: string) => void;
  onClose: () => void;
}) {
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
    let active = true;
    const initCamera = async () => {
      if (active) {
        await startCamera(facingMode);
      }
    };
    initCamera();
    return () => {
      active = false;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-bg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-lg">Take Photo</h2>
          <button onClick={onClose} className="text-muted hover:text-text p-1">
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {error ? (
            <div className="text-center py-10">
              <p className="text-muted mb-6">{error}</p>
              <button onClick={onClose} className="px-6 py-2.5 border border-border rounded-full text-sm hover:bg-bg-secondary transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div
                      key={countdown}
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
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
                  onClick={onClose}
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
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
