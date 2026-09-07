"use client";
import { useEditor } from "@/stores/editor-store";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function StickerSelector() {
  const { dispatch } = useEditor();
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text mb-1">Add Stickers</h3>
        <p className="text-xs text-muted mb-4">Click a sticker to add it to your photo.</p>
        
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
                title={`Add sticker ${i + 1}`}
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
