"use client";

import { useEffect, useState } from "react";

export default function DoorOpening() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const compute = () => {
      const vh = window.innerHeight || 1;
      const p = Math.min(Math.max(window.scrollY / vh, 0), 1);
      setProgress(p);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  if (!mounted) return null;

  const eased = easeOutCubic(progress);
  const shift = eased * 101;
  const done = progress >= 0.999;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden
      style={{
        visibility: done ? "hidden" : "visible",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1/2 will-change-transform"
        style={{
          transform: `translateX(-${shift}%)`,
          backgroundImage: "url(/left-door.png)",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          boxShadow:
            "inset -14px 0 28px rgba(0,0,0,0.3), 8px 0 36px rgba(0,0,0,0.45)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-1/2 will-change-transform"
        style={{
          transform: `translateX(${shift}%)`,
          backgroundImage: "url(/right-door.png)",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          boxShadow:
            "inset 14px 0 28px rgba(0,0,0,0.3), -8px 0 36px rgba(0,0,0,0.45)",
        }}
      />
    </div>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
