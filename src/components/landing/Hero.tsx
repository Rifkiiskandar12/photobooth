"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const STRIP_COLORS = [
  ["#fde2e4", "#fad2cf", "#f7c5c0", "#e8b4b8"],
  ["#d4e4f7", "#b8d4e8", "#a8c8db", "#97bdd0"],
  ["#e8e4d9", "#ddd8ca", "#d2ccbb", "#c7c0ad"],
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-bg-secondary opacity-80" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your photos stay on your device
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            Make memories
            <br />
            <span className="text-accent">look beautiful.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-muted text-lg md:text-xl max-w-md leading-relaxed"
          >
            Create aesthetic photo strips and collages directly from your browser.
            No app download needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <Link
              href="/editor"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-sm"
            >
              Create Your Photo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#templates"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-medium rounded-full hover:bg-bg-secondary hover:scale-[1.02] transition-all duration-200 text-sm"
            >
              Explore Templates
            </a>
          </motion.div>
        </div>

        {/* Floating photo strips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[500px] md:h-[580px] hidden md:flex items-center justify-center"
        >
          {/* Strip 1 */}
          <div className="absolute animate-float strip-shadow rounded-2xl bg-white p-3 w-[140px] rotate-[-6deg] left-[10%] top-[5%]">
            {STRIP_COLORS[0].map((c, i) => (
              <div
                key={i}
                className="w-full aspect-[4/3] rounded-lg mb-2 last:mb-0"
                style={{ backgroundColor: c }}
              />
            ))}
            <p className="text-[8px] text-center text-muted mt-1 font-[family-name:var(--font-heading)]">summer 2026</p>
          </div>

          {/* Strip 2 - 2x2 grid */}
          <div className="absolute animate-float-delayed strip-shadow rounded-2xl bg-black p-3 w-[180px] rotate-[4deg] right-[5%] top-[15%]">
            <div className="grid grid-cols-2 gap-2">
              {STRIP_COLORS[1].map((c, i) => (
                <div
                  key={i}
                  className="w-full aspect-square rounded-lg"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="text-[8px] text-center text-white/60 mt-2 font-[family-name:var(--font-heading)]">best day ever</p>
          </div>

          {/* Strip 3 - polaroid */}
          <div className="absolute animate-float strip-shadow rounded-2xl bg-[#F5F0E8] p-4 pb-8 w-[160px] rotate-[8deg] left-[25%] bottom-[5%]" style={{ animationDelay: "2s" }}>
            <div className="w-full aspect-[4/5] rounded-lg mb-3" style={{ backgroundColor: STRIP_COLORS[2][0] }} />
            <p className="text-[9px] text-center text-muted font-[family-name:var(--font-heading)] italic">memories ✨</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
