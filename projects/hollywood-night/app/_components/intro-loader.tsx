"use client";

import { useEffect, useState } from "react";

// Preloaded before the curtain lifts, so the doors + splash are ready and the
// user never sees the bare background image flash in first.
const ASSETS = [
  "/left-door.png",
  "/right-door.png",
  "/main-background.png",
  "/masthead-dinner.png",
];

export default function IntroLoader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let alive = true;
    const loadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const finish = () => {
      if (alive) setDone(true);
    };
    Promise.all(ASSETS.map(loadOne)).then(finish);
    // Safety: never trap the user behind the loader.
    const safety = setTimeout(finish, 5000);
    return () => {
      alive = false;
      clearTimeout(safety);
    };
  }, []);

  // Unmount shortly after the fade-out completes.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink-black transition-opacity duration-700 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="h-10 w-10 rounded-full border-2 border-gold-500/25 border-t-gold-400 animate-spin" />
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-400">
          Setting the stage…
        </p>
      </div>
    </div>
  );
}
