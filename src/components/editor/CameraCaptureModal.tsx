"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Camera } from "lucide-react";

export type CameraMode = "initial-multi" | "editor-single";

export function CameraCaptureModal({
  mode = "editor-single",
  targetCount = 1,
  slotIndex = 0,
  onCapture,
  onClose,
}: {
  /** Mode 1: initial-multi (multi-capture berurutan), Mode 2: editor-single (ganti 1 foto saja) */
  mode: CameraMode;
  /** Jumlah total foto yang harus diambil (khusus mode initial-multi) */
  targetCount?: number;
  /** Index slot yang diganti (khusus mode editor-single) */
  slotIndex?: number;
  /** Callback saat foto berhasil diambil. (src, targetSlotIndex) */
  onCapture: (src: string, targetSlotIndex: number) => void;
  /** Callback saat modal ditutup */
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // State alur capture
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentCaptureIndex, setCurrentCaptureIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Refs — perubahan tidak menyebabkan re-render / useEffect ulang
  const sessionAborted = useRef(false);
  const isCapturingRef = useRef(false);
  const facingModeRef = useRef<"user" | "environment">("user");

  const isMultiMode = mode === "initial-multi";
  const effectiveTotal = isMultiMode ? Math.max(1, targetCount) : 1;

  /** Helper untuk menghentikan hardware camera stream */
  const stopHardwareStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch {}
      });
      streamRef.current = null;
    }
  }, []);

  /** Inisialisasi SATU camera stream untuk seluruh sesi */
  const startCamera = useCallback(async (facing: "user" | "environment") => {
    try {
      stopHardwareStream();
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setError(null);
      return s;
    } catch {
      setError("Kamera tidak dapat diakses. Mohon izinkan akses kamera di peramban Anda.");
      return null;
    }
  }, [stopHardwareStream]);

  /** Capture 1 frame dari video stream aktif ke base64 */
  const captureFrame = useCallback((): string => {
    const video = videoRef.current;
    if (!video) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Mirror front camera untuk tampilan alami
    if (facingModeRef.current === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  /** Countdown 3-2-1 lalu capture frame */
  const runCountdownAndCapture = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setCountdown(3);
      let c = 3;
      const interval = setInterval(() => {
        if (sessionAborted.current) {
          clearInterval(interval);
          setCountdown(null);
          resolve("");
          return;
        }

        c--;
        if (c <= 0) {
          clearInterval(interval);
          setCountdown(null);
          // Visual Flash feedback
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 200);
          resolve(captureFrame());
        } else {
          setCountdown(c);
        }
      }, 1000);
    });
  }, [captureFrame]);

  /**
   * MODE 1: Sesi Otomatis Multi-Capture (Initial "Take a Photo")
   * LOOP DARI SLOT 0 SAMPAI effectiveTotal - 1
   */
  const startMultiSession = useCallback(async (total: number) => {
    if (sessionAborted.current || isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturing(true);

    for (let i = 0; i < total; i++) {
      if (sessionAborted.current) break;

      setCurrentCaptureIndex(i);

      const dataUrl = await runCountdownAndCapture();

      if (sessionAborted.current || !dataUrl) break;

      onCapture(dataUrl, i);

      // Jeda sejenak sebelum countdown foto berikutnya (kecuali foto terakhir)
      if (i < total - 1 && !sessionAborted.current) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    if (!sessionAborted.current) {
      setCurrentCaptureIndex(total);
      setIsDone(true);
      setIsCapturing(false);
      isCapturingRef.current = false;
      stopHardwareStream();
      setTimeout(() => { onClose(); }, 1000);
    } else {
      setIsCapturing(false);
      isCapturingRef.current = false;
    }
  }, [runCountdownAndCapture, onCapture, stopHardwareStream, onClose]);

  /**
   * MODE 2: Single Capture untuk Editor (Ganti 1 Foto di slotIndex)
   * TIDAK ADA LOOP. Hanya mengambil 1 foto untuk slotIndex tersebut.
   */
  const startSingleCapture = useCallback(async (targetSlot: number) => {
    if (sessionAborted.current || isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturing(true);

    const dataUrl = await runCountdownAndCapture();

    if (!sessionAborted.current && dataUrl) {
      onCapture(dataUrl, targetSlot);
      setIsDone(true);
      setIsCapturing(false);
      isCapturingRef.current = false;
      stopHardwareStream();
      setTimeout(() => { onClose(); }, 800);
    } else {
      setIsCapturing(false);
      isCapturingRef.current = false;
    }
  }, [runCountdownAndCapture, onCapture, stopHardwareStream, onClose]);

  // Inisialisasi kamera saat modal pertama kali mount ATAU setelah switch kamera
  useEffect(() => {
    let active = true;
    sessionAborted.current = false;
    isCapturingRef.current = false;
    facingModeRef.current = facingMode;

    const initAndRun = async () => {
      const s = await startCamera(facingMode);
      if (!active || !s) return;

      // Tunggu video stream stabil sebelum mulai capture
      await new Promise((r) => setTimeout(r, 1000));
      if (!active || sessionAborted.current) return;

      if (isMultiMode) {
        startMultiSession(effectiveTotal);
      } else {
        startSingleCapture(slotIndex);
      }
    };

    initAndRun();

    return () => {
      active = false;
      sessionAborted.current = true;
      stopHardwareStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]); // Hanya trigger ulang saat facingMode berubah

  const stopSession = () => {
    sessionAborted.current = true;
    setCountdown(null);
    setIsCapturing(false);
    isCapturingRef.current = false;
    stopHardwareStream();
    onClose();
  };

  const switchCamera = () => {
    // Batalkan sesi aktif sebelum ganti kamera
    sessionAborted.current = true;
    setCountdown(null);
    setIsCapturing(false);
    isCapturingRef.current = false;
    // Ubah facingMode → trigger useEffect untuk restart kamera + sesi baru
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-bg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent animate-pulse" />
            <h2 className="font-semibold text-base sm:text-lg">
              {isMultiMode
                ? `Sesi Otomatis: ${effectiveTotal} Foto`
                : `Ambil Foto (Slot #${slotIndex + 1})`}
            </h2>
          </div>
          <button
            type="button"
            onClick={stopSession}
            className="text-muted hover:text-text p-1 text-sm font-bold"
            title="Batal / Tutup kamera"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {error ? (
            <div className="text-center py-10">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button
                type="button"
                onClick={stopSession}
                className="px-6 py-2.5 border border-border rounded-full text-sm hover:bg-bg-secondary transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : isDone ? (
            /* ── Screen: Foto Selesai ── */
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              <h3 className="text-xl font-bold">
                {isMultiMode
                  ? `Semua ${effectiveTotal} foto berhasil diambil!`
                  : `Foto slot #${slotIndex + 1} berhasil diperbarui!`}
              </h3>
              <p className="text-muted text-sm">
                Menyimpan ke dalam editor photobooth...
              </p>
            </div>
          ) : (
            <>
              {/* Camera Preview Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />

                {/* Shutter Flash Animation */}
                <AnimatePresence>
                  {showFlash && (
                    <motion.div
                      initial={{ opacity: 0.9 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white pointer-events-none z-30"
                    />
                  )}
                </AnimatePresence>

                {/* Countdown Overlay */}
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div
                      key={countdown}
                      initial={{ scale: 2.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center bg-black/35 z-20"
                    >
                      <span className="text-white text-8xl font-[family-name:var(--font-heading)] font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                        {countdown}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Slot Aktif */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold z-10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {isMultiMode
                    ? `Mengambil Foto ${Math.min(currentCaptureIndex + 1, effectiveTotal)} dari ${effectiveTotal}`
                    : `Mengambil Foto untuk Slot #${slotIndex + 1}`}
                </div>
              </div>

              {/* Progress Indicator (khusus Mode 1: initial-multi) */}
              {isMultiMode && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-sm font-semibold text-text">
                    Foto {Math.min(currentCaptureIndex + 1, effectiveTotal)} dari {effectiveTotal}
                  </p>
                  <div className="flex gap-2.5 items-center">
                    {Array.from({ length: effectiveTotal }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{
                          backgroundColor: i < currentCaptureIndex ? "#22c55e" : i === currentCaptureIndex ? "#3b82f6" : "#cbd5e1",
                          scale: i === currentCaptureIndex ? 1.25 : 1,
                        }}
                        className="w-3.5 h-3.5 rounded-full border border-black/10 transition-all"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Single Mode Status Note */}
              {!isMultiMode && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-text">
                    Mengganti foto slot #{slotIndex + 1}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Foto lain pada frame akan tetap dipertahankan
                  </p>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <button
                  type="button"
                  onClick={stopSession}
                  className="px-6 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors shadow-md"
                >
                  ■ Batal
                </button>
                <button
                  type="button"
                  onClick={switchCamera}
                  disabled={isCapturing}
                  className="px-5 py-2.5 text-sm border border-border rounded-full hover:bg-bg-secondary transition-colors disabled:opacity-50"
                >
                  Putar Kamera
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
