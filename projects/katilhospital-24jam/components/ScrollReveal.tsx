'use client';

import { useEffect } from 'react';

// Fades + lifts `.kh-reveal` elements as they scroll into view.
//
// The page is fully visible without JS: the hidden starting state only applies
// once <html> has `reveal-ready`. Before adding that class, everything already
// on screen is marked `is-in`, so the first viewport never blinks out and back.
// Reduced-motion users get no animation (see .kh-reveal in globals.css).
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>('.kh-reveal'));
    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('is-in');
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    items.filter((el) => !el.classList.contains('is-in')).forEach((el) => io.observe(el));
    root.classList.add('reveal-ready');

    return () => {
      io.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
