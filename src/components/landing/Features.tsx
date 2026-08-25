"use client";

import { motion } from "framer-motion";
import { Camera, LayoutGrid, Wand2, Frame, Type, Shield } from "lucide-react";

const FEATURES = [
  { icon: Camera, title: "Camera Capture", desc: "Take photos directly from your browser with countdown timer" },
  { icon: LayoutGrid, title: "5+ Layouts", desc: "Classic strip, grid, polaroid, film strip, and editorial layouts" },
  { icon: Wand2, title: "Photo Filters", desc: "8 beautiful filters including warm, vintage, film, and B&W" },
  { icon: Frame, title: "Custom Frames", desc: "Choose from 10+ frame colors or pick your own custom color" },
  { icon: Type, title: "Add Captions", desc: "Add text with custom fonts, sizes, and alignment options" },
  { icon: Shield, title: "Privacy First", desc: "All processing happens in your browser. Photos never leave your device" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">Features</p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold">
            Everything you need
          </h2>
          <p className="text-muted mt-4 max-w-lg mx-auto">
            A complete digital photobooth studio, right in your browser.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-border hover:border-accent/30 hover:shadow-sm transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
