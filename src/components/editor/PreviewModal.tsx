"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, X, RefreshCw, Check } from "lucide-react";
import { useEditor } from "@/stores/editor-store";
import { renderCanvas, downloadCanvas } from "@/lib/canvas-renderer";

export default function PreviewModal({ onClose }: { onClose: () => void }) {
  const { state } = useEditor();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    renderCanvas(state)
      .then((cvs) => {
        if (!isMounted) return;
        setCanvasRef(cvs);
        setDataUrl(cvs.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95));
      })
      .catch((err) => {
        console.error("Canvas render error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [state, format]);

  const handleDownload = () => {
    if (!canvasRef) return;
    downloadCanvas(canvasRef, format);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">Your photo is ready ✨</h3>
            <p className="text-xs text-muted">High-resolution export generated client-side</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bg-secondary text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-bg-secondary/40 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-muted">
              <RefreshCw className="w-6 h-6 animate-spin text-accent" />
              <span className="text-xs">Generating your aesthetic photo...</span>
            </div>
          ) : dataUrl ? (
            <img
              src={dataUrl}
              alt="Final Photobooth Preview"
              className="max-h-[50vh] object-contain rounded-xl shadow-lg border border-border"
            />
          ) : (
            <p className="text-xs text-red-500">Failed to render preview.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-white flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Export Format:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("png")}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                  format === "png"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-text"
                }`}
              >
                PNG (Lossless)
              </button>
              <button
                onClick={() => setFormat("jpg")}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                  format === "jpg"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-text"
                }`}
              >
                JPG (Compact)
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-border rounded-full text-sm font-medium hover:bg-bg-secondary transition-colors"
            >
              Edit Again
            </button>
            <button
              onClick={handleDownload}
              disabled={loading || !canvasRef}
              className="btn-primary flex-1 py-3 px-4 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
