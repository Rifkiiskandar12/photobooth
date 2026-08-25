"use client";

import { useEditor } from "@/stores/editor-store";
import { FILTERS } from "@/lib/filters";

export default function FilterPanel() {
  const { state, dispatch } = useEditor();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
          Global Preset Filter
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {FILTERS.map((f) => {
            const isSelected = state.globalFilter === f.name;
            return (
              <button
                key={f.name}
                onClick={() => dispatch({ type: "SET_GLOBAL_FILTER", filter: f.name })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent font-medium shadow-xs"
                    : "border-border hover:border-accent/40 text-text"
                }`}
              >
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-[11px] text-muted truncate mt-0.5">
                  {f.name === "none" ? "No filter" : f.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {state.photos.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
            Individual Photo Adjustments
          </h3>
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {state.photos.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl border border-border bg-bg/50 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Photo #{idx + 1}</span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_PHOTO",
                        id: p.id,
                        updates: { brightness: 100, contrast: 100, saturation: 100, zoom: 1, rotation: 0 },
                      })
                    }
                    className="text-[10px] text-muted hover:text-accent underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Brightness</span>
                      <span>{p.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={p.brightness}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PHOTO",
                          id: p.id,
                          updates: { brightness: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 bg-bg-secondary rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Contrast</span>
                      <span>{p.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={150}
                      value={p.contrast}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PHOTO",
                          id: p.id,
                          updates: { contrast: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 bg-bg-secondary rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Saturation</span>
                      <span>{p.saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={p.saturation}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PHOTO",
                          id: p.id,
                          updates: { saturation: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 bg-bg-secondary rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-muted mb-1">
                      <span>Zoom</span>
                      <span>{Math.round(p.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.05}
                      value={p.zoom}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PHOTO",
                          id: p.id,
                          updates: { zoom: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 bg-bg-secondary rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
