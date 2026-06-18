"use client";

import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "chapter-1", numeral: "I", label: "Invitation" },
  { id: "chapter-2", numeral: "II", label: "The Evening" },
  { id: "chapter-3", numeral: "III", label: "RSVP" },
];

/**
 * Red-carpet "stanchion" rail down the left margin. Desktop only — the runway
 * concept's side rail fights mobile layout, so it is hidden below lg. Tracks the
 * chapter currently in view via IntersectionObserver and lets you jump to one.
 */
export default function RunwayRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = CHAPTERS.findIndex((c) => c.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-24 flex-col items-center justify-center gap-10 pointer-events-none"
      aria-hidden
    >
      <span className="rail-line h-20" />
      {CHAPTERS.map((c, i) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          data-active={active === i}
          className="rail-dot pointer-events-auto flex flex-col items-center gap-2 no-underline"
        >
          <span className="text-lg">{c.numeral}</span>
          <span
            className="text-[9px] uppercase tracking-[0.22em]"
            style={{ writingMode: "vertical-rl" }}
          >
            {c.label}
          </span>
        </a>
      ))}
      <span className="rail-line h-20" />
    </aside>
  );
}
