"use client";

import { Camera, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-heading)] text-lg font-semibold">AbadiBooth</span>
          </div>
          <p className="text-muted text-sm flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> for beautiful memories
          </p>
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} Photobooth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
