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
            "inset -30px 0 60px rgba(0,0,0,0.55), 20px 0 80px rgba(0,0,0,0.9)",
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
            "inset 30px 0 60px rgba(0,0,0,0.55), -20px 0 80px rgba(0,0,0,0.9)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.7) 30%, rgba(212,175,55,0.7) 70%, rgba(212,175,55,0) 100%)",
          opacity: 1 - progress,
        }}
      />
    </div>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
