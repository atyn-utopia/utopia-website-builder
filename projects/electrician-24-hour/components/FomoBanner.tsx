'use client';

import { useEffect, useState } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function nextTarget(): number {
  // Rolling window: next end-of-day midnight.
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  if (end.getTime() <= now.getTime()) {
    end.setDate(end.getDate() + 1);
  }
  return end.getTime();
}

export default function FomoBanner({ text }: { text: string }) {
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    setTarget(nextTarget());
    const id = setInterval(() => {
      setNow(Date.now());
      setTarget((t) => (t && t - Date.now() <= 0 ? nextTarget() : t));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  let h = 0,
    m = 0,
    s = 0;
  if (target) {
    const diff = Math.max(0, target - now);
    const total = Math.floor(diff / 1000);
    h = Math.floor(total / 3600);
    m = Math.floor((total % 3600) / 60);
    s = total % 60;
  }

  return (
    <div className="fomo-bar" role="status" aria-live="polite">
      <span className="fomo-text">{text}</span>
      <span className="fomo-sep" aria-hidden="true">·</span>
      <span className="fomo-timer" aria-label="Promo ends in">
        ⏱ <strong>{pad(h)}:{pad(m)}:{pad(s)}</strong>
      </span>
    </div>
  );
}
