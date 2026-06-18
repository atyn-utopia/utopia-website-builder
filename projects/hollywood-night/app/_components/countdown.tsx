"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";

const TARGET = new Date(EVENT.startsAt).getTime();

function split(ms: number) {
  return [
    { label: "Days", value: Math.floor(ms / 86_400_000) },
    { label: "Hrs", value: Math.floor((ms % 86_400_000) / 3_600_000) },
    { label: "Mins", value: Math.floor((ms % 3_600_000) / 60_000) },
    { label: "Secs", value: Math.floor((ms % 60_000) / 1000) },
  ];
}

/** Live countdown to the event start. */
export default function Countdown() {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-4">
      {split(diff ?? 0).map((u) => (
        <div
          key={u.label}
          className="glass min-w-[64px] sm:min-w-[82px] px-3 py-3 sm:py-4 text-center"
        >
          <span
            className="block font-mono text-2xl sm:text-4xl text-champagne tabular-nums leading-none"
            suppressHydrationWarning
          >
            {diff === null ? "––" : String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-2 block text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-gold-500">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
