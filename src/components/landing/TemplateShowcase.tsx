"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const TEMPLATES = [
  {
    name: "Classic Strip",
    desc: "4 photos in a vertical strip",
    colors: ["#fde2e4", "#fad2cf", "#f7c5c0", "#e8b4b8"],
    layout: "classic",
    bg: "#FFFFFF",
  },
  {
    name: "Film",
    desc: "Cinematic film strip style",
    colors: ["#2a2a2a", "#3a3a3a", "#4a4a4a"],
    layout: "film",
    bg: "#1a1a1a",
  },
  {
    name: "2×2 Grid",
    desc: "Classic grid layout",
    colors: ["#d4e4f7", "#b8d4e8", "#a8c8db", "#97bdd0"],
    layout: "grid",
    bg: "#FFFFFF",
  },
  {
    name: "Polaroid",
    desc: "Single iconic shot",
    colors: ["#e8e4d9"],
    layout: "polaroid",
    bg: "#F5F0E8",
  },
  {
    name: "Editorial",
    desc: "Magazine-style layout",
    colors: ["#ddd8ca", "#c7c0ad", "#b8b0a0"],
    layout: "editorial",
    bg: "#FFFFFF",
  },
  {
    name: "Minimal",
    desc: "Clean black & white",
    colors: ["#e0e0e0", "#d0d0d0", "#c0c0c0", "#b0b0b0"],
    layout: "classic",
    bg: "#000000",
  },
];

function TemplateCard({ t, i }: { t: (typeof TEMPLATES)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="group cursor-pointer"
    >
      <Link href={`/editor?layout=${t.layout}&bg=${encodeURIComponent(t.bg)}`}>
        <div className="relative rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5">
          {/* Preview */}
          <div
            className="p-4 flex items-center justify-center min-h-[240px]"
            style={{ backgroundColor: t.bg === "#000000" ? "#0a0a0a" : "#fafaf7" }}
          >
            <div
              className="rounded-xl p-2.5 transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ backgroundColor: t.bg }}
            >
              {t.layout === "classic" && (
                <div className="w-[80px] flex flex-col gap-1.5">
                  {t.colors.map((c, j) => (
                    <div key={j} className="w-full aspect-[4/3] rounded-md" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
              {t.layout === "grid" && (
                <div className="w-[100px] grid grid-cols-2 gap-1.5">
                  {t.colors.map((c, j) => (
                    <div key={j} className="w-full aspect-square rounded-md" style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
              {t.layout === "polaroid" && (
                <div className="w-[90px] pb-4">
                  <div className="w-full aspect-[4/5] rounded-md" style={{ backgroundColor: t.colors[0] }} />
                </div>
              )}
              {t.layout === "film" && (
                <div className="w-[80px] flex flex-col gap-1.5 relative">
                  {t.colors.map((c, j) => (
                    <div key={j} className="w-full aspect-[16/10] rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                  {/* Film holes */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-full bg-black/30 -ml-0.5" />
                    ))}
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-full bg-black/30 -mr-0.5" />
                    ))}
                  </div>
                </div>
              )}
              {t.layout === "editorial" && (
                <div className="w-[100px] flex flex-col gap-1.5">
                  <div className="w-full aspect-[16/9] rounded-md" style={{ backgroundColor: t.colors[0] }} />
                  <div className="flex gap-1.5">
                    <div className="flex-1 aspect-square rounded-md" style={{ backgroundColor: t.colors[1] }} />
                    <div className="flex-1 aspect-square rounded-md" style={{ backgroundColor: t.colors[2] }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 py-3 border-t border-border bg-white">
            <p className="font-medium text-sm">{t.name}</p>
            <p className="text-xs text-muted mt-0.5">{t.desc}</p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-primary text-white text-xs font-medium rounded-full">
              Use Template
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TemplateShowcase() {
  return (
    <section id="templates" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">Templates</p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold">
            Choose Your Mood
          </h2>
          <p className="text-muted mt-4 max-w-md mx-auto">
            Pick a template that matches your vibe. Customize everything after.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
