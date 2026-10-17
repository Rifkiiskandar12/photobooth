"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEditor, LayoutType } from "@/stores/editor-store";
import { getAllLayouts, LayoutDef } from "@/lib/layouts";

function LayoutVisualPreview({ name }: { name: string }) {
  switch (name) {
    case "classic":
      return (
        <div className="w-12 h-28 bg-white border border-border shadow-sm rounded-md p-1.5 flex flex-col gap-1 justify-between">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full flex-1 rounded-[2px] bg-muted/20 border border-border/40" />
          ))}
        </div>
      );
    case "grid":
      return (
        <div className="w-20 h-20 bg-white border border-border shadow-sm rounded-md p-1.5 grid grid-cols-2 gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-[2px] bg-muted/20 border border-border/40" />
          ))}
        </div>
      );
    case "polaroid":
      return (
        <div className="w-20 h-24 bg-white border border-border shadow-sm rounded-md p-1.5 pb-4 flex flex-col">
          <div className="w-full flex-1 rounded-[2px] bg-muted/20 border border-border/40" />
        </div>
      );
    case "film":
      return (
        <div className="w-14 h-28 bg-neutral-900 border border-neutral-700 shadow-sm rounded-md py-1.5 px-2 relative flex flex-col gap-1 justify-between">
          {/* Film perforations */}
          <div className="absolute left-0.5 top-2 bottom-2 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1.5 rounded-full bg-white/40" />
            ))}
          </div>
          <div className="absolute right-0.5 top-2 bottom-2 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1.5 rounded-full bg-white/40" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full flex-1 rounded-[2px] bg-white/20 border border-white/20" />
          ))}
        </div>
      );
    case "editorial":
      return (
        <div className="w-20 h-26 bg-white border border-border shadow-sm rounded-md p-1.5 flex flex-col gap-1">
          <div className="w-full h-12 rounded-[2px] bg-muted/20 border border-border/40" />
          <div className="flex gap-1 flex-1">
            <div className="flex-1 h-9 rounded-[2px] bg-muted/20 border border-border/40" />
            <div className="flex-1 h-9 rounded-[2px] bg-muted/20 border border-border/40" />
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function FrameLayoutSelector() {
  const { state, dispatch } = useEditor();
  const layouts = getAllLayouts();

  const handleSelect = (layout: LayoutDef) => {
    dispatch({ type: "SET_LAYOUT", layout: layout.name as LayoutType });
    dispatch({ type: "SET_HAS_SELECTED_LAYOUT", value: true });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-muted hover:text-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="max-w-4xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 3</span>
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Choose Your Frame Layout
            </h1>
            <p className="text-muted text-sm md:text-base max-w-md mx-auto">
              Select how you want your memories arranged before taking or uploading photos
            </p>
          </motion.div>

          {/* Layout Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, staggerChildren: 0.08 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5"
          >
            {layouts.map((layout, idx) => {
              const isSelected = state.layout === layout.name;
              return (
                <motion.button
                  key={layout.name}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(layout)}
                  className={`group relative flex flex-col items-center justify-between p-4 md:p-5 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  {/* Badge */}
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full mb-3 ${
                      isSelected
                        ? "bg-accent/15 text-accent"
                        : "bg-bg-secondary text-muted group-hover:text-text"
                    }`}
                  >
                    {layout.photoCount} {layout.photoCount === 1 ? "photo" : "photos"}
                  </span>

                  {/* Frame Visual Preview */}
                  <div className="w-full flex-1 flex items-center justify-center min-h-[120px] mb-4">
                    <LayoutVisualPreview name={layout.name} />
                  </div>

                  {/* Card Title */}
                  <div className="w-full text-center">
                    <h3 className="font-semibold text-sm text-text group-hover:text-accent transition-colors">
                      {layout.label}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
