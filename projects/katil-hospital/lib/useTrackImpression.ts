'use client';

import { useEffect, useRef } from 'react';

export function useTrackImpression<T extends HTMLElement>(
  slug: string,
  prefix: 'product' | 'blog' | 'section' = 'product',
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && typeof window.uwc === 'function') {
            window.uwc('impression', { label: `${prefix}-${slug}` });
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug, prefix]);

  return ref;
}
