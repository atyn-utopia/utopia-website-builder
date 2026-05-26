'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    uwc?: (eventType: string, options?: { label?: string }) => void;
  }
}

/**
 * Drop this inside a product card. On client-side mount it walks up to the
 * nearest enclosing block and observes it with IntersectionObserver. When the
 * card scrolls into view, fires uwc('impression', { label: 'product-<slug>' })
 * once and unobserves.
 */
export default function ProductImpressionTracker({ slug }: { slug: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (typeof window.uwc === 'function') {
              window.uwc('impression', { label: `product-${slug}` });
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return <span ref={ref} aria-hidden="true" style={{ display: 'none' }} />;
}
