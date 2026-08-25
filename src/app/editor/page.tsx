"use client";

import { EditorProvider } from "@/stores/editor-store";
import EditorLayout from "@/components/editor/EditorLayout";

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
