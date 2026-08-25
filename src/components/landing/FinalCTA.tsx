"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to make a memory?
          </h2>
          <p className="text-muted text-lg max-w-md mx-auto mb-10">
            Start creating beautiful photo strips and collages in under 3 minutes.
          </p>
          <Link
            href="/editor"
            className="btn-primary inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-base"
          >
            Create Your Photo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
