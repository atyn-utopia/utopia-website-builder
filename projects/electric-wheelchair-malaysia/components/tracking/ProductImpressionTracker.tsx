'use client';

import { useEffect, useRef } from 'react';

/**
 * Reports a single `impression` event to webcore (`window.uwc`) the first time
 * its child enters the viewport. Disconnects the observer immediately after,
 * so each card fires at most once per pageview.
 */
export default function ProductImpressionTracker({
  slug,
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  slug: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && typeof window.uwc === 'function') {
            window.uwc('impression', { label: `product-${slug}` });
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
