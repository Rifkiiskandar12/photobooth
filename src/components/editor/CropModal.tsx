"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface CropValues {
  cropX: number;
  cropY: number;
  zoom: number;
  rotation: number;
}

export function CropModal({
  photo,
  onSave,
  onClose,
}: {
  photo: { src: string; cropX: number; cropY: number; zoom: number; rotation: number };
  onSave: (values: CropValues) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(photo.zoom ?? 1);
  const [cropX, setCropX] = useState(photo.cropX ?? 0);
  const [cropY, setCropY] = useState(photo.cropY ?? 0);
  const [rotation, setRotation] = useState(photo.rotation ?? 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; cropX: number; cropY: number } | null>(null);

  /* ── Pan handlers ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY, cropX, cropY };
  }, [cropX, cropY]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStartRef.current.x) / rect.width;
    const dy = (e.clientY - dragStartRef.current.y) / rect.height;

    // Clamp so photo can't be dragged out of frame
    const maxOffset = Math.max(0, (zoom - 1) / (2 * zoom));
    const newX = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.cropX + dx));
    const newY = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.cropY + dy));
    setCropX(newX);
    setCropY(newY);
  }, [zoom]);

  const onPointerUp = useCallback(() => {
    dragStartRef.current = null;
  }, []);

  /* ── Zoom helpers ── */
  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(1, Math.min(3, newZoom));
    setZoom(clamped);
    // Re-clamp crop offsets to stay within new zoom bounds
    const maxOffset = Math.max(0, (clamped - 1) / (2 * clamped));
    setCropX((x) => Math.max(-maxOffset, Math.min(maxOffset, x)));
    setCropY((y) => Math.max(-maxOffset, Math.min(maxOffset, y)));
  };

  const reset = () => {
    setZoom(1);
    setCropX(0);
    setCropY(0);
    setRotation(0);
  };

  const handleSave = () => {
    onSave({ cropX, cropY, zoom, rotation });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-bg rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-lg">Sesuaikan Foto</h2>
          <button onClick={onClose} className="text-muted hover:text-text p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview area */}
        <div className="p-6 flex flex-col gap-5">
          {/* Cropped preview */}
          <div
            ref={containerRef}
            className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black cursor-grab active:cursor-grabbing select-none border border-border"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt="crop preview"
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${cropX * 100}%, ${cropY * 100}%) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            />
            {/* Crosshair guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
            </div>
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/60 pointer-events-none">
              Geser foto untuk mengatur posisi
            </p>
          </div>

          {/* Zoom control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleZoomChange(zoom - 0.1)}
              className="p-2 rounded-full border border-border hover:bg-bg-secondary transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={100}
              max={300}
              step={5}
              value={Math.round(zoom * 100)}
              onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
              className="flex-1 accent-accent"
            />
            <button
              onClick={() => handleZoomChange(zoom + 0.1)}
              className="p-2 rounded-full border border-border hover:bg-bg-secondary transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Rotation control */}
          <div className="flex items-center gap-3">
            <RotateCw className="w-4 h-4 text-muted flex-shrink-0" />
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 accent-accent"
            />
            <span className="text-xs text-muted w-10 text-right">{rotation}°</span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm text-muted hover:text-text border border-border rounded-full transition-colors"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm border border-border rounded-full hover:bg-bg-secondary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
