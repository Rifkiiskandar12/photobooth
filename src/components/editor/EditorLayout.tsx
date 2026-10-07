"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEditor } from "@/stores/editor-store";
import FrameLayoutSelector from "./FrameLayoutSelector";
import PhotoInput from "./PhotoInput";
import PhotoReview from "./PhotoReview";
import PhotoCanvas from "./PhotoCanvas";
import FrameCustomizer from "./FrameCustomizer";
import FilterPanel from "./FilterPanel";
import TextEditor from "./TextEditor";
import StickerSelector from "./StickerSelector";
import PreviewModal from "./PreviewModal";

type Tab = "frame" | "filter" | "text" | "sticker";

export default function EditorLayout() {
  const { state, dispatch } = useEditor();
  const [tab, setTab] = useState<Tab>("frame");
  const [showPreview, setShowPreview] = useState(false);

  // Step 1: Layout not selected yet -> Frame Layout Selector
  if (!state.hasSelectedLayout) {
    return <FrameLayoutSelector />;
  }

  // Step 3: Photos input completed and in review mode -> Photo Review
  if (state.isReviewingPhotos && state.photos.length > 0 && !state.hasReviewedPhotos && !state.hasStartedEditing) {
    return <PhotoReview />;
  }

  // Step 2: Photo Input (taking or uploading photos)
  if (!state.hasStartedEditing) {
    return <PhotoInput />;
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "frame", label: "Frame" },
    { key: "filter", label: "Filter" },
    { key: "text", label: "Text" },
    { key: "sticker", label: "Stickers" },
  ];

  const handleBackToPreview = () => {
    dispatch({ type: "SET_HAS_STARTED_EDITING", value: false });
    dispatch({ type: "SET_IS_REVIEWING_PHOTOS", value: true });
    dispatch({ type: "SET_HAS_REVIEWED_PHOTOS", value: false });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToPreview}
            className="flex items-center gap-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-[family-name:var(--font-heading)] text-sm font-semibold">Abadibooth</span>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          Generate Photo
        </button>
      </header>

      {/* Main editor */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Preview area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-bg-secondary/50">
          <PhotoCanvas />
        </div>

        {/* Controls panel */}
        <div className="lg:w-[360px] border-t lg:border-t-0 lg:border-l border-border bg-white flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors relative ${
                  tab === t.key ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">
            {tab === "frame" && <FrameCustomizer />}
            {tab === "filter" && <FilterPanel />}
            {tab === "text" && <TextEditor />}
            {tab === "sticker" && <StickerSelector />}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && <PreviewModal onClose={() => setShowPreview(false)} />}
    </div>
  );
}
