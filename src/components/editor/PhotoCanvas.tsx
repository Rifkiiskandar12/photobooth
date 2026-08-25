"use client";

import { useEditor } from "@/stores/editor-store";
import { getLayout, SlotRect } from "@/lib/layouts";
import { getFilterCSS } from "@/lib/filters";

export default function PhotoCanvas() {
  const { state } = useEditor();
  const layout = getLayout(state.layout);
  const gap = state.photoGap / 300;
  const slots = layout.slots(gap);

  const bgStyle =
    state.bgType === "gradient"
      ? { background: `linear-gradient(to bottom, ${state.bgGradient[0]}, ${state.bgGradient[1]})` }
      : { backgroundColor: state.frameColor };

  return (
    <div className="relative">
      <div
        className="relative shadow-2xl transition-all duration-300"
        style={{
          ...bgStyle,
          borderRadius: `${state.cornerRadius}px`,
          padding: `${state.borderThickness}px`,
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
          {layout.hasFilmHoles && (
            <>
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around z-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`l${i}`} className="w-1.5 h-1.5 rounded-full bg-black/20" />
                ))}
              </div>
              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around z-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`r${i}`} className="w-1.5 h-1.5 rounded-full bg-black/20" />
                ))}
              </div>
            </>
          )}

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
        </div>

        {/* Caption */}
        {state.captionText && (
          <div
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              bottom: state.layout === "polaroid" ? `${state.borderThickness * 0.5}px` : "0px",
              height: `${state.borderThickness}px`,
            }}
          >
            <p
              className="px-4 truncate transition-all duration-200"
              style={{
                fontFamily: `'${state.captionFont}', sans-serif`,
                fontSize: `${state.captionSize}px`,
                textAlign: state.captionAlign,
                color: getContrastColor(state.bgType === "gradient" ? state.bgGradient[1] : state.frameColor),
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
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted/40">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

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
