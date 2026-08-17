'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal for `.reveal` elements — the same IntersectionObserver the
 * static page ran inline, including its 80ms stagger.
 */
export default function RevealObserver() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'));
    if (nodes.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((el) => el.classList.add('visible'));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          timers.push(setTimeout(() => entry.target.classList.add('visible'), i * 80));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    nodes.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
