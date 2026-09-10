"use client";
import { useEditor } from "@/stores/editor-store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RotateCw, Trash2 } from "lucide-react";

export default function StickerSelector() {
  const { state, dispatch } = useEditor();
  const [stickers, setStickers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStickers() {
      try {
        const res = await fetch("/api/stickers");
        const data = await res.json();
        if (data.stickers) {
          setStickers(data.stickers);
        }
      } catch (err) {
        console.error("Failed to fetch stickers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStickers();
  }, []);

  const handleAddSticker = (src: string) => {
    dispatch({
      type: "ADD_STICKER",
      sticker: {
        id: crypto.randomUUID(),
        src,
        x: 0.5, // Center
        y: 0.5, // Center
        scale: 1,
        rotation: 0,
      },
    });
  };

  const activeSticker = state.stickers.find((s) => s.id === state.activeStickerId);

  return (
    <div className="space-y-6">
      {/* Active sticker controls */}
      {activeSticker && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-accent uppercase tracking-wider">Stiker Terpilih</h3>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: "SET_ACTIVE_STICKER", id: null })}
                className="px-3 py-1.5 border border-border hover:border-accent text-muted hover:text-accent rounded-lg text-xs font-medium transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => dispatch({ type: "REMOVE_STICKER", id: activeSticker.id })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Hapus
              </button>
            </div>
          </div>

          {/* Scale slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted">Ukuran</span>
              <span className="text-text font-medium">{Math.round((activeSticker.scale || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={Math.round((activeSticker.scale || 1) * 100)}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_STICKER",
                  id: activeSticker.id,
                  updates: { scale: Number(e.target.value) / 100 },
                })
              }
              className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-muted/60 mt-1">
              <span>30%</span>
              <span>300%</span>
            </div>
          </div>

          {/* Rotation slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted">Rotasi</span>
              <span className="text-text font-medium">{Math.round(activeSticker.rotation || 0)}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={Math.round(activeSticker.rotation || 0)}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_STICKER",
                  id: activeSticker.id,
                  updates: { rotation: Number(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-muted/60 mt-1">
              <span>-180°</span>
              <span>0°</span>
              <span>180°</span>
            </div>
          </div>

          {/* Quick rotation buttons */}
          <div className="flex gap-2">
            {[-90, -45, 0, 45, 90].map((deg) => (
              <button
                key={deg}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_STICKER",
                    id: activeSticker.id,
                    updates: { rotation: deg },
                  })
                }
                className="flex-1 py-1.5 text-xs border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                {deg === 0 ? "0°" : `${deg > 0 ? "+" : ""}${deg}°`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticker gallery */}
      <div>
        <h3 className="text-sm font-medium text-text mb-1">Tambah Stiker</h3>
        <p className="text-xs text-muted mb-4">
          {activeSticker
            ? "Klik stiker lain untuk menambahkan ke frame."
            : "Klik stiker untuk menambahkannya. Tap stiker di frame untuk mengatur ukuran & rotasi."}
        </p>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stickers.length === 0 ? (
          <p className="text-xs text-muted text-center py-4 bg-bg-secondary rounded-lg">
            Tidak ada stiker ditemukan di public/stickers/
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {stickers.map((src, i) => (
              <button
                key={i}
                onClick={() => handleAddSticker(src)}
                className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center p-2 hover:bg-border transition-colors group relative overflow-hidden"
                title={`Tambah stiker ${i + 1}`}
              >
                <div className="relative w-full h-full pointer-events-none">
                  <Image
                    src={src}
                    alt={`Sticker ${i + 1}`}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    draggable={false}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
