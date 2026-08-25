"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

/* ── Types ────────────────────────────────── */
export interface PhotoItem {
  id: string;
  src: string;
  cropX: number;
  cropY: number;
  zoom: number;
  rotation: number;
  filter: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

export type LayoutType = "classic" | "grid" | "polaroid" | "film" | "editorial";
export type BgType = "solid" | "gradient";

export interface EditorState {
  photos: PhotoItem[];
  layout: LayoutType;
  frameColor: string;
  borderThickness: number;
  cornerRadius: number;
  innerSpacing: number;
  photoGap: number;
  globalFilter: string;
  bgType: BgType;
  bgColor: string;
  bgGradient: [string, string];
  captionText: string;
  captionFont: string;
  captionSize: number;
  captionAlign: "left" | "center" | "right";
}

type Action =
  | { type: "SET_PHOTOS"; photos: PhotoItem[] }
  | { type: "ADD_PHOTO"; photo: PhotoItem }
  | { type: "REMOVE_PHOTO"; id: string }
  | { type: "UPDATE_PHOTO"; id: string; updates: Partial<PhotoItem> }
  | { type: "SET_LAYOUT"; layout: LayoutType }
  | { type: "SET_FRAME_COLOR"; color: string }
  | { type: "SET_BORDER_THICKNESS"; value: number }
  | { type: "SET_CORNER_RADIUS"; value: number }
  | { type: "SET_INNER_SPACING"; value: number }
  | { type: "SET_PHOTO_GAP"; value: number }
  | { type: "SET_GLOBAL_FILTER"; filter: string }
  | { type: "SET_BG_TYPE"; bgType: BgType }
  | { type: "SET_BG_COLOR"; color: string }
  | { type: "SET_BG_GRADIENT"; gradient: [string, string] }
  | { type: "SET_CAPTION_TEXT"; text: string }
  | { type: "SET_CAPTION_FONT"; font: string }
  | { type: "SET_CAPTION_SIZE"; size: number }
  | { type: "SET_CAPTION_ALIGN"; align: "left" | "center" | "right" }
  | { type: "RESET" };

const initialState: EditorState = {
  photos: [],
  layout: "classic",
  frameColor: "#FFFFFF",
  borderThickness: 16,
  cornerRadius: 8,
  innerSpacing: 12,
  photoGap: 8,
  globalFilter: "none",
  bgType: "solid",
  bgColor: "#FFFFFF",
  bgGradient: ["#FFFFFF", "#D9A7A0"],
  captionText: "",
  captionFont: "Inter",
  captionSize: 14,
  captionAlign: "center",
};

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "SET_PHOTOS": return { ...state, photos: action.photos };
    case "ADD_PHOTO":
      if (state.photos.length >= 6) return state;
      return { ...state, photos: [...state.photos, action.photo] };
    case "REMOVE_PHOTO": {
      const pToRemove = state.photos.find(p => p.id === action.id);
      if (pToRemove && pToRemove.src.startsWith("blob:")) URL.revokeObjectURL(pToRemove.src);
      return { ...state, photos: state.photos.filter((p) => p.id !== action.id) };
    }
    case "UPDATE_PHOTO":
      return { ...state, photos: state.photos.map((p) => p.id === action.id ? { ...p, ...action.updates } : p) };
    case "SET_LAYOUT": return { ...state, layout: action.layout };
    case "SET_FRAME_COLOR": return { ...state, frameColor: action.color };
    case "SET_BORDER_THICKNESS": return { ...state, borderThickness: action.value };
    case "SET_CORNER_RADIUS": return { ...state, cornerRadius: action.value };
    case "SET_INNER_SPACING": return { ...state, innerSpacing: action.value };
    case "SET_PHOTO_GAP": return { ...state, photoGap: action.value };
    case "SET_GLOBAL_FILTER": return { ...state, globalFilter: action.filter };
    case "SET_BG_TYPE": return { ...state, bgType: action.bgType };
    case "SET_BG_COLOR": return { ...state, bgColor: action.color };
    case "SET_BG_GRADIENT": return { ...state, bgGradient: action.gradient };
    case "SET_CAPTION_TEXT": return { ...state, captionText: action.text };
    case "SET_CAPTION_FONT": return { ...state, captionFont: action.font };
    case "SET_CAPTION_SIZE": return { ...state, captionSize: action.size };
    case "SET_CAPTION_ALIGN": return { ...state, captionAlign: action.align };
    case "RESET": {
      state.photos.forEach(p => { if (p.src.startsWith("blob:")) URL.revokeObjectURL(p.src) });
      return initialState;
    }
    default: return state;
  }
}

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}

export function createPhoto(src: string): PhotoItem {
  return {
    id: crypto.randomUUID(),
    src,
    cropX: 0,
    cropY: 0,
    zoom: 1,
    rotation: 0,
    filter: "none",
    brightness: 100,
    contrast: 100,
    saturation: 100,
  };
}
