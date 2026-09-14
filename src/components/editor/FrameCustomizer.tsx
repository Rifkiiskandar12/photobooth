"use client";

import { useEditor } from "@/stores/editor-store";

const PRESET_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Cream", hex: "#F5F0E8" },
  { name: "Beige", hex: "#E8DFD0" },
  { name: "Brown", hex: "#8B7355" },
  { name: "Pink", hex: "#F4C2C2" },
  { name: "Red", hex: "#C0392B" },
  { name: "Blue", hex: "#5B7FA5" },
  { name: "Green", hex: "#7FA07A" },
  { name: "Lavender", hex: "#C3AED6" },
];

const GRADIENTS: [string, string][] = [
  ["#F1FEC6", "#A882DD"],
  ["#58A6FF", "#FFEDD5"],
  ["#7FA07A", "#F5F0E8"],
  ["#171717", "#333333"],
];

export default function FrameCustomizer() {
  const { state, dispatch } = useEditor();

  return (
    <div className="space-y-6">
      {/* Background type */}
      <div>
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Background Type</h3>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: "SET_BG_TYPE", bgType: "solid" })}
            className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors ${
              state.bgType === "solid" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-text"
            }`}
          >
            Solid Color
          </button>
          <button
            onClick={() => dispatch({ type: "SET_BG_TYPE", bgType: "gradient" })}
            className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors ${
              state.bgType === "gradient" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-text"
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Conditionally render controls */}
      {state.bgType === "solid" ? (
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Frame Color</h3>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => dispatch({ type: "SET_FRAME_COLOR", color: c.hex })}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  state.frameColor === c.hex ? "border-accent scale-110 ring-2 ring-accent/30" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {/* Custom color */}
            <label className="w-8 h-8 rounded-full border-2 border-dashed border-border cursor-pointer hover:border-accent flex items-center justify-center overflow-hidden">
              <span className="text-xs text-muted">+</span>
              <input
                type="color"
                value={state.frameColor}
                onChange={(e) => dispatch({ type: "SET_FRAME_COLOR", color: e.target.value })}
                className="absolute opacity-0 w-0 h-0"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Gradient Palette</h3>
            <div className="flex flex-wrap gap-2.5">
              {GRADIENTS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => dispatch({ type: "SET_BG_GRADIENT", gradient: g })}
                  className={`w-12 h-10 rounded-xl border-2 transition-all hover:scale-105 ${
                    state.bgGradient[0] === g[0] && state.bgGradient[1] === g[1]
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-border"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Custom Gradient</h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div 
                  className="w-8 h-8 rounded-full border border-border shadow-sm overflow-hidden relative"
                  style={{ backgroundColor: state.bgGradient[0] }}
                >
                  <input
                    type="color"
                    value={state.bgGradient[0]}
                    onChange={(e) => dispatch({ type: "SET_BG_GRADIENT", gradient: [e.target.value, state.bgGradient[1]] })}
                    className="absolute opacity-0 w-0 h-0"
                  />
                </div>
                <span className="text-xs text-muted">Color 1</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <div 
                  className="w-8 h-8 rounded-full border border-border shadow-sm overflow-hidden relative"
                  style={{ backgroundColor: state.bgGradient[1] }}
                >
                  <input
                    type="color"
                    value={state.bgGradient[1]}
                    onChange={(e) => dispatch({ type: "SET_BG_GRADIENT", gradient: [state.bgGradient[0], e.target.value] })}
                    className="absolute opacity-0 w-0 h-0"
                  />
                </div>
                <span className="text-xs text-muted">Color 2</span>
              </label>
            </div>
            
            <div className="pt-2">
              <h4 className="text-[10px] font-medium text-muted uppercase mb-2">Direction</h4>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { angle: 0, label: "↑" },
                  { angle: 45, label: "↗" },
                  { angle: 90, label: "→" },
                  { angle: 135, label: "↘" },
                  { angle: 180, label: "↓" },
                  { angle: 225, label: "↙" },
                  { angle: 270, label: "←" },
                  { angle: 315, label: "↖" },
                ].map(({ angle, label }) => (
                  <button
                    key={angle}
                    onClick={() => dispatch({ type: "SET_GRADIENT_ANGLE", angle })}
                    className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-colors ${
                      state.gradientAngle === angle
                        ? "border-accent bg-accent/10 text-accent font-medium"
                        : "border-border text-muted hover:bg-bg-secondary hover:text-text"
                    }`}
                    title={`${angle}°`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliders */}
      <div className="space-y-4">
        <SliderControl
          label="Border Thickness"
          value={state.borderThickness}
          min={4} max={40}
          onChange={(v) => dispatch({ type: "SET_BORDER_THICKNESS", value: v })}
        />
        <SliderControl
          label="Corner Radius"
          value={state.cornerRadius}
          min={0} max={24}
          onChange={(v) => dispatch({ type: "SET_CORNER_RADIUS", value: v })}
        />
        <SliderControl
          label="Inner Spacing"
          value={state.innerSpacing}
          min={0} max={24}
          onChange={(v) => dispatch({ type: "SET_INNER_SPACING", value: v })}
        />
        <SliderControl
          label="Photo Gap"
          value={state.photoGap}
          min={0} max={20}
          onChange={(v) => dispatch({ type: "SET_PHOTO_GAP", value: v })}
        />
      </div>
    </div>
  );
}

function SliderControl({
  label, value, min, max, onChange,
}: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted">{label}</span>
        <span className="text-text font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  );
}
