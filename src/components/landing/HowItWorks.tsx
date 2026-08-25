"use client";

import { motion } from "framer-motion";
import { Camera, Palette, Download } from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    num: "01",
    title: "Take or Upload",
    desc: "Use your camera or upload photos from your device. Up to 6 photos per session.",
  },
  {
    icon: Palette,
    num: "02",
    title: "Customize",
    desc: "Choose a layout, pick your frame color, apply filters, and add a caption.",
  },
  {
    icon: Download,
    num: "03",
    title: "Download",
    desc: "Preview your creation and download it as a high-quality PNG. Done!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">How It Works</p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold">
            Three simple steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white rounded-2xl p-8 border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 group"
            >
              <span className="font-[family-name:var(--font-heading)] text-6xl font-bold text-bg-secondary group-hover:text-accent/20 transition-colors absolute top-4 right-6">
                {step.num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <step.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
