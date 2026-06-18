"use client";

import { useEffect, useState } from "react";

/** "My Ticket" button — hidden over the first (splash) section, fades in after. */
export default function MyTicketButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-splash");
    if (!hero) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href="/retrieve"
      className={`fixed top-4 right-4 z-40 bg-ink-black/80 backdrop-blur-sm border border-gold-500/60 text-gold-300 px-4 py-2 uppercase tracking-[0.18em] text-[10px] md:text-[11px] font-medium shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)] transition-[opacity,transform,background-color] duration-300 hover:bg-gold-500/10 hover:border-gold-400 hover:-translate-y-0.5 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      ◆ My Ticket
    </a>
  );
}
