'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  slug: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function ProductImpressionTracker({
  slug,
  children,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (firedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            if (window.uwc) {
              window.uwc('impression', { label: `product-${slug}` });
            }
            firedRef.current = true;
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return (
    <div ref={ref} data-product-slug={slug} className={className} style={style}>
      {children}
    </div>
  );
}
