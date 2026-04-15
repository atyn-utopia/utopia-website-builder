"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LoadingScreen({ label }: { label?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const node = (
    <div
      className="z-[90] flex flex-col items-center justify-center bg-ink-black grain"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100dvh",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <span className="absolute inset-0 border-2 border-gold-500/30 rounded-full" />
          <span className="absolute inset-0 border-2 border-transparent border-t-gold-400 rounded-full animate-[spin_1.2s_linear_infinite]" />
          <span className="absolute inset-2 border border-gold-500/60 rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center text-gold-400 text-xs">
            ◆
          </span>
        </div>
        <div className="text-center">
          <p className="font-display italic text-champagne text-xl md:text-2xl">
            Hollywood Night
          </p>
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold-500 mt-2">
            {label ?? "Loading"}
          </p>
        </div>
      </div>
    </div>
  );

  // Render through a portal to document.body so ancestors with `transform`
  // or `will-change: transform` (e.g. the .reveal container) don't become
  // the containing block for our `position: fixed` overlay.
  if (!mounted) return node;
  return createPortal(node, document.body);
}
