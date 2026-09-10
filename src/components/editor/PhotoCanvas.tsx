"use client";

import { useEditor } from "@/stores/editor-store";
import { getLayout, SlotRect } from "@/lib/layouts";
import { getFilterCSS } from "@/lib/filters";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import { useRef, useCallback, useEffect } from "react";
import { RotateCw, Trash2, Maximize2 } from "lucide-react";

export default function PhotoCanvas() {
  const { state, dispatch } = useEditor();
  const layout = getLayout(state.layout);
  const gap = state.photoGap / 300;
  const slots = layout.slots(gap);
  const containerRef = useRef<HTMLDivElement>(null);

  const bgStyle =
    state.bgType === "gradient"
      ? { background: `linear-gradient(to bottom, ${state.bgGradient[0]}, ${state.bgGradient[1]})` }
      : { backgroundColor: state.frameColor };

  const isPolaroid = state.layout === "polaroid";
  const captionAreaHeight = state.captionText && !isPolaroid
    ? Math.max(state.borderThickness, state.captionSize + 14)
    : state.borderThickness;

  // Resolve caption color
  const captionColor = state.captionColor === "auto"
    ? getContrastColor(state.bgType === "gradient" ? state.bgGradient[1] : state.frameColor)
    : state.captionColor;

  return (
    <div className="relative">
      <div
        className="relative shadow-2xl transition-all duration-300"
        style={{
          ...bgStyle,
          borderRadius: `${state.cornerRadius}px`,
          paddingTop: `${state.borderThickness}px`,
          paddingLeft: `${state.borderThickness}px`,
          paddingRight: `${state.borderThickness}px`,
          paddingBottom: `${captionAreaHeight}px`,
          width: `${280 * (layout.aspect < 0.6 ? 0.85 : 1)}px`,
          maxWidth: "90vw",
        }}
      >
        <div
          className="relative"
          style={{
            aspectRatio: `${layout.aspect}`,
            padding: `${state.innerSpacing}px`,
          }}
        >
          {/* Film holes */}
          {layout.hasFilmHoles && (() => {
            const frameColorForHoles = state.bgType === "gradient" ? state.bgGradient[0] : state.frameColor;
            const holeColorClass = getContrastColor(frameColorForHoles) === "#171717" ? "bg-black/20" : "bg-white/20";
            return (
              <>
                <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around z-10">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`l${i}`} className={`w-1.5 h-1.5 rounded-full ${holeColorClass}`} />
                  ))}
                </div>
                <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around z-10">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`r${i}`} className={`w-1.5 h-1.5 rounded-full ${holeColorClass}`} />
                  ))}
                </div>
              </>
            );
          })()}

          {/* Photo slots */}
          {slots.map((slot, i) => (
            <PhotoSlot
              key={i}
              slot={slot}
              photo={state.photos[i]}
              globalFilter={state.globalFilter}
              cornerRadius={Math.max(0, state.cornerRadius - 4)}
            />
          ))}

          {/* Stickers layer - allowed to overflow */}
          <div
            ref={containerRef}
            className="absolute inset-0 z-20"
            onClick={(e) => {
              // Deselect sticker if clicking canvas background
              if (e.target === e.currentTarget) {
                dispatch({ type: "SET_ACTIVE_STICKER", id: null });
              }
            }}
          >
            {state.stickers.map((sticker) => (
              <DraggableSticker
                key={sticker.id}
                sticker={sticker}
                containerRef={containerRef}
                isActive={state.activeStickerId === sticker.id}
              />
            ))}
          </div>
        </div>

        {/* Caption */}
        {state.captionText && (
          <div
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none select-none"
            style={isPolaroid
              ? { bottom: `${state.borderThickness}px`, height: '22%' }
              : { bottom: 0, height: `${captionAreaHeight}px` }
            }
          >
            <p
              className="px-4 truncate transition-all duration-200"
              style={{
                fontFamily: `'${state.captionFont}', sans-serif`,
                fontSize: `${state.captionSize}px`,
                textAlign: state.captionAlign,
                color: captionColor,
                width: "100%",
              }}
            >
              {state.captionText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Photo Slot ───────────────────────────── */
function PhotoSlot({
  slot,
  photo,
  globalFilter,
  cornerRadius,
}: {
  slot: SlotRect;
  photo?: import("@/stores/editor-store").PhotoItem;
  globalFilter: string;
  cornerRadius: number;
}) {
  const filterCSS = photo?.filter && photo.filter !== "none"
    ? getFilterCSS(photo.filter)
    : globalFilter !== "none"
      ? getFilterCSS(globalFilter)
      : "none";

  const adjustments = [];
  if (photo) {
    if (photo.brightness !== 100) adjustments.push(`brightness(${photo.brightness / 100})`);
    if (photo.contrast !== 100) adjustments.push(`contrast(${photo.contrast / 100})`);
    if (photo.saturation !== 100) adjustments.push(`saturate(${photo.saturation / 100})`);
  }
  const fullFilter = [filterCSS !== "none" ? filterCSS : "", ...adjustments].filter(Boolean).join(" ") || "none";

  return (
    <div
      className="absolute overflow-hidden bg-bg-secondary transition-all duration-200"
      style={{
        left: `${slot.x * 100}%`,
        top: `${slot.y * 100}%`,
        width: `${slot.w * 100}%`,
        height: `${slot.h * 100}%`,
        borderRadius: `${cornerRadius}px`,
      }}
    >
      {photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt=""
            className="w-full h-full object-cover transition-all duration-200"
            style={{
              filter: fullFilter,
              transform: `scale(${photo.zoom}) translate(${photo.cropX * 100}%, ${photo.cropY * 100}%) rotate(${photo.rotation}deg)`,
            }}
            draggable={false}
          />
        </>
      ) : (
        /* Empty slot: simple placeholder */
        <div className="w-full h-full flex items-center justify-center text-muted/30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── Draggable Sticker ────────────────────── */
function DraggableSticker({
  sticker,
  containerRef,
  isActive,
}: {
  sticker: import("@/stores/editor-store").StickerItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
}) {
  const { state, dispatch } = useEditor();
  const motionX = useMotionValue("-50%");
  const motionY = useMotionValue("-50%");
  const isResizing = useRef(false);
  const isRotating = useRef(false);
  const startScale = useRef(1);
  const startDist = useRef(0);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const border = state.borderThickness;
    const isPolaroid = state.layout === "polaroid";
    const captionH = state.captionText && !isPolaroid
      ? Math.max(border, state.captionSize + 14)
      : border;
    
    const BLEED = 40;
    const stickerSize = 80 * (sticker.scale || 1);
    const rad = (sticker.rotation || 0) * Math.PI / 180;
    const trigSum = Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad));
    const halfBox = (stickerSize * trigSum) / 2;

    const minPxX = -border - BLEED + halfBox;
    const maxPxX = rect.width + border + BLEED - halfBox;
    const minPxY = -border - BLEED + halfBox;
    const maxPxY = rect.height + captionH + BLEED - halfBox;

    const dx = info.offset.x / rect.width;
    const dy = info.offset.y / rect.height;
    const newX = sticker.x + dx;
    const newY = sticker.y + dy;

    const minX = minPxX / rect.width;
    const maxX = maxPxX / rect.width;
    const minY = minPxY / rect.height;
    const maxY = maxPxY / rect.height;

    const clampedX = maxX >= minX ? Math.max(minX, Math.min(maxX, newX)) : 0.5;
    const clampedY = maxY >= minY ? Math.max(minY, Math.min(maxY, newY)) : 0.5;

    dispatch({
      type: "UPDATE_STICKER",
      id: sticker.id,
      updates: {
        x: clampedX,
        y: clampedY,
      },
    });

    motionX.set("-50%");
    motionY.set("-50%");
  };

  const handleRemove = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    dispatch({ type: "REMOVE_STICKER", id: sticker.id });
  };

  const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    dispatch({ type: "SET_ACTIVE_STICKER", id: sticker.id });
  };

  // Resize handle: drag away from center to enlarge
  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + sticker.x * rect.width;
    const cy = rect.top + sticker.y * rect.height;

    const border = state.borderThickness;
    const isPolaroid = state.layout === "polaroid";
    const captionH = state.captionText && !isPolaroid
      ? Math.max(border, state.captionSize + 14)
      : border;
    const BLEED = 40;

    const pxX = sticker.x * rect.width;
    const pxY = sticker.y * rect.height;

    const distLeft = pxX - (-border - BLEED);
    const distRight = (rect.width + border + BLEED) - pxX;
    const distTop = pxY - (-border - BLEED);
    const distBottom = (rect.height + captionH + BLEED) - pxY;

    const maxHalfBox = Math.max(0, Math.min(distLeft, distRight, distTop, distBottom));
    const rad = (sticker.rotation || 0) * Math.PI / 180;
    const trigSum = Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad));
    
    // halfBox = 40 * scale * trigSum => maxScale = maxHalfBox / (40 * trigSum)
    const finalMaxScale = Math.min(4, maxHalfBox / (40 * Math.max(0.1, trigSum)));

    isResizing.current = true;
    startScale.current = sticker.scale || 1;
    startDist.current = Math.hypot(e.clientX - cx, e.clientY - cy);

    const onMove = (me: PointerEvent) => {
      const currentDist = Math.hypot(me.clientX - cx, me.clientY - cy);
      const ratio = currentDist / Math.max(1, startDist.current);
      const newScale = Math.max(0.3, Math.min(finalMaxScale, startScale.current * ratio));
      dispatch({ type: "UPDATE_STICKER", id: sticker.id, updates: { scale: newScale } });
    };
    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [dispatch, sticker.id, sticker.scale, sticker.x, sticker.y, sticker.rotation, state, containerRef]);

  // Rotation handle
  const handleRotateStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + sticker.x * rect.width;
    const cy = rect.top + sticker.y * rect.height;
    
    isRotating.current = true;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    const startRotation = sticker.rotation || 0;

    const border = state.borderThickness;
    const isPolaroid = state.layout === "polaroid";
    const captionH = state.captionText && !isPolaroid
      ? Math.max(border, state.captionSize + 14)
      : border;
    const BLEED = 40;

    const onMove = (me: PointerEvent) => {
      const angle = Math.atan2(me.clientY - cy, me.clientX - cx) * (180 / Math.PI);
      const delta = angle - startAngle;
      const newRotation = startRotation + delta;

      // Ensure rotation doesn't push bounds out
      const rad = newRotation * Math.PI / 180;
      const trigSum = Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad));
      const halfBox = 40 * (sticker.scale || 1) * trigSum;

      const minPxX = -border - BLEED + halfBox;
      const maxPxX = rect.width + border + BLEED - halfBox;
      const minPxY = -border - BLEED + halfBox;
      const maxPxY = rect.height + captionH + BLEED - halfBox;

      const minX = minPxX / rect.width;
      const maxX = maxPxX / rect.width;
      const minY = minPxY / rect.height;
      const maxY = maxPxY / rect.height;

      const clampedX = maxX >= minX ? Math.max(minX, Math.min(maxX, sticker.x)) : 0.5;
      const clampedY = maxY >= minY ? Math.max(minY, Math.min(maxY, sticker.y)) : 0.5;

      dispatch({ 
        type: "UPDATE_STICKER", 
        id: sticker.id, 
        updates: { rotation: newRotation, x: clampedX, y: clampedY } 
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [dispatch, sticker.id, sticker.x, sticker.y, sticker.scale, sticker.rotation, state, containerRef]);

  const stickerSize = 80 * (sticker.scale || 1);
  const rotation = sticker.rotation || 0;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onPointerDown={handleSelect}
      style={{
        position: "absolute",
        left: `${sticker.x * 100}%`,
        top: `${sticker.y * 100}%`,
        x: motionX,
        y: motionY,
        cursor: "grab",
        touchAction: "none",
        width: `${stickerSize}px`,
        height: `${stickerSize}px`,
      }}
      whileDrag={{ cursor: "grabbing", scale: 1.02 }}
      className="pointer-events-auto"
    >
      {/* Inner rotation wrapper — keeps rotation separate from framer-motion translate */}
      <div
        style={{ transform: `rotate(${rotation}deg)`, width: "100%", height: "100%", position: "relative" }}
      >
        {/* Sticker image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sticker.src}
          alt="sticker"
          className="w-full h-full object-contain drop-shadow-md pointer-events-none max-w-none select-none"
          draggable={false}
        />

        {/* Selection border */}
        {isActive && (
          <div className="absolute inset-0 border-2 border-accent rounded-sm pointer-events-none" />
        )}
      </div>

      {/* Controls — outside rotation wrapper so they stay aligned with viewport */}
      {isActive && (
        <>
          {/* Delete button — large touch target, top-right */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={handleRemove}
            onTouchEnd={(e) => { e.preventDefault(); handleRemove(e); }}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg z-30 hover:bg-red-600 transition-colors"
            style={{ touchAction: "none" }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Resize handle — bottom-right */}
          <div
            onPointerDown={handleResizeStart}
            className="absolute -bottom-3 -right-3 w-7 h-7 bg-white border-2 border-accent rounded-full flex items-center justify-center cursor-se-resize z-30 shadow-lg"
            style={{ touchAction: "none" }}
          >
            <Maximize2 className="w-3 h-3 text-accent" />
          </div>

          {/* Rotation handle — top-left */}
          <div
            onPointerDown={handleRotateStart}
            className="absolute -top-3 -left-3 w-7 h-7 bg-white border-2 border-accent rounded-full flex items-center justify-center cursor-grab z-30 shadow-lg"
            style={{ touchAction: "none" }}
          >
            <RotateCw className="w-3 h-3 text-accent" />
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ── Helpers ───────────────────────────────── */
function getContrastColor(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#171717" : "#FAFAF7";
  } catch {
    return "#171717";
  }
}
