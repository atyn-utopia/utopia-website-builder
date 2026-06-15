'use client';

import { useEffect, useRef, useState } from 'react';

// Animated count-up number. Starts when it scrolls into view (so it runs the
// first time the visitor lands on / reaches the hero). Animates opacity-free,
// just the displayed value — cheap and smooth.
export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setN(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
        else setN(value);
      };
      requestAnimationFrame(tick);
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(value); return; }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) run(); }),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{prefix}{n.toLocaleString('en-US')}{suffix}</span>;
}
