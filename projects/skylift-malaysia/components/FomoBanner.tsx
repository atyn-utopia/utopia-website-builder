'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function nextTarget(): number {
  // Rolling window: end of current calendar day.
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  if (end.getTime() <= now.getTime()) {
    end.setDate(end.getDate() + 1);
  }
  return end.getTime();
}

export default function FomoBanner() {
  const t = useTranslations('fomoBanner');
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    setTarget(nextTarget());
    const id = setInterval(() => {
      setNow(Date.now());
      setTarget((cur) => (cur && cur - Date.now() <= 0 ? nextTarget() : cur));
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
      <span className="fomo-pill">{t('pill')}</span>
      <span className="fomo-text">{t('label')}</span>
      <span className="fomo-timer" aria-label="Promo countdown">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}
