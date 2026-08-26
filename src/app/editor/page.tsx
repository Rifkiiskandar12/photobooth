"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { EditorProvider, LayoutType } from "@/stores/editor-store";
import EditorLayout from "@/components/editor/EditorLayout";

const VALID_LAYOUTS: LayoutType[] = ["classic", "grid", "polaroid", "film", "editorial"];

function EditorContent() {
  const params = useSearchParams();
  const layoutParam = params.get("layout");
  const bgParam = params.get("bg");

  const initialLayout = VALID_LAYOUTS.includes(layoutParam as LayoutType)
    ? (layoutParam as LayoutType)
    : undefined;

  return (
    <EditorProvider initialLayout={initialLayout} initialBg={bgParam || undefined}>
      <EditorLayout />
    </EditorProvider>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorContent />
    </Suspense>
  );
}
