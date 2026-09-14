'use client';

import { useEffect } from 'react';

/**
 * Scroll-triggered reveal for every element marked `.ew-reveal`, mounted once
 * per page (see the locale layout).
 *
 * The hidden state is applied by THIS script at runtime, never present at
 * rest in globals.css — so a page with JavaScript disabled, or a browser
 * where this effect never runs, renders every section fully visible with no
 * dependency on the animation at all. This fleet has a documented failure of
 * the opposite pattern: cat-rumah's original scroll-fade (removed in PR #81)
 * parked every section at `opacity: 0` in the stylesheet, so a slow or
 * failed IntersectionObserver left the first paint half-empty. This can't
 * repeat that — the worst case here is simply "no animation", never "no
 * content".
 *
 * An element already inside the viewport at mount is marked visible
 * immediately, with no hidden frame at all, so nothing above the fold (or
 * already scrolled to) ever flashes blank.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('.ew-reveal'));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    for (const el of els) {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (alreadyVisible) {
        el.classList.add('is-in');
        continue;
      }
      el.classList.add('will-reveal');
      io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  return null;
}
